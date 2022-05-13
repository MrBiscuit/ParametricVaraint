/**
 * 从无创建
 */
export function createComponentSet(): ComponentSetSession {
    // 创建组件集
    const baseComponent = figma.createComponent();
    const componentSet = figma.combineAsVariants([baseComponent], figma.currentPage);
    return fromComponentSetNode(componentSet);
}

export function fromComponentSetNode(componentSet: ComponentSetNode): ComponentSetSession {
    const session = new ComponentSetSession(componentSet);
    session.init();
    return session;
}

export class ComponentSetSession {
    readonly rootNode: ComponentSetNode;
    variantRow: ComponentSetPluginData;

    constructor(rootNode: ComponentSetNode) {
        this.rootNode = rootNode;
        const json = rootNode.getPluginData('data');
        this.variantRow = JSON.parse(json);
    }

    init() {}

    createTitle() {}
}
