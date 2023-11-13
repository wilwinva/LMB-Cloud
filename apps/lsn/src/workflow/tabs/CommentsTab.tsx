import React from 'react';
import {
  ActivityItem,
  CommandBarButton,
  getTheme,
  IconButton,
  IContextualMenuProps,
  IIconProps,
  IPalette,
  mergeStyleSets,
  Text,
} from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { WorkflowDocumentFragment } from '../__generated__/WorkflowDocumentFragment';

export interface CommentsTabProps {
  document: WorkflowDocumentFragment | undefined;
}

export const COMMENTS_FRAGMENT = gql`
  fragment CommentsFragment on workflow_documents {
    doc_comments {
      COMMENTS
      datex
      doc_id
      user_id
      ID
    }
  }
`;
export function CommentsTab(props: CommentsTabProps) {
  const palette: IPalette = getTheme().palette;
  const docComments = props.document ? props.document.doc_comments : [];

  const classNames = mergeStyleSets({
    root: {
      marginTop: '20px',
    },
    icon: {
      color: palette.themeDarkAlt,
    },
  });

  const activityItems: {
    key: React.ReactText;
    activityDescription?: JSX.Element[];
    activityIcon?: JSX.Element;
    comments?: JSX.Element[];
  }[] = [];

  const commentAdd: IIconProps = { iconName: 'CommentAdd' };
  const addIcon: IIconProps = { iconName: 'Message' };

  const menuProps: IContextualMenuProps = {
    items: [
      {
        key: 'editComment',
        text: 'Edit Comment',
        iconProps: { iconName: 'Edit' },
      },
      {
        key: 'deleteComment',
        text: 'Delete Comment',
        iconProps: { iconName: 'Delete' },
      },
    ],
  };
  docComments.forEach((item, idx) => {
    activityItems.push({
      key: item.ID,
      activityDescription: [
        <Text key={1}>{item.user_id}</Text>,
        <span key={2}> commented on {item.datex.substr(0, item.datex.length - 9)} </span>,
      ],
      activityIcon: <CommandBarButton iconProps={addIcon} menuProps={menuProps} />,
      comments: [<span key={1}>{item.COMMENTS} </span>],
    });
  });

  return (
    <>
      <IconButton
        className={classNames.icon}
        iconProps={commentAdd}
        title="Add New Comment"
        ariaLabel="Add New Comment"
        text="Add New Comment"
      />
      <div>
        {activityItems.map((item: { key: string | number }) => (
          <ActivityItem {...item} key={item.key} className={classNames.root} />
        ))}
      </div>
    </>
  );
}

export default CommentsTab;
