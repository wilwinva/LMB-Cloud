import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';
import { DocumentNode, gql, useLazyQuery } from '@apollo/client';
import {
  CommandBarButton,
  ICommandBarItemProps,
  IIconProps,
  IStackStyles,
  ITextFieldStyles,
  Stack,
  Text,
  TextField,
} from 'office-ui-fabric-react';
import { Loading } from '@nwm/util';
import TextCommandBar from './TextCommandBar';
import { EfilesOcrQuery } from './__generated__/EfilesOcrQuery';
import { EmailOcrQuery } from './__generated__/EmailOcrQuery';
import { PaperOcrQuery } from './__generated__/PaperOcrQuery';
import { RisrOcrQuery } from './__generated__/RisrOcrQuery';
import { WorkflowDocumentFragment } from '../__generated__/WorkflowDocumentFragment';
import reactStringReplace from 'react-string-replace';
import TextBlock from './TextBlock';
import TextTabNotifications from './TextTabNotifications';
import { AuthenticationContext } from '../../components/AuthProvider/AuthenticationContext';
import env from '../../env';

// I need to be able to generate this from the C# class
export interface PageHit {
  page: string;
  terms: Array<string>;
}

export const PAPER_OCR_QUERY = gql`
  query PaperOcrQuery($id: String, $page: numeric, $withHoldText: Boolean!) {
    paper_ocr(where: { _and: [{ ads_udi: { _eq: $id } }, { ads_page: { _eq: $page } }] }, order_by: { ads_page: asc }) {
      ads_page
      TEXT @skip(if: $withHoldText)
    }
  }
`;

export const RISDATA_OCR_QUERY = gql`
  query RisrOcrQuery($id: String, $page: numeric, $withHoldText: Boolean!) {
    risdata_ocr(
      where: { _and: [{ ads_udi: { _eq: $id } }, { ads_page: { _eq: $page } }] }
      order_by: { ads_page: asc }
    ) {
      ads_page
      TEXT @skip(if: $withHoldText)
    }
  }
`;

export const EFILES_OCR_QUERY = gql`
  query EfilesOcrQuery($id: String, $page: numeric, $withHoldText: Boolean!) {
    efiles_ocr(
      where: { _and: [{ ads_udi: { _eq: $id } }, { ads_page: { _eq: $page } }] }
      order_by: { ads_page: asc }
    ) {
      ads_page
      TEXT @skip(if: $withHoldText)
    }
  }
`;

export const EMAIL_OCR_QUERY = gql`
  query EmailOcrQuery($id: String, $page: numeric, $withHoldText: Boolean!) {
    email_ocr(where: { _and: [{ ads_udi: { _eq: $id } }, { ads_page: { _eq: $page } }] }, order_by: { ads_page: asc }) {
      ads_udi
      ads_page
      TEXT @skip(if: $withHoldText)
    }
  }
`;

export const KEYWORKDS_FRAGMENT = gql`
  fragment KeywordsFragment on workflow_documents {
    keywords {
      word
    }
  }
`;

export interface TextTabProps {
  document: WorkflowDocumentFragment | undefined;
}

export function TextTabComponent(props: TextTabProps) {
  let gqlquery = (function (schemaName: string | undefined): DocumentNode {
    switch (schemaName) {
      case 'RISDATA':
        return RISDATA_OCR_QUERY;
      case 'PAPER':
        return PAPER_OCR_QUERY;
      case 'EFILES':
        return EFILES_OCR_QUERY;
      default:
        return EMAIL_OCR_QUERY;
    }
  })(props.document?.SCHEMA_NAME);

  const [page, setPage] = useState<number>();
  const runHighlight = useRef(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [higlightButtonDisabled, setHighlightButtonDisabled] = useState<boolean>(true);
  const [pageText, setPageText] = useState<string | null | undefined>();
  const [pagesWithHits, setpagesWithHits] = useState<{ page: string }[]>([]);
  const [totalPages, setTotalPages] = useState('1');
  const [highlightData, setHighlightData] = useState<PageHit[]>();
  const [pageTextDisp, setPageTextDisp] = useState<ReactElement>(<></>);
  const [searchedKeywords, setSearchedKeywords] = useState<string[]>([]);

  // load all pages available. I want to avoid loading all pages and text in a single query. Text returned can be massive
  const [getPages, { loading, error, data }] = useLazyQuery(gqlquery);
  const authContext = React.useContext(AuthenticationContext);

  useEffect(() => {
    if (props.document) {
      getPages({ variables: { id: props.document.ads_udi, withHoldText: true } });

      fetch(
        env.apiManagementUri +
          '/SearchOcrIndex?ads_udi=' +
          props.document.ads_udi +
          '&workflowId=' +
          props.document.workflow_id,
        {
          method: 'GET',
          headers: new Headers({ Authorization: `Bearer ${authContext.user.bearerToken}` }),
        }
      )
        .then((res) => res.json())
        .then(
          (result: PageHit[]) => {
            if (result.length === 0) return;

            setHighlightData(result);
            let p: { page: string }[] = getPagesFromAzureSearchQuery(result);

            //preload my pages that have valid hits
            setpagesWithHits((x) => x.concat(p));
            setHighlightButtonDisabled(false);
          },
          (error) => {
            setShowError(true);
            console.log(error);
          }
        );
    }
  }, [props.document]);

  useEffect(() => {
    let p = getPage(data);
    if (p) {
      setPage(p);
      if (getText(data)) setPageText(getText(data));

      // if there's text present then we're querying on a single page. Otherwise set total result length
      if (getText(data) === undefined && data) setTotalPages(getTotalPages(data).toString());
    }
  }, [data]);

  useEffect(() => {
    if (runHighlight.current) {
      runHighlight.current = false;
      HighlightNextKeyword();
    } else {
      setPageTextDisp(<>{pageText}</>);
    }
  }, [pageText]);

  useEffect(() => {
    if (page && props.document) {
      setSearchedKeywords([]);
      getPages({ variables: { id: props.document.ads_udi, page: page, withHoldText: false } });
    }
  }, [page]);

  if (error) {
    throw QueryError(props.document?.ads_udi, error);
  }
  if (loading) {
    return (
      <Loading>
        <Text>Loading page text...</Text>
      </Loading>
    );
  }

  if (!props.document || !page) return <Text> There are no pages to display</Text>;

  const pageLeftClick = () => {
    let prevPage = page - 1;
    if (prevPage > 0) setPage(prevPage);
  };

  const pageRightClick = () => {
    let nextPage = page + 1;
    if (nextPage <= parseInt(totalPages)) setPage(nextPage);
  };

  const highlightClick = () => {
    if (!highlightData || pagesWithHits.length === 0) return;

    //if they're viewing this message and they click again, they want to start over
    if (showMessage) setShowMessage(false);

    let h = highlightData.find((x) => x.page === pagesWithHits[0].page);
    if (!h) return;
    // if we're on another page and we've initiated this click change to the first page with a hit
    // this initiates a query to get the page text which is needed before a highlight can happen
    if (page !== parseInt(h.page)) {
      runHighlight.current = true;
      setPage(parseInt(h.page));
    } else {
      HighlightNextKeyword();
    }
  };

  function HighlightNextKeyword() {
    if (!highlightData) return;
    let tempkeys: string[] = [];

    for (let k = 0; k < pagesWithHits.length; k++) {
      let h = highlightData.find((x) => x.page === pagesWithHits[k].page);
      if (!h) break;
      for (let i = 0; i < h.terms.length; i++) {
        let keyword = h.terms[i];
        tempkeys.push(keyword);
        if (!searchedKeywords.includes(keyword)) {
          let regex = '\\b(';
          regex += escapeRegExp(keyword);
          regex += ')\\b';
          //console.log(regex);
          if (pageText && RegExp(regex, 'i').test(pageText)) {
            let rt = reactStringReplace(pageText, RegExp(regex, 'i'), (match, i) => <em>{match}</em>);
            setPageTextDisp(<>{rt}</>);
            setSearchedKeywords(tempkeys);
            return rt;
          }
        }
      }
      //if we've exhausted all terms for this page, check the next
      // @ts-ignore --not sure why it's complaining h might be undefined, we've already checked at the start of the loop
      setpagesWithHits(pagesWithHits.filter((p) => p.page !== h.page));
      if (pagesWithHits[k + 1]) {
        runHighlight.current = true;
        setPage(parseInt(pagesWithHits[k + 1].page));
        break;
      } else {
        let p: { page: string }[] = getPagesFromAzureSearchQuery(highlightData);
        // load pages that have valid hits
        setpagesWithHits((x) => x.concat(p));
        setShowMessage(true);
      }
    }
  }

  const stackStyles: IStackStyles = {
    root: {
      display: 'inline-flex',
      flexFlow: 'nowrap',
      selectors: {
        'span.divider': {
          position: 'relative',
          top: '25%',
          paddingLeft: '5px',
          paddingRight: '5px',
        },
      },
    },
  };

  const statusIcon: IIconProps = { iconName: 'NumberSymbol' };
  const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 50, fontSize: 9, top: 5 } };

  // Custom renderer for inputing page number
  // do I want or even need the button if I trigger on keydown
  const CustomButton: React.FunctionComponent<ICommandBarItemProps> = (props) => {
    return (
      <Stack styles={stackStyles}>
        <TextField styles={textFieldStyles} defaultValue={page.toString()} />
        <Text className="divider"> of </Text>
        <TextField styles={textFieldStyles} defaultValue={totalPages} readOnly={true} />
        <CommandBarButton iconProps={statusIcon} />
      </Stack>
    );
  };
  const CustomItem: ICommandBarItemProps = {
    key: 'customItem',
    commandBarButtonAs: CustomButton,
  };

  return (
    <>
      <TextCommandBar
        onPageLeftClick={pageLeftClick}
        onPageRightClick={pageRightClick}
        onHighlightClick={highlightClick}
        CustomItem={CustomItem}
        highlightButtonDisabled={higlightButtonDisabled}
      />
      <TextTabNotifications showMessage={showMessage} showError={showError} />
      <TextBlock displayText={pageTextDisp} />
    </>
  );
}

function getPage(data?: EfilesOcrQuery | EmailOcrQuery | PaperOcrQuery | RisrOcrQuery) {
  if (data && 'efiles_ocr' in data && data.efiles_ocr.length > 0)
    return data.efiles_ocr[0].ads_page && data.efiles_ocr[0].ads_page;
  if (data && 'paper_ocr' in data && data.paper_ocr.length > 0) return data.paper_ocr[0].ads_page;
  if (data && 'email_ocr' in data && data.email_ocr.length > 0) return data.email_ocr[0].ads_page;
  if (data && 'risdata_ocr' in data && data.risdata_ocr.length > 0) return data.risdata_ocr[0].ads_page;
  return undefined;
}

function getTotalPages(data?: EfilesOcrQuery | EmailOcrQuery | PaperOcrQuery | RisrOcrQuery) {
  if (data && 'efiles_ocr' in data) return data.efiles_ocr.length;
  if (data && 'paper_ocr' in data) return data.paper_ocr.length;
  if (data && 'email_ocr' in data) return data.email_ocr.length;
  if (data && 'risdata_ocr' in data) return data.risdata_ocr.length;
  return 0;
}

function getText(data?: EfilesOcrQuery | EmailOcrQuery | PaperOcrQuery | RisrOcrQuery) {
  if (data && 'efiles_ocr' in data) return data.efiles_ocr[0].TEXT;
  if (data && 'paper_ocr' in data) return data.paper_ocr[0].TEXT;
  if (data && 'email_ocr' in data) return data.email_ocr[0].TEXT;
  if (data && 'risdata_ocr' in data) return data.risdata_ocr[0].TEXT;
  return undefined;
}

function escapeRegExp(textString: string) {
  return textString.replace(/([.*+?^=!:${}()|[]\/\])/g, '\\$1');
}

function getPagesFromAzureSearchQuery(data: PageHit[]) {
  let p: { page: string }[] = [];
  data.map((x) => p.push({ page: x.page }));
  return p;
}

function QueryError(ads_udi?: string, innerError?: Error) {
  const innerErrorString = innerError ? `Inner Error: ${innerError}` : '';
  return new Error(`Failed to load pages with error: ${innerErrorString}`);
}

function ErrorFallback(props: FallbackProps) {
  return <Text>{` Failed to fetch pages with error: ${props.error} `}</Text>;
}

const TextTab = withErrorBoundary(TextTabComponent, ErrorFallback);
export default TextTab;
