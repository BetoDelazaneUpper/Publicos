/* A procedural metal surface. This is an artistic contour effect, not a fluid solver. */
(() => {
  'use strict';
  const canvas=document.getElementById('heroFluid'),host=document.getElementById('heroArt');
  if(!canvas||!host)return;const ctx=canvas.getContext('2d');if(!ctx)return;
  const root=document.documentElement,coarse=matchMedia('(pointer:coarse)').matches;
  let w=0,h=0,frame=0,visible=true,last=0,time=0,px=0,py=0,tx=0,ty=0;
  const rings=[];const enabled=()=>root.dataset.motion!=='off'&&!document.hidden&&visible&&!root.classList.contains('demo-open');
  function resize(){const r=host.getBoundingClientRect();w=r.width;h=r.height;const d=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);paint();}
  function outline(cx,cy,r,phase,t){ctx.beginPath();for(let i=0;i<=96;i++){const a=i/96*Math.PI*2;const ripple=Math.sin(a*3+t*.38+phase)*.09+Math.cos(a*5-t*.28+phase)*.04+Math.sin(a*2+t*.2)*.07;const radius=r*(1+ripple+(Math.cos(a)*px+Math.sin(a)*py)*.08);const x=cx+Math.cos(a)*radius,y=cy+Math.sin(a)*radius*.94;if(!i)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.closePath();}
  function paint(){ctx.clearRect(0,0,w,h);const light=root.dataset.theme==='light',cx=w*.51+px*14,cy=h*.54+py*10,r=Math.min(w*.4,h*.34);
    const g=ctx.createLinearGradient(cx-r,cy-r+Math.sin(time*.2)*25,cx+r,cy+r);
    const stops=light?[[0,'#f8faff'],[.17,'#d6e1f9'],[.29,'#8aa8e3'],[.4,'#245fc5'],[.56,'#fafcff'],[.73,'#7f9fdb'],[.9,'#d6e0f1'],[1,'#4779cb']]:[[0,'#292929'],[.16,'#7c7c7c'],[.28,'#c3c3c3'],[.4,'#343434'],[.54,'#131313'],[.68,'#565656'],[.83,'#b0b0b0'],[1,'#2c2c2c']];stops.forEach(([n,c])=>g.addColorStop(n,c));outline(cx,cy,r,0,time);ctx.fillStyle=g;ctx.fill();
    for(let i=0;i<20;i++){outline(cx,cy,r*(1-i*.037),i*.07,time+i*.13);ctx.strokeStyle=light?`rgba(33,78,153,${.045+i%4*.02})`:`rgba(245,245,245,${.035+i%4*.025})`;ctx.lineWidth=i%4===0?1.1:.65;ctx.stroke();}
    outline(cx,cy,r,0,time);ctx.strokeStyle=light?'#4e75b844':'#ffffff44';ctx.lineWidth=1;ctx.stroke();
    for(let i=rings.length-1;i>=0;i--){const ring=rings[i],age=(performance.now()-ring.start)/1200;if(age>1){rings.splice(i,1);continue;}ctx.beginPath();ctx.arc(ring.x,ring.y,7+age*95,0,Math.PI*2);ctx.strokeStyle=light?`rgba(23,92,211,${(1-age)*.5})`:`rgba(255,255,255,${(1-age)*.5})`;ctx.lineWidth=1-age*.6;ctx.stroke();}}
  function tick(now){frame=0;if(!enabled())return;if(!coarse||now-last>32){const dt=Math.min((now-last)/1000||0,.06);last=now;time+=dt;px+=(tx-px)*.055;py+=(ty-py)*.055;paint();}frame=requestAnimationFrame(tick);}
  function sync(){if(frame)cancelAnimationFrame(frame);frame=0;if(enabled()){last=performance.now();frame=requestAnimationFrame(tick);}else{rings.length=0;paint();}}
  host.addEventListener('pointermove',e=>{if(!enabled())return;const r=host.getBoundingClientRect();tx=(e.clientX-r.left)/r.width*2-1;ty=(e.clientY-r.top)/r.height*2-1;},{passive:true});
  host.addEventListener('pointerleave',()=>{tx=ty=0;});host.addEventListener('pointerdown',e=>{if(!enabled())return;const r=host.getBoundingClientRect();rings.push({x:e.clientX-r.left,y:e.clientY-r.top,start:performance.now()});if(rings.length>4)rings.shift();},{passive:true});
  if('ResizeObserver'in window)new ResizeObserver(resize).observe(host);else addEventListener('resize',resize);
  new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['data-theme','data-motion','class']});
  if('IntersectionObserver'in window)new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync();}).observe(host);
  document.addEventListener('visibilitychange',sync);addEventListener('pagehide',()=>{if(frame)cancelAnimationFrame(frame);});resize();sync();
})();
