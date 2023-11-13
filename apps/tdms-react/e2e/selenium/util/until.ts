import { Condition, WebDriver, WebElement } from 'selenium-webdriver';

export const untilAttr = (ele: WebElement, attr: [string, string]) => {
  return new Condition(`Waiting until attribute ${attr[0]} is ${attr[1]}.`, async (_driver: WebDriver) => {
    return (await ele.getAttribute(attr[0])) === attr[1];
  });
};

export const buildAttrCondition = (attr: string) => (ele: WebElement, attrVal: string) =>
  untilAttr(ele, [attr, attrVal]);
export const untilValue = buildAttrCondition('value');
