(() => {
  const dateEl = document.getElementById('date');
  const clockEl = document.getElementById('clock');

  function updateClock() {
    const now = new Date();
    if (dateEl) dateEl.textContent = new Intl.DateTimeFormat('sk-SK',{weekday:'long',day:'numeric',month:'long'}).format(now);
    if (clockEl) clockEl.textContent = now.toLocaleTimeString('sk-SK',{hour:'2-digit',minute:'2-digit'});
  }
  updateClock();
  setInterval(updateClock, 1000);

  const nameday = document.getElementById('namedayName');
  fetch('data/nameday.json',{cache:'no-store'})
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => { if (nameday && data?.name) nameday.textContent = data.name; })
    .catch(() => {});

  const weather = document.getElementById('kusimaWeather');
  const iconCodeFor = (code,isDay) => {
    const suffix = isDay !== 0 ? 'd' : 'n';
    if (code === 0) return '01'+suffix;
    if (code === 1) return '02'+suffix;
    if (code === 2) return '03'+suffix;
    if (code === 3) return '04'+suffix;
    if (code === 45 || code === 48) return '50'+suffix;
    if ([51,53,55,56,57].includes(code)) return '09'+suffix;
    if ([61,63,65,66,67].includes(code)) return '10'+suffix;
    if ([80,81,82].includes(code)) return '09'+suffix;
    if ([71,73,75,77,85,86].includes(code)) return '13'+suffix;
    if ([95,96,99].includes(code)) return '11'+suffix;
    return '02'+suffix;
  };
  fetch('data/weather-svit.json',{cache:'no-store'})
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => {
      if (!weather || data?.status !== 'ok' || typeof data.temperature !== 'number') return;
      const code = iconCodeFor(Number(data.weather_code),Number(data.is_day));
      weather.innerHTML = `<img src="https://openweathermap.org/img/wn/${code}@2x.png" alt="" aria-hidden="true" style="width:30px;height:30px"><span class="hero-weather-temp">${Math.round(data.temperature)} °C</span>`;
      weather.title = 'Svit · ' + (data.description || 'aktuálne počasie');
    })
    .catch(() => {});

  function loadNews(path,targetId,fallbackUrl,fallbackText) {
    const target = document.getElementById(targetId);
    if (!target) return;
    fetch(path,{cache:'no-store'})
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const item = Array.isArray(data?.items) ? data.items[0] : null;
        if (!item?.title) return;
        target.href = item.link || fallbackUrl;
        target.textContent = item.title + ' ↗';
      })
      .catch(() => { target.href = fallbackUrl; target.textContent = fallbackText; });
  }
  loadNews('data/svit-news.json','svitNewsLink','https://www.svit.sk/mesto/aktuality/','Aktuality Mesta Svit ↗');
  loadNews('data/tatry-news.json','tatryNewsLink','https://visittatry.sk/','Novinky z Vysokých Tatier ↗');

  const slides = [
    ['https://commons.wikimedia.org/wiki/Special:Redirect/file/Svit,%20pohled%20na%20Tatry.jpg?width=1600','Svit · Tatry na dosah','https://commons.wikimedia.org/wiki/File:Svit,_pohled_na_Tatry.jpg'],
    ['https://commons.wikimedia.org/wiki/Special:Redirect/file/Svit,%20Hlavn%C3%A1%20(1).jpg?width=1600','Svit · Hlavná','https://commons.wikimedia.org/wiki/Category:Svit'],
    ['https://commons.wikimedia.org/wiki/Special:Redirect/file/Svit,%20Mierov%C3%A1%20(1).jpg?width=1600','Svit · Mierová','https://commons.wikimedia.org/wiki/Category:Svit'],
    ['https://commons.wikimedia.org/wiki/Special:Redirect/file/Svit,%20Slovakia.jpg?width=1600','Svit · mesto pod Tatrami','https://commons.wikimedia.org/wiki/File:Svit,_Slovakia.jpg'],
    ['https://commons.wikimedia.org/wiki/Special:Redirect/file/%C4%8Cas%C5%A5%20Svitu%20a%20Vysok%C3%A9%20Tatry%203.jpg?width=1600','Svit a Vysoké Tatry','https://commons.wikimedia.org/wiki/Category:Svit'],
    ['https://commons.wikimedia.org/wiki/Special:Redirect/file/Panorama%20High%20Tatras%20from%20Poprad.jpg?width=1600','Tatry z Popradu','https://commons.wikimedia.org/wiki/File:Panorama_High_Tatras_from_Poprad.jpg']
  ];
  const photo = document.getElementById('heroPhoto');
  const credit = document.getElementById('heroCredit');
  let slide = 0;
  if (photo && credit && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(() => {
      slide = (slide + 1) % slides.length;
      const [src,label,url] = slides[slide];
      photo.src = src;
      photo.alt = label;
      credit.href = url;
      credit.textContent = label + ' · Wikimedia Commons ↗';
    }, 12000);
  }
})();
