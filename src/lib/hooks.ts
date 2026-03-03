import { useEffect, useState } from 'react';

export function useGuestToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let storedToken = localStorage.getItem('guest_token');
    if (!storedToken) {
      storedToken = crypto.randomUUID();
      localStorage.setItem('guest_token', storedToken);
    }
    setToken(storedToken);
  }, []);

  return token;
}
