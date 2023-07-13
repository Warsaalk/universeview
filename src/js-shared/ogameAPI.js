
    let OgameAPI = {
        HIGHSCORE: 'highscore.xml?category=1&type=3',
        PLAYERS: 'players.xml',
        PLANETS: 'universe.xml',
        ALLIANCES: 'alliances.xml',
        SERVER: 'serverData.xml',
        LOCALE: 'localization.xml',

        checkXML: function (callback, xml, customOrigin)
        {
            new XHR({
                url: (customOrigin || window.location.origin) + "/api/" + xml,
                method: "head",
                response: "xml",
                onStop: function () {
                    callback.call(null, this);
                },
                onError: function () {
                    console.warn("Couldn't check "+xml+" head");
                }
            });
        },

        fetchXML: function (callback, xml, cache, customOrigin)
        {
            new XHR({
                cache: "boolean" === typeof cache ? cache : false,
                url: (customOrigin || window.location.origin) + "/api/" + xml,
                method: "get",
                response: "xml",
                onReceived: function (xmlData) {
                    callback.call(null, xmlData)
                },
                onError: function () {
                    console.warn("Couldn't fetch " + xml + " xml data")
                }
            });
        },

        fetch: function (xml, callback, cache, customOrigin)
        {
            this.fetchXML(callback, xml, cache, customOrigin);
        },

        check: function (xml, callback, customOrigin)
        {
            this.checkXML(callback, xml, customOrigin);
        }
    };