import { By, WebDriver, until } from 'selenium-webdriver';
import { App } from './routing/app';
import fp from 'lodash/fp';

interface DataSelector {
  headerTitle: string;
  cellValue?: string;
}
type SearchTypes = 'keyword' | 'parameter';
type AppDataSelectors = {
  [app in App]: {
    [type in SearchTypes]: {
      input: string;
      column: DataSelector;
    };
  } & { headers: string[] };
};

function selector(headerTitle: string, cellValue: string) {
  return {
    input: cellValue,
    column: {
      headerTitle: headerTitle,
      cellValue: cellValue,
    },
  };
}
export const keywordSelector = fp.curry(selector)('Data Set Title');
export const parameterSelector = fp.curry(selector)('Parameter Name');
const tableHeaders = ['DTN', 'Data File', 'Data Set Title', 'Parameter Name'];
/**
 * Note: Ideally these should be created instead of using hardcoded values to make the validation less brittle.
 *  Since create / update capabilities are not implemented yet this is currently using existing data.
 */
export const dataResultSelectors: AppDataSelectors = {
  mwd: {
    headers: tableHeaders,
    keyword: keywordSelector('GENII-S INPUT PARAMETERS FOR PRECLOSURE AND POSTCLOSURE DOSE CALCULATIONS.'),
    parameter: parameterSelector('BOUNDRY HEAD'),
  },
  spa: {
    headers: tableHeaders,
    keyword: keywordSelector('CUTTINGS SAMPLE LOG FOR BOREHOLE NC-EWDP-5SB'),
    parameter: parameterSelector('BIOSPHERE DOSE CONVERSION FACTOR ABSTRACTION'),
  },
};

export const DataResults = (driver: WebDriver, app: App) => {
  const hasData = async ({ headerTitle, cellValue }: DataSelector) => {
    await driver.findElement(
      By.xpath(`//div[@id = "nwm-uifabric-list-headerrow"]/descendant::span[contains(text(), "${headerTitle}")]`)
    );

    const containsCellValue = cellValue ? `[contains(text(), "${cellValue}")]` : '';
    await driver.findElement(
      By.xpath(`//div[contains(@id, "nwm-uifabric-list-itemrow")]/descendant::a${containsCellValue}`)
    );
  };

  //todo -- probably be faster to check for no results elements on case by case basis instead of waiting for findElement to timeout
  const notHaveData = async (col: DataSelector) => {
    await expect(hasData(col)).rejects.toThrow(/Timed out|no such element/);
  };

  const notThisApp = (_app: App = app) =>
    fp.find((selector: App) => selector !== _app)(Object.keys(dataResultSelectors)) as App;

  return { hasData, notHaveData, notThisApp };
};
