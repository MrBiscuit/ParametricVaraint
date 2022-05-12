const isObject = (x) => Object(x) === x;

const isArray = Array.isArray;

const mut = (o, [k, v]) => ((o[k] = v), o);

const props = [
    'backgrounds',
    'constraints',
    'dashPattern',
    'effects',
    'fills',
    'strokes',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingBottom',
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
    return entries;
};

const diff1 = (left: object, right: object, rel = 'left') =>
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

const diff = (x: SceneNode, y: SceneNode) => {
    const colX = collectEntries(x);
    const colY = collectEntries(y);
    return merge(diff1(colX, colY, '@left'), diff1(colY, colX, '@right'));
};

export default diff;
