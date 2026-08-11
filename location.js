(() => {
  const mapBtn = document.getElementById('mapBtn');
  const manualBtn = document.getElementById('manualAddressBtn');
  const mapFields = document.getElementById('mapFields');
  const mapSearch = document.getElementById('mapSearch');
  const mapSearchBtn = document.getElementById('mapSearchBtn');
  const manualFields = document.getElementById('manualAddressFields');
  const addressValue = document.getElementById('addressValue');
  const street = document.getElementById('streetAddress');
  const community = document.getElementById('communityAddress');
  const town = document.querySelector('[name="town"]');
  const nextBtn = document.getElementById('nextBtn');

  if (!mapBtn || !manualBtn || !addressValue) return;

  const MAP_LABEL = '📍 Buscar ubicación en el mapa';
  const MANUAL_LABEL = '✍️ Escribir dirección';
  let map = null;
  let marker = null;
  let selectedMode = null;

  function clearErrors() {
    document.querySelectorAll('#locationBox .error').forEach(el => el.remove());
  }

  function addLocationError(message, target = document.getElementById('locationBox')) {
    clearErrors();
    const err = document.createElement('div');
    err.className = 'error';
    err.textContent = message;
    target?.appendChild(err);
  }

  function setSelected(mode) {
    selectedMode = mode;
    const mapSelected = mode === 'map';
    const manualSelected = mode === 'manual';
    mapBtn.classList.toggle('selected-location', mapSelected);
    manualBtn.classList.toggle('selected-location', manualSelected);
    mapBtn.textContent = mapSelected ? `✓ ${MAP_LABEL}` : MAP_LABEL;
    manualBtn.textContent = manualSelected ? `✓ ${MANUAL_LABEL}` : MANUAL_LABEL;
  }

  function clearSelected() {
    selectedMode = null;
    mapBtn.classList.remove('selected-location');
    manualBtn.classList.remove('selected-location');
    mapBtn.textContent = MAP_LABEL;
    manualBtn.textContent = MANUAL_LABEL;
  }

  function saveMapPoint(lat, lng, label = '') {
    const latFixed = Number(lat).toFixed(6);
    const lngFixed = Number(lng).toFixed(6);
    const mapLink = `https://maps.google.com/?q=${latFixed},${lngFixed}`;
    addressValue.value = label ? `Mapa: ${mapLink} | ${label}` : `Mapa: ${mapLink}`;
    setSelected('map');
    clearErrors();
  }

  function placeMarker(lat, lng, label = '') {
    if (!map) return;
    const point = [Number(lat), Number(lng)];
    if (!marker) {
      marker = L.marker(point, { draggable: true }).addTo(map);
      marker.on('dragend', () => {
        const p = marker.getLatLng();
        saveMapPoint(p.lat, p.lng);
      });
    } else {
      marker.setLatLng(point);
    }
    map.setView(point, 17);
    saveMapPoint(point[0], point[1], label);
  }

  function ensureMap() {
    if (map) {
      setTimeout(() => map.invalidateSize(), 80);
      return;
    }
    if (typeof L === 'undefined') {
      addLocationError('No fue posible cargar el mapa. Use “Escribir dirección”.');
      return;
    }
    map = L.map('serviceMap', { zoomControl: true }).setView([18.2208, -66.5901], 9);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    map.on('click', e => placeMarker(e.latlng.lat, e.latlng.lng));
    setTimeout(() => map.invalidateSize(), 80);
  }

  async function searchMapLocation() {
    clearErrors();
    const query = mapSearch?.value.trim() || '';
    if (query.length < 3) {
      addLocationError('Escriba una dirección, urbanización o lugar para buscar.', mapFields);
      mapSearch?.focus();
      return;
    }
    mapSearchBtn.disabled = true;
    mapSearchBtn.textContent = 'Buscando…';
    try {
      const townValue = town?.value?.trim() || '';
      const fullQuery = [query, townValue && townValue !== 'Otro pueblo' ? townValue : '', 'Puerto Rico'].filter(Boolean).join(', ');
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=pr&limit=5&q=${encodeURIComponent(fullQuery)}`;
      const response = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('search failed');
      const results = await response.json();
      if (!Array.isArray(results) || !results.length) {
        addLocationError('No encontramos esa ubicación. Intente otra búsqueda o toque el punto directamente en el mapa.', mapFields);
        return;
      }
      const result = results[0];
      placeMarker(result.lat, result.lon, result.display_name || '');
    } catch (_) {
      addLocationError('No se pudo completar la búsqueda. Puede tocar directamente la ubicación en el mapa o escribir la dirección.', mapFields);
    } finally {
      mapSearchBtn.disabled = false;
      mapSearchBtn.textContent = 'Buscar';
    }
  }

  function syncManualAddress() {
    if (manualFields.hidden) return false;
    const streetValue = street?.value.trim() || '';
    const communityValue = community?.value.trim() || '';
    const townValue = town?.value?.trim() || '';
    if (townValue && streetValue.length >= 5 && communityValue.length >= 3) {
      addressValue.value = `${streetValue}, ${communityValue}, ${townValue}, Puerto Rico`;
      setSelected('manual');
      clearErrors();
      return true;
    }
    addressValue.value = '';
    manualBtn.classList.remove('selected-location');
    manualBtn.textContent = MANUAL_LABEL;
    return false;
  }

  mapBtn.addEventListener('click', () => {
    clearErrors();
    manualFields.hidden = true;
    mapFields.hidden = false;
    addressValue.value = '';
    clearSelected();
    ensureMap();
    setTimeout(() => mapSearch?.focus(), 80);
  });

  manualBtn.addEventListener('click', () => {
    clearErrors();
    mapFields.hidden = true;
    manualFields.hidden = false;
    addressValue.value = '';
    clearSelected();
    setTimeout(() => street?.focus(), 50);
  });

  mapSearchBtn?.addEventListener('click', searchMapLocation);
  mapSearch?.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      searchMapLocation();
    }
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
      addLocationError(selectedMode === 'map'
        ? 'Seleccione un punto en el mapa antes de continuar.'
        : 'Seleccione “Buscar ubicación en el mapa” o “Escribir dirección” antes de continuar.');
      document.getElementById('locationBox')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();