// ==UserScript==
// @name         Azure Boards - Release Copy Button
// @namespace    https://tampermonkey.net/
// @version      1.2
// @author       Ben Oeyen
// @description  Azure Boards - Copy the release version and link to release pipeline to clipboard
// @match        https://dev.azure.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://az-icons.com/
// @downloadURL  https://github.com/Jarflux/tampermonkey-hubo/raw/master/azure-boards-release-buttons.js
// @updateURL    https://github.com/Jarflux/tampermonkey-hubo/raw/master/azure-boards-release-buttons.js
// @grant        GM_setClipboard
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    function addButtons() {
        const rows = document.querySelectorAll('tr.bolt-table-row');

        rows.forEach(row => {
            if (row.dataset.copyButtonAdded) return;

            const versionEl = row.querySelector('.artifact-version-container a, .artifact-version-container span');
            if (!versionEl) return;
            const versionText = versionEl.textContent.trim();
            if ((!versionText.includes('-rc') && !versionText.includes('release')) || versionText.includes('-snapshot') || versionText.includes('develop')) return;

            const releaseLinkEl = row.querySelector('.active-release-name');
            if (!releaseLinkEl) return;
            const releaseName = releaseLinkEl.textContent.trim();
            const releaseHref = releaseLinkEl.getAttribute('href');
            // Build full URL
            const fullUrl = `https://dev.azure.com${releaseHref}`;

            // Create styled button
            const button = document.createElement('button');
            button.className = 'bolt-button bolt-icon-button enabled primary';
            button.style.marginLeft = '8px';
            button.style.height = '25px';
            button.style.display = 'inline-flex';
            button.style.alignItems = 'center';

            button.innerHTML = `
                <span class="fluent-icons-enabled">
                    <span class="left-icon flex-noshrink fabric-icon ms-Icon--Copy medium"></span>
                </span>
                <span class="bolt-button-text body-m">Copy Wiki Release</span>
            `;

            button.addEventListener('click', (e) => {
                e.stopPropagation();

                const textToCopy = `${versionText} | [${releaseName}](${fullUrl})`;

                navigator.clipboard.writeText(textToCopy).then(() => {
                    const textSpan = button.querySelector('.bolt-button-text');
                    textSpan.textContent = 'Copied!';
                    setTimeout(() => {
                        textSpan.textContent = 'Copy Wiki Release';
                    }, 1500);
                });
            });

            // Insert inline with release name
            const nameWrapper = row.querySelector('.release-name-with-menu');
            if (nameWrapper) {
                nameWrapper.style.display = 'flex';
                nameWrapper.style.alignItems = 'center';
                nameWrapper.appendChild(button);
                row.dataset.copyButtonAdded = 'true';
            }
        });
    }

    const observer = new MutationObserver(() => addButtons());
    observer.observe(document.body, { childList: true, subtree: true });

    addButtons();
})();