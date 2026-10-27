(()=>{
  'use strict';
  if(!document.querySelector('.prose img')) return;

  const dialog=document.createElement('dialog');
  dialog.className='image-lightbox';
  dialog.setAttribute('aria-label','图片放大预览');
  dialog.innerHTML='<div class="image-lightbox-panel"><button class="image-lightbox-close" type="button" aria-label="关闭图片预览">×</button><figure><img class="image-lightbox-image" alt=""><figcaption></figcaption></figure></div>';
  document.body.appendChild(dialog);
  const preview=dialog.querySelector('.image-lightbox-image');
  const caption=dialog.querySelector('figcaption');
  let triggerImage=null;

  function openImage(image){
    triggerImage=image;
    preview.src=image.currentSrc||image.src;
    preview.alt=image.alt||'图片放大预览';
    caption.textContent=image.alt||'';
    caption.hidden=!image.alt;
    if(!dialog.open) dialog.showModal();
  }
  function prepareImages(){
    document.querySelectorAll('.prose img').forEach(image=>{
      image.tabIndex=0;
      image.setAttribute('role','button');
      image.setAttribute('aria-haspopup','dialog');
      image.setAttribute('aria-label',image.alt?`点击放大：${image.alt}`:'点击放大图片');
    });
  }
  prepareImages();
  document.addEventListener('click',event=>{
    const image=event.target.closest?.('.prose img');
    if(!image) return;
    event.preventDefault();
    openImage(image);
  });
  document.addEventListener('keydown',event=>{
    if((event.key==='Enter'||event.key===' ')&&event.target.matches?.('.prose img')){
      event.preventDefault();
      openImage(event.target);
    }
  });
  dialog.querySelector('.image-lightbox-close').addEventListener('click',()=>dialog.close());
  preview.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{
    const r=dialog.getBoundingClientRect();
    if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) dialog.close();
  });
  dialog.addEventListener('close',()=>{
    preview.removeAttribute('src');
    if(triggerImage?.isConnected) triggerImage.focus({preventScroll:true});
  });
})();
