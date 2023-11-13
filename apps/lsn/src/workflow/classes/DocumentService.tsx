import { decisionType, result3BoxType } from '../WorkflowDocument';
import { DecisionFragment } from '../__generated__/DecisionFragment';
import { baseHex } from '../DecisionCheckboxes';
import { DecisionCheckboxesFragment } from '../__generated__/DecisionCheckboxesFragment';
import { WorkflowDocumentFragment } from '../__generated__/WorkflowDocumentFragment';
import { AuthenticatedUser } from '../../components/AuthProvider/AuthenticatedUser';
import env from '../../env';
import { WorkflowDocumentQuery_workflow_documents_decision } from '../__generated__/WorkflowDocumentQuery';
import { ActiveDocument } from '../WorkflowDocument';
import { decisionTabWorkflowIds } from '../tabs/DecisionsTab';
import { privilegeWorkflowIds } from '../tabs/PrivilegesTab';

class DocumentService {
  baseUrl: string;

  constructor() {
    this.baseUrl = env.apiManagementUri; // 'http://localhost:7071/api';
  }
  async aquireLock(user: AuthenticatedUser, workflowId: string, docId: string) {
    const lockRequest: LockRequest = {
      userId: user.userId,
      workflowId: workflowId,
      docId: docId,
    };
    const LockRequestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.bearerToken}` },
      body: JSON.stringify(lockRequest),
    };

    let fetchResult = await fetch(this.baseUrl + '/DocumentLock', LockRequestOptions);
    const result = await fetchResult.json();

    if (fetchResult.ok) return result;

    const responseError = {
      type: 'Error',
      message: result.Message || 'Something went wrong',
      data: result.data || '',
      code: result.Error || '',
    };

    let error = new Error();
    error = { ...error, ...responseError };
    throw error;
  }

  async recordDecision(activeDocument: ActiveDocument, user: AuthenticatedUser, etag: string, isPackage: boolean) {
    let r3 =
      decisionTabWorkflowIds.includes(activeDocument.document.workflow_id) ||
      privilegeWorkflowIds.includes(activeDocument.document.workflow_id)
        ? activeDocument.decisionTabBoxes
        : activeDocument.result3Boxes;

    let done: DoneDecision = {
      radios: activeDocument.decisions,
      result3: r3 || [],
      memo: activeDocument.memo,
      workflowId: activeDocument.document.workflow_id,
      docId: activeDocument.document.ID,
      userId: user.userId,
      isPackage: isPackage,
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ETag: etag, Authorization: `Bearer ${user.bearerToken}` },
      body: JSON.stringify(done),
    };

    let fetchResult = await fetch(this.baseUrl + '/AdvanceStage', requestOptions);
    const result = await fetchResult.json();

    if (fetchResult.ok) return result;
    const responseError = {
      type: 'Error',
      message: result.Message || 'Something went wrong',
      data: result.data || '',
      code: result.Error || '',
    };

    let error = new Error();
    error = { ...error, ...responseError };
    throw error;
  }

  async validatePackage(docId: string, user: AuthenticatedUser) {
    const validateRequest = {
      docId: docId,
      userId: user.userId,
    };
    const requstOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.bearerToken}` },
      body: JSON.stringify(validateRequest),
    };
    return await this._fetch(this.baseUrl + '/ValidatePackage', requstOptions);
  }

  async skipDocument(docId: string, skipFlag: string, user: AuthenticatedUser, stageId: string, worfklowId: string) {
    const skipRequest: SkipRequest = {
      docId: docId,
      skipFlag: skipFlag,
      userId: user.userId,
      stageId: stageId,
      workflowId: worfklowId,
    };

    const SkipRequestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.bearerToken}` },
      body: JSON.stringify(skipRequest),
    };

    return await this._fetch(this.baseUrl + '/DocumentSkip', SkipRequestOptions);
  }

  async _fetch(url: string, requestOptions: any) {
    let fetchResult = await fetch(url, requestOptions);
    const result = await fetchResult.json();

    if (fetchResult.ok) return result;
    const responseError = {
      type: 'Error',
      message: result.Message || 'Something went wrong',
      data: result.data || '',
      code: result.Error || '',
    };

    let error = new Error();
    error = { ...error, ...responseError };
    throw error;
  }

  configureRadioOptions(
    activeDocument: WorkflowDocumentFragment,
    radioButtons: DecisionFragment,
    checkboxes: DecisionCheckboxesFragment,
    decisions: WorkflowDocumentQuery_workflow_documents_decision
  ): { [key: string]: decisionType } {
    let d: { [key: string]: decisionType } = {};
    let result2 = activeDocument?.result2_tag || '';

    Object.entries(radioButtons)
      .filter((kv) => kv[1] !== null)
      .forEach((kv) => {
        d[kv[0]] = {
          key: kv[0],
          label: kv[1] || '',
          selected: activeDocument && activeDocument.RESULT === kv[1],
          checkboxes: {},
        };

        Object.entries(checkboxes)
          .filter((x) => x[1] === Number(kv[0].replace('radio', '')))
          .forEach((c) => {
            d[kv[0]].checkboxes[getCheckboxName(c[0])] = {
              selected: result2.includes(baseHex[Number(c[0].replace('check', '').replace('_parent', ''))]),
              label: decisions[getCheckboxName(c[0])] || '',
            };
          });
      });
    return d;
  }
}

function getCheckboxName(
  checkbox: string
):
  | 'check1'
  | 'check2'
  | 'check3'
  | 'check4'
  | 'check5'
  | 'check6'
  | 'check7'
  | 'check8'
  | 'check9'
  | 'check10'
  | 'check11'
  | 'check12'
  | 'check13'
  | 'check14'
  | 'check15' {
  switch (checkbox.replace('_parent', '')) {
    case 'check1':
      return 'check1';
    case 'check2':
      return 'check2';
    case 'check3':
      return 'check3';
    case 'check4':
      return 'check4';
    case 'check5':
      return 'check5';
    case 'check6':
      return 'check6';
    case 'check7':
      return 'check7';
    case 'check8':
      return 'check8';
    case 'check9':
      return 'check9';
    case 'check10':
      return 'check10';
    case 'check11':
      return 'check11';
    case 'check12':
      return 'check12';
    case 'check13':
      return 'check13';
    case 'check14':
      return 'check14';
    default:
      return 'check15';
  }
}

const documentService = new DocumentService();
export default documentService;

interface DoneDecision {
  radios: { [key: string]: decisionType };
  result3: result3BoxType[];
  memo: string | null;
  workflowId: string;
  docId: string;
  userId: string;
  isPackage: boolean;
}

interface LockRequest {
  workflowId: string;
  docId: string;
  userId: string;
}

export interface DocumentLockResponse {
  base64Decision: string;
}

interface SkipRequest {
  docId: string;
  skipFlag: string;
  userId: string;
  stageId: string;
  workflowId: string;
}
export interface NextDocResponse {
  nextDocId: string;
}
