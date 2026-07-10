import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

/**
 * Validate phone number with country-specific rules
 * @param {string} phoneNumber - The phone number to validate
 * @param {string} countryCode - ISO country code
 * @returns {Object} - { isValid, error, formatted }
 */
export const validatePhone = (phoneNumber, countryCode = 'IN') => {
  if (!phoneNumber || phoneNumber.trim() === '') {
    return { isValid: false, error: 'Phone number is required', formatted: null };
  }

  try {
    const phone = parsePhoneNumber(phoneNumber, countryCode);
    if (!phone || !isValidPhoneNumber(phoneNumber, countryCode)) {
      return { isValid: false, error: 'Invalid phone number', formatted: null };
    }

    // India-specific validation
    if (phone.country === 'IN') {
      const digits = phone.nationalNumber;
      if (digits.length !== 10) {
        return { isValid: false, error: 'Indian phone must be exactly 10 digits', formatted: null };
      }
      if (!['6', '7', '8', '9'].includes(digits[0])) {
        return { isValid: false, error: 'Indian phone must start with 6,7,8,9', formatted: null };
      }
    }

    return {
      isValid: true,
      error: null,
      formatted: phone.format('E.164'),
    };
  } catch {
    return { isValid: false, error: 'Invalid phone number', formatted: null };
  }
};

export default { validatePhone };