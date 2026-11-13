(function(){
  function show(){
    let audit;try{audit=JSON.parse(localStorage.getItem('careerAICorrectionMap'))}catch{return}
    if(!audit)return;const page=location.pathname.split('/').pop()||'dashboard.html';
    const match=(audit.reviews||[]).find(r=>r.page===page);
    if(!match&&!['dashboard.html','resume_tools.html','career_readiness.html','placements.html'].includes(page))return;
    let box=document.getElementById('correctionNotice');if(!box){box=document.createElement('aside');box.id='correctionNotice';box.style.cssText='padding:14px;margin:16px;border:1px solid #d4ba70;border-radius:10px;background:#fff8df;color:#45370d;font:14px/1.6 system-ui';document.body.prepend(box)}
    box.replaceChildren(document.createTextNode(match?'Review saved content: your corrected skill list removed '+match.skills.join(', ')+'. This saved content was preserved; review its wording before using it. ':'Your resume skills were corrected on '+new Date(audit.at).toLocaleString()+'. Reopen tools to load current skills. Historical records were preserved. '));
    const a=document.createElement('a');a.href='correction_map.html';a.textContent=' Open correction map';box.append(a);
  }
  show();window.addEventListener('storage',show);
})();
