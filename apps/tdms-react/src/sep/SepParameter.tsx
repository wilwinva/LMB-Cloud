import React from 'react';
import { PageWithIntro } from '@nwm/uifabric';
import { useParamsEncoded } from '@nwm/react-hooks';
import DtnList from '../components/list/dtn/DtnList';
import SepTextBlocks from './SepTextBlocks';
import { TransferComponent } from '../query/Transfer';

export default function SepParameter() {
  const [parameter] = useParamsEncoded();
  return (
    <PageWithIntro title={`Site & Engineering Properties by Parameter: ${parameter}`}>
      <SepTextBlocks />
      <DtnList parameter={parameter} transfer={TransferComponent.SEP} />
    </PageWithIntro>
  );
}
