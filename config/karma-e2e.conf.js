
process.env['CHROME_BIN'] = 'C:/Program Files (x86)/Google/Chrome/Application/Chrome.exe';

module.exports = function(config) {
    config.set({
        // your config
        urlRoot: '/__karma/',
        browsers: ['Chrome'],
        frameworks: [ 'ng-scenario', 'jasmine'],
        basePath: '../',
        files: [  'test/e2e/**/*.js'],
        proxies: {
        '/': 'http://localhost:8000/'
        },
        singleRun: true
    });
};

junitReporter = {
  outputFile: 'test_out/e2e.xml',
  suite: 'e2e'
};
