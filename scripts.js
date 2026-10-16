/* theme = saved choice, else system preference (set inline in <body>). Toggle flips dark/light and remembers it. */
function toggleTheme() {
    const body = document.body;
    const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
}

/* default language = Chinese (no attribute). Toggle flips to English and remembers it. */
function toggleLang() {
    const body = document.body;
    const next = body.getAttribute('data-lang') === 'en' ? '' : 'en';
    body.setAttribute('data-lang', next);
    localStorage.setItem('lang', next);
    document.documentElement.lang = next === 'en' ? 'en' : 'zh-TW';
}

window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
        document.body.setAttribute('data-lang', savedLang);                // default stays Chinese
        document.documentElement.lang = savedLang === 'en' ? 'en' : 'zh-TW';
    }
});


/* research: hovering / focusing / tapping a tile shows its panel */
document.querySelectorAll('.r-tile').forEach(tile => {
    const show = () => {
        const n = tile.dataset.topic;
        document.querySelectorAll('.r-tile, .r-panel').forEach(el =>
            el.classList.toggle('active', el.dataset.topic === n));
    };
    tile.addEventListener('mouseenter', show);
    tile.addEventListener('focus', show);
    tile.addEventListener('click', show);
});

/* sidebar TOC: highlight the section currently in view */
const sideLinks = document.querySelectorAll('.side-toc a');
const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        sideLinks.forEach(a => a.classList.toggle('current', a.dataset.target === e.target.id));
    });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('section[id]').forEach(sec => spy.observe(sec));

/* experience: hovering a timeline bar lifts its row to the top of the list (FLIP animated) */
const expList = document.querySelector('#experience .list-container');
const expRows = [...expList.querySelectorAll('.list-row')];
expList.style.display = 'flex';
expList.style.flexDirection = 'column';
const linkHL = key => {
    const before = new Map(expRows.map(r => [r, r.getBoundingClientRect().top]));
    expList.classList.toggle('has-hl', !!key);
    expRows.forEach((r, i) => r.style.order = (key && r.dataset.exp === key) ? -1 : i);
    document.querySelectorAll('#experience [data-exp]').forEach(el =>
        el.classList.toggle('hl', !!key && el.dataset.exp === key));
    expRows.forEach(r => {
        const dy = before.get(r) - r.getBoundingClientRect().top;
        if (!dy) return;
        r.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }],
                  { duration: 350, easing: 'cubic-bezier(.2,.7,.2,1)' });
    });
};
document.querySelectorAll('.g-bar[data-exp]').forEach(el => {
    el.addEventListener('mouseenter', () => linkHL(el.dataset.exp));
    el.addEventListener('focus', () => linkHL(el.dataset.exp));
    el.addEventListener('blur', () => linkHL(null));
});
document.querySelector('.g-scroller').addEventListener('mouseleave', () => linkHL(null));

/* timeline: slider <-> horizontal scroll, plus drag-to-scroll on the chart */
const gScroller = document.querySelector('.g-scroller');
const gSlider = document.querySelector('.g-slider');
if (gScroller && gSlider) {
    const maxScroll = () => gScroller.scrollWidth - gScroller.clientWidth;
    const syncSlider = () => { gSlider.value = maxScroll() ? gScroller.scrollLeft / maxScroll() * 1000 : 0; };
    gSlider.addEventListener('input', () => { gScroller.scrollLeft = gSlider.value / 1000 * maxScroll(); });
    gScroller.addEventListener('scroll', syncSlider);
    window.addEventListener('resize', syncSlider);
    const NOW_X = 33.5 * 90;                                    /* 2026.10 on the 90px/month axis */
    gScroller.scrollLeft = Math.min(maxScroll(), Math.max(0, NOW_X - gScroller.clientWidth * 0.66));
    syncSlider();

    let startX = 0, startLeft = 0, dragging = false, moved = 0;
    gScroller.addEventListener('pointerdown', e => {
        moved = 0;
        if (e.pointerType !== 'mouse') return;                  /* touch already scrolls natively */
        dragging = true; startX = e.clientX; startLeft = gScroller.scrollLeft;
        gScroller.classList.add('dragging');
    });
    window.addEventListener('pointermove', e => {
        if (!dragging) return;
        moved = Math.max(moved, Math.abs(e.clientX - startX));
        gScroller.scrollLeft = startLeft - (e.clientX - startX);
    });
    window.addEventListener('pointerup', () => { dragging = false; gScroller.classList.remove('dragging'); });

    /* research bars -> open that research topic; competition bar -> competitions */
    const jump = bar => {
        if (moved > 5) return;                                  /* it was a drag, not a click */
        if (bar.dataset.topic) {
            document.querySelector(`.r-tile[data-topic="${bar.dataset.topic}"]`)?.click();
            document.getElementById('research').scrollIntoView({ behavior: 'smooth' });
        } else if (bar.dataset.jump) {
            document.getElementById(bar.dataset.jump).scrollIntoView({ behavior: 'smooth' });
        }
    };
    document.querySelectorAll('.g-bar[data-topic], .g-bar[data-jump]').forEach(bar => {
        bar.addEventListener('click', () => jump(bar));
        bar.addEventListener('keydown', e => { if (e.key === 'Enter') jump(bar); });
    });
}
