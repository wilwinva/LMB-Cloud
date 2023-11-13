import React from 'react';
import { App } from '@nwm/uifabric';
import AtdtHeader, { ATDT_HEADER_ROUTE_CONFIG_MAP } from './AtdtHeader';
import AtdtDocument from './tdif/AtdtDocument';
import Index from './Index';
import { TdifTic } from './tdif/TdifTic';
import { TdifRpc } from './tdif/TdifRpc';
import RecordsRoadmap from './tdif/RecordsRoadmap';
import TreeDocument from './tree/Tree';
import DatasetMetadata from './tdif/metadata/DatasetMetadata';
import ChangeHistory from './tdif/change-history/ChangeHistory';

export type AtdtRouteConfigMap = typeof ATDT_ROUTE_CONFIG_MAP;

export const ATDT_ROUTE_CONFIG_MAP = {
  atdt: {
    path: 'atdt/*',
    parameters: {}, //todo -- validate params = :ids from path, probably at runtime
    element: <App headerElement={<AtdtHeader baseRef={'atdt'} />} />,
    linkText: 'ATDT',
    tooltip: 'Automated Technical Data Tracking',
    children: {
      index: { path: '*', element: <Index />, linkText: 'ATDT', parameters: {} },
      tdif: {
        path: 'tdif/:tdifId', //todo -- need unique constrain, two ids will overwrite each other
        parameters: { tdifId: '' },
        element: <AtdtDocument />,
        linkText: 'Document',
      },
      source: {
        path: 'sourcetree/:tdifId',
        parameters: { tdifId: '' },
        element: <TreeDocument traceType={'source'} />,
        linkText: 'Source Trace Document',
      },
      dataset_metadata: {
        path: 'dataset_metadata/:tdifId',
        parameters: { tdifId: '' },
        element: <DatasetMetadata />,
        linkText: 'Dataset Metadata',
      },
      descendant: {
        path: 'descendanttree/:tdifId',
        parameters: { tdifId: '' },
        element: <TreeDocument traceType={'descendant'} />,
        linkText: 'Descendant Tree Document',
      },
      supersede: {
        path: 'supersedetree/:tdifId',
        parameters: { tdifId: '' },
        element: <TreeDocument traceType={'supersede'} />,
        linkText: 'Supersede Tree Document',
      },
      tdif_tic: {
        path: 'tdif_tic/:ticId',
        parameters: { ticId: '' },
        element: <TdifTic />,
        linkText: 'TIC Document',
      },
      tdif_rpc: {
        path: 'tdif_rpc/:rpcId',
        parameters: { rpcId: '' },
        element: <TdifRpc />,
        linkText: 'RDMS Document',
      },
      tdifRoadmap: {
        path: 'tdifRoadmap/:tdifId',
        parameters: { ds: '' },
        element: <RecordsRoadmap />,
        linkText: 'Records Roadmap Info',
      },
      changeHistory: {
        path: 'change-history/:tdifId',
        parameters: { tdifId: '' },
        element: <ChangeHistory />,
        linkText: 'Change History',
      },
      ...ATDT_HEADER_ROUTE_CONFIG_MAP,
    },
  },
};
