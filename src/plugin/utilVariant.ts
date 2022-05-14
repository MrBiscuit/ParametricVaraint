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
