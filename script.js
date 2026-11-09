(function(){
  const switcher = document.getElementById('languageSwitch');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  let language = 'fa';
  try {
    const saved = window.localStorage.getItem('hplus-language');
    if (saved === 'fa' || saved === 'en') language = saved;
  } catch (_) { /* Storage may be disabled; keep Persian as default. */ }

  function setLanguage(next) {
    language = next;
    try { window.localStorage.setItem('hplus-language', next); } catch (_) { /* Optional preference only. */ }
    document.documentElement.lang = next;
    document.documentElement.dir = next === 'fa' ? 'rtl' : 'ltr';
    document.body.lang = next;
    document.body.dir = next === 'fa' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-fa][data-en]').forEach((element) => {
      const value = element.dataset[next];
      if (value !== undefined) element.innerHTML = value;
    });
    switcher.innerHTML = next === 'fa' ? 'EN <span>↗</span>' : 'فا <span>↗</span>';
    switcher.setAttribute('aria-label', next === 'fa' ? 'Switch to English' : 'تغییر زبان به فارسی');
    document.title = next === 'fa'
      ? 'H+ Human Potential Studio | هوش مصنوعی، خلاقیت و کسب‌وکار'
      : 'H+ Human Potential Studio | AI, Creativity & Commerce';
    const description = document.querySelector('meta[name="description"]');
    description.setAttribute('content', next === 'fa'
      ? 'H+ Human Potential Studio؛ آزمایشگاه کاربردی هوش مصنوعی، نویسندگی، آموزش، خلاقیت و تجارت.'
      : 'H+ Human Potential Studio: applied AI, writing, learning, creativity and commerce.');
  }

  setLanguage(language);
  switcher.addEventListener('click', () => setLanguage(language === 'fa' ? 'en' : 'fa'));
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
})();
