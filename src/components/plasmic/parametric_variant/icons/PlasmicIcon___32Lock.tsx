// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from 'react';
import {classNames} from '@plasmicapp/react-web';

export type _32LockIconProps = React.ComponentProps<'svg'> & {
    title?: string;
};

export function _32LockIcon(props: _32LockIconProps) {
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
                    'M17.5 13.5V15h-3v-1.5a1.5 1.5 0 013 0zm-4 1.5v-1.5a2.5 2.5 0 015 0V15h.5a.5.5 0 01.5.5v5a.5.5 0 01-.5.5h-6a.5.5 0 01-.5-.5v-5a.5.5 0 01.5-.5h.5z'
                }
                fill={'#000'}
                fillOpacity={'.8'}
            ></path>
        </svg>
    );
}

export default _32LockIcon;
/* prettier-ignore-end */
