// pwa.js - register SW and show install prompt
(function(){
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e)=>{
    e.preventDefault();
    deferredPrompt = e;
    // show install UI if an element exists
    const installBtn = document.getElementById('pwa-install');
    if(installBtn){
      installBtn.style.display = 'inline-block';
      installBtn.addEventListener('click', async ()=>{
        if(!deferredPrompt) return;
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        deferredPrompt = null;
        installBtn.style.display = 'none';
      });
    }
  });

  // register SW after DOM is ready and use a relative path so it works on subpaths (GitHub Pages)
  document.addEventListener('DOMContentLoaded', ()=>{
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('./service-worker.js').then(()=>{
        console.log('Service worker (service-worker.js) registered');
      }).catch(e=>{ console.warn('Service worker registration failed', e); });
    }
  });
  // hide install button if app was already installed
  window.addEventListener('appinstalled', ()=>{
    try{ const b = document.getElementById('pwa-install'); if(b) b.style.display='none'; console.log('App installed'); }catch(_){}
  });
})();
