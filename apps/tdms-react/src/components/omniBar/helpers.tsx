import React from 'react';
import { capitalize, compact, flatMap, isNil, isString, map, size, trim } from 'lodash';
import { Link } from 'react-router-dom';
import { ITextStyles } from 'office-ui-fabric-react';
import { StandardTableFragment } from './results/__generated__/StandardTableFragment';
import { toTransferComponent } from '../../query/Transfer';
import { formatDate, invalidDate } from '../helpers/FormatDateTime';

export const INTEGER_CEILING = 2147483647;

export const extractFirstValidInteger: (_a: string | undefined) => number | undefined = (str) => {
  if (str) {
    /** Match first number surrounded by whitespace, or whitespace and at the start/end of the string. */
    const result = /(?:^|\s)\d+(?:\s|$)/.exec(str);
    if (result && result.length > 0) {
      return intSearch(result[0]);
    }
  }
  return undefined;
};

export const buildName = (pi_last_nm?: string | null, pi_first_nm?: string | null, pi_middle_nm?: string | null) => {
  const lastNm = pi_last_nm ? capitalize(trim(pi_last_nm)) : '';
  const firstNm = pi_first_nm ? capitalize(trim(pi_first_nm)) : '';
  const middleNm = pi_middle_nm ? capitalize(trim(pi_middle_nm)) : '';
  return `${lastNm}, ${firstNm} ${middleNm}`;
};

export const makeKeyFromString = (key: string) => {
  return key.replace(/[/:\s]/g, '');
};

export const compactArrayToString = (theArray: any[]) => {
  return compact(theArray).toString().trim(); //Creates an array with all falsey values removed. The values false, null, 0, "", undefined, and NaN are falsey.
};

export const intSearch: (_a: string | undefined) => number | undefined = (searchString: string | undefined) => {
  if (searchString) {
    const parsed = parseInt(searchString, 10);
    return isNaN(parsed) || parsed > INTEGER_CEILING ? undefined : parsed;
  }
  return undefined;
};

export function addSpace(item: string) {
  return isNil(item) ? item : ` ${item}`;
}

export const array2String = (items: any[], field: string | undefined): string => {
  const itemsSize = size(items);
  if (itemsSize === 0) {
    return items.toString();
  }
  if (isString(items[0])) {
    return map(items, addSpace).toString();
  } else {
    return compactArrayToString(map(map(items, field), addSpace));
  }
};

export const buildDtnLinksFromArray = <T extends Function>(items: any[], field: string, tdifDataSetLinkProps: T) => {
  const itemsSize = size(items);
  if (itemsSize === 0) {
    return items;
  }
  const buildLink = (item: any, index: number) => {
    const dtnLink = buildDtnLink(tdifDataSetLinkProps, item);
    return itemsSize === index + 1 ? <span key={index}>{dtnLink}</span> : <span key={index}>{dtnLink}, </span>; //adds a comma and a space to aid in stacking multiplesin a limited column width
  };
  return map(map(items, field), buildLink);
};

export const crushPeriodArray = (items: any[], seperator: string = '/'): string => {
  const dates = flatMap(items, function (value) {
    if (invalidDate(value.start_dt) || invalidDate(value.stop_dt)) {
      return undefined;
    } else {
      return ` ${formatDate(value.start_dt)} ${seperator} ${formatDate(value.stop_dt)}`;
    }
  });
  return compactArrayToString(dates);
};

export const crushLatLongArray = (items: any[]): string[] => {
  const itemsSize = size(items);
  if (itemsSize === 0) {
    return [];
  }
  return items.map((value) => {
    const { x1_coord, x2_coord, y1_coord, y2_coord, z1_coord, z2_coord } = value;

    return [
      ['X1 Coord', x1_coord],
      ['X2 Coord', x2_coord],
      ['Y1 Coord', y1_coord],
      ['Y2 Coord', y2_coord],
      ['Z1 Coord', z1_coord],
      ['Z2 Coord', z2_coord],
    ]
      .map(([label, val]) => [label, val.trim()])
      .filter(([_, _val]) => _val)
      .reduce((prev, cur) => (prev && cur ? `${prev}, ${cur[0]}: ${cur[1]}` : `${cur[0]}: ${cur[1]}`), '');
  });
};

export const getParameterNames = (items: any[]): string => {
  const itemsSize = size(items);
  if (itemsSize === 0) {
    return items.toString();
  }
  const parameterNames = flatMap(items, function (item) {
    if (item.parameter.name) {
      return item.parameter.name;
    }
  });
  return compactArrayToString(parameterNames);
};

export const getHeaderRowTooltip = (rowType: string) => {
  switch (rowType) {
    case 'DTN':
      return 'click the DTN below to show the technical data information form (TDIF) for this data set';
    case 'Data File':
      return 'click the Data File below to download the data file associated with this data set';
    case 'Data Set Title':
      return 'click the Title below to show the Data Set page for this data set';
    case 'TDIF No':
      return 'click the TDIF Number below to show the Data Set Metadata page for this data set';
    default:
      return '';
  }
};

export const buildTdifNoLink = <T extends Function>(
  theLinkProps: T,
  tdif_no: number | undefined | null,
  ds?: string | undefined | null
) => {
  if (tdif_no && ds) {
    const { linkText, ...linkProps } = theLinkProps({ tdifId: ds });
    const linkTitle = 'click to show the Data Set Metadata page for this data set';
    return (
      <Link title={linkTitle} {...linkProps}>
        {tdif_no}
      </Link>
    );
  }

  return undefined;
};

export const buildDataSetUrl = <T extends Function>(datasetLinks: T, ds?: string | null) => {
  return datasetLinks && ds ? datasetLinks({ tdifId: ds }).to : undefined;
};

export const buildDtnLink = <T extends Function>(tdifLinkProps: T, dtn?: string | null) => {
  const linkTitle = 'click to show the technical data information form (TDIF) for this data set';
  if (dtn) {
    const { linkText, ...linkProps } = tdifLinkProps({ tdifId: dtn });
    return (
      <Link title={linkTitle} {...linkProps}>
        {dtn}
      </Link>
    );
  }
  return undefined;
};

export const buildDataSetTitleLink = <T extends Function>(
  tdifDataSetLinkProps: T,
  ds?: string | null,
  title?: string | null
) => {
  if (ds && title) {
    const linkTitle = 'click to show the Data Set page for this data set';
    const { linkText, ...linkProps } = tdifDataSetLinkProps({ tdifId: ds });
    return (
      <Link title={linkTitle} {...linkProps}>
        {title}
      </Link>
    );
  }
  return undefined;
};

export const getDataSetLinkProps = (data: StandardTableFragment, links: any) => {
  const app = toTransferComponent(data.transfer?.component)?.toLowerCase();
  return app ? links[app]?.dtnModel.globalTextLinkProps : undefined;
};

export const getQualificationStatus = (data_qual_flg: String | null | undefined) => {
  switch (data_qual_flg) {
    case 'Y':
      return 'Qualified';
    case 'N':
      return 'Unqualified';
    case 'A':
      return 'Accepted';
    case 'T':
      return 'Technical Product Output';
    default:
      return 'No Qualification Status Available';
  }
};

export const getQCedFlag = (qced_flg: String | null | undefined) => {
  return qced_flg === 'Y' ? "QC'ed" : "Not Currently QC'ed";
};

export const getPrelimData = (prelim_data: String | null | undefined) => {
  return prelim_data === 'X' ? 'YES' : 'NO';
};

export const getQualFlagString = (dataType: String | null | undefined) => {
  switch (dataType) {
    case 'Y':
      return 'Qualified';
    case 'N':
      return 'Unqualified';
    case 'I':
      return 'Technical Information';
    default:
      return '';
  }
};

export const noFileStyle: ITextStyles = {
  root: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
};

export const buildVariables = (searchString: string | null | undefined, fragment: string) => {
  return {
    leftSearch: `${searchString}%` || '',
    midSearch: `%${searchString}%` || '',
    intSearch: searchString ? extractFirstValidInteger(searchString) ?? -1 : -1,
    standard: fragment === 'Standard',
    categories: fragment === 'Categories',
    parameters: fragment === 'Parameters/Dates/Keywords',
    status: fragment === 'Data Set Status',
    submittalText: fragment === 'Submittal Text',
    submittalId: fragment === 'Submittal ID',
    acqDev: fragment === 'Acq / Dev',
    sources: fragment === 'Sources',
    roadmap: fragment === 'Records Roadmap',
    admin: fragment === 'Administrative',
  };
};
