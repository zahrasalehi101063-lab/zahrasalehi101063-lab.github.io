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
    document.querySelectorAll('[data-placeholder-fa][data-placeholder-en]').forEach((element) => {
      element.placeholder = element.dataset[next === 'fa' ? 'placeholderFa' : 'placeholderEn'];
    });
    document.querySelectorAll('option[data-en-option]').forEach((option) => {
      if (next === 'en') option.textContent = option.dataset.enOption;
      else option.textContent = option.dataset.faOption || option.getAttribute('value');
    });
    switcher.innerHTML = next === 'fa' ? 'EN <span>↗</span>' : 'فا <span>↗</span>';
    switcher.setAttribute('aria-label', next === 'fa' ? 'Switch to English' : 'تغییر زبان به فارسی');
    document.title = next === 'fa'
      ? 'H+ Human Potential Studio | هوش مصنوعی، خلاقیت و کسب‌وکار'
      : 'H+ Human Potential Studio | AI, Creativity & Commerce';
    const description = document.querySelector('meta[name="description"]');
    description.setAttribute('content', next === 'fa'
      ? 'H+ Human Potential Studio؛ قطب‌نمای خلاقیت و آزمایشگاه محصولات هوش مصنوعی برای کشف توانایی، آموزش، تجارت و حل مسئله‌های واقعی.'
      : 'H+ Human Potential Studio: a creative compass and applied AI venture lab for human potential, learning, commerce and real problem-solving.');
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

  // H+ Opportunity Architect: creates a structured prompt locally; no API key or network call.
  const form = document.getElementById('opportunityForm');
  if (!form) return;
  const byId = (id) => document.getElementById(id);
  const status = byId('agentStatus');
  const outputWrap = byId('agentOutputWrap');
  const output = byId('agentOutput');
  let lastPrompt = '';

  function buildPrompt(values, lang) {
    const isFa = lang === 'fa';
    if (isFa) {
      return `# مأموریت ایجنت H+ Opportunity Architect\n\n## نقش تو\nتو یک معمار فرصت کسب‌وکار، طراح محصول مبتنی بر هوش مصنوعی، پژوهشگر بازار و طراح آزمایش‌های کم‌هزینه هستی. کار تو تولید فهرست‌های کلیشه‌ای ایده نیست؛ باید از ترکیب توانایی انسان و AI یک قابلیت تازه بسازی که یک مسئله واقعی را برای مشتری مشخص حل کند.\n\n## زمینه کاربر\n- توانایی‌ها، تجربه‌ها و منابع: ${values.skills}\n- مشتری مورد علاقه: ${values.customer}\n- مسئله یا فرصت مشاهده‌شده: ${values.problem || 'هنوز دقیق نشده؛ با توجه به زمینه کاربر، مسئله‌های محتمل را به‌صورت فرضیه بررسی کن.'}\n- محدودیت ساخت: ${values.resources}\n- بازار هدف: ${values.market}\n- دارایی‌ها و کانال‌های دسترسی: ${values.assets || 'هنوز مشخص نشده؛ فرض نکن.'}\n- زمینه اکوسیستم H+: استودیوی ایده و محصولات AI؛ کتاب‌ها و آموزش؛ کسب‌وکار زیبایی SilvaGlow (silvaglow.ir) به‌عنوان یک محیط آزمایشی احتمالی. فقط در صورت ارتباط واقعی از این زمینه استفاده کن.\n\n## قطب‌نمای خلاقیت\n1. به‌جای «AI چه محتوایی تولید می‌کند؟» بپرس «چه کاری را ممکن می‌کند که قبلاً دشوار، گران، کند یا دست‌نیافتنی بود؟»\n2. خروجی باید مسئله، کاربر، خریدار و نتیجه قابل سنجش داشته باشد.\n3. خلاقیت را با قابلیت ساخت نمونه اولیه و مسیر رسیدن به مشتری متوازن کن.\n4. دست‌کم یک راه‌حل غیرمنتظره اما واقع‌گرایانه پیشنهاد بده؛ از عجیب‌بودنِ بی‌فایده پرهیز کن.\n5. اگر داده کافی نداری، فرضیه را برچسب بزن و آن را واقعیت جا نزن. اطلاعات، آمار بازار، رقبا، قیمت‌ها و منابع را جعل نکن. اگر ابزار جست‌وجوی وب در دسترس است، بازار و رقبا را با منابع معتبر و تاریخ‌دار بررسی کن؛ اگر نیست، فهرست پرسش‌های تحقیق را مشخص کن.\n\n## روش تحلیل الزامی\n- کارِ اصلی مشتری (Job to be Done)، درد فعلی، دفعات وقوع، هزینه/زمان/ریسک و راه‌حل موقت فعلی را توضیح بده.\n- خریدار و استفاده‌کننده را جدا کن؛ مشخص کن چه کسی بودجه را می‌پردازد و چرا.\n- قابلیت تازه‌ای را که AI همراه با انسان ایجاد می‌کند، دقیق و قابل فهم شرح بده.\n- بررسی کن آیا این ایده قبلاً به‌صورت مشابه عرضه شده است؛ مزیت ما باید در گروه مشتری، جریان کار، داده مجاز، تجربه یا نتیجه مشخص باشد، نه صرفاً نام تازه.\n- مناسب‌ترین نسخه MVP را برای منابع محدود طراحی کن؛ ابتدا دستی/بدون کد یا با ابزارهای آماده، سپس اتوماسیون.\n- مدل درآمدی قابل آزمایش پیشنهاد بده؛ قیمت را فقط به‌صورت فرضیه قیمت‌گذاری اعلام کن مگر منبع جاری داشته باشی.\n- آزمایش بازار طراحی کن: ۵ تا ۱۰ مصاحبه هدفمند، نمونه نمایشی، پیشنهاد پایلوت پولی یا پیش‌فروش شفاف، معیار ادامه/توقف.\n- ریسک‌های فنی، عملیاتی، حقوقی، حریم خصوصی و ایمنی را مشخص کن.\n\n## قواعد اعتماد و ایمنی\n- اطلاعات افراد و مشتریان فقط با رضایت و مجوز مناسب استفاده شوند؛ داده حساس یا محرمانه وارد ابزار عمومی نشود.\n- از روی پست‌ها، عکس‌ها یا نوشته‌های شبکه اجتماعی، روان‌پریشی، اختلال روانی، شخصیت بالینی یا ویژگی حساس افراد را تشخیص نده و برچسب نزن. فقط الگوهای قابل مشاهده و غیرتشخیصی را در زمینه مناسب و با رضایت گزارش کن.\n- پروژه‌های پزشکی، مالی و استخدامی را ابزار پشتیبان تصمیم بدان؛ تصمیم نهایی و بازبینی انسانی لازم است. درآمد، درمان، استخدام یا نتیجه قطعی را تضمین نکن.\n- برای کودکان، رضایت والد/سرپرست، حداقل‌سازی داده و طراحی متناسب سن الزامی است.\n- هیچ کلید API، رمز عبور یا داده محرمانه‌ای در کد عمومی GitHub قرار نده.\n\n## قالب خروجی؛ دقیقاً با این ترتیب\n1. **خلاصه یک‌جمله‌ای محصول**\n2. **مشتری اصلی، استفاده‌کننده و پرداخت‌کننده**\n3. **مسئله واقعی و راه‌حل فعلی مشتری**\n4. **قابلیت تازه‌ای که قبلاً دشوار/گران/کند بوده**\n5. **جریان کار محصول از ورود تا دریافت نتیجه**\n6. **نقش ایجنت‌ها و مسئولیت هرکدام**\n7. **رقبا و جایگزین‌ها**؛ همراه منابع و تاریخ، یا اعلام صریح اینکه هنوز بررسی نشده‌اند\n8. **تمایز قابل دفاع و دلیل انتخاب ما**\n9. **MVP کم‌هزینه**؛ امکانات ضروری و مواردی که فعلاً نمی‌سازیم\n10. **مدل درآمدی و فرضیه قیمت‌گذاری**؛ همراه دلیل و عدم قطعیت\n11. **برنامه اعتبارسنجی با مشتری واقعی**؛ متن ۵ سؤال مصاحبه، پیشنهاد پایلوت و معیار موفقیت\n12. **ریسک‌ها، حریم خصوصی و کنترل انسانی**\n13. **امتیازدهی اولیه از ۱۰۰** با وزن‌ها: شدت مسئله ۲۰، تمایل به پرداخت ۲۰، تمایز ۱۵، امکان ساخت MVP ۱۵، دسترسی به مشتری ۱۰، تکرارپذیری/گسترش ۱۰، اعتماد و ریسک ۱۰. برای هر امتیاز شواهد یا فرضیه را بنویس؛ عدد را حقیقت بازار جلوه نده.\n14. **تصمیم ادامه/اصلاح/توقف** و فقط یک قدم بعدی مشخص.\n\n## لحن و استاندارد\nخلاق، واقع‌گرا، دقیق، صریح و بدون اغراق. سه ایده ضعیف تولید نکن؛ یک فرصت برتر را عمیق بررسی کن و فقط در صورت نیاز دو گزینه جایگزین بده. در صورت نبود اطلاعات حیاتی، فقط یک سؤال ضروری بپرس؛ در غیر این صورت فرض‌ها را آشکار کن. پاسخ را به زبان فارسی بنویس مگر کاربر زبان دیگری بخواهد.`;
    }
    return `# H+ Opportunity Architect — Agent Mission\n\n## Role\nYou are a venture opportunity architect, AI product designer, market researcher and low-cost experiment planner. Do not generate generic idea lists. Combine human capability and AI to create a new capability that solves a real problem for a specific customer.\n\n## User context\n- Skills, experience and resources: ${values.skills}\n- Preferred customer: ${values.customer}\n- Observed problem/opportunity: ${values.problem || 'Not yet specified. Explore plausible hypotheses from the user context and label them.'}\n- Build constraints: ${values.resources}\n- Target market: ${values.market}\n- Assets and access channels: ${values.assets || 'Not specified; do not assume.'}\n- H+ context: an applied AI studio; books and education; SilvaGlow beauty commerce (silvaglow.ir) as a possible testbed. Use this context only when genuinely relevant.\n\n## Creative compass\n1. Ask what AI makes possible that used to be difficult, costly, slow or out of reach—not merely what content it can generate.\n2. Every concept needs a problem, user, payer and measurable outcome.\n3. Balance novelty with MVP feasibility and customer access.\n4. Include at least one unexpected but realistic solution; avoid novelty without utility.\n5. Label assumptions. Never invent market data, competitors, prices, sources or evidence. Browse current sources if available; otherwise list the research questions still open.\n\n## Required analysis\n- Define the customer Job-to-be-Done, current pain, frequency, cost/time/risk and workaround.\n- Separate user from buyer; identify who pays and why.\n- Explain the new human+AI capability clearly.\n- Check existing alternatives; differentiation must come from a customer segment, workflow, permitted data, experience or measurable result—not a new name.\n- Design the smallest MVP for limited resources, starting manually/no-code where sensible.\n- Propose a testable business model; label unverified pricing as a hypothesis.\n- Design validation: 5–10 targeted interviews, a demo, a transparent paid pilot/preorder, and continue/stop criteria.\n- Identify technical, operational, legal, privacy and safety risks.\n\n## Trust and safety\nUse personal/customer data only with appropriate consent and authorization. Never diagnose psychopathy, mental illness, clinical personality or sensitive traits from social posts, images or writing. Only describe observable, non-diagnostic patterns with consent and context. Medical, financial and hiring tools must support—not replace—qualified human decisions. Never guarantee income, treatment, hiring or outcomes. For children, require guardian consent, age-appropriate design and data minimization. Never expose API keys, passwords or private data in public GitHub code.\n\n## Required output (in this order)\n1. One-sentence product pitch.\n2. Primary customer, user and payer.\n3. Real problem and current workaround.\n4. New capability previously difficult/costly/slow.\n5. End-to-end product workflow.\n6. Agent roles and responsibilities.\n7. Competitors and alternatives, with dated sources or an explicit note that research remains undone.\n8. Defensible differentiation.\n9. Low-cost MVP: must-haves and exclusions.\n10. Revenue model and pricing hypothesis with uncertainty.\n11. Real-customer validation plan: five interview questions, pilot offer and success criteria.\n12. Risks, privacy and human oversight.\n13. Preliminary 100-point score: pain 20, willingness to pay 20, differentiation 15, MVP feasibility 15, customer access 10, repeatability/expansion 10, trust/risk 10. Explain evidence or assumptions; do not present scores as market facts.\n14. Continue / revise / stop recommendation and one concrete next step.\n\n## Standard\nBe creative, practical, candid and specific. Deeply assess one strongest opportunity; add up to two alternatives only if useful. Ask one essential question only when required; otherwise expose assumptions. Respond in English unless asked otherwise.`;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const skills = byId('agent-skills').value.trim();
    if (!skills) {
      status.textContent = language === 'fa' ? 'لطفاً ابتدا توانایی‌ها یا تجربه‌ات را بنویس.' : 'Please enter your skills or experience first.';
      byId('agent-skills').focus();
      return;
    }
    const selectedCustomer = byId('agent-customer').selectedOptions[0];
    const selectedResource = byId('agent-resource').selectedOptions[0];
    const selectedMarket = byId('agent-market').selectedOptions[0];
    const values = {
      skills,
      customer: language === 'fa' ? selectedCustomer.value : (selectedCustomer.dataset.enOption || selectedCustomer.value),
      problem: byId('agent-problem').value.trim(),
      resources: language === 'fa' ? selectedResource.value : (selectedResource.dataset.enOption || selectedResource.value),
      market: language === 'fa' ? selectedMarket.value : (selectedMarket.dataset.enOption || selectedMarket.value),
      assets: byId('agent-assets').value.trim()
    };
    lastPrompt = buildPrompt(values, language);
    output.value = lastPrompt;
    outputWrap.hidden = false;
    status.textContent = language === 'fa'
      ? 'پرونده آماده شد. دستور را کپی کن و در یک گفت‌وگوی هوش مصنوعی اجرا کن؛ این نسخه هنوز به API متصل نیست.'
      : 'Your brief is ready. Copy it into an AI conversation to run it; this version is not API-connected yet.';
    outputWrap.scrollIntoView({behavior:'smooth', block:'nearest'});
  });

  byId('agentExample').addEventListener('click', () => {
    byId('agent-skills').value = language === 'fa'
      ? 'نویسندگی و تولید محتوای آموزشی؛ طراحی گرافیک و کار با ابزارهای AI؛ تجربه فروش و بازاریابی؛ آشنایی با فروشگاه آنلاین زیبایی و تولید محتوای محصول؛ توانایی طراحی تمرین و دوره آموزشی.'
      : 'Writing and educational content; graphic design and AI tools; sales and marketing; experience with an online beauty store and product content; ability to design exercises and courses.';
    byId('agent-customer').value = 'زیبایی و تجارت الکترونیک';
    byId('agent-problem').value = language === 'fa'
      ? 'فروشگاه‌های زیبایی زمان زیادی صرف پاسخ به پرسش‌های تکراری، توضیح تفاوت محصولات و کمک به انتخاب آگاهانه می‌کنند. می‌خواهیم با تکیه بر کاتالوگ تأییدشده فروشگاه، تجربه انتخاب و پشتیبانی را بهتر کنیم؛ بدون تشخیص پزشکی یا ادعای تأییدنشده درباره محصولات.'
      : 'Beauty stores spend time answering repeated questions, explaining product differences and helping shoppers choose. We want to improve product discovery and support using the store’s verified catalogue, without medical diagnosis or unsupported product claims.';
    byId('agent-resource').selectedIndex = 0;
    byId('agent-market').selectedIndex = 0;
    byId('agent-assets').value = language === 'fa'
      ? 'فروشگاه آنلاین SilvaGlow با دامنه silvaglow.ir؛ وب‌سایت شخصی H+ در GitHub؛ توانایی تولید محتوای فارسی و انگلیسی. کاتالوگ و آمار فروش باید جداگانه دریافت و تأیید شود.'
      : 'SilvaGlow online store at silvaglow.ir; H+ personal website on GitHub; ability to create Persian and English content. Product catalogue and sales data must be obtained and verified separately.';
    status.textContent = language === 'fa' ? 'نمونه SilvaGlow وارد شد؛ اطلاعات را می‌توانی ویرایش کنی و سپس brief بسازی.' : 'The SilvaGlow example is loaded. Edit it as needed, then generate the brief.';
  });

  byId('copyAgentPrompt').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(output.value);
      status.textContent = language === 'fa' ? 'دستور ایجنت کپی شد؛ آن را در گفت‌وگوی AI بچسبان.' : 'Agent prompt copied. Paste it into your AI chat.';
    } catch (_) {
      output.focus(); output.select();
      const ok = document.execCommand('copy');
      status.textContent = ok
        ? (language === 'fa' ? 'دستور کپی شد.' : 'Prompt copied.')
        : (language === 'fa' ? 'متن را انتخاب کن و با Ctrl+C کپی کن.' : 'Select the text and press Ctrl+C.');
    }
  });

  byId('downloadAgentPrompt').addEventListener('click', () => {
    const blob = new Blob([output.value], {type:'text/markdown;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'Hplus-Opportunity-Architect-Brief.md';
    document.body.appendChild(anchor);
    anchor.click(); anchor.remove();
    URL.revokeObjectURL(url);
    status.textContent = language === 'fa' ? 'پرونده دانلود شد.' : 'Brief downloaded.';
  });

  // Live AI mode is enabled only after a secure server endpoint is deployed.
  const liveConfig = window.HPLUS_CONFIG || {};
  const liveButton = byId('runLiveAgent');
  const liveState = byId('agentLiveState');
  const liveControls = byId('agentLiveControls');
  const liveResult = byId('agentLiveResult');
  const liveOutput = byId('agentLiveOutput');
  const apiUrl = String(liveConfig.agentApiUrl || '').trim();
  if (apiUrl) {
    liveControls.hidden = false;
    liveButton.disabled = false;
    liveState.textContent = language === 'fa'
      ? 'اتصال سرور تنظیم شده است. برای اجرای تحلیل، کد دسترسی آزمایشی را وارد کن.'
      : 'Server connection is configured. Enter your private beta access code to run an analysis.';
  }

  liveButton.addEventListener('click', async () => {
    if (!apiUrl) return;
    const skills = byId('agent-skills').value.trim();
    const accessCode = byId('agentAccessCode').value;
    if (!skills) {
      liveState.textContent = language === 'fa' ? 'ابتدا توانایی‌ها و تجربه‌ات را وارد کن.' : 'Please enter your skills and experience first.';
      byId('agent-skills').focus();
      return;
    }
    if (!accessCode) {
      liveState.textContent = language === 'fa' ? 'کد دسترسی آزمایشی را وارد کن.' : 'Enter the private beta access code.';
      byId('agentAccessCode').focus();
      return;
    }
    const selectedCustomer = byId('agent-customer').selectedOptions[0];
    const selectedResource = byId('agent-resource').selectedOptions[0];
    const selectedMarket = byId('agent-market').selectedOptions[0];
    const payload = {
      skills,
      customer: selectedCustomer.value,
      problem: byId('agent-problem').value.trim(),
      resources: selectedResource.value,
      market: selectedMarket.value,
      assets: byId('agent-assets').value.trim()
    };
    liveButton.disabled = true;
    liveButton.textContent = language === 'fa' ? 'در حال تحلیل…' : 'Analyzing…';
    liveState.textContent = language === 'fa' ? 'درخواست به سرور امن ارسال شد؛ لطفاً صفحه را نبند.' : 'The request was sent to the secure server. Keep this page open.';
    liveResult.hidden = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 65000);
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Hplus-Access-Code': accessCode
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
      liveOutput.value = data.answer || (language === 'fa' ? 'پاسخ قابل خواندن دریافت نشد.' : 'No readable answer received.');
      liveResult.hidden = false;
      liveState.textContent = language === 'fa' ? 'تحلیل آماده شد. پاسخ را بررسی کن و پیش از هر تصمیم تجاری، فرضیه‌ها را با مشتری واقعی بیازما.' : 'Analysis is ready. Review it and test its hypotheses with real customers before making business decisions.';
      liveResult.scrollIntoView({behavior:'smooth', block:'nearest'});
    } catch (error) {
      liveState.textContent = error.name === 'AbortError'
        ? (language === 'fa' ? 'زمان درخواست تمام شد. دوباره تلاش کن.' : 'The request timed out. Please try again.')
        : (language === 'fa' ? `خطا: ${error.message}` : `Error: ${error.message}`);
    } finally {
      clearTimeout(timeoutId);
      liveButton.disabled = false;
      liveButton.textContent = language === 'fa' ? 'اجرای تحلیل با AI' : 'Run AI analysis';
    }
  });

  async function copyLiveText() {
    try {
      await navigator.clipboard.writeText(liveOutput.value);
      liveState.textContent = language === 'fa' ? 'تحلیل کپی شد.' : 'Analysis copied.';
    } catch (_) {
      liveOutput.focus(); liveOutput.select();
      document.execCommand('copy');
      liveState.textContent = language === 'fa' ? 'متن انتخاب شد؛ با Ctrl+C کپی کن.' : 'Text selected; press Ctrl+C to copy.';
    }
  }
  byId('copyLiveResult').addEventListener('click', copyLiveText);
  byId('downloadLiveResult').addEventListener('click', () => {
    const blob = new Blob([liveOutput.value], {type:'text/markdown;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'Hplus-Opportunity-Analysis.md';
    document.body.appendChild(anchor); anchor.click(); anchor.remove();
    URL.revokeObjectURL(url);
  });
})();
