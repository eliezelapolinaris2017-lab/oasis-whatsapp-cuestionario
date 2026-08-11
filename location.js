(() => {
  const gpsBtn = document.getElementById('gpsBtn');
  const manualBtn = document.getElementById('manualAddressBtn');
  const saveManualBtn = document.getElementById('saveManualAddress');
  const manualFields = document.getElementById('manualAddressFields');
  const addressValue = document.getElementById('addressValue');
  const status = document.getElementById('locationStatus');
  const street = document.getElementById('streetAddress');
  const community = document.getElementById('communityAddress');
  const town = document.querySelector('[name="town"]');
  const nextBtn = document.getElementById('nextBtn');

  if (!gpsBtn || !manualBtn || !addressValue) return;

  function clearErrors() {
    document.querySelectorAll('#locationBox .error').forEach(el => el.remove());
  }

  function showStatus(message, type = 'success') {
    status.hidden = false;
    status.className = `location-status ${type}`;
    status.textContent = message;
  }

  function setSelected(mode) {
    gpsBtn.classList.toggle('selected-location', mode === 'gps');
    manualBtn.classList.toggle('selected-location', mode === 'manual');
  }

  gpsBtn.addEventListener('click', () => {
    clearErrors();
    manualFields.hidden = true;
    addressValue.value = '';
    setSelected('gps');
    showStatus('Solicitando permiso de ubicación…', 'loading');

    if (!navigator.geolocation) {
      showStatus('Este dispositivo no permite obtener la ubicación. Use “Escribir dirección”.', 'error-state');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        const mapLink = `https://maps.google.com/?q=${lat},${lng}`;
        addressValue.value = `GPS: ${mapLink}`;
        showStatus('✅ Ubicación registrada correctamente. Oasis recibirá un enlace directo al mapa.', 'success');
      },
      () => {
        addressValue.value = '';
        showStatus('No pudimos obtener su ubicación. Active el permiso de ubicación o escriba la dirección manualmente.', 'error-state');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  });

  manualBtn.addEventListener('click', () => {
    clearErrors();
    setSelected('manual');
    manualFields.hidden = false;
    addressValue.value = '';
    showStatus('Escriba la dirección completa y luego pulse “Usar esta dirección”.', 'loading');
    setTimeout(() => street?.focus(), 50);
  });

  saveManualBtn.addEventListener('click', () => {
    clearErrors();
    const streetValue = street.value.trim();
    const communityValue = community.value.trim();
    const townValue = town?.value?.trim() || '';

    if (!townValue) {
      showStatus('Primero seleccione el pueblo.', 'error-state');
      town?.focus();
      return;
    }
    if (streetValue.length < 5) {
      showStatus('Escriba una calle, carretera y/o número válido.', 'error-state');
      street.focus();
      return;
    }
    if (communityValue.length < 3) {
      showStatus('Añada la urbanización, condominio o sector.', 'error-state');
      community.focus();
      return;
    }

    addressValue.value = `${streetValue}, ${communityValue}, ${townValue}, Puerto Rico`;
    showStatus('✅ Dirección registrada correctamente.', 'success');
  });

  [street, community, town].forEach(el => el?.addEventListener('input', () => {
    if (!manualFields.hidden) {
      addressValue.value = '';
      if (!status.hidden) showStatus('Si modifica la dirección, pulse nuevamente “Usar esta dirección”.', 'loading');
    }
  }));

  nextBtn?.addEventListener('click', event => {
    const firstStepActive = document.querySelector('.step[data-step="1"]')?.classList.contains('active');
    if (firstStepActive && !addressValue.value.trim()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showStatus('Seleccione “Usar mi ubicación actual” o registre una dirección manual antes de continuar.', 'error-state');
      document.getElementById('locationBox')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();