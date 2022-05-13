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
};

declare type ComponentSetPluginData = {
    utilsFrameId: string;
    rows: {
        [rowName: string]: VariantRow;
    };
};

declare type VariantNode = {
    id: string;
    rowName: string;
    diff?: Diff;
};
