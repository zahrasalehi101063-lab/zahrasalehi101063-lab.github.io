(function(){
  const switcher = document.getElementById('languageSwitch');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  let language = 'fa';

  function setLanguage(next) {
    language = next;
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
      ? 'Human Potential Studio | هوش مصنوعی، آموزش و خلاقیت'
      : 'Human Potential Studio | AI, Learning & Creativity';
    document.querySelector('meta[name="description"]').setAttribute('content', next === 'fa'
      ? 'فضای خلاقیت و هوش مصنوعی؛ طراحی ابزارهایی برای تبدیل دانش، توانایی و ایده به فرصت‌های واقعی.'
      : 'An AI and creative learning studio exploring tools that turn knowledge, skills and ideas into real opportunities.');
  }

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
