(() => {
  const content = window.KUSIMA_CONTENT;
  const nodes = content.nodes;
  const history = [];
  let currentNode = 'client';

  function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === id));
    window.scrollTo({top:0, behavior:'auto'});
  }

  function goHome() {
    history.length = 0;
    currentNode = 'client';
    showView('home');
  }

  function roomFor(id) {
    return content.roomMap[id] || ['kitchen','· naša kuchyňa'];
  }

  function renderNode(id, push=true) {
    const node = nodes[id];
    if (!node) return;
    currentNode = id;
    if (push && history[history.length - 1] !== id) history.push(id);

    const [room,label] = roomFor(id);
    const dialog = document.getElementById('dialogView');
    dialog.dataset.room = room;
    document.getElementById('roomAssociation').textContent = label;

    const crumbs = document.getElementById('crumbs');
    crumbs.textContent = history.length > 1 ? 'Klient · ' + (node.title || '') : 'Klient';

    const target = document.getElementById('clientContent');
    if (Array.isArray(node.choices)) {
      const meta = content.roomMeta[room] || content.roomMeta.kitchen;
      target.innerHTML = `<div class="page-head"><p class="eyebrow">${meta[0].toUpperCase()}</p><h2>${node.title}</h2><p>${node.intro || meta[1]}</p></div><div class="choice-grid">${node.choices.map(([next,title,desc]) => `<button class="choice" data-node="${next}"><strong>${title}</strong><span>${desc}</span></button>`).join('')}</div>`;
    } else {
      target.innerHTML = `<div class="page-head"><p class="eyebrow">${node.kicker || 'KLIENT'}</p><h2>${node.title}</h2></div><div class="content-card">${node.html || ''}</div>`;
    }
  }

  async function copyText(text, feedbackEl) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly','');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    if (feedbackEl) {
      const old = feedbackEl.dataset.original || feedbackEl.textContent;
      feedbackEl.dataset.original = old;
      feedbackEl.textContent = 'Skopírované ✓';
      setTimeout(() => feedbackEl.textContent = old, 1200);
    }
  }

  function supplierText() {
    return [
      'KUSIMA, s.r.o. SVIT',
      'Sídlo: Rovná 599/17, 058 01 Poprad',
      'IČO: 36450090',
      'DIČ: 2020015833',
      'IČ DPH: nie sme platiteľom DPH',
      'IBAN: SK79 0200 0000 0013 8969 3857',
      'E-mail: info.kusima@gmail.com',
      'Telefón: +421 919 231 998',
      'Kancelária: Mierová 177, 059 21 Svit',
      'Obchodný register: Okresný súd Prešov, oddiel Sro, vložka 10657/P'
    ].join('\n');
  }

  document.addEventListener('click', e => {
    const home = e.target.closest('[data-home]');
    if (home) { e.preventDefault(); goHome(); return; }

    const open = e.target.closest('[data-open]');
    if (open) {
      const id = open.dataset.open;
      if (id === 'dialogView') {
        history.length = 0;
        showView(id);
        renderNode('client', true);
      } else {
        showView(id);
      }
      return;
    }

    const nodeButton = e.target.closest('[data-node]');
    if (nodeButton) { renderNode(nodeButton.dataset.node, true); return; }

    const row = e.target.closest('.copy-line[data-copy]');
    if (row) { copyText(row.dataset.copy, row.querySelector('i')); return; }
  });

  document.getElementById('clientBack').addEventListener('click', () => {
    if (history.length <= 1) { goHome(); return; }
    history.pop();
    renderNode(history[history.length - 1], false);
  });

  document.getElementById('copyAllSupplier').addEventListener('click', e => copyText(supplierText(), e.currentTarget));

  const officeModal = document.getElementById('officeModal');
  document.getElementById('officeButton').addEventListener('click', () => officeModal.classList.add('open'));
  document.querySelector('[data-close-office]').addEventListener('click', () => officeModal.classList.remove('open'));
  officeModal.addEventListener('click', e => { if (e.target === officeModal) officeModal.classList.remove('open'); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
    }
  });

  window.KUSIMA_APP = { showView, goHome, renderNode, currentNode: () => currentNode };
})();
