// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from 'react';
import {classNames} from '@plasmicapp/react-web';

export type Line13IconProps = React.ComponentProps<'svg'> & {
    title?: string;
};

export function Line13Icon(props: Line13IconProps) {
    const {className, style, title, ...restProps} = props;
    return (
        <svg
            xmlns={'http://www.w3.org/2000/svg'}
            fill={'none'}
            viewBox={'0 0 66 8'}
            className={classNames('plasmic-default__svg', className)}
            style={style}
            {...restProps}
        >
            {title && <title>{title}</title>}

            <path
                opacity={'.3'}
                d={
                    'M65.354 4.354a.5.5 0 000-.708L62.172.464a.5.5 0 10-.707.708L64.293 4l-2.829 2.828a.5.5 0 10.708.708l3.182-3.182zM0 4.5h1.016v-1H0v1zm3.047 0h2.031v-1H3.047v1zm4.062 0h2.032v-1H7.109v1zm4.063 0h2.031v-1h-2.031v1zm4.062 0h2.032v-1h-2.032v1zm4.063 0h2.031v-1h-2.031v1zm4.062 0h2.032v-1h-2.032v1zm4.063 0h2.031v-1h-2.031v1zm4.062 0h2.032v-1h-2.032v1zm4.063 0h2.031v-1h-2.031v1zm4.062 0h2.032v-1h-2.032v1zm4.063 0h2.031v-1h-2.031v1zm4.062 0h2.032v-1h-2.032v1zm4.063 0h2.031v-1h-2.031v1zm4.062 0h2.032v-1h-2.032v1zm4.063 0h2.031v-1h-2.031v1zm4.062 0H65v-1h-1.016v1z'
                }
                fill={'#000'}
            ></path>
        </svg>
    );
}

export default Line13Icon;
/* prettier-ignore-end */
