// ==UserScript==
// @name         Improve Microsoft Login
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Set company image per microsoft account based on email suffix
// @author       Ben Oeyen
// @match        https://login.microsoftonline.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Wait for DOM ready
    if (document.readyState === "complete" || document.readyState === "interactive") {
        init();
    } else {
        window.addEventListener("DOMContentLoaded", init);
    }

    // === MAIN ===
    function init() {
        waitForElement("div.table[data-test-id]", processTables);
    }

    // === WAIT FOR TARGET ELEMENT TO APPEAR ===
    function waitForElement(selector, callback, maxAttempts = 30, interval = 500) {
        let attempts = 0;
        const checker = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(checker);
                callback();
            } else if (++attempts >= maxAttempts) {
                clearInterval(checker);
                console.warn("Tampermonkey: Timeout waiting for element:", selector);
            }
        }, interval);
    }

    // --- Loop over all table divs and apply logic ---
    function processTables() {
        const tables = document.querySelectorAll("div.table");

        tables.forEach(tableDiv => {
            const dataTestId = tableDiv.getAttribute("data-test-id");
            if (!dataTestId) return;

            const emailSuffix = getEmailSuffix(dataTestId);
            if (emailSuffix) {
                setFaviconImage(tableDiv, emailSuffix);
            }
        });
    }

    // --- Get company by matching suffix ---
    function getEmailSuffix(dataTestId) {
        const atIndex = dataTestId.lastIndexOf("@");
        if (atIndex === -1) return null;
        return dataTestId.substring(atIndex); // includes the "@"
    }

    // --- Set image in the proper location ---
    function setFaviconImage(tableDiv, domain) {
        const img = tableDiv.querySelector("div.table > div > div.table-cell.tile-img > img");
        img.src = "https://www.google.com/s2/favicons?sz=48&domain=" + domain ;
        img.style.objectFit = "cover";
        img.style.objectPosition = "0% 100%";
    }

})();