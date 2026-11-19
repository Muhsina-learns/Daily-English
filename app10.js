function questions(l,k,i){const d=C[l];
 if(k=='vocab')return d.v.map((w,j)=>{const o=shuffle([w[0],...shuffle(d.v.filter(x=>x!=w)).slice(0,2).map(x=>x[0])]);return{id:`${l}-v-${j}`,q:`Which word means: “${w[1]}”?`,o,a:o.indexOf(w[0])}});
 const L=k=='grammar'?d.g:d.r;return L[i].q.map((x,j)=>({id:`${l}-${k[0]}-${i}-${j}`,q:x[0],o:x[1],a:x[2]}))}
function quiz(l,k,i){const Q=questions(l,k,+i);let n=0,right=[];
 const show=()=>{if(n>=Q.length)return finish();const q=Q[n];
  app.innerHTML=`<a class="back" onclick="go('study','${l}','${k}',${i})">← Study</a><p class="mut">Question ${n+1} of ${Q.length}</p><div class="card"><h3>${esc(q.q)}</h3>${q.o.map((o,j)=>`<button class="opt" data-j="${j}">${esc(o)}</button>`).join('')}</div>`;
  app.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const j=+b.dataset.j;app.querySelectorAll('.opt').forEach(x=>x.disabled=true);
   app.querySelectorAll('.opt')[q.a].classList.add('ok');if(j==q.a)right.push(q.id);else b.classList.add('bad');
   const nx=document.createElement('button');nx.className='btn';nx.textContent=n+1<Q.length?'Next':'Finish';nx.onclick=()=>{n++;show()};app.appendChild(nx)})};
 const finish=async()=>{const ans={...(profile?.answered||{})};let gain=0;
  right.forEach(id=>{if(!ans[id]){ans[id]=1;gain+=PTS[l]}});
  if(profile)await save({answered:ans,points:(profile.points||0)+gain,quizzes:(profile.quizzes||0)+1,last:Date.now()});
  app.innerHTML=`<div class="card" style="text-align:center"><h1>${right.length} / ${Q.length}</h1><p>${profile?`You earned <b>${gain}</b> new point(s). Points are only awarded the first time you answer a question correctly.`:'Sign up on the home page to earn points.'}</p><button class="btn" onclick="go('quiz','${l}','${k}',${i})">Retry</button> <button class="btn" onclick="go('board')">Leaderboard</button></div>`};
 show()}
async function board(){app.innerHTML='<h1>Leaderboard</h1><p class="mut">Loading…</p>';let rows=[];
 try{rows=(await db.from('profiles').select('name,points').order('points',{ascending:false}).limit(20)).data||[]}catch(e){}
 app.innerHTML=`<h1>Leaderboard</h1><div class="card">${rows.length?rows.map((r,i)=>`<div class="row"><span>#${i+1} ${esc(r.name||'Anonymous')}</span><b>${r.points||0} pts</b></div>`).join(''):'<p class="mut">No players yet — be the first!</p>'}</div>`}
async function admin(){if(!isOwner){go('home');return}
 app.innerHTML='<h1>Admin dashboard</h1><p class="mut">Loading…</p>';let rows=[];
 try{rows=((await db.from('profiles').select('name,points,quizzes,last_active')).data||[]).map(r=>({...r,last:r.last_active}))}catch(e){}
 const day=864e5,now=Date.now(),act=rows.filter(r=>now-(r.last||0)<7*day).length,qz=rows.reduce((s,r)=>s+(r.quizzes||0),0);
 app.innerHTML=`<h1>Admin dashboard</h1><div class="grid"><div class="card"><h2>${rows.length}</h2><span class="mut">Total users</span></div><div class="card"><h2>${act}</h2><span class="mut">Active (7 days)</span></div><div class="card"><h2>${qz}</h2><span class="mut">Quizzes completed</span></div><div class="card"><h2>${rows.reduce((s,r)=>s+(r.points||0),0)}</h2><span class="mut">Points awarded</span></div></div><h3>Add vocabulary word</h3><div class="card"><select id="al" class="opt">${Object.keys(C).map(l=>`<option>${l}</option>`).join('')}</select><input id="aw" placeholder="Word"><input id="ad" placeholder="Definition"><input id="ae" placeholder="Example sentence"><button class="btn" onclick="addWord()">Add word</button><p id="am" class="mut"></p></div><h3>Recent activity</h3><div class="card wrap">${rows.sort((a,b)=>(b.last||0)-(a.last||0)).map(r=>`<div class="row"><span>${esc(r.name||'?')}</span><span class="mut">${r.quizzes||0} quizzes · ${new Date(r.last||0).toLocaleDateString()}</span></div>`).join('')||'<p class="mut">No activity yet.</p>'}</div>`}
