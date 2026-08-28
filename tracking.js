(function () {
  function getAttribution() {
    var p = new URLSearchParams(window.location.search);
    return {
      utm_source: p.get('utm_source') || sessionStorage.getItem('ym_utm_source') || '',
      utm_medium: p.get('utm_medium') || sessionStorage.getItem('ym_utm_medium') || '',
      utm_campaign: p.get('utm_campaign') || sessionStorage.getItem('ym_utm_campaign') || '',
      utm_term: p.get('utm_term') || sessionStorage.getItem('ym_utm_term') || ''
    };
  }

  var params = new URLSearchParams(window.location.search);
  ['utm_source','utm_medium','utm_campaign','utm_term'].forEach(function (key) {
    if (params.get(key)) sessionStorage.setItem('ym_' + key, params.get(key));
  });

  function send(name, data) {
    var payload = Object.assign({ page_location: window.location.href }, getAttribution(), data || {});
    if (typeof window.gtag === 'function') window.gtag('event', name, payload);
  }

  window.ymTrackEvent = send;
  window.ymTrackForm = function (method) {
    send('form_submit', { method: method || 'unknown' });
    send('generate_lead', { method: method || 'unknown' });
  };

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    var text = (link.textContent || '').trim().slice(0, 100);
    if (href.indexOf('tel:') === 0) {
      send('phone_click', { link_url: href, link_text: text });
    } else if (href.indexOf('wa.me/') !== -1 || href.indexOf('whatsapp.com/') !== -1) {
      send('whatsapp_click', { link_url: href, link_text: text });
    }
  });
})();
