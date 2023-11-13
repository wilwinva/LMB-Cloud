import React from 'react';
import { gql } from '@apollo/client';
import {
  DetailsList,
  DetailsListLayoutMode,
  getTheme,
  IColumn,
  IconButton,
  IDetailsListStyles,
  IIconProps,
  IPalette,
  mergeStyleSets,
  SelectionMode,
} from 'office-ui-fabric-react';
import { WorkflowDocumentFragment } from '../__generated__/WorkflowDocumentFragment';

export const NAMES_TAB_FRAGMENT = gql`
  fragment NamesTabFragment on workflow_documents {
    names {
      type
      name
      organization
    }
  }
`;

export const EFILESNAMES_TAB_FRAGMENT = gql`
  fragment EfilesNamesTabFragment on workflow_documents {
    efiles_names {
      type
      name
      organization
    }
  }
`;

export const EMAILNAMES_TAB_FRAGMENT = gql`
  fragment EmailNamesTabFragment on workflow_documents {
    email_names {
      type
      name
      organization
    }
  }
`;

export const PAPERNAMES_TAB_FRAGMENT = gql`
  fragment PaperNamesTabFragment on workflow_documents {
    paper_names {
      type
      name
      organization
    }
  }
`;

export interface NamesTabProps {
  document: WorkflowDocumentFragment | undefined;
}

export function NamesTab(props: NamesTabProps) {
  const docNames = props.document ? DocNames(props.document) : [];
  const palette: IPalette = getTheme().palette;

  const columns: IColumn[] = [
    {
      key: 'column1',
      name: 'Type',
      ariaLabel: 'Type',
      fieldName: 'type',
      minWidth: 100,
      maxWidth: 100,
    },
    {
      key: 'column2',
      name: 'Name',
      ariaLabel: 'Name',
      fieldName: 'name',
      minWidth: 100,
      maxWidth: 300,
      isResizable: true,
    },
    {
      key: 'column3',
      name: 'Organization',
      ariaLabel: 'Organization',
      fieldName: 'organization',
      minWidth: 100,
      maxWidth: 200,
    },
  ];

  const styles: IDetailsListStyles = {
    root: {
      marginTop: 10,
    },
    focusZone: '',
    headerWrapper: '',
    contentWrapper: '',
  };
  const userAdd: IIconProps = { iconName: 'AddFriend' };
  const classNames = mergeStyleSets({
    root: {
      marginTop: '20px',
    },
    icon: {
      color: palette.themeDarkAlt,
    },
  });

  return (
    <>
      <IconButton
        className={classNames.icon}
        iconProps={userAdd}
        title="Add New User"
        ariaLabel="Add New User"
        text="Add New User"
      />
      <DetailsList
        styles={styles}
        items={docNames}
        columns={columns}
        selectionMode={SelectionMode.none}
        setKey="none"
        layoutMode={DetailsListLayoutMode.justified}
        isHeaderVisible={true}
      />
    </>
  );
}

function DocNames(document: WorkflowDocumentFragment) {
  switch (document.SCHEMA_NAME) {
    case 'PAPER':
      return document.paper_names;
    case 'EFILES':
      return document.efiles_names;
    case 'EMAIL':
      return document.email_names;
    default:
      return document.names;
  }
}
export default NamesTab;
