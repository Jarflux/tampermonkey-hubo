// ==UserScript==
// @name         Redmine - Agile Dashboard Buttons
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Redmine - Add links to preset filters
// @author       Ben Oeyen
// @match        https://redmine.hubo.be/projects/omnichannel-hubomat/agile/board*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hubo.be
// @downloadURL  https://github.com/Jarflux/tampermonkey-hubo/raw/master/redmine-agile-board-buttons.js
// @updateURL    https://github.com/Jarflux/tampermonkey-hubo/raw/master/redmine-agile-board-buttons.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    $(document).ready(function () {
        colorAllTickets();
        $('#content')
            .find('h2')
            .after(createOverviewButton('Hybris', 'Omnichannel: Hybris'))
            .after(createOverviewButton('Frontend', 'Omnichannel: Front-end'))
            .after(createOverviewButton('Devops', 'Omnichannel: DevOps'))
            .after(createOverviewButton('Cloud', 'Omnichannel: Cloud'))
            .after(createOverviewButton('AEM', 'Omnichannel: AEM'));
    });

    function createOverviewButton(buttonName, team) {
        var btn = getButton(buttonName + " overview");
        btn.onclick = () => {
            location.href = 'https://redmine.hubo.be/projects/omnichannel-hubomat/agile/board?utf8=%E2%9C%93&set_filter=1&f%5B%5D=status_id&op%5Bstatus_id%5D=%3D&v%5Bstatus_id%5D%5B%5D=12&v%5Bstatus_id%5D%5B%5D=15&v%5Bstatus_id%5D%5B%5D=26&v%5Bstatus_id%5D%5B%5D=10&v%5Bstatus_id%5D%5B%5D=3&f%5B%5D=cf_62&op%5Bcf_62%5D=%3D&v%5Bcf_62%5D%5B%5D='
                + team
                + '&f%5B%5D=&c%5B%5D=tracker&c%5B%5D=assigned_to&c%5B%5D=cf_65&group_by=priority&color_base=none';
        };
        return btn;
    }

    function getButton(label){
        var btn = document.createElement("button");
        btn.style.cssText = "margin:0 5px 5px 0;";
        btn.innerHTML = label;
        return btn;
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
