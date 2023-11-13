import React from 'react';
import { DevSourceBranchFragment } from './__generated__/DevSourceBranchFragment';
import { DescendantBranchFragment } from './__generated__/DescendantBranchFragment';
import { SupersededByBranchFragment } from './__generated__/SupersededByBranchFragment';
import BuildBranch from './BuildBranch';
import BuildItem from './BuildItem';

/**
 * BranchData
 * interface for possible data sources passed to Branch
 */
export interface BranchData {
  devSourceData?: DevSourceBranchFragment;
  descendantData?: DescendantBranchFragment;
  supersededByData?: SupersededByBranchFragment;
}

/**
 * BranchProps
 * interface for props passed to Branch
 */
export interface BranchProps {
  data?: BranchData;
  traceType: string;
}

/**
 * Branch
 * @param {BranchProps} props
 * @returns {ReactFragment}
 * creates the branch based on traceType
 */
export function Branch(props: BranchProps) {
  const { data, traceType } = props;
  let branchElement;
  switch (traceType) {
    case 'source':
      branchElement = SourceTrace(data?.devSourceData?.data_set_dev_sources);
      break;
    case 'descendant':
      branchElement = DescendantTrace(data?.descendantData?.dev_source_ds_2_data_set_ds);
      break;
    case 'supersede':
      branchElement = SupersedeTrace(data?.supersededByData?.data_set_superseded_bies);
      break;
  }
  return <>{branchElement}</>;

  /**
   * SupersedeTrace
   * @param {any} data
   * @returns {ReactFragment}
   * builds the superseded trace tree
   */
  function SupersedeTrace(data: any) {
    let level = 1;
    return (
      <>
        {data.map((item: any, idx: number) => {
          return (
            <BuildItem
              traceType={traceType}
              ds={item.superseded_by_dtn}
              idx={idx}
              level={level}
              hideLevel={true}
              hideSQVPT={true}
              hideSuperseded={true}
            />
          );
        })}
      </>
    );
  }

  /**
   * SourceTrace
   * @param {object} data
   * @returns {ReactFragment}
   * builds the source trace tree
   */
  function SourceTrace(data: any) {
    let level = 1;
    return (
      <>
        {data.map((item: any, idx: number) => {
          return buildSourceChildren(item, idx, level);
        })}
      </>
    );

    /**
     * buildSourceChildren
     * @param {object} item
     * @param {number} idx
     * @param {number} level
     * @returns {any}
     * recursively builds the child branches, from item.data_set.data_set_dev_sources, until none exist and calls the BuildBranch component with the branch tree
     */
    function buildSourceChildren(item: any, idx: number, level: number) {
      if (!hasDataSet(item)) {
        return <></>;
      } else {
        const branches = item.data_set.data_set_dev_sources.map((item: any, idx: number) => {
          const childLevel = level + 1;
          return buildSourceChildren(item, idx, childLevel);
        });
        return (
          <BuildBranch
            traceType={traceType}
            ds={item.ds}
            idx={idx}
            level={level}
            sqvpt={item.data_set.pmr_dataset_status}
            supersededBy={item.data_set.data_set_superseded_bies}
            branches={branches}
          />
        );
      }
    }

    /**
     * hasDataSet
     * @param item
     * @returns {boolean}
     * checks if item contains data_set
     */
    function hasDataSet(item: any) {
      return !(typeof item === 'undefined' || typeof item.data_set === 'undefined');
    }
  }

  /**
   * DescendantTrace
   * @param {any} data
   * @returns {ReactFragment}
   * builds the descendant trace tree
   */
  function DescendantTrace(data: any) {
    let level = 1;
    return (
      <>
        {data.map((item: any, idx: number) => {
          return buildDescendantChildren(item, idx, level);
        })}
      </>
    );

    /**
     * buildDescendantChildren
     * @param {object} item
     * @param {number} idx
     * @param {number} level
     * @returns {any}
     * recursively builds the child branches, from item.dataSetByDsKey.dev_source_ds_2_data_set_ds, until none exist and calls the BuildBranch component with the branch tree
     */
    function buildDescendantChildren(item: any, idx: number, level: number) {
      if (!hasDataSetByDsKey(item)) {
        return <></>;
      } else {
        const branches = item.dataSetByDsKey.dev_source_ds_2_data_set_ds.map((item: any, idx: number) => {
          const childLevel = level + 1;
          return buildDescendantChildren(item, idx, childLevel);
        });
        return (
          <BuildBranch
            traceType={traceType}
            ds={item.dataSetByDsKey.ds}
            idx={idx}
            level={level}
            sqvpt={item.dataSetByDsKey.pmr_dataset_status}
            supersededBy={item.dataSetByDsKey.data_set_superseded_bies}
            branches={branches}
          />
        );
      }
    }

    /**
     * hasDataSetByDsKey
     * @param item
     * @returns {boolean}
     * checks if item contains dataSetByDsKey and dev_source_ds_2_data_set_ds
     */
    function hasDataSetByDsKey(item: any) {
      return !(
        typeof item === 'undefined' ||
        typeof item.dataSetByDsKey === 'undefined' ||
        typeof item.dataSetByDsKey.dev_source_ds_2_data_set_ds === 'undefined'
      );
    }
  }
}
export default React.memo(Branch);
