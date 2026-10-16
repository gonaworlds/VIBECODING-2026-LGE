const wrapper = document.querySelector('.slider-wrapper');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const themeToggle = document.getElementById('theme-toggle');
const htmlTag = document.documentElement;

let currentIndex = 0;
let autoPlayTimer = null;
let resumeTimer = null;
let startX = 0;
let isDragging = false;

// --- 테마 로직 ---
function applyTheme(theme) {
    htmlTag.setAttribute('data-theme', theme);
    localStorage.setItem('f404-theme', theme);
}

const savedTheme = localStorage.getItem('f404-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
    applyTheme(savedTheme);
} else if (prefersDark) {
    applyTheme('dark');
} else {
    applyTheme('light');
}

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlTag.getAttribute('data-theme');
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(targetTheme);
});


// --- 슬라이더 로직 ---
function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    currentIndex = index;
    wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 3000);
}

function stopAutoPlay() {
    clearInterval(autoPlayTimer);
}

function handleUserInteraction() {
    stopAutoPlay();
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
        startAutoPlay();
    }, 5000);
}

wrapper.addEventListener('mousedown', (e) => {
    startX = e.pageX;
    isDragging = true;
    handleUserInteraction();
});

wrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    isDragging = true;
    handleUserInteraction();
});

const handleEnd = (endX) => {
    if (!isDragging) return;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) {
        if (diff > 0) goToSlide(currentIndex + 1);
        else goToSlide(currentIndex - 1);
    }
    isDragging = false;
};

window.addEventListener('mouseup', (e) => handleEnd(e.pageX));
wrapper.addEventListener('touchend', (e) => handleEnd(e.changedTouches[0].pageX));

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        goToSlide(i);
        handleUserInteraction();
    });
});

startAutoPlay();
