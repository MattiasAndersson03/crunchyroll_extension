

const toggleSwitch = document.getElementById('toggleSwitch');
const toggleLabel = document.getElementById('toggleLabel');
const darkModeSwitch = document.getElementById('darkModeSwitch');
const darkModeLabel = document.getElementById('darkModeLabel');

// Ladda tillståndet vid start
chrome.storage.sync.get(['hideDubEnabled', 'darkModeEnabled'], async (result) => {
  // Dubbar
  let dubEnabled;
  if (typeof result.hideDubEnabled === 'undefined') {
    dubEnabled = false;
    chrome.storage.sync.set({ hideDubEnabled: false });
  } else {
    dubEnabled = result.hideDubEnabled;
  }
  toggleSwitch.checked = dubEnabled;
  toggleLabel.textContent = dubEnabled ? 'Hide Dubs (ON)' : 'Hide Dubs (OFF)';
  // Dark mode
  let darkEnabled;
  if (typeof result.darkModeEnabled === 'undefined') {
    darkEnabled = true;
    chrome.storage.sync.set({ darkModeEnabled: true });
  } else {
    darkEnabled = result.darkModeEnabled;
  }
  darkModeSwitch.checked = darkEnabled;
  darkModeLabel.textContent = darkEnabled ? 'Dark Mode (ON)' : 'Dark Mode (OFF)';

  // Injectera dark mode direkt om den är på
  if (darkEnabled) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const styleId = 'crunchyroll-darkmode-style';
          let styleTag = document.getElementById(styleId);
          if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = styleId;
            styleTag.textContent = `
              html, body {
                background: #181818 !important;
                color: #e0e0e0 !important;
              }
              .main-content, .content-wrapper, .container, .card, .header, .footer,
              header, #header, .site-header, .top-bar, .c-header, .c-header__container,
              #footer_menu, #footer_menu *,
              .day-content, .day-content *,
              .releases, .releases *,
              .release, .release *,
              .featured-episode, .featured-episode *,
              .availability, .availability *,
              .season-name, .season-name *,
              .episode-name, .episode-name * {
                background: #222 !important;
                color: #e0e0e0 !important;
                border-color: #444 !important;
              }
              a, button, input, select, textarea {
                color: #e0e0e0 !important;
                background: #222 !important;
                border-color: #444 !important;
              }
            `;
            document.head.appendChild(styleTag);
          }
        }
      });
    }
  }
});

toggleSwitch.addEventListener('change', async () => {
  const enabled = toggleSwitch.checked;
  chrome.storage.sync.set({ hideDubEnabled: enabled });
  toggleLabel.textContent = enabled ? 'Hide Dubs (ON)' : 'Hide Dubs (OFF)';

  // Uppdatera sidan direkt
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (isEnabled) => {
        if (!isEnabled) {
          document.querySelectorAll('.hidden-dub').forEach(el => el.classList.remove('hidden-dub'));
        } else {
          // Samma kod som tidigare för att dölja dubbar
          const style = document.createElement('style');
          style.textContent = `.hidden-dub { display: none !important; }`;
          document.head.appendChild(style);
          function hideDubShows() {
            const showTitles = document.querySelectorAll('cite');
            showTitles.forEach(el => {
              if (
                el.textContent &&
                el.textContent.toLowerCase().includes('dub') &&
                !el.classList.contains('checked-dub')
              ) {
                const parent = el.closest('[data-t="simulcast-calendar-card"]');
                if (parent) {
                  parent.classList.add('hidden-dub');
                } else {
                  el.classList.add('hidden-dub');
                }
                el.classList.add('checked-dub');
              }
            });
          }
          hideDubShows();
          const interval = setInterval(hideDubShows, 1000);
          setTimeout(() => clearInterval(interval), 30000);
        }
      },
      args: [enabled]
    });
  }
});

darkModeSwitch.addEventListener('change', async () => {
  const enabled = darkModeSwitch.checked;
  chrome.storage.sync.set({ darkModeEnabled: enabled });
  darkModeLabel.textContent = enabled ? 'Dark Mode (ON)' : 'Dark Mode (OFF)';

  // Injectera/ta bort dark mode CSS
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (isEnabled) => {
        const styleId = 'crunchyroll-darkmode-style';
        let styleTag = document.getElementById(styleId);
        if (isEnabled) {
          if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = styleId;
            styleTag.textContent = `
              html, body {
                background: #181818 !important;
                color: #e0e0e0 !important;
              }
              .main-content, .content-wrapper, .container, .card, .header, .footer,
              header, #header, .site-header, .top-bar, .c-header, .c-header__container,
              #footer_menu, #footer_menu *,
              .day-content, .day-content *,
              .releases, .releases *,
              .release, .release *,
              .featured-episode, .featured-episode *,
              .availability, .availability *,
              .season-name, .season-name *,
              .episode-name, .episode-name * {
                background: #222 !important;
                color: #e0e0e0 !important;
                border-color: #444 !important;
              }
              a, button, input, select, textarea {
                color: #e0e0e0 !important;
                background: #222 !important;
                border-color: #444 !important;
              }
            `;
            document.head.appendChild(styleTag);
          }
        } else {
          if (styleTag) {
            styleTag.remove();
          }
        }
      },
      args: [enabled]
    });
  }
});
