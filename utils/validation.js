const validator = require('validator');

// Validate signup input
exports.validateSignup = (data) => {
  const errors = {};

  // Username validation
  if (!data.username) {
    errors.username = 'Username is required';
  } else if (data.username.length < 3) {
    errors.username = 'Username must be at least 3 characters long';
  } else if (data.username.length > 30) {
    errors.username = 'Username cannot exceed 30 characters';
  }

  // Email validation
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(data.email)) {
    errors.email = 'Invalid email address';
  }

  // Password validation
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  } else if (data.password.length > 50) {
    errors.password = 'Password cannot exceed 50 characters';
  }

  // Optional: Password strength check
  if (data.password && !validator.isStrongPassword(data.password, {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })) {
    errors.password = 'Password must include lowercase, uppercase, number, and symbol';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

// Validate login input
exports.validateLogin = (data) => {
  const errors = {};

  // Email validation
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(data.email)) {
    errors.email = 'Invalid email address';
  }

  // Password validation
  if (!data.password) {
    errors.password = 'Password is required';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

// Sanitize input to prevent XSS and other injection attacks
exports.sanitizeInput = (input) => {
  return {
    username: validator.escape(input.username || ''),
    email: validator.normalizeEmail(input.email || ''),
    password: input.password,// Do not modify password for hashing
    role: input.role
  };
};