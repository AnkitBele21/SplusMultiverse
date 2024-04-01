type Dictionary = Record<string, any>;

export const areKeysEmpty = (obj: Dictionary, keysToCheck: string[]): boolean => {
  return keysToCheck.every(key => {
    const value = obj[key];
    return value === undefined || value === null || value === '';
  });
}