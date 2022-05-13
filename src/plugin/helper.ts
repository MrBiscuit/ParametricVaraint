export function getParametricComponentSet(node: BaseNode): BaseNode {

    if (node.type === 'COMPONENT_SET') {
        return node;
    } else if (node.parent.type === "COMPONENT_SET") {
        return node;
    } else if (node.parent.type === "FRAME" && node.parent.getPluginData("parametricComponentSetID")) {
        return figma.getNodeById(node.parent.getPluginData("parametricComponentSetID")) as ComponentSetNode
    } else if (node.parent.type === "PAGE") {
        return null;
    } else {
        return getParametricComponentSet(node.parent);
    }
}

