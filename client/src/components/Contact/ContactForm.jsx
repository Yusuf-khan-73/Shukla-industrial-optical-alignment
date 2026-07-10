/**
 * Contact form with React Hook Form validation.
 * Location: client/src/components/Contact/ContactForm.jsx
 */
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import notify from '@utils/notify';
import { SERVICES_LIST } from '@utils/constants';
import { submitContactForm } from '@api/contact';
import 'react-international-phone/style.css';
import { PhoneInput } from 'react-international-phone';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

const ContactForm = () => {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      company_name: '',
      city: '',
      service_required: '',
      message: '',
    },
    mode: 'onChange',
  });

  // Handle phone change - properly sync with form
  const handlePhoneChange = (value, { country }) => {
    // Update form value
    setValue('phone', value, { shouldValidate: true });
    
    // Trigger validation immediately
    trigger('phone');
  };

  // Custom validation function for phone
  const validatePhoneNumber = (value) => {
    if (!value || value.trim() === '') {
      return 'Phone is required';
    }

    try {
      const phoneNumber = parsePhoneNumber(value);
      if (!phoneNumber || !isValidPhoneNumber(value)) {
        return 'Invalid phone number';
      }

      // India-specific validation
      if (phoneNumber.country === 'IN') {
        const digits = phoneNumber.nationalNumber;
        if (digits.length !== 10) {
          return 'Indian phone must be exactly 10 digits';
        }
        if (!['6', '7', '8', '9'].includes(digits[0])) {
          return 'Indian phone must start with 6,7,8,9';
        }
      }

      return true;
    } catch {
      return 'Invalid phone number';
    }
  };

  const onSubmit = async (data) => {
    // Final validation before submit
    const phoneValidation = validatePhoneNumber(data.phone);
    if (phoneValidation !== true) {
      notify.error(phoneValidation);
      return;
    }

    setSubmitting(true);
    try {
      // Format phone to E.164 before sending
      const phoneNumber = parsePhoneNumber(data.phone);
      const formData = {
        ...data,
        phone: phoneNumber ? phoneNumber.format('E.164') : data.phone,
      };

      await notify.run('Sending message...', () => submitContactForm(formData), {
        success: 'Thank you! Your message has been sent. We will contact you shortly.',
        error: 'Unable to send message. Please call us directly or try WhatsApp.',
      });
      reset();
    } catch {
      // Error toast handled by notify.run
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-form-wrap" data-aos="fade-left">
      <div className="contact-form__header">
        <span className="section-label">Send Inquiry</span>
        <h2 className="contact-form__title">Request a Quote</h2>
        <p className="contact-form__subtitle">
          Fill out the form and our team will respond within 24 hours.
        </p>
      </div>

      <form className="contact-form glass-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">Full Name *</label>
            <input
              id="name"
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="Your full name"
              {...register('name', { 
                required: 'Name is required', 
                minLength: { value: 2, message: 'Min 2 characters' } 
              })}
            />
            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
          </div>

          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">Mobile Number *</label>
            <Controller
              name="phone"
              control={control}
              rules={{
                validate: validatePhoneNumber,
              }}
              render={({ field }) => (
                <div>
                  <PhoneInput
                    value={field.value || ''}
                    onChange={handlePhoneChange}
                    defaultCountry="in"
                    preferredCountries={['in', 'us', 'gb', 'ae', 'ca', 'au']}
                    placeholder="+91 XXXXX XXXXX"
                    inputClassName={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    countrySelectorStyleProps={{
                      buttonClassName: 'country-selector-btn',
                      dropdownStyleProps: {
                        className: 'country-dropdown',
                        style: {
                          maxHeight: '300px',
                          overflowY: 'auto',
                          zIndex: 1050,
                          minWidth: '280px',
                          maxWidth: '90vw',
                        },
                      },
                    }}
                  />
                  {errors.phone && (
                    <div className="invalid-feedback d-block">{errors.phone.message}</div>
                  )}
                </div>
              )}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="email" className="form-label">Email Address *</label>
            <input
              id="email"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="you@company.com"
              {...register('email', {
                required: 'Email is required',
                pattern: { 
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                  message: 'Enter a valid email' 
                },
              })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          <div className="col-md-6">
            <label htmlFor="company_name" className="form-label">Company Name</label>
            <input
              id="company_name"
              type="text"
              className="form-control"
              placeholder="Your company / mill name"
              {...register('company_name')}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="city" className="form-label">City *</label>
            <input
              id="city"
              type="text"
              className={`form-control ${errors.city ? 'is-invalid' : ''}`}
              placeholder="Your city"
              {...register('city', { required: 'City is required' })}
            />
            {errors.city && <div className="invalid-feedback">{errors.city.message}</div>}
          </div>

          <div className="col-md-6">
            <label htmlFor="service_required" className="form-label">Service Required *</label>
            <select
              id="service_required"
              className={`form-select ${errors.service_required ? 'is-invalid' : ''}`}
              {...register('service_required', { required: 'Please select a service' })}
            >
              <option value="">Select a service</option>
              {SERVICES_LIST.map((service) => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
            {errors.service_required && (
              <div className="invalid-feedback">{errors.service_required.message}</div>
            )}
          </div>

          <div className="col-12">
            <label htmlFor="message" className="form-label">Message *</label>
            <textarea
              id="message"
              rows={5}
              className={`form-control ${errors.message ? 'is-invalid' : ''}`}
              placeholder="Describe your project requirements..."
              {...register('message', {
                required: 'Message is required',
                minLength: { value: 10, message: 'Min 10 characters' },
              })}
            />
            {errors.message && <div className="invalid-feedback">{errors.message.message}</div>}
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="btn-magnetic btn-primary-custom contact-form__submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  Sending...
                </>
              ) : (
                <>
                  Submit Inquiry <i className="bi bi-send-fill" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        /* Phone Input Styles - Matching existing form */
        .phone-input-custom {
          display: flex;
          width: 100%;
        }

        .phone-input-custom .country-selector-btn {
          border: 1px solid #ced4da;
          border-right: none;
          border-radius: 0.375rem 0 0 0.375rem;
          padding: 0.375rem 0.75rem;
          background: white;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          min-width: 80px;
          white-space: nowrap;
          flex-shrink: 0;
          height: 38px;
          font-size: 1rem;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .phone-input-custom .country-selector-btn:hover {
          background: #f8f9fa;
        }

        .phone-input-custom .country-selector-btn:focus {
          border-color: #86b7fe;
          outline: 0;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }

        .phone-input-custom .country-selector-btn .country-code {
          font-size: 0.875rem;
          font-weight: 500;
          color: #212529;
        }

        .phone-input-custom .country-selector-btn .arrow {
          font-size: 0.65rem;
          color: #6c757d;
          margin-left: 2px;
        }

        .phone-input-custom .form-control {
          border-radius: 0 0.375rem 0.375rem 0;
          border-left: none;
          flex: 1;
          min-width: 0;
          height: 38px;
        }

        .phone-input-custom .form-control:focus {
          border-left: none;
        }

        .phone-input-custom .form-control.is-invalid {
          border-color: #dc3545;
        }

        .phone-input-custom .form-control.is-invalid:focus {
          box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
        }

        /* Country Dropdown */
        .country-dropdown {
          background: white;
          border: 1px solid #ced4da;
          border-radius: 0.375rem;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          padding: 0.5rem;
          min-width: 280px;
          max-width: 90vw;
          max-height: 300px;
          overflow-y: auto;
          z-index: 1050 !important;
        }

        .country-dropdown .country-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.5rem 0.75rem;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .country-dropdown .country-item:hover {
          background: #f8f9fa;
        }

        .country-dropdown .country-item .country-name {
          flex: 1;
          font-size: 0.875rem;
          color: #212529;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .country-dropdown .country-item .dial-code {
          font-size: 0.85rem;
          color: #6c757d;
          font-weight: 500;
          flex-shrink: 0;
        }

        .country-dropdown .country-item.selected {
          background: rgba(13, 110, 253, 0.1);
          font-weight: 500;
        }

        .country-dropdown .search-input {
          border: 1px solid #ced4da;
          border-radius: 0.25rem;
          padding: 0.375rem 0.75rem;
          width: 100%;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .country-dropdown .search-input:focus {
          border-color: #86b7fe;
          outline: 0;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }

        .country-dropdown::-webkit-scrollbar {
          width: 6px;
        }

        .country-dropdown::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .country-dropdown::-webkit-scrollbar-thumb {
          background: #c1c7cd;
          border-radius: 10px;
        }

        .country-dropdown::-webkit-scrollbar-thumb:hover {
          background: #a8b0b8;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .phone-input-custom .country-selector-btn {
            min-width: 70px;
            padding: 0.375rem 0.5rem;
            height: 38px;
            font-size: 0.875rem;
          }

          .phone-input-custom .country-selector-btn .country-code {
            font-size: 0.75rem;
          }

          .phone-input-custom .form-control {
            height: 38px;
            font-size: 16px;
          }

          .country-dropdown {
            min-width: 240px;
            max-width: 90vw;
          }
        }

        @media (max-width: 576px) {
          .phone-input-custom .country-selector-btn {
            min-width: 60px;
            padding: 0.375rem 0.375rem;
          }

          .phone-input-custom .country-selector-btn .country-code {
            display: none;
          }

          .phone-input-custom .country-selector-btn .arrow {
            display: none;
          }

          .country-dropdown {
            min-width: 200px;
            max-width: 95vw;
          }
        }

        @media (max-width: 375px) {
          .phone-input-custom .country-selector-btn {
            min-width: 50px;
            padding: 0.375rem 0.25rem;
          }

          .phone-input-custom .country-selector-btn .flag {
            font-size: 0.9rem;
          }

          .country-dropdown {
            min-width: 180px;
            max-width: 95vw;
          }

          .country-dropdown .country-item {
            padding: 0.375rem 0.5rem;
            gap: 6px;
          }

          .country-dropdown .country-item .country-name {
            font-size: 0.8rem;
          }
        }

        @media (max-width: 320px) {
          .phone-input-custom .country-selector-btn {
            min-width: 40px;
            padding: 0.25rem 0.125rem;
          }

          .phone-input-custom .country-selector-btn .flag {
            font-size: 0.8rem;
          }

          .country-dropdown {
            min-width: 160px;
            max-width: 95vw;
          }

          .country-dropdown .country-item .country-name {
            font-size: 0.75rem;
          }

          .country-dropdown .country-item .dial-code {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactForm;