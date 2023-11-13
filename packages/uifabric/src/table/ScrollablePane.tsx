import React, { CSSProperties, PropsWithChildren } from 'react';
import {
  IScrollablePaneProps,
  IScrollablePaneStyles,
  mergeStyleSets,
  ScrollablePane as BaseScrollablePane,
  ScrollbarVisibility,
} from 'office-ui-fabric-react';
import { useBaseStyles } from './useBaseStyles';

/**
 * Styles - pass through to ScrollablePane props.
 * minHeight - sets minimum height of scrollable props wrapper.
 * maxHeight - sets maximum and initial height of scrollable props wrapper.
 * @notes:
 *   - wrapper is used since ScrollablePane needs to be absolute position. Wrapper is able to be relative and set
 *   the height / width dimensions appropriately.
 *   - If no maxHeight is specified than the closest parent with a set value will be used.
 */
export interface ScrollablePaneProps extends IScrollablePaneProps, CSSHeight {
  styles?: Partial<IScrollablePaneStyles>;
}

export interface CSSHeight {
  minHeight?: CSSProperties['minHeight'];
  maxHeight?: CSSProperties['maxHeight'];
}

const baseWrapperStyles: CSSProperties = {
  position: 'relative',
};

const baseScrollStyles: Partial<IScrollablePaneStyles> = {
  root: {
    position: 'absolute',
  },
};

export default function ScrollablePane({
  children,
  styles,
  minHeight = 200,
  maxHeight = 'inherit',
}: PropsWithChildren<ScrollablePaneProps>) {
  const { detailsListHeader } = useBaseStyles();

  const extBaseScrollStyles = mergeStyleSets(baseScrollStyles, detailsListHeader);
  const _scrollStyles = mergeStyleSets(extBaseScrollStyles, styles);
  const _wrapperStyles: CSSProperties = {
    ...baseWrapperStyles,
    minHeight: minHeight,
    maxHeight: maxHeight,
    height: maxHeight,
  };

  return (
    <div style={_wrapperStyles}>
      <BaseScrollablePane scrollbarVisibility={ScrollbarVisibility.auto} styles={_scrollStyles}>
        {children}
      </BaseScrollablePane>
    </div>
  );
}
