import React from 'react';
import { PageWithIntro } from '@nwm/uifabric';
import { useParamsEncoded } from '@nwm/react-hooks';
import DtnList from '../components/list/dtn/DtnList';
import SpaTextBlocks from './SpaTextBlocks';
import { TransferComponent } from '../query/Transfer';

export default function SpaKeyword() {
  const [keyword] = useParamsEncoded();

  return (
    <PageWithIntro title={`System Performance Assessment by Keyword: ${keyword}`}>
      <SpaTextBlocks />
      <DtnList keyword={keyword} transfer={TransferComponent.SPA} />
    </PageWithIntro>
  );
}
