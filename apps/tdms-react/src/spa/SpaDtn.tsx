import React from 'react';
import { PageWithIntro } from '@nwm/uifabric';
import SpaTextBlocks from './SpaTextBlocks';
import { TransferComponent } from '../query/Transfer';
import DtnList from '../components/list/dtn/DtnList';
import { useParamsEncoded } from '@nwm/react-hooks';

export default function SpaDtn() {
  const [dtnModelDs] = useParamsEncoded();
  return (
    <PageWithIntro title="System Performance Assessment by Category: All">
      <SpaTextBlocks />
      <DtnList transfer={TransferComponent.SPA} ds={dtnModelDs} />
    </PageWithIntro>
  );
}
