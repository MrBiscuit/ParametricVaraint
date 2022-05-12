// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from 'react';
import {classNames} from '@plasmicapp/react-web';

export type _IconProps = React.ComponentProps<'svg'> & {
    title?: string;
};

export function _Icon(props: _IconProps) {
    const {className, style, title, ...restProps} = props;
    return (
        <svg
            xmlns={'http://www.w3.org/2000/svg'}
            fill={'none'}
            viewBox={'0 0 32 32'}
            className={classNames('plasmic-default__svg', className)}
            style={style}
            {...restProps}
        >
            {title && <title>{title}</title>}

            <path
                fillRule={'evenodd'}
                clipRule={'evenodd'}
                d={
                    'M16 15.293l4.646-4.646.708.707L16.707 16l4.647 4.647-.707.707L16 16.707l-4.646 4.647-.707-.707L15.293 16l-4.646-4.646.707-.707L16 15.293z'
                }
                fill={'#000'}
                fillOpacity={'.8'}
            ></path>
        </svg>
    );
}

export default _Icon;
/* prettier-ignore-end */
