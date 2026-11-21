/* H+ Sales Guide: local deterministic sales assistant. No chat scraping, tracking, or remote AI calls. */
(function () {
  'use strict';
  if (document.getElementById('hps-agent-root')) return;
  const cfg = Object.assign({leadEndpoint:'',extensionStoreUrl:'',desktopTrialUrl:'',privacyPolicyUrl:'',contactEmail:'',publicReleaseReady:false},window.HPlusSalesConfig||{});
  const fa = (document.documentElement.lang||'fa').toLowerCase().startsWith('fa');
  const t = (f,e)=>fa?f:e;
  const el=(tag,klass,text)=>{const x=document.createElement(tag);if(klass)x.className=klass;if(text!==undefined)x.textContent=text;return x};
  const root=el('div');root.id='hps-agent-root';root.setAttribute('dir',fa?'rtl':'ltr');
  const toggle=el('button','hps-launch',t('راهنمای هوشمند خرید H+','H+ Product Guide'));toggle.type='button';toggle.setAttribute('aria-expanded','false');
  const panel=el('section','hps-panel');panel.setAttribute('role','dialog');panel.setAttribute('aria-label',t('راهنمای فروش AI Memory Hub','AI Memory Hub Sales Guide'));
  const head=el('div','hps-header');const headleft=el('div');headleft.append(el('div','hps-head-title','AI Memory Hub One'),el('div','hps-head-note',t('راهنمای خودکار محصولات — پیش‌نمایش','Automated product guide — preview')));
  const close=el('button','hps-close','×');close.type='button';close.setAttribute('aria-label',t('بستن','Close'));head.append(headleft,close);
  const chat=el('div','hps-chat');chat.setAttribute('role','log');chat.setAttribute('aria-live','polite');
  const actions=el('div','hps-actions');const inputrow=el('form','hps-inputrow');const input=el('input','hps-input');input.type='text';input.maxLength=350;input.placeholder=t('سؤالت را بنویس...','Type a question...');input.setAttribute('aria-label',input.placeholder);
  const send=el('button','hps-send',t('ارسال','Send'));send.type='submit';inputrow.append(input,send);
  const lead=el('form','hps-lead');lead.autocomplete='on';const leadTitle=el('strong','',t('درخواست نسخه آزمایشی / تماس','Request a trial / contact'));lead.append(leadTitle);
  function labeled(label,type,max){const l=el('label','',label);const i=el('input');i.required=true;i.type=type;i.maxLength=max;l.append(i);lead.append(l);return i}
  const fullName=labeled(t('نام','Name'),'text',90),email=labeled(t('ایمیل','Email'),'email',200);
  const lplan=el('label','',t('نوع استفاده','Plan'));const plan=el('select');for(const [value,f,e] of [['personal','شخصی','Personal'],['team','تیمی','Team'],['business','سازمانی','Business']]){let o=el('option','',t(f,e));o.value=value;plan.append(o)}lplan.append(plan);lead.append(lplan);
  const lnotes=el('label','',t('توضیح کوتاه (اختیاری)','Short note (optional)'));const notes=el('textarea');notes.maxLength=500;notes.rows=2;notes.required=false;lnotes.append(notes);lead.append(lnotes);
  const honeypot=el('input');honeypot.type='text';honeypot.name='website';honeypot.tabIndex=-1;honeypot.autocomplete='off';honeypot.style.display='none';lead.append(honeypot);
  const consentLabel=el('label','hps-checkbox');const consent=el('input');consent.type='checkbox';consent.required=true;const consentText=el('span','',t('با تماس درباره همین محصول و نگهداری اطلاعات درخواست در سرویس امن موافقم.','I agree to be contacted about this product and have my request stored securely.'));consentLabel.append(consent,consentText);lead.append(consentLabel);
  const privacy=el('div','hps-muted',t('از درج رمز عبور، اطلاعات حساب AI و داده حساس خودداری کن.','Never submit passwords, AI account information or sensitive data.'));lead.append(privacy);
  const leadSend=el('button','hps-primary',t('ثبت درخواست','Submit request'));leadSend.type='submit';lead.append(leadSend);
  panel.append(head,chat,actions,lead,inputrow);root.append(toggle,panel);document.body.append(root);
  function reply(text,link,linkText){let msg=el('div','hps-msg bot',text);if(link){let a=el('a','hps-link',linkText||link);a.href=link;a.rel='noopener noreferrer';a.target='_blank';msg.append(a)}chat.append(msg);chat.scrollTop=chat.scrollHeight}
  function user(text){chat.append(el('div','hps-msg user',text));chat.scrollTop=chat.scrollHeight}
  function showLead(chosen){if(chosen)plan.value=chosen;if(!cfg.leadEndpoint && !cfg.contactEmail){reply(t('فرم ثبت درخواست آنلاین هنوز فعال نشده است. پس از راه‌اندازی سرویس امن ثبت سفارش، این قسمت قابل استفاده می‌شود.','Online requests are not active yet. A secure lead service is required.'));return}if(!cfg.privacyPolicyUrl){reply(t('ثبت اطلاعات مشتری تا انتشار سیاست حریم خصوصی غیرفعال است.','Lead collection is disabled until a privacy policy is published.'));return}lead.classList.add('open');inputrow.style.display='none';leadSend.focus()}
  function help(query){const q=String(query||'').trim().toLowerCase();if(!q)return;
    if(/(قیمت|هزینه|price|اشتراک|subscription)/i.test(q)) return reply(t(cfg.priceTextFa||'قیمت نهایی هنوز اعلام نشده است.',cfg.priceTextEn||'Final pricing is not announced yet.'));
    if(/(نصب|دانلود|افزونه|extension|install|download)/i.test(q)){ if(cfg.publicReleaseReady&&/^https:\/\//.test(cfg.extensionStoreUrl)){return reply(t('نسخه منتشرشده را از فروشگاه رسمی نصب کن.','Install from the official extension store.'),cfg.extensionStoreUrl,t('مشاهده افزونه رسمی','Official extension listing'))}return reply(t('افزونه عمومی هنوز منتشر نشده است. نسخه فعلی پیش‌نمایش است و نصب عمومی تنها پس از آزمون و انتشار رسمی فعال می‌شود.','The public extension is not yet released; a verified store listing will be provided after approval.')) }
    if(/(امنیت|حریم|رمز|privacy|security|encrypted|encryption)/i.test(q))return reply(t('محصول با رویکرد local-first طراحی شده است. پایگاه داده فعال نسخه آزمایشی هنوز به‌طور کامل رمزنگاری نشده؛ داده حساس واقعی وارد نکنید.','The product is local-first. Active database encryption is not yet complete in the preview; avoid sensitive real data.'));
    if(/(کلود|claude|chatgpt|جمینای|gemini|perplexity|deepseek|حافظه|memory|مدل)/i.test(q))return reply(t('AI Memory Hub برای حافظه تأییدشده پروژه‌ها و استفاده از آن در چند مرورگر طراحی شده است. اتصال کامل و خودکار حساب‌های آنلاین هنوز در توسعه است.','AI Memory Hub shares approved project context across browsers. Fully automatic online-account sync is still in development.'));
    if(/(تیمی|team|سازمانی|business|enterprise)/i.test(q))return reply(t('گزینه تیمی و سازمانی برای مدیریت اعضا و دسترسی پروژه‌ها طراحی شده است؛ شرایط تجاری هنوز نهایی نشده.','Team and business plans are designed for project permissions and members; commercial terms are not final.'));
    if(/(خرید|سفارش|آزمایشی|demo|trial|buy|order|contact|تماس)/i.test(q))return showLead();
    return reply(t('می‌توانم درباره امکانات، امنیت، نصب، طرح‌های شخصی و تیمی راهنمایی کنم. برای درخواست نسخه آزمایشی گزینه «درخواست نسخه آزمایشی» را انتخاب کن.','I can explain features, security, installation and plans. Choose Request trial to get in touch.'));
  }
  function chip(f,e,handler){let b=el('button','hps-chip',t(f,e));b.type='button';b.addEventListener('click',handler);actions.append(b)}
  chip('امکانات','Features',()=>help('حافظه'));chip('امنیت','Security',()=>help('امنیت'));chip('قیمت','Pricing',()=>help('قیمت'));chip('درخواست نسخه آزمایشی','Request trial',()=>showLead());
  function setOpen(open){panel.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));if(open&&chat.childElementCount===0)reply(t('سلام! من راهنمای خودکار AI Memory Hub One هستم. این محصول هنوز در مرحله آزمایشی است. چه چیزی می‌خواهی بدانی؟','Hi! I am the AI Memory Hub One product guide. This is a preview. How can I help?'))}
  toggle.addEventListener('click',()=>setOpen(!panel.classList.contains('open')));close.addEventListener('click',()=>setOpen(false));
  inputrow.addEventListener('submit',(ev)=>{ev.preventDefault();let q=input.value.trim();if(!q)return;user(q);input.value='';help(q)});
  lead.addEventListener('submit',async (ev)=>{
    ev.preventDefault(); if(!lead.reportValidity())return;
    const payload={name:fullName.value.trim(),email:email.value.trim(),plan:plan.value,note:notes.value.trim(),consent:Boolean(consent.checked),website:honeypot.value,source:'hplus-sales-widget',product:'ai-memory-hub-one'};
    if(!cfg.privacyPolicyUrl){reply(t('تا انتشار سیاست حریم خصوصی ثبت درخواست فعال نیست.','A privacy policy is required.'));return}
    if(!cfg.leadEndpoint){
      if(!cfg.contactEmail){reply(t('روش دریافت درخواست هنوز تنظیم نشده است.','No request channel configured.'));return}
      const subject=encodeURIComponent('AI Memory Hub One - trial request');
      const body=encodeURIComponent(`Name: ${payload.name}\nEmail: ${payload.email}\nPlan: ${payload.plan}\nNote: ${payload.note}`);
      const mailto=`mailto:${encodeURIComponent(cfg.contactEmail)}?subject=${subject}&body=${body}`;
      const a=el('a','hps-link',t('بازکردن برنامه ایمیل برای ارسال درخواست','Open email app to send request'));a.href=mailto;lead.append(a);
      reply(t('درخواست هنوز ارسال نشده است؛ لینک ایمیل زیر را باز کن و ارسال را تأیید کن.','Not sent yet; open the email link and send it.'));return;
    }
    if(!/^https:\/\//.test(cfg.leadEndpoint)){reply(t('نشانی سرویس ثبت درخواست معتبر نیست.','Invalid request service URL.'));return}
    leadSend.disabled=true;leadSend.textContent=t('در حال ارسال...','Submitting...');
    try{
      const r=await fetch(cfg.leadEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(r.status!==201)throw Error('HTTP '+r.status);
      lead.classList.remove('open');inputrow.style.display='flex';lead.reset();reply(t('درخواست اولیه ثبت شد. این پیام تأیید خرید یا پرداخت نیست.','Your trial request was recorded. This is not a payment or purchase confirmation.'));
    }catch(e){reply(t('ارسال درخواست موفق نبود. بعداً دوباره امتحان کن.','Request submission failed. Please try again later.'))}
    finally{leadSend.disabled=false;leadSend.textContent=t('ثبت درخواست','Submit request')}
  });
  if(cfg.privacyPolicyUrl&&/^https:\/\//.test(cfg.privacyPolicyUrl)){
    const a=el('a','hps-link',t('سیاست حریم خصوصی','Privacy policy'));a.href=cfg.privacyPolicyUrl;a.target='_blank';a.rel='noopener noreferrer';privacy.append(document.createTextNode(' '),a);
  }
})();
