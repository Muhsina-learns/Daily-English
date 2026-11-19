function login(){app.innerHTML=`<div class="card" style="margin-top:8vh;text-align:center"><h1>Daily English</h1><p class="mut">Log in, or create a free account with any username (for example your name).</p><input id="lu" placeholder="Username" autocapitalize="off" maxlength="20"><input id="lp" type="text" autocomplete="off" placeholder="Password"><p id="lm" style="color:var(--bad);margin:4px"></p><button class="btn" onclick="auth(0)">Log in</button> <button class="opt" style="width:auto;display:inline-block" onclick="auth(1)">Create account</button><p class="mut" style="margin-top:14px">Build v6</p>${SUPABASE_URL.indexOf("supabase.co")<0?'<p style="color:var(--bad)">Supabase URL is not set correctly in config.js.</p>':''}</div>`}
async function auth(c){const m=$('lm'),n=$('lu').value.trim(),p=$('lp').value,k=n.toLowerCase();
 if(!db){m.textContent='Server not configured yet.';return}
 if(!/^[a-z0-9_-]{3,20}$/.test(k)||p.length<4){m.textContent='Username: 3-20 letters/numbers. Password: 4+ characters.';return}
 try{const h=await hash(k,p);
  if(c){const r=await db.rpc('register',{u:k,n,h});if(r.error)throw 0;if(!r.data){m.textContent='That username is taken.';return}}
  const r=await db.rpc('login',{u:k,h});if(r.error)throw 0;
  if(!r.data||!r.data.username){m.textContent='Wrong username or password.';return}
  profile=r.data;uid=k;uh=h;isOwner=!!profile.is_admin;$('adm').hidden=!isOwner;
  app.innerHTML=`<div class="card" style="margin-top:8vh;text-align:center"><h1>Welcome, ${esc(profile.name)}!</h1><p>${c?'Your account is ready.':'You are logged in.'}</p><button class="btn" onclick="go('home')">Next</button></div>`
 }catch(e){m.textContent='Something went wrong. Try again.'}}
function home(){
 const who=profile?`<p class="mut">Signed in as <b>${esc(profile.name)}</b> · ${profile.points||0} pts</p>`:`<div class="card"><b>Create your profile</b><p class="mut">Choose a username so your points appear on the leaderboard.</p><input id="nm" maxlength="20" placeholder="Username"><button class="btn" onclick="signup()">Sign up</button></div>`;
 app.innerHTML=`<h1>Choose your level</h1>${who}<div class="grid">${Object.keys(C).map(l=>`<div class="lvl" onclick="go('level','${l}')">${l}<small>${PTS[l]} pt / correct answer</small></div>`).join('')}</div>`}
async function signup(){const n=$('nm').value.trim();if(!n)return;await save({name:n,points:0,answered:{},quizzes:0,created:Date.now(),last:Date.now()});render()}
function level(l){app.innerHTML=`<a class="back" onclick="go('home')">← Levels</a><h1>${l}</h1><div class="grid" style="grid-template-columns:1fr">${[["vocab","Vocabulary",`${C[l].v.length} words`],["grammar","Grammar",`${C[l].g.length} topic(s)`],["reading","Reading",`${C[l].r.length} passage(s)`]].map(([k,t,n])=>`<div class="card" style="cursor:pointer" onclick="go('study','${l}','${k}',0)"><h2 style="margin:0">${t}</h2><span class="mut">${n}</span></div>`).join('')}</div>`}
function study(l,k,i){i=+i;const d=C[l];let h=`<a class="back" onclick="go('level','${l}')">← ${l}</a>`;
 if(k=='vocab')h+=`<h1>${l} Vocabulary</h1>`+d.v.map(w=>`<div class="card"><h3 style="margin:0">${w[0]}</h3><p>${w[1]}</p><i class="mut">“${w[2]}”</i></div>`).join('');
 else{const L=k=='grammar'?d.g:d.r;
  h+=`<h1>${l} ${k=='grammar'?'Grammar':'Reading'}</h1><div style="display:flex;gap:6px;flex-wrap:wrap">${L.map((x,j)=>`<button class="opt" style="width:auto" onclick="go('study','${l}','${k}',${j})">${esc(x.t)}</button>`).join('')}</div><div class="card"><h2>${esc(L[i].t)}</h2><p>${esc(L[i].rule||L[i].p)}</p></div>`}
 h+=`<button class="btn" onclick="go('quiz','${l}','${k}',${i})">Start Quiz</button>`;app.innerHTML=h}
