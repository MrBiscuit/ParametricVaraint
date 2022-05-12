// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from 'react';
import {classNames} from '@plasmicapp/react-web';

export type Line14IconProps = React.ComponentProps<'svg'> & {
    title?: string;
};

export function Line14Icon(props: Line14IconProps) {
    const {className, style, title, ...restProps} = props;
    return (
        <svg
            xmlns={'http://www.w3.org/2000/svg'}
            fill={'none'}
            viewBox={'0 0 47 8'}
            className={classNames('plasmic-default__svg', className)}
            style={style}
            {...restProps}
        >
            {title && <title>{title}</title>}

            <path
                opacity={'.3'}
                d={
                    'M46.354 4.354a.5.5 0 000-.708L43.172.464a.5.5 0 10-.707.708L45.293 4l-2.828 2.828a.5.5 0 10.707.708l3.182-3.182zM0 4.5h.958v-1H0v1zm2.875 0h1.917v-1H2.875v1zm3.833 0h1.917v-1H6.708v1zm3.834 0h1.916v-1h-1.916v1zm3.833 0h1.917v-1h-1.917v1zm3.833 0h1.917v-1h-1.917v1zm3.834 0h1.916v-1h-1.916v1zm3.833 0h1.917v-1h-1.917v1zm3.833 0h1.917v-1h-1.917v1zm3.834 0h1.916v-1h-1.916v1zm3.833 0h1.917v-1h-1.917v1zm3.833 0h1.917v-1h-1.917v1zm3.834 0H46v-1h-.958v1z'
                }
                fill={'#000'}
            ></path>
        </svg>
    );
}

export default Line14Icon;
/* prettier-ignore-end */
