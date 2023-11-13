import React from 'react';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import { Text } from 'office-ui-fabric-react';
import { DetailsList, DetailsListLayoutMode, SelectionMode, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { ExternalLink, Method } from '@nwm/uifabric';
import { flow, replace } from 'lodash/fp';

import { LINK_INTERCEPTIONS, STORAGE_API_TOKEN } from '../../BaseApp';
import { IDocument } from './DirectoryView';
import { FileData } from '../helpers/TdmsFilesHelper';

interface DirectoryViewProps {
  fileList: FileData[];
  blobPath: string;
}

const getKey = (item: IDocument) => item.Name;

const excludeBlobPath = (blobPath: string) => replace(blobPath, '');
const getFileName = (nameStr: string, blobPath: string) => flow(excludeBlobPath(blobPath))(nameStr);

function formatBytes(bytesStr: string, decimals = 2) {
  const bytes = parseInt(bytesStr, 10);

  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function DirectoryTable({ fileList = [], blobPath }: DirectoryViewProps) {
  // Fetch directory structure
  const columns: IColumn[] = [
    {
      key: 'column1',
      name: 'Name',
      fieldName: 'Name',
      minWidth: 150,
      maxWidth: 350,
      isRowHeader: true,
      isResizable: true,
      data: 'string',
      onRender: (item: IDocument) => {
        return (
          <ExternalLink
            href={`${process.env.BLOB_STORAGE_TDMS}/${item.Name}`}
            method={Method.DOWNLOAD_FILE}
            apiToken={STORAGE_API_TOKEN}
            linkInterceptions={LINK_INTERCEPTIONS}
            fileList={fileList}
          >
            {getFileName(item.Name, blobPath)}
          </ExternalLink>
        );
      },
      isPadded: true,
    },
    {
      key: 'column2',
      name: 'Date Modified',
      fieldName: 'Last-Modified',
      minWidth: 120,
      maxWidth: 150,
      isResizable: true,
      data: 'number',
      onRender: (item: IDocument) => {
        return <span>{item['Last-Modified']}</span>;
      },
      isPadded: true,
    },
    {
      key: 'column3',
      name: 'File Size',
      fieldName: 'Content-Length',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'number',
      onRender: (item: IDocument) => {
        return <span>{formatBytes(item['Content-Length'])}</span>;
      },
    },
  ];

  // Display as list
  return (
    <DetailsList
      items={fileList}
      compact={false}
      columns={columns}
      selectionMode={SelectionMode.none}
      getKey={getKey}
      setKey="none"
      layoutMode={DetailsListLayoutMode.justified}
      isHeaderVisible={true}
    />
  );
}

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to load directory with error: ${props.error} `}</Text>;
}

export default withErrorBoundary(DirectoryTable, ErrorFallback);
