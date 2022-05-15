import {genVariantNodeName, getVariantNodeData, getVariantPropsFromName, saveVariantNodeData} from './utilVariant';
import {ParametricComponentSetSession} from './ComponentSetSession';
import diff, {isObject} from './utilDiff';

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
            // 从node将样式clone下来
            const dif = diff(base, node);
            /*for (let difKey in dif) {
                if (difKey !== 'children' && dif[difKey]['@left']) {
                    node[difKey] = dif[difKey]['@left'];
                }
            }
            node.resize(base.width, base.height);*/

            if (!this.data.variantDiff) {
                this.data.variantDiff = {};
            }

            applyDiff0(base, node, dif, this.data.variantDiff);

            node.resize(base.width, base.height);
            /*for (let difKey in this.data.variantDiff) {
                if (difKey !== 'children' && this.data.variantDiff[difKey]['@right']) {
                    node[difKey] = this.data.variantDiff[difKey]['@right'];
                    console.log("applyDiff", this.nodeId, difKey, this.data.variantDiff[difKey]['@right']);
                }
            }
            if (this.data.variantDiff.children) {
                for (let childKey in this.data.variantDiff.children) {
                    // TODO
                    const child = node.findOne(n => n.name == childKey);
                    if (child) {

                    }
                }
            }*/
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
        console.log('updateDiff', dif);
        this.data.variantDiff = dif;
        this.save();
        return dif;
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
    for (let difKey in dif) {
        if (difKey !== 'children') {
            if (node.type === 'COMPONENT' && COMPONENT_DIFF_IGNORE.includes(difKey)) continue;
            console.log('applyDiff [test]', node.name, difKey, dif[difKey], localDif?.[difKey]);
            if (difKey === '@right') {
                // 在Base中已经不存在，应该删除
                // TODO 但是这样就导致其他组件没法单独存在子元素
                console.log('applyDiff [deleted]', difKey);
                node.remove();
            } else if (!localDif?.[difKey]) {
                // 这个属性不在diff中
                console.log('applyDiff [missing]', difKey, dif[difKey]);
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
                console.log('applyDiff [diff]', difKey, dif[difKey]);
                node[difKey] = dif[difKey]['@right'];
            }
        }
    }
    if (node.removed) return;
    if (base['children'] !== undefined && node['children'] !== undefined && dif.children) {
        for (let childKey in dif.children) {
            const childBase = (<BaseFrameMixin>base).findOne((n) => n.name === childKey);
            let child = (<BaseFrameMixin>node).findOne((n) => n.name === childKey);
            console.log('applyDiff0.test', childBase, child);
            if (child) {
                console.log('applyDiff0.child', dif.children[childKey], localDif.children?.[childKey]);
                applyDiff0(childBase, child, dif.children[childKey], localDif?.children?.[childKey]);
            } else if (childBase) {
                console.log('applyDiff0.clone', childBase);
                child = childBase.clone();
                (<BaseFrameMixin>node).appendChild(child);
            }
            if (child && childBase) {
                try {
                    (<BaseFrameMixin>child).resize(childBase.width, childBase.height);
                } catch (ignore) {}
            }
        }
    }
}
