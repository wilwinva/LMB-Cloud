import React from 'react';
import { PurpleHeader } from './primary/PurpleHeader';
import { GreenHeader } from './primary/GreenHeader';
import { Stack, IStackProps, IStackTokens, PrimaryButton, TextField, ITextFieldStyles } from 'office-ui-fabric-react';
import { Dropdown, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

const horizontalGapStackTokens: IStackTokens = {
  childrenGap: 10,
  padding: 10,
};
const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 300 },
};
const columnProps: Partial<IStackProps> = {
  tokens: { childrenGap: 20 },
  styles: { root: { width: 800 } },
};
const textFieldEmail: Partial<ITextFieldStyles> = {
  root: {
    width: 350,
  },
};
const textFieldName: Partial<ITextFieldStyles> = {
  root: {
    width: 350,
  },
};

const textFieldComments: Partial<ITextFieldStyles> = {
  root: {
    width: 500,
  },
};

const options: IDropdownOption[] = [
  { key: 'tdms', text: 'TDMS Systems in General' },
  { key: 'atdt', text: 'ATDT: Automated Technical Data Tracking' },
  { key: 'gi', text: 'GI: Geographic Information' },
  { key: 'sep', text: 'SEP: Site and Engineering Properties' },
  { key: 'tdp', text: 'TDP: Technical Data Parameter Dictionary' },
  { key: 'eis', text: 'EIS: Environment Impact Statement' },
  { key: 'lad', text: 'LAD: License Application Data' },
  { key: 'rdi', text: 'RDI: Repository Design Input' },
  { key: 'sco', text: 'SCO: Site Characteristics Data' },
  { key: 'spa', text: 'SPA: System Performance Assessment' },
  { key: 'vad', text: 'VAD: Viability Assessment Data' },
  { key: 'cst', text: 'CST: Chemical Species Thermodynamics' },
  { key: 'mwd', text: 'MWD: Model Warehouse Data' },
  { key: 'scc', text: 'SCC: Standards, Constants, and Conversions' },
  { key: 'wfc', text: 'WFC: Waste Form Characteristics' },
];

export const Comments: React.FC = () => {
  return (
    <>
      <PurpleHeader title="Your Contact Information" />
      <Stack {...columnProps} horizontal tokens={horizontalGapStackTokens}>
        <TextField label="Your Name:" styles={textFieldName} />
        <TextField label="Your E_Mail (optional):" styles={textFieldEmail} />
      </Stack>
      <Stack horizontal tokens={horizontalGapStackTokens}>
        <TextField label="Your Organization:" />
        <TextField label="Your Telephone # (optional):" />
      </Stack>
      <GreenHeader title="Your Comments" />
      <Stack horizontal tokens={horizontalGapStackTokens}>
        <TextField multiline rows={7} styles={textFieldComments} />
        <Dropdown
          placeholder="Select an option"
          label="TDMS Database or Application:"
          options={options}
          styles={dropdownStyles}
        />
      </Stack>
      <Stack horizontal tokens={horizontalGapStackTokens}>
        <PrimaryButton text="Submit" />
      </Stack>
    </>
  );
};
