import React from 'react';
import { PageWithIntro } from '@nwm/uifabric';
import MwdTextBlocks from './MwdTextBlocks';
import { TransferComponent } from '../query/Transfer';
import ListDtnByCategory, { DtnModCategories } from '../components/list/dtn/ListDtnByCategory';

export default function Disruptive() {
  return (
    <PageWithIntro title="Model Warehouse Data by Category: Disruptive Events Modeling Data">
      <MwdTextBlocks />
      <ListDtnByCategory dtnCategory={DtnModCategories.disrupt} transfer={TransferComponent.MWD} />
    </PageWithIntro>
  );
}
