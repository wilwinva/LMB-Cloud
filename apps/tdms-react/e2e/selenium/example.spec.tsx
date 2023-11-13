import { By, ThenableWebDriver } from 'selenium-webdriver';
import env from './env';
import { getHeadlessChromeDriver } from './selenium-driver';
import { basicLogin } from './auth/microsoft/login';

const { url } = env.server;

//todo -- when selenium-webdriver has error the stack trace doesn't give the test line that caused the issue

describe.skip('should load local build index', () => {
  let driver: ThenableWebDriver;

  beforeEach(async () => {
    console.log('setting up driver');
    //todo -- driver setup still requires a bit of boilerplate
    driver = getHeadlessChromeDriver();
    await driver.manage().setTimeouts({ implicit: 10000 });
    await driver.get(url);
    return driver.manage().deleteAllCookies();
  }, 60000);

  test('Should login and load index page', async () => {
    await basicLogin(driver);
    return driver.findElement(By.id('tdms-main'));
  }, 60000);

  afterEach(async () => {
    console.log('shutting down driver');
    return driver.quit();
  });
});
