// ==UserScript==
// @name         Azure Boards - Workitem Buttons
// @namespace    https://tampermonkey.net/
// @version      1.6
// @author       Ben Oeyen
// @description  Azure Boards - Generate GIT branch, Commit message and Ticket Announcement and copy to clipboard, Order Discussions, Colorblind Mode
// @match        https://dev.azure.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://az-icons.com/
// @downloadURL  https://github.com/Jarflux/tampermonkey-hubo/raw/master/azure-boards-workitem-buttons.js
// @updateURL    https://github.com/Jarflux/tampermonkey-hubo/raw/master/azure-boards-workitem-buttons.js
// @grant        GM_setClipboard
// @grant        GM_addStyle
// ==/UserScript==

(function ($) {
    'use strict'

    const BUTTON_ID = "extra-btn";

    function updateCards() {
        // Loop through all cards with data-itemid attribute
        const cards = document.querySelectorAll('div[data-itemid]');

        cards.forEach(card => {
            // Find the title text span
            const titleSpan = card.querySelector('.title-text');
            const flag = card.querySelector('.card-flag');
            if(titleSpan){
                // Get the color from the title span style
                const titleColor = titleSpan.style.color;

                // Apply the color to the card flag
                if (flag && titleColor) {
                    flag.style.backgroundColor = titleColor;
                }

                // Remove bold and color from title text
                titleSpan.style.fontWeight = 'normal';
                titleSpan.style.color = '';
            }

            if(isColorBlindMode()){
                applyColorBlindLabels(flag);
            }else{
                removeColorBlindLabels(flag);
            }
        });
    }

    function addButtonsToWorkItem() {
        if (document.getElementById(BUTTON_ID)) return;

        // Where to inject the button
        const container = document.querySelector(".work-item-header-command-bar");

        if (!container) return;

        if (getWorkItemId()) {
            container.prepend(newTicketAnnouncementButton(false));
            container.prepend(commitButton(false));
            container.prepend(gitBranchButton(false));
        }
    }

    // Colorblind Mode
    // ==================
    const COLORBLIND_STORAGE_KEY = 'tampermonkey-colorblind-mode';

    function isColorBlindMode() {
        if(!localStorage.getItem(COLORBLIND_STORAGE_KEY)){
            setPreference(false);
        }
        return localStorage.getItem(COLORBLIND_STORAGE_KEY) == "true";
    }

    function setColorBlindMode(value) {
        localStorage.setItem(COLORBLIND_STORAGE_KEY, value);
    }

    function applyColorBlindLabels(flag){
        flag.style.color = "white";
        flag.style.width = "18px";
        flag.style.writingMode = "vertical-rl";
        flag.style.fontWeight = "bold";
        flag.style.padding = "5px 1px 5px 1px";
        const flagColor = flag.style.backgroundColor;

        if( flagColor == "rgb(240, 102, 115)" ){
            flag.textContent = "MUST";
        }
        if( flagColor == "rgb(168, 206, 75)") {
            flag.textContent = "COULD";
        }
        if( flagColor == "rgb(249, 185, 120)") {
            flag.textContent = "SHOULD";
        }
        if( flagColor == "rgb(0, 152, 199)"){
            flag.textContent = "NO MOSCOW";
        }
        if( flagColor == "rgb(204, 41, 61)"){
            flag.textContent = "BUG";
        }
    }

    function removeColorBlindLabels(flag){
        flag.textContent = "";
        flag.style.width = "4px";
    }

    function addColorblindModeButton() {
        const btn = document.createElement('button');

        btn.id = 'tampermonkey-colorblind-btn';
        btn.className ='bolt-header-command-item-button bolt-button bolt-icon-button enabled subtle icon-only bolt-focus-treatment';
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.type = 'button';

        const spanIconWrapper = document.createElement('span');
        spanIconWrapper.className = 'fluent-icons-enabled';

        const icon = document.createElement('span');
        icon.className = 'left-icon flex-noshrink fabric-icon ms-Icon--Color medium';

        spanIconWrapper.appendChild(icon);
        btn.appendChild(spanIconWrapper);

        btn.onclick = (event) => {
            event.stopPropagation();
            setColorBlindMode(!isColorBlindMode());
            updateCards();
        };
        return btn;
    }


    function addColorBlindButtonToBoardControls() {
        if (document.getElementById('tampermonkey-colorblind-btn')) return true;

        console.log("Add ColorBlind Button");
        const controls = document.querySelector('.boards-tabs-header .bolt-header-commandbar .bolt-header-commandbar-button-group');
        if (!controls) return false;
        console.log("Add ColorBlind Button- cont");

        const btn = addColorblindModeButton();
        const lastButton = controls.querySelector('.overflow-button-empty-div');

        controls.insertBefore(btn, lastButton);
    }
    // ==================


    function getUserEmail(){
        return document.getElementById("mectrl_currentAccount_secondary")? document.getElementById("mectrl_currentAccount_secondary").textContent: null;
    }

    function gitBranchButton(disabled) {
        return createButton("Copy Branch Name", "ms-Icon--OpenSource", getBranchName);
    }

    function newTicketAnnouncementButton(disabled) {
        return createButton("Copy Ticket Announcement", "ms-Icon--Megaphone", getTicketAnnouncement);
    }

    function commitButton(disabled) {
        return createButton("Copy Commit message", "ms-Icon--BranchCommit", getCommitMessage);
    }

    function createButton(buttonText, icon, textToCopy) {
        const btn = document.createElement("button");
        btn.id = BUTTON_ID;

        btn.setAttribute("aria-disabled", "false");
        btn.setAttribute("aria-roledescription", "button");
        btn.setAttribute("data-is-focusable", "true");
        btn.setAttribute("role", "menuitem");
        btn.setAttribute("tabindex", "0");
        btn.type = "button";
        btn.className = "bolt-header-command-item-button bolt-button bolt-icon-button primary bolt-focus-treatment";

        const iconWrap = document.createElement("span");
        iconWrap.className = "fluent-icons-enabled";

        const leftIcon = document.createElement("span");
        leftIcon.className = "left-icon flex-noshrink fabric-icon " + icon;
        leftIcon.setAttribute("aria-hidden", "true");

        iconWrap.appendChild(leftIcon);

        // Text span
        const text = document.createElement("span");
        text.className = "bolt-button-text body-m";
        text.textContent = buttonText;

        btn.appendChild(iconWrap);
        btn.appendChild(text);

        // Click handler
        btn.addEventListener("click", () => {
            GM_setClipboard(textToCopy());
            text.textContent = "Copied!";
            setTimeout(() => (text.textContent = buttonText), 1000);
        });
        return btn;
    }

    function getBranchName() {
        const id = getWorkItemId();
        const title = getWorkItemTitle();
        if (!id || !title) return;
        return `feature/${id}-${sanitizeTitle(title)}`;
    }

    function getTicketAnnouncement() {
        const link = document.querySelector("div.work-item-form-header a")
        const href = link?.href;
        const type = link?.innerHTML;
        return "[" + type + "] " + getWorkItemTitle() + " - " + href;
    }

    function getCommitMessage() {
        return "#" + getWorkItemId() + ": " + getWorkItemTitle();
    }

    function sanitizeTitle(title) {
        return title
            .toLowerCase()
            .replace(/[^\w]+/g, "-")   // Convert spaces & non-alphanumerics to hyphens
            .replace(/^-+|-+$/g, "")   // Trim hyphens
            .substring(0, 60);         // Optional: limit length
    }

    function getWorkItemId() {
        const workItemId = document.querySelector('.work-item-title-textfield').parentElement.parentElement.parentElement.innerText;
        return workItemId ?? null;
    }

    function getWorkItemTitle() {
        const el = document.querySelector('.work-item-title-textfield input');
        const title = el?.value?.trim();
        return title ?? null;
    }

    // Discussion Order Toggle
    const STORAGE_KEY = 'tampermonkey-discussion-order';

    function getPreference() {
        if(!localStorage.getItem(STORAGE_KEY)){
            setPreference('old-first');
        }
        return localStorage.getItem(STORAGE_KEY);
    }

    function setPreference(value) {
        localStorage.setItem(STORAGE_KEY, value);
    }

    function reverseComments() {
        if(shouldReverseComments()){
            const container = document.querySelector('[id^="__bolt-Discussion"]');
            if (container){
                // Only select comment items, not other elements like buttons
                const comments = Array.from(container.querySelectorAll('.comment-item'));
                if (!comments.length) return

                // Re-append in reverse order
                comments.reverse().forEach(el => container.appendChild(el));
                currentState = getPreference();
            }
        }
        firstLoad = false;
    }

    function createDiscussionOrderButton() {
        const btn = document.createElement('button');

        btn.id = 'tampermonkey-order-btn';
        btn.className ='work-item-form-toggle-order work-item-form-toggle bolt-button bolt-icon-button enabled subtle icon-only bolt-focus-treatment';
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.type = 'button';

        const spanIconWrapper = document.createElement('span');
        spanIconWrapper.className = 'fluent-icons-enabled';

        const icon = document.createElement('span');
        icon.className = 'left-icon flex-noshrink fabric-icon ms-Icon--Filter medium';
        icon.style.transition = 'transform 0.2s ease';

        spanIconWrapper.appendChild(icon);
        btn.appendChild(spanIconWrapper);

        function updateIconAndLabel() {
            const pref = getPreference();
            btn.setAttribute('aria-label', pref === 'new-first' ? 'Newest first' : 'Oldest first');
            icon.style.transform = pref === 'old-first' ? 'rotate(180deg)' : 'rotate(0deg)';
        }

        btn.onclick = (event) => {
            event.stopPropagation();
            const next = getPreference() === 'new-first' ? 'old-first' : 'new-first';
            setPreference(next);
            reverseComments();
            updateIconAndLabel();
        };

        updateIconAndLabel();
        return btn;
    }

    function addButtonToDiscussionControls() {
        if (document.getElementById('tampermonkey-order-btn')) return true;

        const controls = document.querySelector('.work-item-form-discussion .work-item-form-section-controls');
        if (!controls) return false;

        const btn = createDiscussionOrderButton();
        controls.insertBefore(btn, controls.firstChild);
    }

    let currentState = "new-first";
    let firstLoad = true;

    function shouldReverseComments(){
        if(firstLoad && getPreference() === 'old-first'){
            return true;
        }
        return getPreference() !== currentState;
    }

    function initDiscussionOrder() {
        if(firstLoad){
            var buttonCreated = addButtonToDiscussionControls();
            if(buttonCreated) {
                reverseComments()
            }
        }
    }

    function start() {
        const observer = new MutationObserver(() => {
            console.log("mutation triggered");
            stopObserver();
            addColorBlindButtonToBoardControls();
            addButtonsToWorkItem();
            updateCards();
            initDiscussionOrder();
            startObserver();
        });

        navigation.addEventListener("navigate", (event) => {
            firstLoad = true;
            stopObserver();
            addColorBlindButtonToBoardControls();
            addButtonsToWorkItem();
            updateCards();
            initDiscussionOrder();
            startObserver();
        });

        function stopObserver(){
            observer.disconnect();
        }

        function startObserver() {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }

        observeAgain();
    }

    start();
})();