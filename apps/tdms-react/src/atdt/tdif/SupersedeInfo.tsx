import React, { ReactElement, useMemo } from 'react';
import { Stack, Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { HeaderRow, TextLink, ValueRow } from '@nwm/uifabric';
import { SupersedeInfoFragment } from './__generated__/SupersedeInfoFragment';
import useLinks from '../../hooks/links/useLinks';
import { Link } from 'react-router-dom';

export interface InfoTableProps {
  stackWidth: number;
  data: SupersedeInfoFragment;
}

export const SUPERSEDE_INFO_FRAGMENT = gql`
  fragment SupersedeInfoFragment on db_tdms_data_set {
    data_set_superseded_bies(where: { superseded_by_dtn: { _neq: "" } }) {
      superseded_by_dtn
    }
    data_set_supersedes(where: { supersedes_dtn: { _neq: "" } }) {
      supersedes_dtn
    }
    data_set_tics(where: { tic_no: { _neq: 0 } }) {
      tic_no
    }
  }
`;

const headerCellText = ['This DTN is Superseded by', 'This DTN supersedes', 'TIC Numbers'];

export default function SupersedeInfo(props: InfoTableProps) {
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
  data: SupersedeInfoFragment,
  tdifLinks: TextLink<{} & { tdifId: string }, { tdifId: string }>
): [ReactElement[], number] {
  return [
    [
      <>
        {data.data_set_superseded_bies.map((data, idx) => {
          const { linkText, ...linkProps } = tdifLinks.globalTextLinkProps({ tdifId: data.superseded_by_dtn });

          return (
            <Link key={idx} {...linkProps}>
              {data.superseded_by_dtn}
              <br />
            </Link>
          );
        })}
      </>,
      <>
        {data.data_set_supersedes.map((data, idx) => {
          const { linkText, ...linkProps } = tdifLinks.globalTextLinkProps({ tdifId: data.supersedes_dtn });

          return (
            <Link key={idx} {...linkProps}>
              {data.supersedes_dtn}
              <br />
            </Link>
          );
        })}
      </>,
      <>
        {data.data_set_tics.map((data, idx) => {
          return (
            <Link key={idx} to={`../../tdif_tic/${data.tic_no}`}>
              <Text>{data.tic_no}</Text>
              <br />
            </Link>
          );
        })}
      </>,
    ],
    3,
  ];
}
