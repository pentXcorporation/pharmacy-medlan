import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useKeyboardShortcuts = () => {
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Alt + key shortcuts
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'd':
            e.preventDefault();
            router.push('/dashboard');
            break;
          case 'p':
            e.preventDefault();
            router.push('/dashboard/pos');
            break;
          case 'i':
            e.preventDefault();
            router.push('/dashboard/inventory');
            break;
          case 's':
            e.preventDefault();
            router.push('/dashboard/sales');
            break;
          case '/':
            e.preventDefault();
            document.querySelector<HTMLInputElement>('input[type="text"], input[type="search"]')?.focus();
            break;
        }
      }

      // Escape to close dialogs
      if (e.key === 'Escape') {
        document.querySelector<HTMLButtonElement>('[data-dialog-close]')?.click();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router]);
};
