process.env['CHROME_BIN'] = 'C:/Program Files (x86)/Google/Chrome/Application/Chrome.exe';

module.exports = function(config) {
    config.set({
        // your config
        browsers: ['Chrome'],
        frameworks: ['jasmine'],
        basePath: '../',
        files:['app/js/Rules/*.js',
        //'app/lib/angular/angular.js',
        //'app/lib/angular/angular-*.js',
        //'test/lib/angular/angular-mocks.js',
        'test/unit/**/*.js'],
    //proxies: {
    //        '/': 'http://localhost:8000/'
    //    },
        singleRun: true,
        exclude: ['app/lib/angular/angular-loader*.js'],
        junitReporter: {
        outputFile: 'test_out/unit.xml',
        suite: 'unit'
    }
    });
};
