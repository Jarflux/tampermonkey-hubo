// ==UserScript==
// @name         Azure DevOps - Projects view
// @namespace    https://tampermonkey.net/
// @version      1.0
// @author       Ben Oeyen
// @description  Azure Boards - Project view cards sorted alphabetically by label
// @match        https://dev.azure.com/hubo-be*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://az-icons.com/
// @downloadURL  https://github.com/Jarflux/tampermonkey-hubo/raw/master/azure-boards-projects-view.js
// @updateURL    https://github.com/Jarflux/tampermonkey-hubo/raw/master/azure-boards-projects-view.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let isCurrentlySorting = false;

    function findProjectListContainer() {
        return document.querySelector('.mru-projects ul.suite-project-list');
    }

    function getAllProjectCardElements(container) {
        return Array.from(container.querySelectorAll('li.project-card'));
    }

    function extractProjectNameFromCard(cardElement) {
        return cardElement
            .querySelector('.project-name')
            ?.innerText.trim().toLowerCase() || '';
    }

    function createSortedProjectCardList(projectCards) {
        return [...projectCards].sort((cardA, cardB) => {
            const nameA = extractProjectNameFromCard(cardA);
            const nameB = extractProjectNameFromCard(cardB);
            return nameA.localeCompare(nameB);
        });
    }

    function extractProjectNameOrder(projectCards) {
        return projectCards.map(extractProjectNameFromCard);
    }

    function isCurrentOrderAlreadySorted(currentCards, sortedCards) {
        const currentOrder = extractProjectNameOrder(currentCards);
        const sortedOrder = extractProjectNameOrder(sortedCards);
        return JSON.stringify(currentOrder) === JSON.stringify(sortedOrder);
    }

    function applySortedOrderToDom(container, sortedCards) {
        sortedCards.forEach(card => container.appendChild(card));
    }

    function sortProjectCardsIfNeeded() {
        if (isCurrentlySorting) return;

        const container = findProjectListContainer();
        if (!container) return;

        const currentCards = getAllProjectCardElements(container);
        if (currentCards.length === 0) return;

        const sortedCards = createSortedProjectCardList(currentCards);

        if (isCurrentOrderAlreadySorted(currentCards, sortedCards)) {
            return;
        }

        isCurrentlySorting = true;
        applySortedOrderToDom(container, sortedCards);
        isCurrentlySorting = false;
    }

    function runSortingAfterInitialPageLoad() {
        window.addEventListener('load', () => {
            setTimeout(sortProjectCardsIfNeeded, 1000);
        });
    }

    function observeDomChangesAndResortWhenNeeded() {
        const observer = new MutationObserver(() => {
            if (!isCurrentlySorting) {
                sortProjectCardsIfNeeded();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function initializeProjectSortingScript() {
        runSortingAfterInitialPageLoad();
        observeDomChangesAndResortWhenNeeded();
    }

    initializeProjectSortingScript();

})();