import React from 'react';
import useLinks from '../hooks/links/useLinks';
import ModelInformation, { ModelInformationProps } from '../components/ModelInformation';

export default function MwdModelInformation({ transfer, dtn, fileList }: Omit<ModelInformationProps, 'transferPath'>) {
  const links = useLinks();
  const mwdDirectoryLink = links.mwd.directory;
  const mwdDirectoryPath = mwdDirectoryLink.globalTextLinkProps({}).to as string;

  return <ModelInformation transfer={transfer} dtn={dtn} transferPath={mwdDirectoryPath} fileList={fileList} />;
}
