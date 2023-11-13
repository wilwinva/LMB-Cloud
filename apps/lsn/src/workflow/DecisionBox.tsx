import React from 'react';
import DecisionCheckboxes from './DecisionCheckboxes';
import { ChoiceGroup, IChoiceGroupOption, Separator, Stack, Text } from 'office-ui-fabric-react';
import { gql } from '@apollo/client';
import { WorkflowDocumentFragment } from './__generated__/WorkflowDocumentFragment';
import { DecisionFragment } from './__generated__/DecisionFragment';
import OtherCheckboxes from './OtherCheckboxes';
import { decisionType, result3BoxType } from './WorkflowDocument';

/**
 *
 * This decision box UI in Legacy LSN is based off of data from the table
 * workflow.workflow_decision and retrieved based on workflow ID
 *
 * There's possibility of 7 Radio buttons but it looks like only 3 are ever truly used.
 * There is also checkboxes that are related to the radio buttons effectively called children
 * in the database
 *
 * The result of the decision comes from the workflow_document
 */

export const DECISION_FRAGMENT = gql`
  fragment DecisionFragment on workflow_workflow_decision {
    radio1
    radio10
    radio2
    radio3
    radio4
    radio5
    radio6
    radio7
    radio8
    radio9
  }
`;

export const DECISION_CHECKBOXES = gql`
  fragment DecisionCheckboxesFragment on workflow_workflow_decision {
    check1_parent
    check2_parent
    check3_parent
    check4_parent
    check5_parent
    check6_parent
    check7_parent
    check8_parent
    check9_parent
    check10_parent
    check11_parent
    check12_parent
    check13_parent
    check14_parent
    check15_parent
  }
`;

export interface DecisionBoxProps {
  document: WorkflowDocumentFragment | undefined;
  workflowId: number;
  decisions: { [key: string]: decisionType };
  result3Boxes: result3BoxType[];
  radioButtons: DecisionFragment | null;
  updateSelections: (selections: { [key: string]: decisionType }) => void;
  updateResult3: (key: string, checked: boolean) => void;
  decisionButtons: any;
  disabled: boolean;
}

function DecisionBox(props: DecisionBoxProps) {
  const decision = props.decisionButtons;

  const onCheckboxChange = (
    parentElement: string,
    childElement: string,
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean
  ) => {
    let selections: { [key: string]: decisionType } = { ...props.decisions };
    let selected: boolean = !!checked;

    Object.entries(selections)
      .filter((x) => x[1].key === parentElement)
      .map((x) => (x[1].checkboxes[childElement].selected = selected));

    props.updateSelections(selections);
  };

  // Array for radio buttons
  const options: IChoiceGroupOption[] = [];
  const disabledSelection: boolean = props.disabled; //props.document?.stage_lock === 'Y' && props.document.stage_user !== userId;
  Object.entries(props.decisions)
    .filter((d) => d[1].label !== 'result3') //skip this since it's used for disjointed checkboxes
    .forEach((d) => {
      const cb: {
        checkboxParent: number | undefined;
        text: string | null;
        key: string;
        selected: boolean;
      }[] = [];
      Object.entries(d[1].checkboxes).forEach((c) => {
        cb.push({
          key: c[0],
          text: decision[c[0]],
          checkboxParent: Number(d[1].key.replace('radio', '')),
          selected: c[1].selected,
        });
      });
      options.push({
        key: d[1].key,
        text: d[1].label,
        checked: d[1].selected, // seriously, this is how they did it in legacy
        disabled: disabledSelection,
        onRenderField: (_props, render) => {
          return (
            <>
              {render!(_props)}
              <DecisionCheckboxes
                parentKey={Number(d[1].key.replace('radio', ''))}
                parentElement={d[1].key}
                checkboxes={cb}
                disabled={_props ? _props.disabled : false}
                onChange={onCheckboxChange}
              />
            </>
          );
        },
      });
    });

  // on change function for parent radio buttons
  const _onChange = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: IChoiceGroupOption): void => {
    // mark all others as false including any associated checkboxes
    if (option) {
      let selections: { [key: string]: decisionType } = { ...props.decisions };
      Object.entries(selections)
        .filter((x) => x[1].key !== option.key)
        .forEach((d) => {
          d[1].selected = false;
          Object.entries(d[1].checkboxes).map((c) => (d[1].checkboxes[c[0]].selected = false));
        });

      // mark our new selection as true and update state
      selections[option.key].selected = true;
      props.updateSelections(selections);
    }
  };

  const onResult3BoxesChange = (
    key: string,
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean
  ) => {
    props.updateResult3(key, checked ? checked : false);
  };

  return (
    <Stack>
      <Text>Accession #:</Text>
      <Text>{props.document?.acc_no}</Text>
      <Separator>
        <Text>Decision</Text>
      </Separator>
      <Stack.Item>
        <ChoiceGroup options={options} onChange={_onChange} required={true} key="1" />
      </Stack.Item>
      <Stack.Item>
        <OtherCheckboxes
          result3Boxes={props.result3Boxes}
          onChange={onResult3BoxesChange}
          disabled={disabledSelection}
        />
      </Stack.Item>
    </Stack>
  );
}

export default React.memo(DecisionBox);
