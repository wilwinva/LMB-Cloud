import { gql } from '@apollo/client';

export const SQVPT = gql`
  fragment SqvptFragment on db_tdms_data_set {
    pmr_dataset_status {
      ds_type
      ds_qual
      verified
      pmramr
      tpo
      prelim_data
    }
  }
`;

export const SUPERSEDED_BY = gql`
  fragment SupersededByFragment on db_tdms_data_set {
    data_set_superseded_bies(where: { superseded_by_dtn: { _neq: "" } }) {
      superseded_by_dtn
    }
  }
`;

export const SQVPT_SUPERSEDEDBY = gql`
  fragment SqvptSupersededByFragment on db_tdms_data_set {
    ...SqvptFragment
    ...SupersededByFragment
  }
`;

export const SUPERSEDED_BY_BRANCH = gql`
  fragment SupersededByBranchFragment on db_tdms_data_set {
    ...SupersededByFragment
  }
`;

export const DECENDANT_BRANCH = gql`
  fragment DescendantBranchFragment on db_tdms_data_set {
    ...SqvptSupersededByFragment
    dev_source_ds_2_data_set_ds(order_by: { dataSetByDsKey: { ds: asc } }) {
      dataSetByDsKey {
        ds
        ds_key
        ...SqvptSupersededByFragment
        dev_source_ds_2_data_set_ds(order_by: { dataSetByDsKey: { ds: asc } }) {
          dataSetByDsKey {
            ds
            ds_key
            ...SqvptSupersededByFragment
            dev_source_ds_2_data_set_ds(order_by: { dataSetByDsKey: { ds: asc } }) {
              dataSetByDsKey {
                ds
                ds_key
                ...SqvptSupersededByFragment
                dev_source_ds_2_data_set_ds(order_by: { dataSetByDsKey: { ds: asc } }) {
                  dataSetByDsKey {
                    ds
                    ds_key
                    ...SqvptSupersededByFragment
                    dev_source_ds_2_data_set_ds(order_by: { dataSetByDsKey: { ds: asc } }) {
                      dataSetByDsKey {
                        ds
                        ds_key
                        ...SqvptSupersededByFragment
                        dev_source_ds_2_data_set_ds(order_by: { dataSetByDsKey: { ds: asc } }) {
                          dataSetByDsKey {
                            ds
                            ds_key
                            ...SqvptSupersededByFragment
                            dev_source_ds_2_data_set_ds(order_by: { dataSetByDsKey: { ds: asc } }) {
                              dataSetByDsKey {
                                ds
                                ds_key
                                ...SqvptSupersededByFragment
                                dev_source_ds_2_data_set_ds(order_by: { dataSetByDsKey: { ds: asc } }) {
                                  dataSetByDsKey {
                                    ds
                                    ds_key
                                    ...SqvptSupersededByFragment
                                    dev_source_ds_2_data_set_ds(order_by: { dataSetByDsKey: { ds: asc } }) {
                                      dataSetByDsKey {
                                        ds
                                        ds_key
                                        ...SqvptSupersededByFragment
                                        dev_source_ds_2_data_set_ds(order_by: { dataSetByDsKey: { ds: asc } }) {
                                          dataSetByDsKey {
                                            ds
                                            ds_key
                                            ...SqvptSupersededByFragment
                                            dev_source_ds_2_data_set_ds(order_by: { dataSetByDsKey: { ds: asc } }) {
                                              dataSetByDsKey {
                                                ds
                                                ds_key
                                                ...SqvptSupersededByFragment
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${SQVPT_SUPERSEDEDBY}
`;

export const DEV_SOURCE_BRANCH = gql`
  fragment DevSourceBranchFragment on db_tdms_data_set {
    ...SqvptSupersededByFragment
    data_set_dev_sources(where: { ds: { _neq: "" } }) {
      ds
      data_set {
        ...SqvptSupersededByFragment
        data_set_dev_sources(where: { ds: { _neq: "" } }) {
          ds
          data_set {
            ...SqvptSupersededByFragment
            data_set_dev_sources(where: { ds: { _neq: "" } }) {
              ds
              data_set {
                ...SqvptSupersededByFragment
                data_set_dev_sources(where: { ds: { _neq: "" } }) {
                  ds
                  data_set {
                    ...SqvptSupersededByFragment
                    data_set_dev_sources(where: { ds: { _neq: "" } }) {
                      ds
                      data_set {
                        ...SqvptSupersededByFragment
                        data_set_dev_sources(where: { ds: { _neq: "" } }) {
                          ds
                          data_set {
                            ...SqvptSupersededByFragment
                            data_set_dev_sources(where: { ds: { _neq: "" } }) {
                              ds
                              data_set {
                                ...SqvptSupersededByFragment
                                data_set_dev_sources(where: { ds: { _neq: "" } }) {
                                  ds
                                  data_set {
                                    ...SqvptSupersededByFragment
                                    data_set_dev_sources(where: { ds: { _neq: "" } }) {
                                      ds
                                      data_set {
                                        ...SqvptSupersededByFragment
                                        data_set_dev_sources(where: { ds: { _neq: "" } }) {
                                          ds
                                          data_set {
                                            ...SqvptSupersededByFragment
                                            data_set_dev_sources(where: { ds: { _neq: "" } }) {
                                              ds
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${SQVPT_SUPERSEDEDBY}
`;
