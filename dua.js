// dua.js - improved dua rendering, search, copy and bookmarks
const DUA_LIST = [
  {id:1, ar:'رَبِّ زِدْنِي عِلْمًا', bn:'হে আমার প্রতিপালক, আমাকে জ্ঞান বৃদ্ধি করে দিন।'},
  {id:2, ar:'اللَّهُمَّ اغْفِرْ لِي', bn:'হে আল্লাহ, আমাকে ক্ষমা করুন।'},
  {id:3, ar:'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً', bn:'হে আমাদের প্রতিপালক, আমাদেরকে দুনিয়াতে কল্যাণ দাও।'},
  {id:4, ar:'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', bn:'হে আমার প্রতিপালক, আমার পিতামাতার প্রতি দয়া করুন যেমন তারা আমাকে ছোটবেলায় লালন করেছেন।'},
  {id:5, ar:'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ', bn:'হে আল্লাহ, আমি আপনার কাছে আশ্রয় চাই দুঃখ ও চিন্তা থেকে।'},
  {id:6, ar:'اللَّهُمَّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ', bn:'হে আল্লাহ, আমাকে নামাজ কায়েমকারীদের অন্তর্ভুক্ত করুন।'},
  {id:7, ar:'رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ', bn:'হে আমার প্রতিপালক, আমাকে সৎ সন্তান দান করুন।'},
  {id:8, ar:'اللَّهُمَّ ثَبِّتْ قَلْبِي عَلَى دِينِكَ', bn:'হে আল্লাহ, আমার অন্তরকে আপনার দ্বীনের উপর দৃঢ় করুন।'},
  {id:9, ar:'اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ', bn:'হে আল্লাহ, আমাকে তওবাকারীদের অন্তর্ভুক্ত করুন।'},
  {id:10, ar:'رَبِّ نَجِّنِي مِنَ الْقَوْمِ الظَّالِمِينَ', bn:'হে আমার প্রতিপালক, আমাকে জালিম সম্প্রদায় থেকে রক্ষা করুন।'},
  {id:11, ar:'اللَّهُمَّ اجْعَلْنِي شَاكِرًا', bn:'হে আল্লাহ, আমাকে কৃতজ্ঞ বানান।'},
  {id:12, ar:'اللَّهُمَّ بَارِكْ لَنَا فِي رِزْقِنَا', bn:'হে আল্লাহ, আমাদের রিজিকে বরকত দিন।'},
  {id:13, ar:'اللَّهُمَّ اشْفِ مَرْضَانَا', bn:'হে আল্লাহ, আমাদের রোগীদের আরোগ্য দিন।'},
  {id:14, ar:'اللَّهُمَّ اجْعَلْ قُرْآنَ رَبِيعَ قَلْبِي', bn:'হে আল্লাহ, কুরআনকে আমার অন্তরের বসন্ত বানান।'},
  {id:15, ar:'اللَّهُمَّ اجْعَلْنِي مِنْ أَهْلِ الْجَنَّةِ', bn:'হে আল্লাহ, আমাকে জান্নাতের অধিবাসীর অন্তর্ভুক্ত করুন।'},
  // 15 more (additional common duas)
  {id:16, ar:'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ', bn:'হে প্রতিপালক, আমাকে আপনার অনুগ্রহের জন্য কৃতজ্ঞ হতে অনুপ্রাণিত করো।'},
  {id:17, ar:'اللَّهُمَّ اهْدِنَا وَسَدِّدْنَا', bn:'হে আল্লাহ, আমাদের সঠিক পথে পরিচালিত করো এবং আমাদের সঠিক পথে অবস্থানদান করো।'},
  {id:18, ar:'رَبِّ زِدْنِي تَوْفِيقًا', bn:'হে আল্লাহ, আমাকে সঠিক কাজের জন্য সফলতা দাও।'},
  {id:19, ar:'اللَّهُمَّ اغْفِرْ لَنَا وَلِوَالِدِينَا', bn:'হে আল্লাহ, আমাদের ও আমাদের পিতামাতাকে ক্ষমা করুন।'},
  {id:20, ar:'رَبِّ أَعُوذُ بِكَ مِنْ كُلِّ شَيْءٍ سُوءٍ', bn:'হে প্রতিপালক, আমি আপনার কাছে সমস্ত খারাপ থেকে আশ্রয় চাই।'},
  {id:21, ar:'اللَّهُمَّ اجْعَلْنِي مِنَ الْمُتَوَكِّلِينَ عَلَيْكَ', bn:'হে আল্লাহ, আমাকে আপনার ওপর ভরসাকারী বানাও।'},
  {id:22, ar:'رَبِّ اغْفِرْ لِي وَارْحَمْنِي', bn:'হে প্রতিপালক, আমাকে ক্ষমা করো এবং আমার প্রতি দয়া করো।'},
  {id:23, ar:'اللَّهُمَّ ارحم موتانا', bn:'হে আল্লাহ, আমাদের মৃতদের প্রতি দয়া করো।'},
  {id:24, ar:'رَبِّ هَبْ لِي صَبْرًا وَسَلَامًا', bn:'হে প্রতিপালক, আমাকে ধৈর্য ও শান্তি দাও।'},
  {id:25, ar:'اللَّهُمَّ اهدِ قُلُوبَنَا', bn:'হে আল্লাহ, আমাদের অন্তরকে সঠিক পথে দিকনির্দেশ করো।'},
  {id:26, ar:'رَبِّ اشْرَحْ لِي صَدْرِي', bn:'হে প্রতিপালক, আমার হৃৎপিণ্ডকে প্রশস্ত করো।'},
  {id:27, ar:'اللَّهُمَّ اجْعَلْنِي مِنَ الْمُحْسِنِينَ', bn:'হে আল্লাহ, আমাকে সৎ কাজীরা বানাও।'},
  {id:28, ar:'رَبِّ اِنِّی مَغْلُوبٌ فَانْتَصِرْ لِي', bn:'হে প্রতিপালক, আমি পরাস্ত; আমাকে সাহায্য করো।'},
  {id:29, ar:'اللَّهُمَّ اجْعَلْنَا مِنَ الَّذِينَ يَسْتَمِعُونَ الْقَوْلَ فَيَتَّبِعُونَ أَحْسَنَهُ', bn:'হে আল্লাহ, আমাদের তাদের মধ্যে করো যারা শ্রবণ করে এবং উত্তম অনুশীলন করে।'},
  {id:30, ar:'رَبِّ تَقَبَّلْ مِنِّي', bn:'হে প্রতিপালক, আমার থেকে গ্রহণ করো (আমার ইবাদত)।'}
];

function initDuaPage(){
  const listEl = document.getElementById('duaList') || document.getElementById('duaContainer');
  const search = document.getElementById('duaSearch');
  const viewBookmarks = document.getElementById('viewBookmarkedDuas');

  let bookmarks = JSON.parse(localStorage.getItem('dua_bookmarks')||'[]');

  function saveBookmarks(){ localStorage.setItem('dua_bookmarks', JSON.stringify(bookmarks)); }

  function isBookmarked(id){ return bookmarks.indexOf(id) !== -1 }

  function createCard(d){
    const wrapper = document.createElement('div'); wrapper.className='card';
    const body = document.createElement('div'); body.className='card-body';
    const h = document.createElement('h3'); h.className='card-title font-ar'; h.textContent = d.ar;
    const p = document.createElement('p'); p.className='verse-bn'; p.textContent = d.bn;
    const controls = document.createElement('div'); controls.className='flex gap-2 mt-2';
    const bookmarkBtn = document.createElement('button'); bookmarkBtn.className='icon-btn bookmark-dua'; bookmarkBtn.title='Bookmark';
    bookmarkBtn.dataset.id = d.id; bookmarkBtn.textContent = isBookmarked(d.id)?'★':'☆';
    const copyBtn = document.createElement('button'); copyBtn.className='icon-btn copy-dua'; copyBtn.dataset.id = d.id; copyBtn.title='Copy'; copyBtn.textContent='⎘';
    controls.appendChild(bookmarkBtn); controls.appendChild(copyBtn);
    body.appendChild(h); body.appendChild(p); body.appendChild(controls);
    wrapper.appendChild(body);

    // handlers
    bookmarkBtn.addEventListener('click', ()=>{
      const id = +bookmarkBtn.dataset.id; const idx = bookmarks.indexOf(id);
      if(idx>=0){ bookmarks.splice(idx,1); bookmarkBtn.textContent='☆'; showToast('Bookmark removed') }
      else{ bookmarks.push(id); bookmarkBtn.textContent='★'; showToast('Bookmarked') }
      saveBookmarks();
    });

    copyBtn.addEventListener('click', async ()=>{
      const id = +copyBtn.dataset.id; const dua = DUA_LIST.find(x=>x.id===id);
      try{ await navigator.clipboard.writeText(dua.ar + '\n' + dua.bn); showToast('Copied') }
      catch(e){ try{ /* fallback */ const ta = document.createElement('textarea'); ta.value = dua.ar + '\n' + dua.bn; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); showToast('Copied'); }catch{ showToast('Copy failed') } }
    });

    return wrapper;
  }

  function render(list){
    listEl.innerHTML = '';
    if(!list || list.length===0){ listEl.innerHTML = '<div class="loading-message">কোনো দোয়া পাওয়া যায়নি</div>'; return }
    const fragment = document.createDocumentFragment();
    list.forEach(d=> fragment.appendChild(createCard(d)));
    listEl.appendChild(fragment);
  }

  function renderFiltered(){
    const q = (search && search.value||'').trim().toLowerCase();
    if(!q) return render(DUA_LIST);
    const filtered = DUA_LIST.filter(d=> (d.ar||'').toLowerCase().includes(q) || (d.bn||'').toLowerCase().includes(q));
    render(filtered);
  }

  if(search) search.addEventListener('input', renderFiltered);
  if(viewBookmarks) viewBookmarks.addEventListener('click', ()=>{
    const ids = JSON.parse(localStorage.getItem('dua_bookmarks')||'[]');
    const list = DUA_LIST.filter(d=>ids.includes(d.id));
    render(list);
  });

  render(DUA_LIST);
}

// helper toast (reused if #toast exists)
function showToast(msg, t=1400){ let el = document.getElementById('toast'); if(!el){ el = document.createElement('div'); el.id='toast'; el.className='toast'; document.body.appendChild(el);} el.textContent=msg; el.classList.add('show'); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'), t); }

