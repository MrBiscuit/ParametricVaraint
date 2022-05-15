export const isObject = (x) => Object(x) === x;

export const isArray = Array.isArray;

const mut = (o, [k, v]) => ((o[k] = v), o);

const props = [
    'x',
    'y',
    'rotation',
    'opacity',
    'constraints',
    'dashPattern',
    'effects',
    'fills',
    'fillStyleId',
    'strokes',
    'layoutMode',
    'primaryAxisSizingMode',
    'counterAxisSizingMode',
    'primaryAxisAlignItems',
    'counterAxisAlignItems',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingBottom',
    'itemSpacing',
    'textAlignHorizontal',
    'textAlignVertical',
    'textAutoResize',
    'paragraphIndent',
    'paragraphSpacing',
    'characters',
    'fontSize',
    'fontName',
    'textCase',
    'textDecoration',
    'letterSpacing',
    'lineHeight',
    'textStyleId',
    'hyperlink',
    'topLeftRadius',
    'topRightRadius',
    'bottomLeftRadius',
    'bottomRightRadius',
];

const collectEntries = (obj: SceneNode) => {
    const entries = {};
    for (let k in obj) {
        if (props.includes(k)) {
            entries[k] = obj[k];
        } else if (k === 'children') {
            const children = {};
            for (let child of obj['children']) {
                children[child.name] = collectEntries(child);
            }
            entries['children'] = children;
        }
    }
    //console.log(entries);
    return entries;
};

const diff1 = (left: object, right: object, rel: string) =>
    Object.entries(left)
        .map(([k, v]) =>
            isObject(v) && isObject(right[k])
                ? [k, diff1(v, right[k], rel)]
                : right[k] !== v
                ? [k, {[rel]: v}]
                : [k, {}]
        )
        .filter(([_, v]) => Object.keys(v).length !== 0)
        .reduce(mut, isArray(left) && isArray(right) ? [] : {});

const merge = (left: object, right: object) =>
    Object.entries(right)
        .map(([k, v]) => (isObject(v) && isObject(left[k]) ? [k, merge(left[k], v)] : [k, v]))
        .reduce(mut, left);

const collectMerge = (colX, colY, merge): Diff => {
    // console.log("collectMerge", colX, colY, merge);
    Object.keys(merge)
        .filter((mKey) => mKey !== 'children' && isObject(merge[mKey]))
        .forEach((mKey) => {
            merge[mKey] = {
                '@left': colX?.[mKey],
                '@right': colY?.[mKey],
            };
        });
    if (merge.children) {
        Object.keys(merge.children)
            .filter((childName) => colX.children[childName] && colY.children[childName])
            .forEach((childName) =>
                collectMerge(colX.children[childName], colY.children[childName], merge.children[childName])
            );
    }
    return merge;
};

const diff = (x: SceneNode, y: SceneNode): Diff => {
    const colX = collectEntries(x);
    const colY = collectEntries(y);

    // const left = diff1(colX, colY, '@left');
    // const right = diff1(colY, colX, '@right');
    // console.log(colX, left, colY, right);
    const m = merge(diff1(colX, colY, '@left'), diff1(colY, colX, '@right'));
    return collectMerge(colX, colY, m);
};

export default diff;
