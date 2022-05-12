// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from 'react';
import {classNames} from '@plasmicapp/react-web';

export type Line12IconProps = React.ComponentProps<'svg'> & {
    title?: string;
};

export function Line12Icon(props: Line12IconProps) {
    const {className, style, title, ...restProps} = props;
    return (
        <svg
            xmlns={'http://www.w3.org/2000/svg'}
            fill={'none'}
            viewBox={'0 0 93 8'}
            className={classNames('plasmic-default__svg', className)}
            style={style}
            {...restProps}
        >
            {title && <title>{title}</title>}

            <path
                opacity={'.3'}
                d={
                    'M92.354 4.354a.5.5 0 000-.708L89.172.464a.5.5 0 10-.707.708L91.293 4l-2.829 2.828a.5.5 0 10.708.708l3.182-3.182zM0 4.5h1v-1H0v1zm3 0h2v-1H3v1zm4 0h2v-1H7v1zm4 0h2v-1h-2v1zm4 0h2v-1h-2v1zm4 0h2v-1h-2v1zm4 0h2v-1h-2v1zm4 0h2v-1h-2v1zm4 0h2v-1h-2v1zm4 0h2v-1h-2v1zm4 0h2v-1h-2v1zm4 0h2v-1h-2v1zm4 0h2v-1h-2v1zm4 0h2v-1h-2v1zm4 0h2v-1h-2v1zm4 0h2v-1h-2v1zm4 0h2v-1h-2v1zm4 0h2v-1h-2v1zm4 0h2v-1h-2v1zm4 0h2v-1h-2v1zm4 0h2v-1h-2v1zm4 0h2v-1h-2v1zm4 0h2v-1h-2v1zm4 0h1v-1h-1v1z'
                }
                fill={'#000'}
            ></path>
        </svg>
    );
}

export default Line12Icon;
/* prettier-ignore-end */
