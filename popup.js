const toggleSwitch = document.getElementById('toggleSwitch');
const toggleLabel = document.getElementById('toggleLabel');
const darkModeSwitch = document.getElementById('darkModeSwitch');
const darkModeLabel = document.getElementById('darkModeLabel');

// Language markers based on the new layout
const languageMarkers = [
  '(english)', '(français)', '(deutsch)', '(italiano)', 
  '(español', '(português', '(hindi)', '(tamil)', '(dub)',
  '中文', '普通话', '(russian', '(castilian'
];

// Function to load initial state
chrome.storage.sync.get(['hideDubEnabled', 'darkModeEnabled'], async (result) => {
  // Dubs/Language filtering
  const dubEnabled = result.hideDubEnabled ?? false;
  if (typeof result.hideDubEnabled === 'undefined') {
    chrome.storage.sync.set({ hideDubEnabled: false });
  }
  toggleSwitch.checked = dubEnabled;
  toggleLabel.textContent = dubEnabled ? 'Hide Dubs (ON)' : 'Hide Dubs (OFF)';

  // Dark mode
  const darkEnabled = result.darkModeEnabled ?? true;
  if (typeof result.darkModeEnabled === 'undefined') {
    chrome.storage.sync.set({ darkModeEnabled: true });
  }
  darkModeSwitch.checked = darkEnabled;
  darkModeLabel.textContent = darkEnabled ? 'Dark Mode (ON)' : 'Dark Mode (OFF)';

  // Inject Dark Mode immediately if enabled
  if (darkEnabled) {
    applyDarkMode(true);
  }
});

// Listener for Hide Dubs
toggleSwitch.addEventListener('change', async () => {
  const enabled = toggleSwitch.checked;
  chrome.storage.sync.set({ hideDubEnabled: enabled });
  toggleLabel.textContent = enabled ? 'Hide Dubs (ON)' : 'Hide Dubs (OFF)';

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (isEnabled, markers) => {
        if (!isEnabled) {
          // Show everything if disabled
          document.querySelectorAll('.hidden-dub').forEach(el => el.classList.remove('hidden-dub'));
          const style = document.getElementById('hide-dub-style-popup');
          if (style) style.remove();
        } else {
          // Add CSS and run filtering
          if (!document.getElementById('hide-dub-style-popup')) {
            const style = document.createElement('style');
            style.id = 'hide-dub-style-popup';
            style.textContent = `.hidden-dub { display: none !important; }`;
            document.head.appendChild(style);
          }

          const filter = () => {
            const titles = document.querySelectorAll('cite:not(.checked-dub), span:not(.checked-dub), h4:not(.checked-dub)');
            titles.forEach(el => {
              const text = el.textContent?.toLowerCase() || '';
              const isDub = markers.some(m => text.includes(m.toLowerCase()));
              if (isDub) {
                // Find the closest container for the release card
                const target = el.closest('[data-t="simulcast-calendar-card"]') || 
                             el.closest('li') || 
                             el.closest('article.release') || 
                             el;
                target.classList.add('hidden-dub');
              }
              el.classList.add('checked-dub');
            });
          };
          filter();
          // Run a short intensive period to catch elements that load slowly (lazy-loading)
          let count = 0;
          const i = setInterval(() => { filter(); if(++count > 15) clearInterval(i); }, 500);
        }
      },
      args: [enabled, languageMarkers]
    });
  }
});

// Listener for Dark Mode
darkModeSwitch.addEventListener('change', () => {
  const enabled = darkModeSwitch.checked;
  chrome.storage.sync.set({ darkModeEnabled: enabled });
  darkModeLabel.textContent = enabled ? 'Dark Mode (ON)' : 'Dark Mode (OFF)';
  applyDarkMode(enabled);
});

// Helper to inject Dark Mode CSS
async function applyDarkMode(isEnabled) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (enable) => {
        const id = 'crunchyroll-darkmode-style';
        let style = document.getElementById(id);
        if (enable) {
          if (!style) {
            style = document.createElement('style');
            style.id = id;
            style.textContent = `
              html, body { background: #181818 !important; color: #e0e0e0 !important; }
              .main-content, .content-wrapper, .container, .card, .header, .footer,
              header, #header, .site-header, .top-bar, .c-header, .c-header__container,
              #footer_menu, #footer_menu *, .day-content, .day-content *,
              .releases, .releases *, .release, .release *,
              .featured-episode, .featured-episode *, .availability, .availability *,
              .season-name, .season-name *, .episode-name, .episode-name * {
                background: #222 !important; color: #e0e0e0 !important; border-color: #444 !important;
              }
              a, button, input, select, textarea { color: #e0e0e0 !important; background: #222 !important; border-color: #444 !important; }
            `;
            document.head.appendChild(style);
          }
        } else if (style) {
          style.remove();
        }
      },
      args: [isEnabled]
    });
  }
}