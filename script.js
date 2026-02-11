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

/* --- Matrix / Regenschauer Implementation --- */
(function() {
    const canvas = document.getElementById('matrix-canvas');
    const container = document.getElementById('matrix-container');
    const toggleBtn = document.getElementById('rain-toggle');

    if (!canvas || !container || !toggleBtn) return;

    const ctx = canvas.getContext('2d');
    let animationId = null;
    let running = false;

    // Settings
    const fontSize = 14;
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()*&^%';
    let columns = 0;
    let drops = [];

    function resizeCanvas() {
        const ratio = window.devicePixelRatio || 1;
        const width = container.clientWidth;
        const height = container.clientHeight;

        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);

        ctx.scale(ratio, ratio);

        columns = Math.floor(width / fontSize);
        drops = new Array(columns).fill(1);
    }

    function draw() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        // slight transparent black to create trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#00FF41';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            ctx.fillText(text, x, y);

            if (y > height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }

        animationId = requestAnimationFrame(draw);
    }

    function startRain() {
        if (running) return;
        resizeCanvas();
        running = true;
        container.setAttribute('aria-hidden', 'false');
        toggleBtn.textContent = 'Stop Regenschauer';
        animationId = requestAnimationFrame(draw);
    }

    function stopRain() {
        running = false;
        container.setAttribute('aria-hidden', 'true');
        toggleBtn.textContent = 'Regenschauer';
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        // clear canvas when stopped
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    toggleBtn.addEventListener('click', function() {
        if (running) stopRain();
        else startRain();
    });

    // Responsive
    let resizeTimer = null;
    window.addEventListener('resize', function() {
        if (!running) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // reset canvas scaling and arrays
            ctx.setTransform(1,0,0,1,0,0);
            resizeCanvas();
        }, 150);
    });

    // Optional: stop rain when navigating away to avoid background CPU usage
    window.addEventListener('visibilitychange', function() {
        if (document.hidden && running) {
            stopRain();
        }
    });
})();
