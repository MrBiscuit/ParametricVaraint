export function getParametricComponentSet(node: BaseNode): BaseNode {
    if (!node) {
        return null;
    } else if (node.type === 'COMPONENT_SET') {
        return node;
    } else if (node.parent.type === 'FRAME' && node.parent.getPluginData('parametricComponentSetID')) {
        return figma.getNodeById(node.parent.getPluginData('parametricComponentSetID')) as ComponentSetNode;
    } else if (node.parent.type === 'PAGE') {
        return null;
    } else {
        return getParametricComponentSet(node.parent);
    }
}

export function getParentComponent(node: BaseNode): BaseNode {
    if (!node) {
        return null;
    } else if (node.type === 'COMPONENT') {
        return node;
    } else if (node.parent.type === 'PAGE') {
        return null;
    } else {
        return getParentComponent(node.parent);
    }
}
