const Nightmare = require('nightmare');
const binaryPack = require('./lib/bootstrap/nightmare-lambda-pack');
const Xvfb = require('./lib/bootstrap/xvfb');

// ASSUME that scrapper's file name is equal with brandName.
const BRAND_NAMES = ['coupang', '11st', 'gMarket'];

const SCRAPERS = {};

BRAND_NAMES.forEach((brandName) => {
  SCRAPERS[brandName] = require(`./${brandName}`);
});

const isOnLambda = binaryPack.isRunningOnLambdaEnvironment;
//const electronPath = binaryPack.installNightmareOnLambdaEnvironment();

exports.handler = (event, context, callback) => {
  const {
    brandName,
    userId,
    password,
  } = event;

  console.log('yas', brandName, userId, password)
  
  const xvfb = new Xvfb({
      xvfb_executable: '/tmp/pck/Xvfb',
      dry_run: !isOnLambda,
  });

  function done(err, result) {
    xvfb.stop((err) => {
      callback(err, result);
    });
  }

  xvfb.start((err, xvfbProcess) => {
    if (err) {
      callback(err, xvfbProcess);
      return;
    }

    const scraper = SCRAPERS[brandName];
    if (!scraper) {
      done('wrong brandName');
      return;
    }
    scraper(userId, password)
      .then(result => done(null, result))
      .catch(error => done(error));
  }); 
};