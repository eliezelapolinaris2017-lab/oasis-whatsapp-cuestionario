const languageCard = document.getElementById('languageCard');
const formCard = document.getElementById('formCard');
const form = document.getElementById('serviceForm');
const steps = [...document.querySelectorAll('.step')];
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const submitBtn = document.getElementById('submitBtn');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const progressWrap = document.getElementById('progressWrap');
const dynamic = document.getElementById('dynamicQuestions');
const summary = document.getElementById('summary');
const depositPolicyGate = document.getElementById('depositPolicyGate');
const depositPolicyScroll = document.getElementById('depositPolicyScroll');
const policyReadStatus = document.getElementById('policyReadStatus');
const backBtnFinal = document.getElementById('backBtnFinal');
const calendarBtn = document.getElementById('calendarBtn');
const calendarCheckWrap = document.getElementById('calendarCheckWrap');
const calendarConfirmedInput = document.getElementById('calendarConfirmed');
const changeLanguageBtn = document.getElementById('changeLanguageBtn');

const copy = {
  es: {
    officialBadge:'Formulario oficial', title:'Solicitud de Servicio', coverage:'Oasis Air Cleaner Services LLC · Área Metropolitana',
    changeLanguage:'Cambiar idioma', introTitle:'Solicita tu servicio en pocos pasos.', introText:'Completa la información, selecciona una fecha y envía el cuestionario por WhatsApp.',
    clientData:'Datos del cliente', fullName:'Nombre y apellido', fullNamePlaceholder:'Ej. Juan Pérez', phone:'Número de teléfono', town:'Pueblo', select:'Seleccione',
    address:'Dirección completa', addressPlaceholder:'Calle/carretera, número, urbanización o condominio', location:'Enlace de ubicación o coordenadas',
    locationPlaceholder:'Ej. enlace de Google Maps o 18.123456, -66.123456', access:'Apartamento, acceso o referencia', accessPlaceholder:'Ej. Apt. 7, portón, edificio, referencia',
    optional:'(opcional)', propertyType:'Tipo de propiedad', house:'Casa', apartment:'Apartamento', condominium:'Condominio', office:'Oficina', business:'Comercio', other:'Otro',
    existingClient:'¿Ya es cliente de Oasis?', yes:'Sí', no:'No', firstVisit:'No, sería mi primera visita',
    serviceQuestion:'¿Qué servicio necesita?', chooseOption:'Seleccione una opción.', maintenance:'Mantenimiento preventivo', repair:'Reparación / Diagnóstico',
    installation:'Instalación', relocation:'Reubicación', estimate:'Cotización', equipmentInfo:'Información del equipo', equipmentType:'Tipo de equipo',
    floorCeiling:'Piso / Techo', centralUnit:'Unidad Central', notSure:'No estoy seguro', quantity:'Cantidad de unidades', capacity:'Capacidad aproximada', dontKnow:'No sé',
    reviewTitle:'Revisa y completa tu solicitud', calendarTitle:'1. Seleccione su fecha antes de enviar',
    calendarText:'Abra el calendario de Confirmafy, elija una fecha disponible y luego regrese a este cuestionario.',
    calendarButton:'Abrir calendario y seleccionar fecha', calendarConfirm:'Confirmo que ya seleccioné mi fecha en Confirmafy.',
    policyTitle:'⚠️ 2. Lectura obligatoria para clientes nuevos', policyInstruction:'Deslice dentro del recuadro hasta el final para habilitar el envío.',
    depositTitle:'Depósito obligatorio de $25', depositP1:'Todo cliente nuevo debe realizar un depósito de $25 después de seleccionar una fecha disponible.',
    depositP2:'El depósito es un requisito obligatorio para procesar y confirmar la primera cita.', depositP3:'Si no realiza el depósito, su cita no podrá ser confirmada.',
    depositP4:'El depósito se acredita al balance final del servicio. La cita queda sujeta a la verificación del pago por Oasis.', policyEnd:'Fin de la política.',
    confirmInfo:'Confirmo que la información suministrada es correcta.', back:'Atrás', continue:'Continuar', sendWhatsApp:'Enviar cuestionario por WhatsApp',
    privacy:'🔒 Datos usados únicamente para coordinar su servicio.', step:'Paso', of:'de', required:'Complete este campo para continuar.',
    invalidPhone:'Ingrese un número de teléfono válido con 10 dígitos.', chooseService:'Seleccione el servicio que necesita.',
    maintenanceBlocked:'Este equipo requiere Reparación / Diagnóstico antes del mantenimiento. Regrese y cambie el tipo de servicio.',
    policyScroll:'↓ Deslice hasta el final para continuar.', policyRead:'✓ Política leída. Ya puede enviar el cuestionario.',
    policyMustRead:'Debe leer la política completa antes de enviar.', calendarRequired:'Debe seleccionar y confirmar su fecha en Confirmafy antes de enviar.',
    detailsTitle:'Detalles del servicio', turnsOn:'¿El equipo enciende?', coolingQuestion:'¿El equipo está enfriando?', littleCooling:'Enfría poco', noCooling:'No enfría',
    errorCode:'Código de error', errorPlaceholder:'Ej. P4, E1, EL OC. Si no tiene, déjelo vacío.', problem:'Explique brevemente qué problema presenta',
    problemPlaceholder:'Ej. bota agua, congela, hace ruido, se apaga...', workingNow:'¿El equipo enciende y enfría actualmente?',
    servicePolicy:'Política de servicio:', servicePolicyText:'si el equipo no enciende o no enfría, requiere Reparación / Diagnóstico antes del mantenimiento.',
    hasUnit:'¿Ya tiene el equipo?', voltage:'Voltaje del equipo', installType:'Tipo de instalación', newInstall:'Instalación nueva', replacement:'Reemplazo de equipo',
    additionalInfo:'Información adicional', additionalPlaceholder:'Indique cualquier detalle importante de la instalación.',
    installedWorking:'¿El equipo está instalado y funcionando?', sameProperty:'¿La reubicación será dentro de la misma propiedad?',
    moveDetails:'Describa de dónde hacia dónde desea moverlo', movePlaceholder:'Ej. de habitación principal a sala.',
    describeService:'Describa brevemente el servicio que necesita', describePlaceholder:'Incluya cualquier información que nos ayude a evaluar la solicitud.',
    client:'Cliente', property:'Propiedad', existing:'Cliente existente', service:'Servicio', equipment:'Equipo', turnsOnShort:'Enciende',
    coolingShort:'Enfría', errorShort:'Código de error', problemShort:'Problema', workingShort:'Funcionando', hasUnitShort:'Ya tiene equipo',
    installTypeShort:'Tipo de instalación', samePropertyShort:'Misma propiedad', details:'Detalles',
    miniSplit:'Mini Split', wallPack:'Wall Pack', unknown:'No estoy seguro',
    waTitle:'SOLICITUD DE SERVICIO - OASIS', dateSelected:'✅ Fecha seleccionada en el calendario de Confirmafy.',
    depositWarning:'⚠️ DEPÓSITO OBLIGATORIO PARA CLIENTES NUEVOS', depositInstruction:'Para confirmar su cita debe realizar el depósito de $25 utilizando una de estas opciones:',
    cardPayment:'💳 Pagar con tarjeta (Stripe):', athPayment:'📲 Pagar con ATH Móvil:', noDepositNoConfirm:'Sin realizar el depósito, su cita no podrá ser confirmada.',
    sentFromForm:'Cuestionario completado y enviado a Oasis.'
  },
  en: {
    officialBadge:'Official form', title:'Service Request', coverage:'Oasis Air Cleaner Services LLC · Metropolitan Area',
    changeLanguage:'Change language', introTitle:'Request your service in a few steps.', introText:'Complete the information, select an appointment date, and send the questionnaire through WhatsApp.',
    clientData:'Customer information', fullName:'Full name', fullNamePlaceholder:'Example: John Smith', phone:'Phone number', town:'Municipality', select:'Select',
    address:'Complete address', addressPlaceholder:'Street/road, number, neighborhood or condominium', location:'Location link or coordinates',
    locationPlaceholder:'Example: Google Maps link or 18.123456, -66.123456', access:'Apartment, access instructions, or reference', accessPlaceholder:'Example: Apt. 7, gate, building, landmark',
    optional:'(optional)', propertyType:'Property type', house:'House', apartment:'Apartment', condominium:'Condominium', office:'Office', business:'Business', other:'Other',
    existingClient:'Are you already an Oasis customer?', yes:'Yes', no:'No', firstVisit:'No, this would be my first visit',
    serviceQuestion:'What service do you need?', chooseOption:'Select an option.', maintenance:'Preventive maintenance', repair:'Repair / Diagnostic',
    installation:'Installation', relocation:'Equipment relocation', estimate:'Estimate', equipmentInfo:'Equipment information', equipmentType:'Equipment type',
    floorCeiling:'Floor / Ceiling', centralUnit:'Central unit', notSure:'I am not sure', quantity:'Number of units', capacity:'Approximate capacity', dontKnow:'I do not know',
    reviewTitle:'Review and complete your request', calendarTitle:'1. Select your appointment date before sending',
    calendarText:'Open the Confirmafy calendar, select an available date, and then return to this questionnaire.',
    calendarButton:'Open calendar and select a date', calendarConfirm:'I confirm that I selected my date in Confirmafy.',
    policyTitle:'⚠️ 2. Required reading for new customers', policyInstruction:'Scroll inside the box to the bottom to enable submission.',
    depositTitle:'Mandatory $25 deposit', depositP1:'Every new customer must pay a $25 deposit after selecting an available appointment date.',
    depositP2:'The deposit is required to process and confirm the first appointment.', depositP3:'If the deposit is not paid, the appointment cannot be confirmed.',
    depositP4:'The deposit is credited toward the final service balance. The appointment is subject to payment verification by Oasis.', policyEnd:'End of policy.',
    confirmInfo:'I confirm that the information provided is correct.', back:'Back', continue:'Continue', sendWhatsApp:'Send questionnaire through WhatsApp',
    privacy:'🔒 Information is used only to coordinate your service.', step:'Step', of:'of', required:'Complete this field to continue.',
    invalidPhone:'Enter a valid 10-digit phone number.', chooseService:'Select the service you need.',
    maintenanceBlocked:'This unit requires Repair / Diagnostic service before maintenance. Go back and change the service type.',
    policyScroll:'↓ Scroll to the bottom to continue.', policyRead:'✓ Policy read. You may now send the questionnaire.',
    policyMustRead:'You must read the complete policy before sending.', calendarRequired:'You must select and confirm your date in Confirmafy before sending.',
    detailsTitle:'Service details', turnsOn:'Does the unit turn on?', coolingQuestion:'Is the unit cooling?', littleCooling:'Cooling poorly', noCooling:'Not cooling',
    errorCode:'Error code', errorPlaceholder:'Example: P4, E1, EL OC. Leave blank if none.', problem:'Briefly explain the problem',
    problemPlaceholder:'Example: leaking water, freezing, making noise, shutting off...', workingNow:'Does the unit currently turn on and cool?',
    servicePolicy:'Service policy:', servicePolicyText:'if the unit does not turn on or cool, it requires Repair / Diagnostic service before maintenance.',
    hasUnit:'Do you already have the unit?', voltage:'Unit voltage', installType:'Installation type', newInstall:'New installation', replacement:'Unit replacement',
    additionalInfo:'Additional information', additionalPlaceholder:'Provide any important installation details.',
    installedWorking:'Is the unit installed and working?', sameProperty:'Will the relocation be within the same property?',
    moveDetails:'Describe where the unit will be moved from and to', movePlaceholder:'Example: from the primary bedroom to the living room.',
    describeService:'Briefly describe the service you need', describePlaceholder:'Include any information that will help us evaluate the request.',
    client:'Customer', property:'Property', existing:'Existing customer', service:'Service', equipment:'Equipment', turnsOnShort:'Turns on',
    coolingShort:'Cooling', errorShort:'Error code', problemShort:'Problem', workingShort:'Working', hasUnitShort:'Already has unit',
    installTypeShort:'Installation type', samePropertyShort:'Same property', details:'Details',
    miniSplit:'Mini Split', wallPack:'Wall Pack', unknown:'I am not sure',
    waTitle:'OASIS SERVICE REQUEST', dateSelected:'✅ Appointment date selected in Confirmafy.',
    depositWarning:'⚠️ MANDATORY DEPOSIT FOR NEW CUSTOMERS', depositInstruction:'To confirm your appointment, you must pay the $25 deposit using one of these options:',
    cardPayment:'💳 Pay by card (Stripe):', athPayment:'📲 Pay with ATH Móvil:', noDepositNoConfirm:'Without the deposit, your appointment cannot be confirmed.',
    sentFromForm:'Questionnaire completed and sent to Oasis.'
  }
};

let lang = 'es';
let current = 0;
let isNewClient = false;
let policyRead = false;
let calendarConfirmed = false;
const serviceInput = form.elements.service;

function tr(key) {
  return copy[lang][key] || copy.es[key] || key;
}

function applyLanguage() {
  document.documentElement.lang = lang;
  document.title = lang === 'es' ? 'Solicitar servicio | Oasis' : 'Request service | Oasis';
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    el.textContent = tr(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
    el.placeholder = tr(el.dataset.i18nPlaceholder);
  });
  progressWrap.setAttribute('aria-label', lang === 'es' ? 'Progreso del formulario' : 'Form progress');
  depositPolicyScroll.setAttribute('aria-label', lang === 'es' ? 'Política de depósito obligatorio' : 'Mandatory deposit policy');
  policyReadStatus.textContent = policyRead ? tr('policyRead') : tr('policyScroll');
  if (serviceInput.value && current >= 2) renderDynamic();
  updateUI();
}

document.querySelectorAll('.language-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    lang = btn.dataset.language;
    try { sessionStorage.setItem('oasisLanguage', lang); } catch (_) {}
    applyLanguage();
    languageCard.hidden = true;
    formCard.hidden = false;
    window.scrollTo({top:0, behavior:'smooth'});
  });
});

changeLanguageBtn.addEventListener('click', function() {
  formCard.hidden = true;
  languageCard.hidden = false;
  window.scrollTo({top:0, behavior:'smooth'});
});

document.querySelectorAll('.choice').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.choice').forEach(function(b) { b.classList.remove('selected'); });
    btn.classList.add('selected');
    serviceInput.value = btn.dataset.value;
    const oldError = document.querySelector('#serviceChoices + .error');
    if (oldError) oldError.remove();
  });
});

function option(value, labelKey, plainText) {
  return {value:value, label:plainText || tr(labelKey)};
}

function field(labelKey, name, type, options, required, placeholderKey) {
  type = type || 'text';
  options = options || [];
  required = required !== false;
  const req = required ? ' required' : '';
  const optional = required ? '' : ' <span class="optional">' + tr('optional') + '</span>';
  const placeholder = placeholderKey ? ' placeholder="' + escapeHtml(tr(placeholderKey)) + '"' : '';
  if (type === 'textarea') return '<label>' + tr(labelKey) + optional + '<textarea name="' + name + '"' + req + placeholder + '></textarea></label>';
  if (type === 'select') {
    return '<label>' + tr(labelKey) + optional + '<select name="' + name + '"' + req + '><option value="">' + tr('select') + '</option>' +
      options.map(function(x) { return '<option value="' + escapeHtml(x.value) + '">' + escapeHtml(x.label) + '</option>'; }).join('') + '</select></label>';
  }
  return '<label>' + tr(labelKey) + optional + '<input type="' + type + '" name="' + name + '"' + req + placeholder + '></label>';
}

function renderDynamic() {
  const s = serviceInput.value;
  let html = '<h2>' + escapeHtml(serviceName(s) || tr('detailsTitle')) + '</h2>';
  if (s === 'repair') {
    html += field('turnsOn', 'turns_on', 'select', [option('yes','yes'), option('no','no')]);
    html += field('coolingQuestion', 'cooling', 'select', [option('yes','yes'), option('little','littleCooling'), option('no','noCooling')]);
    html += field('errorCode', 'error_code', 'text', [], false, 'errorPlaceholder');
    html += field('problem', 'problem', 'textarea', [], true, 'problemPlaceholder');
  } else if (s === 'maintenance') {
    html += field('workingNow', 'working', 'select', [option('yes','yes'), option('no','no')]);
    html += '<div class="notice"><strong>' + tr('servicePolicy') + '</strong> ' + tr('servicePolicyText') + '</div>';
  } else if (s === 'installation') {
    html += field('hasUnit', 'has_unit', 'select', [option('yes','yes'), option('no','no')]);
    html += field('voltage', 'voltage', 'select', [option('110','', '110/115V'), option('220','', '208/220V'), option('unknown','notSure')]);
    html += field('installType', 'install_type', 'select', [option('new','newInstall'), option('replacement','replacement'), option('unknown','notSure')]);
    html += field('additionalInfo', 'details', 'textarea', [], false, 'additionalPlaceholder');
  } else if (s === 'relocation') {
    html += field('installedWorking', 'working', 'select', [option('yes','yes'), option('no','no')]);
    html += field('sameProperty', 'same_property', 'select', [option('yes','yes'), option('no','no')]);
    html += field('moveDetails', 'details', 'textarea', [], true, 'movePlaceholder');
  } else {
    html += field('describeService', 'details', 'textarea', [], true, 'describePlaceholder');
  }
  dynamic.innerHTML = html;
}

function addError(el, message) {
  const err = document.createElement('div');
  err.className = 'error';
  err.textContent = message || tr('required');
  const label = el.closest('label');
  if (label) label.after(err); else el.after(err);
  el.focus();
}

function validateStep() {
  const active = steps[current];
  active.querySelectorAll('.error').forEach(function(e) { e.remove(); });
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
      addError(form.elements.phone, tr('invalidPhone'));
      return false;
    }
  }
  if (current === 1 && !serviceInput.value) {
    const err = document.createElement('div');
    err.className = 'error';
    err.textContent = tr('chooseService');
    document.getElementById('serviceChoices').after(err);
    return false;
  }
  if (current === 3 && serviceInput.value === 'maintenance' && form.elements.working && form.elements.working.value === 'no') {
    addError(form.elements.working, tr('maintenanceBlocked'));
    return false;
  }
  return true;
}

function updateUI() {
  steps.forEach(function(step, i) { step.classList.toggle('active', i === current); });
  backBtn.hidden = current === 0;
  nextBtn.hidden = current === steps.length - 1;
  submitBtn.hidden = current !== steps.length - 1;
  progressBar.style.width = (((current + 1) / steps.length) * 100) + '%';
  progressText.textContent = tr('step') + ' ' + (current + 1) + ' ' + tr('of') + ' ' + steps.length;
}

nextBtn.addEventListener('click', function() {
  if (!validateStep()) return;
  if (current === 1) renderDynamic();
  if (current === 3) buildSummary();
  current++;
  updateUI();
  window.scrollTo({top:0, behavior:'smooth'});
});

backBtn.addEventListener('click', function() {
  if (current > 0) {
    current--;
    updateUI();
    window.scrollTo({top:0, behavior:'smooth'});
  }
});

function dataObject() {
  return Object.fromEntries(new FormData(form).entries());
}

function labelize(key) {
  const keys = {
    name:'client', phone:'phone', town:'town', address:'address', location:'location', access:'access', property:'property',
    existing:'existing', service:'service', equipment:'equipment', quantity:'quantity', btu:'capacity', turns_on:'turnsOnShort',
    cooling:'coolingShort', error_code:'errorShort', problem:'problemShort', working:'workingShort', has_unit:'hasUnitShort',
    voltage:'voltage', install_type:'installTypeShort', same_property:'samePropertyShort', details:'details'
  };
  return tr(keys[key] || key);
}

function serviceName(value) {
  const keys = {maintenance:'maintenance', repair:'repair', installation:'installation', relocation:'relocation', estimate:'estimate', other:'other'};
  return keys[value] ? tr(keys[value]) : value;
}

function displayValue(key, value) {
  const valueKeys = {
    yes:'yes', no:'no', house:'house', apartment:'apartment', condominium:'condominium', office:'office', business:'business',
    other:'other', miniSplit:'miniSplit', floorCeiling:'floorCeiling', wallPack:'wallPack', central:'centralUnit', unknown:'notSure',
    little:'littleCooling', new:'newInstall', replacement:'replacement'
  };
  if (key === 'service') return serviceName(value);
  if (key === 'voltage' && value === '110') return '110/115V';
  if (key === 'voltage' && value === '220') return '208/220V';
  return valueKeys[value] ? tr(valueKeys[value]) : value;
}

function buildSummary() {
  const d = dataObject();
  isNewClient = d.existing === 'no';
  calendarConfirmed = false;
  calendarConfirmedInput.checked = false;
  calendarCheckWrap.hidden = true;
  depositPolicyGate.hidden = true;
  policyRead = !isNewClient;
  depositPolicyScroll.scrollTop = 0;
  policyReadStatus.textContent = tr('policyScroll');
  policyReadStatus.classList.remove('read');
  updateSubmitAvailability();
  summary.innerHTML = Object.entries(d)
    .filter(function(entry) { return entry[1] && entry[0] !== 'confirm'; })
    .map(function(entry) { return '<div class="summary-row"><strong>' + escapeHtml(labelize(entry[0])) + '</strong><span>' + escapeHtml(displayValue(entry[0], entry[1])) + '</span></div>'; })
    .join('');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, function(ch) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch];
  });
}

function updateSubmitAvailability() {
  submitBtn.disabled = !calendarConfirmed || (isNewClient && !policyRead);
  submitBtn.setAttribute('aria-disabled', submitBtn.disabled ? 'true' : 'false');
}

calendarBtn.addEventListener('click', function() {
  calendarCheckWrap.hidden = false;
});

calendarConfirmedInput.addEventListener('change', function() {
  calendarConfirmed = calendarConfirmedInput.checked;
  if (isNewClient) {
    depositPolicyGate.hidden = !calendarConfirmed;
    if (!calendarConfirmed) {
      policyRead = false;
      depositPolicyScroll.scrollTop = 0;
      policyReadStatus.textContent = tr('policyScroll');
      policyReadStatus.classList.remove('read');
    }
  }
  updateSubmitAvailability();
});

depositPolicyScroll.addEventListener('scroll', function() {
  if (!isNewClient || policyRead) return;
  const reachedEnd = depositPolicyScroll.scrollTop + depositPolicyScroll.clientHeight >= depositPolicyScroll.scrollHeight - 6;
  if (reachedEnd) {
    policyRead = true;
    policyReadStatus.textContent = tr('policyRead');
    policyReadStatus.classList.add('read');
    updateSubmitAvailability();
  }
});

backBtnFinal.addEventListener('click', function() {
  if (current > 0) {
    current--;
    updateUI();
    window.scrollTo({top:0, behavior:'smooth'});
  }
});

form.addEventListener('submit', function(event) {
  event.preventDefault();
  if (!validateStep()) return;

  if (!calendarConfirmed) {
    calendarCheckWrap.hidden = false;
    addError(calendarConfirmedInput, tr('calendarRequired'));
    return;
  }

  if (isNewClient && !policyRead) {
    policyReadStatus.textContent = tr('policyMustRead');
    policyReadStatus.classList.remove('read');
    depositPolicyScroll.focus();
    return;
  }

  const d = dataObject();
  const lines = ['*' + tr('waTitle') + '*', ''];
  Object.entries(d)
    .filter(function(entry) { return entry[1] && entry[0] !== 'confirm'; })
    .forEach(function(entry) { lines.push('*' + labelize(entry[0]) + ':* ' + displayValue(entry[0], entry[1])); });

  lines.push('', tr('dateSelected'));

  if (isNewClient) {
    lines.push('', '*' + tr('depositWarning') + '*');
    lines.push(tr('depositInstruction'));
    lines.push('', '*' + tr('cardPayment') + '*');
    lines.push('https://buy.stripe.com/dRm3cu9rUaT62fQ7tJ1RC0M');
    lines.push('', '*' + tr('athPayment') + '*');
    lines.push('https://pagos.athmovilapp.com/pagoPorCodigo.html?id=0a6458db-be6e-4c13-93a5-d4b858167f97');
    lines.push('', tr('noDepositNoConfirm'));
  }

  lines.push('', tr('sentFromForm'));
  window.location.href = 'https://wa.me/17876643079?text=' + encodeURIComponent(lines.join('\n'));
});

applyLanguage();
updateSubmitAvailability();
