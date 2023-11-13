import React from 'react';
import { PageWithIntro } from '@nwm/uifabric';
import MwdTextBlocks from './MwdTextBlocks';
import ListDtnByCategory, { DtnModCategories } from '../components/list/dtn/ListDtnByCategory';
import { TransferComponent } from '../query/Transfer';

export default function Biosphere() {
  return (
    <PageWithIntro title="Model Warehouse Data by Category: Biosphere Modeling Data">
      <MwdTextBlocks />
      <ListDtnByCategory dtnCategory={DtnModCategories.bio} transfer={TransferComponent.MWD} />
    </PageWithIntro>
  );
}
