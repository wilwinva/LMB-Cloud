/*
 * More tabs could be added in.
 * Possible way to show/hide tabs for different workflows based on workflowId
 *
 * the workflows array is a list of workflow IDs for which a tab would be show.
 * i.e. the fields tab would show in workflow ID = 5
 */
import React from 'react';
import { WorkflowDocumentFragment } from '../__generated__/WorkflowDocumentFragment';
import FieldsTab from './FieldsTab';
import TextTab from './TextTab';
import CallCenterTab from './CallCenterTab';
import NamesTab from './NamesTab';
import SourcesTab from './SourcesTab';
import CommentsTab from './CommentsTab';
import HistoryTab from './HistoryTab';
import WorkflowsTab from './WorkflowsTab';
import AdhocTab from './AdhocTab';
import DecisionsTab from './DecisionsTab';
import PrivilegesTab from './PrivilegesTab';
import StatementsTab from './StatementsTab';
import DppTab from './DppTab';
import StampsTab from './StampsTab';
import SuiLogTab from './SuiLogTab';
import RedactedPagesTab from './RedactedPagesTab';
import RedactionsTab from './RedactionsTab';
import ECPDescTab from './EcpDesc';
import DocTypeTab from './DocTypeTab';
import OtherDocNumsTab from './OtherDocNumsTab';
import AuthorsTab from './AuthorsTab';
import AddressesTab from './AddressesTab';

export function gatherTabs(
  docId: number,
  document: WorkflowDocumentFragment | undefined
): {
  headerText: string;
  key: string;
  innerElement: JSX.Element;
  workflows: number[];
}[] {
  return [
    {
      headerText: 'Fields',
      innerElement: <FieldsTab document={document} />,
      key: 'fields',
      workflows: [
        2,
        4,
        5,
        6,
        8,
        10,
        12,
        13,
        17,
        19,
        20,
        23,
        24,
        25,
        26,
        27,
        29,
        30,
        31,
        32,
        33,
        35,
        38,
        40,
        41,
        45,
        46,
        47,
        50,
        52,
      ],
    },
    {
      headerText: 'Text',
      key: 'texttab',
      innerElement: <TextTab document={document} />,
      workflows: [
        2,
        4,
        5,
        6,
        8,
        9,
        10,
        12,
        13,
        17,
        19,
        20,
        21,
        23,
        24,
        25,
        26,
        27,
        29,
        30,
        31,
        32,
        33,
        35,
        38,
        40,
        41,
        42,
        45,
        46,
        47,
        50,
        52,
      ],
    },
    {
      headerText: 'Call Center',
      key: 'callcenter',
      innerElement: <CallCenterTab document={document} />,
      workflows: [
        2,
        4,
        5,
        8,
        10,
        12,
        13,
        19,
        20,
        21,
        23,
        24,
        25,
        26,
        27,
        29,
        30,
        31,
        32,
        35,
        40,
        41,
        45,
        46,
        47,
        50,
        52,
      ],
    },
    {
      headerText: 'Names',
      key: 'namestab',
      innerElement: <NamesTab document={document} />,
      workflows: [
        2,
        4,
        5,
        6,
        8,
        10,
        12,
        13,
        17,
        19,
        20,
        23,
        24,
        25,
        26,
        27,
        29,
        30,
        31,
        32,
        33,
        35,
        38,
        40,
        41,
        45,
        46,
        47,
        50,
        52,
      ],
    },
    {
      headerText: 'Sources',
      key: 'sourcetab',
      innerElement: <SourcesTab document={document} />,
      workflows: [
        2,
        4,
        5,
        6,
        8,
        10,
        12,
        13,
        17,
        19,
        20,
        23,
        24,
        25,
        26,
        27,
        29,
        30,
        31,
        32,
        35,
        40,
        41,
        45,
        46,
        47,
        50,
        52,
      ],
    },
    {
      headerText: 'Comments',
      key: 'comments',
      innerElement: <CommentsTab document={document} />,
      workflows: [
        2,
        4,
        5,
        6,
        8,
        10,
        12,
        13,
        17,
        19,
        20,
        23,
        24,
        25,
        26,
        27,
        29,
        30,
        31,
        32,
        35,
        40,
        41,
        45,
        46,
        47,
        50,
        52,
      ],
    },
    {
      headerText: 'History',
      key: 'history',
      innerElement: <HistoryTab document={document} />,
      workflows: [2, 4, 5, 6, 8, 12, 13, 17, 19, 20, 23, 24, 26, 27, 29, 30, 31, 32, 35, 40, 41, 45, 46, 47, 50, 52],
    },
    {
      headerText: 'Workflows',
      key: 'workflowstab',
      innerElement: <WorkflowsTab document={document} />,
      workflows: [2, 4, 5, 6, 8, 12, 13, 17, 19, 20, 23, 24, 26, 27, 29, 30, 31, 32, 35, 40, 41, 45, 46, 47, 50, 52],
    },
    {
      headerText: 'ADHOC',
      key: 'adhoc',
      innerElement: <AdhocTab document={document} />,
      workflows: [2, 4, 5, 8, 12, 13, 19, 20, 23, 24, 26, 27, 29, 30, 31, 32, 35, 40, 41, 45, 46, 47, 50, 52],
    },
    {
      headerText: 'Statements',
      key: 'statementsTab',
      innerElement: <StatementsTab document={document} />,
      workflows: [33, 38, 48, 51],
    },
    {
      headerText: 'DPP',
      key: 'dppTab',
      innerElement: <DppTab />,
      workflows: [33, 38],
    },
    {
      headerText: 'Stamps',
      key: 'stampsTab',
      innerElement: <StampsTab />,
      workflows: [41, 32, 35, 50],
    },
    {
      headerText: 'SUI Log',
      key: 'suiLogTab',
      innerElement: <SuiLogTab document={document} />,
      workflows: [41, 35, 50],
    },
    {
      headerText: 'Redacted Pages',
      key: 'redactedPagesTab',
      innerElement: <RedactedPagesTab />,
      workflows: [41, 31, 26, 35, 50, 42],
    },
    {
      headerText: 'Redactions',
      key: 'redactionsTab',
      innerElement: <RedactionsTab />,
      workflows: [32, 26, 35, 50, 40],
    },
    {
      headerText: 'ECP Descriptor',
      key: 'ecpDescTab',
      innerElement: <ECPDescTab />,
      workflows: [35, 50],
    },
    {
      headerText: 'Doc Type',
      key: 'docTypeTab',
      innerElement: <DocTypeTab />,
      workflows: [42],
    },
    {
      headerText: 'Other Doc Numbers',
      key: 'otherDocNumsTab',
      innerElement: <OtherDocNumsTab />,
      workflows: [42],
    },
    {
      headerText: 'Authors',
      key: 'authorsTab',
      innerElement: <AuthorsTab />,
      workflows: [42],
    },
    {
      headerText: 'Addresses',
      key: 'addressesTab',
      innerElement: <AddressesTab />,
      workflows: [42],
    },
  ];
}
