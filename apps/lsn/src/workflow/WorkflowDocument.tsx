import React, { useCallback, useEffect, useState } from 'react';
import { useParamsEncoded } from '@nwm/react-hooks';
import { gql, useLazyQuery } from '@apollo/client';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import { filter } from 'graphql-anywhere';
import { Text } from 'office-ui-fabric-react';
import { Loading } from '@nwm/util';
import {
  WorkflowDocumentQuery,
  WorkflowDocumentQuery_workflow_documents,
  WorkflowDocumentQuery_workflow_documents_decision,
  WorkflowDocumentQueryVariables,
} from './__generated__/WorkflowDocumentQuery';
import { WorkflowDocumentFragment } from './__generated__/WorkflowDocumentFragment';
import { DECISION_CHECKBOXES, DECISION_FRAGMENT } from './DecisionBox';
import { DOCUMENT_FRAGMENT } from './WorkflowDocumentChildren';
import { DecisionFragment } from './__generated__/DecisionFragment';
import { DecisionCheckboxesFragment } from './__generated__/DecisionCheckboxesFragment';
import { useBoolean } from '@uifabric/react-hooks';
import useDebouncedCallback from 'use-debounce/lib/useDebouncedCallback';
import documentService, { DocumentLockResponse, NextDocResponse } from './classes/DocumentService';
import { useNavigate } from 'react-router';
import { AuthenticationContext } from '../components/AuthProvider/AuthenticationContext';
import { AuthenticatedUser } from '../components/AuthProvider/AuthenticatedUser';
import { Account } from 'msal';
import { KEYWORKDS_FRAGMENT } from './tabs/TextTab';
import WorkflowDocumentView from './WorkflowDocumentView';
import { DecisionTabCheckboxes, decisionTabWorkflowIds } from './tabs/DecisionsTab';
import { privilegeWorkflowIds } from './tabs/PrivilegesTab';

export interface WorkflowDocumentProps {}
export type decisionType = {
  key: string;
  label: string;
  checkboxes: { [key: string]: { selected: boolean; label: string } };
  selected: boolean;
};

export type result3BoxType = { label: string; key: string; selected: boolean };

export interface ActiveDocument {
  document: WorkflowDocumentFragment;
  memo: string | null;
  decisions: { [key: string]: decisionType };
  result3Boxes: result3BoxType[];
  decisionTabBoxes: result3BoxType[];
}

export const workflow_document = gql`
  query WorkflowDocumentQuery($id: float8) {
    workflow_documents(where: { ID: { _eq: $id } }, limit: 1) {
      ...WorkflowDocumentFragment
      children {
        ...WorkflowDocumentFragment
      }
      children_aggregate {
        aggregate {
          count
        }
      }
      decision {
        check1
        check2
        check3
        check4
        check5
        check6
        check7
        check8
        check9
        check10
        check11
        check12
        check13
        check14
        check15
        ...DecisionFragment
        ...DecisionCheckboxesFragment
      }
      ...KeywordsFragment
    }
  }
  ${DOCUMENT_FRAGMENT}
  ${DECISION_FRAGMENT}
  ${DECISION_CHECKBOXES}
  ${KEYWORKDS_FRAGMENT}
`;

export function WorkflowDocumentComponent(_props: WorkflowDocumentProps) {
  const authContext = React.useContext(AuthenticationContext);
  const userAccount: Account = authContext.user.account;
  const user_id = userAccount.userName.split('@')[0];
  const bearerToken = authContext.user.bearerToken;
  const user: AuthenticatedUser = { userId: user_id, bearerToken: bearerToken };
  const [wflowId, stageId, docId] = useParamsEncoded();
  const navigate = useNavigate();

  const [activeDocument, setActiveDocument] = useState<ActiveDocument>();
  const [selectedChild, setSelectedChild] = useState<number>();
  const [showError, setShowError] = useState<boolean>(false);
  const [severeError, setSevereError] = useState<boolean>(false);
  const [shouldNavigateHome, setShouldNavigateHome] = useState<boolean>(true);
  const [lockAquired, setLockAquired] = useState<boolean>(false);
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [dialogMessage, setDialogMessage] = useState<string>('');
  const [decisionMessage, setDecisionMessage] = useState<string>('');
  const [etag, setEtag] = useState<string>();

  const [getDocument, { loading, error, data }] = useLazyQuery<WorkflowDocumentQuery, WorkflowDocumentQueryVariables>(
    workflow_document,
    {
      variables: { id: docId },
      fetchPolicy: 'cache-and-network',
    }
  );

  useEffect(() => {
    if (data) {
      setActiveDocument(configureDocument(data.workflow_documents[0], data.workflow_documents[0].decision));
    } else {
      getDocument();
    }
  }, [data]);

  useEffect(() => {
    if (activeDocument?.document.ID) {
      //attempt to check out the document
      documentService
        .aquireLock(user, wflowId, activeDocument.document.ID)
        .then((res: DocumentLockResponse) => {
          setEtag(res.base64Decision);
          setLockAquired(true);
        })
        .catch((error) => {
          console.log(error);
          setLockAquired(false);
        });
    }
  }, [activeDocument?.document.ID]);

  /**
   * Function to update the result3Boxes state.
   * result3Boxes are checkboxes that don't a have an associated Radio Button.
   */
  const updateResult3 = useCallback(
    (key: string, checked: boolean) => {
      if (activeDocument && activeDocument.result3Boxes) {
        let doc = activeDocument;
        let rb: result3BoxType[] = [...activeDocument.result3Boxes];
        rb.filter((r) => r.key === key).map((r) => (r.selected = checked));

        setActiveDocument({ ...doc, result3Boxes: rb });
        if (showError) setShowError(false);
      }
    },
    [activeDocument]
  );

  /**
   * Function to update the decisionTabBoxes state.
   * decisionTabBoxes are checkboxes in the Decision Tab.
   */
  const updateDecisionTab = useCallback(
    (key: string, checked: boolean) => {
      if (activeDocument && activeDocument.decisionTabBoxes) {
        let doc = activeDocument;
        let rb: result3BoxType[] = [...activeDocument.decisionTabBoxes];
        rb.filter((r) => r.key === key).map((r) => (r.selected = checked));
        setActiveDocument({ ...doc, decisionTabBoxes: rb });
        if (showError) setShowError(false);
      }
    },
    [activeDocument]
  );
  /**
   * Function to update decision state when a user selects a decision.
   * See DecisionBox.tsx to view the OnChange events to see how the Object containing the decisions is updated
   */
  const updateSelections = useCallback(
    (selections: { [key: string]: decisionType }) => {
      if (activeDocument && activeDocument.decisions) {
        let doc = activeDocument;
        if (showError) setShowError(false);
        setActiveDocument({ ...doc, decisions: selections });
      }
    },
    [activeDocument]
  );

  /**
   * function to update Memo block. Use debounce to avoid unnecessary re-renders
   */
  const debounced = useDebouncedCallback((value: string) => {
    if (activeDocument) {
      let doc = activeDocument;
      doc.memo = value;
      setActiveDocument(doc);
    }
  }, 1000);

  /**
   * function to mark a document as 'Done' when it's not in package mode
   */
  const doneButtonClick = useCallback(() => {
    if (activeDocument && etag) {
      documentService
        .recordDecision(activeDocument, user, etag, false)
        .then((res: NextDocResponse) => {
          if (res.nextDocId) {
            setActiveDocument(undefined);
            navigate(`/workflow/document/${wflowId}/${stageId}/${res.nextDocId}`);
          } else {
            setDialogMessage('You decision has been saved. There are no more documents.');
            toggleHideDialog();
          }
        })
        .catch((error) => {
          if (error.code === 'ValidationFailed') {
            setDecisionMessage(error.message);
            setShowError(true);
          } else {
            setSevereError(true);
          }
        });
    }
  }, [activeDocument, etag, data]);

  const backButtonClick = useCallback(() => {
    const pkg = packageMode ? 'Y' : 'N';
    // check document in
    if (activeDocument) {
      documentService
        .skipDocument(activeDocument.document.ID, 'B', user, stageId, wflowId)
        .then(() => {
          // return to document list
          navigate(`/workflow/id/${wflowId}/${pkg}/${stageId}`);
        })
        .catch((error) => {
          console.log(error);
          setSevereError(true);
        });
    }
  }, [activeDocument]);

  /**
   * Function to skip to the next document in the queue. This marks the document as skipped and
   * upon success of this skip, opens the next document in the queue (see DocumentViewer.tsx)
   */
  const nextButtonClick = useCallback(() => {
    // check document in
    if (activeDocument) {
      documentService
        .skipDocument(activeDocument.document.ID, 'S', user, stageId, wflowId)
        .then((res: NextDocResponse) => {
          // query next doc in queue and navigate to it
          if (res.nextDocId) {
            setShowError(false);
            setSevereError(false);
            navigate(`/workflow/document/${wflowId}/${stageId}/${res.nextDocId}`);
          } else {
            setShouldNavigateHome(true);
            setDialogMessage('No more documents to view.');
            toggleHideDialog();
          }
        })
        .catch((error) => {
          setSevereError(true);
        });
    }
  }, [activeDocument]);

  /**
   * when a document is in Package Mode we have to handle the 'Next' Logic a bit differently.
   * We want to record a decision for each child when they click the 'Next Document in Package'
   * BUT instead of moving to the next document in the queue we move to the next document in the package
   *
   * Privileges tab does not have main decision box. Ignore checking those
   */
  const nextDocumentInPackageClick = useCallback(() => {
    if (data && parentDocument && activeDocument && etag) {
      const parentDocument = data.workflow_documents[0];
      if (
        !privilegeWorkflowIds.includes(activeDocument.document.workflow_id) &&
        !hasDecision(activeDocument.decisions) &&
        parentDocument.stage_id > 10
      ) {
        setDecisionMessage('Please Select a Decision');
        setShowError(true);
        return;
      }
      // record document decision then move to the next document in the package
      documentService
        .recordDecision(activeDocument, user, etag, true)
        .then((res: NextDocResponse) => {
          const idx = selectedChild === undefined ? 0 : selectedChild + 1;

          if (idx < data.workflow_documents[0].children.length) {
            setActiveDocument(configureDocument(data.workflow_documents[0].children[idx], parentDocument.decision));
            setSelectedChild(idx);
          } else {
            setShouldNavigateHome(false);
            setDialogMessage("No More Documents in this package. Please click 'Done'");
            toggleHideDialog();
          }
          if (showError) setShowError(false);
        })
        .catch((error) => {
          if (error.code === 'ValidationFailed') {
            setDecisionMessage(error.message);
            setShowError(true);
          } else {
            console.log(error);
            setSevereError(true);
          }
        });
    }
  }, [activeDocument, etag]);

  const packageDoneClick = () => {
    setShouldNavigateHome(true);
    setDialogMessage('All documents have been coded.');
    documentService
      .validatePackage(docId, user)
      .then((res) => {
        toggleHideDialog();
      })
      .catch((error) => {
        if (error.code === 'ValidationFailed') {
          setDecisionMessage(error.message);
          setShowError(true);
        } else {
          console.log(error);
          setSevereError(true);
        }
      });
  };

  const togglePopup = () => {
    toggleHideDialog();
  };

  if (error) {
    throw WorkflowQueryError(error);
  }
  if (loading || !data) {
    return <Loading />;
  }

  const parentDocument = retrieveDoc(data);
  if (!parentDocument) throw WorkflowError(docId);
  const packageMode: boolean = parentDocument.workflow?.package_mode === 'Y';

  if (!activeDocument) return <></>;
  const radioButtons: DecisionFragment | null = data.workflow_documents[0].decision
    ? filter(DECISION_FRAGMENT, data.workflow_documents[0].decision)
    : null;

  return (
    <WorkflowDocumentView
      severeError={severeError}
      showError={showError}
      hideDialog={hideDialog}
      dialogMessage={dialogMessage}
      decisionMessage={decisionMessage}
      lockAquired={lockAquired}
      packageMode={packageMode}
      activeDocument={activeDocument}
      topLevelDoc={data.workflow_documents[0]}
      radioButtons={radioButtons}
      doneButtonClick={packageMode ? packageDoneClick : doneButtonClick}
      backButtonClick={backButtonClick}
      nextButtonClick={nextButtonClick}
      nextDocumentInPackageClick={nextDocumentInPackageClick}
      shouldNavigateHome={shouldNavigateHome}
      hideDialogFunction={togglePopup}
      debounced={debounced}
      updateResult3={updateResult3}
      updateDecisionTabBoxes={updateDecisionTab}
      updateSelections={updateSelections}
      children={parentDocument.children}
    />
  );
}

function hasDecision(decisions: { [key: string]: decisionType } | undefined): boolean {
  if (!decisions) return false;
  let selected = false;
  Object.entries(decisions)
    .filter((d) => d[1].label !== 'result3') //skip this since it's used for disjointed checkboxes
    .forEach((d) => {
      if (d[1].selected) selected = true;
    });
  return selected;
}

function configureDocument(
  doc: WorkflowDocumentFragment,
  decisions: WorkflowDocumentQuery_workflow_documents_decision | null
): ActiveDocument {
  let d: { [key: string]: decisionType } = {};
  let rb3: result3BoxType[] = [];
  let tabDecisions: result3BoxType[] = [];
  const radioButtons: DecisionFragment | null = decisions ? filter(DECISION_FRAGMENT, decisions) : null;

  // set disjointed (result3Boxes) checkboxes
  const result3: string[] = doc.result3_tag ? doc.result3_tag.replace(/\(/g, '').replace(/\)/g, ',').split(',') : [];

  if (decisions) {
    const checkboxes: DecisionCheckboxesFragment = filter(DECISION_CHECKBOXES, decisions);

    if (radioButtons) d = documentService.configureRadioOptions(doc, radioButtons, checkboxes, decisions);

    //loop through all checkoxes with parent = 0
    Object.entries(checkboxes)
      .filter((x) => x[1] === 0)
      .forEach((c, index) => {
        let checkboxLabel = c[0].replace('_parent', '');

        //find the corresponding label in the decisions
        let l = Object.entries(decisions).find((x) => x[0] === checkboxLabel && x[1] !== null);
        if (l) rb3.push({ label: l[1], key: checkboxLabel, selected: result3.includes((index + 1).toString()) });
      });
  }
  //decision tab checkboxes
  if (decisionTabWorkflowIds.includes(doc.workflow_id) || privilegeWorkflowIds.includes(doc.workflow_id)) {
    DecisionTabCheckboxes.forEach((cb) => {
      tabDecisions.push({
        label: cb.label,
        key: cb.checkboxIdx.toString(),
        selected: result3.includes(cb.checkboxIdx.toString()),
      });
    });
  }
  return {
    document: doc,
    memo: doc.edit_field,
    decisions: d,
    result3Boxes: rb3,
    decisionTabBoxes: tabDecisions,
  };
}

function retrieveDoc(data?: WorkflowDocumentQuery): WorkflowDocumentQuery_workflow_documents | undefined {
  return data && data.workflow_documents.length > 0 ? data.workflow_documents[0] : undefined;
}

function WorkflowError(doc_id: string = '', innerError?: Error) {
  const innerErrorString = innerError ? `Inner Error: ${innerError}` : '';
  return new Error(`Failed to find document with ID: ${doc_id}.${innerErrorString}`);
}

function WorkflowQueryError(innerError?: Error) {
  const innerErrorString = innerError ? `Inner Error: ${innerError}` : '';
  return new Error(`Failed to load document with error: ${innerErrorString}`);
}

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed fetching document with error: ${props.error} `}</Text>;
}

const WorkflowDocument = withErrorBoundary(WorkflowDocumentComponent, ErrorFallback);
export default WorkflowDocument;
