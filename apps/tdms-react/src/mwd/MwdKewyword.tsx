import React from 'react';
import { PageWithIntro } from '@nwm/uifabric';
import MwdTextBlocks from './MwdTextBlocks';
import { useParamsEncoded } from '@nwm/react-hooks';
import DtnList from '../components/list/dtn/DtnList';
import { TransferComponent } from '../query/Transfer';

export default function MwdKeyword() {
  const [keyword] = useParamsEncoded();

  return (
    <PageWithIntro title={`Model Warehouse Data by Keyword: ${keyword}`}>
      <MwdTextBlocks />
      <DtnList keyword={keyword} transfer={TransferComponent.MWD} />
    </PageWithIntro>
  );
}
