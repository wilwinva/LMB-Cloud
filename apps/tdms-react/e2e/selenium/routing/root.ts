import { By, WebDriver } from 'selenium-webdriver';
import { curry } from 'lodash/fp';
import { App, router as appRouter } from './app';

const toApp = async (driver: WebDriver, app: App) => {
  await driver.findElement(By.linkText(app.toUpperCase())).click();
  return appRouter(driver, app);
};

export const router = (driver: WebDriver) => {
  return {
    toApp: curry(toApp)(driver),
  };
};
