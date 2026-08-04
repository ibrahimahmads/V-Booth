const GREETING_ID_KEY = 'vbooth_guest_greeting_id';

export const getStoredGreetingId = (): string | null => {
  return localStorage.getItem(GREETING_ID_KEY);
};

export const setStoredGreetingId = (id: string): void => {
  localStorage.setItem(GREETING_ID_KEY, id);
};

export const removeStoredGreetingId = (): void => {
  localStorage.removeItem(GREETING_ID_KEY);
};