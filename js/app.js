// Оптимизированное приложение без лишних функций
let currentAnime = null;
let currentEpisode = null;

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadAnimes();
    handleInitialLoad();
});

// Загрузка аниме
function loadAnimes() {
    const grid = document.getElementById('anime-grid');
    
    if (!animeData || animeData.length === 0) {
        grid.innerHTML = '<div class="loading">Аниме не найдены</div>';
        return;
    }

    const gridHTML = `
        <div class="grid">
            ${animeData.map(anime => `
                <div class="anime-card" onclick="showAnimeDetail('${anime.id}')">
                    <div class="anime-banner">
                        <img src="${anime.bannerUrl}" alt="${anime.title}" loading="lazy">
                        <div class="anime-overlay">
                            <h3 class="anime-title">${anime.title}</h3>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    grid.innerHTML = gridHTML;
}

// Показать главную страницу
function showHome() {
    document.body.classList.remove('episode-playing');
    showPage('home-page');
    window.location.hash = '';
}

// Показать детали аниме
function showAnimeDetail(animeId) {
    document.body.classList.remove('episode-playing');
    
    const anime = animeData.find(a => a.id === animeId);
    if (!anime) return;

    currentAnime = anime;
    
    // Показать баннер аниме с описанием
    const container = document.getElementById('anime-detail-container');
    container.innerHTML = `
        <div class="anime-hero">
            <div class="anime-hero-bg">
                <img src="${anime.heroImage || anime.bannerUrl}" alt="${anime.title}">
                <div class="anime-hero-overlay"></div>
            </div>
            <div class="anime-hero-content">
                <div class="anime-info">
                    <h1 class="anime-hero-title">${anime.title}</h1>
                    <div class="anime-meta">
                        <span class="anime-year">${anime.year || '2024'}</span>
                        <span class="anime-episodes">${anime.episodes.length} серий</span>
                        <span class="anime-genre">${anime.genre || 'Аниме'}</span>
                    </div>
                    <p class="anime-description">${anime.description || 'Захватывающее аниме, которое не оставит вас равнодушными.'}</p>
                </div>
            </div>
        </div>
        
        <div class="episodes-section">
            <h2 class="episodes-title">Серии</h2>
            <div class="episodes-list">
                ${anime.episodes.map(episode => `
                    <div class="episode-item" onclick="showEpisode('${anime.id}', ${episode.number})">
                        <div class="episode-number">${episode.number}</div>
                        <div class="episode-info">
                            <h4>Серия ${episode.number}</h4>
                            <p>${episode.title || `Серия ${episode.number}`}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    showPage('anime-detail-page');
    window.location.hash = `anime/${animeId}`;
}

// Вернуться к аниме
function backToAnime() {
    if (currentAnime) {
        showAnimeDetail(currentAnime.id);
    } else {
        showHome();
    }
}

// Показать серию
function showEpisode(animeId, episodeNumber) {
    const anime = animeData.find(a => a.id === animeId);
    const episode = anime?.episodes.find(e => e.number === episodeNumber);
    
    if (!anime || !episode) return;

    currentAnime = anime;
    currentEpisode = episode;
    
    // Скрыть хедер на странице серий
    document.body.classList.add('episode-playing');
    
    // Создать iframe плеер
    const container = document.getElementById('video-container');
    container.innerHTML = `
        <iframe 
            src="${episode.videoUrl}" 
            frameborder="0" 
            allowfullscreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            class="video-iframe">
        </iframe>
    `;
    
    // Обновить навигацию
    updateEpisodeNavigation();
    
    showPage('episode-page');
    window.location.hash = `anime/${animeId}/episode/${episodeNumber}`;
}

// Обновить навигацию серий
function updateEpisodeNavigation() {
    if (!currentAnime || !currentEpisode) return;
    
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const counter = document.getElementById('episode-counter');
    
    const currentNumber = currentEpisode.number;
    const totalEpisodes = currentAnime.episodes.length;
    
    // Обновить счетчик
    counter.textContent = `${currentNumber} / ${totalEpisodes}`;
    
    // Обновить кнопки
    prevBtn.disabled = currentNumber === 1;
    nextBtn.disabled = currentNumber === totalEpisodes;
}

// Предыдущая серия
function goToPreviousEpisode() {
    if (!currentAnime || !currentEpisode || currentEpisode.number === 1) return;
    showEpisode(currentAnime.id, currentEpisode.number - 1);
}

// Следующая серия
function goToNextEpisode() {
    if (!currentAnime || !currentEpisode) return;
    const totalEpisodes = currentAnime.episodes.length;
    if (currentEpisode.number === totalEpisodes) return;
    showEpisode(currentAnime.id, currentEpisode.number + 1);
}

// Показать страницу поддержки
function showSupport() {
    document.body.classList.remove('episode-playing');
    showPage('support-page');
    window.location.hash = 'support';
}

// Показать страницу
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    window.scrollTo(0, 0);
}

// Обработка начальной загрузки
function handleInitialLoad() {
    const hash = window.location.hash;
    if (hash) {
        handleHashChange(hash);
    }
    
    window.addEventListener('hashchange', () => {
        handleHashChange(window.location.hash);
    });
}

// Обработка изменения hash
function handleHashChange(hash) {
    if (hash.startsWith('#anime/')) {
        const parts = hash.split('/');
        const animeId = parts[1];
        const episodeNumber = parts[3];
        
        if (episodeNumber) {
            showEpisode(animeId, parseInt(episodeNumber));
        } else {
            showAnimeDetail(animeId);
        }
    } else if (hash === '#support') {
        showSupport();
    } else {
        showHome();
    }
}