import { TransferComponent } from '../../../query/Transfer';

export function getDatasetLinks(links: any, transferType?: TransferComponent) {
  switch (transferType) {
    case 'MWD':
      return links.mwd.dtnModel.globalTextLinkProps;
    case 'SPA':
      return links.spa.dtnModel.globalTextLinkProps;
    case 'SEP':
      return links.sep.dtnModel.globalTextLinkProps;
    case 'GIS':
      return links.gi.dtnModel.globalTextLinkProps;
    default:
      return;
  }
}
