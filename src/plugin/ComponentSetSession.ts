/**
 * 从无创建
 */
export function createParametricComponentSet(): ParametricComponentSetSession {
    // 创建组件集
    const baseComponent = figma.createComponent();
    const componentSet = figma.combineAsVariants([baseComponent], figma.currentPage);
    componentSet.name = 'New Parametric Component Set';
    // 组件集位置 在视窗中间
    componentSet.x = Math.floor(figma.viewport.center.x - componentSet.width / 2);
    componentSet.y = Math.floor(figma.viewport.center.y - componentSet.height / 2);

    const session = getPCSFromComponentSetNode(componentSet);
    // 创建第一个Row
    session.createRow({
        type: 'Base&Interaction',
        name: 'Base & Interaction',
    });
    return session;
}

/**
 * 从已有的 ComponentSetNode 创建 Session
 * @param componentSet
 */
export function getPCSFromComponentSetNode(componentSet: ComponentSetNode): ParametricComponentSetSession {
    return new ParametricComponentSetSession(componentSet);
}

export function createVariantRowDescription(parentFrame: FrameNode, title: string, subTitle: string): GroupNode {
    const titleText = figma.createText();
    const subTitleText = figma.createText();
    figma.loadFontAsync({family: 'Inter', style: 'Medium'}).then(() => {
        titleText.fontName = {family: 'Inter', style: 'Medium'};
        titleText.characters = title;
        titleText.fontSize = 13;
        titleText.textAlignHorizontal = 'RIGHT';
    });
    figma.loadFontAsync({family: 'Inter', style: 'Regular'}).then(() => {
        subTitleText.fontName = {family: 'Inter', style: 'Regular'};
        subTitleText.characters = subTitle;
        subTitleText.fontSize = 9;
        subTitleText.textAlignHorizontal = 'RIGHT';
    });
    const group = figma.group([titleText, subTitleText], parentFrame);
    subTitleText.y = titleText.y + titleText.height;
    titleText.x = subTitleText.x + subTitleText.width - titleText.width;

    group.name = title + ' Description';

    return group;
}

export class ParametricComponentSetSession {
    readonly rootNode: ComponentSetNode;
    utilsFrame: FrameNode;
    data: ComponentSetPluginData;

    constructor(rootNode: ComponentSetNode) {
        this.rootNode = rootNode;
        const json = rootNode.getPluginData('data');
        this.data = json
            ? JSON.parse(json)
            : {
                  rows: {},
              };
        this.init(); // utilsFrame的创建，初始的创建
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

        this.utilsFrame = <FrameNode>figma.getNodeById(this.data.utilsFrameId);
        if (!this.data.utilsFrameId || !this.utilsFrame) {
            // 创建工具盒图层 尺寸保持与组件集等大
            this.utilsFrame = figma.createFrame(); // 辅助文本 最外层Frame
            this.utilsFrame.name = ' ';
            this.utilsFrame.fills = [];

            this.utilsFrame.x = this.rootNode.x;
            this.utilsFrame.y = this.rootNode.y;
            this.utilsFrame.resize(this.rootNode.width, this.rootNode.height);
        }
    }

    createRow(row: VariantRow) {
        this.data.rows[row.name] = row;
        const baseDescriptionGroup = createVariantRowDescription(this.utilsFrame, row.name, '&Interactions');
        const descriptionGroup = figma.group([baseDescriptionGroup], this.utilsFrame);
        descriptionGroup.name = 'Description';
    }
}
