import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ExternalLink, LinkInterception, Method } from '../link';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';
import { ApiToken, AuthenticatedContext } from '@nwm/azure-authentication';

const parseString = require('xml2js').parseString;

export interface ReportFileListProps {
  storageArea: string;
  directory: string;
  apiToken: ApiToken;
  linkInterceptions: LinkInterception[] | undefined;
}

interface IProperties {
  'Content-Length': string;
  'Content-MD5': string;
  'Content-Type': string;
  'Creation-Time': string;
  'Last-Modified': string;
}

interface IBlobData {
  Name: string;
  Properties: IProperties;
}

export function DirectoryListing(props: React.PropsWithChildren<ReportFileListProps>): ReactElement {
  const { storageArea, directory, apiToken, linkInterceptions } = props;
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const { request, apiTokens } = useContext(AuthenticatedContext);
  const [isDownloadInProgress, setIsDownloadInProgress] = useState(false);
  const [tableFiles, setTableFiles] = useState<ReactElement[] | ReactElement | undefined>(undefined);

  //  const requestUrl = `https://nwm-dev.azure-api.net/nwmtdmsstorage/tdms/?restype=container&comp=list&prefix=${transfer}/ancillary/${table_name}`;
  const baseUrl = `https://nwm-dev.azure-api.net/${storageArea}/`;
  const requestUrl = `${baseUrl}?restype=container&comp=list&prefix=${directory}`;

  const foundApiToken = apiTokens.find((a: ApiToken) => a.host === apiToken.host);

  useEffect(() => {
    if (foundApiToken) {
      const contentType = 'text/plain';
      const axiosRequestConfig: AxiosRequestConfig = {
        responseType: 'blob',
        headers: {
          'Content-Type': contentType as string,
          'x-ms-date': new Date().toUTCString(),
          'x-ms-version': '2019-12-12',
        },
      };
      setIsDownloadInProgress(true);
      request(foundApiToken, {
        ...axiosRequestConfig,
        url: requestUrl,
      }).then(
        (res: AxiosResponse) => {
          const response = res.data.text().then((r: string) => {
            const data = unescape(r);
            //TODO: remove any type
            parseString(data, function (err: string, result: any) {
              if (result.EnumerationResults.Blobs[0] === '') {
                setErrorMessage(`No files found`);
              } else {
                const blobArray: IBlobData[] = buildResultList(result.EnumerationResults.Blobs[0].Blob);
                const tableFileList = makeTableFiles(blobArray, baseUrl, apiToken, linkInterceptions);
                setIsDownloadInProgress(false);
                setTableFiles(tableFileList);
              }
            });
          });

          setIsDownloadInProgress(false);

          return response;
        },
        (err: Error) => {
          setErrorMessage(`Critical error: cannot find files ${err}`);
          setIsDownloadInProgress(false);
        }
      );
    }
  }, []);

  if (errorMessage) {
    return error(errorMessage);
  } else if (!apiTokens.some((a: ApiToken) => a.host === apiToken.host)) {
    return error(`When trying to invoke an ExternalLink, no suitable Api token found`);
  } else if (isDownloadInProgress) {
    return <Spinner size={SpinnerSize.small} />;
  }
  return <>{tableFiles}</>;
}

//TODO: remove any type
const buildResultList = (blobsArray: Blob[]) =>
  blobsArray.map((theBlob: any) => {
    theBlob.Name = theBlob.Name[0];
    theBlob.Properties = getProperties(theBlob.Properties[0]);

    return theBlob;
  });

//TODO: remove any type
const getProperties = (property: any) => {
  const properties: IProperties = {
    'Content-Length': property['Content-Length'].shift(),
    'Content-MD5': property['Content-MD5'].shift(),
    'Content-Type': property['Content-Type'].shift(),
    'Creation-Time': property['Creation-Time'].shift(),
    'Last-Modified': property['Last-Modified'].shift(),
  };
  return properties;
};
const makeTableFiles = <T extends Function>(
  blobData: IBlobData[],
  baseUrl: string,
  apiToken: ApiToken,
  linkInterceptions: LinkInterception[] | undefined
) =>
  blobData.map((theBlob: IBlobData, idx) => {
    const fileName = theBlob.Name;
    const buildDownloadUrl = (file_name: string) => `${baseUrl}${file_name}`;
    const displayName = fileName.split('/').pop();

    return (
      <ExternalLink
        key={idx}
        href={buildDownloadUrl(fileName)}
        method={Method.DOWNLOAD_FILE}
        apiToken={apiToken}
        linkInterceptions={linkInterceptions}
      >
        {displayName}
      </ExternalLink>
    );
  });

const error = (message: string) => {
  console.error(message);
  return <>{message}</>;
};
