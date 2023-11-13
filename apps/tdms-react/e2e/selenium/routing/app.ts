import { By, WebDriver } from 'selenium-webdriver';
import { untilValue } from '../util/until';
import { DataResults, dataResultSelectors, keywordSelector, parameterSelector } from '../data-results';

export type App = 'mwd' | 'spa';
export const router = (driver: WebDriver, app: App) => {
  const headerRouter = _headerRouter(driver, app);
  return {
    categories: _categoriesRouter(driver, app, headerRouter),
    header: headerRouter,
    search: _searchRouter(driver, app),
    dataResults: _dataResultsRouter(driver, app, headerRouter),
  };
};

const _categoriesLinks = (driver: WebDriver, app: string) => {
  const linkHrefContains = (href: string) => {
    //note: filtering on li[idx] in xpath directly to find a single link doesn't work since href contains is applied after
    return By.xpath(`//span[contains(text(),"Categories")]/following-sibling::ul/li/a[contains(@href, "${href}")]`);
  };

  const hrefLinks = (href: string) => {
    const _links = async () => driver.findElements(linkHrefContains(href));
    return {
      links: _links,
      toLink: async (idx: number) => {
        const links = await _links();
        return links[idx].click();
      },
    };
  };

  return {
    appLinks: hrefLinks(app),
    atdtLinks: hrefLinks('atdt'),
  };
};

const _categoriesRouter = (driver: WebDriver, app: App, headerRouter: HeaderRouter) => {
  const categoriesLinks = _categoriesLinks(driver, app);
  const dataResults = DataResults(driver, app);

  const traverseAppCategories = async () => {
    const links = await categoriesLinks.appLinks.links();
    expect(links.length > 0).toBeTruthy();
    //done synchronously; could do parallel async map instead but would to give each child its own driver
    for (let idx = 0; idx < links.length; idx++) {
      //fetch element again so that nth link is not stale
      await categoriesLinks.appLinks.toLink(idx);

      await dataResultSelectors[app].headers.map(async (header) => dataResults.hasData({ headerTitle: header }));
      await headerRouter.toAppIndex();
    }
  };

  return {
    toAtdt: async () => categoriesLinks.atdtLinks.toLink(0), //todo -- validate loaded page
    traverseAppCategories,
  };
};

type HeaderRouter = ReturnType<typeof _headerRouter>;
const _headerRouter = (driver: WebDriver, app: string) => {
  return {
    toAppIndex: async () => driver.findElement(By.xpath(`//header/descendant::a[@href = "/${app}"]`)).click(),
  };
};

const _searchRouter = (driver: WebDriver, app: App) => {
  const dataResults = DataResults(driver, app);
  const toKeywordResults = async (_keyword?: string) => {
    const selector = _keyword ? keywordSelector(_keyword) : dataResultSelectors[app].keyword;
    await _submitKeyword(selector.input);
    await dataResults.hasData(selector.column);
  };

  const toKeywordNoResults = async (_keyword?: string) => {
    const selector = _keyword ? keywordSelector(_keyword) : dataResultSelectors[dataResults.notThisApp(app)].keyword;
    await _submitKeyword(selector.input);
    await dataResults.notHaveData(selector.column);
  };

  const _submitKeyword = async (keyword: string) => {
    const keywordInput = await driver.findElement(
      By.xpath('//div[child::span[contains(text(), "Keyword")]]/following-sibling::div/descendant::input')
    );
    await keywordInput.sendKeys(keyword);
    await driver.wait(untilValue(keywordInput, keyword));

    await driver
      .findElement(
        By.xpath('//div[child::span[contains(text(), "Keyword")]]/following-sibling::div/descendant::button')
      )
      .click();
  };

  const toParameterResults = async (_parameter?: string) => {
    const selector = _parameter ? parameterSelector(_parameter) : dataResultSelectors[app].parameter;
    await _submitParameter(selector.input);
    await dataResults.hasData(selector.column);
  };

  const toParameterNoResults = async (_parameter?: string) => {
    const selector = _parameter
      ? parameterSelector(_parameter)
      : dataResultSelectors[dataResults.notThisApp(app)].parameter;
    await _submitParameter(selector.input);
    await dataResults.notHaveData(selector.column);
  };

  const _submitParameter = async (parameter: string) => {
    const parameterInput = await driver.findElement(
      By.xpath('//div[child::span[contains(text(), "Parameter")]]/following-sibling::div/descendant::input')
    );
    await parameterInput.sendKeys(parameter);
    await driver.wait(untilValue(parameterInput, parameter));

    await driver
      .findElement(
        By.xpath('//div[child::span[contains(text(), "Parameter")]]/following-sibling::div[2]/descendant::button')
      )
      .click();
  };

  return { toKeywordResults, toKeywordNoResults, toParameterResults, toParameterNoResults };
};

const _dataResultsRouter = async (driver: WebDriver, app: App, headerRouter: HeaderRouter) => {
  return { toAppIndex: headerRouter.toAppIndex };
};
