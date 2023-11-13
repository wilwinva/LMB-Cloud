import React, { useEffect, useRef, useState } from 'react';
import { mergeStyleSets, Text } from 'office-ui-fabric-react';
import { DocumentNode, useLazyQuery } from '@apollo/client';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import { WorkflowDocumentFragment } from './__generated__/WorkflowDocumentFragment';
import { useConstCallback } from '@uifabric/react-hooks';
import RelatedRecordsTable from './RelatedRecordsTable';
import useIntersect from '../hooks/useIntersect';
import { RELATEDRECORDS_RIS, RELATEDRECORDS_RIS_risdata_doe_related_rec } from './__generated__/RELATEDRECORDS_RIS';
import {
  EMAIL_RELATED_RECORDS,
  EMAIL_RELATED_RECORDS_email_doe_related_rec,
} from './__generated__/EMAIL_RELATED_RECORDS';

interface RecordsProps {
  gqlQuery: DocumentNode;
  document: WorkflowDocumentFragment;
}
export function RecordsComponent(props: RecordsProps) {
  const fetchLimit = 20; // container_height/rows_per_page.
  const offset = useRef(0);
  const totalRecords = useRef(0);
  const fetchedRecords = useRef(0);
  const [items, setItems] = useState<any[]>([]);

  const [getItems, { error, data }] = useLazyQuery(props.gqlQuery, {
    variables: { ads_udi: props.document.ads_udi, offset: offset.current, limit: 20 },
  });

  const options = {
    root: document.querySelector('#related-records'), // relative to document viewport
    rootMargin: '0px', // margin around root. Values are similar to css property. Unitless values not allowed
    threshold: 1.0, // visible amount of item shown in relation to root
  };
  // we need to set an element for the observer to observer
  const [setElement, entry] = useIntersect({ options });

  useEffect(() => {
    //reset items if document changes
    setItems([]);
    getItems();
  }, [props.document]);

  // handle initial load
  useEffect(() => {
    const typedData = getRelatedDoc(data);
    if (typedData) {
      const aggCount = typedData.aggCount;
      if (aggCount) totalRecords.current = aggCount;
      fetchedRecords.current += typedData.docs.length;
      if (items) setItems((items) => items.concat(typedData.docs));
    }
  }, [data]);

  // if we reach our intersection ratio and there are more records, run query
  useEffect(() => {
    if (entry.intersectionRatio > 0.9) {
      if (fetchedRecords.current < totalRecords.current) {
        offset.current += fetchLimit;
        getItems();
      }
    }
  }, [entry.intersectionRatio]);

  const styles = mergeStyleSets({
    row: {
      height: 20,
      selectors: {
        'div:first-child': {
          marginLeft: 0,
        },
        div: {
          marginLeft: 10,
          whiteSpace: 'nowrap',
          display: 'inline-block',
        },
      },
    },
  });

  const onRenderCell = useConstCallback(
    (
      item: EMAIL_RELATED_RECORDS_email_doe_related_rec | RELATEDRECORDS_RIS_risdata_doe_related_rec | undefined,
      index: number | undefined,
      isScrolling: boolean | undefined
    ) => {
      // need a better way to set the last element only
      return (
        <div className={styles.row} ref={setElement}>
          <Text as="div" nowrap={true}>
            {item?.ads_udi}
          </Text>
          <Text as="div" nowrap={true}>
            {item?.rel_rec_code}
          </Text>
          <Text as="div" nowrap={true}>
            {item?.rel_ads_udi}
          </Text>
        </div>
      );
    }
  );

  if (error) {
    throw QueryError(error);
  }

  return <RelatedRecordsTable onRenderCell={onRenderCell} items={items} />;
}

function QueryError(innerError?: Error) {
  const innerErrorString = innerError ? `Inner Error: ${innerError}` : '';
  return new Error(`Failed to load records with error: ${innerErrorString}`);
}

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to fetching records with error: ${props.error} `}</Text>;
}

function getRelatedDoc(data?: EMAIL_RELATED_RECORDS | RELATEDRECORDS_RIS) {
  if (data && (data as EMAIL_RELATED_RECORDS) && 'email_doe_related_rec' in data)
    return { docs: data.email_doe_related_rec, aggCount: data.email_doe_related_rec_aggregate.aggregate?.count };
  if (data && (data as RELATEDRECORDS_RIS) && 'risdata_doe_related_rec' in data)
    return {
      docs: data.risdata_doe_related_rec,
      aggCount: data.risdata_doe_related_rec_aggregate.aggregate?.count,
    };
  return undefined;
}

const Records = withErrorBoundary(RecordsComponent, ErrorFallback);
export default Records;
