const form = document.getElementById('serviceForm');
const steps = [...document.querySelectorAll('.step')];
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const submitBtn = document.getElementById('submitBtn');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const dynamic = document.getElementById('dynamicQuestions');
const summary = document.getElementById('summary');
const depositPolicyGate = document.getElementById('depositPolicyGate');
const depositPolicyScroll = document.getElementById('depositPolicyScroll');
const policyReadStatus = document.getElementById('policyReadStatus');
const backBtnFinal = document.getElementById('backBtnFinal');

let current = 0;
let isNewClient = false;
let policyRead = false;

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
  isNewClient = d.existing === 'No';
  depositPolicyGate.hidden = !isNewClient;
  policyRead = !isNewClient;
  depositPolicyScroll.scrollTop = 0;
  policyReadStatus.textContent = '↓ Deslice hasta el final para continuar.';
  policyReadStatus.classList.remove('read');
  updateSubmitAvailability();
  summary.innerHTML = Object.entries(d)
    .filter(([k, v]) => v && k !== 'confirm')
    .map(([k, v]) => `<div class="summary-row"><strong>${labelize(k)}</strong><span>${escapeHtml(v)}</span></div>`)
    .join('');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[c]));
}

function updateSubmitAvailability() {
  submitBtn.disabled = isNewClient && !policyRead;
  submitBtn.setAttribute('aria-disabled', submitBtn.disabled ? 'true' : 'false');
}

depositPolicyScroll.addEventListener('scroll', () => {
  if (!isNewClient || policyRead) return;
  const reachedEnd = depositPolicyScroll.scrollTop + depositPolicyScroll.clientHeight >= depositPolicyScroll.scrollHeight - 6;
  if (reachedEnd) {
    policyRead = true;
    policyReadStatus.textContent = '✓ Política leída. Ya puede enviar el cuestionario.';
    policyReadStatus.classList.add('read');
    updateSubmitAvailability();
  }
});

backBtnFinal.addEventListener('click', () => {
  if (current > 0) {
    current--;
    updateUI();
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();
  if (!validateStep()) return;

  if (isNewClient && !policyRead) {
    policyReadStatus.textContent = 'Debe leer la política completa antes de enviar.';
    policyReadStatus.classList.remove('read');
    depositPolicyScroll.focus();
    return;
  }

  const d = dataObject();
  const lines = ['*SOLICITUD DE SERVICIO - OASIS*', ''];
  Object.entries(d)
    .filter(([k, v]) => v && k !== 'confirm')
    .forEach(([k, v]) => lines.push(`*${labelize(k)}:* ${v}`));

  if (isNewClient) {
    lines.push('', '⚠️ *DEPÓSITO OBLIGATORIO PARA CLIENTES NUEVOS*');
    lines.push('Para confirmar su cita debe realizar el depósito de $25 utilizando una de estas opciones:');
    lines.push('');
    lines.push('💳 *Pagar con tarjeta (Stripe):*');
    lines.push('https://buy.stripe.com/dRm3cu9rUaT62fQ7tJ1RC0M');
    lines.push('');
    lines.push('📲 *Pagar con ATH Móvil:*');
    lines.push('https://pagos.athmovilapp.com/pagoPorCodigo.html?id=0a6458db-be6e-4c13-93a5-d4b858167f97');
    lines.push('');
    lines.push('Sin realizar el depósito, su cita no podrá ser confirmada.');
  }

  lines.push('', 'Cuestionario completado y enviado a Oasis.');
  window.location.href = `https://wa.me/17876643079?text=${encodeURIComponent(lines.join('\n'))}`;
});

updateUI();
