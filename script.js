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

/* --- Fullscreen Matrix / Regenschauer Implementation (mobil-optimiert) --- */
(function() {
    const overlay = document.getElementById('matrix-overlay');
    const canvas = document.getElementById('matrix-overlay-canvas');
    const toggleBtn = document.getElementById('rain-toggle');

    if (!overlay || !canvas || !toggleBtn) return;

    const ctx = canvas.getContext('2d');
    let animationId = null;
    let running = false;

    // dynamische Einstellungen (werden in resizeCanvasFull gesetzt)
    let fontSize = 16;
    let characters = 'abcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()-+=';
    let columns = 0;
    let drops = [];

    // FPS-Drossel für mobile
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;
    let lastFrameTime = 0;

    function resizeCanvasFull() {
        const ratio = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;

        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);

        // Reset transform then scale for high DPI
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(ratio, ratio);

        // mobile-friendly font size and character set
        if (width <= 480) {
            fontSize = 12; // kleiner auf Handys
            // weniger und klarere Zeichen für bessere Lesbarkeit & Performance
            characters = '0123456789abcdefghijklmnopqrstuvwxyz';
        } else if (width <= 768) {
            fontSize = 14;
            characters = '0123456789abcdefghijklmnopqrstuvwxyz@#';
        } else {
            fontSize = 16;
            characters = 'abcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()-+=';
        }

        columns = Math.floor(width / fontSize) + 1;
        drops = new Array(columns).fill(1);
    }

    function drawFrame(time) {
        // time ist vom requestAnimationFrame
        if (!lastFrameTime) lastFrameTime = time;
        const delta = time - lastFrameTime;
        if (delta < FRAME_INTERVAL) {
            animationId = requestAnimationFrame(drawFrame);
            return;
        }
        lastFrameTime = time;

        const width = window.innerWidth;
        const height = window.innerHeight;

        // Trail-Effekt: auf mobilen Geräten etwas stärker decken, um weniger Spuren zu haben
        const alpha = (width <= 480) ? 0.12 : 0.06;
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
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

        animationId = requestAnimationFrame(drawFrame);
    }

    function startRain() {
        if (running) return;
        resizeCanvasFull();
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');

        // mobile: Verhindere Scrollen, aber nur wenn Overlay sichtbar
        document.body.style.overflow = 'hidden';
        toggleBtn.textContent = 'Stop Regenschauer';
        running = true;
        lastFrameTime = 0;
        animationId = requestAnimationFrame(drawFrame);
    }

    function stopRain() {
        if (!running) return;
        running = false;
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // restore scrolling
        toggleBtn.textContent = 'Regenschauer';
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        ctx.setTransform(1,0,0,1,0,0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    toggleBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        if (running) stopRain();
        else startRain();
    });

    // Touch: Tap Overlay zum Stoppen (verhindert versehentliches Scrollen)
    overlay.addEventListener('touchstart', function(e) {
        e.preventDefault(); // Overlay-interaktion — tap beendet Regen
        if (running) stopRain();
    }, { passive: false });

    // Klick auf Overlay auch stoppen
    overlay.addEventListener('click', function(e) {
        if (running) stopRain();
    });

    // Escape darf stoppen
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && running) stopRain();
    });

    // Bei OrientationChange / Resize neu berechnen
    let resizeTimer = null;
    window.addEventListener('resize', function() {
        if (!running) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resizeCanvasFull();
        }, 150);
    });
    window.addEventListener('orientationchange', function() {
        if (!running) return;
        setTimeout(resizeCanvasFull, 200);
    });

    // Tab versteckt -> Stoppen zur CPU-/Battery-Ersparnis
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && running) stopRain();
    });

    toggleBtn.addEventListener('touchend', function(event) {
        // Mobile: verhindere Doppelauslösung (touch + click)
        event.preventDefault();
        event.stopPropagation();
        // optional: Debug-Ausgabe, entferne später wieder
        console.log('rain-toggle touchend (mobile)');
        if (running) stopRain();
        else startRain();
    }, { passive: false });

})();
