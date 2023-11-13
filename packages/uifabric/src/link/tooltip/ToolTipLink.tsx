import * as React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { TooltipHost, ITooltipHostStyles } from 'office-ui-fabric-react/lib/Tooltip';
import { useId } from '@uifabric/react-hooks';
import { PropsWithChildren } from 'react';
import { To } from 'react-router';

const calloutProps = { gapSpace: 0 };
// The TooltipHost root uses display: inline by default.
// If that's causing sizing issues or tooltip positioning issues, try overriding to inline-block.
const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };

interface ToolTipProps {
  toolTipContent?: string;
  to: To;
  custom?: Partial<LinkProps>;
}

export function ToolTipLink(props: PropsWithChildren<ToolTipProps>) {
  const { toolTipContent, ...restProps } = props;

  // Use useId() to ensure that the ID is unique on the page.
  // (It's also okay to use a plain string and manually ensure uniqueness.)
  const tooltipId = useId('tooltip');

  const link = <Link {...restProps}>{props.children}</Link>;
  return toolTipContent ? (
    <TooltipHost
      content={toolTipContent}
      // This id is used on the tooltip itself, not the host
      // (so an element with this id only exists when the tooltip is shown)
      id={tooltipId}
      calloutProps={calloutProps}
      styles={hostStyles}
    >
      {link}
    </TooltipHost>
  ) : (
    link
  );
}
