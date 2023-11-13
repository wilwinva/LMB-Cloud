import React from 'react';
import useLinks from '../hooks/links/useLinks';
import ModelInformation, { ModelInformationProps } from '../components/ModelInformation';

export default function SpaModelInformation({ transfer, dtn, fileList }: Omit<ModelInformationProps, 'transferPath'>) {
  const links = useLinks();
  const spaDirectoryLink = links.spa.directory;
  const spaDirectoryPath = spaDirectoryLink.globalTextLinkProps({}).to as string;

  return <ModelInformation transfer={transfer} dtn={dtn} transferPath={spaDirectoryPath} fileList={fileList} />;
}
