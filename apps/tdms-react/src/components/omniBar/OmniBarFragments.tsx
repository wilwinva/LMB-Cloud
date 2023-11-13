import { gql } from '@apollo/client';
import { STANDARD_TABLE_QUERY } from './results/StandardTable';
import { RECORDS_ROADMAP_TABLE_QUERY } from './results/RecordsRoadmapTable';
import { CATEGORIES_TABLE_QUERY } from './results/CategoriesTable';
import { STATUS_TABLE_QUERY } from './results/DataSetStatusTable';
import { PARAMETERS_TABLE_QUERY } from './results/ParametersDateKeywordsTable';
import { SUBMITTAL_TEXT_TABLE_QUERY } from './results/SubmittalTextTable';
import { SUBMITTALID_TABLE_QUERY } from './results/SubmittalIdTable';
import { SOURCE_TABLE_QUERY } from './results/SourcesTable';
import { ADMIN_TABLE_QUERY } from './results/AdminTable';
import { ACQDEV_TABLE_QUERY } from './results/AcqDevTable';

/**
 * todo -- Contains both old and new fragments... clean up to only use new fragments. This would be a good time to also remove
 *   the original components that are now deprecated.
 */
export const OMNI_QUERY = gql`
  query OmniQuery(
    $leftSearch: String!
    $midSearch: String!
    $intSearch: Int!
    $standard: Boolean!
    $categories: Boolean!
    $parameters: Boolean!
    $status: Boolean!
    $submittalText: Boolean!
    $submittalId: Boolean!
    $acqDev: Boolean!
    $sources: Boolean!
    $roadmap: Boolean!
    $admin: Boolean!
  ) {
    db_tdms_data_set(
      where: {
        _or: [
          { ds: { _ilike: $midSearch } }
          { data_set_title: { title: { _ilike: $midSearch } } }
          { data_set_parameters: { parameter: { name: { _ilike: $midSearch } } } }
          { data_set_parameters: { parameter_no: { _eq: $intSearch } } }
          { tdif_no: { _eq: $intSearch } }
          { pi_last_nm: { _ilike: $midSearch } }
          { pi_first_nm: { _ilike: $midSearch } }
          { pi_middle_nm: { _ilike: $midSearch } }
          { pi_org: { _ilike: $leftSearch } }
          { data_set_records: { accn: { _ilike: $midSearch } } }
          { data_set_records: { pkg_id: { _ilike: $midSearch } } }
          { data_set_activity: { act: { _ilike: $midSearch } } }
          { data_set_dev_sources: { ds: { _ilike: $midSearch } } }
          { rpt: { _ilike: $leftSearch } }
          { tdif: { preparer_last_nm: { _ilike: $leftSearch } } }
          { tdif: { preparer_first_nm: { _ilike: $leftSearch } } }
          { tdif: { preparer_middle_nm: { _ilike: $leftSearch } } }
          { tdif: { preparer_org: { _ilike: $midSearch } } }
          { data_set_wbs: { wbs_no: { _ilike: $leftSearch } } }
          { data_set_superseded_bies: { superseded_by_dtn: { _ilike: $leftSearch } } }
          { data_set_supersedes: { supersedes_dtn: { _ilike: $leftSearch } } }
          { data_set_methods: { descr: { _ilike: $midSearch } } }
          { data_set_stns: { stn_no: { _ilike: $leftSearch } } }
          { data_set_acq_sources: { name: { _ilike: $leftSearch } } }
          { data_set_locations: { name: { _ilike: $midSearch } } }
          { data_set_managements: { descr: { _ilike: $midSearch } } }
          { data_set_records_roadmaps: { rec_num: { _ilike: $leftSearch } } }
          { data_set_records_roadmaps: { rec_title: { _ilike: $midSearch } } }
          { data_set_records_roadmaps: { rec_contents: { _ilike: $midSearch } } }
          { data_set_tics: { tic_no: { _eq: $intSearch } } }
          { data_set_src_tics: { src_tic_no: { _eq: $intSearch } } }
        ]
      }
    ) {
      ...StandardTableFragment @include(if: $standard)
      ...CategoriesTableFragment @include(if: $categories)
      ...StatusTableFragment @include(if: $status)
      ...CategoriesTableFragment @include(if: $categories)
      ...ParametersTableFragment @include(if: $parameters)
      ...SubmittalTextTableFragment @include(if: $submittalText)
      ...SubmittalIdTableFragment @include(if: $submittalId)
      ...AcqDevTableFragment @include(if: $acqDev)
      ...SourceTableFragment @include(if: $sources)
      ...RecordsRoadmapTableFragment @include(if: $roadmap)
      ...AdminTableFragment @include(if: $admin)
    }
  }
  ${STANDARD_TABLE_QUERY}
  ${CATEGORIES_TABLE_QUERY}
  ${STATUS_TABLE_QUERY}
  ${CATEGORIES_TABLE_QUERY}
  ${PARAMETERS_TABLE_QUERY}
  ${SUBMITTALID_TABLE_QUERY}
  ${SUBMITTAL_TEXT_TABLE_QUERY}
  ${ACQDEV_TABLE_QUERY}
  ${SOURCE_TABLE_QUERY}
  ${RECORDS_ROADMAP_TABLE_QUERY}
  ${ADMIN_TABLE_QUERY}
`;
