import {clearCanvasButtonCallbacks, createCanvasButton, handleCanvasButtonClick} from './CanvasButton';
import {dispatch} from './codeMessageHandler';
import diff from './utilDiff';
import {genVariantNodeName, getVariantPropsFromName} from './utilVariant';
import {ComponentVariantNode} from './ComponentVariantNode';
import {getParentComponent} from './helper';

/**
 * 创建Variant的Row的标题文字
 */
async function createVariantRowDescription(
    parentFrame: FrameNode,
    title: string,
    subTitle: string
): Promise<GroupNode> {
    const titleText = figma.createText();
    const subTitleText = figma.createText();
    await Promise.all([
        figma.loadFontAsync({family: 'Inter', style: 'Medium'}),
        figma.loadFontAsync({family: 'Inter', style: 'Regular'}),
    ]);
    titleText.fontName = {family: 'Inter', style: 'Medium'};
    titleText.characters = title;
    titleText.fontSize = 13;
    titleText.textAlignHorizontal = 'RIGHT';
    titleText.constraints = {
        horizontal: 'MAX',
        vertical: 'MIN',
    };
    subTitleText.fontName = {family: 'Inter', style: 'Regular'};
    subTitleText.characters = subTitle;
    subTitleText.fontSize = 9;
    subTitleText.textAlignHorizontal = 'RIGHT';
    subTitleText.constraints = {
        horizontal: 'MAX',
        vertical: 'MIN',
    };
    const group = figma.group([titleText, subTitleText], parentFrame);
    subTitleText.y = titleText.y + titleText.height;
    titleText.x = subTitleText.x + subTitleText.width - titleText.width;

    group.name = title + ' Description';

    return group;
}

/**
 * ParametricComponentSet 会话
 * 表示用户正在操作的 ParametricComponentSet
 */
export class ParametricComponentSetSession {
    readonly rootNode: ComponentSetNode;
    data: ComponentSetPluginData;
    runtimeRowButtons: string[] = []; // 运行时的row的右侧添加按钮ID，index为row的index
    runtimeAddVariantButton: string; // 运行时的底部添加Variant分类的按钮ID
    runtimeColumn: RuntimeVariantColumn[] = [];
    runtimeVariantComponent: {[id: string]: ComponentVariantNode} = {}; // 运行时将 VariantComponent 缓存至内存中
    padding: number = 32;
    childSelection: SceneNode;

    constructor(rootNode: ComponentSetNode) {
        this.rootNode = rootNode;
        const json = rootNode.getPluginData('data');
        this.data = json
            ? JSON.parse(json)
            : {
                  rows: [],
              };
        this.init(); // utilsFrame的创建，初始数据的创建
    }

    init() {
        console.log('init');
        // 组建集样式
        this.rootNode.effects = [
            {
                type: 'INNER_SHADOW',
                color: {r: 0.5921568870544434, g: 0.27843138575553894, b: 1, a: 1},
                offset: {x: 0, y: 6},
                radius: 0,
                spread: 0,
                visible: !0,
                blendMode: 'NORMAL',
            },
        ];
        this.rootNode.fills = [
            {type: 'SOLID', visible: !0, opacity: 1, blendMode: 'MULTIPLY', color: {r: 1, g: 1, b: 1}},
        ];
        // 将所有子组件对象实例化到内存
        for (let child of this.rootNode.children) {
            this.runtimeVariantComponent[child.id] = new ComponentVariantNode(this, child.id);
        }

        // 生成运行时操作按钮
        for (let i = 0; i < this.data.rows.length; i++) {
            this.createRowRuntimeButton(i);
        }
        // 生成运行时添加Variant按钮
        this.createAddVariantRuntimeButton();

        this.refreshRuntimeColumn();
        this.render();
    }

    /**
     * 创建运行时Row右侧按钮
     * @param rowIndex row的index
     */
    createRowRuntimeButton(rowIndex: number) {
        let buttonFrame = null;
        if (this.data.rows[rowIndex].type === 'Base&Interaction') {
            buttonFrame = createCanvasButton('+ Interaction', () => {
                console.log('Click button: + interaction ' + this.data.rows[rowIndex].name);
            });
        } else if (this.data.rows[rowIndex].type === 'Selection') {
            buttonFrame = createCanvasButton('+ Option', () => {
                const row = this.data.rows[rowIndex];
                console.log('Click button: + Selection ' + row.name);
                const clone = this.cloneBaseVariantComponent();
                this.rootNode.appendChild(clone);
                const variantNode = this.getComponentVariantNode(clone.id);
                variantNode.data.variantRow = row.name;
                variantNode.data.variantRowData = 'New Selection';
                this.data.rows[rowIndex].nodesId.push(clone.id);
                variantNode.setVariantProp(row.name, 'unset');
                variantNode.updateVariantName();
                this.save();
                this.refreshRuntimeColumn();
                this.render();
                dispatch('addOption');
                figma.currentPage.selection = [clone];
            });
        }
        if (buttonFrame) {
            buttonFrame.setPluginData('parametricComponentSetID', this.rootNode.id);
            this.getUtilsFrame().appendChild(buttonFrame);
            this.runtimeRowButtons[rowIndex] = buttonFrame.id;
        }
    }

    /**
     * 创建运行时 添加Variant 按钮
     */
    createAddVariantRuntimeButton() {
        const addVariantButton = createCanvasButton('+ Variant', () => {
            dispatch('addVariant');
        });
        addVariantButton.setPluginData('parametricComponentSetID', this.rootNode.id);
        this.runtimeAddVariantButton = addVariantButton.id;
        this.getUtilsFrame().appendChild(addVariantButton);
    }

    /**
     * 直接用原生clone似乎会出错，只能手动clone了
     */
    cloneBaseVariantComponent(): ComponentNode {
        const node = figma.createComponent();
        const base = this.getBaseVariantComponent();
        for (let child of base.children) {
            node.appendChild(child.clone());
        }
        const dif = diff(base, node);
        for (let difKey in dif) {
            if (difKey !== 'children' && dif[difKey]['@left']) {
                node[difKey] = dif[difKey]['@left'];
            }
        }
        node.resize(base.width, base.height);
        return node;
    }

    /**
     * 获取 Base 的那个组件
     */
    getBaseVariantComponent(): ComponentNode {
        return this.rootNode.defaultVariant;
    }

    /**
     * 获取 Utils Frame 的Node对象
     */
    getUtilsFrame(): FrameNode {
        let utilsFrame = <FrameNode>figma.getNodeById(this.data.utilsFrameId);
        if (!this.data.utilsFrameId || !utilsFrame) {
            // 创建工具盒图层 尺寸保持与组件集等大
            utilsFrame = figma.createFrame(); // 辅助文本 最外层Frame
            utilsFrame.name = ' ';
            utilsFrame.fills = [];

            utilsFrame.x = this.rootNode.x;
            utilsFrame.y = this.rootNode.y;
            utilsFrame.resize(this.rootNode.width, this.rootNode.height);
            utilsFrame.setPluginData('parametricComponentSetID', this.rootNode.id);
            const index = this.rootNode.parent.children.indexOf(this.rootNode);
            console.log('index', index);
            this.rootNode.parent.insertChild(index, utilsFrame);
            this.data.utilsFrameId = utilsFrame.id;
            this.save();
        }
        return utilsFrame;
    }

    /**
     * 获取或自动创建 ComponentVariantNode 对象
     * @param id NodeID
     */
    getComponentVariantNode(id: string): ComponentVariantNode {
        if (!this.runtimeVariantComponent[id]) {
            this.runtimeVariantComponent[id] = new ComponentVariantNode(this, id);
        }
        return this.runtimeVariantComponent[id];
    }

    /**
     * 将整体数据保存到 root node 的 Plugin Data 中
     */
    save() {
        this.rootNode.setPluginData('data', JSON.stringify(this.data));
    }

    /**
     * 关闭此会话
     * - 保存数据
     * - 清空 runtime 操作按钮
     * - 重新渲染
     */
    close() {
        console.log('close');
        this.save();
        clearCanvasButtonCallbacks();
        for (let button of this.runtimeRowButtons) {
            const node = figma.getNodeById(button);
            if (node && !node.removed) {
                node.remove();
            }
        }
        this.runtimeRowButtons = [];
        figma.getNodeById(this.runtimeAddVariantButton)?.remove();
        this.runtimeAddVariantButton = undefined;
        this.refreshRuntimeColumn();
        this.render();
    }

    /**
     * 用户主动删除 ComponentSetNode，自动删除 Utils Frame
     */
    remove() {
        console.log('delete');
        if (!this.rootNode.parent) {
            this.rootNode.remove();
        }
        const utilsFrame = this.getUtilsFrame();
        if (utilsFrame && !utilsFrame.removed) {
            utilsFrame.remove();
        }
    }

    /**
     * 刷新运行时的「列」nodeID，用于后续渲染
     */
    refreshRuntimeColumn() {
        this.runtimeColumn = [];
        const maxColumn = Math.max(...this.data.rows.map((row) => row.nodesId.length)) + 1;
        for (let i = 0; i < maxColumn; i++) {
            const columnNodesId = this.data.rows
                .map((row, rowIndex) => (i === row.nodesId.length ? this.runtimeRowButtons[rowIndex] : row.nodesId[i]))
                .filter((n) => !!n);
            if (i === 0 && this.runtimeAddVariantButton) {
                columnNodesId.push(this.runtimeAddVariantButton);
            }
            if (columnNodesId.length > 0) {
                this.runtimeColumn[i] = columnNodesId;
            }
        }
    }

    /**
     * 计时器重复触发
     * - 刷新 Base 及 其他组件 的变更
     * - 重新渲染
     */
    updateLayout() {
        // 只有在当前已选择内容时，进行重新render
        if (!this.childSelection) return; // 如果当前什么都没选中，那么不进行update

        const component = getParentComponent(this.childSelection);
        if (component?.type === 'COMPONENT') {
            if (component.id !== this.getBaseVariantComponent().id) {
                // 在选中 非Base 时，计算并储存与Base的差异
                this.getComponentVariantNode(component.id).updateDiff();
                // const dif = diff(this.childSelection, this.getBaseVariantComponent());
            }
            for (let child of this.rootNode.children) {
                if (child.id != component.id) {
                    this.getComponentVariantNode(child.id).applyDiff();
                }
            }
        }
        this.render();
    }

    /**
     * 渲染
     * - 渲染 description
     * - 将 Component 从左到右逐列设置x
     * - 将 Component 从上到下逐行设置y
     * - 渲染底部 Add Variant 按钮
     * - TODO 渲染 Combinations
     */
    render() {
        const utilsFrame = this.getUtilsFrame();
        if (!utilsFrame) {
            return;
        }

        utilsFrame.x = this.rootNode.x;
        utilsFrame.y = this.rootNode.y;

        const description = utilsFrame.findOne((n) => n.name === 'Description') as GroupNode;

        if (!description) return;

        // 处理description内的位置和宽度

        const largestWidthOfDescription = Math.max(...description.children.map((node) => node?.width));

        for (let child of description.children) {
            child.x = this.padding + largestWidthOfDescription - child.width;
        }

        this.rootNode.defaultVariant.x = description.x + description.width + this.padding;

        // 先处理横向

        let lastX = this.padding + description.width;

        for (let i = 0; i < this.runtimeColumn.length; i++) {
            const columnNodes = this.runtimeColumn[i].map((nodeId) => figma.getNodeById(nodeId) as SceneNode);
            const largestWidthOfColumn = Math.max(
                ...columnNodes.filter((node) => node.type === 'COMPONENT').map((node) => node?.width)
            );
            for (let node of columnNodes) {
                if (!node) continue;
                node.x = lastX + this.padding;
                if (node.type === 'FRAME' && node.name === 'Button' && largestWidthOfColumn > 0) {
                    node.resize(largestWidthOfColumn, node.height);
                }
            }

            lastX += this.padding + (largestWidthOfColumn > 0 ? largestWidthOfColumn : 100);
        }

        // 再处理纵向

        let lastY = this.padding;

        for (let i = 0; i < this.data.rows.length; i++) {
            const row = this.data.rows[i];
            let maxHeight = 0;
            const titleNode = figma.getNodeById(row.titleNodeId) as SceneNode;
            if (titleNode) {
                titleNode.y = lastY;
            }
            if (!row.nodesId) {
                // TEST
                console.log('Mission nodesId', row);
            }
            for (let node of row.nodesId.map((id) => figma.getNodeById(id) as SceneNode)) {
                node.y = lastY;
                if (node.height > maxHeight) {
                }
                maxHeight = node.height;
            }
            if (this.runtimeRowButtons[i]) {
                const button = figma.getNodeById(this.runtimeRowButtons[i]) as SceneNode;
                if (button) {
                    button.y = lastY;
                    if (button.height > maxHeight) maxHeight = button.height;
                }
            }
            lastY += maxHeight + this.padding;
        }
        // 最底下的 Add variant 按钮
        if (this.runtimeAddVariantButton) {
            const button = figma.getNodeById(this.runtimeAddVariantButton) as SceneNode;
            if (button) {
                button.y = lastY;
            }
            lastY += button.height + this.padding;
        }

        this.rootNode.resize(lastX + this.padding, lastY);
        utilsFrame.resize(this.rootNode.width, this.rootNode.height);
        description.x = this.padding;
        description.y = this.padding;
    }

    /**
     * 由 selectionchange 触发，当选中在此session并选择其中的子Node时，传递进来并进行相应处理
     * @param node
     */
    setChildSelection(node: SceneNode) {
        console.log('setChildSelection', node);
        this.childSelection = node;
        // 处理按钮点击
        if (this.runtimeRowButtons.includes(node.id) && node.type === 'FRAME') {
            handleCanvasButtonClick(node);
        } else if (this.runtimeAddVariantButton === node.id && node.type === 'FRAME') {
            handleCanvasButtonClick(node);
        }

        // 选中Base
        if (node === this.getBaseVariantComponent()) {
            dispatch('creationComplete');
        }
        // 处理新建Component
        if (node.type === 'COMPONENT') {
            const myId = node.getPluginData('variantNodeId');
            if (!myId || myId != node.id) {
                console.log('setChildSelection.New', myId, node.id);
                this.createRow(
                    {
                        type: 'Selection',
                        name: 'New Variant ' + this.data.rows.length,
                        defaultValue: 'default',
                    },
                    node
                );
            }
        }
    }

    /**
     * 新建 Variant 行（分类）
     * @param row 行（分类）的数据
     * @param bindNode 绑定某个 ComponentNode，如果为undefined，则会自动从Base来clone创建
     */
    createRow(row: VariantRow, bindNode?: ComponentNode) {
        const utilsFrame = this.getUtilsFrame();
        this.data.rows.push(row);
        if (!row.nodesId) row.nodesId = [];

        if (!bindNode) {
            bindNode = this.cloneBaseVariantComponent(); // this.getBaseVariantComponent().clone(); 这边直接clone会导致错误，只能手动clone了
            console.log('this.getBaseVariantComponent().clone()', bindNode);
            this.rootNode.appendChild(bindNode);
        }
        const nodeInstance = new ComponentVariantNode(this, bindNode.id);
        nodeInstance.data = {
            variantNodeId: bindNode.id,
            variantRow: row.name,
            variantRowData: row.defaultValue,
        };
        if (this.getBaseVariantComponent().id !== bindNode.id) {
            nodeInstance.updateDiff();
        }
        nodeInstance.setVariantProp(row.name, row.defaultValue);
        this.runtimeVariantComponent[bindNode.id] = nodeInstance;
        nodeInstance.save();

        // 刷新所有子组件，将这个新增的row的值设置为defaultValue
        for (let child of this.rootNode.children) {
            this.getComponentVariantNode(child.id).updateVariantName();
        }

        // 如果是通过figma自带的那个新建Variant，就会自动创建一个新的，这时候得要删除掉这个自动新增的variant
        const newProps = Object.keys(this.rootNode.variantGroupProperties as VariantGroupProperties).filter(
            (p) => !this.data.rows.find((r) => r.name === p)
        );
        console.log('newProps', newProps);
        if (newProps.length > 0) {
            for (let child of this.rootNode.children) {
                const props = getVariantPropsFromName(child.name);
                console.log('props', props);
                for (let propKey in props) {
                    if (newProps.includes(propKey)) {
                        delete props[propKey];
                        child.name = genVariantNodeName(props);
                    }
                }
            }
        }

        // 写入 Property (修改图层名)
        /*const props = getVariantPropsFromName(bindNode.name);
        console.log("bindNode.props", props);
        props[row.name] = row.defaultValue;
        bindNode.name = genVariantNodeName(props);*/

        /*if (bindNode.name === "Property 1=Default") {
            bindNode.name = `${row.name}=${row.defaultValue}`
            if (row.defaultValue === "true" || row.defaultValue === "false") {
                (bindNode.parent as ComponentSetNode).defaultVariant.name = `${row.name}=${row.defaultValue === "true" ? "false" : "true"}`;
            } else (bindNode.parent as ComponentSetNode).defaultVariant.name = `${row.name}=unset`;
        } else {
            bindNode.name += `, ${row.name}=${row.defaultValue}`
            if (row.defaultValue === "true" || row.defaultValue === "false") {
                (bindNode.parent as ComponentSetNode).children.map((n:ComponentNode) => {
                    if (n.id !== bindNode.id) n.name += `, ${row.name}=${row.defaultValue === "true" ? "false" : "true"}`
                });
            } else (bindNode.parent as ComponentSetNode).children.map((n:ComponentNode) => {
               if (n.id !== bindNode.id) { n.name += `, ${row.name}=unset`}
            });
        }*/

        row.nodesId.push(bindNode.id);
        this.createRowRuntimeButton(this.data.rows.length - 1);
        this.refreshRuntimeColumn();
        this.save();
        createVariantRowDescription(utilsFrame, row.name, row.type).then((group) => {
            let descriptionGroup = utilsFrame.findOne(
                (node) => node.type === 'GROUP' && node.name === 'Description'
            ) as GroupNode;
            if (!descriptionGroup) {
                descriptionGroup = figma.group([group], utilsFrame);
                descriptionGroup.name = 'Description';
            } else {
                const previous = descriptionGroup.children[descriptionGroup.children.length - 1];
                group.x = previous?.x;
                group.y = previous?.y + this.padding + previous.height;
                row.titleNodeId = group.id;
                descriptionGroup.appendChild(group);
            }
            this.render();
        });

        // TODO 生成其他缺失的Component
        for (let row of this.data.rows) {
            const find = this.rootNode.findAll((child: ComponentNode) => !child.variantProperties?.[row.name]);
            console.log('其他缺失的Component', row.name, find);
        }

        figma.currentPage.selection = [bindNode];
    }
}
