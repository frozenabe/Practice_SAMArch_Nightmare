const Nightmare = require ('nightmare');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const binaryPack = require('./lib/bootstrap/nightmare-lambda-pack');
const electronPath = binaryPack.installNightmareOnLambdaEnvironment();
const nightmare = Nightmare({ 
  show: true,
  electronPath,
});

const result = {};

const gMarketScraper = (userId, password) => {
  nightmare
    .goto('https://mobile.gmarket.co.kr/Login/Login?URL=http://mmyg.gmarket.co.kr/home')
    .insert('input#id', userId)
    .insert('input#pwd', password)
    .click('button.lgs')
    .wait(1000)
    .evaluate(() => {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", 'http://myg.gmarket.co.kr/contactlist/getsumofdeliverystatusdata', false);
      xhr.overrideMimeType("text/plain; charset=x-user-defined");
      xhr.send();
      return xhr.responseText;
    })
    .end()
    .then(message => {
      message = message.replace(/<td>/g, '');
      message = message.replace(/<\/td>/g, ' ');
      message = message.replace(/\n/g, '');
      message = message.replace(/\t/g, '');
      result.message = message;
      console.log(result);
    })
};

module.exports = gMarketScraper;
  

     