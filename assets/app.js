(function(){
'use strict';
var BB = window.BB, S = BB.status, LS = 'susisa-brandbook-theme';
var CH = Object.keys(BB.ch).map(Number).sort(function(a,b){return a-b;}).map(function(n){return BB.ch[n];});
var ORDER = ['final','early','draft','open','later'];
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
function fa(n){ return String(n).replace(/\d/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'[d];}); }
function counts(c){ var o={final:0,early:0,draft:0,open:0,later:0}; c.sections.forEach(function(s){ o[s.st]++; }); return o; }
function total(){ var o={final:0,early:0,draft:0,open:0,later:0}; CH.forEach(function(c){ var k=counts(c); ORDER.forEach(function(x){o[x]+=k[x];}); }); return o; }
function stackbar(k, cls){
  var n = ORDER.reduce(function(a,x){return a+k[x];},0)||1;
  return '<div class="'+(cls||'stackbar')+'" role="img" aria-label="'+ORDER.map(function(x){return S[x].t+' '+fa(k[x]);}).join('، ')+'">'+
    ORDER.map(function(x){ return k[x]? '<i style="width:'+(k[x]/n*100)+'%;background:var(--c-'+x+')"></i>':''; }).join('')+'</div>';
}
function badge(st){ return '<span class="badge b-'+st+'"><i></i>'+S[st].t+'</span>'; }
function owner(c){ return BB.owners[c]||c; }

/* ---------- blocks ---------- */
function block(b){
  switch(b.type){
    case 'p': return '<p>'+esc(b.text)+'</p>';
    case 'list': return '<ul>'+b.items.map(function(i){return '<li>'+esc(i)+'</li>';}).join('')+'</ul>';
    case 'quote': return '<blockquote>'+esc(b.text)+'</blockquote>';
    case 'note': return '<div class="note '+(b.kind||'')+'">'+(b.kind==='live'?'<b>نسخهٔ زنده. </b>':(b.kind==='warn'?'<b>توجه. </b>':''))+esc(b.text.replace(/^نسخهٔ زنده: /,''))+'</div>';
    case 'table': return '<div class="tbl"><table><thead><tr>'+b.head.map(function(h){return '<th>'+esc(h)+'</th>';}).join('')+'</tr></thead><tbody>'+
      b.rows.map(function(r){return '<tr>'+r.map(function(c){return '<td>'+esc(c)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>';
    case 'swatches': return '<div class="swatches">'+b.items.map(function(s){ return '<div class="sw"><div style="background:'+esc(s.hex)+'"></div><p><b>'+esc(s.name)+'</b><code>'+esc(s.hex)+'</code><br>'+esc(s.use)+'</p></div>'; }).join('')+'</div>';
    case 'links': return '<ul>'+b.items.map(function(l){return '<li><a href="'+esc(l.u)+'" target="_blank" rel="noopener">'+esc(l.t)+'</a></li>';}).join('')+'</ul>';
    case 'status': return '<div class="tbl"><table><tbody>'+ORDER.map(function(x){ return '<tr><td>'+badge(x)+'</td><td>'+esc(S[x].d)+'</td></tr>'; }).join('')+'</tbody></table></div>';
    case 'src': return '<div class="src"><b>'+esc(b.label)+'</b> '+esc(b.text)+'</div>';
    case 'evidence': return '<div class="tbl"><table><tbody>'+BB.evidence.map(function(e){ return '<tr><td>'+esc(e[0])+'</td><td>'+esc(e[1])+'</td></tr>'; }).join('')+'</tbody></table></div>';
    case 'owners': return '<div class="tbl"><table><thead><tr><th>فصل</th><th>مالک</th><th>بازبینی</th></tr></thead><tbody>'+CH.map(function(c){ return '<tr><td><a href="#/ch/'+c.n+'">'+fa(c.n)+' · '+esc(c.title)+'</a></td><td>'+esc(owner(c.owner))+'</td><td>'+esc(c.review)+'</td></tr>'; }).join('')+'</tbody></table></div>';
  }
  return '';
}
function section(s){
  return '<section class="sec s-'+s.st+'" id="s'+s.id.replace('.','-')+'"><div class="sh"><h2><span>'+fa(s.id)+'</span>'+esc(s.t)+'</h2>'+badge(s.st)+'</div>'+
    '<div class="sbody">'+s.body.map(block).join('')+'</div>'+
    (s.task?'<div class="task">کار مرتبط در برد پروژه: <code>'+esc(s.task)+'</code> · مسئول: '+esc(owner(s.owner))+'</div>':'<div class="task">مسئول: '+esc(owner(s.owner))+'</div>')+'</section>';
}

/* ---------- views ---------- */
function vHome(){
  var t = total(), all = ORDER.reduce(function(a,x){return a+t[x];},0), done = t.final+t.early;
  var h = '<header class="cover"><div class="kick">'+esc(BB.site.opening)+'</div><h1>'+esc(BB.site.title)+'</h1><p>مرجع زندهٔ تصمیم‌های برند سوسیسا. هر فصل مالک و تاریخ به‌روزرسانی دارد و با پیشرفت پروژه کامل می‌شود.</p>'+
    '<div class="meta"><span>نسخه: <b>'+esc(BB.site.version)+'</b></span><span>آخرین به‌روزرسانی: <b>'+esc(BB.site.updated)+'</b></span><span>تهیه‌شده توسط: <b>Glitch Lab</b></span></div></header>';
  h += '<div class="overall"><b>'+fa(done)+' از '+fa(all)+' بخش مصوب یا ثبت‌شده</b>'+stackbar(t)+'<div class="legend">'+ORDER.map(function(x){ return '<span><em style="background:var(--c-'+x+')"></em>'+S[x].t+' '+fa(t[x])+'</span>'; }).join('')+'</div></div>';
  BB.groups.forEach(function(g){
    var cs = CH.filter(function(c){return c.group===g.id;});
    h += '<h2 class="g">'+g.t+'</h2><p>'+g.d+'</p><div class="chs">'+cs.map(function(c){
      var k=counts(c), dn=k.final+k.early;
      return '<a class="chc" href="#/ch/'+c.n+'"><span class="num">'+fa(c.n)+'</span><h3>'+esc(c.title)+'</h3>'+stackbar(k,'stackbar')+'<small>'+fa(dn)+' از '+fa(c.sections.length)+' بخش · '+esc(owner(c.owner))+'</small></a>';
    }).join('')+'</div>';
  });
  return h;
}
function vChapter(n){
  var c = BB.ch[n]; if(!c) return vNotFound();
  var k = counts(c), i = CH.indexOf(c), prev = CH[i-1], next = CH[i+1];
  var h = '<header class="chead"><div class="big" aria-hidden="true">'+fa(c.n)+'</div><h1>'+esc(c.title)+'</h1><p>'+esc(c.intro)+'</p></header>'+
    '<div class="facts"><span>مالک: <b>'+esc(owner(c.owner))+'</b></span><span>آخرین به‌روزرسانی: <b>'+esc(c.updated)+'</b></span><span>بازبینی: <b>'+esc(c.review)+'</b></span><span>'+(c.group==='open'?'در نسخهٔ افتتاحیه':'بعد از افتتاحیه')+'</span></div>'+
    stackbar(k)+'<div class="legend" style="margin-bottom:10px">'+ORDER.filter(function(x){return k[x];}).map(function(x){ return '<span><em style="background:var(--c-'+x+')"></em>'+S[x].t+' '+fa(k[x])+'</span>'; }).join('')+'</div>';
  h += c.sections.map(section).join('');
  h += '<nav class="pager" aria-label="فصل قبل و بعد">'+(next?'<a href="#/ch/'+next.n+'"><small>فصل بعد</small>'+fa(next.n)+' · '+esc(next.title)+'</a>':'<span></span>')+(prev?'<a href="#/ch/'+prev.n+'"><small>فصل قبل</small>'+fa(prev.n)+' · '+esc(prev.title)+'</a>':'<span></span>')+'</nav>';
  return h;
}
function vLog(){
  return '<header class="cover"><div class="kick">تاریخچه</div><h1>تغییرات</h1><p>هر تغییر مهم در برندبوک یک خط می‌گیرد. جزئیات کامل در تاریخچهٔ گیت نگه‌داری می‌شود.</p></header><div class="log">'+
    BB.log.map(function(l){ return '<div><b>'+esc(l.d)+'</b><span>'+esc(l.t)+'</span></div>'; }).join('')+'</div>';
}
function vSearch(q){
  q = decodeURIComponent(q||'').trim();
  var res = [];
  if(q) CH.forEach(function(c){ c.sections.forEach(function(s){
    var txt = s.t+' '+JSON.stringify(s.body).replace(/[{}\[\]"]|type|text|items|head|rows/g,' ');
    var idx = txt.indexOf(q);
    if(idx>=0){ var sn = txt.slice(Math.max(0,idx-40), idx+90).replace(/\s+/g,' '); res.push({c:c,s:s,sn:sn}); }
  }); });
  var h = '<header class="cover"><div class="kick">جست‌وجو</div><h1>«'+esc(q)+'»</h1></header>';
  if(!q) return h+'<div class="empty">یک واژه بنویس.</div>';
  if(!res.length) return h+'<div class="empty">چیزی پیدا نشد. با کلمهٔ کوتاه‌تری امتحان کن.</div>';
  var re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g');
  return h+'<div class="results">'+res.map(function(r){ return '<a href="#/ch/'+r.c.n+'/s'+r.s.id.replace('.','-')+'"><b>'+fa(r.s.id)+' · '+esc(r.s.t)+'</b><small>فصل '+fa(r.c.n)+' · '+esc(r.c.title)+'</small><small>'+esc(r.sn).replace(re,function(m){return '<mark>'+m+'</mark>';})+'</small></a>'; }).join('')+'</div>';
}
function vNotFound(){ return '<div class="empty">این صفحه وجود ندارد. <a href="#/">برگشت به فهرست فصل‌ها</a></div>'; }

/* ---------- shell ---------- */
function route(){ var h = location.hash.replace(/^#\/?/,''); var p = h.split('/'); return p; }
function nav(cur){
  var groups = BB.groups.map(function(g){
    return '<h4>'+g.t+'</h4>'+CH.filter(function(c){return c.group===g.id;}).map(function(c){
      return '<a href="#/ch/'+c.n+'"'+(cur==='ch'+c.n?' aria-current="page"':'')+'><span class="n">'+fa(c.n)+'</span><span>'+esc(c.title)+'</span>'+stackbar(counts(c),'mini')+'</a>';
    }).join('');
  }).join('');
  return '<aside class="side" id="side"><a class="logo" href="#/"><b>SU</b><span>'+esc(BB.site.title)+'<small>'+esc(BB.site.sub)+'</small></span></a>'+
    '<input class="sq" id="sq" type="search" placeholder="جست‌وجو در برندبوک" aria-label="جست‌وجو">'+
    '<nav class="nav" aria-label="فصل‌ها"><a href="#/"'+(cur==='home'?' aria-current="page"':'')+'><span class="n">◆</span><span>فهرست فصل‌ها</span><span></span></a>'+groups+
    '<h4>سند</h4><a href="#/log"'+(cur==='log'?' aria-current="page"':'')+'><span class="n">↻</span><span>تاریخچهٔ تغییرات</span><span></span></a></nav>'+
    '<div class="sidefoot"><span>نسخه '+esc(BB.site.version)+'</span><button class="btn" id="th" type="button">تیره / روشن</button></div></aside>';
}
function render(){
  var p = route(), cur='home', body;
  if(p[0]==='ch'){ var n=Number(p[1]); cur='ch'+n; body=vChapter(n); }
  else if(p[0]==='log'){ cur='log'; body=vLog(); }
  else if(p[0]==='q'){ cur='q'; body=vSearch(p.slice(1).join('/')); }
  else body=vHome();
  var q0 = document.getElementById('sq'), qv = q0?q0.value:'';
  document.getElementById('root').innerHTML =
    '<div class="topbar"><button class="btn" id="mb" type="button" aria-label="فهرست">☰ فهرست</button><b>'+esc(BB.site.title)+'</b></div><div class="veil" id="vl"></div>'+
    '<div class="shell">'+nav(cur)+'<main class="main" id="main">'+body+'</main></div>';
  var sq = document.getElementById('sq'); if(p[0]==='q') sq.value = decodeURIComponent(p.slice(1).join('/')); else sq.value = qv;
  document.title = (p[0]==='ch'&&BB.ch[p[1]] ? fa(p[1])+' · '+BB.ch[p[1]].title+' · ' : '')+BB.site.title;
  document.body.classList.remove('menu');
  if(p[0]==='ch' && p[2]){ var el=document.getElementById(p[2]); if(el) el.scrollIntoView(); } else if(!window.__first) window.scrollTo(0,0);
  window.__first = true;
}
document.addEventListener('click',function(e){
  var t=e.target;
  if(t.id==='mb') document.body.classList.add('menu');
  if(t.id==='vl') document.body.classList.remove('menu');
  if(t.id==='th'){ var d=document.documentElement; var nx=d.getAttribute('data-theme')==='dark'?'light':'dark'; d.setAttribute('data-theme',nx); try{localStorage.setItem(LS,nx);}catch(x){} }
});
var qt;
document.addEventListener('input',function(e){ if(e.target.id==='sq'){ var v=e.target.value.trim(); clearTimeout(qt); qt=setTimeout(function(){ location.hash = v? '#/q/'+encodeURIComponent(v) : '#/'; },250); } });
window.addEventListener('hashchange',function(){ render(); window.scrollTo(0,0); var p=route(); if(p[0]==='ch'&&p[2]){ var el=document.getElementById(p[2]); if(el) el.scrollIntoView(); } if(p[0]==='q'){ var s=document.getElementById('sq'); if(s){ s.focus(); s.setSelectionRange(s.value.length,s.value.length);} } });
var th=null; try{ th=localStorage.getItem(LS); }catch(x){}
document.documentElement.setAttribute('data-theme', th || (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
render();
})();
