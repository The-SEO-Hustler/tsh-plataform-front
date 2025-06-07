'use client';

import React, { useEffect, useRef } from 'react';
import styles from './styles.module.css';
import { Button } from '@/components/ui/button';
function References({ children }) {
  const footnotesListRef = useRef(null);
  const toggleButtonRef = useRef(null);

  useEffect(() => {
    const footnotesList = footnotesListRef.current;
    if (!footnotesList) return;

    const liItems = footnotesList.querySelectorAll('li');
    if (liItems.length <= 3) return;

    // Add initial classes
    footnotesList.classList.add(styles.hide, styles.footnotesCustom);

    // Handle URL hash
    if (window.location.hash.startsWith('#ref-')) {
      const refId = window.location.hash.slice(1);
      const refEl = document.getElementById(refId);
      if (refEl && footnotesList.classList.contains(styles.hide)) {
        footnotesList.classList.remove(styles.hide);
        if (toggleButtonRef.current) {
          toggleButtonRef.current.textContent = 'Show Less';
        }
      }
    }

    // Handle clicks on references
    const handleReferenceClick = (e) => {
      if (e.target.tagName === 'SUP' && e.target.parentElement.tagName === 'A') {
        const href = e.target.parentElement.getAttribute('href');
        if (href.startsWith('#ref-') && footnotesList.classList.contains(styles.hide)) {
          footnotesList.classList.remove(styles.hide);
          if (toggleButtonRef.current) {
            toggleButtonRef.current.textContent = 'Show Less';
          }
        }
      }
    };

    document.addEventListener('click', handleReferenceClick);

    return () => {
      document.removeEventListener('click', handleReferenceClick);
    };
  }, []);

  const handleToggle = () => {
    const footnotesList = footnotesListRef.current;
    if (!footnotesList) return;

    const hidden = footnotesList.classList.toggle(styles.hide);
    if (toggleButtonRef.current) {
      toggleButtonRef.current.textContent = hidden ? 'Show All' : 'Show Less';
    }
  };

  return (
    <div id="references-tsh" className="relative">
      <ol ref={footnotesListRef}>
        {React.Children.map(children, (child) => {
          if (child.type === 'ol') {
            return React.Children.map(child.props.children, (li, index) => {
              if (li.type === 'li') {
                return React.cloneElement(li, {
                  id: `ref-${Math.floor(index / 2) + 1}`,
                  key: index
                });
              }
              return li;
            });
          }
          return child;
        })}
        <div className={styles.footnotesOverlay} onClick={handleToggle} />

      </ol>
      <Button
        ref={toggleButtonRef}
        onClick={handleToggle}
        className={styles.footnotesButton}
      >
        Show All
      </Button>
    </div>
  );
}

export default References; 