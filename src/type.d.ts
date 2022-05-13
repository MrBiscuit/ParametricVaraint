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

declare type VariantType = 'Base' | 'Boolean' | 'Select' | 'Interaction';

declare type VariantRow = {
    type: VariantType;
    name: string;
    titleNodeId: string;
};

declare type ComponentSetPluginData = {
    [rowName: string]: VariantRow;
};

declare type VariantNode = {
    id: string;
    rowName: string;
    diff?: Diff;
};
