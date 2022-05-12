// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from 'react';
import {classNames} from '@plasmicapp/react-web';

export type SeparatorIconProps = React.ComponentProps<'svg'> & {
    title?: string;
};

export function SeparatorIcon(props: SeparatorIconProps) {
    const {className, style, title, ...restProps} = props;
    return (
        <svg
            xmlns={'http://www.w3.org/2000/svg'}
            fill={'none'}
            viewBox={'0 0 240 1'}
            className={classNames('plasmic-default__svg', className)}
            style={style}
            {...restProps}
        >
            {title && <title>{title}</title>}

            <path
                fillRule={'evenodd'}
                clipRule={'evenodd'}
                d={'M240 1H0V0h240v1z'}
                fill={'#000'}
                fillOpacity={'.1'}
            ></path>
        </svg>
    );
}

export default SeparatorIcon;
/* prettier-ignore-end */
