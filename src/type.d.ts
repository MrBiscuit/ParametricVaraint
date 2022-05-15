declare type Diff = {
    children?: {
        [name: string]: Diff;
    };
    [prop: string]: DiffProp;
};

declare type DiffProp = {
    '@left'?: any;
    '@right'?: any;
};

declare type VariantType = 'Base&Interaction' | 'Toggle' | 'Selection';

declare type VariantRow = {
    type: VariantType;
    name: string;
    defaultValue: string;
    titleNodeId?: string;
    nodesId?: string[]; // 只包含显示出来的
};

declare type ComponentSetPluginData = {
    utilsFrameId: string;
    rows: VariantRow[];
};

declare type RuntimeVariantColumn = string[];

declare type VariantGroupProperties = {
    [property: string]: {
        values: string[];
    };
};

declare type VariantNodeProperties = {
    [property: string]: string;
};

declare type VariantNodeData = {
    variantNodeId?: string;
    variantRow?: string;
    variantRowData?: string;
    variantDiff?: Diff;
};
