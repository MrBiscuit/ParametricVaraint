import {genVariantNodeName, getVariantNodeData, getVariantPropsFromName, saveVariantNodeData} from './utilVariant';
import {ParametricComponentSetSession} from './ComponentSetSession';
import diff from './utilDiff';

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
        if (node && this.data.variantDiff) {
            for (let difKey in this.data.variantDiff) {
                if (difKey !== 'children' && this.data.variantDiff[difKey]['@left']) {
                    node[difKey] = this.data.variantDiff[difKey]['@left'];
                }
            }
        }
    }

    updateDiff(): Diff {
        const node = this.getNode();
        const base = this.session.getBaseVariantComponent();
        const dif = diff(base, node);
        this.data.variantDiff = dif;
        this.save();
        return dif;
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
