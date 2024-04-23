export const isValidEmail = (email: string): boolean => {
  const REGEX_EMAIL = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  return REGEX_EMAIL.test(email);
};

export const isValidPassword = (password: string): boolean => {
  if (password.length < 8) {
    return false;
  }

  const hasNumber = /[0-9]/.test(password);
  if (!hasNumber) {
    return false;
  }

  const hasUpperCase = /[A-Z]/.test(password);
  if (!hasUpperCase) {
    return false;
  }

  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password);
  if (!hasSpecialChar) {
    return false;
  }

  return true;
};

export const isValidUsername = (username: string): boolean => {

  const REGEX_LETTER_NUMBER_ONLY = /^[a-z0-9]+$/

  if (username.length > 8) {
    return false;
  }

  const isValidFormat = REGEX_LETTER_NUMBER_ONLY.test(username);
  if (!isValidFormat) {
    return false;
  }

  return true;
};