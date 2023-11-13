import React, { ReactElement } from 'react';
import { flow, sortBy } from 'lodash/fp';
import { map, partialRight } from 'lodash';

import { FileData, FileDownloadLink } from '../components/helpers/TdmsFilesHelper';

export interface ReportFileListProps {
  files?: FileData[];
}

const sortByTitle = sortBy('file_name');
const mapAsDownloadLinks = partialRight(map, (file: FileData, _idx: number) => (
  <FileDownloadLink key={_idx} file={file} />
));
const buildDownloadLinks = flow(sortByTitle, mapAsDownloadLinks);

export function ReportFileList(props: React.PropsWithChildren<ReportFileListProps>): ReactElement {
  const { files } = props;
  return <>{buildDownloadLinks(files)}</>;
}
