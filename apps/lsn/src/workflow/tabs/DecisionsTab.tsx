import React from 'react';
import { Stack, Checkbox } from 'office-ui-fabric-react';
import { result3BoxType } from '../WorkflowDocument';

export interface DecisionsTabProps {
  tabDecsions: result3BoxType[];
  onChange: (key: string, checked: boolean) => void;
  lockAquired: boolean;
}

export const DecisionTabCheckboxes: { label: string; column: number; checkboxIdx: number }[] = [
  { label: 'Not LSN Relevant', column: 1, checkboxIdx: 1 },
  { label: 'No Legal Privilege', column: 1, checkboxIdx: 2 },
  { label: 'DPP', column: 1, checkboxIdx: 3 },
  { label: 'ACP-atty to client', column: 1, checkboxIdx: 4 },
  { label: 'ACP-client to atty', column: 1, checkboxIdx: 5 },
  { label: 'ACP-discusses atty advice', column: 1, checkboxIdx: 6 },
  { label: 'LWP-prepared by atty (FACT)', column: 1, checkboxIdx: 7 },
  { label: 'LWP-prepared by atty (OPINION)', column: 1, checkboxIdx: 8 },
  { label: 'LWP-at atty direction (FACT)', column: 1, checkboxIdx: 9 },
  { label: 'LWP-at atty direction (OPINION)', column: 2, checkboxIdx: 10 },
  { label: 'LWP-other (FACT)', column: 2, checkboxIdx: 11 },
  { label: 'LWP-other (OPINION)', column: 2, checkboxIdx: 12 },
  { label: 'Spent fuel', column: 2, checkboxIdx: 13 },
  { label: 'Proprietary', column: 2, checkboxIdx: 14 },
  { label: 'Copyright Protected', column: 2, checkboxIdx: 15 },
  { label: 'ECP Document', column: 2, checkboxIdx: 16 },
  { label: 'LA Comments', column: 2, checkboxIdx: 17 },
];

export const decisionTabWorkflowIds = [12, 13, 49, 212];

export function DecisionsTab(props: DecisionsTabProps) {
  // Used to add spacing between checkboxes
  const stackTokens = { childrenGap: 20 };
  const checkboxToken = { childrenGap: 10 };

  const onCheckboxChange = (key: string, ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
    props.onChange(key, checked ? checked : false);
  };

  return (
    <Stack horizontal tokens={stackTokens}>
      <Stack tokens={checkboxToken}>
        {DecisionTabCheckboxes.filter((cb) => cb.column === 1).map((cb) => (
          <Checkbox
            label={cb.label}
            key={cb.checkboxIdx}
            checked={props.tabDecsions.find((v) => v.label === cb.label)?.selected}
            onChange={(e, checked) => onCheckboxChange(cb.checkboxIdx.toString(), e, checked)}
            disabled={!props.lockAquired}
          />
        ))}
      </Stack>
      <Stack tokens={checkboxToken}>
        {DecisionTabCheckboxes.filter((cb) => cb.column === 2).map((cb) => (
          <Checkbox
            label={cb.label}
            key={cb.checkboxIdx}
            checked={props.tabDecsions.find((v) => v.label === cb.label)?.selected}
            onChange={(e, checked) => onCheckboxChange(cb.checkboxIdx.toString(), e, checked)}
            disabled={!props.lockAquired}
          />
        ))}
      </Stack>
    </Stack>
  );
}

export default DecisionsTab;
