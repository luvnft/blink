/**
 * Validates a username according to the BARK BLINKS requirements.
 * 
 * @param username - The username to validate
 * @returns boolean - True if the username is valid, false otherwise
 */
export function validateUsername(username: string): boolean {
    // Username must be between 3 and 20 characters long
    if (username.length < 3 || username.length > 20) {
      return false;
    }
  
    // Username must start with a letter
    if (!/^[a-zA-Z]/.test(username)) {
      return false;
    }
  
    // Username can only contain letters, numbers, underscores, and hyphens
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return false;
    }
  
    // Username cannot have consecutive underscores or hyphens
    if (/(__|--|-_|_-)/.test(username)) {
      return false;
    }
  
    // Username cannot end with an underscore or hyphen
    if (/[_-]$/.test(username)) {
      return false;
    }
  
    return true;
  }
  
  /**
   * Generates a random username suggestion based on a given base name.
   * 
   * @param baseName - The base name to use for generating the username
   * @returns string - A randomly generated username suggestion
   */
  export function generateUsernameSuggestion(baseName: string): string {
    const cleanedBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${cleanedBaseName}${randomSuffix}`;
  }
  
  /**
   * Formats a username for display, capitalizing the first letter.
   * 
   * @param username - The username to format
   * @returns string - The formatted username
   */
  export function formatUsername(username: string): string {
    return username.charAt(0).toUpperCase() + username.slice(1);
  }
  
  /**
   * Checks if a given string is a valid email address.
   * 
   * @param email - The email address to validate
   * @returns boolean - True if the email is valid, false otherwise
   */
  export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Masks an email address for display, showing only the first and last characters of the local part.
   * 
   * @param email - The email address to mask
   * @returns string - The masked email address
   */
  export function maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    const maskedLocalPart = `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`;
    return `${maskedLocalPart}@${domain}`;
  }
  
  /**
   * Generates a gravatar URL for a given email address.
   * 
   * @param email - The email address to generate the gravatar for
   * @param size - The size of the gravatar image (default: 200)
   * @returns string - The gravatar URL
   */
  export function getGravatarUrl(email: string, size: number = 200): string {
    const md5 = require('crypto-js/md5');
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
  }
  
  /**
   * Checks if a password meets the minimum strength requirements.
   * 
   * @param password - The password to check
   * @returns boolean - True if the password meets the requirements, false otherwise
   */
  export function isPasswordStrong(password: string): boolean {
    // Password must be at least 8 characters long
    if (password.length < 8) {
      return false;
    }
  
    // Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
    return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  }