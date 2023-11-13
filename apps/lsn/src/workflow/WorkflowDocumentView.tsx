import React from 'react';
import {
  Stack,
  IStackStyles,
  Separator,
  Icon,
  mergeStyles,
  Text,
  MessageBar,
  MessageBarType,
  FontIcon,
  Button,
  BaseButton,
  IStackTokens,
} from 'office-ui-fabric-react';
import WorkflowCommandBar from './WorkflowCommandBar';
import WorkflowTabs from './WorkflowTabs';
import PdfViewer from './PdfViewer';
import DecisionBox from './DecisionBox';
import DoneDecisionDialog from './DoneDecisionDialog';
import MemoInput from '../components/MemoInput';
import WorkflowDocumentChildren from './WorkflowDocumentChildren';
import { WorkflowDocumentFragment } from './__generated__/WorkflowDocumentFragment';
import { useParamsEncoded } from '@nwm/react-hooks';
import {
  WorkflowDocumentQuery_workflow_documents,
  WorkflowDocumentQuery_workflow_documents_children,
} from './__generated__/WorkflowDocumentQuery';
import { ActiveDocument, decisionType, result3BoxType } from './WorkflowDocument';
import { DecisionFragment } from './__generated__/DecisionFragment';

export interface WorkflowDocumentViewProps {
  severeError: boolean;
  showError: boolean;
  hideDialog: boolean;
  dialogMessage: string;
  decisionMessage: string;
  lockAquired: boolean;
  packageMode: boolean;
  activeDocument: ActiveDocument;
  topLevelDoc: WorkflowDocumentQuery_workflow_documents;
  radioButtons: DecisionFragment | null;
  children: WorkflowDocumentQuery_workflow_documents_children[];
  doneButtonClick: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => boolean | void;
  backButtonClick: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => boolean | void;
  nextButtonClick: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => boolean | void;
  nextDocumentInPackageClick: (
    event: React.MouseEvent<
      Button | HTMLAnchorElement | HTMLButtonElement | HTMLDivElement | BaseButton | HTMLSpanElement,
      MouseEvent
    >
  ) => void;
  shouldNavigateHome: boolean;
  hideDialogFunction: () => void;
  debounced: any;
  updateResult3: any;
  updateDecisionTabBoxes: any;
  updateSelections: any;
}

export default function WorkflowDocumentView(props: WorkflowDocumentViewProps) {
  const {
    severeError,
    showError,
    hideDialog,
    dialogMessage,
    lockAquired,
    packageMode,
    activeDocument,
    topLevelDoc,
    radioButtons,
    children,
    doneButtonClick,
    backButtonClick,
    nextButtonClick,
    nextDocumentInPackageClick,
    shouldNavigateHome,
    hideDialogFunction,
    debounced,
    updateResult3,
    updateDecisionTabBoxes,
    updateSelections,
  } = { ...props };

  const [wflowId, stageId, docId] = useParamsEncoded();

  const stackStyles: IStackStyles = {
    root: {
      maxWidth: 1200,
      height: 800,
      selectors: {
        'div.doc-data': {
          minWidth: 850,
        },
        'div.decision-box': {
          paddingLeft: 10,
        },
        'div.pdf-viewer': {
          minWidth: 400,
        },
        'div.generic-panel, div.docs-panel': {
          height: 100,
        },
        'div.workflow-tabs': {
          minHeight: 500,
          paddingBottom: 10,
          selectors: {
            'div[role="tabpanel"]': {
              marginTop: 10,
            },
          },
        },
        'span.memo-label': {
          borderBottom: '1px solid',
        },
        'textarea.memo': {
          fontSize: 14,
          fontWeight: 400,
          boxShadow: 'none',
          margin: 0,
          boxSizing: 'border-box',
          borderRadius: 0,
          border: 'none',
          background: 'none transparent',
          color: 'rgb(0, 0, 0)',
          width: '100%',
          minWidth: 0,
          textOverflow: 'ellipsis',
          outline: 0,
          resize: 'none',
          height: 85,
          lineHeight: 17,
          flexGrow: 1,
          overflow: 'auto',
        },
      },
    },
  };
  const decisionArea: IStackTokens = {
    childrenGap: 10,
  };
  const ErrorNotification = () => (
    <MessageBar messageBarType={MessageBarType.error}>{props.decisionMessage}</MessageBar>
  );
  const SeverErrorNotification = () => (
    <MessageBar messageBarType={MessageBarType.severeWarning}>Server Error: Please try again.</MessageBar>
  );

  return (
    <Stack styles={stackStyles}>
      {severeError && <SeverErrorNotification />}
      <Stack horizontal>
        <Stack.Item className="doc-data">
          <WorkflowCommandBar
            doneClick={doneButtonClick}
            backButtonClick={backButtonClick}
            nextButtonClick={nextButtonClick}
            disabled={!lockAquired}
            packageMode={packageMode}
          />
          <Separator />
          <Stack horizontal>
            <Stack grow={2}>
              <Stack.Item className="docs-panel">
                <WorkflowDocumentChildren children={children} />
              </Stack.Item>
              <Separator>
                <Icon iconName="EditNote" />
              </Separator>
              <Stack.Item className="generic-panel">
                <MemoInput memo={activeDocument.memo || ''} debounced={debounced} />
              </Stack.Item>
            </Stack>
            <Separator vertical />
            <Stack.Item grow={1} className="decision-box">
              <Stack tokens={decisionArea}>
                {!lockAquired && (
                  <Text>
                    <FontIcon iconName="Lock" /> Document is locked from editing
                  </Text>
                )}
                <Stack.Item>
                  <DecisionBox
                    document={activeDocument.document}
                    workflowId={Number(wflowId)}
                    result3Boxes={activeDocument.result3Boxes || []}
                    updateResult3={updateResult3}
                    decisionButtons={topLevelDoc.decision}
                    radioButtons={radioButtons}
                    decisions={activeDocument.decisions || {}}
                    updateSelections={updateSelections}
                    disabled={!lockAquired}
                  />
                </Stack.Item>
                <Stack.Item>
                  {packageMode && (
                    <Button
                      text={'Next Document in Package'}
                      onClick={nextDocumentInPackageClick}
                      disabled={!lockAquired}
                    />
                  )}
                </Stack.Item>
                <Stack.Item> {showError && <ErrorNotification />}</Stack.Item>
              </Stack>
            </Stack.Item>
          </Stack>
          <Separator>
            <Icon iconName="Tab" />
          </Separator>
          <Stack.Item className="workflow-tabs">
            <WorkflowTabs
              workflowId={Number(wflowId)}
              docid={Number(docId)}
              activeDocument={activeDocument}
              onDecisionTabChange={updateDecisionTabBoxes}
              lockAquired={lockAquired}
            />
          </Stack.Item>
        </Stack.Item>
        <Stack.Item>
          <Separator vertical className={mergeStyles({ height: 800 })} />
        </Stack.Item>
        <Stack.Item className="pdf-viewer">
          <PdfViewer ads_udi={activeDocument.document?.ads_udi} />
          <Separator />
        </Stack.Item>
      </Stack>
      <DoneDecisionDialog
        hideDialog={hideDialog}
        subText={dialogMessage}
        hideDialogFunction={hideDialogFunction}
        shouldNavigateHome={shouldNavigateHome}
      />
    </Stack>
  );
}
