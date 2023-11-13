import React from 'react';
import { PageWithIntro } from '@nwm/uifabric';
import { useParamsEncoded } from '@nwm/react-hooks';
import DtnList from '../components/list/dtn/DtnList';
import MwdTextBlocks from './MwdTextBlocks';
import { TransferComponent } from '../query/Transfer';

interface SearchByParameter {}

export default function MwdParameter(props: SearchByParameter) {
  const [parameter] = useParamsEncoded();

  return (
    <PageWithIntro title={`Model Warehouse Data by Parameter: ${parameter}`}>
      <MwdTextBlocks />
      <DtnList parameter={parameter} transfer={TransferComponent.MWD} />
    </PageWithIntro>
  );
}
