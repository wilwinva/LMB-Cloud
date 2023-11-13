import React from 'react';
import { IStackStyles, Stack, Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { TreeComponentQuery, TreeComponentQueryVariables } from './__generated__/TreeComponentQuery';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import { Loading } from '@nwm/util';
import { useParamsEncoded } from '@nwm/react-hooks';
import { getTheme, IPalette } from 'office-ui-fabric-react/lib/Styling';
import { DECENDANT_BRANCH, DEV_SOURCE_BRANCH, SQVPT, SUPERSEDED_BY, SUPERSEDED_BY_BRANCH } from './BranchFragments';
import Branch, { BranchData } from './Branch';
import BuildItem from './BuildItem';
import { SqvptModal } from '../tdif/SqvptModal';

/**
 * TreeProps
 * interface for traceType passed to TreeComponent
 */
export interface TreeProps {
  traceType: string;
}
const stackStyles: IStackStyles = {
  root: {
    border: '2px solid',
    minWidth: 800,
  },
};
const blurbStyles: IStackStyles = {
  root: {
    borderBottom: '2px solid',
    padding: 4,
  },
};
const branchStyles: IStackStyles = {
  root: {
    padding: 16,
  },
};

/**
 * TREE_COMPONENT_QUERY
 * @param {string} $ds (nulls not allowed) - query for
 * @param {boolean} $source (nulls not allowed) - used to include or omit fragment
 * @param {boolean} $descendant (nulls not allowed) - used to include or omit fragment
 * @param {boolean} $supersede (nulls not allowed) - used to include or omit fragment
 * @returns data - 1 of 3 possible branch fragments
 */
const TREE_COMPONENT_QUERY = gql`
  query TreeComponentQuery($ds: String!, $source: Boolean!, $descendant: Boolean!, $supersede: Boolean!) {
    db_tdms_data_set(where: { ds: { _eq: $ds } }) {
      ds
      ds_key
      ...SqvptFragment @skip(if: $supersede)
      ...SupersededByFragment @skip(if: $supersede)
      ...DevSourceBranchFragment @include(if: $source)
      ...DescendantBranchFragment @include(if: $descendant)
      ...SupersededByBranchFragment @include(if: $supersede)
    }
  }
  ${SQVPT}
  ${SUPERSEDED_BY}
  ${DEV_SOURCE_BRANCH}
  ${DECENDANT_BRANCH}
  ${SUPERSEDED_BY_BRANCH}
`;

/**
 * TreeComponent
 * @param {TreeProps} _props
 * @returns {any}
 * @constructor
 */
export function TreeComponent(_props: TreeProps) {
  const { traceType } = _props;
  const source = traceType === 'source'; //boolean based on traceType, used in query
  const descendant = traceType === 'descendant'; //boolean based on traceType, used in query
  const supersede = traceType === 'supersede'; //boolean based on traceType, used in query

  const [tdifId] = useParamsEncoded(); //gets tdif from context
  const { loading, error, data } = useQuery<TreeComponentQuery, TreeComponentQueryVariables>(TREE_COMPONENT_QUERY, {
    variables: { ds: tdifId, source: source, descendant: descendant, supersede: supersede },
  });

  if (!tdifId || error !== undefined) {
    throw TdifError(tdifId, error);
  }

  if (loading || data === undefined) {
    return <Loading />;
  }

  const trunk = data.db_tdms_data_set[0]; //load 1st (and should be only) dataset
  const branches: BranchData = {
    devSourceData: { ...trunk },
    descendantData: { ...trunk },
    supersededByData: { ...trunk },
  };

  const headerTitle = traceType + ' Trace for DTN: ' + trunk.ds;
  let sqvpt;
  let hideLevel = false;
  let hideSQVPT = false;
  let hideSuperseded = false;
  if (!supersede) {
    //load data if not supersededBy Branch
    sqvpt = trunk.pmr_dataset_status;
  } else {
    //set true if supersededBy Branch
    hideLevel = true;
    hideSQVPT = true;
    hideSuperseded = true;
  }

  const palette: IPalette = getTheme().palette;

  const headerStyles: IStackStyles = {
    root: {
      background: palette.themeTertiary,
      borderBottom: '2px solid',
      padding: 4,
      selectors: {
        span: {
          textTransform: 'capitalize',
        },
      },
    },
  };

  return (
    <>
      <Stack styles={stackStyles}>
        <Stack styles={headerStyles}>
          <Text variant="large"> {headerTitle}</Text>
        </Stack>
        <Stack styles={blurbStyles}>
          <Text>
            Note:
            <br />
            DTNs are indented to show parentage. The bracketed information is the SQVPT code. [
            <span>
              <SqvptModal />
            </span>
            ] The number following the SQVPT is the level in relation to the root DTN (which is level 0), any
            superseding DTNs for this {traceType} trace for the superseding DTN(s) is not done.
          </Text>
        </Stack>
        <Stack styles={branchStyles}>
          <BuildItem
            traceType={traceType}
            ds={trunk.ds}
            idx={0}
            level={0}
            sqvpt={sqvpt}
            hideLevel={hideLevel}
            hideSQVPT={hideSQVPT}
            hideSuperseded={hideSuperseded}
          />
          <Branch data={branches} traceType={traceType} />
        </Stack>
      </Stack>
    </>
  );
}

function TdifError(tdif: string = '', innerError?: Error) {
  const innerErrorString = innerError ? `Inner Error: ${innerError}` : '';
  return new Error(`Failed to find TDIF with ds: ${tdif}.${innerErrorString}`);
}

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to fetch tdif with error: ${props.error} `}</Text>;
}

const TreeDocument = withErrorBoundary(TreeComponent, ErrorFallback);
export default TreeDocument;
