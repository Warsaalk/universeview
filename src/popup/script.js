var showPrivacyContent = function (showPrivacy) {
    document.getElementById("opt-in-prompt").style.display = showPrivacy ? "block" : "none";
    document.getElementById("opt-in-accepted").style.display = !showPrivacy ? "block" : "none";
};

var notifyBackgroundPage = function (accepted) {
    browser.runtime.sendMessage({action: "googleAnalyticsPopup", accepted: accepted});
};

window.addEventListener("load", function() {
    browser.storage.local.get("UV_gaOptin", function (result) {
        var optinAccepted = "undefined" !== typeof result.gaOptin && result.gaOptin;
        showPrivacyContent(!optinAccepted);
    });

    document.getElementById("button-enable").addEventListener("click", function () {
        browser.storage.local.set({"UV_gaOptin": true});
        showPrivacyContent(false);
        notifyBackgroundPage(true);
        window.close();
    });

    document.getElementById("button-cancel").addEventListener("click", function () {
        browser.storage.local.set({"UV_gaOptin": false});
        notifyBackgroundPage(false);
        window.close();
    });
});