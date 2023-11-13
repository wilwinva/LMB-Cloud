import * as React from 'react';
import { ReactNode } from 'react';
import { List } from 'office-ui-fabric-react/lib/List';
import { getTheme, ITheme } from '@uifabric/styling';
import { IStackStyles, Stack } from 'office-ui-fabric-react';

export interface IHeaderItem {
  columnName: string;
  index: number;
}

export interface IFileItem {
  name: string;
  description: string;
  key: string;
  index: number;
  fileSize: string;
}

export interface IDataFileItem {
  name: string;
  description: string;
  key: string;
  index: number;
  revision: string;
}

const stackStylesLabel: IStackStyles = {
  root: {
    background: '#C6C3C6',
    alignItems: 'initial',
    display: 'flex',
    height: 30,
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingTop: 10,
    width: '100%',
  },
};

export interface FileListProps<T> {
  headerItems: IHeaderItem[];
  files: T[];

  onRenderCell(item?: T): ReactNode;
}

export default function FileList(props: FileListProps<IFileItem | IDataFileItem>) {
  const theme: ITheme = getTheme();
  const { palette } = theme;

  const borderStyle = '1px solid ' + palette.black;
  const stackStyles: IStackStyles = {
    root: {
      background: palette.white,
      border: borderStyle,
    },
  };

  return (
    <Stack grow styles={stackStyles}>
      <Stack grow horizontal>
        {props.headerItems.map((item, idx) => (
          <Stack.Item key={idx} styles={stackStylesLabel}>
            <span>{item.columnName}</span>
          </Stack.Item>
        ))}
      </Stack>
      <List items={props.files} onRenderCell={props.onRenderCell} />
    </Stack>
  );
}
