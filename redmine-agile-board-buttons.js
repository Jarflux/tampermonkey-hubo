// ==UserScript==
// @name         Redmine - Agile Dashboard Buttons
// @namespace    http://tampermonkey.net/
// @version      0.5
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
                + '&f%5B%5D=&c%5B%5D=tracker&c%5B%5D=assigned_to&c%5B%5D=cf_65&group_by=priority&color_base=tracker'
        };
        return btn;
    }

    function getButton(label){
        var btn = document.createElement("button");
        btn.style.cssText = "margin:0 5px 5px 0;";
        btn.innerHTML = label;
        return btn;
    }

})();
