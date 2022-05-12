// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from 'react';
import {classNames} from '@plasmicapp/react-web';

export type HaFillIconProps = React.ComponentProps<'svg'> & {
    title?: string;
};

export function HaFillIcon(props: HaFillIconProps) {
    const {className, style, title, ...restProps} = props;
    return (
        <svg
            xmlns={'http://www.w3.org/2000/svg'}
            fill={'none'}
            viewBox={'0 0 128 30'}
            className={classNames('plasmic-default__svg', className)}
            style={style}
            {...restProps}
        >
            {title && <title>{title}</title>}

            <path d={'M1 1h126v28H1V1z'} stroke={'#18A0FB'} strokeWidth={'2'}></path>
        </svg>
    );
}

export default HaFillIcon;
/* prettier-ignore-end */
