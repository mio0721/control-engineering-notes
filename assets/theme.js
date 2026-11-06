(()=>{
  const key='robot-note-theme';
  const button=document.getElementById('themeToggle');
  if(!button)return;
  function apply(value){
    const theme=value==='dark'?'dark':'light';
    document.documentElement.dataset.theme=theme;
    button.setAttribute('aria-pressed',String(theme==='dark'));
    button.querySelector('.theme-icon').textContent=theme==='dark'?'☀':'☾';
    button.querySelector('.theme-label').textContent=theme==='dark'?'日间模式':'夜间模式';
    window.dispatchEvent(new Event('robot-theme-changed'));
  }
  apply(document.documentElement.dataset.theme);
  button.addEventListener('click',()=>{
    const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
    try{localStorage.setItem(key,next)}catch(e){}
    apply(next);
  });
})();

// Load the shared responsive drawer without changing generated lesson markup.
(() => {
  const owner=document.currentScript;
  if(!owner)return;
  const script=document.createElement('script');
  script.src=new URL('mobile-panels.js',owner.src).href;
  document.head.appendChild(script);
})();
