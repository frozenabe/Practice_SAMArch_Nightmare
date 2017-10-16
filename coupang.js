const Nightmare = require ('nightmare');
const binaryPack = require('./lib/bootstrap/nightmare-lambda-pack');
const electronPath = binaryPack.installNightmareOnLambdaEnvironment();
const nightmare = Nightmare({ 
  show: true,
  electronPath,
});

const result = [];

function goDeep(listIndex, orderUnitIndex) {
  return nightmare
    //배송조회
    .wait(1)
    .click(`.my-purchase-list__item:nth-child(${listIndex}) table.my-order-unit:nth-of-type(${orderUnitIndex}) a.js_deliveryTracking`)
    //결과조회
    .wait(80)
    .evaluate(() => document.querySelector('div#my__container > div.my-ship-track__header.my-font--gothic:nth-child(1) > div.my-ship-track__head-info:nth-child(1) > div.my-ship-track__head-title:nth-child(1)').innerHTML)
    .then(message => {
      //console.log(listIndex, orderUnitIndex);
      // message = message.replace(/\n/g, '');
      // message = message.replace(/  +/g, '');
      // message = message.replace(/\t/g, '');
      result.push(message);
      // return nightmare.goto('https://my.coupang.com/purchase/list');
      return nightmare.back();
    });
}
const coupangScraper = (userId, password) => {
  nightmare
    .goto('https://login.coupang.com/login/login.pang?rtnUrl=https://my.coupang.com')
    .insert('input#login-email-input', userId)
    .insert('input#login-password-input', password)
    .click('html > body.member-container.member-root--clean.page-null.page-login-login.env-production > div.member-wrapper.member-wrapper--flex:nth-child(1) > div.member-main:nth-child(2) > div.member-login._loginRoot:nth-child(1) > form.login__form._loginForm:nth-child(1) > div.login__content.login__content--trigger:nth-child(9) > button.login__button.login__button--submit._loginSubmitButton:nth-child(1)')
    // .wait(500)
    // .click('header#header > section:nth-child(1) > div.clearFix:nth-child(1) > ul.icon-menus:nth-child(3) > li.my-coupang.more:nth-child(1) > p.my-coupang-menu:nth-child(2) > span.wrapper:nth-child(1) > a:nth-child(2)')
    .wait(150)
    .evaluate(() => document.getElementsByClassName('my-purchase-list__item').length)
    .then((listCount) => {
      let bigPromise = Promise.resolve();
      for (let listIndex = 1; listIndex <= listCount; listIndex += 1) {
        bigPromise = bigPromise.then(() =>
          nightmare
            .evaluate((selector) =>
              document.querySelector(selector).getElementsByClassName('my-order-unit').length,
              `.my-purchase-list__item:nth-child(${listIndex})`)
            .then((orderUnitCount) => {
              let promise = Promise.resolve();
              for (let orderUnitIndex = 1; orderUnitIndex <= orderUnitCount; orderUnitIndex += 1) {
                //console.log(`.my-purchase-list__item:nth-child(${listIndex}) table.my-order-unit:nth-of-type(${orderUnitIndex}) a.js_deliveryTracking`);
                promise = promise.then(() => {
                  return goDeep(listIndex, orderUnitIndex);
                });
              }
              return promise;
            }));
      }
      return bigPromise;
    })
    .then(() => {
      for (let i = 0; i < result.length; i += 1) {
        result[i] = result[i].replace(/\n/g, '');
        result[i] = result[i].replace(/  +/g, '');
      }
      console.log(result);
      return nightmare.end();
    })
}

module.exports = coupangScraper;

