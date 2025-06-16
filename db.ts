import { SavedPrompt } from './types';

const DB_NAME = 'PromptMatrixDB';
const DB_VERSION = 1;
const STORE_NAME = 'userPrompts';

let db: IDBDatabase | null = null;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      console.error("IndexedDB not supported by this browser.");
      return reject(new Error("IndexedDB not supported"));
    }

    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', (event.target as IDBRequest).error);
      reject(new Error('Error opening database'));
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const tempDb = (event.target as IDBOpenDBRequest).result;
      if (!tempDb.objectStoreNames.contains(STORE_NAME)) {
        tempDb.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

export const addPromptToDB = async (prompt: Omit<SavedPrompt, 'id' | 'timestamp'>): Promise<number> => {
  const currentDb = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = currentDb.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const promptWithTimestamp: Omit<SavedPrompt, 'id'> = { ...prompt, timestamp: Date.now() };
    const request = store.add(promptWithTimestamp);

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as number);
    };
    request.onerror = (event) => {
      console.error('Error adding prompt:', (event.target as IDBRequest).error);
      reject(new Error('Error adding prompt'));
    };
  });
};

export const getAllPromptsFromDB = async (): Promise<SavedPrompt[]> => {
  const currentDb = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = currentDb.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = (event) => {
      const prompts = (event.target as IDBRequest).result as SavedPrompt[];
      // Sort by timestamp descending (newest first)
      resolve(prompts.sort((a, b) => b.timestamp - a.timestamp));
    };
    request.onerror = (event) => {
      console.error('Error fetching prompts:', (event.target as IDBRequest).error);
      reject(new Error('Error fetching prompts'));
    };
  });
};

export const getPromptByIdFromDB = async (id: number): Promise<SavedPrompt | undefined> => {
  const currentDb = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = currentDb.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as SavedPrompt | undefined);
    };
    request.onerror = (event) => {
      console.error('Error fetching prompt by ID:', (event.target as IDBRequest).error);
      reject(new Error('Error fetching prompt by ID'));
    };
  });
};

export const updatePromptInDB = async (prompt: SavedPrompt): Promise<void> => {
  const currentDb = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = currentDb.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const promptWithTimestamp: SavedPrompt = { ...prompt, timestamp: Date.now() };
    const request = store.put(promptWithTimestamp);

    request.onsuccess = () => {
      resolve();
    };
    request.onerror = (event) => {
      console.error('Error updating prompt:', (event.target as IDBRequest).error);
      reject(new Error('Error updating prompt'));
    };
  });
};

export const deletePromptFromDB = async (id: number): Promise<void> => {
  const currentDb = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = currentDb.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };
    request.onerror = (event) => {
      console.error('Error deleting prompt:', (event.target as IDBRequest).error);
      reject(new Error('Error deleting prompt'));
    };
  });
};