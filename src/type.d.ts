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

declare type VariantType = 'Base&Interaction' | 'Boolean' | 'Select';

declare type VariantRow = {
    type: VariantType;
    name: string;
    titleNodeId?: string;
    nodesId: string[];
};

declare type ComponentSetPluginData = {
    utilsFrameId: string;
    rows: VariantRow[];
};

declare type VariantNode = {
    id: string;
    rowName: string; // Row的名称（但是由于可以改，所以最好取一个不会被修改的来区分Row）
    diff?: Diff;
};

declare type RuntimeVariantColumn = string[];