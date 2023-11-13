import React from 'react';
import { PageWithIntro } from '@nwm/uifabric';
import SpaTextBlocks from './SpaTextBlocks';
import ListDtnByCategory, { DtnModCategories } from '../components/list/dtn/ListDtnByCategory';
import { TransferComponent } from '../query/Transfer';

export default function CountyData() {
  return (
    <PageWithIntro title="System Performance Assessment by Category: Nye County Oversight Data">
      <SpaTextBlocks />
      <ListDtnByCategory dtnCategory={DtnModCategories.nye} transfer={TransferComponent.SPA} />
    </PageWithIntro>
  );
}
