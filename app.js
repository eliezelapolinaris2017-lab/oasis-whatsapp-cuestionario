const form=document.getElementById('serviceForm');
const steps=[...document.querySelectorAll('.step')];
const nextBtn=document.getElementById('nextBtn');
const backBtn=document.getElementById('backBtn');
const submitBtn=document.getElementById('submitBtn');
const progressBar=document.getElementById('progressBar');
const progressText=document.getElementById('progressText');
const dynamic=document.getElementById('dynamicQuestions');
const summary=document.getElementById('summary');
let current=0;

const serviceInput=form.elements.service;
document.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.choice').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
  serviceInput.value=btn.dataset.value;
}));

function field(label,name,type='text',options=[]){
  if(type==='textarea') return `<label>${label}<textarea name="${name}" required></textarea></label>`;
  if(type==='select') return `<label>${label}<select name="${name}" required><option value="">Seleccione</option>${options.map(x=>`<option>${x}</option>`).join('')}</select></label>`;
  return `<label>${label}<input type="${type}" name="${name}" required></label>`;
}

function renderDynamic(){
  const s=serviceInput.value;
  let html=`<h2>${s || 'Detalles del servicio'}</h2>`;
  if(s==='Reparación / Diagnóstico'){
    html+=field('¿El equipo enciende?','turns_on','select',['Sí','No']);
    html+=field('¿El equipo está enfriando?','cooling','select',['Sí','Poco','No enfría']);
    html+=field('¿Presenta algún código de error?','error_code','text');
    html+=field('Explique brevemente qué problema presenta','problem','textarea');
  }else if(s==='Mantenimiento preventivo'){
    html+=field('¿El equipo enciende y enfría actualmente?','working','select',['Sí','No']);
    html+=`<div class="notice">Si el equipo no enfría o presenta una falla, seleccione Reparación / Diagnóstico. Oasis verifica funcionamiento antes de realizar mantenimiento.</div>`;
  }else if(s==='Instalación'){
    html+=field('¿Ya tiene el equipo?','has_unit','select',['Sí','No']);
    html+=field('Voltaje del equipo','voltage','select',['110/115V','208/220V','No sé']);
    html+=field('Tipo de instalación','install_type','select',['Instalación nueva','Reemplazo','No estoy seguro']);
    html+=field('Información adicional','details','textarea');
  }else if(s==='Reubicación de equipo'){
    html+=field('¿El equipo está instalado y funcionando?','working','select',['Sí','No']);
    html+=field('¿La reubicación será dentro de la misma propiedad?','same_property','select',['Sí','No']);
    html+=field('Describa de dónde hacia dónde desea moverlo','details','textarea');
  }else{
    html+=field('Describa brevemente el servicio que necesita','details','textarea');
  }
  dynamic.innerHTML=html;
}

function validateStep(){
  const active=steps[current];
  active.querySelectorAll('.error').forEach(e=>e.remove());
  const required=[...active.querySelectorAll('[required]')];
  for(const el of required){
    if((el.type==='checkbox'&&!el.checked)||(!el.value.trim())){
      const err=document.createElement('div');err.className='error';err.textContent='Complete este campo para continuar.';
      el.closest('label')?.after(err) || el.after(err);el.focus();return false;
    }
  }
  if(current===1&&!serviceInput.value){
    const err=document.createElement('div');err.className='error';err.textContent='Seleccione el servicio que necesita.';
    document.getElementById('serviceChoices').after(err);return false;
  }
  return true;
}

function updateUI(){
  steps.forEach((s,i)=>s.classList.toggle('active',i===current));
  backBtn.hidden=current===0;
  nextBtn.hidden=current===steps.length-1;
  submitBtn.hidden=current!==steps.length-1;
  progressBar.style.width=`${((current+1)/steps.length)*100}%`;
  progressText.textContent=`Paso ${current+1} de ${steps.length}`;
  window.scrollTo({top:0,behavior:'smooth'});
}

nextBtn.addEventListener('click',()=>{
  if(!validateStep()) return;
  if(current===1) renderDynamic();
  if(current===3) buildSummary();
  current++;updateUI();
});
backBtn.addEventListener('click',()=>{if(current>0){current--;updateUI();}});

function dataObject(){
  return Object.fromEntries(new FormData(form).entries());
}
function labelize(k){return ({name:'Cliente',town:'Pueblo',property:'Propiedad',existing:'Cliente existente',service:'Servicio',equipment:'Equipo',quantity:'Cantidad',btu:'Capacidad',turns_on:'Enciende',cooling:'Enfría',error_code:'Código/error',problem:'Problema',working:'Funcionando',has_unit:'Ya tiene equipo',voltage:'Voltaje',install_type:'Instalación',same_property:'Misma propiedad',details:'Detalles'})[k]||k;}
function buildSummary(){
  const d=dataObject();
  summary.innerHTML=Object.entries(d).filter(([k,v])=>v&&k!=='confirm').map(([k,v])=>`<div class="summary-row"><strong>${labelize(k)}</strong>${escapeHtml(v)}</div>`).join('');
}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));}

form.addEventListener('submit',e=>{
  e.preventDefault();if(!validateStep())return;
  const d=dataObject();
  const lines=['*SOLICITUD DE SERVICIO - OASIS*',''];
  Object.entries(d).filter(([k,v])=>v&&k!=='confirm').forEach(([k,v])=>lines.push(`*${labelize(k)}:* ${v}`));
  lines.push('','Información completada desde el cuestionario de servicio.');
  const wa=`https://wa.me/17876643079?text=${encodeURIComponent(lines.join('\n'))}`;
  document.getElementById('sendWhatsapp').href=wa;
  document.getElementById('formCard').hidden=true;
  document.getElementById('doneCard').hidden=false;
  window.scrollTo({top:0,behavior:'smooth'});
});

document.getElementById('restartBtn').addEventListener('click',()=>{
  form.reset();document.querySelectorAll('.choice').forEach(b=>b.classList.remove('selected'));serviceInput.value='';current=0;updateUI();document.getElementById('doneCard').hidden=true;document.getElementById('formCard').hidden=false;
});

updateUI();
