// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from 'react';
import {classNames} from '@plasmicapp/react-web';

export type _2IconProps = React.ComponentProps<'svg'> & {
    title?: string;
};

export function _2Icon(props: _2IconProps) {
    const {className, style, title, ...restProps} = props;
    return (
        <svg
            xmlns={'http://www.w3.org/2000/svg'}
            fill={'none'}
            viewBox={'0 0 8 32'}
            className={classNames('plasmic-default__svg', className)}
            style={style}
            {...restProps}
        >
            {title && <title>{title}</title>}

            <path
                fillRule={'evenodd'}
                clipRule={'evenodd'}
                d={'M3.646 18.354l-3-3 .708-.707L4 17.293l2.646-2.646.708.707-3 3-.354.353-.354-.353z'}
                fill={'#000'}
                fillOpacity={'.3'}
            ></path>
        </svg>
    );
}

export default _2Icon;
/* prettier-ignore-end */
