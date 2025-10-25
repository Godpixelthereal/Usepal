(function(){
  try {
    const params = new URLSearchParams(window.location.search);
    const devFlag = params.get('dev');
    const isDev = devFlag === '1' || devFlag === 'true' || params.has('dev');
    if(!isDev) return;

    const style = document.createElement('style');
    style.textContent = `
      .pal-devbar { position: fixed; top: 10px; right: 10px; z-index: 9999; background: #111827; color: #e5e7eb; border: 1px solid #1f2937; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.35); padding: 8px; display:flex; align-items:center; gap:8px; font-family: Inter, system-ui, -apple-system, sans-serif; }
      .pal-devbar .title { font-weight: 600; color:#93c5fd; margin-right: 6px; }
      .pal-devbar .btn { padding: 6px 10px; border-radius: 10px; border: 1px solid #1f2937; background: #0b1220; color: #e5e7eb; cursor: pointer; font-size: 12px; }
      .pal-devbar .btn.primary { background: #60a5fa; color: #0b1220; border-color:#60a5fa; font-weight: 700; }
      .pal-devbar .btn:hover { filter: brightness(1.05); }
      .pal-devbar .close { margin-left: 6px; background: transparent; color:#9ca3af; border-color: transparent; }
      @media (max-width: 480px){ .pal-devbar { left: 10px; right: auto; flex-wrap: wrap; } }
    `;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.className = 'pal-devbar';
    bar.innerHTML = `
      <span class="title">DEV</span>
      <button class="btn primary" id="palResetOnboarding" aria-label="Reset Onboarding">Reset Onboarding</button>
      <button class="btn" id="palRestartTour" aria-label="Restart Tour">Restart Tour</button>
      <button class="btn" id="palSetOnboarded" aria-label="Mark Onboarded">Onboarded ✓</button>
      <button class="btn" id="palClearStorage" aria-label="Clear Storage">Clear Storage</button>
      <button class="btn close" id="palDevClose" aria-label="Close Dev Bar">✕</button>
    `;
    document.body.appendChild(bar);

    function go(url){ try { window.location.href = url; } catch(e){} }

    document.getElementById('palResetOnboarding').addEventListener('click', function(){
      try {
        localStorage.removeItem('palOnboarded');
        localStorage.removeItem('palTourTaken');
      } catch(e){}
      go('index.html?forceOnboarding=true&dev=1');
    });

    document.getElementById('palRestartTour').addEventListener('click', function(){
      try {
        localStorage.setItem('palOnboarded','true');
        localStorage.removeItem('palTourTaken');
      } catch(e){}
      if (location.pathname.endsWith('overview.html')) { location.reload(); }
      else { go('overview.html?dev=1'); }
    });

    document.getElementById('palSetOnboarded').addEventListener('click', function(){
      try { localStorage.setItem('palOnboarded','true'); } catch(e){}
      go('overview.html?dev=1');
    });

    document.getElementById('palClearStorage').addEventListener('click', function(){
      try { localStorage.clear(); } catch(e){}
      go(location.pathname + '?dev=1');
    });

    document.getElementById('palDevClose').addEventListener('click', function(){
      bar.remove();
    });

    // Quick keyboard toggle using backtick (~) to show/hide
    document.addEventListener('keydown', function(e){
      if(e.key === '`' || e.key === '~'){
        bar.style.display = bar.style.display === 'none' ? 'flex' : 'none';
      }
    });
  } catch(err){ /* swallow dev init errors */ }
})();