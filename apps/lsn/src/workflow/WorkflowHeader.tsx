import React from 'react';
import AppHeader from '../components/header/AppHeader';
import { routesToTextLinksProps } from '@nwm/uifabric';
import { TodoPlaceholder } from '@nwm/util';

export const WORKFLOW_HEADER_ROUTE_CONFIG_MAP = {
  search: { path: 'search', element: <TodoPlaceholder />, linkText: 'Search', parameters: {} },
};
export const WORKFLOW_HEADER_ROUTE_CONFIG = routesToTextLinksProps(WORKFLOW_HEADER_ROUTE_CONFIG_MAP);

export interface WorkflowHeaderProps {
  baseRef: string;
}
export default function WorkflowHeader(props: WorkflowHeaderProps) {
  return (
    <AppHeader
      {...props}
      headers={{ name: 'Workflow', description: 'Workflows' }}
      linkProps={WORKFLOW_HEADER_ROUTE_CONFIG}
    />
  );
}
