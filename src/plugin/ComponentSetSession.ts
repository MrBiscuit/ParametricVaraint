import {clearCanvasButtonCallbacks, createCanvasButton, handleCanvasButtonClick} from './CanvasButton';
import {dispatch} from './codeMessageHandler';
import diff from './utilDiff';

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
        // 生成运行时操作按钮
        for (let i = 0; i < this.data.rows.length; i++) {
            this.createRowRuntimeButton(i);
        }
        // 生成运行时添加Variant按钮
        const addVariantButton = createCanvasButton('+ Variant', () => {
            dispatch('addVariant');
        });
        addVariantButton.setPluginData('parametricComponentSetID', this.rootNode.id);
        this.runtimeAddVariantButton = addVariantButton.id;
        this.getUtilsFrame().appendChild(addVariantButton);
        this.refreshRuntimeColumn();
        this.render();
    }

    setChildSelection(node: SceneNode) {
        console.log('setChildSelection', node);
        this.childSelection = node;
        // 处理按钮点击
        if (this.runtimeRowButtons.includes(node.id) && node.type === 'FRAME') {
            if (handleCanvasButtonClick(node)) {
                figma.currentPage.selection = [this.rootNode];
            }
        } else if (this.runtimeAddVariantButton === node.id && node.type === 'FRAME') {
            if (handleCanvasButtonClick(node)) {
                figma.currentPage.selection = [this.rootNode];
            }
        }
        // 处理新建Component
        if (node.type === 'COMPONENT') {
            const myId = node.getPluginData('variantNodeId');
            if (!myId || myId != node.id) {
                console.log('setChildSelection.ZA', node);
                this.createRow(
                    {
                        type: 'Selection',
                        name: 'New Variant',
                    },
                    node
                );
            }
        }
    }

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

    getBaseVariant(): ComponentNode {
        return this.rootNode.defaultVariant;
    }

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
            this.data.utilsFrameId = utilsFrame.id;
            this.save();
        }
        return utilsFrame;
    }

    save() {
        this.rootNode.setPluginData('data', JSON.stringify(this.data));
    }

    /**
     * 刷新一些Layout的位置
     */
    updateLayout() {
        // 只有在当前已选择内容时，进行重新render
        if (!this.childSelection) return; // 如果当前什么都没选中，那么不进行update
        this.render();
    }

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
     * 新建Varint行
     * @param row
     * @param bindNode 绑定某个 ComponentNode，如果为undefined
     */
    createRow(row: VariantRow, bindNode?: ComponentNode) {
        const utilsFrame = this.getUtilsFrame();
        this.data.rows.push(row);
        if (!bindNode) {
            bindNode = this.getBaseVariant().clone();
            this.rootNode.appendChild(bindNode);
        }
        bindNode.setPluginData('variantNodeId', bindNode.id);
        bindNode.setPluginData('variantRow', row.name);
        bindNode.setPluginData('variantDiff', JSON.stringify(diff(this.getBaseVariant(), bindNode)));
        if (row.defaultValue) {  // 写入 Property (修改图层名)
            if (bindNode.name === "Property 1=Default") {
                bindNode.name = `${row.name}=${row.defaultValue}`
                if (row.defaultValue === "true" || row.defaultValue === "false") {
                    (bindNode.parent as ComponentSetNode).defaultVariant.name = `${row.name}=${row.defaultValue === "true" ? "false" : "true"}`;
                } else (bindNode.parent as ComponentSetNode).defaultVariant.name = `${row.name}=unset`;
            } else {
                bindNode.name += `, ${row.name}=${row.defaultValue}`
                if (row.defaultValue === "true" || row.defaultValue === "false") {
                    (bindNode.parent as ComponentSetNode).children.map((n:ComponentNode) => {
                        if (n.id !== bindNode.id) n.name += `, ${row.name}=${row.defaultValue === "true" ? "false" : "true"}`
                    });;
                } else (bindNode.parent as ComponentSetNode).children.map((n:ComponentNode) => {
                   if (n.id !== bindNode.id) { n.name += `, ${row.name}=unset`}
                });;
            }

        }
        row.nodesId = [bindNode.id];
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
    }

    createRowRuntimeButton(rowIndex: number) {
        let buttonFrame = null;
        if (this.data.rows[rowIndex].type === 'Base&Interaction') {
            buttonFrame = createCanvasButton('+ Interaction', () =>
                console.log('Click button: + interaction ' + this.data.rows[rowIndex].name)
            );
        } else if (this.data.rows[rowIndex].type === 'Selection') {
            buttonFrame = createCanvasButton('+ Option', () => {});
        }
        if (buttonFrame) {
            buttonFrame.setPluginData('parametricComponentSetID', this.rootNode.id);
            this.getUtilsFrame().appendChild(buttonFrame);
            this.runtimeRowButtons[rowIndex] = buttonFrame.id;
        }
    }
}
