import {ParametricComponentSetSession} from './ComponentSetSession';
import {dispatch} from './codeMessageHandler';

/**
 * 从无创建
 */
export function createParametricComponentSet(): ParametricComponentSetSession {
    // 创建组件集
    const baseComponent = figma.createComponent();
    baseComponent.fills = [
        {
            type: 'SOLID',
            color: {r: 1, g: 1, b: 1},
        },
    ];
    const componentSet = figma.combineAsVariants([baseComponent], figma.currentPage);
    componentSet.name = 'New Parametric Component Set';
    // 组件集位置 在视窗中间
    componentSet.x = Math.floor(figma.viewport.center.x - componentSet.width / 2);
    componentSet.y = Math.floor(figma.viewport.center.y - componentSet.height / 2);

    const session = new ParametricComponentSetSession(componentSet);
    // 创建第一个Row
    session.createRow({
        type: 'Base&Interaction',
        name: 'Base',
        nodesId: [baseComponent.id],
    });

    dispatch('creationComplete');
    return session;
}

/**
 * 从已有的 ComponentSetNode 创建 Session
 * @param componentSet
 */
export function getPCSFromComponentSetNode(componentSet: BaseNode): ParametricComponentSetSession | undefined {
    if (componentSet?.type === 'COMPONENT_SET' && componentSet?.getPluginData('data')) {
        return new ParametricComponentSetSession(componentSet);
    } else {
        return undefined;
    }
}
