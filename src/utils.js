// Utility functions for ProfileSpike
export const createPageUrl = (pageName) => {
  if (!pageName) return '/';
  return `/${pageName}`;
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};