// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from 'react';
import {classNames} from '@plasmicapp/react-web';

export type TipscloseIconProps = React.ComponentProps<'svg'> & {
    title?: string;
};

export function TipscloseIcon(props: TipscloseIconProps) {
    const {className, style, title, ...restProps} = props;
    return (
        <svg
            xmlns={'http://www.w3.org/2000/svg'}
            fill={'none'}
            viewBox={'0 0 12 12'}
            className={classNames('plasmic-default__svg', className)}
            style={style}
            {...restProps}
        >
            {title && <title>{title}</title>}

            <path
                opacity={'.6'}
                fillRule={'evenodd'}
                clipRule={'evenodd'}
                d={
                    'M5.182 5.89L2 2.706 2.707 2 5.89 5.182 9.071 2l.707.707L6.596 5.89l3.182 3.182-.707.707L5.89 6.596 2.707 9.778 2 9.071 5.182 5.89z'
                }
                fill={'#4E5969'}
            ></path>
        </svg>
    );
}

export default TipscloseIcon;
/* prettier-ignore-end */
