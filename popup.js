document.getElementById('toggle').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab && tab.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
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
    });
  }
});
