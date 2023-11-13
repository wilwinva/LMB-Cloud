import React, { useEffect, useRef, useState } from 'react';
import { DocumentNode, gql, useLazyQuery } from '@apollo/client';
import { Documents, Documents_workflow_documents, DocumentsVariables } from './__generated__/Documents';
import { DOCUMENT_FRAGMENT } from './WorkflowDocumentChildren';
import { useParamsEncoded } from '@nwm/react-hooks';
import useIntersect from '../hooks/useIntersect';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import { DetailsList, DetailsRow, IColumn, IDetailsListProps, SelectionMode, Text } from 'office-ui-fabric-react';
import { useBoolean } from '@uifabric/react-hooks';
import { AuthenticationContext } from '../components/AuthProvider/AuthenticationContext';
import { Account } from 'msal';

/**
 * bit of oddness with the construction of this query. I needed a dynamic query that changed ever so slighty with
 * the stageId comparison but I wanted to keep the typing that comes with the schema generation so I'm abusing the
 * schema generation and the graphql-tag. In essence this query really isn't used
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const workflow_documents = gql`
  query Documents($workflow_id: float8, $stage_id: float8, $user: String, $limit: Int, $offset: Int) {
    workflow_documents(
      limit: $limit
      offset: $offset
      where: { workflow_id: { _eq: $workflow_id }, stage_id: { _eq: $stage_id }, user_coded: { _eq: $user } }
    ) {
      ...WorkflowDocumentFragment
    }
    workflow_documents_aggregate {
      aggregate {
        count
      }
    }
  }
  ${DOCUMENT_FRAGMENT}
`;
export interface DocumentSelectorProps {
  historyMode: boolean;
  setDocToReview: (item?: Documents_workflow_documents) => void;
}
export function DocumentViewerComponent(_props: DocumentSelectorProps) {
  const authContext = React.useContext(AuthenticationContext);
  const userAccount: Account = authContext.user.account;
  const user_id = userAccount.userName.split('@')[0];

  const [wflowId, pkg, stageId] = useParamsEncoded();
  const fetchLimit = 50;
  const offset = useRef(0);
  const totalRecords = useRef<number>(0);
  const fetchedRecords = useRef(0);
  const [items, setItems] = useState<Documents_workflow_documents[]>([]);

  const isPackage = pkg === 'Y' ? '{ parent: { _neq: "C" } },' : '';

  let documentFilter = (function (stageId: number, historyMode: boolean): string {
    const regularFilter = `{ stage_id: { _eq: $stage_id } }, ${isPackage} { _or: [{ stage_user: { _eq: $user } }, { stage_user: { _is_null: true } }] }`;

    switch (stageId) {
      case 20:
        return historyMode ? '{ stage_id: { _eq: 30 } }, { user_coded: { _eq: $user } }' : regularFilter;
      case 30:
        return historyMode ? '{ stage_id: { _gt: $stage_id } }, { user_qced: { _eq: $user } }' : regularFilter;
      case 40:
        return historyMode ? '{ stage_id: { _gt: $stage_id } }, { user_qaed: { _eq: $user } }' : regularFilter;
      default:
        return regularFilter;
    }
  })(Number(stageId), _props.historyMode);

  const [getDocs, { error, data }] = useLazyQuery<Documents, DocumentsVariables>(setQueryFilter(documentFilter), {
    variables: {
      workflow_id: wflowId,
      stage_id: stageId,
      user: user_id,
      offset: offset.current,
      limit: fetchLimit,
    },
    fetchPolicy: 'no-cache',
  });

  const options = {
    root: document.querySelector('#documents-table'), // relative to document viewport
    rootMargin: '0px', // margin around root. Values are similar to css property. Unitless values not allowed
    threshold: 0.25, // visible amount of item shown in relation to root
  };
  // we need to set an element for the observer to observer
  const [setElement, entry] = useIntersect({ options });
  const [
    isLeaving,
    {
      setFalse = (entry: IntersectionObserverEntry) => {
        if (!entry.isIntersecting) return false;
      },
      setTrue = (entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) return true;
      },
    },
  ] = useBoolean(false);

  // handle initial load
  useEffect(() => {
    if (data && data.workflow_documents.length > 0) {
      const aggCount = data.workflow_documents_aggregate.aggregate?.count;
      if (aggCount) totalRecords.current = aggCount;
      fetchedRecords.current += data.workflow_documents.length;
      setItems((items) => items.concat(data.workflow_documents));

      //set first doc queried to be the start when "start review" button is clicked
      if (offset.current === 0 && !_props.historyMode) _props.setDocToReview(data.workflow_documents[0]);
    } else {
      if (data === undefined) getDocs();
    }
  }, [data]);

  // if we cross our boundry check if we're entering it and query if needed
  useEffect(() => {
    if (entry.isIntersecting) {
      // we are ENTERING the "capturing frame". Set the flag.
      // using this flag because I only care about when we're entering
      setTrue(entry);
      if (fetchedRecords.current < totalRecords.current) {
        offset.current += fetchLimit;
        getDocs();
      }
    } else if (isLeaving) {
      // we are EXITING the "capturing frame"
      setFalse(entry);
    }
  }, [entry.intersectionRatio]);

  if (error) {
    throw DocumentsQueryError(error);
  }

  const columns: IColumn[] = [
    { key: 'col1', name: 'Collection', fieldName: 'SCHEMA_NAME', minWidth: 100, maxWidth: 100 },
    { key: 'col16', name: 'Stage User', fieldName: 'stage_user', minWidth: 100, maxWidth: 100 },
    { key: 'col2', name: 'Accession #', fieldName: 'acc_no', minWidth: 100, maxWidth: 100 },
    { key: 'col3', name: 'Decision', fieldName: 'RESULT', minWidth: 100, maxWidth: 100 },
    { key: 'col4', name: 'Decision Details', fieldName: 'result2', minWidth: 100, maxWidth: 100 },
    { key: 'col5', name: 'Container', fieldName: 'ctr', minWidth: 100, maxWidth: 100 },
    { key: 'col6', name: 'FPage', fieldName: 'fpage', minWidth: 100, maxWidth: 100 },
    { key: 'col7', name: 'LPage', fieldName: 'lpage', minWidth: 100, maxWidth: 100 },
    { key: 'col8', name: 'Pages', fieldName: 'pages', minWidth: 100, maxWidth: 100 },
    { key: 'col9', name: 'Related', fieldName: 'child_count', minWidth: 100, maxWidth: 100 },
    { key: 'col10', name: 'Added', fieldName: 'date_added', minWidth: 100, maxWidth: 110 },
    { key: 'col11', name: 'Updated', fieldName: 'updatex', minWidth: 100, maxWidth: 110 },
    { key: 'col12', name: 'Comments', fieldName: 'comments', minWidth: 100, maxWidth: 100 },
    { key: 'col13', name: 'Title', fieldName: 'title', minWidth: 100, maxWidth: 100 },
    { key: 'col14', name: 'Result 3', fieldName: 'result_3', minWidth: 100, maxWidth: 100 },
    { key: 'col15', name: 'Redacted Pages', fieldName: 'redacted_pages', minWidth: 100, maxWidth: 100 },
  ];

  const _onRenderRow: IDetailsListProps['onRenderRow'] = (props) => {
    if (props) {
      // set my intersection observer to the last element rendered on the row
      if (props.itemIndex === items.length - 1) {
        return (
          <div ref={setElement}>
            <DetailsRow {...props} />
          </div>
        );
      } else {
        return <DetailsRow {...props} />;
      }
    }
    return null;
  };
  return (
    <div data-is-scrollable id="documents-table">
      <DetailsList items={items} columns={columns} selectionMode={SelectionMode.none} onRenderRow={_onRenderRow} />
    </div>
  );
}

function DocumentsQueryError(innerError?: Error) {
  const innerErrorString = innerError ? `Inner Error: ${innerError}` : '';
  return new Error(`Failed to load documents with error: ${innerErrorString}`);
}

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to fetch documents with error: ${props.error} `}</Text>;
}

const DocumentViewer = withErrorBoundary(DocumentViewerComponent, ErrorFallback);
export default DocumentViewer;

function setQueryFilter(userAndStageFilter: string): DocumentNode {
  return gql(`
    query Documents($workflow_id: float8, $stage_id: float8, $user: String, $limit: Int, $offset: Int) {
      workflow_documents(
            where: {_and: [ ${userAndStageFilter} , { workflow_id: { _eq: $workflow_id } }]}
            limit: $limit
            offset: $offset
      ) {
          ID
          title
          acc_no
          parent
          stage
          stage_id
          stage_user
          prev_stage_user
          user_coded
          workflow_id
          source_id
          RESULT
          result2
          result3
          ctr
          child_count
          date_added
          date_due
          updatex
          COMMENTS
          redacted_pages
          ads_udi
          SCHEMA_NAME
          fpage
          lpage
          pages
      }
    workflow_documents_aggregate(
      where: {_and: [ ${userAndStageFilter} , { workflow_id: { _eq: $workflow_id } }]}
    ) {
      aggregate {
        count
      }
    }
    }
  `);
}
