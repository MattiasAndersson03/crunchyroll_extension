// --- Configuration ---
const languageMarkers = [
  'dub)', 'dubbed)', '(english)', '(français)', '(deutsch)', 
  '(italiano)', '(español', '(português', '(hindi)', '(tamil)',
  '(russian', '(castilian', '(arabic', '(chinese', '(mandarin',
  '普通话', '中文', '粵語', '(brasil))', '(latina))'
];

let observer = null;
let styleTag = null;

// --- COre fea---

function hideDubShows() {
  // Hittar alla <cite> som inte redan har markerats
  const showTitles = document.querySelectorAll('cite:not(.checked-dub)');
  
  showTitles.forEach(el => {
    const text = el.textContent ? el.textContent.toLowerCase() : '';
    
    // Kollar om texten innehåller "dub" eller något av språken i listan
    const isDub = languageMarkers.some(lang => text.includes(lang));

    if (isDub) {
      // Försöker hitta närmaste li eller article för att dölja hela kortet
      const target = el.closest('li') || el.closest('article.release') || el;
      target.classList.add('hidden-dub');
      el.classList.add('checked-dub');
      console.log('[HideDub] Dold:', text.trim());
    } else {
      // Markera som kollad även om den inte döljs för att slippa kolla den igen
      el.classList.add('checked-dub');
    }
  });
}

function startHideDub() {
  // 1. Lägg till CSS-regeln i head
  if (!document.getElementById('hide-dub-style')) {
    styleTag = document.createElement('style');
    styleTag.id = 'hide-dub-style';
    styleTag.textContent = `.hidden-dub { display: none !important; }`;
    document.head.appendChild(styleTag);
  }

  // 2. Kör direkt på befintliga element
  hideDubShows();

  // 3. Starta MutationObserver för att bevaka dynamiskt innehåll
  if (!observer) {
    observer = new MutationObserver(() => {
      hideDubShows();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    console.log('[HideDub] Bevakar sidan efter nya dubbar...');
  }
}

function stopHideDub() {
  // Stoppa observern
  if (observer) {
    observer.disconnect();
    observer = null;
    console.log('[HideDub] Slutat bevaka sidan');
  }

  // Ta bort CSS-taggen
  const existingStyle = document.getElementById('hide-dub-style');
  if (existingStyle) {
    existingStyle.remove();
  }

  // Visa alla dolda element igen
  document.querySelectorAll('.hidden-dub').forEach(el => el.classList.remove('hidden-dub'));
  document.querySelectorAll('.checked-dub').forEach(el => el.classList.remove('checked-dub'));
}

// --- Initiering och lyssnare ---

// Kolla inställningen vid start
chrome.storage.sync.get(['hideDubEnabled'], (result) => {
  if (result.hideDubEnabled) {
    startHideDub();
  }
});

// Lyssna på ändringar från popup/inställningar
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.hideDubEnabled) {
    if (changes.hideDubEnabled.newValue) {
      startHideDub();
    } else {
      stopHideDub();
    }
  }
});