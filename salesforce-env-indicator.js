// ==UserScript==
// @name         Salesforce - Environment Indicator Bar
// @namespace    https://tampermonkey.net/
// @version      1.0
// @author       Ben Oeyen
// @description  Salesforce - Adds a configurable environment indicator bar per URL
// @match        https://*.my.salesforce.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://www.salesforce.com/
// @downloadURL  https://github.com/Jarflux/tampermonkey-hubo/raw/master/salesforce-env-indicator.js
// @updateURL    https://github.com/Jarflux/tampermonkey-hubo/raw/master/salesforce-env-indicator.js
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    /**
     * CONFIGURATION
     * Add your 4 URLs here.
     * `match` can be a string or RegExp
     * `color` is the environment color
     */
    const ENVIRONMENTS = [
        {
            match: /huboforce--uat.sandbox.my.salesforce.com/,
            color: 'deeppink',
            label: 'UAT',
        },
        {
            match: /huboforce.my.salesforce.com/,
            color: 'red',
            label: 'PROD',
        },
    ];

    const env = ENVIRONMENTS.find(e =>
        typeof e.match === 'string' ? location.href.includes(e.match) : e.match.test(location.href)
    );

    if (!env) return;

    // ---- Create CSS ----
    const style = document.createElement('style');
    style.textContent = `
        #env-indicator {
            background: ${env.color};
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            height: 5px;
            z-index: 100000000000000;
        }

        #env-indicator span {
            background-color: ${env.color};
            color: #FFF;
            position: fixed;
            left: 50%;
            width: 126px;
            margin-left: -63px;
            font: bold 15px/29px sans-serif;
            text-align: center;
            opacity: 60%;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    // ---- Create indicator element ----
    const indicator = document.createElement('div');
    indicator.id = 'env-indicator';
    indicator.innerHTML = `<span>${env.label}</span>`;

    // ---- Insert as first element in <body> ----
    const body = document.body;
    body.insertBefore(indicator, body.firstChild);
})();
