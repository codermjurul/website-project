import { useState, useEffect } from 'react';

// A simple hook to manage comparison state using localStorage
// This allows the state to persist across page navigations in our SPA
export function useCompare() {
  const [compareIds, setCompareIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('compareIds');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('compareIds', JSON.stringify(compareIds));
    // Dispatch a custom event so other components know the state changed
    window.dispatchEvent(new Event('compareUpdated'));
  }, [compareIds]);

  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      // Limit comparison to 3 cars maximum
      if (prev.length >= 3) {
        alert('You can only compare up to 3 cars. Please remove one first.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const clearCompare = () => setCompareIds([]);

  return { compareIds, toggleCompare, clearCompare };
}
