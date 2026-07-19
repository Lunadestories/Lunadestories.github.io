// --- DARK MODE LOGIC ---
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
}

themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
});

// --- SPA DYNAMIC NAVIGATION ---
function navigateToPage(targetId) {
    // 1. Ẩn tất cả các view trang hiện tại
    const pages = document.querySelectorAll('.page-view');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // 2. Hiển thị trang đích được chỉ định
    const targetPage = document.getElementById(targetId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 3. Đồng bộ hóa thanh trạng thái active trên Menu điều hướng
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('data-target') === targetId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Lắng nghe sự kiện click trên thanh Menu và Logo
document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-target]');
    if (target) {
        e.preventDefault();
        const targetId = target.getAttribute('data-target');
        navigateToPage(targetId);
    }
});

// --- DAILY QUOTE ENGINE ---
const quotes = [
    { text: "Learning another language is another way of becoming another person.", author: "Haruki Murakami" },
    { text: "The limits of my language mean the limits of my world.", author: "Ludwig Wittgenstein" },
    { text: "One language sets you in a corridor for life. Two languages open every door along the way.", author: "Frank Smith" },
    { text: "To have another language is to possess a second soul.", author: "Charlemagne" }
];

const today = new Date().getDate();
const quoteIndex = today % quotes.length;
const quoteElement = document.getElementById('daily-quote');
const authorElement = document.getElementById('quote-author');

if(quoteElement && authorElement) {
    quoteElement.textContent = `"${quotes[quoteIndex].text}"`;
    authorElement.textContent = `— ${quotes[quoteIndex].author}`;
}
