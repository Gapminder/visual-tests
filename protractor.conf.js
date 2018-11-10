'use strict';

const fs = require('fs');
const URL_GOOGLE_SHEET = JSON.parse(fs.readFileSync("./e2e/helpers/list.json"));
const SAUSE_MAX_INSTANCES = 5;
const SAUSE_MAX_SESSIONS = 5;
const LOCAL_MAX_INSTANCES = 1;
const LOCAL_MAX_SESSIONS = 2;
const url = process.env.URL || URL_GOOGLE_SHEET['BASE URL'].toString() || 'https://www.gapminder.org/'
const device = process.env.DEVICE || 'desktop'; // 'desktop' or 'tablet' or 'mobile'

const testResultsDir = 'results';
const testResultsFile = `./${testResultsDir}/testResults.txt`;

let screenSize = {
  desktop: true,
  tablet: false,
  mobile: false,
  width: 1920,
  height: 1080
};

if (device === 'desktop') {
  screenSize.desktop = true;
  screenSize.width = 1920;
  screenSize.height = 1080;
}

if (device === 'mobile') {
  screenSize.desktop = false;
  screenSize.mobile = true;
  screenSize.width = 375;
  screenSize.height = 667;
}

if (device === 'tablet') {
  screenSize.desktop = false;
  screenSize.tablet = true;
  screenSize.width = 768;
  screenSize.height = 1024;
}

// Windows 7 + Chrome 3 versions before latest
// Windows 7 + IE11
// Windows 7 + FF45
// Windows 10 + Chrome latest
// Windows 10 + Edge 13

// Mac OS 10.12 Sierra + Safari 10
// Mac OS 10.12 Sierra + Chrome latest

// Chrome OS + Chrome latest

// iPhone 4S + iOS9 + Safari 9
// iPhone 5 or 6 + iOS10 + safari 10
// iPad Air + iOS10 + safari 10

// Android 6 + Chrome latest
// Android 6 + Android Webview (not Android browser)
// Android tablet + Chrome latest

const platformConfigurations = [
  /*{
    browserName: "chrome",
    platform: "Windows 7",
    version: "latest",
    seleniumVersion: '3.12.0'
  },
  {
    browserName: "chrome",
    platform: "Windows 7",
    version: "latest-1",
    seleniumVersion: '3.12.0'
  },
  {
    browserName: "chrome",
    platform: "Windows 7",
    version: "latest-2",
    seleniumVersion: '3.12.0'
  },*/
  // {
  //   browserName: "firefox",
  //   platform: "Windows 7",
  //   version: "latest",
  //   seleniumVersion: '3.12.0'
  // },
  // {
  //   browserName: "internet explorer",
  //   platform: "Windows 7",
  //   version: "latest",
  //   seleniumVersion: '3.12.0'
  // },
  {
    browserName: "chrome",
    platform: "Windows 10",
    version: "latest",
    seleniumVersion: '3.12.0'
  },
  // {
  //   browserName: "MicrosoftEdge",
  //   platform: "Windows 10",
  //   version: "17.17134",
  //   seleniumVersion: '3.12.0'
  // },
  {
    browserName: "safari",
    platform: "macOS 10.12",
    version: "10.1",
    seleniumVersion: '3.12.0'
  },
  /*{
    browserName: "chrome",
    platform: "macOS 10.12",
    version: "latest",
    seleniumVersion: '3.12.0'
  },*/
  // {
  //   device: 'mobile',
  //   browserName: 'Safari',
  //   deviceName: 'iPhone 4s Simulator',
  //   deviceOrientation: 'portrait',
  //   platformVersion: '9.3',
  //   platformName: 'iOS',
  //   appiumVersion: '1.7.1'
  // },
  // {
  //   device: 'mobile',
  //   browserName: 'Safari',
  //   deviceName: 'iPhone 6s Simulator',
  //   deviceOrientation: 'portrait',
  //   platformVersion: '11.3',
  //   platformName: 'iOS',
  //   appiumVersion: '1.8.1'
  // },
  // {
  //   device: 'tablet',
  //   browserName: 'Safari',
  //   deviceName: 'iPad Air Simulator',
  //   deviceOrientation: 'portrait',
  //   platformVersion: '10.3',
  //   platformName: 'iOS',
  //   appiumVersion: '1.8.1'
  // },
  // {
  //   device: 'mobile',
  //   browserName: 'Chrome',
  //   deviceName: 'Android Emulator',
  //   deviceOrientation: 'portrait',
  //   platformVersion: '6.0',
  //   platformName: 'Android',
  //   appiumVersion: '1.8.1'
  // },
  // {
  //   browserName: 'Chrome',
  //   deviceName: 'Android GoogleAPI Emulator',
  //   deviceOrientation: 'portrait',
  //   platformVersion: '7.1',
  //   platformName: 'Android',
  //   appiumVersion: '1.8.1'
  // }
];
platformConfigurations['tunnel-identifier'] = `${process.env.TRAVIS_JOB_NUMBER}`;
platformConfigurations.map(config => {
  config.name = `visual-tests ${config.platform || "" + config.platformName || "" + config.platformVersion || ""},${config.browserName},${config.version || "" + config.deviceName || ""}`;
  config.maxInstances = SAUSE_MAX_INSTANCES;
  if (!config.platformName) config.screenResolution = '1600x1200';
  config.shardTestFiles = true;
  // config.chromeOptions = {
  //   args: ['no-sandbox']
  // }
  config.nativeWebTap = true,//need for IOS
    config.idleTimeout = 300,
    config.recordVideo = false;
  config.recordScreenshots = true;
  //config.recordLogs = false;
  return config;
})

const capabilityForSaucelabs = {
  browserName: 'chrome',
  platform: 'Windows 10',
  version: '63.0',
  chromedriverVersion: '2.33',
  screenResolution: '1920x1080',
  shardTestFiles: true,
  maxInstances: 4,
  chromeOptions: {
    args: ['no-sandbox']
  }
};

const capabilityForLocalRun = {
  //browserName: 'firefox',
  // 'moz:firefoxOptions': {
  //   // args: [ `-screenshot test.jpg` ]
  //   args: [ `-headless` ]
  // },
  device: device,
  browserName: 'chrome',
  screenResolution: '1920x1080',
  shardTestFiles: true,
  maxInstances: LOCAL_MAX_INSTANCES,
  chromeOptions: {
    args: ['no-sandbox']//, 'headless']
  }
};

const SAUCE_USERNAME = process.env.SAUCE_USERNAME;
const SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY;

exports.config = {
  sauceUser: `${SAUCE_USERNAME}`,
  sauceKey: `${SAUCE_ACCESS_KEY}`,
  //SAUCE_USERNAME: SAUCE_USERNAME,
  //SAUCE_ACCESS_KEY: SAUCE_ACCESS_KEY,

  specs: ['./e2e/**/*.e2e-spec.js'],
  //exclude: ['./e2e/redirects-spec.js'],
  capabilities: SAUCE_USERNAME && SAUCE_ACCESS_KEY ? {} : capabilityForLocalRun,
  multiCapabilities: SAUCE_USERNAME && SAUCE_ACCESS_KEY ? platformConfigurations : {},
  maxSessions: SAUCE_USERNAME && SAUCE_ACCESS_KEY ? SAUSE_MAX_SESSIONS : LOCAL_MAX_SESSIONS,

  // crossbrowser testing:
  // selenium server should be started for safari, microsoftEdge and firefox. directConnect works correctly only with Chrome.
  //
  // {
  //   browserName: 'firefox',
  //   "moz:firefoxOptions": {
  //     "args": ["-headless"],
  //   }
  // },
  // {
  //   browserName: 'MicrosoftEdge'
  // },
  // {
  //   browserName: 'safari'
  // },
  // mouseMove action is not implemented in safari

  //seleniumAddress: 'http://localhost:4444/wd/hub',
  directConnect: !(SAUCE_USERNAME&&SAUCE_ACCESS_KEY), // use directConnect only for local run

  params: {
    desktop: screenSize.desktop,
    tablet: screenSize.tablet,
    mobile: screenSize.mobile,
    screenWidth: screenSize.width,
    screenHeight: screenSize.height
  },
  baseUrl: url,
  allScriptsTimeout: 60000,
  getPageTimeout: 60000,
  // temporary disabled, because it causes NoSuchSessionError
  // typescript compiles 'async await' into generators, so it won't affect protractor controlFlow
  // SELENIUM_PROMISE_MANAGER: false,
  framework: 'jasmine',
  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 300000,
    print: function() {}
  },

  // this will be run after all the tests will be finished
  afterLaunch: function() {
    const fileParse = fs.readFileSync(testResultsFile, 'utf-8');
    const testResults = JSON.parse(fileParse);

    // print consolidated report to the console
    for (const testResult of testResults) {
      console.log(`\n${testResults.indexOf(testResult) + 1}) ${testResult.fullName} - ${testResult.name}`);
      testResult.failedExpectations.forEach(exp => {
        console.log('  - [31m' + exp.message + '[39m');
      });
    }
  },

  // will be run before any test starts
  beforeLaunch: function() {
    // create directory for testResults if not exist
    if (!fs.existsSync(testResultsDir)) {
      fs.mkdirSync(testResultsDir);
    }

    // clear older tests results
    const files = fs.readdirSync(testResultsDir);
    for (const file of files) {
      fs.unlinkSync(`${testResultsDir}/${file}`);
    }
    // fill the file with default values
    fs.writeFileSync(testResultsFile, JSON.stringify([]), 'utf-8');
  },

  onPrepare: async () => {
    await browser.waitForAngularEnabled(false);
    if(!(SAUCE_USERNAME&&SAUCE_ACCESS_KEY)) await browser.driver.manage().window().setSize(screenSize.width, screenSize.height);
    const config = await browser.getProcessedConfig();
    browser.name = config.capabilities.name;
    if (config.capabilities.device) {
      Object.assign(browser.params, ["mobile", "tablet", "desktop"].reduce((res, device) => {
        res[device] = device === config.capabilities.device;
        return res;
      }, {}));
    }
    //require('ts-node').register({ project: 'e2e/tsconfig.json' });

    let SpecReporter = require('jasmine-spec-reporter').SpecReporter;

    jasmine.getEnv().addReporter(
      new SpecReporter({
        spec: {
          displayStacktrace: 'specs'
        }
      })
    );

    jasmine.getEnv().addReporter({
      specDone: function(result) {
        if (result.status === 'failed') {
          // take screenshot on fail
          browser.takeScreenshot().then(function(screenShot) {

            const existingResults = fs.readFileSync(testResultsFile, 'utf-8');
            const appendedRes = JSON.parse(existingResults);
            appendedRes.push(Object.assign({}, result, { name: config.capabilities.name }));

            // write consolidated result to file
            fs.writeFileSync(testResultsFile, JSON.stringify(appendedRes), 'utf-8');

            // Save screenshot
            fs.writeFile(`${testResultsDir}/${result.fullName} - ${config.capabilities.name}.png`, screenShot, 'base64', function(err) {
              if (err) throw err;
              console.log('File saved.');
            });
          });
        }
      }
    });
  }
};
