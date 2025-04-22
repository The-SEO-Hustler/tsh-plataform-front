import { useEffect } from 'react';

/**
 * useStickyTableHeaders
 *  - Finds all wrapper elements matching the given selector (e.g. figure.wp-block-table)
 *  - On scroll/resize, clones each wrapper, hides its <tbody> (for matching widths),
 *    and fixes the clone's header to the top of the viewport
 *
 * @param {string} wrapperSelector - CSS selector to locate table wrappers (e.g. '.content figure.wp-block-table')
 */
export default function useStickyTableHeaders(wrapperSelector) {
  useEffect(() => {
    const wrappers = Array.from(document.querySelectorAll(wrapperSelector));
    const clones = new Map();

    function updateClones() {
      const scrollY = window.scrollY;

      wrappers.forEach(wrapper => {
        const table = wrapper.querySelector('table');
        if (!table) return;

        const rect = wrapper.getBoundingClientRect();
        const topY = scrollY + rect.top;
        const bottomY = scrollY + rect.bottom;
        const existingClone = clones.get(wrapper);

        if (scrollY > topY && scrollY < bottomY) {
          // In view: create clone if missing
          if (!existingClone) {
            // Deep clone the entire wrapper (preserves <figure> and classes)
            const cloneWrapper = wrapper.cloneNode(true);

            // Position the cloned wrapper fixed at the top
            Object.assign(cloneWrapper.style, {
              position: 'fixed',
              top: '0px',
              left: `${rect.left}px`,   // match original's left offset
              width: `${rect.width}px`, // match original's width
              pointerEvents: 'none',    // allow clicks to pass through
              zIndex: '1000',           // keep on top
            });

            // Inside the clone, hide <tbody> but keep for layout
            const cloneTable = cloneWrapper.querySelector('table');
            if (cloneTable) {
              const cloneTbody = cloneTable.querySelector('tbody');
              if (cloneTbody) cloneTbody.style.visibility = 'hidden';

              // Ensure the table has both original and sticky classes
              cloneTable.classList.add('has-fixed-layout', 'sticky-table-clone');
            }

            document.body.appendChild(cloneWrapper);
            clones.set(wrapper, cloneWrapper);
          } else {
            // Update position/width on scroll/resize
            Object.assign(existingClone.style, {
              left: `${rect.left}px`,
              width: `${rect.width}px`,
            });
          }
        } else if (existingClone) {
          // Out of view: remove clone
          existingClone.remove();
          clones.delete(wrapper);
        }
      });
    }

    window.addEventListener('scroll', updateClones);
    window.addEventListener('resize', updateClones);
    // Initial invocation
    updateClones();

    // Cleanup listeners & clones on unmount
    return () => {
      window.removeEventListener('scroll', updateClones);
      window.removeEventListener('resize', updateClones);
      clones.forEach(c => c.remove());
      clones.clear();
    };
  }, [wrapperSelector]);
}
