import React, {
  createElement,
  forwardRef,
  MutableRefObject,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import { TodoPlaceholder } from '@nwm/util';
import CSS from 'csstype';
import { saveAs } from 'file-saver';
import { ApiToken, Authenticated, AuthenticatedContext } from '@nwm/azure-authentication';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Spinner, SpinnerSize, Stack } from 'office-ui-fabric-react';
import Mime from 'mime/Mime'; /** Note: the @types/mime _must_ be runtime and not dev dependencies; will see misleading node fs issue otherwise */
import filter from 'lodash/fp/filter';
import map from 'lodash/fp/map';
import flatten from 'lodash/fp/flatten';
import flow from 'lodash/fp/flow';
import _ from 'lodash';

const parseUrl = require('parse-url');

export enum Method {
  DISPLAY_RAW_HTML = 'display_raw_html',
  DISPLAY_IN_IFRAME = 'display_in_iframe',
  DOWNLOAD_FILE = 'download_file',
  GO_TO_FILE = 'go_to_file', //Not used yet
  POST = 'post', //Not used yet
}

type htmlData = [string, string, string];

// TODO: Move helper to UIFabric
export interface FileData {
  data_set: {
    transfer: {
      component: string;
    };
  };
  key: string;
  dtn: string;
  data_name: string;
  file_name: string;
  file_path: string;
  file_type: string;
  sub_cat: string;
  lock_flag: string;
}

export const getDownloadUrl = (fileData: FileData) => {
  if (fileData.file_type.toUpperCase() === 'DIRECTORY') {
    const blobPath = fileData.file_path.replace('/legacy/', '');
    const transfer = fileData.data_set.transfer.component.toLowerCase();

    return `/${transfer}/directory?path=${blobPath}`;
  }

  return `${process.env.BLOB_STORAGE_TDMS}${fileData.file_path}${fileData.file_name}`;
};

export interface ExternalLinkProps {
  href: string;
  method: Method;
  apiToken: ApiToken;
  cssProperties?: CSS.Properties | undefined;
  linkInterceptions?: LinkInterception[] | undefined;
  onResolve?: (response?: AxiosResponse) => void;
  onReject?: (err?: Error) => void;
  fileList?: FileData[];
}

export interface LinkInterception {
  isDataUrl: boolean;
  b: (href: string) => boolean;
  base: string;
  baseRegex: RegExp;
}

export interface ParsedUrl {
  protocols: string[];
  protocol: string;
  port: string;
  resource: string;
  user: string;
  pathname: string;
  hash: string;
  search?: string | undefined;
  href: string;
}

const defaultButtonLinkCssProperties: CSS.Properties = {
  background: 'none',
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  borderBottom: 'none',
  font: 'inherit',
  padding: '0',
  color: 'blue',
  cursor: 'pointer',
};

export const customMime = new Mime({
  'text/html': ['html', 'htm'],
  'application/zip': ['zip', 'Z'],
  'image/png': ['png'],
  'image/jpeg': ['jpeg', 'jpg'],
  'application/gzip': ['gz'],
  'text/csv': ['csv'],
  'text/plain': ['txt', 'e00'],
  'application/msword': ['doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
  'application/vnd.ms-excel': ['xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['xlsx'],
  'application/pdf': ['pdf'],
});

const baseAxiosRequestConfig: (contentType: string) => AxiosRequestConfig = (contentType: string) => ({
  responseType: 'blob',
  headers: {
    'Content-Type': contentType,
    'x-ms-date': new Date().toUTCString(),
    'x-ms-version': '2019-12-12',
  },
});

const findApiToken = (externalLinkProps: ExternalLinkProps) => (authenticated: Authenticated) => {
  const { apiTokens } = authenticated;
  const { apiToken } = externalLinkProps;

  return apiTokens.find((a: ApiToken) => a.host === apiToken.host);
};

//todo: add tests for this
function ExternalLinkBase(
  props: React.PropsWithChildren<ExternalLinkProps>,
  ref?:
    | MutableRefObject<HTMLIFrameElement | HTMLDivElement | null>
    | ((instance: HTMLIFrameElement | HTMLDivElement | null) => void)
    | null
): ReactElement {
  const {
    href,
    method,
    apiToken,
    cssProperties,
    linkInterceptions,
    children,
    onResolve = () => {},
    onReject = () => {},
  } = props;
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const authenticated = useContext(AuthenticatedContext);
  const { request, apiTokens }: Authenticated = authenticated;
  const [isDownloadInProgress, setIsDownloadInProgress] = useState(false);
  const [isTriggerDownload, setIsTriggerDownload] = useState(false);
  const [iframeContent, setIframeContent] = useState<string | undefined>(undefined);
  const [rawHtml, setRawHtml] = useState<string | undefined>(undefined);
  const parsedUrl = lowerCaseFileExtension(parseUrl(href));
  const newFile = file(parsedUrl);
  const mime: null | string = customMime.getType(parsedUrl.pathname);
  const foundApiToken = findApiToken(props)(authenticated);

  useEffect(() => {
    if (foundApiToken) {
      const contentType = mime ? mime : 'text/plain';

      if (method === Method.DISPLAY_IN_IFRAME && !iframeContent) {
        setIsDownloadInProgress(true);
        doGetIframeContent(props)(authenticated).then(
          (res) => {
            setIframeContent(res);
            setIsDownloadInProgress(false);
            onResolve(res);
            return undefined;
          },
          (err) => {
            setErrorMessage(`Critical error: error displaying data in iframe ${err}`);
            setIsDownloadInProgress(false);
            onReject(err);
          }
        );
      } else if (method === Method.DISPLAY_RAW_HTML && !rawHtml) {
        setIsDownloadInProgress(true);

        doGetRawHtml(props)(authenticated).then(
          (res) => {
            setRawHtml(res);
            setIsDownloadInProgress(false);
            onResolve(res);

            return;
          },
          (err) => {
            setErrorMessage(`Critical error: error displaying raw html ${err}`);
            setIsDownloadInProgress(false);
            onReject(err);
          }
        );
      } else if (method === Method.DOWNLOAD_FILE && isTriggerDownload && !isDownloadInProgress) {
        setIsDownloadInProgress(true);

        if (!newFile) {
          setIsDownloadInProgress(false);
          setIsTriggerDownload(false);
          setErrorMessage(`Error downloading file, no filename`);
          return;
        }

        const thenDo = (res: AxiosResponse<Blob>) => {
          if (contentType === 'text/html' && linkInterceptions) {
            res.data.text().then((html) => {
              const newHtml = replaceLinks([props, authenticated, html] as [ExternalLinkProps, Authenticated, string]);

              if (newHtml) {
                newHtml.then(([html, ,]: htmlData) => {
                  const blob = new Blob([html], { type: 'text/html' });
                  saveAs(blob, newFile!);
                  setIsDownloadInProgress(false);
                  setIsTriggerDownload(false);
                });
                return;
              }

              const blob = new Blob([html], { type: 'text/html' });

              saveAs(blob, newFile!);
              setIsDownloadInProgress(false);
              setIsTriggerDownload(false);
            });

            return;
          }

          saveAs(res.data, newFile!);
          setIsDownloadInProgress(false);
          setIsTriggerDownload(false);
        };

        const errorOut = ([err, href]: [string, string]) => {
          setErrorMessage(
            err.includes('404')
              ? `Critical error: Data not found. Please contact a TDMS Administrator. Cannot find data at ${href}`
              : `Critical error: Cannot download file ${err}. Issue with data at ${href}`
          );
          setIsDownloadInProgress(false);
          setIsTriggerDownload(false);
        };

        request<Blob>(foundApiToken, {
          ...baseAxiosRequestConfig(contentType),
          url: parsedUrl.href,
        }).then(thenDo, (err: Error) => {
          if (err.toString().includes('404') && lowerCaseFile(parsedUrl)) {
            request<Blob>(foundApiToken, {
              ...baseAxiosRequestConfig(contentType),
              url: lowerCaseFile(parsedUrl)!.href,
            }).then(thenDo, (e: Error) => errorOut([e.toString(), lowerCaseFile(parsedUrl)!.href]));

            return;
          }

          errorOut([err.toString(), parsedUrl.href]);
        });
      }
    }
  }, [isTriggerDownload]);
  if (!parsedUrl) {
    return error(`When trying to invoke ExternalLink, cannot parse href ${href}`);
  } else if (!parsedUrl.pathname) {
    return error(`When trying to invoke ExternalLink, path must exist ${href}`);
  } else if (!new Blob()) {
    return error(
      'When using ExternalLink file-saver utility must be compatible with current browser, this is not the case. Blob.js is not supported.'
    );
  } else if (errorMessage) {
    return error(errorMessage);
  } else if (!apiTokens.some((a: ApiToken) => a.host === apiToken.host)) {
    return error(`When trying to invoke an ExternalLink, no suitable Api token found`);
  } else if (method === Method.GO_TO_FILE || method === Method.POST) {
    return error(
      `Unsupported ExternalLink method ${method}, only DOWNLOAD_FILE and DISPLAY_IN_IFRAME is supported now`
    );
  } else if (method === Method.DISPLAY_IN_IFRAME) {
    if (isDownloadInProgress) {
      return <Spinner size={SpinnerSize.small} />;
    } else if (iframeContent) {
      return (
        <iframe
          title={'File'}
          style={cssProperties}
          src={iframeContent}
          ref={ref as MutableRefObject<HTMLIFrameElement>}
        />
      );
    }

    return <iframe title={'File'} style={cssProperties} ref={ref as MutableRefObject<HTMLIFrameElement>} />;
  } else if (method === Method.DISPLAY_RAW_HTML) {
    if (isDownloadInProgress) {
      return <Spinner size={SpinnerSize.small} />;
    } else if (rawHtml) {
      return <div dangerouslySetInnerHTML={{ __html: rawHtml }} ref={ref as MutableRefObject<HTMLDivElement>} />;
    }

    return <></>;
  }

  const download = (_e: React.SyntheticEvent) => {
    setIsTriggerDownload(true);
  };

  const spinner = isDownloadInProgress ? (
    <Stack.Item>
      <Spinner size={SpinnerSize.medium} />
    </Stack.Item>
  ) : (
    <></>
  );

  if (!cssProperties) {
    return (
      <Stack horizontal tokens={{ childrenGap: 5 }}>
        <Stack.Item>
          <button
            disabled={isDownloadInProgress}
            style={defaultButtonLinkCssProperties}
            onClick={download}
            title={'click to download the data file associated with this data set'}
          >
            {children ?? null}
          </button>
        </Stack.Item>
        {spinner}
      </Stack>
    );
  }

  return (
    <Stack horizontal tokens={{ childrenGap: 5 }}>
      <Stack.Item>
        <button
          disabled={isDownloadInProgress}
          style={{ ...defaultButtonLinkCssProperties, ...cssProperties }}
          onClick={download}
          title={'click to download the data file associated with this data set'}
        >
          {children ?? null}
        </button>
      </Stack.Item>
      {spinner}
    </Stack>
  );
}

export const ExternalLink = forwardRef<
  HTMLIFrameElement | HTMLDivElement | null,
  React.PropsWithChildren<ExternalLinkProps>
>(ExternalLinkBase);

const doGetRawHtml = (props: React.PropsWithChildren<ExternalLinkProps>) => async (authenticated: Authenticated) => {
  const { href, linkInterceptions } = props;
  const parsedUrl = lowerCaseFileExtension(parseUrl(href));
  const { request } = authenticated;
  const foundApiToken = findApiToken(props)(authenticated);

  return await request<Blob>(foundApiToken!, {
    ...baseAxiosRequestConfig('text/html'),
    url: parsedUrl.href,
  }).then(
    (res: AxiosResponse) => {
      return res.data.text().then((html: string) => {
        if (linkInterceptions) {
          const newHtml = updateHtmlLinks([props, authenticated, html] as [ExternalLinkProps, Authenticated, string]);

          return newHtml
            ? newHtml.then(([html, ,]: htmlData) => html)
            : new Promise<string>((resolve) => resolve(html));
        }
        return new Promise<string>((resolve) => resolve(html));
      });
    },
    (err: Error) => {
      return new Promise<string>((_resolve, reject) => reject(err));
    }
  );
};

const doGetIframeContent = (props: React.PropsWithChildren<ExternalLinkProps>) => async (
  authenticated: Authenticated
) => {
  const { href, linkInterceptions } = props;
  const parsedUrl = lowerCaseFileExtension(parseUrl(href));
  const { request } = authenticated;
  const foundApiToken = findApiToken(props)(authenticated);

  return await request<Blob>(foundApiToken!, {
    ...baseAxiosRequestConfig('text/html'),
    url: parsedUrl.href,
  }).then(
    (res: AxiosResponse) => {
      return res.data.text().then((html: string) => {
        const base = 'data:text/html;charset=utf-8,';

        if (linkInterceptions) {
          const newHtml = replaceLinks([props, authenticated, html] as [ExternalLinkProps, Authenticated, string]);

          return newHtml
            ? newHtml.then(([html]: htmlData) => {
                return `${base}${escape(html)}`;
              })
            : new Promise<string>((resolve) => resolve(`${base}${escape(html)}`));
        }

        return new Promise<string>((resolve) => resolve(`${base}${escape(html)}`));
      });
    },
    (err: Error) => {
      return new Promise<string>((_resolve, reject) => reject(err));
    }
  );
};

type MapParsedUrl = (it: ParsedUrl) => string[];

const hrefSplit: MapParsedUrl = (parsedUrl) => parsedUrl.href.split('?')[0].split('/');
const pathnameSplit: MapParsedUrl = (parsedUrl) => parsedUrl.pathname.split('/');
const fileExtensionSplit: MapParsedUrl = (parsedUrl) =>
  file(parsedUrl) ? file(parsedUrl)!.split('.') : [parsedUrl.pathname];
const tackOnFileExtension = (split: string[]) => (extension: string) =>
  split.slice(0, split.length - 1).reduce((accumulator: string, current: string) => `${accumulator}/${current}`) +
  `/${extension}`;

const fileExtensionToParsedUrl: ([, ,]: [string, ParsedUrl, string]) => ParsedUrl = ([, parsedUrl, extension]) => ({
  ...parsedUrl,
  pathname: tackOnFileExtension(pathnameSplit(parsedUrl))(extension),
  href: tackOnFileExtension(hrefSplit(parsedUrl))(extension),
});

const lowerCaseFileExtension = (it: ParsedUrl) => {
  const result = _(fileExtensionSplit(it))
    .map((extension: string, index: number) => [index.toString(), it, extension] as [string, ParsedUrl, string])
    .reduce(
      ([, parsedUrl1, extension1]: [string, ParsedUrl, string], [index, , extension2]: [string, ParsedUrl, string]) =>
        [index, parsedUrl1, `${extension1}.${extension2.toLowerCase()}`] as [string, ParsedUrl, string]
    );

  if (result) {
    return fileExtensionToParsedUrl(result);
  }

  return it;
};

const lowerCaseFile = (it: ParsedUrl) => {
  const pathname = () =>
    _(pathnameSplit(it))
      .map((node: string, index: number) => (index === pathnameSplit(it).length - 1 ? file(it)!.toLowerCase() : node))
      .reduce((accumulator: string, current: string) => `${accumulator}/${current}`);

  return file(it) && pathnameSplit(it)
    ? {
        ...it,
        pathname: pathname(),
        href: `${it.protocol}://${it.resource}${pathname()}`,
      }
    : undefined;
};

const file = (parsedUrl: ParsedUrl) => {
  const pathNameSplit = parsedUrl.pathname!.split('/');
  const result = pathNameSplit[pathNameSplit.length - 1];

  if (!result || !result.includes('.')) {
    return undefined;
  }

  return result;
};

const error = (message: string) => {
  console.error(message);

  return <TodoPlaceholder description={`Need to use error common component inside ExternalLink; error ${message}`} />;
};

const linksRegex = /<a\s+([\s\S])*?<\/a>/g;
const hrefRegex = /href="(.*)"/;
const literalRegex = /".*"/;

const getLinks = ([props, authenticated, html]: [ExternalLinkProps, Authenticated, string]) => {
  const links: string[] = (() => {
    let matches: string[] = [];

    for (const match of html.matchAll(linksRegex)) {
      matches = matches.concat(match[0]);
    }

    return matches;
  })();

  return [props, authenticated, html, links] as [ExternalLinkProps, Authenticated, string, string[]];
};

const whereLinksAreNotEmpty = ([props, , , links]: [ExternalLinkProps, Authenticated, string, string[]]) =>
  props.linkInterceptions !== undefined && links && links.length > 0;

const toLinkTuples = ([props, authenticated, html, links]: [ExternalLinkProps, Authenticated, string, string[]]) =>
  links.map((link) => [props, authenticated, html, link] as [ExternalLinkProps, Authenticated, string, string]);

const whereLinkHasHref = ([, , , link]: [ExternalLinkProps, Authenticated, string, string]) =>
  link.match(hrefRegex) !== null;

const addLinkHref = ([props, authenticated, html, link]: [ExternalLinkProps, Authenticated, string, string]) => [
  props,
  authenticated,
  html,
  link,
  hrefRegex.exec(link)![0].toString(),
];

const whereHrefHasLiteral = ([, , , , href]: [ExternalLinkProps, Authenticated, string, string, string]) =>
  href.match(literalRegex) !== null;

const addLiteral = ([props, authenticated, html, link, href]: [
  ExternalLinkProps,
  Authenticated,
  string,
  string,
  string
]) => [props, authenticated, html, link, href, literalRegex.exec(href)![0].toString()];

const whereIsLinkInterceptionAndLinkHasFileRegexAndMimeExists = ([props, , , link, , literal]: [
  ExternalLinkProps,
  Authenticated,
  string,
  string,
  string,
  string
]): boolean => {
  const matchesAnyLinkInterception = props.linkInterceptions!.some((it: LinkInterception) => it.b(literal));
  const hasHref = !!link.match(hrefRegex);
  const hasCustomMime = customMime.getType(parseUrl(applyHrefRegex(link)).pathname) !== null;

  return matchesAnyLinkInterception && hasHref && hasCustomMime;
};

const newLiteral = ([literal, baseRegex, base]: [string, RegExp, string]) =>
  literal.replace(baseRegex, base).replace(/"/g, '');

const toNewLinks = ([props, authenticated, html, link, , literal]: [
  ExternalLinkProps,
  Authenticated,
  string,
  string,
  string,
  string
]) => {
  const { isDataUrl, baseRegex, base } = props.linkInterceptions!.find((it: LinkInterception) => it.b(literal))!;
  const foundApiToken = findApiToken(props)(authenticated);
  const file = applyHrefRegex(link);

  if (!isDataUrl || !foundApiToken) {
    const matchedFile = props.fileList ? props.fileList.find((currentFile) => currentFile.file_name === file) : null;
    const replacementLiteral = matchedFile ? getDownloadUrl(matchedFile) : newLiteral([literal, baseRegex, base]);

    return new Promise<htmlData>((resolve) => {
      resolve([html, link, link.replace(hrefRegex, `target="_blank" href="${replacementLiteral}"`)]);
    });
  }

  const mime: null | string = customMime.getType(parseUrl(file).pathname);
  const { request } = authenticated;

  return request<Blob>(foundApiToken!, {
    ...baseAxiosRequestConfig(mime as string),
    url: newLiteral([literal, baseRegex, base]),
  }).then(
    (res: AxiosResponse) =>
      new Promise<htmlData>((resolve) => {
        let fileReader = new FileReader();

        fileReader.readAsDataURL(res.data);
        fileReader.onload = () => {
          const newLink = link.replace(hrefRegex, `download="${file}" href="${fileReader.result}"`);

          resolve([html, link, newLink]);
        };
      })
  );
};

const applyHrefRegex = (link: string) => {
  const href = hrefRegex.exec(link)![1];
  const splitHref = href.split('/');

  return splitHref[splitHref.length - 1];
};

const toNewLink = ([html, link, newLink]: htmlData): htmlData => [html.replace(link, newLink), '', ''];

const newLinks: (it: [ExternalLinkProps, Authenticated, string][]) => Promise<htmlData>[] = flow(
  map(getLinks),
  filter(whereLinksAreNotEmpty),
  map(toLinkTuples),
  flatten,
  filter(whereLinkHasHref),
  map(addLinkHref),
  filter(whereHrefHasLiteral),
  map(addLiteral),
  filter(whereIsLinkInterceptionAndLinkHasFileRegexAndMimeExists),
  map(toNewLinks)
);

const replaceLinks: (it: [ExternalLinkProps, Authenticated, string]) => Promise<htmlData> | undefined = ([
  props,
  authenticated,
  html,
]) => {
  const newHtml = newLinks([[props, authenticated, html]]);

  const linkReplacer = (links: Promise<htmlData>, current: Promise<htmlData>, index: number) =>
    links.then(([html1, link1, newLink1]) =>
      current.then(([, link2, newLink2]) =>
        index === 0 ? toNewLink([html1, link1, newLink1]) : toNewLink([html1, link2, newLink2])
      )
    );

  const initValues: Promise<htmlData> = newHtml[0]
    ? newHtml[0].then(toNewLink)
    : new Promise((resolve) => resolve([html, '', ''] as htmlData));

  return _.reduce(newHtml, linkReplacer, initValues);
};

type LinkUpdateProps = [ExternalLinkProps, Authenticated, HTMLDocument];

const toParsedDOM = ([props, authenticated, html]: [ExternalLinkProps, Authenticated, string]) => {
  const domparser = new DOMParser();
  const parsedHtml = domparser.parseFromString(html, 'text/html');

  return [props, authenticated, parsedHtml];
};

const replaceLinksFromFileList = ([props, authenticated, html]: LinkUpdateProps) => {
  const links = Array.from(html.querySelectorAll('a'));
  links.forEach((link: HTMLAnchorElement) => {
    const byebyeStr = 'byebye?';
    const hasByeBye = link.href.includes(byebyeStr);

    if (hasByeBye) {
      link.href = link.href.substr(link.href.indexOf(byebyeStr) + byebyeStr.length);
      return;
    }

    const href = link.href.split('/');
    // Get filename from HREF
    const filename = href[href.length - 1];

    // Compare filename to FileList
    const matchedFile = props.fileList!.find((file) => file.file_name === filename);

    // Replace if filename is found
    if (matchedFile) {
      const downloadUrl = getDownloadUrl(matchedFile);
      link.href = downloadUrl;

      // Provide path and type for REST call
      link.dataset.filepath = downloadUrl;
      link.dataset.filetype = matchedFile.file_type;
    }
  });

  return [props, authenticated, html];
};

const toPromise = ([, , html]: LinkUpdateProps) => new Promise((resolve) => resolve([html.documentElement.innerHTML]));

const updateHtmlLinks = flow(toParsedDOM, replaceLinksFromFileList, toPromise);
