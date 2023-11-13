import React from 'react';
import { IStackStyles, ITextStyles, Stack, Text } from 'office-ui-fabric-react';
import { TodoPlaceholder } from '@nwm/util';
import { ToolTipLink } from './link/tooltip';
import { ColumnGeneric, Table, useBaseStyles } from './table';

//todo -- Need to pull this content from the db.
const columns: ColumnGeneric<IDocument>[] = [
  {
    key: 'Position Description',
    fieldName: 'posDesc',
    minWidth: 200,
    maxWidth: 200,
    isResizable: true,
    getTargetString: (data: IDocument) => data.posDesc,
    onRender: (data?: IDocument) => <Text>{data?.posDesc}</Text>,
  },
  {
    key: 'Title',
    fieldName: 'title',
    minWidth: 200,
    maxWidth: 200,
    isResizable: true,
    getTargetString: (data: IDocument) => data.title,
    onRender: (data?: IDocument) => <Text>{data?.title}</Text>,
  },
  {
    key: 'Contact Name',
    fieldName: 'contName',
    minWidth: 200,
    maxWidth: 200,
    isResizable: true,
    getTargetString: (data: IDocument) => data.contName,
    onRender: (data?: IDocument) => <Text>{data?.contName}</Text>,
  },
  {
    key: 'Phone Number',
    fieldName: 'phoneNumber',
    minWidth: 200,
    maxWidth: 200,
    isResizable: true,
    getTargetString: (data: IDocument) => data.phoneNumber,
    onRender: (data?: IDocument) => <Text>{data?.phoneNumber}</Text>,
  },
  {
    key: 'Email',
    fieldName: 'email',
    minWidth: 200,
    maxWidth: 200,
    isResizable: true,
    getTargetString: (data: IDocument) => data.email,
    onRender: (data?: IDocument) => <Text>{data?.email}</Text>,
  },
];

interface IDocument {
  posDesc: string;
  title: string;
  contName: string;
  phoneNumber: string;
  email: string;
}

const allItems: IDocument[] = [
  {
    posDesc: 'Automated Technical Data Tracking',
    title: 'Administrator',
    contName: 'D SEAMANS',
    phoneNumber: '(702)295-7526',
    email: 'david_seamans@ymp.gov',
  },
  {
    posDesc: 'GI',
    title: 'Administrator',
    contName: 'A HENDERSON',
    phoneNumber: '(702)295-4983',
    email: 'aishia_seamans@ymp.gov',
  },
  {
    posDesc: 'Issues',
    title: 'Administrator',
    contName: 'D SEAMANS',
    phoneNumber: '(702)295-7526',
    email: 'david_seamans@ymp.gov',
  },
  {
    posDesc: 'Model Warehouse Data',
    title: 'Administrator',
    contName: 'D SEAMANS',
    phoneNumber: '(702)295-7526',
    email: 'david_seamans@ymp.gov',
  },
  {
    posDesc: 'NSHE',
    title: 'Administrator',
    contName: 'A HENDERSON',
    phoneNumber: '(702)295-4983',
    email: 'aishia_seamans@ymp.gov',
  },
];

const textStyles: ITextStyles = {
  root: {
    marginBottom: 10,
  },
};

const editAdd: IStackStyles = {
  root: {
    marginTop: `24px !important`,
    selectors: {
      a: {
        color: 'green',
      },
    },
  },
};

//todo -- need to enable the editing of this content.
export const Contacts: React.FC = () => {
  const { stackStyles, detailsListStyles } = useBaseStyles();

  return (
    <Stack styles={stackStyles}>
      <Text variant={'xxLarge'}>Development Team</Text>
      <Text styles={textStyles}>
        Click once on the contact e-mail address to send comments and questions to the appropriate administrator.
      </Text>
      <Table selectionMode={0} checkboxVisibility={2} items={allItems} columns={columns} styles={detailsListStyles} />
      <Stack styles={editAdd}>
        <ToolTipLink to="/" toolTipContent="//todo: Need to add 'edit' functionality">
          Click here to edit this information
        </ToolTipLink>
      </Stack>
      <TodoPlaceholder description="Table needs to be dynamically populated and edit links needs to be activated." />
    </Stack>
  );
};
