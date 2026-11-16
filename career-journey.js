(function () {
  'use strict';
  const isPages = !!document.querySelector('meta[name="careerai-api-base"]');
  const tools = isPages ? './resume_tools.html' : './index.html';
  const steps = [
    {id:'roles', title:'Explore your career direction', short:'Explore roles', url:tools+'?feature=job-role', description:'Start with your interests. Explore a few roles before choosing what to prepare for.', outcome:'Choose a target role', guide:'Answer four short questions, then select a role to carry into your resume review.'},
    {id:'resume', title:'Understand your resume', short:'Resume review', url:tools+'?feature=resume', description:'See the skills in your PDF, compare a target role, and identify what to improve.', outcome:'A clear starting point', guide:'Use a text-based PDF. Add a job description if you want a separate keyword comparison.'},
    {id:'corrections', title:'Make your skills accurate', short:'Correct skills', url:'./correction_map.html', description:'Review detected skills and preview how your corrections affect your current analysis.', outcome:'A profile you can explain', guide:'Keep only skills you actually have. Corrections update this browser’s analysis; they do not edit the PDF.'},
    {id:'skills', title:'Build and check your skills', short:'Skills & learning', url:tools+'?feature=skill-gap', description:'Turn missing skills into a learning plan, then practise realistic workplace decisions.', outcome:'Feedback for your next attempt', guide:'Choose a skill, answer every scenario, and review the explanation for each answer.'},
    {id:'tutor', title:'Communicate with confidence', short:'Multilingual tutor', url:'./tutor.html', description:'Practise professional English with explanations in your preferred language.', outcome:'Clearer workplace answers', guide:'Learn a pattern, try a professional question, and compare your answer with its checklist.'},
    {id:'interview', title:'Put your preparation into words', short:'Mock interview', url:'./interview_practice.html', description:'Practise one question at a time and give examples from your own projects and experience.', outcome:'A saved practice report', guide:'Use the guided mode without an AI key. End the round before moving to your feedback.'},
    {id:'feedback', title:'Reflect. Refine. Try again.', short:'Interview feedback', url:'./interview_analysis.html', description:'Review your latest answers and decide what to improve in the next interview.', outcome:'A specific improvement plan', guide:'Look for an example, your own action, and a result. The score checks answer structure, not technical correctness.'},
    {id:'builder', title:'Tell your story clearly', short:'Resume builder', url:'./resume_builder.html', description:'Create a focused resume using your real skills, projects, and qualifications.', outcome:'A resume ready to review', guide:'Select a template, preview your details, then export. Re-analyse an updated PDF when you want a fresh comparison.'},
    {id:'matches', title:'Explore where your skills lead', short:'Career matches', url:'./career_readiness.html', description:'Compare your current profile with role skill lists and see useful next steps.', outcome:'Roles to investigate', guide:'Matches are based on keyword overlap. A completed quiz is practice evidence, not a professional certification.'},
    {id:'jobs', title:'Take your next career step', short:'Jobs & placements', url:'./placements.html', description:'Find job searches, review available college notices, and organise your applications.', outcome:'An application plan', guide:'Check the employer’s original listing and save opportunities you want to follow up.'}
  ];
  const params = new URLSearchParams(location.search);
  const page = location.pathname.split('/').pop();
  const toolFile = page==='resume_tools.html'||(page==='index.html'&&!isPages);
  let current = toolFile ? (['job-role','career-path'].includes(params.get('feature'))?0:['skill-gap','verification'].includes(params.get('feature'))?3:1) : steps.findIndex(s=>s.url.split('/').pop()===page);
  window.CareerAIJourney = Object.freeze({steps:steps.map(s=>({id:s.id,title:s.short,url:s.url})), current});
  if(current<0) return;
  function node(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;}
  function link(label,url,cls){const el=node('a',cls,label);el.href=url;return el;}
  function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))||fallback;}catch(_){return fallback;}}
  function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch(_){/* Navigation works without browser storage. */}}
  function init(){
    const step=steps[current];
    document.body.classList.add('career-module');
    document.body.dataset.careerModule=step.id;
    const suggestedRoles=['Software Developer','Full Stack Developer','Data Analyst','Data Scientist','AI Engineer','Machine Learning Engineer','Cyber Security Analyst','UI/UX Designer','Business Analyst','Digital Marketing Specialist','Cloud Engineer','DevOps Engineer'];
    const chosenRole=params.get('role');
    if(toolFile&&current===1&&suggestedRoles.includes(chosenRole)){
      const input=document.getElementById('jobRole');
      if(input)input.value=chosenRole;
      if(window.CareerAI)window.CareerAI.setRole(chosenRole);
    }
    const state=read('careerAIJourneyV2',{version:2,visited:{}});
    state.version=2;state.current=step.id;state.visited=state.visited||{};state.visited[step.id]=new Date().toISOString();
    write('careerAIJourneyV2',state);
    const chrome=node('div','career-chrome');
    const nav=node('nav','career-topbar');nav.setAttribute('aria-label','CareerAI module navigation');
    const brand=link('CareerAI','./dashboard.html','career-brand');brand.prepend(node('span','career-brand-mark','C'));
    const breadcrumb=node('span','career-breadcrumb','Preparation / '+step.short);
    const jump=node('details','career-jump');jump.append(node('summary','','All 10 modules'));
    const menu=node('ol','career-jump-menu');steps.forEach((s,i)=>{const li=node('li');const a=link(String(i+1).padStart(2,'0')+' · '+s.short,s.url);if(i===current)a.setAttribute('aria-current','page');li.append(a);menu.append(li);});jump.append(menu);
    nav.append(brand,breadcrumb,jump);chrome.append(nav);
    const hero=node('section','career-module-hero');hero.setAttribute('aria-label','Module introduction');
    const lead=node('div','career-module-lead');lead.append(node('p','career-kicker','YOUR CAREER, ONE STEP AT A TIME'));
    const title=node('h1','',step.title);lead.append(title,node('p','career-module-description',step.description));
    const meta=node('div','career-module-meta');meta.append(node('span','career-step-pill','MODULE '+String(current+1).padStart(2,'0')+' / 10'));
    const role=read('careerAIProfile',{}).role||read('careerAIResumeAnalysis',{}).job_role;
    if(role)meta.append(node('span','career-role-pill','Target: '+String(role).slice(0,100)));
    lead.append(meta);
    const aside=node('aside','career-guide');aside.append(node('span','career-kicker','YOUR TAKEAWAY'),node('h2','',step.outcome),node('p','',step.guide));
    hero.append(lead,aside);chrome.append(hero);
    const track=node('ol','career-path-track');track.setAttribute('aria-label','Module sequence');
    steps.forEach((s,i)=>{const item=node('li');const a=link('',s.url);a.append(node('span','',String(i+1).padStart(2,'0')),node('span','',s.short));if(i===current)a.setAttribute('aria-current','step');item.append(a);track.append(item);});chrome.append(track);
    document.body.prepend(chrome);
    const footer=node('nav','career-module-footer');footer.setAttribute('aria-label','Continue your preparation');
    const previous=link(current?'← '+steps[current-1].short:'← Dashboard',current?steps[current-1].url:'./dashboard.html','career-previous');
    const note=node('div','career-next-caption');note.append(node('span','','NEXT IN YOUR JOURNEY'),node('strong','',current===9?'Your preparation dashboard':steps[current+1].short));
    const next=link(current===9?'Return to dashboard →':'Continue to module '+String(current+2).padStart(2,'0')+' →',current===9?'./dashboard.html':steps[current+1].url,'career-continue');
    footer.append(previous,note,next);document.body.append(footer);
    const leaveModule=event=>{
      if(current===5&&typeof videoRecorder!=='undefined'&&videoRecorder&&videoRecorder.state!=='inactive'){
        event.preventDefault();alert('Stop the video recording and download it before leaving this module.');return;
      }
      if(window.CareerAIDrafts&&!window.CareerAIDrafts.save()){
        event.preventDefault();alert('Browser storage could not save your draft. Copy your work before leaving.');return;
      }
      if(current===5&&typeof endInterview==='function')endInterview();
      if(typeof stopSpeech==='function')stopSpeech();
      if(window.speechSynthesis)window.speechSynthesis.cancel();
    };
    chrome.querySelectorAll('a').forEach(a=>a.addEventListener('click',leaveModule));
    footer.querySelectorAll('a').forEach(a=>a.addEventListener('click',leaveModule));
    if(toolFile){
      if(current===3){const heading=document.querySelector('#analysisSection > h2');if(heading)heading.textContent='Your skill gap & learning plan';}
      if(typeof setupSkillVerification==='function')setupSkillVerification([]);
    }
    document.title=step.short+' · CareerAI';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
