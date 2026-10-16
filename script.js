const wrapper = document.querySelector('.slider-wrapper');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const themeToggle = document.getElementById('theme-toggle');
const htmlTag = document.documentElement;
const header = document.querySelector('header');
const primaryNav = document.querySelector('header nav');
const logo = document.querySelector('header .logo');
const megaMenu = document.querySelector('.mega-menu');
const primaryLinks = document.querySelectorAll('.primary-menu a');
const submenuColumns = document.querySelectorAll('.mega-menu__column');
const submenuLinks = document.querySelectorAll('.mega-menu__column a');
const desktopNavigation = window.matchMedia('(min-width: 1024px)');

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

// Keep the shared submenu open while the pointer moves between the header and panel.
function setMegaMenuOpen(isOpen) {
    if (!desktopNavigation.matches) return;

    header.classList.toggle('mega-menu-open', isOpen);
    megaMenu.setAttribute('aria-hidden', String(!isOpen));
    primaryLinks.forEach((link) => {
        link.setAttribute('aria-expanded', String(isOpen));
    });
    submenuLinks.forEach((link) => {
        if (isOpen) link.removeAttribute('tabindex');
        else link.setAttribute('tabindex', '-1');
    });
    if (!isOpen) setCurrentPrimaryLink(null);
}

function showPrimaryNav() {
    primaryNav.classList.remove('is-scroll-hidden');
}

function setCurrentPrimaryLink(currentLink) {
    primaryLinks.forEach((link, index) => {
        const isCurrent = link === currentLink;
        link.classList.toggle('is-current', isCurrent);
        submenuColumns[index].classList.toggle('is-current', isCurrent);
    });
}

primaryNav.addEventListener('pointerenter', () => {
    showPrimaryNav();
    setMegaMenuOpen(true);
});
primaryNav.addEventListener('focusin', () => {
    showPrimaryNav();
    setMegaMenuOpen(true);
});
primaryLinks.forEach((link) => {
    link.addEventListener('pointerenter', () => setCurrentPrimaryLink(link));
    link.addEventListener('focus', () => setCurrentPrimaryLink(link));
});
submenuColumns.forEach((column, index) => {
    column.addEventListener('pointerenter', () => setCurrentPrimaryLink(primaryLinks[index]));
    column.addEventListener('focusin', () => setCurrentPrimaryLink(primaryLinks[index]));
});
logo.addEventListener('pointerenter', () => {
    showPrimaryNav();
    setCurrentPrimaryLink(null);
    setMegaMenuOpen(true);
});
header.addEventListener('pointerleave', () => {
    setCurrentPrimaryLink(null);
    setMegaMenuOpen(false);
});
header.addEventListener('focusout', (event) => {
    if (!header.contains(event.relatedTarget)) setMegaMenuOpen(false);
});
header.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMegaMenuOpen(false);
});

// Hide the navigation while scrolling down and reveal it when scrolling up.
let previousScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (!desktopNavigation.matches) {
        primaryNav.classList.remove('is-scroll-hidden');
    } else if (currentScrollY > previousScrollY && currentScrollY > 80) {
        primaryNav.classList.add('is-scroll-hidden');
        setMegaMenuOpen(false);
    } else if (currentScrollY < previousScrollY) {
        showPrimaryNav();
    }
    previousScrollY = currentScrollY;
}, { passive: true });

desktopNavigation.addEventListener('change', () => {
    primaryNav.classList.remove('is-scroll-hidden');
    setMegaMenuOpen(false);
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

// --- World fashion week slider ---
const worldFashionSwiper = new Swiper('.wf-swiper', {
    loop: true,
    grabCursor: true,
    spaceBetween: 20,
    slidesPerView: 1.2,
    speed: 600,
    breakpoints: {
        480: {
            slidesPerView: 2
        },
        768: {
            slidesPerView: 3
        },
        1200: {
            slidesPerView: 4
        }
    },
    autoplay: {
        delay: 3000,
        disableOnInteraction: true,
        pauseOnMouseEnter: true
    },
    keyboard: {
        enabled: true,
        onlyInViewport: true
    },
    a11y: {
        enabled: true
    },
    navigation: {
        nextEl: '.wf-button-next',
        prevEl: '.wf-button-prev'
    },
    pagination: {
        el: '.wf-pagination',
        clickable: true
    }
});
