import { Builder } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome';

const chromeOptions: ChromeOptions = new ChromeOptions()
  .addArguments('--incognito', 'ignore-certificate-errors')
  .setAcceptInsecureCerts(true) as ChromeOptions;

export const getChromeDriver = () => {
  return new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
};

export const getHeadlessChromeDriver = () => {
  return new Builder().forBrowser('chrome').setChromeOptions(chromeOptions.headless()).build();
};

export const getChromeBuilder = () => {
  return new Builder().forBrowser('chrome').setChromeOptions(chromeOptions);
};
