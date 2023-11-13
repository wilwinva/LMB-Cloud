/**
 * Use to filter data_set by "transfer component";
 * tdms_db_data_set.ds_key (object rel.) <---> (array rel.) tdms_db_transfer.tdif_no
 *
 * */

export enum TransferComponent {
  CST = 'CST',
  GIS = 'GIS',
  MWD = 'MWD',
  RDI = 'RDI',
  RPC = 'RPC',
  SCC = 'SCC',
  SEP = 'SEP',
  SPA = 'SPA',
  TIC = 'TIC',
  WFC = 'WFC',
  INPROCESS = 'INPROCESS',
}

/**
 * Returns the corresponding TransferComponent enum or undefined if there is no match.
 * @param s the string to change into an enum
 */
export function toTransferComponent(s?: string): TransferComponent | undefined {
  return s ? (TransferComponent as any)[s.toUpperCase()] : undefined;
}
