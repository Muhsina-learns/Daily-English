async function addWord(){const l=$('al').value,w=$('aw').value.trim(),d=$('ad').value.trim(),e=$('ae').value.trim();if(!w||!d||!e){$('am').textContent='Fill in all fields.';return}
 try{const x=await db.rpc('add_vocab',{u:uid,h:uh,l,w,d,e});if(x.error)throw 0;C[l].v.push([w,d,e]);$('am').textContent='Added to '+l+'.';['aw','ad','ae'].forEach(i=>$(i).value='')}catch(x){$('am').textContent='Could not save.'}}
render();init();
