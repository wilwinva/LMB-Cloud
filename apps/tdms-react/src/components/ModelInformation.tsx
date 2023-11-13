import React, { useContext, useRef } from 'react';
import { ExternalLink, Method } from '@nwm/uifabric';
import { Text } from 'office-ui-fabric-react';
import { replace, toLower, pipe, forEach, filter, map, last } from 'lodash/fp';
import { useNavigate } from 'react-router-dom';
import download from 'downloadjs';
import { AuthenticatedContext, ApiToken } from '@nwm/azure-authentication';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { FileData } from './helpers/TdmsFilesHelper';
import { STORAGE_API_TOKEN, LINK_INTERCEPTIONS } from '../BaseApp';

export interface ModelInformationProps {
  transfer: string;
  dtn: string;
  transferPath: string;
  fileList: FileData[];
}

const convertDotToUnderscore = replace('.', '_');
const appendHtml = (str: string) => `${str}.html`;
const buildFilePath = pipe(convertDotToUnderscore, toLower, appendHtml);

const buildModelInformationUrl = (transfer: string, dtn: string) =>
  `${process.env.BLOB_STORAGE_TDMS}/${transfer}/data/${buildFilePath(dtn)}`;

export default function ModelInformation({ transfer, dtn, transferPath, fileList }: ModelInformationProps) {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  const { request, apiTokens } = useContext(AuthenticatedContext);
  const foundApiToken = apiTokens.find((a: ApiToken) => a.host === STORAGE_API_TOKEN.host);

  if (!foundApiToken) {
    return <Text>API token not found.</Text>;
  }

  const downloadFile = (filepath: string, filetype: string) => {
    const axiosRequestConfig: AxiosRequestConfig = {
      responseType: 'blob',
      headers: {
        'Content-Type': filetype,
        'x-ms-date': new Date().toUTCString(),
        'x-ms-version': '2019-12-12',
      },
    };

    request(foundApiToken!, {
      ...axiosRequestConfig,
      method: 'get',
      url: filepath,
    })
      .then((response: AxiosResponse) => {
        const content = response.headers['content-type'];
        const filename = last(filepath.split('/'));
        download(response.data, filename, content);
      })
      .catch((error: Error) => console.log(error));
  };

  const bindDownloadButton = () => {
    const componentElement = contentRef.current;
    const formElement = componentElement!.querySelector('form') as HTMLFormElement;

    if (formElement) {
      formElement.onsubmit = (e: Event) => {
        e.preventDefault();

        // Using the DOM to parse this link
        let parser = document.createElement('a');
        parser.href = (e.currentTarget as HTMLFormElement).action;

        const directoryPath = parser.pathname;

        navigate(`${transferPath}?path=/legacy${directoryPath}`);
      };
    }
  };

  const bindDirectoryLinks = () => {
    const componentElement = contentRef.current;
    const links = Array.from(componentElement!.querySelectorAll('tr'));

    const filterNonDirectories = filter((link: HTMLTableRowElement) => {
      const fileSize = link.querySelector('td:first-child') as HTMLTableCellElement;
      return fileSize.innerText ? fileSize.innerText.toLowerCase().includes('directory') : false;
    });

    const getAnchorTags = map((link: HTMLTableCellElement) => {
      return link.querySelector('td:nth-child(2) a');
    });

    const bindClickHandlers = forEach((link: HTMLAnchorElement) => {
      link.onclick = (ev: MouseEvent) => {
        ev.preventDefault();

        const directoryPath = (ev.currentTarget as HTMLAnchorElement).pathname.slice(1);

        navigate(`${transferPath}?path=${directoryPath}`);
      };
    });

    pipe(filterNonDirectories, getAnchorTags, bindClickHandlers)(links);
  };

  const bindFileDownloadLinks = () => {
    const componentElement = contentRef.current;
    const links = Array.from(componentElement!.querySelectorAll('a[data-filepath]'));

    const bindClickHandlers = forEach((link: HTMLAnchorElement) => {
      link.onclick = (ev: MouseEvent) => {
        ev.preventDefault();

        const filePath = (ev.currentTarget as HTMLAnchorElement).dataset.filepath!;
        const fileType = (ev.currentTarget as HTMLAnchorElement).dataset.filetype!;

        downloadFile(filePath, fileType);
      };
    });

    pipe(bindClickHandlers)(links);
  };

  const bindLinksAndDownload = () => {
    bindDirectoryLinks();
    bindDownloadButton();
    bindFileDownloadLinks();
  };

  return (
    <ExternalLink
      href={buildModelInformationUrl(transfer, dtn)}
      method={Method.DISPLAY_RAW_HTML}
      apiToken={STORAGE_API_TOKEN}
      linkInterceptions={LINK_INTERCEPTIONS}
      onResolve={bindLinksAndDownload}
      ref={contentRef}
      fileList={fileList}
    />
  );
}
