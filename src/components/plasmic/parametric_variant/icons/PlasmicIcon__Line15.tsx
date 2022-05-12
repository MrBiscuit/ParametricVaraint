// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from 'react';
import {classNames} from '@plasmicapp/react-web';

export type Line15IconProps = React.ComponentProps<'svg'> & {
    title?: string;
};

export function Line15Icon(props: Line15IconProps) {
    const {className, style, title, ...restProps} = props;
    return (
        <svg
            xmlns={'http://www.w3.org/2000/svg'}
            fill={'none'}
            viewBox={'0 0 72 8'}
            className={classNames('plasmic-default__svg', className)}
            style={style}
            {...restProps}
        >
            {title && <title>{title}</title>}

            <path
                opacity={'.3'}
                d={
                    'M71.354 4.354a.5.5 0 000-.708L68.172.464a.5.5 0 10-.707.708L70.293 4l-2.829 2.828a.5.5 0 10.708.708l3.182-3.182zM0 4.5h.986v-1H0v1zm2.958 0h1.973v-1H2.958v1zm3.945 0h1.972v-1H6.903v1zm3.944 0h1.972v-1h-1.972v1zm3.945 0h1.972v-1h-1.972v1zm3.944 0h1.972v-1h-1.972v1zm3.945 0h1.972v-1H22.68v1zm3.944 0h1.972v-1h-1.972v1zm3.944 0h1.973v-1h-1.973v1zm3.945 0h1.972v-1h-1.972v1zm3.944 0h1.973v-1h-1.973v1zm3.945 0h1.972v-1h-1.972v1zm3.944 0h1.972v-1h-1.972v1zm3.945 0h1.972v-1h-1.972v1zm3.944 0h1.972v-1h-1.972v1zm3.945 0h1.972v-1H58.18v1zm3.944 0h1.972v-1h-1.972v1zm3.944 0h1.973v-1h-1.973v1zm3.945 0H71v-1h-.986v1z'
                }
                fill={'#000'}
            ></path>
        </svg>
    );
}

export default Line15Icon;
/* prettier-ignore-end */
