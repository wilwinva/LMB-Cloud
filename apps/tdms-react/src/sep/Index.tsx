import React from 'react';
import { Typescript } from '@nwm/util';
import useLinks, { RoutableApp } from '../hooks/links/useLinks';
import SearchIndexComponent from '../components/search/searchIndex';
import { TransferComponent } from '../query/Transfer';

const { keyGuard } = Typescript;
const pageTitle = 'Site & Engineering Properties (SEP)';
const pageHeaderText =
  'This database is used to compile performance assessment modeling input files. The files containing graphical and\n' +
  'tabular data are used to facilitate the analytical evaluations of the site and repository system design. Input\n' +
  'files from this database are imported directly into model analyses to produce model output files that are\n' +
  'submitted to the Site & Engineering Properties.';

const getLinks = (links: RoutableApp) =>
  Object.entries(links.sep)
    .filter(keyGuard(links.sep, ['dtnModels']))
    .map(([, link]) => link.relativeLink({}))
    .map((link, idx) => <li key={idx}>{link}</li>);

export default function SepIndexComponent() {
  const links = useLinks();
  const sepLinks = getLinks(links);

  return (
    <SearchIndexComponent
      pagetTitle={pageTitle}
      pageHeaderText={pageHeaderText}
      pageCategoryLinks={sepLinks}
      transfer={TransferComponent.SEP}
    />
  );
}
