// ==UserScript==
// @name         Redmine - Ticket buttons
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Redmine - Generate GIT branch, Commit message and Ticket Announcement and copy to clipboard
// @author       Ben Oeyen
// @match        https://redmine.hubo.be/issues/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hubo.be
// @downloadURL  https://github.com/Jarflux/tampermonkey-hubo/raw/master/redmine-ticket-buttons.js
// @updateURL    https://github.com/Jarflux/tampermonkey-hubo/raw/master/redmine-ticket-buttons.js
// @grant        GM_log
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function($) {
    'use strict'

    $(document).ready(function() {
        $('.subject').find('h3')
            .after(newTicketAnnouncementButton())
            .after(gitBranchButton())
            .after(commitButton());
    });

    function gitBranchButton() {
        var btn = getButton("GIT Branch Name");
        btn.onclick = () => {
            generateGitBranchName();
        };
        return btn;
    }

    function newTicketAnnouncementButton() {
        var btn = getButton("New Ticket Announcement");
        btn.onclick = () => {
            generateNewTicketAnnouncement();
        };
        return btn;
    }

    function commitButton() {
        var btn = getButton("Commit message");
        btn.onclick = () => {
            generateCommitName();
        };
        return btn;
    }

    function getButton(label){
        var btn = document.createElement("button");
        btn.style.cssText = "margin:0 5px 5px 0;";
        btn.innerHTML = label;
        return btn;
    }

    function getTicketUrl(){
        return window.location.href;
    }

    function getTicketType() {
        var ticketHeading = $('#content').find('h2').text();
        var ticketType = ticketHeading.substr(0, ticketHeading.lastIndexOf(" "))
        GM_log("Extracted Redmine ticket type: " + ticketType);
        return ticketType;
    }

    function getTicketNumber() {
        var ticketUrl = getTicketUrl();
        var positionFirstDigit = ticketUrl.lastIndexOf("/") + 1;
        var ticketNumber = ticketUrl.substring(positionFirstDigit, positionFirstDigit + 5 );
        GM_log("Extracted Redmine ticket number: " + ticketNumber);
        return ticketNumber;
    }

    function getTicketTitle() {
        var ticketTitle = $('.subject').find('h3').text();
        GM_log("Extracted Redmine title: " + ticketTitle);
        return ticketTitle;
    }

    function generateGitBranchName() {
        // Wanted format: feat/2.0/rmxxx/title
        var ticketNumber = getTicketNumber();
        var ticketTitle = getTicketTitle();
        var sanitizedTitle = ticketTitle.toLowerCase()
            .replace(/[^A-Z0-9\s]/ig, "") // remove special characters
            .replace(/\s+/g, ' ') // replace multiple spaces with a single space
            .replace(/\s/g, "-"); // replace spaces with dashes

        while(sanitizedTitle.charAt(0) === '-') {
            sanitizedTitle = sanitizedTitle.substring(1);
        }

        var branchName = "feat/2.0/rm" + ticketNumber + "/" + sanitizedTitle;
        GM_log("Generated GIT branch name: " + branchName);
        GM_setClipboard(branchName);
        GM_log("Copied branch name to clipboard");
        return branchName;
    }

    function generateCommitName() {
        // Wanted format: #[TicketNr]: [Title]
        var ticketNumber = getTicketNumber();
        var ticketTitle = getTicketTitle();
        var sanitizedTitle = ticketTitle.toLowerCase()
            .replace(/[^A-Z0-9\s]/ig, "") // remove special characters
            .replace(/\s+/g, ' '); // replace multiple spaces with a single space

        var commitName = "#" + ticketNumber + ": " + sanitizedTitle;
        GM_log("Generated commit name: " + commitName);
        GM_setClipboard(commitName);
        GM_log("Copied commit name to clipboard");
        return commitName;
    }

    function generateNewTicketAnnouncement() {
        // Wanted format: [Type] - [Title] - [Link]
        var announcement = "[" + getTicketType() + "] " + getTicketTitle() + " - " + getTicketUrl();
        GM_log("Generated new ticket announcement: " + announcement);
        GM_setClipboard(announcement);
        GM_log("Copied new ticket announcement to clipboard");
        return announcement;
    }

}).bind(this)(jQuery);

jQuery.noConflict();
