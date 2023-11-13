import React from 'react';
import { Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { TdifDisplayTypeFragment } from './__generated__/TdifDisplayTypeFragment';
import { TdifMessagesFragment } from './__generated__/TdifMessagesFragment';
import { invalidDate } from '../../components/helpers/FormatDateTime';

export const TDIF_DISPLAY_TYPE_FRAGMENT = gql`
  fragment TdifDisplayTypeFragment on db_tdms_data_set {
    ds
    data_set_dit {
      display_setting
      dit_issue {
        issue_open
        issue_brief
      }
    }
    submittal_inventory {
      status
      accept_reject
      submittal_table_link {
        table_description {
          table_key
        }
      }
    }
    tdif {
      qced_flg
      qced_dt
    }
    transfer {
      component
      transfer_dt
      reject_dt
      accept_dt
    }
    data_set_superseded_bies(where: { superseded_by_dtn: { _neq: "" } }) {
      superseded_by_dtn
    }
  }
`;

export type TdifDisplayTypes = ReturnType<typeof useTdifDisplayTypes>;

/*check for all possible dataset combinations that would mean the data is in-process but not completed and QCed*/
export function useTdifDisplayTypes(data?: TdifDisplayTypeFragment) {
  const tdifDisplayTypes = {
    displayBrf1: false,
    displayBrf2: false,
    displayNon: false,
    super: false,
    non: false,
    tbd: false,
    rej: false,
    rpc: false,
    tic: false,
    wfc: false,
    rdi: false,
    cst: false,
  };

  if (data?.data_set_dit && data.data_set_dit.length > 0) {
    const dit_issue = data.data_set_dit.filter(
      (item) => item.dit_issue.issue_open === 'Y' && item.display_setting === 'N'
    );
    if (dit_issue.length > 0) {
      tdifDisplayTypes.displayBrf1 = true; //Issue –- DISPLAYBRF1
    }
  }
  if (!tdifDisplayTypes.displayBrf1) {
    if (data?.tdif) {
      if (data.tdif.qced_flg === 'N') {
        if (invalidDate(data.tdif.qced_dt)) {
          tdifDisplayTypes.displayNon = true; // IF tdif.qced_flg = "N" AND .qced_dt = not valid -- DISPLAYNON
        } else {
          tdifDisplayTypes.displayBrf2 = true; // IF tdif.qced_flg = "N" AND .qced_dt = valid -- DISPLAYBRF2
        }
      } else {
        if (data.data_set_superseded_bies.length > 0) {
          tdifDisplayTypes.super = true; // data_set_superseded_by.superseded_by_dtn is empty, "N", if something, then "Y"
        } else if (!data.transfer || !data.transfer.component || invalidDate(data.transfer.transfer_dt)) {
          tdifDisplayTypes.non = true; // if the tdif does not show up in transfer table
        } else if (invalidDate(data.transfer.accept_dt) && invalidDate(data.transfer.reject_dt)) {
          tdifDisplayTypes.tbd = true; // IF transfer.accept_dt and the transfer.reject_dt are both not valid
        } else if (!invalidDate(data.transfer.reject_dt)) {
          tdifDisplayTypes.rej = true;
        } else if (data.transfer.component === 'RPC') {
          tdifDisplayTypes.rpc = true;
        } else if (data.transfer.component === 'TIC') {
          tdifDisplayTypes.tic = true;
        } else if (data.transfer.component === 'WFC') {
          tdifDisplayTypes.wfc = true;
        } else if (data.transfer.component === 'RDI') {
          tdifDisplayTypes.rdi = true;
        } else if (data.transfer.component === 'CST') {
          tdifDisplayTypes.cst = true;
        } else if (data.transfer.component === 'SEP') {
          if (data.submittal_inventory?.status === 'SUPERSEDED') {
            tdifDisplayTypes.super = true;
          } else {
            if (
              data.submittal_inventory?.status !== 'COMPLETED' ||
              data.submittal_inventory.accept_reject !== 'ACCEPTED' ||
              data.submittal_inventory?.submittal_table_link === null //submittal_table_link will be an array = if null means no records and dtn does NOT get a link
            ) {
              tdifDisplayTypes.tbd = true;
            }
          }
        }
      }
    }
  }
  return tdifDisplayTypes;
}

export const TDIF_MESSAGES_FRAGMENT = gql`
  fragment TdifMessagesFragment on db_tdms_data_set {
    data_set_dit {
      display_setting
      dit_issue {
        issue_open
        issue_brief
      }
    }
    transfer {
      component
    }
  }
`;

interface TdifMessagesProps {
  tdifDisplayTypes: TdifDisplayTypes;
  data: TdifMessagesFragment;
}

/*
 * function to display extra messages based on TdifDisplayTypes data
 * @param <TechnicalInformationFragment> data
 * @return ReactElement(s)
 */
export function TdifMessages(props: TdifMessagesProps) {
  const { data, tdifDisplayTypes } = props;
  const dit_issue = data.data_set_dit.filter((item) => item.dit_issue.issue_open === 'Y');
  const dit_issue_brief = dit_issue.length > 0 ? dit_issue[0].dit_issue.issue_brief : '';

  const hideLink = JSON.stringify(tdifDisplayTypes).includes('true'); //means a TdifDisplayType is true
  const showTransferType = tdifDisplayTypes.wfc || tdifDisplayTypes.rdi || tdifDisplayTypes.cst; // means one of these three is true
  return (
    <>
      {tdifDisplayTypes.displayBrf1 && (
        <>
          <Text> is not available for viewing:</Text>
          <div>{dit_issue_brief}</div>
        </>
      )}
      {tdifDisplayTypes.displayBrf2 && <Text> is not available for viewing: Quality Check Process</Text>}
      {tdifDisplayTypes.displayNon && <Text> is not yet available for viewing.</Text>}
      {tdifDisplayTypes.super && <Text> (Data has been superseded - Please see Superseded By DTNs below.)</Text>}
      {tdifDisplayTypes.non && <Text> (Data has not been submitted to the TDM at this time)</Text>}
      {tdifDisplayTypes.tbd && <Text> (Data has been submitted to the TDM and is currently being processed)</Text>}
      {tdifDisplayTypes.rej && <Text> (Data has been returned to the PI for clarification)</Text>}
      {tdifDisplayTypes.rpc && <Text> (Links to Records Processing Center-use package id number(s) below.)</Text>}
      {tdifDisplayTypes.tic && <Text> (Links to Technical Information Center-use TIC numbers below)</Text>}
      {hideLink && showTransferType && <Text> {data.transfer?.component}</Text>}
      {!hideLink && <Text> (Link to {data.transfer?.component})</Text>}
    </>
  );
}
