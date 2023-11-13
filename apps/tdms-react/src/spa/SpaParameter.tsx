import React from 'react';
import { PageWithIntro } from '@nwm/uifabric';
import { useParamsEncoded } from '@nwm/react-hooks';
import DtnList from '../components/list/dtn/DtnList';
import SpaTextBlocks from './SpaTextBlocks';
import { TransferComponent } from '../query/Transfer';

interface SearchByParameter {}

export default function SpaParameter(props: SearchByParameter) {
  const [parameter] = useParamsEncoded();

  return (
    <PageWithIntro title={`System Performance Assessment by Parameter: ${parameter}`}>
      <SpaTextBlocks />
      <DtnList parameter={parameter} transfer={TransferComponent.SPA} />
    </PageWithIntro>
  );
}
