function centerDiv(selector) {
    // Das gewünschte Div anhand des Selectors auswählen
    const div = document.querySelector(selector);

    if (!div) {
        console.error("Element nicht gefunden!");
        return;
    }

    // Funktion, um alle Vorfahren eines Elements zu ermitteln
    function getAncestors(element) {
        const ancestors = [];
        let currentElement = element;
        while (currentElement.parentElement) {
            ancestors.push(currentElement.parentElement);
            currentElement = currentElement.parentElement;
        }
        return ancestors;
    }

    // Alle Vorfahren des zentrierten Divs ermitteln
    const ancestors = getAncestors(div);

    // Alles außer dem ausgewählten Div und seinen Vorfahren ausblenden
    document.body.style.overflow = 'hidden'; // verhindert das Scrollen
    Array.from(document.body.children).forEach(child => {
        if (child !== div && !ancestors.includes(child)) {
            child.style.display = 'none';
        }
    });

    // Fenster- und Div-Abmessungen abrufen
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const divWidth = div.offsetWidth;
    const divHeight = div.offsetHeight;

    // Position berechnen
    const leftPosition = (windowWidth - divWidth) / 2;
    const topPosition = (windowHeight - divHeight) / 2;

    // Sicherstellen, dass das Div absolut positioniert ist
    div.style.position = 'absolute';
    div.style.left = `${leftPosition}px`;
    div.style.top = `${topPosition}px`;

    // Das Div sichtbar machen, falls es ausgeblendet war
    div.style.display = 'block';
}

// Das Div auch bei einer Größenänderung des Fensters zentrieren
centerDiv('#task-container-8695efnv4 > div.cu-task-row__main, #task-container-8695efnv4 > cu-task-row-assignee > cu-user-list-dropdown > div > div > cu-user-group > cu-avatar-group > div > div.cu-avatar.cu-avatar_28.cu-avatar_bordered.cu-avatar_initials.cu-avatar_lg.ng-star-inserted');

window.addEventListener('resize', () => centerDiv('#task-container-8695efnv4 > div.cu-task-row__main,#task-container-8695efnv4 > cu-task-row-assignee > cu-user-list-dropdown > div > div > cu-user-group > cu-avatar-group > div > div.cu-avatar.cu-avatar_28.cu-avatar_bordered.cu-avatar_initials.cu-avatar_lg.ng-star-inserted'));