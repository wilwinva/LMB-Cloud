import React from 'react';
import { App } from '@nwm/uifabric';
import WorkflowHeader, { WORKFLOW_HEADER_ROUTE_CONFIG_MAP } from './WorkflowHeader';
import DocumentManager from './DocumentManager';
import WorkflowDocument from './WorkflowDocument';

export type WorkflowRouteConfigMap = typeof WORKFLOW_ROUTE_CONFIG_MAP;

export const WORKFLOW_ROUTE_CONFIG_MAP = {
  workflow: {
    path: 'workflow/*',
    parameters: {}, //todo -- validate params = :ids from path, probably at runtime
    element: <App headerElement={<WorkflowHeader baseRef={'workflow'} />} />,
    linkText: 'Workflows',
    children: {
      id: {
        path: 'id/:wflowId/:pkg/:stageId',
        parameters: { wflowId: '', pkg: '', stageId: '' },
        element: <DocumentManager historyView={false} />,
        linkText: 'Document Manager',
      },
      history: {
        path: 'history/:wflowId/:stageId',
        parameters: { wflowId: '', stageId: '' },
        element: <DocumentManager historyView={true} />,
        linkText: 'Document Manager',
      },
      document: {
        path: 'document/:wflowId/:stageId/:docId',
        parameters: { wflowId: '', stageId: '', docId: '' },
        element: <WorkflowDocument />,
        linkText: 'Document',
      },
      ...WORKFLOW_HEADER_ROUTE_CONFIG_MAP,
    },
  },
};
