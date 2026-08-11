(() => {
  const gpsBtn = document.getElementById('gpsBtn');
  const manualBtn = document.getElementById('manualAddressBtn');
  const manualFields = document.getElementById('manualAddressFields');
  const addressValue = document.getElementById('addressValue');
  const street = document.getElementById('streetAddress');
  const community = document.getElementById('communityAddress');
  const town = document.querySelector('[name="town"]');
  const nextBtn = document.getElementById('nextBtn');

  if (!gpsBtn || !manualBtn || !addressValue) return;

  const GPS_LABEL = '📍 Usar mi ubicación actual';
  const MANUAL_LABEL = '✍️ Escribir dirección';

  function clearErrors() {
    document.querySelectorAll('#locationBox .error').forEach(el => el.remove());
  }

  function addLocationError(message) {
    clearErrors();
    const err = document.createElement('div');
    err.className = 'error';
    err.textContent = message;
    document.getElementById('locationBox')?.appendChild(err);
  }

  function setSelected(mode) {
    const gpsSelected = mode === 'gps';
    const manualSelected = mode === 'manual';
    gpsBtn.classList.toggle('selected-location', gpsSelected);
    manualBtn.classList.toggle('selected-location', manualSelected);
    gpsBtn.textContent = gpsSelected ? `✓ ${GPS_LABEL}` : GPS_LABEL;
    manualBtn.textContent = manualSelected ? `✓ ${MANUAL_LABEL}` : MANUAL_LABEL;
  }

  function clearSelected() {
    gpsBtn.classList.remove('selected-location');
    manualBtn.classList.remove('selected-location');
    gpsBtn.textContent = GPS_LABEL;
    manualBtn.textContent = MANUAL_LABEL;
  }

  function syncManualAddress() {
    if (manualFields.hidden) return false;
    const streetValue = street?.value.trim() || '';
    const communityValue = community?.value.trim() || '';
    const townValue = town?.value?.trim() || '';
    if (townValue && streetValue.length >= 5 && communityValue.length >= 3) {
      addressValue.value = `${streetValue}, ${communityValue}, ${townValue}, Puerto Rico`;
      setSelected('manual');
      return true;
    }
    addressValue.value = '';
    return false;
  }

  gpsBtn.addEventListener('click', () => {
    clearErrors();
    manualFields.hidden = true;
    addressValue.value = '';
    clearSelected();
    if (!navigator.geolocation) {
      addLocationError('Este dispositivo no permite obtener la ubicación. Use “Escribir dirección”.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        addressValue.value = `GPS: https://maps.google.com/?q=${lat},${lng}`;
        setSelected('gps');
        clearErrors();
      },
      () => {
        addressValue.value = '';
        clearSelected();
        addLocationError('No pudimos obtener su ubicación. Active el permiso de ubicación o escriba la dirección manualmente.');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  });

  manualBtn.addEventListener('click', () => {
    clearErrors();
    manualFields.hidden = false;
    addressValue.value = '';
    setSelected('manual');
    setTimeout(() => street?.focus(), 50);
  });

  [street, community, town].forEach(el => {
    el?.addEventListener('input', syncManualAddress);
    el?.addEventListener('change', syncManualAddress);
  });

  nextBtn?.addEventListener('click', event => {
    const firstStepActive = document.querySelector('.step[data-step="1"]')?.classList.contains('active');
    if (!firstStepActive) return;
    clearErrors();
    if (!manualFields.hidden && !syncManualAddress()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!town?.value?.trim()) addLocationError('Primero seleccione el pueblo.');
      else if ((street?.value.trim() || '').length < 5) addLocationError('Escriba una calle, carretera y/o número válido.');
      else addLocationError('Añada la urbanización, condominio o sector.');
      document.getElementById('locationBox')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!addressValue.value.trim()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      addLocationError('Seleccione “Usar mi ubicación actual” o “Escribir dirección” antes de continuar.');
      document.getElementById('locationBox')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();