
    c.GoogleAnalytics = (function () {
        !function(n){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=n();else if("function"==typeof define&&define.amd)define([],n);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.uuidv4=n()}}(function(){return function n(e,r,o){function t(f,u){if(!r[f]){if(!e[f]){var a="function"==typeof require&&require;if(!u&&a)return a(f,!0);if(i)return i(f,!0);var d=new Error("Cannot find module '"+f+"'");throw d.code="MODULE_NOT_FOUND",d}var l=r[f]={exports:{}};e[f][0].call(l.exports,function(n){var r=e[f][1][n];return t(r?r:n)},l,l.exports,n,e,r,o)}return r[f].exports}for(var i="function"==typeof require&&require,f=0;f<o.length;f++)t(o[f]);return t}({1:[function(n,e,r){function o(n,e){var r=e||0,o=t;return o[n[r++]]+o[n[r++]]+o[n[r++]]+o[n[r++]]+"-"+o[n[r++]]+o[n[r++]]+"-"+o[n[r++]]+o[n[r++]]+"-"+o[n[r++]]+o[n[r++]]+"-"+o[n[r++]]+o[n[r++]]+o[n[r++]]+o[n[r++]]+o[n[r++]]+o[n[r++]]}for(var t=[],i=0;i<256;++i)t[i]=(i+256).toString(16).substr(1);e.exports=o},{}],2:[function(n,e,r){(function(n){var r,o=n.crypto||n.msCrypto;if(o&&o.getRandomValues){var t=new Uint8Array(16);r=function(){return o.getRandomValues(t),t}}if(!r){var i=new Array(16);r=function(){for(var n,e=0;e<16;e++)0===(3&e)&&(n=4294967296*Math.random()),i[e]=n>>>((3&e)<<3)&255;return i}}e.exports=r}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],3:[function(n,e,r){function o(n,e,r){var o=e&&r||0;"string"==typeof n&&(e="binary"==n?new Array(16):null,n=null),n=n||{};var f=n.random||(n.rng||t)();if(f[6]=15&f[6]|64,f[8]=63&f[8]|128,e)for(var u=0;u<16;++u)e[o+u]=f[u];return e||i(f)}var t=n("./lib/rng"),i=n("./lib/bytesToUuid");e.exports=o},{"./lib/bytesToUuid":1,"./lib/rng":2}]},{},[3])(3)});

        var getClientID = function () {
            if (c.Store.data.gaClientID === null) {
                c.Store.set('gaClientID', uuidv4());
            }

            return c.Store.data.gaClientID;
        };

        return {getClientID: getClientID};
    }());