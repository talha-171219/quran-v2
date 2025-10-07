// audio.js - renders audio panel inside index.html
const AUDIO_SURAH_META = [
  // small subset for demo; the app already has SURAH_NAMES in script.js, we'll use it if available
];

function initAudioPanel(){
  const container = document.getElementById('audioList');
  container.innerHTML = '';
  const meta = window.SURAH_NAMES || AUDIO_SURAH_META;
  meta.forEach(surah=>{
    const file = String(surah.id).padStart(3,'0') + '.mp3';
    const audioUrl = `audio/${file}`;
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <div class="card-body flex items-center justify-between">
        <div>
          <div class="font-semibold">${surah.id}. ${surah.name}</div>
          <div class="text-sm text-muted font-ar">${surah.name_ar}</div>
        </div>
        <audio controls preload="none" data-src="${audioUrl}" class="w-48">Your browser does not support audio.</audio>
      </div>
    `;
    container.appendChild(card);
  });

  // delegated play: set src when user interacts to avoid preloading
  // When a user starts playback: initialize src only once and pause any other playing audio
  container.addEventListener('play', (e)=>{
    const a = e.target; if(!a || a.tagName !== 'AUDIO') return;
    try{
      // initialize src only on first interaction to avoid resetting currentTime on subsequent toggles
      if(!a.dataset.initialized){
        a.src = a.dataset.src || a.src;
        a.dataset.initialized = '1';
      }
      // pause other audios so only one plays at a time (mobile-friendly)
      document.querySelectorAll('audio').forEach(other=>{ if(other!==a && !other.paused){ try{ other.pause(); }catch(_){} } });
    }catch(_){}
  }, true);

  // Revoke Blob URLs (if any created elsewhere) when page unloads to free memory
  window.addEventListener('beforeunload', ()=>{
    try{ document.querySelectorAll('audio').forEach(a=>{ if(a && a._blobUrl){ try{ URL.revokeObjectURL(a._blobUrl); }catch(_){} a._blobUrl = null; } }); }catch(_){}
  });
}

// open/close SPA panels
function openPanelByName(name){
  document.querySelectorAll('.spa-panel').forEach(p=>p.classList.add('hidden'));
  const el = document.getElementById(name+'-panel'); if(!el) return;
  el.classList.remove('hidden');
  if(name==='audio') initAudioPanel();
  if(name==='dua') if(typeof initDuaPage==='function') initDuaPage();
}

function closePanelByName(name){
  const el = document.getElementById(name+'-panel'); if(el) el.classList.add('hidden');
}

// wire header action buttons
document.addEventListener('click', (e)=>{
  const t = e.target.closest('[data-panel]');
  if(t){ e.preventDefault(); openPanelByName(t.dataset.panel); }
  const cp = e.target.closest('.close-panel'); if(cp){ closePanelByName(cp.dataset.target); }
});

// export for debugging
window.openPanelByName = openPanelByName;