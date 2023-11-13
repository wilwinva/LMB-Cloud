import React from 'react';
import gql from 'graphql-tag';
import { curry, filter, find, flow, map } from 'lodash/fp';
import { ExternalLink, Method } from '@nwm/uifabric';
import { Stack, Text } from 'office-ui-fabric-react';

import { STORAGE_API_TOKEN } from '../../BaseApp';
import { useNavigate } from 'react-router';

export type FileType = 'DIRECTORY' | 'FILE';

export const TDMS_FILES_FRAGMENT = gql`
  fragment TdmsFilesFragment on db_tdms_data_set {
    data_set_tdms_files {
      data_set {
        id
        transfer {
          id
          component
        }
      }
      id
      key
      dtn
      data_name
      file_name
      file_path
      file_type
      sub_cat
      lock_flag
    }
  }
`;

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

const listUrlParams = (prefix: string) => `?restype=container&comp=list&prefix=${prefix}`;
export const getDownloadUrl = (fileData: FileData) => {
  if (fileData.file_type.toUpperCase() === 'DIRECTORY') {
    const blobPath = fileData.file_path.replace('/legacy/', '');
    const transfer = fileData.data_set.transfer.component.toLowerCase();

    return `/${transfer}/directory?path=${blobPath}`;
  }

  return `${process.env.BLOB_STORAGE_TDMS}${fileData.file_path}${fileData.file_name}`;
};

export const getMainItem = filter((fileData: FileData) => fileData.sub_cat === 'MAIN');
export const getAllTableItems = filter((fileData: FileData) => {
  const transfer = fileData.data_set.transfer.component.toLowerCase();

  if (transfer === 'SPA' || transfer === 'MWD') {
    return fileData.sub_cat === 'HTML';
  }

  return fileData.sub_cat != null;
});
export const getSpaMwdTableItems = filter((fileData: FileData) => fileData.sub_cat === 'HTML');
export const findTableItems = curry((query: string, files: FileData): FileData[] =>
  filter((fileData: FileData) => fileData.data_name === query)(files)
);

const getFileName = ({ file_type, file_path, file_name, dtn }: FileData) => {
  if (file_type === 'DIRECTORY') {
    return file_path;
  }

  return file_name;
};

export const FileDownloadLink = ({ file }: { file: FileData }) => {
  const navigate = useNavigate();

  if (file.file_type.toUpperCase() === 'DIRECTORY') {
    const goToDirectory = (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();

      const directoryPath = getDownloadUrl(file);
      navigate(directoryPath);
    };

    return (
      <a href="#" onClick={goToDirectory}>
        {getFileName(file)}
      </a>
    );
  }

  return (
    <ExternalLink href={getDownloadUrl(file)} method={Method.DOWNLOAD_FILE} apiToken={STORAGE_API_TOKEN}>
      {getFileName(file)}
    </ExternalLink>
  );
};

const unusedSubCats = ['MISC', 'THUMB'];
export const omitUnusedSubcats = filter(
  (fileData: FileData) => !!fileData.sub_cat && !unusedSubCats.includes(fileData.sub_cat.toUpperCase())
);

const FileLinkStack = (file: FileData) => (
  <Stack key={file.key}>
    <FileDownloadLink file={file} />
  </Stack>
);

const buildLinkStack = (files: FileData[]) => {
  if (files.length > 0) {
    return map(FileLinkStack)(files);
  }

  return (
    <Stack>
      <Text>No original native file. See table files.</Text>
    </Stack>
  );
};

export const buildDownloadLinkList = flow(omitUnusedSubcats, buildLinkStack);

const filterNonHtml = filter((fileData: FileData) => fileData.file_type === 'HTML');
export const buildMwdSpaDownloadLinkList = flow(filterNonHtml, map(FileLinkStack));
