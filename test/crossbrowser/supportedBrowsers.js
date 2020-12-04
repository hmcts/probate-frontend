const LATEST_MAC = 'macOS 10.15';
const LATEST_WINDOWS = 'Windows 10';

const supportedBrowsers = {
    microsoftIE11: {
        ie11: {
            browserName: 'internet explorer',
            platformName: LATEST_WINDOWS,
            browserVersion: 'latest',
            'sauce:options': {
                name: 'Probate: IE11',
                screenResolution: '1400x1050'
            }
        }
    },
    microsoftEdge: {
        edge: {
            browserName: 'MicrosoftEdge',
            platformName: LATEST_WINDOWS,
            browserVersion: 'latest',
            'sauce:options': {
                name: 'Probate: Edge_Win10'
            }
        }
    },
    chrome: {
        chrome_win_latest: {
            browserName: 'chrome',
            platformName: LATEST_WINDOWS,
            browserVersion: 'latest',
            'sauce:options': {
                name: 'Probate: WIN_CHROME_LATEST'
            }
        },
        chrome_mac_latest: {
            browserName: 'chrome',
            platformName: LATEST_MAC,
            browserVersion: 'latest',
            'sauce:options': {
                name: 'Probate: MAC_CHROME_LATEST'
            }
        }
    },
    firefox: {
        firefox_win_latest: {
            browserName: 'firefox',
            platformName: LATEST_WINDOWS,
            browserVersion: 'latest',
            'sauce:options': {
                name: 'Probate: WIN_FIREFOX_LATEST'
            }
        },
        firefox_mac_latest: {
            browserName: 'firefox',
            platformName: LATEST_MAC,
            browserVersion: 'latest',
            'sauce:options': {
                name: 'Probate: MAC_FIREFOX_LATEST'
            }
        }
    }
};

module.exports = supportedBrowsers;
