(function () {
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
        el.classList.add('checked-dub'); // Prevent re-checking same element
        console.log('Hid:', el.textContent.trim());
      }
    });
  }

  // Re-check every second (simple fallback for dynamic sites)
  const interval = setInterval(hideDubShows, 1000);

  // Optional: stop checking after e.g. 30 seconds
  setTimeout(() => clearInterval(interval), 30000);
})();
