
    var UvApp = function (url, communities) {
        this.url = url;
        this.communities = communities;
    };

    var config = {
        version: '%version%',
        debug: '%debug%',
        board: 'https://board.en.ogame.gameforge.com/index.php?thread/716794-universeview/',
        apps: {
            ogotcha: new UvApp('https://ogotcha.universeview.be/', {cz:'cs',de:'de',dk:'da',en:'en',es:'es',fr:'fr',gr:'el',hr:'hr',hu:'hu',it:'it',nl:'nl',pl:'pl',br:'pt-BR',pt:'pt',ro:'ro',ru:'ru',se:'sv',sk:'sk',tr:'tr',tw:'zh'}),
            trashsim: new UvApp('https://trashsim.universeview.be/', {cz:'cs',de:'de',dk:'da',en:'en',es:'es',fr:'fr',gr:'el',hr:'hr',hu:'hu',it:'it',nl:'nl',pl:'pl',br:'pt-BR',pt:'pt',ro:'ro',ru:'ru',se:'sv',tr:'tr',tw:'zh'}),
            website: new UvApp('https://universeview.be/', {dk:'da',en:'en',es:'es',hr:'hr'})
        },
        type: navigator.userAgent.indexOf(' Edge/') >= 0 ? "EDGE" : (navigator.userAgent.indexOf(' OPR/') >= 0 ? "NEX" : (navigator.userAgent.indexOf(' Firefox/') >= 0 ? "XPI" : (navigator.userAgent.indexOf(' Chrome/') >= 0 ? "CRX" : "undefined"))),
        helloVersion: '2.0.0',
        googleAnalyticsCode: 'UA-64502186-2',
        googleAnalyticsEnabled: true,
        notifications: {
            defaultOffset: 60
        },
        ogameURL: "s{UID}.ogame.gameforge.com"
    };

    context.ft = {}; // Init features object