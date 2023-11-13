import React from 'react';
import { PageWithIntro } from '@nwm/uifabric';
import { TransferComponent } from '../query/Transfer';
import DtnList from '../components/list/dtn/DtnList';
import { useParamsEncoded } from '@nwm/react-hooks';
import SepTextBlocks from './SepTextBlocks';

export default function SpaDtn() {
  const [dtnModelDs] = useParamsEncoded();
  return (
    <PageWithIntro title="Site & Engineering Properties by Category: All">
      <SepTextBlocks />
      <DtnList transfer={TransferComponent.SEP} ds={dtnModelDs} />
    </PageWithIntro>
  );
}
