const Nightmare = require ('nightmare');
const binaryPack = require('./lib/bootstrap/nightmare-lambda-pack');
const electronPath = binaryPack.installNightmareOnLambdaEnvironment();
const nightmare = Nightmare({ 
  show: true,
  electronPath,
});

const result = {};

const elevenStScraper = (userId, password) => {
  nightmare
    .goto('https://login.11st.co.kr/login/Login.tmall?returnURL=http%3A%2F%2Fbuy.11st.co.kr%2Forder%2FOrderList.tmall')
    .insert('input#loginName', userId)
    .insert('input#passWord', password)
    .click('input.btn_login')
    .wait('form#form1 > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div.QnADate_set:nth-child(1) > button.defbtn_sm.dtype6:nth-child(2) > span:nth-child(1)')
    .click('form#form1 > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div.QnADate_set:nth-child(1) > button.defbtn_sm.dtype6:nth-child(2) > span:nth-child(1)')
    .wait('form#form1 > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div.QnAtxt:nth-child(3) > input.bt_srh:nth-child(3)')
    .click('form#form1 > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div.QnAtxt:nth-child(3) > input.bt_srh:nth-child(3)')
    .wait('div#layBody > div.mytmall_wrap_v2:nth-child(1) > div.mytmall_contArea:nth-child(4) > ul.order_list:nth-child(17) > li:nth-child(1) > strong:nth-child(1)')
    .evaluate(() => document.querySelector('div#layBody > div.mytmall_wrap_v2:nth-child(1) > div.mytmall_contArea:nth-child(4) > ul.order_list:nth-child(17) > li:nth-child(1) > strong:nth-child(1)').innerHTML)
    .end()
    .then(message => {
      // message = message.replace(/<td>/g, '');
      // message = message.replace(/<\/td>/g, ' ');
      // message = message.replace(/\n/g, '');
      // message = message.replace(/\t/g, '');
      result.message = message;
      console.log(result);
    })
}

module.exports = elevenStScraper;