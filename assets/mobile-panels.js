/* Shared touch navigation for Algorithm Notes and Control Engineering Notes. */
(() => {
  'use strict';
  function mount() {
    if(document.querySelector('.mobile-toolbar'))return;
    const mast=document.querySelector('.mast'),layout=document.querySelector('.layout');
    if(!mast||!layout)return;
    const entries=[['.sidebar','课程目录'],['.toc','本页目录'],['.problem-rail','本节练习']]
      .map(([selector,label])=>({panel:document.querySelector(selector),label})).filter(entry=>entry.panel);
    if(!entries.length)return;
    document.documentElement.classList.add('mobile-ui');
    const media=matchMedia('(max-width: 1100px)');
    const toolbar=document.createElement('nav');toolbar.className='mobile-toolbar';toolbar.setAttribute('aria-label','移动端课程工具栏');
    const dialog=document.createElement('dialog');dialog.className='mobile-sheet';dialog.id='mobile-course-sheet';dialog.setAttribute('aria-labelledby','mobile-sheet-title');
    const header=document.createElement('div');header.className='mobile-sheet-header';
    const title=document.createElement('strong');title.id='mobile-sheet-title';
    const closeButton=document.createElement('button');closeButton.type='button';closeButton.className='mobile-sheet-close';closeButton.setAttribute('aria-label','关闭面板');closeButton.textContent='×';
    header.append(title,closeButton);
    const tabs=document.createElement('nav');tabs.className='mobile-sheet-tabs';tabs.setAttribute('aria-label','切换目录与练习');
    const body=document.createElement('div');body.className='mobile-sheet-body';
    dialog.append(header,tabs,body);document.body.append(dialog);mast.after(toolbar);
    let selected=null,savedY=0,original=null,lastTouch=null,locked=false;
    const makeButton=(label)=>{const button=document.createElement('button');button.type='button';button.textContent=label;return button;};
    entries.forEach(entry=>{
      entry.placeholder=document.createComment('mobile panel original position');entry.panel.before(entry.placeholder);
      entry.button=makeButton(entry.label);entry.button.setAttribute('aria-controls',dialog.id);entry.button.setAttribute('aria-expanded','false');entry.button.setAttribute('aria-haspopup','dialog');
      entry.tab=makeButton(entry.label);entry.tab.setAttribute('aria-pressed','false');
      entry.button.addEventListener('click',()=>open(entry));entry.tab.addEventListener('click',()=>show(entry));
      toolbar.append(entry.button);tabs.append(entry.tab);
    });
    const restore=entry=>{if(entry)entry.placeholder.parentNode.insertBefore(entry.panel,entry.placeholder.nextSibling);};
    function show(entry) {
      restore(selected);selected=entry;title.textContent=entry.label;body.replaceChildren(entry.panel);body.scrollTop=0;
      entries.forEach(item=>{const active=item===entry;item.button.setAttribute('aria-expanded',String(active));item.tab.setAttribute('aria-pressed',String(active));});
    }
    function lock() {
      savedY=scrollY;
      const node=document.body;
      original={position:node.style.position,top:node.style.top,width:node.style.width,overflow:node.style.overflow,htmlOverflow:document.documentElement.style.overflow,htmlScrollBehavior:document.documentElement.style.scrollBehavior};
      Object.assign(node.style,{position:'fixed',top:`-${savedY}px`,width:'100%',overflow:'hidden'});
      document.documentElement.style.overflow='hidden';document.documentElement.style.scrollBehavior='auto';document.documentElement.classList.add('mobile-panel-open');locked=true;
    }
    function unlock() {
      if(!locked)return;
      const {htmlOverflow,htmlScrollBehavior,...style}=original;Object.assign(document.body.style,style);document.documentElement.style.overflow=htmlOverflow;
      document.documentElement.classList.remove('mobile-panel-open');locked=false;window.scrollTo(0,savedY);document.documentElement.style.scrollBehavior=htmlScrollBehavior;
    }
    function open(entry) {
      if(!media.matches)return;
      if(dialog.open){show(entry);return;}
      lock();show(entry);dialog.showModal();closeButton.focus({preventScroll:true});
    }
    closeButton.addEventListener('click',()=>dialog.close());
    dialog.addEventListener('close',()=>{
      const previous=selected;restore(selected);selected=null;entries.forEach(entry=>entry.button.setAttribute('aria-expanded','false'));
      unlock();if(media.matches)previous?.button.focus({preventScroll:true});
    });
    dialog.addEventListener('click',event=>{
      if(event.target===dialog){dialog.close();return;}
      const anchor=event.target.closest('a[href]');if(!anchor)return;
      const target=new URL(anchor.href,location.href);
      const samePage=target.pathname===location.pathname&&target.origin===location.origin;
      if(samePage&&target.hash){
        event.preventDefault();const id=decodeURIComponent(target.hash.slice(1));
        dialog.close();requestAnimationFrame(()=>{
          const section=document.getElementById(id);if(section){history.replaceState(null,'',target.hash);section.scrollIntoView({block:'start'});}
        });
      }else dialog.close();
    });
    // Body locking covers desktop wheels and iOS fixed-body scrolling. The touch
    // boundary guard prevents a gesture at either end from reaching the lesson.
    dialog.addEventListener('touchstart',event=>{const p=event.touches[0];lastTouch=p?{x:p.clientX,y:p.clientY}:null;},{passive:true});
    dialog.addEventListener('touchmove',event=>{
      if(!dialog.open||!lastTouch||event.touches.length!==1)return;
      const p=event.touches[0],dx=p.clientX-lastTouch.x,dy=p.clientY-lastTouch.y;lastTouch={x:p.clientX,y:p.clientY};
      let node=event.target instanceof Element?event.target:null;
      while(node&&node!==dialog){
        const style=getComputedStyle(node),vertical=Math.abs(dy)>=Math.abs(dx);
        if(vertical&&/(auto|scroll)/.test(style.overflowY)&&node.scrollHeight>node.clientHeight+1){
          if(dy>0&&node.scrollTop>0||dy<0&&node.scrollTop+node.clientHeight<node.scrollHeight-1)return;
        }
        if(!vertical&&/(auto|scroll)/.test(style.overflowX)&&node.scrollWidth>node.clientWidth+1)return;
        node=node.parentElement;
      }
      if(event.cancelable)event.preventDefault();
    },{passive:false});
    const updateHeader=()=>document.documentElement.style.setProperty('--mobile-mast-height',`${Math.ceil(mast.getBoundingClientRect().height)}px`);
    if(window.ResizeObserver)new ResizeObserver(updateHeader).observe(mast);updateHeader();
    media.addEventListener('change',()=>{if(!media.matches&&dialog.open)dialog.close();updateHeader();});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
