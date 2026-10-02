document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     GLOBAL BSPORT HACK (Mobile Only <= 1000px)
     Auto-selects the first available day in the list view.
     ========================================================================== */
  if (window.innerWidth <= 1000) {
    const bsInterval = setInterval(() => {
      // Find the Bsport widget container
      const days = document.querySelectorAll('div[id^="bsport-widget"] .cleanslate button.bs-week__header__date--is-abled');
      if (days.length === 0) return;

      let firstAvailable = null;
      for (let btn of days) {
        const dots = btn.querySelector('.bs-week__header__date__dots');
        if (dots && dots.innerHTML.trim() !== '') {
          firstAvailable = btn;
          break;
        }
      }

      if (firstAvailable) {
        clearInterval(bsInterval);
        const isSelected = firstAvailable.querySelector('.bs-week__header__date__monthDay--is-selected');
        if (!isSelected) {
          firstAvailable.click();
        }
      }
    }, 500);
    // Safety stop after 15 seconds
    setTimeout(() => clearInterval(bsInterval), 15000);
  }
});
