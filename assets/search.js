/* Progressive enhancement: all reference and example content is readable without JS. */
(() => {
  'use strict';
  for (const collection of document.querySelectorAll('[data-search-collection]')) {
    const search = collection.querySelector('input[type="search"]'), category = collection.querySelector('select'), count = collection.querySelector('[role="status"]');
    const cards = [...collection.querySelectorAll('[data-search-card]')];
    const normalized = text => text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    function filter() {
      const terms = normalized(search.value).split(/\s+/).filter(Boolean);
      let shown = 0;
      for (const card of cards) {
        const haystack = normalized(card.textContent + ' ' + (card.dataset.keywords || ''));
        const matches = (!category.value || card.dataset.category === category.value) && terms.every(term => haystack.includes(term));
        card.hidden = !matches;
        if (matches) shown++;
      }
      count.textContent = shown ? `${shown} of ${cards.length} entries shown.` : 'No matches. Try a shorter word, another topic, or clear the filters.';
    }
    search.addEventListener('input', filter); category.addEventListener('change', filter);
    collection.querySelector('[data-clear-search]').addEventListener('click', () => { search.value = ''; category.value = ''; filter(); search.focus(); });
    const revealHash = () => {
      let target;
      try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
      if (target && cards.includes(target)) { search.value = ''; category.value = ''; filter(); target.scrollIntoView(); }
    };
    window.addEventListener('hashchange', revealHash);
    filter(); if (location.hash) revealHash();
    collection.querySelector('.search-controls').hidden = false;
  }
  for (const button of document.querySelectorAll('[data-copy-code]')) button.addEventListener('click', async () => {
    const code = document.getElementById(button.dataset.copyCode);
    const status = button.parentElement.querySelector('[role="status"]');
    try { await navigator.clipboard.writeText(code.textContent); status.textContent = 'Code copied.'; }
    catch { status.textContent = 'Copy unavailable here. Select the code below, or download the Java file.'; }
  });
})();
