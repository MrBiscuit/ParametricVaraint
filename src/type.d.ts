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
