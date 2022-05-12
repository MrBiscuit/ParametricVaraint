// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from 'react';
import {classNames} from '@plasmicapp/react-web';

export type IconIconProps = React.ComponentProps<'svg'> & {
    title?: string;
};

export function IconIcon(props: IconIconProps) {
    const {className, style, title, ...restProps} = props;
    return (
        <svg
            xmlns={'http://www.w3.org/2000/svg'}
            className={classNames('plasmic-default__svg', className, 'svg')}
            viewBox={'0 0 16 16'}
            style={style}
            {...restProps}
        >
            {title && <title>{title}</title>}

            <path
                d={'M3.5 7.5v-2h-1v5h1v-2h9v2h1v-5h-1v2h-9z'}
                fillRule={'evenodd'}
                fillOpacity={'1'}
                fill={'#000'}
            ></path>
        </svg>
    );
}

export default IconIcon;
/* prettier-ignore-end */
