const $=id=>document.getElementById(id),pages=[...document.querySelectorAll(".page")],LAST=pages.length-1;
let cur=0,code="",pi=0,sx=null;
const store=k=>{try{return localStorage.getItem(k)}catch(e){return null}};

function go(n){if(n<0||n>LAST)return;cur=n;pages.forEach((p,i)=>p.classList.toggle("active",i===n));pages[n].scrollTop=0;document.body.dataset.page=n;$("prog").style.width=(n/LAST*100)+"%";history.replaceState(null,"","#p"+n);if(n===LAST)setTimeout(()=>burst(40),500)}

/* lock */
function key(n){if(code.length<4)code+=n;updateDots();if(code.length===4)setTimeout(check,150)}
function back(){code=code.slice(0,-1);updateDots()}
function updateDots(){[...$("dots").children].forEach((d,i)=>d.classList.toggle("on",i<code.length))}
function check(){if(code==="1007"){go(1);burst(25)}else{$("hint").textContent="Not quite, love ♡";const c=$("lockcard");c.classList.add("shake");setTimeout(()=>c.classList.remove("shake"),500)}code="";updateDots()}

/* countdown */
function countdown(){const n=new Date(),y=n.getFullYear();let t=new Date(y,9,7);if(n>new Date(y,9,8))t=new Date(y+1,9,7);const d=Math.round((t-new Date(y,n.getMonth(),n.getDate()))/864e5);$("cd").innerHTML=d===0?"🎉 Today is our day!":`⏳ <b>${d}</b> day${d>1?"s":""} until October 7`}

/* popups */
function popup(icon,title,body){$("mi").textContent=icon;$("mt").textContent=title;$("mb").textContent=body;$("mph").style.display="none";$("modal").classList.add("show")}
function closeModal(){$("modal").classList.remove("show")}
document.addEventListener("click",e=>{
 const g=e.target.closest("[data-go]");if(g){go(+g.dataset.go);return}
 const b=e.target.closest("[data-p]");if(!b)return;
 const[a,t,c]=b.dataset.p.split("|");popup(a,t,c);
 if(b.closest(".promises")){b.classList.add("done");if(document.querySelectorAll(".promises .done").length===5)setTimeout(()=>{closeModal();$("pm").textContent="All promises sealed 💗 Forever our story.";burst(40)},1800)}
});

/* photos: tap a polaroid, add a picture (saved on this device) or drop assets/photoN.jpg */
const pics=[["us ♡","One of the moments I would go back to in a heartbeat."],["my favorite smile","That smile will always be one of my favorite things."],["just us","Just us, and that is more than enough."],["another favorite","Four years of memories, and still so many more to make."],["a sweet day","A sweet day I am so glad we got to have."],["with you","Any place is better with you in it."]];
function setImg(i,src,cb,fail){const im=new Image();im.alt=pics[i][0];im.onload=()=>{$("ph"+i).replaceChildren(im);cb&&cb()};if(fail)im.onerror=fail;im.src=src}
function tryAssets(i,k=0){const e=["jpg","jpeg","png","webp"];if(k<e.length)setImg(i,`assets/photo${i+1}.${e[k]}`,null,()=>tryAssets(i,k+1))}
function buildPhotos(){$("photos").innerHTML=pics.map((c,i)=>`<div class="pol" style="--r:${[-3,2,-2,3,-1,2][i]}deg" tabindex="0" role="button" onclick="openPhoto(${i})" onkeydown="if(event.key==='Enter')openPhoto(${i})"><div class="ph" id="ph${i}">📷</div><div class="cap">${c[0]}</div></div>`).join("");pics.forEach((c,i)=>{const s=store("ph"+i);s?setImg(i,s):tryAssets(i)})}
function openPhoto(i){pi=i;const im=$("ph"+i).querySelector("img");popup(im?"":"📷",pics[i][0],pics[i][1]);if(im){const c=im.cloneNode();c.className="big";$("mi").appendChild(c)}}
$("file").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(1,700/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=im.width*s;c.height=im.height*s;c.getContext("2d").drawImage(im,0,0,c.width,c.height);const d=c.toDataURL("image/jpeg",.8);try{localStorage.setItem("ph"+pi,d)}catch(x){}setImg(pi,d,()=>{closeModal();openPhoto(pi);burst(8)})};im.src=r.result};r.readAsDataURL(f);e.target.value=""};

/* letter */
function openLetter(){const e=$("env");e.classList.add("open");setTimeout(()=>{e.style.display="none";const l=$("letter");l.classList.remove("hidden");l.querySelectorAll("p").forEach((p,i)=>p.style.animationDelay=(.3+i*.8)+"s");burst(12)},650)}

/* music */
const au=$("audio");
function toggleSong(){au.paused?au.play().catch(()=>{}):au.pause()}
au.addEventListener("play",()=>$("cass").classList.add("play"));au.addEventListener("pause",()=>$("cass").classList.remove("play"));
au.addEventListener("error",()=>$("musicmsg").textContent="Could not load the song.",true);
au.querySelector("source").addEventListener("error",()=>$("musicmsg").textContent="Could not load the song.");

/* floating hearts */
function burst(n,soft){for(let i=0;i<n;i++){const s=document.createElement("span");s.className="fh";s.textContent=["♥","♡","✦","🌸","💗","✨"][Math.random()*6|0];s.style.cssText=`left:${Math.random()*100}%;font-size:${soft?12+Math.random()*14:16+Math.random()*26}px;animation-duration:${soft?9+Math.random()*6:4+Math.random()*3}s;animation-delay:${soft?0:Math.random()*.9}s;--o:${soft?.35:.85}`;$("float").appendChild(s);setTimeout(()=>s.remove(),16000)}}
setInterval(()=>{if(!document.hidden)burst(1,true)},1500);

/* page-to-page nav, swipe, keyboard */
pages.forEach((p,i)=>{if(i>1&&i<LAST){const d=document.createElement("div");d.className="nav";d.innerHTML=`<button onclick="go(${i-1})">← Back</button><button class="pri" onclick="go(${i+1})">${i===LAST-1?"Final surprise 💗":"Next →"}</button>`;p.querySelector(".content").appendChild(d)}});
document.addEventListener("touchstart",e=>sx=e.touches[0].clientX,{passive:true});
document.addEventListener("touchend",e=>{if(sx==null||cur<2||cur>=LAST||$("modal").classList.contains("show"))return;const d=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(d)>80)go(cur+(d<0?1:-1))});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();if(cur===0){if(/^\d$/.test(e.key))key(e.key);if(e.key==="Backspace")back();return}if($("modal").classList.contains("show"))return;if(cur>1&&cur<LAST){if(e.key==="ArrowRight")go(cur+1);if(e.key==="ArrowLeft")go(cur-1)}});

buildPhotos();countdown();
if(location.hash.startsWith("#p")){const n=Number(location.hash.slice(2));if(n>=0&&n<=LAST)go(n)}

/* background music: loops, starts on first tap, pauses while Our Song plays */
const bgm=$("bgm");bgm.volume=.35;
function startBg(){if(au.paused)bgm.play().catch(()=>{});["pointerdown","keydown","touchstart"].forEach(t=>document.removeEventListener(t,startBg))}
["pointerdown","keydown","touchstart"].forEach(t=>document.addEventListener(t,startBg));
au.addEventListener("play",()=>bgm.pause());
["pause","ended"].forEach(t=>au.addEventListener(t,()=>bgm.play().catch(()=>{})));
