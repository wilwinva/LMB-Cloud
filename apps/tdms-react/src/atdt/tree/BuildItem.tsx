import React from 'react';
import { IStackStyles, IStackTokens, Stack } from 'office-ui-fabric-react';
import useLinks from '../../hooks/links/useLinks';
import { Link } from 'react-router-dom';

const mSpacing = 16; //prep for themes - this is for indenting
/**
 * BranchItemProps
 * interface for data types passed to BuildItem
 */
export interface BranchItemProps {
  traceType: string;
  ds: string | null;
  idx: number;
  level?: number;
  sqvpt?: any;
  supersededBy?: any;
  hideLevel?: boolean;
  hideSQVPT?: boolean;
  hideSuperseded?: boolean;
}

/**
 * SQVPT
 * interface for SQVPT data
 */
export interface SQVPT {
  ds_type: string;
  ds_qual: string;
  verified: string;
  pmramr: string;
  tpo: string;
  prelim_data: string;
}

/**
 * SupersededByDtn
 * interface for SupersededByDtn data
 */
export interface SupersededByDtn {
  superseded_by_dtn: string;
}

const containerStackTokens: IStackTokens = { childrenGap: 's1' };

/**
 * BuildItem
 * @param {BranchItemProps} props
 * @returns {any}
 * build branch item
 */
export function BuildItem(props: React.PropsWithChildren<BranchItemProps>) {
  const { traceType, ds, idx, level, sqvpt, supersededBy, hideLevel, hideSQVPT, hideSuperseded } = props;
  const thisKey = level + '-' + idx + '-' + ds;
  const atdtLinkProps = useLinks().atdt;
  const linkBase = (() => {
    switch (traceType) {
      case 'source': {
        return atdtLinkProps.source;
      }
      case 'descendant': {
        return atdtLinkProps.descendant;
      }
      default: {
        return atdtLinkProps.supersede;
      }
    }
  })();
  const { linkText, ...linkProps } = linkBase.globalTextLinkProps({ tdifId: ds || '' });
  return (
    <Stack styles={setStyles(level)} key={thisKey} horizontal tokens={containerStackTokens}>
      <Stack.Item>
        <Link key={thisKey} {...linkProps}>
          {ds}
        </Link>
      </Stack.Item>
      <Stack.Item>{buildSQVPT(sqvpt, hideSQVPT)}</Stack.Item>
      <Stack.Item>{buildLevel(level, hideLevel)}</Stack.Item>
      <Stack.Item>{buildSupersededBy(supersededBy, hideSuperseded, linkBase)}</Stack.Item>
    </Stack>
  );

  /**
   * buildSQVPT
   * @param {SQVPT} sqvpt
   * @param {boolean | null | undefined} hideSQVPT
   * @returns {string}
   * builds sqvpt if it exists && !hideSQVPT
   */
  function buildSQVPT(sqvpt: SQVPT, hideSQVPT: boolean | null | undefined) {
    if (typeof sqvpt === 'undefined' || hideSQVPT) {
      return;
    }
    const S = sqvpt.ds_type.trim().length === 0 ? '-' : sqvpt.ds_type;
    const Q = sqvpt.ds_qual.trim().length === 0 ? '-' : sqvpt.ds_qual;
    const V = sqvpt.verified.trim().length === 0 ? '-' : sqvpt.verified;
    const P = sqvpt.pmramr.trim().length === 0 ? '-' : sqvpt.pmramr;
    const T = sqvpt.tpo.trim().length !== 0 ? 'O' : sqvpt.prelim_data.trim().length !== 0 ? 'P' : '-';
    return '[' + S + Q + V + P + T + ']';
  }

  /**
   * buildLevel
   * @param {number | null | undefined} level
   * @param {boolean | null | undefined} hideLevel
   * @returns {string}
   * builds level if it exists && !hideLevel
   */
  function buildLevel(level: number | null | undefined, hideLevel: boolean | null | undefined) {
    if (typeof level === 'undefined' || hideLevel) {
      return;
    }
    return level?.toString();
  }

  /**
   * buildSupersededBy
   * @param {SupersededByDtn[]} supersededBy
   * @param {boolean | null | undefined} hideSuperseded
   * @returns {any}
   * builds supersededBy and returns if !hideSuperseded  && exists otherwise ()
   */
  function buildSupersededBy(
    supersededBy: SupersededByDtn[],
    hideSuperseded: boolean | null | undefined,
    linkBase: any
  ) {
    if (hideSuperseded) {
      return;
    }
    if (typeof supersededBy === 'undefined' || supersededBy.length === 0) {
      return '()';
    }
    return (
      <>
        {supersededBy.map((item: SupersededByDtn) => {
          const { linkText, ...linkProps } = linkBase.globalTextLinkProps({ tdifId: item.superseded_by_dtn || '' });
          return (
            <>
              (<Link {...linkProps}>{item.superseded_by_dtn}</Link>)
            </>
          );
        })}
      </>
    );
  }

  /**
   * setStyles
   * @param level
   * @returns {IStackStyles}
   * used for indenting if level && level>0
   */
  function setStyles(level: number | undefined) {
    const indent = level && level > 0 ? level * mSpacing : 0;
    const stackStyle: IStackStyles = {
      root: {
        marginLeft: indent,
      },
    };
    return stackStyle;
  }
}

export default React.memo(BuildItem);
