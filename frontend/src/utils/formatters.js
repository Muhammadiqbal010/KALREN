// src/utils/formatter.js

export const formatDescription = (text) => {
  if (!text) return '';

  return text
    .replace(/\r\n/g, '\n') // windows -> unix
    .replace(/\n{3,}/g, '\n\n') // maksimal 2 line break
    .trim();
};