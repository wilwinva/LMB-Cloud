import { mergeStyleSets, memoizeFunction } from 'office-ui-fabric-react';

export const getStatementTabStyles = memoizeFunction((isChanged: boolean) => {
  return mergeStyleSets({
    card: {
      margin: '21px 0',
      maxWidth: '100%',
      padding: '14px',
    },
    none: {
      fontStyle: 'italic',
    },
    stackPadding: {
      marginBottom: '10',
    },
    subTitle: {
      fontWeight: '500',
    },
    tabContent: {
      marginTop: '21',
    },
  });
});

export const getSUILogTabStyles = memoizeFunction((isChanged: boolean) => {
  return mergeStyleSets({
    card: {
      margin: '21px 0',
      maxWidth: '100%',
      padding: '14px',
    },
    none: {
      fontStyle: 'italic',
    },
    stackPadding: {
      marginBottom: '10',
    },
    subTitle: {
      fontWeight: '500',
    },
    tabContent: {
      marginTop: '21',
    },
    textField: {
      fontSize: 16,
      height: 96,
      width: '100%',
    },
    radioRoot: [
      {
        selectors: {
          '> div > div': {
            display: 'flex',
            justifyContent: 'space-evenly',
            width: 110,
          },
        },
      },
    ],
  });
});
