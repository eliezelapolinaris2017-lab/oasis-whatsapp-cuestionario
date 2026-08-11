(() => {
  const gpsBtn = document.getElementById('gpsBtn');
  const manualBtn = document.getElementById('manualAddressBtn');
  const saveManualBtn = document.getElementById('saveManualAddress');
  const manualFields = document.getElementById('manualAddressFields');
  const addressValue = document.getElementById('addressValue');
  const street = document.getElementById('streetAddress');
  const community = document.getElementById('communityAddress');
  const town = document.querySelector('[name="town"]');
  const nextBtn = document.getElementById('nextBtn');

  if (!gpsBtn || !manualBtn || !addressValue) return;

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
    gpsBtn.classList.toggle('selected-location', mode === 'gps');
    manualBtn.classList.toggle('selected-location', mode === 'manual');
  }

  gpsBtn.addEventListener('click', () => {
    clearErrors();
    manualFields.hidden = true;
    addressValue.value = '';
    setSelected('gps');

    if (!navigator.geolocation) {
      addLocationError('Este dispositivo no permite obtener la ubicación. Use “Escribir dirección”.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        const mapLink = `https://maps.google.com/?q=${lat},${lng}`;
        addressValue.value = `GPS: ${mapLink}`;
        clearErrors();
      },
      () => {
        addressValue.value = '';
        addLocationError('No pudimos obtener su ubicación. Active el permiso de ubicación o escriba la dirección manualmente.');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  });

  manualBtn.addEventListener('click', () => {
    clearErrors();
    setSelected('manual');
    manualFields.hidden = false;
    addressValue.value = '';
    setTimeout(() => street?.focus(), 50);
  });

  saveManualBtn.addEventListener('click', () => {
    clearErrors();
    const streetValue = street.value.trim();
    const communityValue = community.value.trim();
    const townValue = town?.value?.trim() || '';

    if (!townValue) {
      addLocationError('Primero seleccione el pueblo.');
      town?.focus();
      return;
    }
    if (streetValue.length < 5) {
      addLocationError('Escriba una calle, carretera y/o número válido.');
      street.focus();
      return;
    }
    if (communityValue.length < 3) {
      addLocationError('Añada la urbanización, condominio o sector.');
      community.focus();
      return;
    }

    addressValue.value = `${streetValue}, ${communityValue}, ${townValue}, Puerto Rico`;
    clearErrors();
  });

  [street, community, town].forEach(el => el?.addEventListener('input', () => {
    if (!manualFields.hidden) addressValue.value = '';
  }));

  nextBtn?.addEventListener('click', event => {
    const firstStepActive = document.querySelector('.step[data-step="1"]')?.classList.contains('active');
    if (firstStepActive && !addressValue.value.trim()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      addLocationError('Seleccione “Usar mi ubicación actual” o registre una dirección manual antes de continuar.');
      document.getElementById('locationBox')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();