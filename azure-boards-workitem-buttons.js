// ==UserScript==
// @name         Azure Boards - Workitem Buttons
// @namespace    https://tampermonkey.net/
// @version      1.1
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

(function($) {
    'use strict'

    const BUTTON_ID = "extra-btn";

    function addButtonsToWorkItem(){
        if (document.getElementById(BUTTON_ID)) return;

        // Where to inject the button
        const container = document.querySelector(".work-item-header-command-bar");

        if (!container) return;
        container.prepend(newTicketAnnouncementButton());
        container.prepend(commitButton());
        container.prepend(gitBranchButton());
    }

    function gitBranchButton() {
        return createButton("Copy Branch Name", "ms-Icon--OpenSource", getBranchName());
    }

    function newTicketAnnouncementButton() {
        return createButton("Copy Ticket Announcement", "ms-Icon--Megaphone", getTicketAnnouncement());
    }

    function commitButton() {
        return createButton("Copy Commit message", "ms-Icon--BranchCommit", getCommitMessage());
    }

    function createButton(buttonText,icon,textToCopy) {
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
            GM_setClipboard(textToCopy);
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

    function getTicketAnnouncement(){
        const link = document.querySelector("div.work-item-form-header a")
        const href = link?.href;
        const type = link?.innerHTML;
        return "[" + type + "] " + getWorkItemTitle() + " - " + href;
    }

    function getCommitMessage(){
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
        // URL patterns handle:
        // /_workitems/edit/1234
        // /?workitem=1234
        const idFromEdit = window.location.pathname.match(/_workitems\/edit\/(\d+)/);
        if (idFromEdit) return idFromEdit[1];

        const params = new URLSearchParams(window.location.search);
        const workItemId = params.get("workitem");
        console.log("Workitem ID:" + workItemId);
        return workItemId;
    }

    function getWorkItemTitle() {
        // Azure Boards typical title selector
        const el = document.querySelector('.work-item-title-textfield input');
        const title = el?.value?.trim();
        console.log("WorkItem Title:" + title);
        return title ?? null;
    }

    function start() {
        const observer = new MutationObserver(() => {
            addButtonsToWorkItem();
        });

        observer.observe(document.body, { childList: true, subtree: true });
        addButtonsToWorkItem();
    }

    start();
})();
