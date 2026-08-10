const form = document.getElementById('serviceForm');
const steps = [...document.querySelectorAll('.step')];
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const submitBtn = document.getElementById('submitBtn');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const dynamic = document.getElementById('dynamicQuestions');
const summary = document.getElementById('summary');
const depositNotice = document.getElementById('depositNotice');
const sendWhatsapp = document.getElementById('sendWhatsapp');
const calendarBtn = document.getElementById('calendarBtn');
const depositBtn = document.getElementById('depositBtn');
const finalConfirmBtn = document.getElementById('finalConfirmBtn');
const waStep = document.getElementById('waStep');
const calendarStep = document.getElementById('calendarStep');
const depositStep = document.getElementById('depositStep');
const confirmStep = document.getElementById('confirmStep');
const confirmStepNumber = document.getElementById('confirmStepNumber');
const flowMessage = document.getElementById('flowMessage');
const finalNote = document.getElementById('finalNote');
const formCard = document.getElementById('formCard');
const doneCard = document.getElementById('doneCard');

const FLOW_KEY = 'oasisReservationFlow';
let current = 0;
let isNewClient = false;
let completionData = {};
let flowStage = 0; // 0=sin iniciar, 1=WhatsApp, 2=agenda, 3=depósito/confirmación existente, 4=confirmación nuevo

const serviceInput = form.elements.service;

document.querySelectorAll('.choice').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.choice').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  serviceInput.value = btn.dataset.value;
  document.querySelector('#serviceChoices + .error')?.remove();
}));

function field(label, name, type = 'text', options = [], required = true, placeholder = '') {
  const req = required ? 'required' : '';
  const opt = required ? '' : ' <span class="optional">(opcional)</span>';
  if (type === 'textarea') return `<label>${label}${opt}<textarea name="${name}" ${req} placeholder="${placeholder}"></textarea></label>`;
  if (type === 'select') return `<label>${label}${opt}<select name="${name}" ${req}><option value="">Seleccione</option>${options.map(x => `<option>${x}</option>`).join('')}</select></label>`;
  return `<label>${label}${opt}<input type="${type}" name="${name}" ${req} placeholder="${placeholder}"></label>`;
}

function renderDynamic() {
  const s = serviceInput.value;
  let html = `<h2>${s || 'Detalles del servicio'}</h2>`;
  if (s === 'Reparación / Diagnóstico') {
    html += field('¿El equipo enciende?', 'turns_on', 'select', ['Sí', 'No']);
    html += field('¿El equipo está enfriando?', 'cooling', 'select', ['Sí', 'Enfría poco', 'No enfría']);
    html += field('Código de error', 'error_code', 'text', [], false, 'Ej. P4, E1, EL OC. Si no tiene, déjelo vacío.');
    html += field('Explique brevemente qué problema presenta', 'problem', 'textarea', [], true, 'Ej. bota agua, congela, hace ruido, se apaga...');
  } else if (s === 'Mantenimiento preventivo') {
    html += field('¿El equipo enciende y enfría actualmente?', 'working', 'select', ['Sí', 'No']);
    html += `<div class="notice"><strong>Política de servicio:</strong> si el equipo no enciende o no enfría, requiere Reparación / Diagnóstico antes del mantenimiento.</div>`;
  } else if (s === 'Instalación') {
    html += field('¿Ya tiene el equipo?', 'has_unit', 'select', ['Sí', 'No']);
    html += field('Voltaje del equipo', 'voltage', 'select', ['110/115V', '208/220V', 'No sé']);
    html += field('Tipo de instalación', 'install_type', 'select', ['Instalación nueva', 'Reemplazo de equipo', 'No estoy seguro']);
    html += field('Información adicional', 'details', 'textarea', [], false, 'Indique cualquier detalle importante de la instalación.');
  } else if (s === 'Reubicación de equipo') {
    html += field('¿El equipo está instalado y funcionando?', 'working', 'select', ['Sí', 'No']);
    html += field('¿La reubicación será dentro de la misma propiedad?', 'same_property', 'select', ['Sí', 'No']);
    html += field('Describa de dónde hacia dónde desea moverlo', 'details', 'textarea', [], true, 'Ej. de habitación principal a sala.');
  } else {
    html += field('Describa brevemente el servicio que necesita', 'details', 'textarea', [], true, 'Incluya cualquier información que nos ayude a evaluar la solicitud.');
  }
  dynamic.innerHTML = html;
}

function addError(el, message = 'Complete este campo para continuar.') {
  const err = document.createElement('div');
  err.className = 'error';
  err.textContent = message;
  el.closest('label')?.after(err) || el.after(err);
  el.focus();
}

function validateStep() {
  const active = steps[current];
  active.querySelectorAll('.error').forEach(e => e.remove());
  const required = [...active.querySelectorAll('[required]')];
  for (const el of required) {
    const empty = el.type === 'checkbox' ? !el.checked : !String(el.value).trim();
    if (empty) {
      addError(el);
      return false;
    }
  }
  if (current === 0) {
    const phone = form.elements.phone.value.replace(/\D/g, '');
    if (phone.length < 10) {
      addError(form.elements.phone, 'Ingrese un número de teléfono válido con 10 dígitos.');
      return false;
    }
  }
  if (current === 1 && !serviceInput.value) {
    const err = document.createElement('div');
    err.className = 'error';
    err.textContent = 'Seleccione el servicio que necesita.';
    document.getElementById('serviceChoices').after(err);
    return false;
  }
  if (current === 3 && serviceInput.value === 'Mantenimiento preventivo') {
    const working = form.elements.working;
    if (working?.value === 'No') {
      addError(working, 'Este equipo requiere Reparación / Diagnóstico antes de mantenimiento. Regrese y cambie el tipo de servicio.');
      return false;
    }
  }
  return true;
}

function updateUI() {
  steps.forEach((s, i) => s.classList.toggle('active', i === current));
  backBtn.hidden = current === 0;
  nextBtn.hidden = current === steps.length - 1;
  submitBtn.hidden = current !== steps.length - 1;
  progressBar.style.width = `${((current + 1) / steps.length) * 100}%`;
  progressText.textContent = `Paso ${current + 1} de ${steps.length}`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

nextBtn.addEventListener('click', () => {
  if (!validateStep()) return;
  if (current === 1) renderDynamic();
  if (current === 3) buildSummary();
  current++;
  updateUI();
});

backBtn.addEventListener('click', () => {
  if (current > 0) {
    current--;
    updateUI();
  }
});

function dataObject() {
  return Object.fromEntries(new FormData(form).entries());
}

function labelize(k) {
  return ({
    name: 'Cliente', phone: 'Teléfono', town: 'Pueblo', address: 'Dirección', access: 'Acceso / referencia', property: 'Propiedad',
    existing: 'Cliente existente', service: 'Servicio', equipment: 'Equipo', quantity: 'Cantidad', btu: 'Capacidad', turns_on: 'Enciende',
    cooling: 'Enfría', error_code: 'Código de error', problem: 'Problema', working: 'Funcionando', has_unit: 'Ya tiene equipo', voltage: 'Voltaje',
    install_type: 'Tipo de instalación', same_property: 'Misma propiedad', details: 'Detalles'
  })[k] || k;
}

function buildSummary() {
  const d = dataObject();
  depositNotice.hidden = d.existing !== 'No';
  summary.innerHTML = Object.entries(d)
    .filter(([k, v]) => v && k !== 'confirm')
    .map(([k, v]) => `<div class="summary-row"><strong>${labelize(k)}</strong><span>${escapeHtml(v)}</span></div>`)
    .join('');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[c]));
}

function setLocked(el, locked, labelLocked, labelOpen) {
  el.classList.toggle('locked', locked);
  el.setAttribute('aria-disabled', locked ? 'true' : 'false');
  el.textContent = locked ? labelLocked : labelOpen;
}

function saveFlow() {
  try {
    sessionStorage.setItem(FLOW_KEY, JSON.stringify({
      active: true,
      isNewClient,
      flowStage,
      completionData
    }));
  } catch (_) {}
}

function clearFlow() {
  try { sessionStorage.removeItem(FLOW_KEY); } catch (_) {}
}

function buildInitialWhatsAppLink() {
  const d = completionData;
  const lines = ['*NUEVA SOLICITUD DE SERVICIO - OASIS*', ''];
  Object.entries(d)
    .filter(([k, v]) => v && k !== 'confirm')
    .forEach(([k, v]) => lines.push(`*${labelize(k)}:* ${v}`));
  if (isNewClient) {
    lines.push('', '⚠️ Cliente nuevo: luego de seleccionar una fecha disponible aplica depósito de $25 para reservar la primera cita.');
  }
  lines.push('', 'Solicitud completada desde el cuestionario de Oasis.');
  sendWhatsapp.href = `https://wa.me/17876643079?text=${encodeURIComponent(lines.join('\n'))}`;
}

function buildFinalConfirmationLink() {
  const d = completionData;
  const lines = ['*SOLICITUD DE CONFIRMACIÓN DE CITA - OASIS*', ''];
  lines.push(`*Cliente:* ${d.name || ''}`);
  lines.push(`*Teléfono:* ${d.phone || ''}`);
  lines.push(`*Servicio:* ${d.service || ''}`);
  lines.push(`*Pueblo:* ${d.town || ''}`);
  lines.push('');
  lines.push('✅ Ya envié mi información.');
  lines.push('✅ Ya seleccioné mi cita en el calendario.');
  if (isNewClient) {
    lines.push('✅ Ya realicé el depósito de $25 por ATH Móvil.');
  } else {
    lines.push('ℹ️ Soy cliente existente; no requiere depósito inicial.');
  }
  lines.push('', 'Deseo solicitar la confirmación final de mi cita.');
  finalConfirmBtn.href = `https://wa.me/17876643079?text=${encodeURIComponent(lines.join('\n'))}`;
}

function resetFlowUI() {
  [waStep, calendarStep, depositStep, confirmStep].forEach(el => el.classList.remove('active', 'done-step'));
  waStep.classList.add('active');
  sendWhatsapp.textContent = '1. Enviar información por WhatsApp';
  setLocked(calendarBtn, true, '🔒 2. Ver fechas y agendar', '2. Ver fechas y agendar');
  setLocked(depositBtn, true, '🔒 3. Pagar depósito $25', '3. Pagar depósito $25');
  setLocked(finalConfirmBtn, true, '🔒 Confirmar mi cita por WhatsApp', 'Confirmar mi cita por WhatsApp');
  finalConfirmBtn.href = '#';
}

function renderFlowState() {
  resetFlowUI();
  depositStep.hidden = !isNewClient;
  depositBtn.hidden = !isNewClient;
  confirmStepNumber.textContent = isNewClient ? '4' : '3';

  flowMessage.textContent = isNewClient
    ? 'Sigue este orden: enviar información → agendar → depósito → confirmar con Oasis.'
    : 'Sigue este orden: enviar información → agendar → confirmar con Oasis.';

  if (flowStage >= 1) {
    waStep.classList.remove('active');
    waStep.classList.add('done-step');
    sendWhatsapp.textContent = '✓ 1. Información enviada / abrir WhatsApp';
    calendarStep.classList.add('active');
    setLocked(calendarBtn, false, '🔒 2. Ver fechas y agendar', '2. Ver fechas y agendar');
  }

  if (flowStage >= 2) {
    calendarStep.classList.remove('active');
    calendarStep.classList.add('done-step');
    calendarBtn.textContent = '✓ 2. Calendario abierto / volver a ver';
    if (isNewClient) {
      depositStep.classList.add('active');
      setLocked(depositBtn, false, '🔒 3. Pagar depósito $25', '3. Pagar depósito $25');
    } else {
      confirmStep.classList.add('active');
      setLocked(finalConfirmBtn, false, '🔒 Confirmar mi cita por WhatsApp', '3. Confirmar mi cita por WhatsApp');
      buildFinalConfirmationLink();
    }
  }

  if (isNewClient && flowStage >= 3) {
    depositStep.classList.remove('active');
    depositStep.classList.add('done-step');
    depositBtn.textContent = '✓ 3. ATH Móvil abierto / volver a pagar';
    confirmStep.classList.add('active');
    setLocked(finalConfirmBtn, false, '🔒 Confirmar mi cita por WhatsApp', '4. Confirmar mi cita por WhatsApp');
    buildFinalConfirmationLink();
  }

  if ((!isNewClient && flowStage >= 3) || (isNewClient && flowStage >= 4)) {
    confirmStep.classList.remove('active');
    confirmStep.classList.add('done-step');
    finalConfirmBtn.textContent = `✓ ${isNewClient ? '4' : '3'}. Confirmación abierta en WhatsApp`;
    finalNote.textContent = 'Oasis verificará la cita y, cuando aplique, el depósito antes de dar la confirmación final.';
  } else if (isNewClient && flowStage >= 3) {
    finalNote.textContent = 'ATH Móvil ya fue abierto. Ahora envía el mensaje final por WhatsApp para solicitar la confirmación de tu cita.';
  } else if (!isNewClient && flowStage >= 2) {
    finalNote.textContent = 'Como cliente existente no necesitas depósito. Ahora envía el mensaje final por WhatsApp.';
  } else {
    finalNote.textContent = 'Complete cada paso en orden. La cita queda pendiente de confirmación final por Oasis.';
  }
}

function showReservationFlow() {
  formCard.hidden = true;
  doneCard.hidden = false;
  buildInitialWhatsAppLink();
  renderFlowState();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  if (!validateStep()) return;

  completionData = dataObject();
  isNewClient = completionData.existing === 'No';
  flowStage = 0;
  saveFlow();
  showReservationFlow();
});

sendWhatsapp.addEventListener('click', () => {
  if (flowStage < 1) flowStage = 1;
  saveFlow();
  renderFlowState();
});

calendarBtn.addEventListener('click', e => {
  if (flowStage < 1) {
    e.preventDefault();
    return;
  }
  if (flowStage < 2) flowStage = 2;
  saveFlow();
  renderFlowState();
});

depositBtn.addEventListener('click', e => {
  if (!isNewClient || flowStage < 2) {
    e.preventDefault();
    return;
  }
  // Guardar ANTES de salir a ATH Móvil para que iPhone restaure correctamente al volver.
  if (flowStage < 3) flowStage = 3;
  saveFlow();
  renderFlowState();
});

finalConfirmBtn.addEventListener('click', e => {
  const requiredStage = isNewClient ? 3 : 2;
  if (flowStage < requiredStage || finalConfirmBtn.classList.contains('locked')) {
    e.preventDefault();
    return;
  }
  flowStage = isNewClient ? 4 : 3;
  saveFlow();
  renderFlowState();
});

document.getElementById('restartBtn').addEventListener('click', () => {
  clearFlow();
  form.reset();
  document.querySelectorAll('.choice').forEach(b => b.classList.remove('selected'));
  serviceInput.value = '';
  dynamic.innerHTML = '';
  summary.innerHTML = '';
  depositNotice.hidden = true;
  current = 0;
  isNewClient = false;
  completionData = {};
  flowStage = 0;
  depositStep.hidden = true;
  depositBtn.hidden = true;
  updateUI();
  doneCard.hidden = true;
  formCard.hidden = false;
});

function restoreFlowIfNeeded() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(FLOW_KEY) || 'null');
    if (!saved?.active || !saved.completionData) return false;
    completionData = saved.completionData;
    isNewClient = !!saved.isNewClient;
    flowStage = Number(saved.flowStage || 0);
    showReservationFlow();
    return true;
  } catch (_) {
    return false;
  }
}

window.addEventListener('pageshow', () => {
  if (!doneCard.hidden) renderFlowState();
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && !doneCard.hidden) renderFlowState();
});

if (!restoreFlowIfNeeded()) updateUI();
