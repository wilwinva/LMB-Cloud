import React, { useContext, useEffect, useState } from 'react';
import { AuthenticatedContext, ApiToken } from '@nwm/azure-authentication';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';
import { find } from 'lodash';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { STORAGE_API_TOKEN } from '../../BaseApp';
import DirectoryTable from './DirectoryTable';
import usePromiseMachine, { promiseActions, promiseStates } from '../../hooks/usePromiseMachine';
import { FileData } from '../helpers/TdmsFilesHelper';
const parseString = require('xml2js').parseString;

const getRequestUrl = (path: string | null) =>
  `${process.env.BLOB_STORAGE_TDMS}?restype=container&comp=list&prefix=${path}`;

const contentType = 'text/plain';
const axiosRequestConfig: AxiosRequestConfig = {
  responseType: 'blob',
  headers: {
    'Content-Type': contentType as string,
    'x-ms-date': new Date().toUTCString(),
    'x-ms-version': '2019-12-12',
  },
};

interface IProperties {
  'Content-Length': string;
  'Content-MD5': string;
  'Content-Type': string;
  'Creation-Time': string;
  'Last-Modified': string;
}

interface BlobResponse {
  Name: string[];
  Properties: IProperties[];
}

interface BlobData {
  EnumerationResults: {
    Blobs: [
      | {
          Blob: BlobResponse[];
        }
      | ''
    ];
  };
}

export interface IDocument extends IProperties, FileData {
  Name: string;
}

const findToken = (targetToken: ApiToken, apiTokens: ApiToken[]) =>
  find(apiTokens, (token) => token.host === targetToken.host);

const flattenBlobData = (blobsArray: BlobResponse[]) =>
  blobsArray.map((theBlob: BlobResponse) => {
    const name = theBlob.Name[0];
    const properties = getProperties(theBlob.Properties[0]);

    return {
      ...properties,
      Name: name,
    };
  });

const getProperties = (property: IProperties) => ({
  'Content-Length': property['Content-Length'][0] ?? '',
  'Content-MD5': property['Content-MD5'][0] ?? '',
  'Content-Type': property['Content-Type'][0] ?? '',
  'Creation-Time': property['Creation-Time'][0] ?? '',
  'Last-Modified': property['Last-Modified'][0] ?? '',
});

function getQueryVariable(variable: string) {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] === variable) {
      return pair[1];
    }
  }

  return null;
}

const removeLeadingSlash = (str: string) => (str[0] === '/' ? str.substr(1) : str);

export default function DirectoryView() {
  // Init state and get auth token
  const [files, setFiles] = useState<IDocument[]>([]);
  const { transition, promiseState } = usePromiseMachine();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { request, apiTokens } = useContext(AuthenticatedContext);

  // Get directory path
  const blobPath = getQueryVariable('path') || '';
  const requestUrl = getRequestUrl(removeLeadingSlash(blobPath));

  // Read directory files
  const foundApiToken = findToken(STORAGE_API_TOKEN, apiTokens);

  useEffect(() => {
    if (foundApiToken) {
      request(foundApiToken, {
        ...axiosRequestConfig,
        url: requestUrl,
      }).then(
        ({ data }: AxiosResponse) => {
          data.text().then((blobXml: string) => {
            const unescapedBlobXml = unescape(blobXml);

            parseString(unescapedBlobXml, function (err: string, result: BlobData) {
              const results = result.EnumerationResults.Blobs[0];

              if (results === '') {
                transition(promiseActions.RESOLVE_EMPTY);
              } else {
                const files = flattenBlobData(results.Blob) as IDocument[];

                setFiles(files);
                transition(promiseActions.RESOLVE);
              }
            });
          });
        },
        (err: string) => {
          setErrorMessage(err);
          transition(promiseActions.REJECT);
        }
      );
    }
  }, []);

  // Display file list
  if (promiseState === promiseStates.pending) {
    return <Spinner size={SpinnerSize.small} />;
  }

  if (promiseState === promiseStates.rejected) {
    return <p>Failed to load directory: {errorMessage}</p>;
  }

  if (promiseState === promiseStates.resolved) {
    return <DirectoryTable fileList={files} blobPath={`${blobPath}`} />;
  }

  if (promiseState === promiseStates.empty) {
    return <p>No results were found</p>;
  }

  return null;
}
