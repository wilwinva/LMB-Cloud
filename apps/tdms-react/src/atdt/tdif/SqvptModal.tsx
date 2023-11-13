import React from 'react';
import { useId, useBoolean } from '@uifabric/react-hooks';
import {
  getTheme,
  mergeStyleSets,
  FontWeights,
  ContextualMenu,
  Modal,
  IDragOptions,
  IconButton,
  IIconProps,
  Link,
} from 'office-ui-fabric-react';

const dragOptions: IDragOptions = {
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
};
const cancelIcon: IIconProps = { iconName: 'Cancel' };

export const SqvptModal: React.FunctionComponent = () => {
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
  const [isDraggable] = useBoolean(false);

  // Use useId() to ensure that the IDs are unique on the page.
  // (It's also okay to use plain strings and manually ensure uniqueness.)
  const titleId = useId('title');
  const ulStyle = {
    listStyleType: 'none',
  };

  // @ts-ignore
  return (
    <>
      <Link onClick={showModal} to={'#'}>
        SQVPT
      </Link>
      <Modal
        titleAriaId={titleId}
        isOpen={isModalOpen}
        onDismiss={hideModal}
        isBlocking={false}
        containerClassName={contentStyles.container}
        dragOptions={isDraggable ? dragOptions : undefined}
      >
        <div className={contentStyles.header}>
          <span id={titleId}>[SQVPT]</span>
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close SQVPT popup"
            onClick={hideModal}
          />
        </div>
        <div className={contentStyles.body}>
          TO DO - Format modal and confirm list text is complete.
          <ul style={ulStyle}>
            <li>
              Source:
              <ul>
                <li>A = Acquired</li>
                <li>D = Developed</li>
              </ul>
            </li>
            <li>
              Qualification:
              <ul>
                <li>Y = Qualified</li>
                <li>N = Not Qualified</li>
                <li>E =- Established Fact (Qualified)</li>
              </ul>
            </li>
            <li>
              Verification:
              <ul>
                <li>"#" TBV # assigned - see the DTN</li>
                <li>"0" Post PVAR, no verification required</li>
                <li>"1" Check completed per governing procedure(s)</li>
                <li>"2" No check required per governing procedure(s)</li>
                <li>"." Not verified</li>
              </ul>
            </li>
            <li>
              PMR/AMR Support:
              <ul>
                <li>D = Direct Support</li>
                <li>I = Indirect Support</li>
                <li>N = No DIRS Support</li>
                <li>G = General DIRS Support</li>
              </ul>
            </li>
            <li>
              Technical Document:
              <ul>
                <li>O = Product Output</li>
                <li>P = Preliminary</li>
                <li>"'" = No Document</li>
              </ul>
            </li>
          </ul>
        </div>
      </Modal>
    </>
  );
};

const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
  },
  header: [
    // tslint:disable-next-line:deprecation
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
    },
  ],
  body: {
    flex: '4 4 auto',
    padding: '0 24px 24px 24px',
    overflowY: 'hidden',
    selectors: {
      p: { margin: '14px 0' },
      'p:first-child': { marginTop: 0 },
      'p:last-child': { marginBottom: 0 },
    },
  },
});

const iconButtonStyles = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};
