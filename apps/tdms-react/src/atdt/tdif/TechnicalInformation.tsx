import React, { useState } from 'react';
import { IStackItemStyles, IStackStyles, Stack, Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useDtnModelLink } from '../../hooks/links/useDtnModelLink';
import { TechnicalInformationFragment } from './__generated__/TechnicalInformationFragment';
import { HeaderRow, useCustomizations } from '@nwm/uifabric';
import { TDIF_MESSAGES_FRAGMENT, TdifDisplayTypes, TdifMessages } from './TdifDisplayTypes';
import { toTransferComponent } from '../../query/Transfer';

export const TECHNICAL_INFORMATION_FRAGMENT = gql`
  fragment TechnicalInformationFragment on db_tdms_data_set {
    ds
    data_set_dit {
      display_setting
      dit_issue {
        issue_open
        issue_brief
      }
    }
    transfer {
      component
      transfer_dt
      reject_dt
      accept_dt
    }
    data_set_records_roadmaps_aggregate(where: { doc_type: { _neq: "" } }) {
      aggregate {
        roadmap_recs: count(columns: doc_type)
      }
    }
    ...TdifMessagesFragment
  }
  ${TDIF_MESSAGES_FRAGMENT}
`;

interface TechnicalInformation {
  data: TechnicalInformationFragment;
  tdifDisplayTypes: TdifDisplayTypes;
}

export default function TechnicalInformation(props: TechnicalInformation) {
  const { data, tdifDisplayTypes } = props;

  const dtnsModelLink = useDtnModelLink(toTransferComponent(data.transfer?.component));

  const [disabledLink, setDisabledLink] = useState(false);

  if (!dtnsModelLink && !disabledLink) {
    console.warn(`Component type was not able to be determined for ds: ${data.ds}`);
    setDisabledLink(true);
  }
  const linkTo = dtnsModelLink?.globalTextLinkProps({ tdifId: data.ds ?? '' }).to;

  const settings = useCustomizations().settings.extended!;

  const tableStyles: IStackStyles = {
    root: {
      border: settings.borders.default,
      borderTop: settings.borders.none,
      selectors: {
        '>div': {
          background: settings.palette.white,
          color: settings.palette.black,
          padding: settings.paddings.p4,
        },
      },
    },
  };
  const viewStyles: IStackItemStyles = {
    root: {
      borderLeft: settings.borders.default,
      minWidth: 140,
    },
  };

  const hideLink = JSON.stringify(tdifDisplayTypes).includes('true');

  const roadmapBlock = buildRoadmapBlock(data);
  const headerCellTextParameters = ['Technical Information ' + data.ds];
  return (
    <Stack>
      <HeaderRow
        stackDimension={{ height: 30, width: 1200 }}
        cellNumber={headerCellTextParameters.length}
        cellText={headerCellTextParameters}
        background="themePrimary"
        color="themeSecondary"
      />
      <Stack horizontal horizontalAlign="space-between" styles={tableStyles}>
        <Stack.Item>
          {disabledLink || hideLink ? (
            <Text variant={'large'} style={{ color: 'black', fontWeight: 'bold' }}>
              {data.ds}
            </Text>
          ) : (
            <Link to={linkTo!}>{data.ds}</Link>
          )}
          <TdifMessages {...props} />
        </Stack.Item>
        {!tdifDisplayTypes.displayNon && (
          <Stack.Item styles={viewStyles}>
            <Text block> View: </Text>
            <Link to={`../../change-history/${data.ds}`}>Change History</Link>
            <br />
            {roadmapBlock}
          </Stack.Item>
        )}
      </Stack>
    </Stack>
  );
}

function buildRoadmapBlock(dataset: TechnicalInformationFragment) {
  if (
    dataset.data_set_records_roadmaps_aggregate === null ||
    dataset.data_set_records_roadmaps_aggregate.aggregate?.roadmap_recs === 0
  ) {
    return (
      <>
        <Text block>For Records Roadmap</Text>
        <Text block>See RPC Pkg ID below</Text>
      </>
    );
  } else {
    return <Link to={`../../tdifRoadmap/${dataset.ds}`}>Records Roadmap Info</Link>;
  }
}
