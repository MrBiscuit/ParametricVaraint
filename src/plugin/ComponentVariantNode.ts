import {genVariantNodeName, getVariantNodeData, getVariantPropsFromName, saveVariantNodeData} from './utilVariant';
import {ParametricComponentSetSession} from './ComponentSetSession';
import diff, {isObject} from './utilDiff';
import {dispatch} from './codeMessageHandler';

export class ComponentVariantNode {
    readonly session: ParametricComponentSetSession;
    readonly nodeId: string;
    data: VariantNodeData;

    constructor(session: ParametricComponentSetSession, nodeId: string) {
        this.session = session;
        this.nodeId = nodeId;
        this.data = getVariantNodeData(this.getNode());
        if (!this.data || Object.keys(this.data).length === 0) {
            console.error(`ComponentVariantNode ${nodeId} 的 PluginData 为空`);
            const node = this.getNode();
            if (node) {
                this.data = {
                    variantNodeId: node.id,
                    variantDiff: {},
                };
                this.save();
            }
        } else if (this.data.variantNodeId != nodeId) {
            this.data.variantNodeId = nodeId;
            this.save();
        }
    }

    save() {
        const node = this.getNode();
        if (node) {
            saveVariantNodeData(node, this.data);
        }
    }

    getNode(): ComponentNode {
        const node = figma.getNodeById(this.nodeId);
        if (node.type === 'COMPONENT') {
            return node as ComponentNode;
        }
        return undefined;
    }

    needShow(): boolean {
        return this.session.data.rows.find((r) => r.name === this.data.variantRow)?.nodesId.includes(this.nodeId);
    }

    applyDiff() {
        const node = this.getNode();
        const base = this.session.getBaseVariantComponent();
        if (base && node) {
            // console.log("applyDiff", node.id, base.id);
            // 从node将样式clone下来
            const dif = diff(base, node);
            // node.resize(base.width, base.height);

            if (!this.data.variantDiff) {
                this.data.variantDiff = {};
            }

            applyDiff0(base, node, dif, this.data.variantDiff);

            if (node.primaryAxisSizingMode === 'FIXED' || node.counterAxisSizingMode === 'FIXED') {
                node.resize(base.width, base.height);
            }
        } else {
            console.error('applyDiff 时，无法遭到 base & node');
        }
    }

    updateDiff(): Diff {
        const node = this.getNode();
        const base = this.session.getBaseVariantComponent();
        const dif = diff(base, node);
        for (let ignore of COMPONENT_DIFF_IGNORE) {
            delete dif[ignore];
        }
        console.log('updateDiff', JSON.stringify(dif));
        dispatch('updateDiff', dif);
        this.data.variantDiff = dif;
        this.save();
        return dif;
    }

    syncChildrenFromElseToBase() {
        const node = this.getNode();
        const base = this.session.getBaseVariantComponent();
        if (node === base) return;
        syncChildrenFromElseToBase0(base, node);
    }

    setVariantProp(prop: string, value: string) {
        const node = this.getNode();
        if (!node) {
            console.error('ComponentVariantNode.updateVariantName 找不到对应Node ' + this.nodeId);
            return;
        }
        const props = getVariantPropsFromName(node.name);
        props[prop] = value;
        node.name = genVariantNodeName(props);
    }

    updateVariantName() {
        const node = this.getNode();
        if (!node) {
            console.error('ComponentVariantNode.updateVariantName 找不到对应Node ' + this.nodeId);
            return;
        }
        const props = getVariantPropsFromName(node.name);
        for (let row of this.session.data.rows) {
            if (!props[row.name]) {
                props[row.name] = row.type === 'Toggle' ? (row.defaultValue === 'true' ? 'false' : 'true') : 'unset';
            }
        }
        node.name = genVariantNodeName(props);
    }
}

const COMPONENT_DIFF_IGNORE = ['x', 'y'];

function applyDiff0(base: SceneNode, node: SceneNode, dif: Diff, localDif: Diff) {
    if (!dif) return;
    // console.log("applyDiff0", base, node, dif, localDif);
    for (let difKey in dif) {
        if (difKey !== 'children') {
            if (node.type === 'COMPONENT' && COMPONENT_DIFF_IGNORE.includes(difKey)) continue;
            // console.log('applyDiff [test]', node.name, difKey, dif[difKey], localDif?.[difKey]);
            if (difKey === '@right') {
                // 在Base中不存在，应该clone一份到Base中，然后隐藏
                // const clone = node.clone();
                // clone.visible = false;
                // parentBase?.appendChild(clone);
                node.remove();
                console.log('applyDiff [MissingInBase]', difKey, dif[difKey]);
            } else if (!localDif?.[difKey]) {
                // 这个属性不在diff中
                // console.log('applyDiff [missing]', difKey, dif[difKey]);
                node[difKey] = dif[difKey]['@left'];
            } else if (
                !localDif?.[difKey]?.['@right'] ||
                (isObject(dif[difKey]?.['@right']) &&
                    isObject(localDif?.[difKey]?.['@right']) &&
                    JSON.stringify(dif[difKey]?.['@right']) !== JSON.stringify(localDif?.[difKey]?.['@right'])) ||
                (!isObject(dif[difKey]?.['@right']) &&
                    !isObject(localDif?.[difKey]?.['@right']) &&
                    dif[difKey]?.['@right'] === localDif?.[difKey]?.['@right'])
            ) {
                // console.log('applyDiff [diff]', difKey, dif[difKey]);
                node[difKey] = dif[difKey]['@right'];
            }
        }
    }
    if (node.removed) return;
    if (base?.['children'] !== undefined && node?.['children'] !== undefined && dif.children) {
        for (let childKey in dif.children) {
            const childBase = (<BaseFrameMixin>base).findOne((n) => n.name === childKey);
            let child = (<BaseFrameMixin>node).findOne((n) => n.name === childKey);
            // console.log('applyDiff0.test', childBase, child);
            if (child) {
                // console.log('applyDiff0.child', dif.children[childKey], localDif.children?.[childKey]);
                applyDiff0(childBase, child, dif.children[childKey], localDif?.children?.[childKey]);
            } else if (childBase) {
                console.log('applyDiff0.clone', childBase);
                child = childBase.clone();
                (<BaseFrameMixin>node).appendChild(child);
            }
            if (child && childBase) {
                if (
                    (<BaseFrameMixin>child).primaryAxisSizingMode === 'FIXED' ||
                    (<BaseFrameMixin>child).counterAxisSizingMode === 'FIXED'
                ) {
                    (<BaseFrameMixin>child).resize(childBase.width, childBase.height);
                }
            }
        }
    }
}

function syncChildrenFromElseToBase0(base0: SceneNode, node0: SceneNode) {
    if (base0['children'] && node0['children']) {
        const base = base0 as BaseFrameMixin;
        const node = node0 as BaseFrameMixin;
        for (let child of node.children) {
            const find = base.findOne((n) => n.name === child.name);
            if (!find) {
                // 在Base中未找到
                const clone = child.clone();
                clone.visible = false;
                base.appendChild(clone);
            } else {
                // 在Base中找到，则调查更深的children
                syncChildrenFromElseToBase0(find, child);
            }
        }
    }
}
