// Simple logging utility for production safety
const isDevelopment = import.meta.env.DEV

export const logger = {
  info: (message, ...args) => {
    if (isDevelopment) {
      console.log(message, ...args)
    }
  },
  error: (message, ...args) => {
    if (isDevelopment) {
      console.error(message, ...args)
    }
  },
  warn: (message, ...args) => {
    if (isDevelopment) {
      console.warn(message, ...args)
    }
  }
}