import React from 'react';
import BuildItem from './BuildItem';

/**
 * BuildBranchProps
 * interface for possible data sources passed to BuildBranch
 */
export interface BuildBranchProps {
  traceType: string;
  ds: string;
  idx: number;
  level?: number;
  sqvpt?: any;
  supersededBy?: any;
  branches?: Array<object>;
  hideLevel?: boolean;
  hideSQVPT?: boolean;
  hideSuperseded?: boolean;
}

/**
 * BuildBranch
 * @param {BuildBranchProps} props
 * @returns {any}
 * @constructor
 */
export function BuildBranch(props: BuildBranchProps) {
  const { traceType, ds, idx, level, sqvpt, supersededBy, branches, hideLevel, hideSQVPT, hideSuperseded } = props;
  return (
    <>
      <BuildItem
        traceType={traceType}
        ds={ds}
        idx={idx}
        level={level}
        sqvpt={sqvpt}
        supersededBy={supersededBy}
        hideLevel={hideLevel}
        hideSQVPT={hideSQVPT}
        hideSuperseded={hideSuperseded}
      />
      {branches}
    </>
  );
}

export default React.memo(BuildBranch);
