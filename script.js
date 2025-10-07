/*
    script.js
    - mobile-first, vanilla JS app
    - provides: static surah list, search, viewer, bookmarks, last-read, settings
    - registers service worker and PWA prompt
*/

const SURAH_NAMES = [
    {id:1, name:"Al-Fātiḥah", name_ar:"الفاتحة"},
    {id:2, name:"Al-Baqarah", name_ar:"البقرة"},
    {id:3, name:"Āl ʿImrān", name_ar:"آل عمران"},
    {id:4, name:"An-Nisā'", name_ar:"النساء"},
    {id:5, name:"Al-Mā'idah", name_ar:"المائدة"},
    {id:6, name:"Al-Anʿām", name_ar:"الأنعام"},
    {id:7, name:"Al-Aʿrāf", name_ar:"الأعراف"},
    {id:8, name:"Al-Anfāl", name_ar:"الأنفال"},
    {id:9, name:"At-Tawbah", name_ar:"التوبة"},
    {id:10, name:"Yūnus", name_ar:"يونس"},
    {id:11, name:"Hūd", name_ar:"هود"},
    {id:12, name:"Yūsuf", name_ar:"يوسف"},
    {id:13, name:"Ar-Raʿd", name_ar:"الرعد"},
    {id:14, name:"Ibrāhīm", name_ar:"إبراهيم"},
    {id:15, name:"Al-Ḥijr", name_ar:"الحجر"},
    {id:16, name:"An-Naḥl", name_ar:"النحل"},
    {id:17, name:"Al-Isrā'", name_ar:"الإسراء"},
    {id:18, name:"Al-Kahf", name_ar:"الكهف"},
    {id:19, name:"Maryam", name_ar:"مريم"},
    {id:20, name:"Ṭā-Hā", name_ar:"طه"},
    {id:21, name:"Al-Anbiyā'", name_ar:"الأنبياء"},
    {id:22, name:"Al-Ḥajj", name_ar:"الحج"},
    {id:23, name:"Al-Mu'minūn", name_ar:"المؤمنون"},
    {id:24, name:"An-Nūr", name_ar:"النور"},
    {id:25, name:"Al-Furqān", name_ar:"الفرقان"},
    {id:26, name:"Ash-Shu'ārā'", name_ar:"الشعراء"},
    {id:27, name:"An-Naml", name_ar:"النمل"},
    {id:28, name:"Al-Qaṣaṣ", name_ar:"القصص"},
    {id:29, name:"Al-ʿAnkabūt", name_ar:"العنكبوت"},
    {id:30, name:"Ar-Rūm", name_ar:"الروم"},
    {id:31, name:"Luqmān", name_ar:"لقمان"},
    {id:32, name:"As-Sajdah", name_ar:"السجدة"},
    {id:33, name:"Al-Aḥzāb", name_ar:"الأحزاب"},
    {id:34, name:"Saba'", name_ar:"سبأ"},
    {id:35, name:"Fāṭir", name_ar:"فاطر"},
    {id:36, name:"Yā Sīn", name_ar:"يس"},
    {id:37, name:"As-Sāffāt", name_ar:"الصافات"},
    {id:38, name:"Ṣād", name_ar:"ص"},
    {id:39, name:"Az-Zumar", name_ar:"الزمر"},
    {id:40, name:"Ghafir", name_ar:"غافر"},
    {id:41, name:"Fuṣṣilat", name_ar:"فصلت"},
    {id:42, name:"Ash-Shūrā", name_ar:"الشورى"},
    {id:43, name:"Az-Zukhruf", name_ar:"الزخرف"},
    {id:44, name:"Ad-Dukhān", name_ar:"الدخان"},
    {id:45, name:"Al-Jāthiyah", name_ar:"الجاثية"},
    {id:46, name:"Al-Aḥqāf", name_ar:"الأحقاف"},
    {id:47, name:"Muḥammad", name_ar:"محمد"},
    {id:48, name:"Al-Fatḥ", name_ar:"الفتح"},
    {id:49, name:"Al-Ḥujurāt", name_ar:"الحجرات"},
    {id:50, name:"Qāf", name_ar:"ق"},
    {id:51, name:"Adh-Dhāriyāt", name_ar:"الذاريات"},
    {id:52, name:"At-Ṭūr", name_ar:"الطور"},
    {id:53, name:"An-Najm", name_ar:"النجم"},
    {id:54, name:"Al-Qamar", name_ar:"القمر"},
    {id:55, name:"Ar-Raḥmān", name_ar:"الرحمن"},
    {id:56, name:"Al-Wāqiʿah", name_ar:"الواقعة"},
    {id:57, name:"Al-Ḥadīd", name_ar:"الحديد"},
    {id:58, name:"Al-Mujādilah", name_ar:"المجادلة"},
    {id:59, name:"Al-Ḥashr", name_ar:"الحشر"},
    {id:60, name:"Al-Mumtaḥanah", name_ar:"الممتحنة"},
    {id:61, name:"As-Saff", name_ar:"الصف"},
    {id:62, name:"Al-Jumu'ah", name_ar:"الجمعة"},
    {id:63, name:"Al-Munāfiqūn", name_ar:"المنافقون"},
    {id:64, name:"At-Taghābun", name_ar:"التغابن"},
    {id:65, name:"At-Talāq", name_ar:"الطلاق"},
    {id:66, name:"At-Tahrīm", name_ar:"التحريم"},
    {id:67, name:"Al-Mulk", name_ar:"الملك"},
    {id:68, name:"Al-Qalam", name_ar:"القلم"},
    {id:69, name:"Al-Ḥāqqah", name_ar:"الحق"},
    {id:70, name:"Al-Maʿārij", name_ar:"المعارج"},
    {id:71, name:"Nūḥ", name_ar:"نوح"},
    {id:72, name:"Al-Jinn", name_ar:"الجن"},
    {id:73, name:"Al-Muzzammil", name_ar:"المزمل"},
    {id:74, name:"Al-Muddaththir", name_ar:"المدثر"},
    {id:75, name:"Al-Qiyāmah", name_ar:"القيامة"},
    {id:76, name:"Al-Insān", name_ar:"الانسان"},
    {id:77, name:"Al-Mursalāt", name_ar:"المرسلات"},
    {id:78, name:"An-Naba'", name_ar:"النبأ"},
    {id:79, name:"An-Nāzi'āt", name_ar:"النازعات"},
    {id:80, name:"ʿAbasa", name_ar:"عبس"},
    {id:81, name:"At-Takwīr", name_ar:"التكوير"},
    {id:82, name:"Al-Infiṭār", name_ar:"الانفطار"},
    {id:83, name:"Al-Muṭaffifīn", name_ar:"المطففين"},
    {id:84, name:"Al-Inshiqāq", name_ar:"الانشقاق"},
    {id:85, name:"Al-Burūj", name_ar:"البروج"},
    {id:86, name:"At-Ṭāriq", name_ar:"الطارق"},
    {id:87, name:"Al-Aʿlā", name_ar:"الأعلى"},
    {id:88, name:"Al-Ghāshiyah", name_ar:"الغاشية"},
    {id:89, name:"Al-Fajr", name_ar:"الفجر"},
    {id:90, name:"Al-Balad", name_ar:"البلد"},
    {id:91, name:"Ash-Shams", name_ar:"الشمس"},
    {id:92, name:"Al-Layl", name_ar:"الليل"},
    {id:93, name:"Adh-Dhuha", name_ar:"الضحى"},
    {id:94, name:"Ash-Sharḥ", name_ar:"الشرح"},
    {id:95, name:"At-Tīn", name_ar:"التين"},
    {id:96, name:"Al-ʿAlaq", name_ar:"العلق"},
    {id:97, name:"Al-Qadr", name_ar:"القدر"},
    {id:98, name:"Al-Bayyinah", name_ar:"البينة"},
    {id:99, name:"Az-Zalzalah", name_ar:"الزلزلة"},
    {id:100, name:"Al-ʿĀdiyāt", name_ar:"العاديات"},
    {id:101, name:"Al-Qāriʿah", name_ar:"القارعة"},
    {id:102, name:"At-Takāthur", name_ar:"التكاثر"},
    {id:103, name:"Al-ʿAṣr", name_ar:"العصر"},
    {id:104, name:"Al-Humazah", name_ar:"الهمزة"},
    {id:105, name:"Al-Fīl", name_ar:"الفيل"},
    {id:106, name:"Quraysh", name_ar:"قريش"},
    {id:107, name:"Al-Māʿūn", name_ar:"الماعون"},
    {id:108, name:"Al-Kawthar", name_ar:"الكوثر"},
    {id:109, name:"Al-Kāfirūn", name_ar:"الكافرون"},
    {id:110, name:"An-Naṣr", name_ar:"النصر"},
    {id:111, name:"Al-Masad", name_ar:"المسد"},
    {id:112, name:"Al-Ikhlāṣ", name_ar:"الإخلاص"},
    {id:113, name:"Al-Falaq", name_ar:"الفلق"},
    {id:114, name:"An-Nās", name_ar:"الناس"}
];

// App state
let quranData = null;
const state = {
    bookmarks: JSON.parse(localStorage.getItem('quran_bookmarks')||'[]'),
    lastRead: JSON.parse(localStorage.getItem('quran_last_read')||'null'),
    settings: JSON.parse(localStorage.getItem('quran_settings')||'{}')
}

// Elements
const homeScreen = document.getElementById('home-screen');
const viewerScreen = document.getElementById('viewer-screen');
const surahListContainer = document.getElementById('surah-list-container');
const versesContainer = document.getElementById('verses-container');
const viewerSurahTitle = document.getElementById('viewer-surah-title');
const surahSearchInput = document.getElementById('surah-search');
const bookmarksPanel = document.getElementById('bookmarks-panel');
const bookmarksList = document.getElementById('bookmarks-list');
const viewBookmarksBtn = document.getElementById('view-bookmarks-btn');
const openSettingsBtn = document.getElementById('open-settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const toggleDark = document.getElementById('toggle-dark');
const arabicFontSize = document.getElementById('arabic-font-size');
const bengaliFontSize = document.getElementById('bengali-font-size');
const resumeBtn = document.getElementById('resume-btn');
const toastEl = document.getElementById('toast');

// Utility
function showToast(msg, time=1800){
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(()=>toastEl.classList.remove('show'), time);
}

function saveState(){
    localStorage.setItem('quran_bookmarks', JSON.stringify(state.bookmarks));
    localStorage.setItem('quran_last_read', JSON.stringify(state.lastRead));
    localStorage.setItem('quran_settings', JSON.stringify(state.settings));
}

// Load quran.json
async function loadQuranData(){
    try{
        const r = await fetch('quran.json');
        if(!r.ok) throw new Error('fetch failed');
        quranData = await r.json();
            // If quran.json contains placeholder names (e.g. "সুরা 1"), prefer our SURAH_NAMES
            if(quranData && Array.isArray(quranData.surahs)){
                quranData.surahs = quranData.surahs.map(s => {
                    const ref = SURAH_NAMES.find(x=>x.id===s.id);
                    if(ref){
                        // keep any existing verses/revelation but replace display names
                        return Object.assign({}, s, { name: ref.name, name_ar: ref.name_ar });
                    }
                    return s;
                });
                // debug: log first few mapped names so developer can verify in browser console
                console.log('quran.json loaded — sample surahs:', quranData.surahs.slice(0,6).map(s=>({id:s.id,name:s.name,name_ar:s.name_ar} )) );
            }
    }catch(e){
        console.warn('Could not load quran.json, building minimal in-memory from names');
        // build minimal structure that matches expected shape
        quranData = { surahs: SURAH_NAMES.map(s => ({ id: s.id, name: s.name, name_ar: s.name_ar, revelation: '---', verses:[{id:1,ar:'بِسْمِ اللّٰهِ',bn:'ইন দা নাম'}, {id:2,ar:'آية ...',bn:'অনুবাদ ...'}] })) };
    }
    renderSurahList(quranData.surahs);
}

// Render surah list
// Render surah list
function renderSurahList(list){
    if(!list || list.length===0){
        surahListContainer.innerHTML = '<div class="loading-message">কোনো সুরা পাওয়া যায়নি।</div>';
        return;
    }
    surahListContainer.innerHTML = '';
    list.forEach(surah=>{
        const ref = SURAH_NAMES.find(x=>x.id===surah.id) || surah;
        const displayName = ref.name || surah.name || `Surah ${surah.id}`;
        const displayArabic = ref.name_ar || surah.name_ar || '';
        const el = document.createElement('div'); el.className='surah-item'; el.tabIndex=0;
        el.innerHTML = `
            <div class="surah-id">${surah.id}</div>
            <div class="surah-info"><h3>${displayName}</h3><p>${displayArabic} • ${surah.revelation||''}</p></div>
            <div class="surah-arabic">${displayArabic}</div>`;
        el.addEventListener('click', ()=>showSurahViewer(surah.id));
        el.addEventListener('keydown', (e)=>{ if(e.key==='Enter') showSurahViewer(surah.id) });
        surahListContainer.appendChild(el);
    })
}

// Viewer
function showSurahViewer(surahId, verseId){
    const dataSurah = (quranData && quranData.surahs.find(s=>s.id===surahId));
    const ref = SURAH_NAMES.find(s=>s.id===surahId) || dataSurah || {id:surahId, name:`Surah ${surahId}`, name_ar:''};
    const surah = dataSurah || ref;
    if(!surah) return showToast('Surah not found');
    viewerSurahTitle.textContent = `${ref.name} — ${ref.name_ar}`;
    versesContainer.innerHTML = '';
    const verses = (surah.verses && surah.verses.length)? surah.verses : [{id:1,ar:'بِسْمِ اللَّهِ',bn:'আরম্ভ'}, {id:2,ar:'آية',bn:'অনুবাদ'}];
    verses.forEach(v=>{
        const item = document.createElement('article'); item.className='verse-item';
        item.dataset.surah = surah.id; item.dataset.verse = v.id;
        item.innerHTML = `
            <div class="verse-arabic">${v.ar} <span class="verse-number">(${v.id})</span></div>
            <div class="verse-bengali">${v.bn}</div>
            <div class="verse-meta">
                <div class="verse-actions">
                    <button class="small-btn bookmark-btn" title="Bookmark">🔖</button>
                    <button class="small-btn copy-btn" title="Copy">📋</button>
                </div>
            </div>`;
        // actions
        item.querySelector('.bookmark-btn').addEventListener('click', (e)=>{ e.stopPropagation(); toggleBookmark(surah.id, v.id, surah, v); });
        item.querySelector('.copy-btn').addEventListener('click', (e)=>{ e.stopPropagation(); copyVerseText(surah, v); });
        versesContainer.appendChild(item);
    })

    // Save last read
    state.lastRead = {surahId: surah.id, verseId: verseId || verses[0].id, title: surah.name}; saveState();

    // switch screens
    homeScreen.classList.remove('active'); viewerScreen.classList.add('active');
    // adjust font sizes
    applyFontSettings();
}

function showHome(){ viewerScreen.classList.remove('active'); homeScreen.classList.add('active'); }

// Search
surahSearchInput.addEventListener('input', (e)=>{
    const v = e.target.value.trim().toLowerCase();
    if(!v) return renderSurahList(quranData.surahs);
    const filtered = quranData.surahs.filter(s=> {
        const ref = SURAH_NAMES.find(x=>x.id===s.id) || s;
        return (ref.name||'').toLowerCase().includes(v) || (ref.name_ar||'').toLowerCase().includes(v) || (s.name||'').toLowerCase().includes(v) || s.id.toString()===v;
    });
    renderSurahList(filtered);
});

// Bookmarks
function toggleBookmark(surahId, verseId, surah, verse){
    const key = `${surahId}:${verseId}`;
    const i = state.bookmarks.findIndex(b=>b.key===key);
    if(i>=0){ state.bookmarks.splice(i,1); showToast('Bookmark removed') }
    else { state.bookmarks.push({key,surahId,verseId,title:surah.name, name_ar:surah.name_ar, bn:verse.bn, ar:verse.ar}); showToast('Bookmarked') }
    saveState(); renderBookmarksList();
}

function renderBookmarksList(){
    bookmarksList.innerHTML = '';
    if(state.bookmarks.length===0){ bookmarksList.innerHTML = '<div class="loading-message">No bookmarks</div>'; return }
    state.bookmarks.forEach(b=>{
        const el = document.createElement('div'); el.className='surah-item';
        el.innerHTML = `<div class="surah-info"><h3>${b.title}</h3><p>${b.name_ar} • v${b.verseId}</p></div>`;
        el.addEventListener('click', ()=>{ closePanel(bookmarksPanel); showSurahViewer(b.surahId, b.verseId); });
        const rm = document.createElement('button'); rm.className='small-btn'; rm.textContent='✕'; rm.style.marginLeft='8px'; rm.addEventListener('click',(e)=>{ e.stopPropagation(); state.bookmarks = state.bookmarks.filter(x=>x.key!==b.key); saveState(); renderBookmarksList(); });
        const row = document.createElement('div'); row.style.display='flex'; row.style.alignItems='center'; row.appendChild(el); row.appendChild(rm);
        bookmarksList.appendChild(row);
    })
}

// copy
async function copyVerseText(surah, verse){
    const txt = `${surah.name} ${surah.name_ar}:${verse.id}\n${verse.ar}\n${verse.bn}`;
    try{ await navigator.clipboard.writeText(txt); showToast('Copied to clipboard') }catch(e){ showToast('Copy failed') }
}

// settings
document.getElementById('open-settings-btn').addEventListener('click', ()=>openPanel(settingsPanel));
document.getElementById('close-settings').addEventListener('click', ()=>closePanel(settingsPanel));
document.getElementById('close-bookmarks').addEventListener('click', ()=>closePanel(bookmarksPanel));
viewBookmarksBtn.addEventListener('click', ()=>{ renderBookmarksList(); openPanel(bookmarksPanel) });

function openPanel(p){ p.classList.add('open') }
function closePanel(p){ p.classList.remove('open') }

toggleDark.addEventListener('change', ()=>{
    document.body.classList.toggle('dark', toggleDark.checked); state.settings.dark = toggleDark.checked; saveState();
});
arabicFontSize.addEventListener('input', applyFontSettings);
bengaliFontSize.addEventListener('input', applyFontSettings);
document.getElementById('clear-data').addEventListener('click', ()=>{ localStorage.clear(); state.bookmarks=[]; state.lastRead=null; state.settings={}; saveState(); renderBookmarksList(); showToast('Local data cleared') });

function applyFontSettings(){
    const a = +arabicFontSize.value; const b = +bengaliFontSize.value;
    document.querySelectorAll('.verse-arabic').forEach(el=>el.style.fontSize = a+'px');
    document.querySelectorAll('.verse-bengali').forEach(el=>el.style.fontSize = b+'px');
}

// resume
resumeBtn.addEventListener('click', ()=>{
    if(state.lastRead && state.lastRead.surahId) showSurahViewer(state.lastRead.surahId, state.lastRead.verseId);
    else showToast('No last-read saved');
});

// navigation
document.getElementById('back-to-home-btn').addEventListener('click', ()=>showHome());

// init
document.addEventListener('DOMContentLoaded', async ()=>{
    // apply saved settings
    if(state.settings.dark) document.body.classList.add('dark');
    if(state.settings.arabicFontSize) arabicFontSize.value = state.settings.arabicFontSize;
    if(state.settings.bengaliFontSize) bengaliFontSize.value = state.settings.bengaliFontSize;
    toggleDark.checked = !!state.settings.dark;
    arabicFontSize.value = state.settings.arabicFontSize || arabicFontSize.value;
    bengaliFontSize.value = state.settings.bengaliFontSize || bengaliFontSize.value;
    // load data
    await loadQuranData();
    renderBookmarksList();
    // register SW
    if('serviceWorker' in navigator){
    navigator.serviceWorker.register('service-worker.js').then(()=>console.log('SW registered')).catch(()=>console.warn('SW reg failed'))
    }

    // Support opening panels via hash: e.g., quran.html#bookmarks or #settings
    if(window.location.hash){
        const h = window.location.hash.replace('#','');
        if(h === 'bookmarks') { renderBookmarksList(); openPanel(bookmarksPanel); }
        if(h === 'settings') { openPanel(settingsPanel); }
    }
});

// save settings when changed
window.addEventListener('beforeunload', ()=>{
    state.settings.dark = toggleDark.checked; state.settings.arabicFontSize = arabicFontSize.value; state.settings.bengaliFontSize = bengaliFontSize.value; saveState();
});

// expose for debugging
window._Q = { state, loadQuranData, showSurahViewer };
