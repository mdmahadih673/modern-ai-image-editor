/* ============================================================
   APP STATE
============================================================ */
const App = {
    apiKey: '',
    currentImageBase64: '',
    currentMimeType: 'image/jpeg',
    editedImageBase64: '',
    isProcessing: false,
    history: [],
    selectedModel: 'gemini-2.0-flash-preview-image-generation',
    theme: 'dark',
};

/* ============================================================
   PROMPT LIBRARY
============================================================ */
const PROMPTS = {
    default: `Create a professional cinematic editorial photo edit from the uploaded image using a realistic high-end photography style. The image should look like it was captured on a Sony full-frame camera with an 85mm f/1.4 lens at f/1.6 aperture. Apply an extremely shallow depth of field with strong creamy cinematic bokeh and heavily blurred soft background while keeping the subject's face and eyes tack-sharp and highly detailed.

Use soft directional key lighting with warm cinematic highlights and cool teal-toned shadows. Apply a premium modern cinematic color grade inspired by high-end editorial photography and modern iPhone photography aesthetics. The final image should feel bright, clean, natural, luxurious, and visually immersive without looking overprocessed.

Maintain true-to-life skin tones and preserve natural skin texture, pores, and facial details. Perform only subtle professional editorial retouching: gently even out skin tone, remove temporary blemishes/redness only, slightly reduce under-eye darkness naturally, keep pores and realistic texture intact, avoid airbrushing completely.

Add a soft luminous facial glow from the key light with subtle controlled highlight bloom on the forehead and cheekbones. Ensure rich dynamic range, filmic contrast, deep but soft blacks, clean whites, smooth highlight roll-off, subtle film grain, and ultra-clear 4K quality.

IMPORTANT: Preserve identity exactly. Do NOT change facial structure. Do NOT reshape face. Do NOT alter eyes, nose, lips, jawline, or hairstyle unless requested. No beauty filter look. No plastic/waxy skin. No HDR look. No oversharpening. No heavy saturation. No extreme teal-orange grading. No halos. No artifacts. No cartoon or CGI appearance. Keep everything realistic and natural.

Make the photo brighter, cleaner, and more premium like modern iPhone portrait photography. Enhance lighting and cinematic atmosphere professionally. Keep the overall aesthetic elegant, cinematic, soft, realistic, and editorial-quality.`,

    cinematic: `Apply a premium cinematic editorial grade: Sony A7R IV 85mm f/1.6, creamy bokeh, soft directional key light, warm highlights, cool teal shadows, subtle film grain, rich dynamic range, filmic contrast, editorial-quality retouching, natural skin tones, no airbrushing. Final look: bright, clean, luxurious, immersive.`,

    portrait: `Professional portrait enhancement: studio-quality soft box lighting, clean background separation with natural bokeh, precise skin retouching (even tone, no airbrushing, preserve texture), eyes sharp and luminous, soft catchlights, gentle highlight bloom. Aesthetic: clean, professional, modern editorial.`,

    neon: `Transform this image with a futuristic neon cyberpunk aesthetic: vivid neon pink, cyan, and purple rim lighting against a dark background, lens flare accents, cinematic fog/haze, high contrast moody shadows, electric atmosphere, subtle chromatic aberration, ultra-sharp subject, stunning visual depth.`,

    vintage: `Apply a cinematic film vintage look: Kodak Portra 400 emulation, warm golden-orange cast with lifted shadows, natural film grain, soft vignette, slightly desaturated highlights, organic lens imperfections, slight halation around lights, nostalgic 1970s editorial warmth, analogue photo texture.`,

    studio: `Professional studio portrait lighting: dramatic three-point lighting setup with a strong key light from 45 degrees, subtle fill reducing contrast, clean white or dark grey seamless backdrop, hair light for separation, controlled catch lights in eyes, commercial advertising quality, clean and polished.`,

    hdr: `Apply dramatic HDR enhancement: maximized local contrast and texture, deep punchy colors, rich cloud/sky detail, powerful shadow recovery, bright luminous highlights with smooth roll-off, ultra-detailed surfaces, vivid but not oversaturated, professional landscape/architectural photography quality.`,

    bw: `Convert to stunning black and white fine art: high contrast classic silver gelatin look, deep rich blacks, luminous whites, beautiful grey midtones, pronounced skin texture and facial detail, subtle film grain, ansel adams inspired tonal range, elegant and timeless aesthetic.`,

    golden: `Golden hour photography magic: warm orange-amber sunlight from low angle, long soft shadows, glowing skin with warm backlight, subtle lens flare, rich golden bokeh in background, dreamy romantic atmosphere, lifted shadows with warm shadows, soft haze, lifestyle editorial quality.`,
};

/* ============================================================
   DOM ELEMENTS
============================================================ */
const DOM = {
    authPage: document.getElementById('auth-page'),
    dashboardPage: document.getElementById('dashboard-page'),
    apiKeyInput: document.getElementById('api-key-input'),
    saveApiBtn: document.getElementById('save-api-btn'),
    authBtnText: document.getElementById('auth-btn-text'),
    toggleVisibility: document.getElementById('toggle-visibility'),
    eyeIcon: document.getElementById('eye-icon'),
    typingText: document.getElementById('typing-text'),

    uploadZone: document.getElementById('upload-zone'),
    imageInput: document.getElementById('image-input'),
    uploadBtn: document.getElementById('upload-btn'),
    originalPreview: document.getElementById('original-preview'),
    originalPlaceholder: document.getElementById('original-placeholder'),
    editedPreview: document.getElementById('edited-preview'),
    editedPlaceholder: document.getElementById('edited-placeholder'),
    loadingOverlay: document.getElementById('loading-overlay'),
    loadingProgress: document.getElementById('loading-progress'),

    promptTextarea: document.getElementById('prompt-textarea'),
    charCount: document.getElementById('char-count'),
    copyPromptBtn: document.getElementById('copy-prompt-btn'),
    useDefaultBtn: document.getElementById('use-default-btn'),
    chipsContainer: document.getElementById('chips-container'),

    generateBtn: document.getElementById('generate-btn'),
    generateIcon: document.getElementById('generate-icon'),
    generateText: document.getElementById('generate-text'),
    downloadBtn: document.getElementById('download-btn'),
    resetBtn: document.getElementById('reset-btn'),

    comparisonWrap: document.getElementById('comparison-wrap'),
    comparisonPlaceholder: document.getElementById('comparison-placeholder'),
    compBefore: document.getElementById('comp-before'),
    compAfter: document.getElementById('comp-after'),
    compAfterWrap: document.getElementById('comp-after-wrap'),
    compDivider: document.getElementById('comp-divider'),

    historyGrid: document.getElementById('history-grid'),
    clearHistoryBtn: document.getElementById('clear-history-btn'),

    themeToggle: document.getElementById('theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    navDisconnect: document.getElementById('nav-disconnect'),
    apiStatusIndicator: document.getElementById('api-status-indicator'),
    toastContainer: document.getElementById('toast-container'),

    zoomModal: document.getElementById('zoom-modal'),
    zoomImg: document.getElementById('zoom-img'),
    zoomClose: document.getElementById('zoom-close'),
    zoomOriginal: document.getElementById('zoom-original'),
    zoomEdited: document.getElementById('zoom-edited'),

    modelSelector: document.getElementById('model-selector'),
    editStrength: document.getElementById('edit-strength'),
    strengthVal: document.getElementById('strength-val'),
};

/* ============================================================
   TYPING ANIMATION
============================================================ */
function startTypingAnimation() {
    const texts = ['Cinematic AI Studio.', 'Your Creative Vision.', 'Premium Photo Editing.'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];
        if (!isDeleting) {
            DOM.typingText.textContent = currentText.slice(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentText.length) {
                setTimeout(() => { isDeleting = true; type(); }, 2200);
                return;
            }
        } else {
            DOM.typingText.textContent = currentText.slice(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
        }
        setTimeout(type, isDeleting ? 45 : 85);
    }
    type();
}

/* ============================================================
   PARTICLES
============================================================ */
function createParticles() {
    const count = window.innerWidth < 768 ? 8 : 15;
    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'particle';
        const size = Math.random() * 4 + 1;
        el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 20 + 15}s;
      animation-delay: ${Math.random() * 20}s;
      opacity: ${Math.random() * 0.5 + 0.1};
      background: ${['rgba(139,92,246,0.4)', 'rgba(59,130,246,0.4)', 'rgba(6,182,212,0.4)', 'rgba(236,72,153,0.3)'][Math.floor(Math.random() * 4)]};
    `;
        document.body.appendChild(el);
    }
}

/* ============================================================
   TOAST SYSTEM
============================================================ */
function showToast(type, title, message, duration = 4000) {
    const icons = {
        success: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>`,
        error: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`,
        info: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg>`,
        warning: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/></svg>`,
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.info}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      ${message ? `<div class="toast-msg">${message}</div>` : ''}
    </div>
  `;

    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 350);
    }, duration);
}

/* ============================================================
   THEME TOGGLE
============================================================ */
function toggleTheme() {
    App.theme = App.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', App.theme);
    localStorage.setItem('aura_theme', App.theme);
    updateThemeIcon();
}

function updateThemeIcon() {
    if (App.theme === 'light') {
        DOM.themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/>`;
    } else {
        DOM.themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>`;
    }
}

/* ============================================================
   AUTH SYSTEM
============================================================ */
function showAuthPage() {
    DOM.dashboardPage.classList.remove('active');
    DOM.authPage.classList.add('active');
    startTypingAnimation();
}

function showDashboard() {
    DOM.authPage.classList.remove('active');
    DOM.dashboardPage.classList.add('active');
}

async function saveApiKey() {
    const key = DOM.apiKeyInput.value.trim();
    if (!key) {
        showToast('error', 'API Key Required', 'Please enter your Gemini API key.');
        DOM.apiKeyInput.focus();
        return;
    }
    if (!key.startsWith('AI') && !key.startsWith('ai') && key.length < 20) {
        showToast('warning', 'Invalid Format', 'Please enter a valid Gemini API key starting with "AI".');
        return;
    }

    DOM.authBtnText.textContent = 'Verifying key...';
    DOM.saveApiBtn.disabled = true;

    // Quick test
    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
            { signal: AbortSignal.timeout(8000) }
        );
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err?.error?.message || 'Invalid API key');
        }
    } catch (e) {
        if (e.name === 'TimeoutError' || e.name === 'AbortError') {
            // Network issue - proceed anyway
        } else if (e.message && e.message.toLowerCase().includes('api key')) {
            DOM.authBtnText.textContent = 'Save API Key & Enter Studio';
            DOM.saveApiBtn.disabled = false;
            showToast('error', 'Invalid API Key', e.message);
            return;
        }
    }

    App.apiKey = key;
    localStorage.setItem('aura_api_key', key);
    showToast('success', 'API Key Saved!', 'Welcome to AuraLens AI Studio. Your key is stored locally.');

    setTimeout(() => {
        showDashboard();
        DOM.authBtnText.textContent = 'Save API Key & Enter Studio';
        DOM.saveApiBtn.disabled = false;
    }, 800);
}

/* ============================================================
   IMAGE HANDLING
============================================================ */
function handleImageFile(file) {
    if (!file || !file.type.startsWith('image/')) {
        showToast('error', 'Invalid File', 'Please upload a valid image file.');
        return;
    }

    const maxSize = 15 * 1024 * 1024; // 15MB
    if (file.size > maxSize) {
        showToast('warning', 'File Too Large', 'Please upload an image under 15MB.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const result = e.target.result;
        const base64 = result.split(',')[1];
        App.currentImageBase64 = base64;
        App.currentMimeType = file.type;

        DOM.originalPreview.src = result;
        DOM.originalPreview.classList.add('loaded');
        DOM.originalPlaceholder.style.display = 'none';

        DOM.generateBtn.disabled = false;
        showToast('success', 'Image Loaded!', `${file.name} — ready for AI editing.`);

        // Reset edited state
        DOM.editedPreview.classList.remove('loaded');
        DOM.editedPreview.src = '';
        DOM.editedPlaceholder.style.display = 'flex';
        App.editedImageBase64 = '';
        DOM.downloadBtn.disabled = true;
        DOM.comparisonWrap.classList.remove('active');
        DOM.comparisonPlaceholder.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

/* ============================================================
   LOADING ANIMATION
============================================================ */
const loadingMessages = [
    'Analyzing image composition...',
    'Applying cinematic color grade...',
    'Enhancing lighting & shadows...',
    'Adding bokeh depth of field...',
    'Refining skin tone & texture...',
    'Adding film grain & contrast...',
    'Finalizing AI masterpiece...',
];

let loadingMsgInterval;

function startLoadingAnimation() {
    let i = 0;
    DOM.loadingProgress.textContent = loadingMessages[0];
    loadingMsgInterval = setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        DOM.loadingProgress.textContent = loadingMessages[i];
    }, 2200);
}

function stopLoadingAnimation() {
    clearInterval(loadingMsgInterval);
}

/* ============================================================
   AI GENERATION
============================================================ */
async function generateAIEdit() {
    if (!App.currentImageBase64) {
        showToast('error', 'No Image', 'Please upload an image first.');
        return;
    }
    if (App.isProcessing) return;

    const prompt = DOM.promptTextarea.value.trim() || PROMPTS.default;
    const strength = DOM.editStrength.value;
    const fullPrompt = `${prompt}\n\nEdit Strength Level: ${strength}/10 — apply with proportional intensity. Return ONLY the edited image with no text or description.`;

    App.isProcessing = true;
    DOM.generateBtn.disabled = true;
    DOM.generateIcon.style.display = 'none';
    DOM.generateText.textContent = 'Generating...';

    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.id = 'gen-spinner';
    DOM.generateBtn.insertBefore(spinner, DOM.generateText);

    DOM.loadingOverlay.classList.add('active');
    DOM.editedPlaceholder.style.display = 'none';
    startLoadingAnimation();

    const API_MODELS = [
        App.selectedModel,
        'gemini-2.0-flash-preview-image-generation',
        'gemini-2.0-flash',
    ];

    let success = false;
    let lastError = '';

    for (const model of [...new Set(API_MODELS)]) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${App.apiKey}`;

            const body = {
                contents: [{
                    parts: [
                        {
                            inline_data: {
                                mime_type: App.currentMimeType,
                                data: App.currentImageBase64
                            }
                        },
                        { text: fullPrompt }
                    ]
                }],
                generationConfig: {}
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(120000),
            });

            if (!response.ok) {
                const errData = await response.json();
                lastError = errData?.error?.message || `HTTP ${response.status}`;
                continue;
            }

            const data = await response.json();
            const parts = data?.candidates?.[0]?.content?.parts || [];
            const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));

            if (!imagePart) {
                lastError = 'No image returned. The model may not support image generation. Try Flash 2.0.';
                continue;
            }

            App.editedImageBase64 = imagePart.inlineData.data;
            const editedSrc = `data:${imagePart.inlineData.mimeType};base64,${App.editedImageBase64}`;

            DOM.editedPreview.src = editedSrc;
            DOM.editedPreview.classList.add('loaded');
            DOM.editedPlaceholder.style.display = 'none';

            // Before/After
            DOM.compBefore.src = DOM.originalPreview.src;
            DOM.compAfter.src = editedSrc;
            DOM.comparisonPlaceholder.style.display = 'none';
            DOM.comparisonWrap.classList.add('active');

            DOM.downloadBtn.disabled = false;

            // Add to history
            addToHistory(editedSrc);

            showToast('success', 'AI Edit Complete!', 'Your cinematic masterpiece is ready. Scroll down to download.');
            success = true;
            break;

        } catch (err) {
            lastError = err.message || 'Network error';
            if (err.name === 'AbortError' || err.name === 'TimeoutError') {
                lastError = 'Request timed out. Please try again.';
                break;
            }
        }
    }

    if (!success) {
        showToast('error', 'Generation Failed', lastError || 'An unexpected error occurred. Please try again.');
        DOM.editedPlaceholder.style.display = 'flex';
    }

    // Reset button
    stopLoadingAnimation();
    DOM.loadingOverlay.classList.remove('active');
    App.isProcessing = false;
    DOM.generateBtn.disabled = !App.currentImageBase64;
    const existingSpinner = document.getElementById('gen-spinner');
    if (existingSpinner) existingSpinner.remove();
    DOM.generateIcon.style.display = '';
    DOM.generateText.textContent = 'Generate AI Edit';
}

/* ============================================================
   HISTORY
============================================================ */
function addToHistory(src) {
    App.history.unshift(src);
    if (App.history.length > 10) App.history.pop();
    renderHistory();
}

function renderHistory() {
    if (App.history.length === 0) {
        DOM.historyGrid.innerHTML = `
      <div class="history-empty">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        No edits yet. Generate your first AI edit!
      </div>`;
        return;
    }

    DOM.historyGrid.innerHTML = App.history.map((src, i) => `
    <div class="history-item" data-index="${i}" title="Click to view">
      <img src="${src}" alt="Edit ${i + 1}" loading="lazy" />
      <div class="history-overlay">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"/>
        </svg>
      </div>
    </div>
  `).join('');

    DOM.historyGrid.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.dataset.index);
            openZoom(App.history[idx]);
        });
    });
}

/* ============================================================
   DOWNLOAD
============================================================ */
function downloadImage() {
    if (!App.editedImageBase64) return;
    const a = document.createElement('a');
    a.href = `data:image/png;base64,${App.editedImageBase64}`;
    a.download = `auralens-ai-edit-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('success', 'Downloading!', 'Your HD cinematic edit is being saved.');
}

/* ============================================================
   RESET
============================================================ */
function resetEditor() {
    App.currentImageBase64 = '';
    App.currentMimeType = 'image/jpeg';
    App.editedImageBase64 = '';

    DOM.originalPreview.src = '';
    DOM.originalPreview.classList.remove('loaded');
    DOM.originalPlaceholder.style.display = 'flex';

    DOM.editedPreview.src = '';
    DOM.editedPreview.classList.remove('loaded');
    DOM.editedPlaceholder.style.display = 'flex';

    DOM.comparisonWrap.classList.remove('active');
    DOM.comparisonPlaceholder.style.display = 'block';

    DOM.generateBtn.disabled = true;
    DOM.downloadBtn.disabled = true;

    DOM.imageInput.value = '';
    DOM.promptTextarea.value = '';
    DOM.charCount.textContent = '0 / 2000';

    showToast('info', 'Editor Reset', 'Ready for a new image.');
}

/* ============================================================
   BEFORE/AFTER SLIDER
============================================================ */
function initComparisonSlider() {
    const container = document.getElementById('comparison-container');
    let isDragging = false;

    function setPosition(x) {
        const rect = container.getBoundingClientRect();
        let pct = (x - rect.left) / rect.width;
        pct = Math.max(0.02, Math.min(0.98, pct));
        const pctNum = pct * 100;
        DOM.compAfterWrap.style.clipPath = `inset(0 ${100 - pctNum}% 0 0)`;
        DOM.compDivider.style.left = `${pctNum}%`;
    }

    DOM.compDivider.addEventListener('mousedown', (e) => { isDragging = true; e.preventDefault(); });
    DOM.compDivider.addEventListener('touchstart', (e) => { isDragging = true; }, { passive: true });

    window.addEventListener('mousemove', (e) => { if (isDragging) setPosition(e.clientX); });
    window.addEventListener('touchmove', (e) => { if (isDragging && e.touches[0]) setPosition(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('touchend', () => { isDragging = false; });

    container.addEventListener('click', (e) => {
        if (!DOM.comparisonWrap.classList.contains('active')) return;
        setPosition(e.clientX);
    });
}

/* ============================================================
   ZOOM MODAL
============================================================ */
function openZoom(src) {
    DOM.zoomImg.src = src;
    DOM.zoomModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeZoom() {
    DOM.zoomModal.classList.remove('active');
    document.body.style.overflow = '';
}

/* ============================================================
   PROMPT CHIPS
============================================================ */
function setupChips() {
    DOM.chipsContainer.querySelectorAll('.prompt-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const key = chip.dataset.prompt;
            if (PROMPTS[key]) {
                DOM.promptTextarea.value = PROMPTS[key];
                updateCharCount();
                showToast('info', 'Prompt Applied', `"${chip.textContent.trim()}" style loaded.`);
            }
        });
    });
}

function updateCharCount() {
    const len = DOM.promptTextarea.value.length;
    DOM.charCount.textContent = `${len} / 2000`;
    if (len > 2000) DOM.promptTextarea.value = DOM.promptTextarea.value.slice(0, 2000);
}

/* ============================================================
   MODEL SELECTOR
============================================================ */
function setupModelSelector() {
    DOM.modelSelector.querySelectorAll('.model-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            DOM.modelSelector.querySelectorAll('.model-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            App.selectedModel = chip.dataset.model;
            showToast('info', 'Model Selected', `Using ${chip.textContent}`);
        });
    });
}

/* ============================================================
   EVENT LISTENERS
============================================================ */
function setupEventListeners() {
    // Auth
    DOM.saveApiBtn.addEventListener('click', saveApiKey);
    DOM.apiKeyInput.addEventListener('keypress', e => { if (e.key === 'Enter') saveApiKey(); });

    DOM.toggleVisibility.addEventListener('click', () => {
        const isPassword = DOM.apiKeyInput.type === 'password';
        DOM.apiKeyInput.type = isPassword ? 'text' : 'password';
        DOM.eyeIcon.innerHTML = isPassword
            ? `<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>`
            : `<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>`;
    });

    // Upload
    DOM.uploadBtn.addEventListener('click', () => DOM.imageInput.click());
    DOM.uploadZone.addEventListener('click', (e) => {
        if (e.target === DOM.uploadBtn || DOM.uploadBtn.contains(e.target)) return;
        DOM.imageInput.click();
    });
    DOM.imageInput.addEventListener('change', e => {
        if (e.target.files[0]) handleImageFile(e.target.files[0]);
    });

    DOM.uploadZone.addEventListener('dragover', e => {
        e.preventDefault();
        DOM.uploadZone.classList.add('drag-over');
    });
    DOM.uploadZone.addEventListener('dragleave', () => DOM.uploadZone.classList.remove('drag-over'));
    DOM.uploadZone.addEventListener('drop', e => {
        e.preventDefault();
        DOM.uploadZone.classList.remove('drag-over');
        if (e.dataTransfer.files[0]) handleImageFile(e.dataTransfer.files[0]);
    });

    // Prompt
    DOM.promptTextarea.addEventListener('input', updateCharCount);
    DOM.copyPromptBtn.addEventListener('click', () => {
        const text = DOM.promptTextarea.value || PROMPTS.default;
        navigator.clipboard.writeText(text).then(() => {
            showToast('success', 'Copied!', 'Prompt copied to clipboard.');
        }).catch(() => {
            showToast('error', 'Copy Failed', 'Unable to copy to clipboard.');
        });
    });
    DOM.useDefaultBtn.addEventListener('click', () => {
        DOM.promptTextarea.value = PROMPTS.default;
        updateCharCount();
        showToast('info', 'Cinematic Prompt Loaded', 'Professional editorial photography prompt applied.');
    });

    // Generate
    DOM.generateBtn.addEventListener('click', generateAIEdit);

    // Download
    DOM.downloadBtn.addEventListener('click', downloadImage);

    // Reset
    DOM.resetBtn.addEventListener('click', resetEditor);

    // Theme
    DOM.themeToggle.addEventListener('click', toggleTheme);

    // Disconnect
    DOM.navDisconnect.addEventListener('click', () => {
        if (confirm('Disconnect your API key and return to the login screen?')) {
            localStorage.removeItem('aura_api_key');
            App.apiKey = '';
            resetEditor();
            showAuthPage();
            DOM.apiKeyInput.value = '';
            showToast('info', 'Disconnected', 'Your API key has been removed.');
        }
    });

    // Zoom
    DOM.zoomOriginal.addEventListener('click', () => {
        if (DOM.originalPreview.src && DOM.originalPreview.classList.contains('loaded')) {
            openZoom(DOM.originalPreview.src);
        }
    });
    DOM.zoomEdited.addEventListener('click', () => {
        if (DOM.editedPreview.src && DOM.editedPreview.classList.contains('loaded')) {
            openZoom(DOM.editedPreview.src);
        }
    });
    DOM.zoomClose.addEventListener('click', closeZoom);
    DOM.zoomModal.addEventListener('click', e => { if (e.target === DOM.zoomModal) closeZoom(); });

    // Img clicks
    DOM.originalPreview.addEventListener('click', () => {
        if (DOM.originalPreview.classList.contains('loaded')) openZoom(DOM.originalPreview.src);
    });
    DOM.editedPreview.addEventListener('click', () => {
        if (DOM.editedPreview.classList.contains('loaded')) openZoom(DOM.editedPreview.src);
    });

    // History
    DOM.clearHistoryBtn.addEventListener('click', () => {
        App.history = [];
        renderHistory();
        showToast('info', 'History Cleared', 'All saved edits have been removed.');
    });

    // Edit strength
    DOM.editStrength.addEventListener('input', () => {
        DOM.strengthVal.textContent = DOM.editStrength.value;
    });

    // Keyboard
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeZoom();
    });
}

/* ============================================================
   INIT
============================================================ */
function init() {
    // Load saved theme
    const savedTheme = localStorage.getItem('aura_theme') || 'dark';
    App.theme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon();

    // Check saved API key
    const savedKey = localStorage.getItem('aura_api_key');
    if (savedKey) {
        App.apiKey = savedKey;
        showDashboard();
    } else {
        showAuthPage();
        startTypingAnimation();
    }

    setupEventListeners();
    setupChips();
    setupModelSelector();
    initComparisonSlider();
    createParticles();
    renderHistory();
}

document.addEventListener('DOMContentLoaded', init);
