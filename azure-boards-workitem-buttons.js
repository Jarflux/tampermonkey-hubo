// ==UserScript==
// @name         Azure Boards - Workitem Buttons
// @namespace    https://tampermonkey.net/
// @version      1.2
// @author       Ben Oeyen
// @description  Azure Boards - Generate GIT branch, Commit message and Ticket Announcement and copy to clipboard
// @match        https://dev.azure.com/*/_workitems/edit/*
// @match        https://dev.azure.com/*/_boards/board/*
// @match        https://dev.azure.com/*/Boards/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://az-icons.com/
// @downloadURL  https://github.com/Jarflux/tampermonkey-hubo/raw/master/azure-boards-workitem-buttons.js
// @updateURL    https://github.com/Jarflux/tampermonkey-hubo/raw/master/azure-boards-workitem-buttons.js
// @grant        GM_setClipboard
// @grant        GM_addStyle
// ==/UserScript==

(function ($) {
    'use strict'

    const BUTTON_ID = "extra-btn";

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

    function gitBranchButton(disabled) {
        return createButton("Copy Branch Name", "ms-Icon--OpenSource", getBranchName, disabled);
    }

    function newTicketAnnouncementButton(disabled) {
        return createButton("Copy Ticket Announcement", "ms-Icon--Megaphone", getTicketAnnouncement, disabled);
    }

    function commitButton(disabled) {
        return createButton("Copy Commit message", "ms-Icon--BranchCommit", getCommitMessage, disabled);
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
        // console.log("WorkItem Id:" + workItemId);
        return workItemId ?? null;
    }

    function getWorkItemTitle() {
        const el = document.querySelector('.work-item-title-textfield input');
        const title = el?.value?.trim();
        // console.log("WorkItem Title:" + title);
        return title ?? null;
    }

    function start() {
        const observer = new MutationObserver(() => {
            addButtonsToWorkItem();
        });

        navigation.addEventListener("navigate", (event) => {
            addButtonsToWorkItem();
        });

        observer.observe(document.body, {childList: true, subtree: true});
    }

    start();
})();