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

// --- HSK FLASHCARD GAME ENGINE ---
const hskDatabase = [
    { level: 1, hanzi: "你好", pinyin: "nǐ hǎo", meaning: "Xin chào", exCn: "你好！很高兴认识你。", exVn: "Xin chào! Rất vui được gặp bạn." },
    { level: 1, hanzi: "谢谢", pinyin: "xièxie", meaning: "Cảm ơn", exCn: "谢谢你的帮助。", exVn: "Cảm ơn sự giúp đỡ của bạn." },
    { level: 1, hanzi: "再见", pinyin: "zàijiàn", meaning: "Tạm biệt", exCn: "妈妈，再见！", exVn: "Mẹ ơi, tạm biệt!" },
    { level: 1, hanzi: "苹果", pinyin: "píngguǒ", meaning: "Quả táo", exCn: "我想吃苹果。", exVn: "Tôi muốn ăn táo." },
    { level: 1, hanzi: "喜欢", pinyin: "xǐhuan", meaning: "Thích", exCn: "我���欢学汉语。", exVn: "Tôi thích học tiếng Trung." },
    { level: 2, hanzi: "跑步", pinyin: "pǎobù", meaning: "Chạy bộ", exCn: "我每天早晨都跑步。", exVn: "Tôi chạy bộ mỗi buổi sáng." },
    { level: 2, hanzi: "生病", pinyin: "shēngbìng", meaning: "Bị ốm", exCn: "他生病了，没去上班。", exVn: "Anh ấy bị ốm rồi, không đi làm." },
    { level: 2, hanzi: "准备", pinyin: "zhǔnbèi", meaning: "Chuẩn bị", exCn: "你准备好了吗？", exVn: "Bạn đã chuẩn bị sẵn sàng chưa?" }
];

let currentLevel = 1;
let filteredWords = [];
let currentWordIndex = 0;

const flashcard = document.getElementById('main-flashcard');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const flipBtn = document.getElementById('flip-btn');

function updateFlashcard() {
    filteredWords = hskDatabase.filter(word => word.level === currentLevel);
    if (filteredWords.length === 0) return;

    const word = filteredWords[currentWordIndex];
    
    // Đưa thẻ về mặt trước khi đổi từ
    flashcard.classList.remove('flipped');

    // Cập nhật nội dung (Đợi hiệu ứng quay hoàn tất để đổi chữ)
    setTimeout(() => {
        document.getElementById('card-badge').textContent = `HSK ${word.level}`;
        document.getElementById('card-hanzi').textContent = word.hanzi;
        document.getElementById('card-pinyin').textContent = `/ ${word.pinyin} /`;
        document.getElementById('card-meaning').textContent = word.meaning;
        document.getElementById('card-ex-cn').textContent = word.exCn;
        document.getElementById('card-ex-vn').textContent = word.exVn;
    }, 150);

    // Cập nhật thanh tiến trình
    const progressPercent = ((currentWordIndex + 1) / filteredWords.length) * 100;
    document.getElementById('hsk-progress-bar').style.width = `${progressPercent}%`;
    document.getElementById('hsk-progress-text').textContent = `${currentWordIndex + 1} / ${filteredWords.length} Từ`;
}

// Bắt sự kiện Lật thẻ
if (flashcard) {
    flashcard.addEventListener('click', () => flashcard.classList.toggle('flipped'));
    flipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        flashcard.classList.toggle('flipped');
    });
}

// Bắt sự kiện chuyển đổi từ vựng
if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentWordIndex < filteredWords.length - 1) {
            currentWordIndex++;
            updateFlashcard();
        }
    });
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentWordIndex > 0) {
            currentWordIndex--;
            updateFlashcard();
        }
    });
}

// Bộ lọc cấp độ HSK
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentLevel = parseInt(e.target.getAttribute('data-level'));
        currentWordIndex = 0;
        updateFlashcard();
    });
});

// Khởi chạy lần đầu khi vào trang
document.addEventListener('DOMContentLoaded', () => {
    updateFlashcard();
});
