import { gql } from '@apollo/client';

/*
  search options for the dropdowns
 */
export const GET_SEARCH_OPTIONS = gql`
  query SearchOptions($transfer: String) {
    parameters: db_tdms_parameters(
      distinct_on: name
      order_by: { name: asc }
      where: {
        data_set_parameters: { data_set: { transfer: { component: { _eq: $transfer } } } }
        param_key: { _neq: 0 }
      }
    ) {
      param_key
      name
      definition
    }
    dtns: db_tdms_data_set(where: { transfer: { component: { _eq: $transfer } } }, order_by: { ds: asc }) {
      ds
      ds_key
    }
  }
`;
