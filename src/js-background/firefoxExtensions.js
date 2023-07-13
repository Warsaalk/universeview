

    var googleAnalyticsPopupTab = null;
    if (config.type === "XPI") {
        config.googleAnalyticsEnabled = false;
        browser.storage.local.get("UV_gaOptin", function(result) {
            if ("undefined" === typeof result.UV_gaOptin) {
                browser.tabs.create({url: "chrome/popup/index.html"}, function (tab) {
                    googleAnalyticsPopupTab = tab;
                });
            } else {
                config.googleAnalyticsEnabled = result.UV_gaOptin;
            }
        });

        //Components.utils.import("resource://gre/modules/AddonManager.jsm");r

        context['AGO'] = (function () {

            var IDs = ["kfaofnlkooiapdmkbppmpgmjmhkolaeb", "ldbahlcmhmlpomdepooifmhnalokdhgm"], installed = {};

            var validate = function (extension) {

                if (IDs.indexOf(extension.id) !== -1) return true;

                return false;

            };

            var monitor = function () {

                debugger;
/*
                AddonManager.getAllAddons(function (extensions) {

                    debugger;

                    for (var i = extensions.length; i--;) {

                        var extension = extensions[i];
                        if (validate(extension)) {
                            installed[extension.id] = extension;
                        }

                    }

                });
*/
            };

            var isEnabled = function (callback) {

                for (var id in installed) {
                    if (installed[id].enabled) return true;
                }

                return false;

            };

            return {'isEnabled': isEnabled, 'monitor': monitor};

        }());

        context.AGO.monitor();

    }
