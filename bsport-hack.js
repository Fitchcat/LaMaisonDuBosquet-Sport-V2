document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     GLOBAL BSPORT HACK (Mobile Only <= 1000px)
     Auto-selects the first available day in the list view.
     ========================================================================== */
  const bsInterval = setInterval(() => {
    // Ne s'active que sur mobile
    if (window.innerWidth > 1000) return;

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
      const isSelected = firstAvailable.querySelector('.bs-week__header__date__monthDay--is-selected');
      if (!isSelected) {
        firstAvailable.click();
      } else {
        // Le jour est bien sélectionné, on peut arrêter l'intervalle
        clearInterval(bsInterval);
      }
    }
  }, 500);

  // Safety stop after 15 seconds
  setTimeout(() => clearInterval(bsInterval), 15000);
});
