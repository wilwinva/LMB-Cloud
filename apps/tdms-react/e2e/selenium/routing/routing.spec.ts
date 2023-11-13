import { ThenableWebDriver } from 'selenium-webdriver';
import env from '../env';
import { getHeadlessChromeDriver } from '../selenium-driver';
import { basicLogin } from '../auth/microsoft/login';
import * as Root from './root';
import { App } from './app';

const { url } = env.server;

//todo -- need to update to work with the new index page (nav + omnisearch) for tdms
describe('should route to app pages and route to app search results pages', () => {
  let driver: ThenableWebDriver;

  beforeEach(async () => {
    console.log('setting up driver');
    driver = getHeadlessChromeDriver();
    await driver.manage().setTimeouts({ implicit: 10000 });
    await driver.get(url);
    await driver.manage().deleteAllCookies();
    return await basicLogin(driver);
  }, 60000);

  test.each<App>(['mwd', 'spa'])(
    '%s: Should route to index and traverse category pages',
    async (app) => {
      const appIndex = await Root.router(driver).toApp(app);
      await appIndex.categories.traverseAppCategories();
      await appIndex.categories.toAtdt();
    },
    60000
  );

  test.each<App>(['mwd', 'spa'])(
    '%s: Should route to keyword results and validate data exists',
    async (app) => {
      const appIndex = await Root.router(driver).toApp(app);
      await appIndex.search.toKeywordResults();
      await appIndex.header.toAppIndex();

      await appIndex.search.toKeywordNoResults();
      await appIndex.header.toAppIndex();
    },
    60000
  );

  test.each<App>(['mwd', 'spa'])(
    '%s: Should route to parameter results and validate data exists',
    async (app) => {
      const appIndex = await Root.router(driver).toApp(app);
      await appIndex.search.toParameterResults();
      await appIndex.header.toAppIndex();

      await appIndex.search.toParameterNoResults();
      await appIndex.header.toAppIndex();
    },
    60000
  );

  afterEach(async () => {
    console.log('shutting down driver');
    return driver.quit();
  });
});
