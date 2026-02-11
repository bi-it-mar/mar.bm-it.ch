function clearHighlights() {
    const highlightedElements = document.querySelectorAll('.highlight');
    highlightedElements.forEach((element) => {
        const parent = element.parentNode;
        parent.replaceChild(document.createTextNode(element.textContent), element);
    });
}

function highlightText(searchTerm) {
    clearHighlights();

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    let found = false;

    function traverseAndHighlight(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const parts = node.nodeValue.split(regex);
            if (parts.length > 1) {
                const span = document.createElement('span');

                parts.forEach((part) => {
                    if (part.match(regex)) {
                        const highlightedSpan = document.createElement('span');
                        highlightedSpan.className = 'highlight';
                        highlightedSpan.textContent = part;
                        span.appendChild(highlightedSpan);
                        found = true;
                    } else {
                        span.appendChild(document.createTextNode(part));
                    }
                });

                const parent = node.parentNode;
                parent.replaceChild(span, node);
            }
        } else {
            for (let i = 0; i < node.childNodes.length; i++) {
                traverseAndHighlight(node.childNodes[i]);
            }
        }
    }

    traverseAndHighlight(document.body);

    if (found) {
        const firstHighlight = document.querySelector('.highlight');
        if (firstHighlight) {
            firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

document.querySelector('.search-bar').addEventListener('submit', function(event) {
    event.preventDefault();
    const searchInput = this.querySelector('input[name="search"]');
    const searchTerm = searchInput.value.trim();

    if (searchTerm) {
        highlightText(searchTerm);
    }
});

// Listen for input changes to clear highlights when the input is cleared
document.querySelector('input[name="search"]').addEventListener('input', function() {
    const searchTerm = this.value.trim();
    if (!searchTerm) {
        clearHighlights(); // If the input is cleared, remove the highlights
    }
});

// Listen for the Escape key press to clear the search
document.querySelector('input[name="search"]').addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        this.value = ''; // Clear the search input
        clearHighlights(); // Remove any highlights
    }
});

const selfieImg = document.getElementById('toggle-selfie');
let isSelfie = true;

function toggleImage() {
    selfieImg.style.opacity = 0;
    setTimeout(() => {
        selfieImg.src = isSelfie ? 'unknown_person.jpg' : 'selfie.PNG';
        selfieImg.style.opacity = 1;
        isSelfie = !isSelfie;
    }, 300);
}

selfieImg.addEventListener('mouseenter', toggleImage);
selfieImg.addEventListener('mouseleave', toggleImage);
