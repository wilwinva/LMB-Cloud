import React from 'react';
import { Text } from 'office-ui-fabric-react';
import { PageWithIntro } from '@nwm/uifabric';
import { useParamsEncoded } from '@nwm/react-hooks';
import TextBlocks from './searchTextBlock';
import DtnList from '../list/dtn/DtnList';
import { TransferComponent } from '../../query/Transfer';

export interface ISearchReults {
  title: string;
  searchBy: string;
  textBlock: string;
  transfer?: TransferComponent;
}
export default function SearchResults(props: ISearchReults) {
  const [keyword] = useParamsEncoded();
  const pageHeader = 'Search By Keyword ' + keyword;

  return (
    <PageWithIntro title="System Performance Assessment by Keyword">
      <TextBlocks textBlock={props.textBlock} />
      <Text variant="large" style={{ fontWeight: 600 }}>
        {pageHeader}
      </Text>
      <DtnList keyword={keyword} transfer={props.transfer} />
    </PageWithIntro>
  );
}
