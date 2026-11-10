'use strict';
// Keep video controls in a dialog so its cross-origin iframe cannot swallow page wheel input.
document.querySelector('.film-launch').addEventListener('click',event=>{
 lightboxOpener=event.currentTarget;
 lightbox.classList.add('is-video');
 lightbox.setAttribute('aria-label','게임 영상');
 lightbox.querySelector('.lightbox-close').setAttribute('aria-label','영상 닫기');
 lightbox.querySelector('.lightbox-video').src='https://www.youtube-nocookie.com/embed/Wtymupc6lYs?start=304&autoplay=1';
 lightbox.showModal();
});
lightbox.addEventListener('close',()=>{
 lightbox.querySelector('.lightbox-video').removeAttribute('src');
 lightbox.classList.remove('is-video');
 lightbox.setAttribute('aria-label','확대된 이미지');
 lightbox.querySelector('.lightbox-close').setAttribute('aria-label','확대 이미지 닫기');
});

// Tiny warm dust motes, emitted along the pointer path; no cursor replacement.
(()=>{
 const canvas=document.querySelector('.gold-dust'),ctx=canvas.getContext('2d');
 const finePointer=matchMedia('(pointer:fine)');
 let particles=[],frame=0,last=0,width=0,height=0,previous=null;
 function resize(){const ratio=Math.min(devicePixelRatio||1,2);width=innerWidth;height=innerHeight;canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);}
 function stop(){cancelAnimationFrame(frame);frame=0;particles=[];previous=null;ctx.clearRect(0,0,width,height);}
 function draw(now){
  const dt=Math.min((now-last)/1000||.016,.04);last=now;
  ctx.clearRect(0,0,width,height);
  particles=particles.filter(p=>p.life>0);
  for(const p of particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy-=4*dt;const alpha=Math.max(0,p.life/p.max);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.globalAlpha=alpha*.7;ctx.fillStyle=p.color;ctx.shadowColor='#edba5a';ctx.shadowBlur=4;ctx.fillRect(-p.size/2,-p.size/3,p.size,p.size*.55);ctx.restore();}
  if(particles.length)frame=requestAnimationFrame(draw);else frame=0;
 }
 addEventListener('pointermove',event=>{
  if(reduced.matches||!finePointer.matches||event.pointerType==='touch'||document.hidden||lightbox.open)return;
  const now=performance.now(),x=event.clientX,y=event.clientY;
  if(previous&&now-previous.time<18)return;
  const distance=previous?Math.hypot(x-previous.x,y-previous.y):0,count=Math.min(5,Math.max(2,Math.ceil(distance/12)));
  for(let i=0;i<count;i++){const t=i/count,life=.45+Math.random()*.65;particles.push({x:previous?previous.x+(x-previous.x)*t:x,y:previous?previous.y+(y-previous.y)*t:y,vx:(Math.random()-.5)*24,vy:-8-Math.random()*18,life,max:life,size:1+Math.random()*2.2,angle:Math.random()*Math.PI,color:Math.random()>.5?'#edc36d':'#c89540'});}
  if(particles.length>100)particles.splice(0,particles.length-100);
  previous={x,y,time:now};if(!frame){last=now;frame=requestAnimationFrame(draw);}
 },{passive:true});
 document.addEventListener('pointerleave',()=>{previous=null;});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 reduced.addEventListener('change',stop);finePointer.addEventListener('change',stop);
 addEventListener('resize',resize,{passive:true});resize();
})();
