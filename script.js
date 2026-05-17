/**
 * なんでもない日常 - App Logic
 * Vanilla JavaScript implementation with LocalStorage and Premium UX.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const logContainer = document.getElementById('log-container');
    const addPostBtn = document.getElementById('add-post-btn');
    const postModal = document.getElementById('post-modal');
    const closeBtn = document.querySelector('.close-btn');
    const postForm = document.getElementById('post-form');
    
    // --- Constants ---
    const STORAGE_KEY = 'nandemonai_nichijo_logs';
    
    // --- Sample Data (Initial State) ---
    const initialSamples = [
        {
            id: Date.now() - 100000,
            text: "白浜の朝。透き通るブルーと、ほどよいサイズの波。自然の中に溶け込む感覚。",
            image: "img/surfing.png",
            wave: "腹〜胸 / オンショア気味",
            place: "伊豆・白浜海岸",
            date: "2026.04.21"
        },
        {
            id: Date.now() - 50000,
            text: "焚き火を囲んで、静かな朝のコーヒータイム。波の音だけが聞こえる贅沢な時間。",
            image: "img/outdoor.png",
            wave: "-",
            place: "南伊豆 キャンプパーク",
            date: "2026.04.20"
        },
        {
            id: Date.now() - 10000,
            text: "日が沈んだ後のマジックアワー。漂流物と波打ち際。何もないけど、すべてがある。",
            image: "img/sunset.png",
            wave: "セット腰",
            place: "入田浜",
            date: "2026.04.19"
        }
    ];

    // --- State ---
    let logs = [];

    // --- Functions ---

    /**
     * Load logs from LocalStorage or use samples if empty
     */
    function loadLogs() {
        const storedLogs = localStorage.getItem(STORAGE_KEY);
        if (storedLogs) {
            logs = JSON.parse(storedLogs);
        } else {
            logs = [...initialSamples];
            saveLogs();
        }
        renderLogs();
    }

    /**
     * Save logs to LocalStorage
     */
    function saveLogs() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    }

    /**
     * Render all logs to the container
     */
    function renderLogs() {
        if (logs.length === 0) {
            logContainer.innerHTML = `
                <div class="empty-state">
                    <p>まだ記録がありません。はじめての日常を記録してみませんか？</p>
                </div>
            `;
            return;
        }

        logContainer.innerHTML = '';
        
        // Sort by date (actually id is timestamp here)
        const sortedLogs = [...logs].sort((a, b) => b.id - a.id);

        sortedLogs.forEach((log, index) => {
            const card = document.createElement('article');
            card.className = 'log-card';
            // Stagger animation delay
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <div class="image-container">
                    <img src="${log.image}" alt="日常の風景" class="log-image" onerror="this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800'">
                </div>
                <div class="log-content">
                    <div class="log-date">${log.date}</div>
                    <p class="log-text">${escapeHTML(log.text)}</p>
                    <div class="log-meta">
                        ${log.wave ? `<div class="meta-item"><span class="icon">🌊</span> ${escapeHTML(log.wave)}</div>` : ''}
                        ${log.place ? `<div class="meta-item"><span class="icon">📍</span> ${escapeHTML(log.place)}</div>` : ''}
                    </div>
                </div>
            `;
            logContainer.appendChild(card);
        });
    }

    /**
     * Escape HTML to prevent XSS (Security focus)
     */
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Toggle Modal visibility
     */
    function toggleModal(show) {
        if (show) {
            postModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        } else {
            postModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    // --- Event Listeners ---

    addPostBtn.addEventListener('click', () => toggleModal(true));
    closeBtn.addEventListener('click', () => toggleModal(false));
    
    // Close modal when clicking outside content
    postModal.addEventListener('click', (e) => {
        if (e.target === postModal) toggleModal(false);
    });

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newLog = {
            id: Date.now(),
            text: document.getElementById('post-text').value,
            image: document.getElementById('post-image').value || 'img/sunset.png', // Fallback
            wave: document.getElementById('post-wave').value,
            place: document.getElementById('post-place').value,
            date: new Date().toLocaleDateString('ja-JP').replace(/\//g, '.')
        };

        logs.push(newLog);
        saveLogs();
        renderLogs();
        
        postForm.reset();
        toggleModal(false);

        // Feedback
        console.log('Post saved successfully.');
    });

    // --- Init ---
    loadLogs();
});
