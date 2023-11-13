import { By, Locator, ThenableWebDriver, until, WebDriver, WebElementPromise } from 'selenium-webdriver';
import { untilValue } from '../../util/until';

/**
 * From https://login.microsoftonline.com/* performs basic auth using test user. Expects application to route to the
 * authentication page before calling this method.
 * @param driver the driver to perform actions on
 */
export const basicLogin = async (driver: ThenableWebDriver) => {
  /** Note: microsoft is using knockoutjs... they do weird things like use the same id on different components and
   * hiding + moving components so a lot of findElement(By.*) until.* methods will not work. Can use explicit
   * `await wait(milliseconds)` for brute force method of checking if knockout is causing issues.
   * */
  await driver.wait(until.urlContains('login.microsoftonline.com'));

  const testuser = 'tdmstest@nwm.doe.gov'; //todo -- inject
  await findElement(driver, By.name('loginfmt')).sendKeys(testuser);
  await findElement(driver, _submitButtonByValue('Next')).click();

  const testpass = 'Wisdom-Measure-Prevent-Dine-91'; //todo -- inject (change password when setup)
  await findElement(driver, By.name('passwd')).sendKeys(testpass);
  return findElement(driver, _submitButtonByValue('Sign in')).click();
};

const _submitButtonByValue = (value: string) => By.xpath(`//input[@type = "submit" and @value = "${value}"]`);

/**
 * Wrapper to find element and wait for the element to be visible, enabled, and loaded into the view.
 * @param driver the web driver
 * @param locator the locator to find the element
 */
const findElement = (driver: WebDriver, locator: Locator): WebElementPromise => {
  return new WebElementPromise(
    driver,
    driver.wait(visibleAndEnabled(locator)).then((ele) => notNull(ele))
  );
};

/**
 * Asserts that a value is truthy then narrows the type.
 * @param value the value to narrow
 */
function notNull<T>(value: NonNullable<T> | null): NonNullable<T> {
  expect(value).toBeTruthy();
  return value!;
}

/**
 * Return element if it is visible, enabled, and loaded into the view; else, return null. Intended to be used with
 * driver.wait loop.
 * @param locator the locator to find the element
 */
const visibleAndEnabled = (locator: Locator) => async (driver: WebDriver) => {
  try {
    const element = await driver.findElement(locator);
    const ready = await Promise.all([element.isDisplayed(), element.isEnabled()]).then((flags) =>
      flags.reduce((acc, flag) => acc && flag)
    );

    if (ready) {
      await driver.executeScript('arguments[0].scrollIntoView(true);', element);
      return element;
    }
    return null;
  } catch (error) {
    if (error.name === 'StaleElementReferenceError' || 'NoSuchElementError') {
      return null;
    }
    throw error;
  }
};
