'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let previewScroll=null;
const entry=document.querySelector('.entry'), gallery=document.querySelector('.gallery'),header=document.querySelector('.site-header'),lightbox=document.querySelector('.lightbox');
const characters=[
{id:'nefer',name:'네페르',english:'Nefer',symbol:'☾',deity:'이시스',position:'원거리 딜러',weapon:'셉터(지팡이)',alt:'셉터를 든 네페르',story:['천재적인 재능으로 주목받는 이시스 신전의 젊은 인재.','뛰어난 능력을 인정받아 이시스의 현신과도 같다는 평가를 받는다.','언제나 침착하고 흔들림 없는 모습을 보이지만, 그 이면에는 여리고 다정한 마음을 품고 있다.']},
{id:'inpu',name:'인푸',english:'Inpu',symbol:'✧',deity:'아누비스',position:'근접 딜러',weapon:'메이스, 가죽 방패',alt:'메이스와 방패를 든 인푸',story:['아누비스 혈족의 수장이자 평생 지하의 수호자로 살아온 인물.','강한 책임감과 사명감을 지녔으며, 주어진 의무를 무엇보다 중요하게 여긴다.','오랜 세월 사회와 격리되어 살아온 탓에 지상의 관습에 익숙하지 않아, 때로는 타인과 엇갈린 판단을 내리기도 한다.']},
{id:'heru',name:'헤루',english:'Heru',symbol:'☀',deity:'호루스',position:'근접 딜러',weapon:'코페시(곡도)',alt:'코페시를 어깨에 멘 헤루',story:['왕위 계승과는 거리가 먼 방계 왕족 출신.','철부지 도련님처럼 자유롭게 살아왔으나, 검은 모래 폭풍으로 인해 삶이 송두리째 뒤바뀌었다.','그날 이후 복수를 삶의 목표로 삼았지만, 때때로 밤하늘을 올려다보며 되돌릴 수 없는 과거를 그리워한다.']}
];
characters.sort((a,b)=>['nefer','heru','inpu'].indexOf(a.id)-['nefer','heru','inpu'].indexOf(b.id));
const stage=document.querySelector('.character-showcase'), tabs=[...document.querySelectorAll('.character-tabs [role=tab]')];let selectedCharacter=0;
function chooseCharacter(index,focus=false){selectedCharacter=(index+characters.length)%characters.length;const c=characters[selectedCharacter];stage.dataset.character=c.id;document.querySelector('.character-word').textContent=c.english.toUpperCase();const name=document.querySelector('#character-name');name.replaceChildren(document.createTextNode(c.name+' '));const small=document.createElement('small');small.textContent=c.english;name.append(small);document.querySelector('.character-symbol').textContent=c.symbol;['deity','position','weapon'].forEach(key=>document.querySelector('#character-'+key).textContent=c[key]);const story=document.querySelector('#character-story');story.replaceChildren(...c.story.map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));const art=document.querySelector('#character-art');art.src=`assets/v13/${c.id}-aligned-2k.webp`;art.alt=c.alt;art.parentElement.setAttribute('aria-label',c.name+' 이미지 확대');document.querySelector('#art-index').textContent=String(selectedCharacter+1).padStart(2,'0');document.querySelector('#characters').setAttribute('aria-labelledby','tab-'+c.id);tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===selectedCharacter));tab.tabIndex=i===selectedCharacter?0:-1;});if(focus)tabs[selectedCharacter].focus({preventScroll:true});}
function tabKeys(event,index,count,select){let n=index;if(event.key==='ArrowRight')n=(index+1)%count;else if(event.key==='ArrowLeft')n=(index+count-1)%count;else if(event.key==='Home')n=0;else if(event.key==='End')n=count-1;else return;event.preventDefault();select(n,true);}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>chooseCharacter(i));tab.addEventListener('keydown',e=>tabKeys(e,i,tabs.length,chooseCharacter));});document.querySelector('.character-prev').addEventListener('click',()=>chooseCharacter(selectedCharacter-1));document.querySelector('.character-next').addEventListener('click',()=>chooseCharacter(selectedCharacter+1));
let lightboxOpener;function openImage(src,alt,opener){lightboxOpener=opener;const img=lightbox.querySelector('img');img.src=src;img.alt=alt;lightbox.showModal();}
document.querySelectorAll('.image-trigger').forEach(b=>b.addEventListener('click',()=>{const img=b.querySelector('img');openImage(b.classList.contains('character-art')?`assets/v13/${characters[selectedCharacter].id}-detail-2k.webp`:(img.currentSrc||img.src),img.alt,b);}));document.querySelector('.entry-zoom').addEventListener('click',e=>openImage('assets/hero.png','D.O.G. 대표 이미지',e.currentTarget));document.querySelector('.archive-link').addEventListener('click',e=>{const c=characters[selectedCharacter];openImage(`assets/v13/${c.id}-detail-2k.webp`,c.name+' 캐릭터 일러스트',e.currentTarget);});lightbox.querySelector('button').addEventListener('click',()=>lightbox.close());lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close();});lightbox.addEventListener('close',()=>lightboxOpener?.focus({preventScroll:true}));
const playStates=[
 {index:'01 / EXPEDITION',title:'전투와 퍼즐',copy:'싸우고, 풀고, 더 강하게.',photos:[['combat','세트와의 보스 전투'],['puzzle','거울로 빛을 연결하는 협동 퍼즐']]},
 {index:'02 / DONATION',title:'신들의 도네이션',copy:'모든 행동이, 신들에게는 방송.',photos:[['donation','신이 보내준 회복 물약 후원'],['broadcast','신들의 채팅과 함께하는 전투']]},
 {index:'03 / COOPERATION',title:'협동 속의 경쟁',copy:'함께 돌파하고, 먼저 증명하세요.',photos:[['results','세 원정대원의 최종 결산']]}
];
const playSteps=[...document.querySelectorAll('.play-columns article')];
const playVisual=document.querySelector('.play-visual'),photoWindow=playVisual.querySelector('.play-slide-window'),photoTrack=playVisual.querySelector('.play-slide-track'),photoSlides=[...playVisual.querySelectorAll('.play-slide')];
let selectedPlay=0,selectedPhoto=0,photoPointer=null,suppressPhotoClick=false;
function choosePhoto(index,animate=true){
 const photos=playStates[selectedPlay].photos;selectedPhoto=(index+photos.length)%photos.length;
 photoTrack.classList.toggle('instant',!animate||reduced.matches);
 photoTrack.style.transform='translateX('+(-selectedPhoto*100)+'%)';
 photoSlides.forEach((slide,i)=>{slide.inert=i!==selectedPhoto;slide.setAttribute('aria-hidden',String(i!==selectedPhoto));});
 playVisual.querySelector('.play-photo-count').textContent=String(selectedPhoto+1).padStart(2,'0')+' / '+String(photos.length).padStart(2,'0');
 playVisual.querySelector('.play-photo-caption').textContent=photos[selectedPhoto][1];
 photoWindow.setAttribute('aria-label',playStates[selectedPlay].title+' 사진 '+(selectedPhoto+1)+' / '+photos.length+', 좌우 방향키로 넘기기');
}
function choosePlay(index){
 selectedPlay=index;
 playSteps.forEach((article,i)=>{article.classList.toggle('selected',i===index);article.querySelector('button').setAttribute('aria-expanded',String(i===index));article.querySelector('.step-copy').hidden=i!==index;});
 const state=playStates[index];
 ['index','title','copy'].forEach(key=>playVisual.querySelector('.play-visual-'+key).textContent=state[key]);
 photoSlides.forEach((slide,i)=>{const photo=state.photos[i];slide.hidden=!photo;if(photo){slide.querySelector('img').src='assets/v3/'+photo[0]+'.webp';slide.querySelector('img').alt=photo[1];slide.setAttribute('aria-label',photo[1]+' 확대');}});
 playVisual.querySelector('.play-photo-controls').hidden=state.photos.length<2;
 choosePhoto(0,false);
}
playVisual.querySelector('.play-photo-prev').addEventListener('click',()=>choosePhoto(selectedPhoto-1));
playVisual.querySelector('.play-photo-next').addEventListener('click',()=>choosePhoto(selectedPhoto+1));
photoWindow.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();choosePhoto(selectedPhoto+(event.key==='ArrowRight'?1:-1));photoWindow.focus({preventScroll:true});});
photoWindow.addEventListener('pointerdown',event=>{if(event.button!==0)return;photoPointer={x:event.clientX,y:event.clientY,id:event.pointerId};suppressPhotoClick=false;});
photoWindow.addEventListener('pointermove',event=>{if(!photoPointer||event.pointerId!==photoPointer.id)return;const dx=event.clientX-photoPointer.x,dy=event.clientY-photoPointer.y;if(Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)){suppressPhotoClick=true;photoWindow.setPointerCapture(event.pointerId);}});
photoWindow.addEventListener('pointerup',event=>{if(!photoPointer)return;const dx=event.clientX-photoPointer.x,dy=event.clientY-photoPointer.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))choosePhoto(selectedPhoto+(dx<0?1:-1));photoPointer=null;});
photoWindow.addEventListener('pointercancel',()=>{photoPointer=null;suppressPhotoClick=false;});
photoWindow.addEventListener('click',event=>{if(suppressPhotoClick){event.preventDefault();event.stopImmediatePropagation();suppressPhotoClick=false;}},true);
playSteps.forEach((article,i)=>{const h=article.querySelector('h3'),button=document.createElement('button');button.type='button';button.textContent=h.textContent;const icon=document.createElement('span');icon.className='step-toggle';icon.textContent='＋';icon.setAttribute('aria-hidden','true');button.append(icon);const copy=document.createElement('div');copy.className='step-copy';copy.id='play-description-'+i;article.querySelectorAll('p,.feature-foot').forEach(node=>copy.append(node));button.setAttribute('aria-controls',copy.id);button.addEventListener('click',()=>choosePlay(i));h.replaceChildren(button);article.append(copy);});choosePlay(0);
const menu=header.querySelector('.menu-toggle');menu.addEventListener('click',()=>{const open=header.classList.toggle('menu-open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');menu.textContent=open?'닫기 ✕':'☰ 더 보기';});header.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{header.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','메뉴 열기');menu.textContent='☰ 더 보기';}));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&header.classList.contains('menu-open'))menu.click();});
const panels=[...gallery.querySelectorAll(':scope > .panel')],rail=document.querySelector('.section-rail');panels.forEach((p,i)=>{const a=document.createElement('a');a.href='#'+p.id;a.setAttribute('aria-label',p.querySelector('h1,h2')?.textContent||'섹션 '+(i+1));const s=document.createElement('span');s.textContent=String(i+1).padStart(2,'0');a.append(s);rail.append(a);});let ticking=false;function scrollState(){const position=previewScroll??scrollY;const pos=position+innerHeight*.45;let active=panels[0];for(const p of panels){if(p.offsetTop<=pos)active=p;}rail.querySelectorAll('a').forEach(a=>a.setAttribute('aria-current',String(a.hash==='#'+active.id)));header.querySelectorAll('nav a').forEach(a=>a.setAttribute('aria-current',String(a.hash==='#'+active.id||(a.hash==='#characters'&&active.id==='heirs'))));const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress span').style.width=(max>0?position/max*100:0)+'%';header.classList.toggle('scrolled',position>50);ticking=false;}addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(scrollState);ticking=true;}},{passive:true});scrollState();
const started=Date.now();function updateClock(){const s=Math.floor((Date.now()-started)/1000);document.querySelector('#rec-time').textContent=[Math.floor(s/3600),Math.floor(s/60)%60,s%60].map(v=>String(v).padStart(2,'0')).join(':');}updateClock();setInterval(updateClock,1000);
let entered=false,receiving=false;function storeEntry(){try{sessionStorage.setItem('dog-entered','1');}catch{}}function wasEntered(){try{return sessionStorage.getItem('dog-entered')==='1';}catch{return false;}}
function toggleEntry(visible){entry.hidden=!visible;document.body.classList.toggle('entry-open',visible);gallery.inert=visible;header.inert=visible;rail.inert=visible;document.querySelector('.gallery-footer').inert=visible;if(visible){entry.classList.remove('receiving','leaving');entry.querySelector('.coin-layer').replaceChildren();entry.querySelector('.donation-button').disabled=false;entry.querySelector('.donation-button').focus({preventScroll:true});}}
function receive(){if(receiving)return;receiving=true;const button=entry.querySelector('.donation-button');button.disabled=true;entry.classList.add('receiving');const rect=button.getBoundingClientRect(),layer=entry.querySelector('.coin-layer');if(!reduced.matches){for(let i=0;i<(innerWidth<700?24:42);i++){const coin=document.createElement('span');coin.className='coin';coin.textContent='✦';const x=rect.left+rect.width/2,y=rect.top+rect.height/2;coin.style.left=x+'px';coin.style.top=y+'px';layer.append(coin);const dx=(Math.random()-.5)*Math.min(innerWidth,1200),up=-(160+Math.random()*innerHeight*.5);coin.animate([{transform:'translate(-50%,-50%) scale(.4)',opacity:0},{transform:`translate(${dx*.45}px,${up}px) rotate(${Math.random()*360}deg)`,opacity:1,offset:.45},{transform:`translate(${dx}px,${innerHeight-y+120}px) rotate(${Math.random()*1080}deg)`,opacity:0}],{duration:1400+Math.random()*350,easing:'cubic-bezier(.2,.6,.5,1)',fill:'forwards'});}}setTimeout(()=>entry.classList.add('leaving'),reduced.matches?100:950);setTimeout(()=>{entered=true;storeEntry();toggleEntry(false);receiving=false;window.scrollTo({top:0,behavior:'instant'});document.querySelector('#home-title').focus({preventScroll:true});const toast=document.querySelector('.reward-toast');toast.classList.add('visible');setTimeout(()=>toast.classList.remove('visible'),3000);},reduced.matches?180:1650);}
entry.querySelector('.donation-button').addEventListener('click',receive);entry.addEventListener('keydown',e=>{if(e.key!=='Tab'||lightbox.open)return;const focusable=[entry.querySelector('.entry-zoom'),entry.querySelector('.donation-button')].filter(x=>!x.disabled&&x.getClientRects().length);const index=focusable.indexOf(document.activeElement);if(e.shiftKey&&index===0){e.preventDefault();focusable.at(-1).focus();}else if(!e.shiftKey&&index===focusable.length-1){e.preventDefault();focusable[0].focus();}});document.querySelectorAll('.replay').forEach(b=>b.addEventListener('click',()=>{receiving=false;toggleEntry(true);}));document.querySelectorAll('button,.text-link').forEach(b=>{b.addEventListener('pointerdown',()=>b.classList.add('pressed'));['pointerup','pointerleave','pointercancel','blur'].forEach(ev=>b.addEventListener(ev,()=>b.classList.remove('pressed')));});
const hash=location.hash;if(['#inpu','#heru'].includes(hash))chooseCharacter(characters.findIndex(c=>c.id===hash.slice(1)));if(wasEntered()||hash){entered=true;toggleEntry(false);if(['#characters','#inpu','#heru'].includes(hash))requestAnimationFrame(()=>stage.scrollIntoView({behavior:'instant'}));}else toggleEntry(true);

document.querySelectorAll('.home-heirs a').forEach(a=>a.addEventListener('click',()=>chooseCharacter(Number(a.dataset.character))));


// One wheel gesture changes scenes through the same ink reveal as menu links.
const sceneStops=[...gallery.querySelectorAll(':scope > .panel')];
// Main scene images load ahead of navigation, so the completed next page is captured.
gallery.querySelectorAll('img').forEach(img=>{img.loading='eager';});
const sceneAssets=[...characters.map(c=>`assets/v13/${c.id}-aligned-2k.webp`),...playStates.flatMap(state=>state.photos.map(photo=>'assets/v3/'+photo[0]+'.webp'))].map(src=>{const img=new Image();img.src=src;return img;});
const curtain=document.querySelector('.ink-curtain');document.documentElement.dataset.transitionEngine=typeof document.startViewTransition==='function'?'fixed-viewport-mask':'curtain';
let sceneMoving=false,lastSceneMove=-Infinity,wheelAmount=0,wheelAt=0;
function sectionFor(target){return target.matches('.panel')?target:target.closest('.panel');}
function alignScene(target){window.scrollTo({top:Math.round(target.getBoundingClientRect().top+scrollY),behavior:'instant'});scrollState();}
function prepareSceneCapture(panel){
 const viewport=document.querySelector('.scene-viewport'),spacer=document.querySelector('.scene-spacer');
 const source=sceneStops.find(item=>{const r=item.getBoundingClientRect();return r.top<=innerHeight*.5&&r.bottom>innerHeight*.5;})||sceneStops[0];
 // Capture the actual viewport, including a partially scrolled boundary, without a jump.
 const from=scrollY;
 const to=Math.round(panel.getBoundingClientRect().top+scrollY);
 const width=gallery.getBoundingClientRect().width;
 spacer.style.height=gallery.scrollHeight+'px';spacer.hidden=false;
 viewport.style.width=width+'px';viewport.style.backgroundColor=getComputedStyle(source).backgroundColor;
 gallery.style.transform='translate3d(0, -'+from+'px, 0)';
 viewport.classList.add('is-capturing');
 previewScroll=from;
 return {from,to,
  update(){gallery.style.transform='translate3d(0, -'+to+'px, 0)';viewport.style.backgroundColor=getComputedStyle(panel).backgroundColor;previewScroll=to;scrollState();},
  release(){viewport.classList.remove('is-capturing');gallery.style.removeProperty('transform');viewport.style.removeProperty('width');viewport.style.removeProperty('background-color');spacer.hidden=true;spacer.style.removeProperty('height');previewScroll=null;}
 };
}
async function travelTo(target){if(!target||sceneMoving)return;initialAnchorUntouched=false;const panel=sectionFor(target)||target,delta=panel.getBoundingClientRect().top;if(Math.abs(delta)<2)return;
 if(reduced.matches){alignScene(panel);return;}
 sceneMoving=true;let transition,timeout,capture;
 try{
  capture=prepareSceneCapture(panel);
  document.documentElement.classList.add('ink-transitioning');
  document.documentElement.dataset.inkDirection=delta>0?'forward':'back';
  const update=()=>{document.documentElement.dataset.lastSceneTarget=panel.id;capture.update();};
  if(document.startViewTransition){transition=document.startViewTransition(update);await Promise.race([transition.finished,new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new Error('Scene transition timed out')),2200);})]);}
  else{curtain.classList.add('visible');await new Promise(r=>setTimeout(r,550));update();curtain.classList.add('leaving');await new Promise(r=>setTimeout(r,650));}
 }catch(error){transition?.skipTransition();document.documentElement.dataset.transitionError=error.name+': '+error.message;}
 finally{clearTimeout(timeout);capture?.release();document.documentElement.classList.remove('ink-transitioning');curtain.classList.remove('visible','leaving');sceneMoving=false;wheelAmount=0;lastSceneMove=performance.now();alignScene(panel);}
}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=document.getElementById(a.hash.slice(1));if(!target||!entry.hidden||lightbox.open)return;e.preventDefault();if(sceneMoving)return;travelTo(target);history.replaceState(null,'',a.hash);}));
addEventListener('wheel',event=>{
 if(innerWidth<900||reduced.matches||!entry.hidden||lightbox.open||event.ctrlKey||event.target.closest('iframe,dialog')||Math.abs(event.deltaX||0)>Math.abs(event.deltaY))return;
 if(sceneMoving){event.preventDefault();return;}
 const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1),direction=Math.sign(delta);if(!direction)return;
 // Only genuinely tall panels use native scrolling inside their content. A short
 // panel left between stops (resize, scrollbar, focus) resumes through the reveal.
 const tall=sceneStops.find(p=>{const r=p.getBoundingClientRect();return r.bottom-r.top>innerHeight+6&&r.top<=3&&r.bottom>=innerHeight-3;});
 if(!tall){
  const destination=direction>0?sceneStops.find(p=>p.getBoundingClientRect().top>3):[...sceneStops].reverse().find(p=>p.getBoundingClientRect().top< -3);
  if(!destination)return;
  event.preventDefault();const now=performance.now();if(now-wheelAt>180||Math.sign(wheelAmount)!==direction)wheelAmount=0;wheelAt=now;wheelAmount+=delta;
  if(Math.abs(wheelAmount)<25)return;wheelAmount=0;travelTo(destination);return;
 }
 const current=tall;
 const rect=current.getBoundingClientRect(),remaining=direction>0?rect.bottom-innerHeight:-rect.top;
 const next=sceneStops[sceneStops.indexOf(current)+direction];
 if(remaining>3){
  if(next&&Math.abs(delta)>=remaining){event.preventDefault();window.scrollTo({top:scrollY+direction*remaining,behavior:'instant'});wheelAmount=0;}
  return;
 }
 if(!next)return;
 event.preventDefault();const now=performance.now();if(now-wheelAt>180||Math.sign(wheelAmount)!==direction)wheelAmount=0;wheelAt=now;wheelAmount+=delta;
 if(Math.abs(wheelAmount)<25)return;wheelAmount=0;travelTo(next);
},{passive:false});
addEventListener('keydown',event=>{if(!entry.hidden||lightbox.open||event.target.closest('button,a,input,textarea,select')||!['PageDown','PageUp'].includes(event.key))return;const current=sceneStops.reduce((best,p,n)=>Math.abs(p.getBoundingClientRect().top)<Math.abs(sceneStops[best].getBoundingClientRect().top)?n:best,0),target=sceneStops[current+(event.key==='PageDown'?1:-1)];if(target){event.preventDefault();travelTo(target);}});
let initialAnchorUntouched=true;['pointerdown','wheel','keydown'].forEach(type=>addEventListener(type,()=>initialAnchorUntouched=false,{once:true,passive:true}));document.fonts.ready.then(()=>{if(!hash||!initialAnchorUntouched)return;const anchor=['#characters','#inpu','#heru'].includes(hash)?stage:document.getElementById(hash.slice(1));if(anchor)requestAnimationFrame(()=>alignScene(anchor));});

