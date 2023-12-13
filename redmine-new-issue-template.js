// ==UserScript==
// @name         Redmine - New Issue Template
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redmine - buttons to prefill or append the ticket template to a new issue.
// @author       Ben Oeyen
// @match        https://redmine.hubo.be/projects/omnichannel-hubomat/issues/new*
// @downloadURL  https://github.com/Jarflux/tampermonkey-hubo/raw/master/redmine-new-issue-template.js
// @updateURL    https://github.com/Jarflux/tampermonkey-hubo/raw/master/redmine-new-issue-template.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hubo.be
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        $('#content')
            .find('h2')
            .after(appendBugTemplateButton())
            .after(fillBugTemplateButton())
            .after(appendTicketTemplateButton())
            .after(fillTicketTemplateButton());
    });

    function fillTicketTemplateButton() {
        var btn = getButton("Fill Ticket Template");
        btn.onclick = () => {
            replaceDescription(getTicketTemplate());
            fillTrackerChange();
            fillMoscow();
        };
        return btn;
    }

    function appendTicketTemplateButton() {
        var btn = getButton("Append Ticket Template");
        btn.onclick = () => {
            appendDescription(getTicketTemplate());
            fillTrackerChange();
            fillMoscow();
        };
        return btn;
    }

    function fillBugTemplateButton() {
        var btn = getButton("Fill Bug Template");
        btn.onclick = () => {
            replaceDescription(getBugTemplate());
            fillTrackerBug();
            fillMoscow();
        };
        return btn;
    }

    function appendBugTemplateButton() {
        var btn = getButton("Append Bug Template");
        btn.onclick = () => {
            appendDescription(getBugTemplate());
            fillTrackerBug();
            fillMoscow();
        };
        return btn;
    }

    function getButton(label){
        var btn = document.createElement("button");
        btn.style.cssText = "margin:0 5px 5px 0;";
        btn.innerHTML = label;
        return btn;
    }

    function replaceDescription(content){
        var descripton = $('#issue_description');
        descripton.css("height","375px");
        descripton.val(content);
    }

    function appendDescription(content){
        var descripton = $('#issue_description');
        descripton.css("height","375px");
        descripton.val(descripton.val() + "\n\n" + content)
    }

    function fillMoscow(){
        var moscow = $('#issue_custom_field_values_65');
        if(!moscow.val()){
            moscow.val("(C)ould have");
        }
    }

    function fillTrackerBug(){
        fillTracker(1);
    }

    function fillTrackerChange(){
        fillTracker(2);
    }

    function fillTracker(trackerTypeId){
        var tracker = $('#issue_tracker_id');
        tracker.val(trackerTypeId);
    }

    function getTicketTemplate(){
        return '*Description*\n\n'
            + '(description)\n\n'
            + '*Requirement*\n'
            + '*Als* (persoon)\n'
            + '*Wil ik* (doel)\n'
            + '*Zodat* (reden)\n\n'
            + '*Acceptance Criteria*\n\n'
            + '* (Criteria A)\n'
            + '* (Criteria B)\n'
            + '* (Criteria C)\n'
            + '* DoD - Browser compatibel ( Chrome, Firefox, Edge, Safari )\n'
            + '* DoD - Device compatibel ( mobiel, desktop en tablet )\n'
            + '* DoD - Multilingual compatibel ( Nederlands, Frans )\n'
            + '* DoD - Testing\n'
            + '* DoD - Logging\n'
            + '* DoD - Documentatie\n'
            + '* DoD - Release Notes ( Content Changes, Translation keys, Deployment Steps )\n\n'
            + '*Test Scenario*\n\n# (Stap 1)\n'
            + '# (Stap 2)\n'
            + '# (Stap 3)\n'
            + '# (Gewenst Resultaat A)\n\n'
            + '*Technical Details*\n\n'
            + '(technical details)\n\n'
            + '*Impact IT Environment*\n\n'
            + '* Impact SAP (Yes/No)\n'
            + '* Impact MDM (Yes/No)\n'
            + '* Impact SDP (Yes/No)\n'
            + '* Impact HPS (Yes/No)\n'
            + '* Impact Pimalion (Yes/No)'
    }

    function getBugTemplate(){
        return '*Description*\n\n'
            + 'Ongewenst gedrag gevonden in functionaliteit beschreven in (ticketlink)\n\n'
            + '(description)\n\n'
            + '*Acceptance Criteria*\n\n'
            + '* (Criteria A)\n'
            + '* (Criteria B)\n'
            + '* (Criteria C)\n\n'
            + '*Test Scenario*\n\n# (Stap 1)\n'
            + '# (Stap 2)\n'
            + '# (Stap 3)\n'
            + '# (Huidige Resultaat A)\n'
            + '# (Gewenst Resultaat B)\n\n'
            + '*Technical Details*\n\n'
            + '(technical details)\n\n'
    }
})();
