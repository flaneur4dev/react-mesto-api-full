import { useEffect } from 'react';

export function useEscapeClose(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeClose = event => event.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEscapeClose);

    return () => document.removeEventListener("keydown", handleEscapeClose);
  }, [isOpen])
}
