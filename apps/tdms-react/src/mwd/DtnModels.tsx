import React from 'react';
import { PageWithIntro } from '@nwm/uifabric';
import MwdTextBlocks from './MwdTextBlocks';
import DtnList from '../components/list/dtn/DtnList';
import { TransferComponent } from '../query/Transfer';
import { useParamsEncoded } from '@nwm/react-hooks';

export default function DtnModels() {
  const [dtnModelDs] = useParamsEncoded();

  return (
    <PageWithIntro title="Model Warehouse by Category: All">
      <MwdTextBlocks />
      <DtnList transfer={TransferComponent.MWD} ds={dtnModelDs} />
    </PageWithIntro>
  );
}
