import React from 'react';
import { PageWithIntro } from '@nwm/uifabric';
import SpaTextBlocks from './SpaTextBlocks';
import ListDtnByCategory, { DtnModCategories } from '../components/list/dtn/ListDtnByCategory';
import { TransferComponent } from '../query/Transfer';

export default function UniversityData() {
  return (
    <PageWithIntro title="System Performance Assessment by Category: University and Community College System of Nevada Oversight Data">
      <SpaTextBlocks />
      <ListDtnByCategory dtnCategory={DtnModCategories.uccsn} transfer={TransferComponent.SPA} />
    </PageWithIntro>
  );
}
