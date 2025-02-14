// ==UserScript==
// @name         Redmine - Agile Dashboard Buttons
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Redmine - Add links to preset filters
// @author       Ben Oeyen
// @match        https://redmine.hubo.be/projects/*/agile/board*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hubo.be
// @downloadURL  https://github.com/Jarflux/tampermonkey-hubo/raw/master/redmine-agile-board-buttons.js
// @updateURL    https://github.com/Jarflux/tampermonkey-hubo/raw/master/redmine-agile-board-buttons.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    $(document).ready(function () {
        if(isMoscowEnabled() && isColoringOptionNone()){
            colorAllTickets();
        }
        $('#content')
            .find('h2')
            .after(createOverviewButton('App Betatest', 'huboapp', null))
            .after(createOverviewButton('Unlockd', 'omnichannel-hubomat', 'Unlockd'))
            .after(createOverviewButton('Hybris', 'omnichannel-hubomat', 'Omnichannel: Hybris'))
            .after(createOverviewButton('Frontend', 'omnichannel-hubomat', 'Omnichannel: Front-end'))
            .after(createOverviewButton('Devops', 'omnichannel-hubomat', 'Omnichannel: DevOps'))
            .after(createOverviewButton('Cloud', 'omnichannel-hubomat', 'Omnichannel: Cloud'))
            .after(createOverviewButton('AEM', 'omnichannel-hubomat', 'Omnichannel: AEM'))
            .after(createOverviewButton('All Teams', 'omnichannel-hubomat', null));
    });

    function createOverviewButton(buttonName, project, team) {
        var btn = getButton(buttonName + " overview");
        btn.onclick = () => {
            var url = 'https://redmine.hubo.be/projects/' + project + '/agile/board?utf8=✓&set_filter=1&f[]=status_id&op[status_id]==&v[status_id][]=12&v[status_id][]=15&v[status_id][]=26&v[status_id][]=10&v[status_id][]=3&v[status_id][]=4&f[]='
            if (team) {
                url = url + 'cf_62&op[cf_62]==&v[cf_62][]=' + team + '&f[]='
            }
            location.href = url + '&c[]=tracker&c[]=assigned_to&c[]=cf_65&group_by=priority&color_base=none';
        };
        return btn;
    }

    function getButton(label){
        var btn = document.createElement("button");
        btn.style.cssText = "margin:0 5px 5px 0;";
        btn.innerHTML = label;
        return btn;
    }

    function isMoscowEnabled(){
        return $(":checkbox[value=cf_65]").is(":checked") && $( "#color_base option:selected" ).val()==="none";
    }

    function isColoringOptionNone(){
        return $("#color_base option:selected").val()==="none";
    }

    function colorAllTickets(){
        var slides = document.getElementsByClassName("issue-card");
        for (var i = 0; i < slides.length; i++) {
            colorTicket(slides.item(i));
        }
    }

    function colorTicket(ticket){
        var moscow = ticket.querySelector(".attributes").textContent;

        // Default color without MoSCoW
        setColor(ticket, "rgb(255, 255, 255)", "rgb(3, 148, 215)"); // White

        if(moscow.includes("(W)on't have")){
            setColor(ticket, "rgb(127, 190, 89, 0.3)", "rgb(127, 190, 89)"); // Green
        }
        if(moscow.includes("(C)ould have")){
            setColor(ticket, "rgb(249, 216, 29, 0.3)", "rgb(249, 216, 29)"); // Yellow
        }
        if(moscow.includes("(S)hould have")){
            setColor(ticket, "rgb(253, 159, 52, 0.4)", "rgb(253, 159, 52)"); // Orange
        }
        if(moscow.includes("(M)ust have")){
            setColor(ticket, "rgb(250, 81, 69, 0.4)", "rgb(250, 81, 69)"); // Red
        }
    }

    function setColor(ticket, bgColor, borderColor){
        ticket.style.cssText = "background-color: " + bgColor + "; border-color: " + borderColor;
    }

})();
