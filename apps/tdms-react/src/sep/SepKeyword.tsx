import React from 'react';
import { PageWithIntro } from '@nwm/uifabric';
import { useParamsEncoded } from '@nwm/react-hooks';
import DtnList from '../components/list/dtn/DtnList';
import SepTextBlocks from './SepTextBlocks';
import { TransferComponent } from '../query/Transfer';

export default function SepKeyword() {
  const [keyword] = useParamsEncoded();
  return (
    <PageWithIntro title={`Site & Engineering Properties by Keyword: ${keyword}`}>
      <SepTextBlocks />
      <DtnList keyword={keyword} transfer={TransferComponent.SEP} />
    </PageWithIntro>
  );
}
