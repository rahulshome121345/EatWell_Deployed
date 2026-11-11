import { useState, useEffect } from 'react';

/**
 * A custom hook that operates like useState but persists the value to sessionStorage.
 * This allows data to survive page navigation but clears when the tab/browser is closed.
 * A custom hook that operates like useState but persists the value to localStorage.
 * This allows data to survive page navigation and browser restarts.
 * 
 * @param key The unique key to store the data under in localStorage
 * @param initialValue The initial value if no data is found in storage
 */
export function usePersistentState<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    // Initialize state function to avoid unnecessary storage access on every render
    const [state, setState] = useState<T>(() => {
        if (typeof window === "undefined") {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Update storage whenever state changes
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, state]);

    return [state, setState];
}
