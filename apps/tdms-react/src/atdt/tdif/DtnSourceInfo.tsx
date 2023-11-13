import React, { ReactElement, useMemo } from 'react';
import { Stack, Text } from 'office-ui-fabric-react';
import { HeaderRow, TextLink, ValueRow } from '@nwm/uifabric';
import { gql } from '@apollo/client';
import { DntSourceInfoFragment } from './__generated__/DntSourceInfoFragment';
import useLinks from '../../hooks/links/useLinks';
import { Link } from 'react-router-dom';
import { SqvptModal } from './SqvptModal';

export const DTN_SOURCE_INFO_FRAGMENT = gql`
  fragment DntSourceInfoFragment on db_tdms_data_set {
    data_set_dev_sources(where: { ds: { _neq: "" } }) {
      ds
      ds_key
      data_set {
        pmr_dataset_status {
          ds_type
          ds_qual
          verified
          pmramr
          tpo
          prelim_data
        }
      }
    }
    dev_source_ds_2_data_set_ds(order_by: { dataSetByDsKey: { ds: asc } }) {
      dataSetByDsKey {
        ds
        ds_key
        pmr_dataset_status {
          ds_type
          ds_qual
          verified
          pmramr
          tpo
          prelim_data
        }
      }
    }
  }
`;

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

export interface DtnSourceInfoProps {
  stackWidth: number;
  data: DntSourceInfoFragment;
}

const headerCellText = [
  <Text>
    Sources for this DTN [
    <span>
      <SqvptModal />
    </span>
    ]
  </Text>,
  <Text>
    This DTN is Source to [
    <span>
      <SqvptModal />
    </span>
    ]
  </Text>,
];

export default function DtnSourceInfo(props: React.PropsWithChildren<DtnSourceInfoProps>) {
  const { stackWidth, data } = props;
  const links = useLinks();
  const tdifLinks = links.atdt.tdif;

  const [cellText, cellNumber] = useMemo(() => buildLinks(data, tdifLinks), [data]);

  return (
    <Stack>
      <HeaderRow
        stackDimension={{ height: 30, width: stackWidth }}
        cellNumber={headerCellText.length}
        cellText={headerCellText}
      />
      <ValueRow stackDimension={{ height: 60, width: stackWidth }} cellNumber={cellNumber} cellText={cellText} />
    </Stack>
  );
}

function buildLinks(
  data: DntSourceInfoFragment,
  tdifLinks: TextLink<{} & { tdifId: string }, { tdifId: string }>
): [ReactElement[], number] {
  const sourceFor = data.data_set_dev_sources;
  const sourceFrom = data.dev_source_ds_2_data_set_ds;
  return [
    [
      <>
        {sourceFor.map((item: any, idx: number) => {
          if (item.ds === null || item.ds === '') {
            return <></>;
          }
          const { linkText, ...linkProps } = tdifLinks.globalTextLinkProps({ tdifId: item.ds });

          return (
            <Stack key={idx} horizontal tokens={{ childrenGap: '8px' }}>
              <Stack.Item>
                <Link key={idx} {...linkProps}>
                  {item.ds}
                </Link>
              </Stack.Item>
              <Stack.Item>{buildSQVPT(item.data_set.pmr_dataset_status)}</Stack.Item>
            </Stack>
          );
        })}
      </>,
      <>
        {sourceFrom.map((item: any, idx: number) => {
          if (item.dataSetByDsKey.ds === null || item.dataSetByDsKey.ds === '') {
            return <></>;
          }
          const { linkText, ...linkProps } = tdifLinks.globalTextLinkProps({ tdifId: item.dataSetByDsKey.ds || '' });

          if (item.dataSetByDsKey.pmr_dataset_status.ds_qual !== 'Y') {
            return (
              <Stack key={idx} horizontal tokens={{ childrenGap: '8px' }}>
                <Stack.Item>
                  <Text>{item.dataSetByDsKey.ds} is NOT YET Available.</Text>
                </Stack.Item>
              </Stack>
            );
          }

          return (
            <Stack key={idx} horizontal tokens={{ childrenGap: '8px' }}>
              <Stack.Item>
                <Link key={idx} {...linkProps}>
                  {item.dataSetByDsKey.ds}
                </Link>
              </Stack.Item>
              <Stack.Item>{buildSQVPT(item.dataSetByDsKey.pmr_dataset_status)}</Stack.Item>
            </Stack>
          );
        })}
      </>,
    ],
    2,
  ];
}

/**
 * buildSQVPT
 * @param {SQVPT} sqvpt
 * @param {boolean | null | undefined} hideSQVPT
 * @returns {string}
 * builds sqvpt if it exists && !hideSQVPT
 */
function buildSQVPT(sqvpt: SQVPT, hideSQVPT?: boolean | null | undefined) {
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
