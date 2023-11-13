import React from 'react';
import { gql } from '@apollo/client';
import { Text, List, mergeStyleSets } from 'office-ui-fabric-react';
import { useConstCallback } from '@uifabric/react-hooks';
import { WorkflowDocumentFragment } from './__generated__/WorkflowDocumentFragment';
import { FIELDS_TAB_FRAGMENT } from './tabs/FieldsTab';
import { HISTORY_FRAGMENT } from './tabs/HistoryTab';
import { COMMENTS_FRAGMENT } from './tabs/CommentsTab';
import { STATEMENT_TAB_FRAGMENT } from './tabs/StatementsTab';
import {
  EFILESNAMES_TAB_FRAGMENT,
  EMAILNAMES_TAB_FRAGMENT,
  NAMES_TAB_FRAGMENT,
  PAPERNAMES_TAB_FRAGMENT,
} from './tabs/NamesTab';
import { ADHOC_TAB_FRAGMENT } from './tabs/AdhocTab';
import { CALLCENTER_TAB_FRAGMENT } from './tabs/CallCenterTab';
import { WorkflowDocumentQuery_workflow_documents_children } from './__generated__/WorkflowDocumentQuery';

export interface WorkflowDocumentChildrenProps {
  children: WorkflowDocumentQuery_workflow_documents_children[];
}

export const DOCUMENT_FRAGMENT = gql`
  fragment WorkflowDocumentFragment on workflow_documents {
    ID
    title
    acc_no
    parent
    stage
    stage_id
    stage_lock
    stage_user
    prev_stage_user
    user_coded
    workflow_id
    source_id
    RESULT
    result2
    result3
    result2
    result2_tag
    result3
    result3_tag
    ctr
    child_count
    date_added
    date_due
    updatex
    COMMENTS
    redacted_pages
    edit_field
    edit_field2
    doc_sources {
      user_id
      COMMENTS
      datex
      source {
        NAME
      }
    }
    other_workflows {
      RESULT
    }
    workflow {
      NAME
      package_mode
    }
    ...FieldsTabFragment
    ...HistoryFragment
    ...CommentsFragment
    ...NamesTabFragment
    ...AdhocTabFragment
    ...CallCenterTabFragment
    ...EfilesNamesTabFragment
    ...EmailNamesTabFragment
    ...PaperNamesTabFragment
    ...StatementTabFragment
  }
  ${FIELDS_TAB_FRAGMENT}
  ${HISTORY_FRAGMENT}
  ${COMMENTS_FRAGMENT}
  ${NAMES_TAB_FRAGMENT}
  ${ADHOC_TAB_FRAGMENT}
  ${CALLCENTER_TAB_FRAGMENT}
  ${EFILESNAMES_TAB_FRAGMENT}
  ${EMAILNAMES_TAB_FRAGMENT}
  ${PAPERNAMES_TAB_FRAGMENT}
  ${STATEMENT_TAB_FRAGMENT}
`;

export default function WorkflowDocumentChildrent(props: WorkflowDocumentChildrenProps) {
  const borderStyle = '1px solid rgb(243, 242, 241)';
  const styles = mergeStyleSets({
    container: {
      overflow: 'auto',
      maxHeight: 103,
      borderTop: borderStyle,
      borderRight: borderStyle,
      borderLeft: borderStyle,
      maxWidth: 555,
    },
    row: {
      borderBottom: borderStyle,
      selectors: {
        div: {
          fontSize: 11,
          borderRight: borderStyle,
          marginRight: 5,
          marginLeft: 5,
          cursor: 'pointer',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: 100,
          display: 'inline-block',
        },
        'div:last-child': {
          borderRight: '0',
          width: 290,
        },
      },
    },
  });

  const onRenderCell = useConstCallback(
    (item: WorkflowDocumentFragment | undefined, index: number | undefined, isScrolling: boolean | undefined) => {
      return (
        <div className={styles.row}>
          <Text as="div" nowrap={true}>
            {item?.acc_no}
          </Text>
          <Text as="div" nowrap={true}>
            {item?.RESULT}
          </Text>
          <Text as="div" nowrap={true}>
            {item?.title}
          </Text>
        </div>
      );
    }
  );

  return (
    <div className={styles.container} data-is-scrollable>
      <List items={props.children} onRenderCell={onRenderCell} />
    </div>
  );
}
