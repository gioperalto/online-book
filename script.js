// Configuration
const config = {
    bookTitle: 'Murder at the Ashworth Estate', 
    chaptersFolder: 'chapters',
    chapterFilePattern: /^chapter-(\d+)\.md$/
};

// State
let chapters = [];
let currentChapter = null;

// Initialize the application
async function init() {
    document.getElementById('book-title').textContent = config.bookTitle;
    await loadChaptersList();
    setupEventListeners();
    loadChapterFromURL();
}

// Load the list of available chapters
async function loadChaptersList() {
    try {
        // Fetch the chapters directory listing from GitHub API
        const response = await fetch(`https://api.github.com/repos/${getRepoInfo()}/contents/${config.chaptersFolder}`);
        
        if (!response.ok) {
            throw new Error('Failed to load chapters');
        }

        const files = await response.json();
        
        // Filter and sort chapter files
        chapters = files
            .filter(file => config.chapterFilePattern.test(file.name))
            .map(file => {
                const match = file.name.match(config.chapterFilePattern);
                return {
                    number: parseInt(match[1]),
                    filename: file.name,
                    url: file.download_url,
                    title: null // Will be extracted from markdown
                };
            })
            .sort((a, b) => a.number - b.number);

        // Load titles for all chapters
        await loadChapterTitles();
        
        renderChaptersList();
    } catch (error) {
        console.error('Error loading chapters:', error);
        displayError('Unable to load chapters. Make sure the chapters folder exists in your repository.');
    }
}

// Extract repository info from URL or use fallback
function getRepoInfo() {
    // For GitHub Pages, try to extract from the URL
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    
    // GitHub Pages URL format: username.github.io/repo-name
    if (hostname.endsWith('.github.io')) {
        const username = hostname.split('.')[0];
        const repoMatch = pathname.match(/^\/([^\/]+)/);
        const repo = repoMatch ? repoMatch[1] : '';
        return `${username}/${repo}`;
    }
    
    // Fallback: You need to manually set this
    return 'USERNAME/REPO-NAME'; // Replace with your GitHub username/repo
}

// Load chapter titles from markdown files
async function loadChapterTitles() {
    const promises = chapters.map(async (chapter) => {
        try {
            const response = await fetch(chapter.url);
            const content = await response.text();
            const title = extractTitle(content);
            chapter.title = title || `Chapter ${chapter.number}`;
        } catch (error) {
            chapter.title = `Chapter ${chapter.number}`;
        }
    });

    await Promise.all(promises);
}

// Extract title from markdown content (first h1)
function extractTitle(markdown) {
    const match = markdown.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : null;
}

// Render the chapters list in the sidebar
function renderChaptersList() {
    const chapterList = document.getElementById('chapter-list');
    
    if (chapters.length === 0) {
        chapterList.innerHTML = '<p class="loading">No chapters found.</p>';
        return;
    }

    chapterList.innerHTML = chapters.map(chapter => `
        <div class="chapter-item" data-chapter="${chapter.number}">
            <span class="chapter-number">Ch. ${chapter.number}</span>
            <span class="chapter-title">${chapter.title}</span>
        </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.chapter-item').forEach(item => {
        item.addEventListener('click', () => {
            const chapterNum = parseInt(item.dataset.chapter);
            loadChapter(chapterNum);
        });
    });
}

// Load and display a specific chapter
async function loadChapter(chapterNumber) {
    const chapter = chapters.find(ch => ch.number === chapterNumber);
    
    if (!chapter) {
        displayError(`Chapter ${chapterNumber} not found.`);
        return;
    }

    try {
        const response = await fetch(chapter.url);
        const markdown = await response.text();
        const html = marked.parse(markdown);

        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = html;

        // Update active state
        document.querySelectorAll('.chapter-item').forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.dataset.chapter) === chapterNumber) {
                item.classList.add('active');
            }
        });

        currentChapter = chapterNumber;
        updateURL(chapterNumber);

        // Scroll to top
        window.scrollTo(0, 0);

        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('active');
        }
    } catch (error) {
        console.error('Error loading chapter:', error);
        displayError(`Failed to load chapter ${chapterNumber}.`);
    }
}

// Display error message
function displayError(message) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <div class="error-message">
            <h2>Error</h2>
            <p>${message}</p>
        </div>
    `;
}

// Update URL with current chapter
function updateURL(chapterNumber) {
    const url = new URL(window.location);
    url.searchParams.set('chapter', chapterNumber);
    window.history.pushState({}, '', url);
}

// Load chapter from URL parameter
function loadChapterFromURL() {
    const params = new URLSearchParams(window.location.search);
    const chapterParam = params.get('chapter');
    
    if (chapterParam) {
        const chapterNum = parseInt(chapterParam);
        if (!isNaN(chapterNum)) {
            loadChapter(chapterNum);
            return;
        }
    }

    // Load first chapter by default if available
    if (chapters.length > 0) {
        loadChapter(chapters[0].number);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Sidebar toggle for mobile
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Handle browser back/forward
    window.addEventListener('popstate', loadChapterFromURL);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
