export function getVariantPropsFromName(name: string): VariantNodeProperties {
    const props: VariantNodeProperties = {};
    for (let prop of name.split(', ')) {
        const subs = prop.split('=');
        props[subs[0]] = subs[1];
    }
    return props;
}

export function genVariantNodeName(props: VariantNodeProperties) {
    return Object.entries(props)
        .map((e) => e[0] + '=' + e[1])
        .join(', ');
}

export function getVariantNodeData(node: ComponentNode): VariantNodeData {
    const data: VariantNodeData = {};
    data.variantNodeId = node.getPluginData('variantNodeId');
    data.variantRow = node.getPluginData('variantRow');
    data.variantRowData = node.getPluginData('variantRowData');
    if (node.getPluginData('variantDiff')) {
        data.variantDiff = JSON.parse(node.getPluginData('variantDiff'));
    }
    return data;
}

export function saveVariantNodeData(node: ComponentNode, data: VariantNodeData) {
    if (data.variantNodeId) node.setPluginData('variantNodeId', data.variantNodeId);
    if (data.variantRow) node.setPluginData('variantRow', data.variantRow);
    if (data.variantRowData) node.setPluginData('variantRowData', data.variantRowData);
    if (data.variantDiff) node.setPluginData('variantDiff', JSON.stringify(data.variantDiff));
}
