import React from 'react';
import { Typescript } from '@nwm/util';
import useLinks, { RoutableApp } from '../hooks/links/useLinks';
import SearchIndexComponent from '../components/search/searchIndex';
import { TransferComponent } from '../query/Transfer';
const { keyGuard } = Typescript;

const pageTitle = 'Model Warehouse Data (MWD)';
const pageHeaderText =
  'The Model Warehouse is an on-line repository of currently available project numerical models, comprised of process/intermediate level Analytical Tools, Inputs, Constraints, and Numerical and Graphical results of the various site and evaluation models. For access to the models, click on one of the links below, or perform one of the searches.';

const getLinks = (links: RoutableApp) =>
  Object.entries(links.mwd)
    .filter(keyGuard(links.mwd, ['biosphere', 'disruptive', 'dtnModels']))
    .map(([, link]) => link.relativeLink({}))
    .map((link, idx) => <li key={idx}>{link}</li>);

export default function MwdIndexComponent() {
  const links = useLinks();
  const mwdLinks = getLinks(links);

  return (
    <SearchIndexComponent
      pagetTitle={pageTitle}
      pageHeaderText={pageHeaderText}
      pageCategoryLinks={mwdLinks}
      transfer={TransferComponent.MWD}
    />
  );
}
