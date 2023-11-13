import React from 'react';
import { gql, useQuery } from '@apollo/client';

import { ListDtnByCategoryQuery, ListDtnByCategoryQueryVariables } from './__generated__/ListDtnByCategoryQuery';
import { TransferComponent as TransferComponentTypes } from '../../../query/Transfer';
import StandardTable, { STANDARD_TABLE_QUERY } from '../../omniBar/results/StandardTable';
import { Loading } from '@nwm/util';

export enum DtnModCategories {
  biod = 'Biosphere & Disruptive Events Modeling Data',
  bio = 'Biosphere Modeling Data',
  disrupt = 'Disruptive Events Modeling Data',
  eis = 'EIS Modeling Data',
  ism = 'Geologic/Mineralogic Modeling Data',
  nfg = 'Near-Field/Geochemical Modeling Data',
  nye = 'Nye County Oversight Data',
  rip = 'Repository Integration Program',
  szone = 'Saturated Zone Modeling Data',
  sdm = 'Subsurface Design Modeling Data',
  th = 'Thermal Hydrology Modeling Data',
  uccsn = 'University and Community College System of Nevada Oversight Data',
  hydro = 'UZ & SZ Hydrology Modeling Data',
  transport = 'UZ & SZ Transport Modeling Data',
  wform = 'Waste Form Degredation',
  wfd = 'Waste Package & Waste Form Degredation',
}

export const LIST_DTN_BY_CATEGORY_QUERY = gql`
  query ListDtnByCategoryQuery($modcat: String, $transfer: String, $ds: String) {
    db_tdms_data_set(
      order_by: { ds: asc }
      where: {
        _and: [
          { transfer: { component: { _eq: $transfer } } }
          { ds: { _eq: $ds } }
          { mod_dtns: { mod_category: { modcat_descr: { _eq: $modcat } } } }
        ]
        _not: { data_set_superseded_bies: { superseded_by_dtn: { _neq: "" } } }
      }
    ) {
      ...StandardTableFragment
    }
  }
  ${STANDARD_TABLE_QUERY}
`;

export interface DtnListProps {
  dtnCategory?: DtnModCategories;
  transfer?: TransferComponentTypes;
  ds?: string;
}

function DtnList(props: DtnListProps) {
  const vars = { modcat: props.dtnCategory, transfer: props.transfer, ds: props.ds };
  const { loading, error, data } = useQuery<ListDtnByCategoryQuery, ListDtnByCategoryQueryVariables>(
    LIST_DTN_BY_CATEGORY_QUERY,
    { variables: vars }
  );

  if (error !== undefined) {
    throw error;
  }

  if (loading || data === undefined) {
    return <Loading />;
  }

  //todo -- should probably move the core of standard table to its own shared component that this component and standard table
  //  use since these two could have requirement deviations in the future. Since that hasn't happened yet this will work
  // correctly for now.
  return <StandardTable data={data.db_tdms_data_set} defaultSort={{ key: 'DTN', isSortedDescending: true }} />;
}
export default React.memo(DtnList);
