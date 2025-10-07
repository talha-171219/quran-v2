// tafsir.js
// Expected files: ./tafsir/volume-1.json ... ./tafsir/volume-18.json
// Each JSON should contain { title: 'Volume 1', content: '<p>...</p>' } or an array of paragraphs.

const volumesEl = document.getElementById('volumes');
const viewEl = document.getElementById('tafsir-view');
const titleEl = document.getElementById('tafsir-title');
const contentEl = document.getElementById('tafsir-content');
const closeBtn = document.getElementById('close-tafsir');

function makeVolumeLink(i){
  const a = document.createElement('button');
  a.className = 'card';
  a.style.display = 'block';
  a.style.textAlign = 'left';
  a.style.marginBottom = '6px';
  a.innerHTML = `<div style="font-weight:600">Volume ${i}</div><div style="font-size:0.95rem;color:#555">Ibn Kathir — Bangla</div>`;
  a.addEventListener('click', ()=>loadVolume(i));
  return a;
}

for(let i=1;i<=18;i++){
  volumesEl.appendChild(makeVolumeLink(i));
}

async function loadVolume(i){
  const url = `./tafsir/volume-${i}.json`;
  titleEl.textContent = `Volume ${i}`;
  contentEl.innerHTML = '<div class="loading-message">লোড হচ্ছে...</div>';
  viewEl.style.display = 'block';
  try{
    const r = await fetch(url);
    if(!r.ok) throw new Error('Not found');
    const j = await r.json();
    // support {title, content} or array of paragraphs
    let html = '';
    if(Array.isArray(j)){
      html = j.map(p=>`<p style="margin-bottom:1rem;line-height:1.6">${p}</p>`).join('');
    }else if(j.content){
      html = typeof j.content === 'string' ? j.content : (Array.isArray(j.content)? j.content.map(p=>`<p>${p}</p>`).join('') : JSON.stringify(j.content));
    }else{
      html = JSON.stringify(j);
    }
    contentEl.innerHTML = html;
    // ensure fonts are readable
    contentEl.querySelectorAll('p').forEach(p=>p.style.fontSize='16px');
  }catch(e){
    contentEl.innerHTML = `<div class="loading-message">Volume ${i} not found.</div>`;
  }
}

closeBtn.addEventListener('click', ()=>{ viewEl.style.display='none'; contentEl.innerHTML=''; });

// Notes for integration: place 18 JSON files under ./tafsir/volume-1.json ...
// Each file should contain either an object: { "title": "Volume 1", "content": "<p>...</p>" }
// or an array of paragraphs ["para1","para2",...].
