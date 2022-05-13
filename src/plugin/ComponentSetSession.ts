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

export class ParametricComponentSetSession {
    readonly rootNode: ComponentSetNode;
    data: ComponentSetPluginData;
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
        this.refreshRuntimeColumn();
    }

    refreshRuntimeColumn() {
        this.runtimeColumn = [];
        const maxColumn = Math.max(...this.data.rows.map((row) => row.nodesId.length));
        for (let i = 0; i < maxColumn; i++) {
            this.runtimeColumn.push(this.data.rows.map((row) => row.nodesId[0]));
        }
    }

    getBaseFrame(): ComponentNode {
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

        const description = utilsFrame.findOne((n) => n.name === 'Description');
        description.x = this.padding;
        description.y = this.padding;

        this.rootNode.defaultVariant.x = description.x + description.width + this.padding;

        let lastX = this.padding + description.width;

        for (let i = 0; i < this.runtimeColumn.length; i++) {
            const columnNodes = this.runtimeColumn[i].map((nodeId) => figma.getNodeById(nodeId) as ComponentNode);

            const largestWidthOfFirstColumn = Math.max(...columnNodes.map((node) => node.width));
            for (let node of columnNodes) {
                node.x = lastX + this.padding;
                lastX += this.padding + largestWidthOfFirstColumn;
            }
        }
        this.rootNode.resize(lastX + this.padding, 100);
        utilsFrame.resize(this.rootNode.width, this.rootNode.height);
    }

    createRow(row: VariantRow) {
        const utilsFrame = this.getUtilsFrame();
        this.data.rows.push(row);
        this.refreshRuntimeColumn();
        this.save();
        createVariantRowDescription(utilsFrame, row.name, '??').then((baseDescriptionGroup) => {
            const descriptionGroup = figma.group([baseDescriptionGroup], utilsFrame);
            descriptionGroup.name = 'Description';
            this.render();
        });
    }

    renderColumn() {}
}
