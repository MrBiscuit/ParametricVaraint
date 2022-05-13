// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from 'react';
import {classNames} from '@plasmicapp/react-web';

export type Icon3IconProps = React.ComponentProps<'svg'> & {
    title?: string;
};

export function Icon3Icon(props: Icon3IconProps) {
    const {className, style, title, ...restProps} = props;
    return (
        <svg
            xmlns={'http://www.w3.org/2000/svg'}
            fill={'none'}
            viewBox={'0 0 5 8'}
            className={classNames('plasmic-default__svg', className)}
            style={style}
            {...restProps}
        >
            {title && <title>{title}</title>}

            <path
                d={
                    'M4.854 3.646L1.69.464a.495.495 0 00-.704 0 .502.502 0 000 .708l2.522 2.535v.586L.986 6.828a.502.502 0 000 .708c.194.195.51.195.704 0l3.164-3.182a.502.502 0 000-.708z'
                }
                fill={'#000'}
            ></path>
        </svg>
    );
}

export default Icon3Icon;
/* prettier-ignore-end */
