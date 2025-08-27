

function hideDubShows() {
  console.log('[HideDub] Kör hideDubShows');
  const showTitles = document.querySelectorAll('cite');
  if (showTitles.length === 0) {
    console.log('[HideDub] Inga <cite>-element hittades på sidan');
  }
  let found = false;
  showTitles.forEach(el => {
    if (
      el.textContent &&
      el.textContent.toLowerCase().includes('dub') &&
      !el.classList.contains('checked-dub')
    ) {
      found = true;
      // Dölj hela <li>-elementet om det är en dub
      const liElem = el.closest('li');
      if (liElem) {
        liElem.classList.add('hidden-dub');
        console.log('[HideDub] Dold hela li:', el.textContent.trim());
      } else {
        // fallback: dölj release-article eller cite
        const releaseArticle = el.closest('article.release');
        if (releaseArticle) {
          releaseArticle.classList.add('hidden-dub');
          console.log('[HideDub] Dold hela release:', el.textContent.trim());
        } else {
          el.classList.add('hidden-dub');
          console.log('[HideDub] Dold bara cite:', el.textContent.trim());
        }
      }
      el.classList.add('checked-dub');
    }
  });
  if (!found) {
    console.log('[HideDub] Inga dubbar hittades att dölja');
  }
}

function showDubShows() {
  document.querySelectorAll('.hidden-dub').forEach(el => el.classList.remove('hidden-dub'));
  document.querySelectorAll('.checked-dub').forEach(el => el.classList.remove('checked-dub'));
}

let interval = null;
let styleTag = null;
let showInterval = null;

function startHideDub() {
  // Stoppa showInterval om det finns
  if (showInterval) {
    clearInterval(showInterval);
    showInterval = null;
    console.log('[HideDub] startHideDub: showInterval stoppad');
  }
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.textContent = `.hidden-dub { display: none !important; }`;
    document.head.appendChild(styleTag);
  }
  hideDubShows();
  if (interval) clearInterval(interval);
  interval = setInterval(hideDubShows, 1000);
  console.log('[HideDub] startHideDub: interval för att dölja dubbar startad');
}

function stopHideDub() {
  // Stoppa interval om det finns
  if (interval) {
    clearInterval(interval);
    interval = null;
    console.log('[HideDub] stopHideDub: interval för att dölja dubbar stoppad');
  }
  if (showInterval) {
    clearInterval(showInterval);
    showInterval = null;
  }
  showDubShows(); // Visa dubbar direkt
  if (styleTag) {
    styleTag.remove();
    styleTag = null;
    console.log('[HideDub] stopHideDub: styleTag borttagen');
  }
}


console.log('[HideDub] Content-script laddat!');
chrome.storage.sync.get(['hideDubEnabled'], (result) => {
  console.log('[HideDub] hideDubEnabled:', result.hideDubEnabled);
  if (result.hideDubEnabled) {
    startHideDub();
  }
});


chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.hideDubEnabled) {
    if (changes.hideDubEnabled.newValue) {
      startHideDub();
    } else {
      stopHideDub();
    }
  }
});
