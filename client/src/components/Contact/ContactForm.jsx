/**
 * Contact form with React Hook Form validation.
 * Location: client/src/components/Contact/ContactForm.jsx
 */
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import notify from '@utils/notify';
import { SERVICES_LIST } from '@utils/constants';
import { submitContactForm } from '@api/contact';
import 'react-international-phone/style.css';
import { PhoneInput } from 'react-international-phone';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

const ContactForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    trigger,
    clearErrors,
    formState: { errors, touchedFields },
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
    reValidateMode: 'onChange',
  });

  // Handle phone change - only validate after touched
  const handlePhoneChange = (value, { country }) => {
    // Update form value
    setValue('phone', value, { shouldValidate: false });
    
    // Only validate if field has been touched
    if (phoneTouched) {
      trigger('phone');
    }
  };

  // Handle phone blur - mark as touched and validate
  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    trigger('phone');
  };

  // Custom validation function for phone
  const validatePhoneNumber = (value) => {
    // Don't validate if not touched and empty
    if (!phoneTouched && (!value || value.trim() === '')) {
      return true;
    }

    // Don't validate if field is empty and not touched
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
    // Validate phone before submit
    if (!data.phone || data.phone.trim() === '') {
      setPhoneTouched(true);
      notify.error('Phone number is required');
      return;
    }

    try {
      const phoneNumber = parsePhoneNumber(data.phone);
      if (!phoneNumber || !isValidPhoneNumber(data.phone)) {
        setPhoneTouched(true);
        notify.error('Invalid phone number');
        return;
      }

      // India-specific validation
      if (phoneNumber.country === 'IN') {
        const digits = phoneNumber.nationalNumber;
        if (digits.length !== 10 || !['6', '7', '8', '9'].includes(digits[0])) {
          setPhoneTouched(true);
          notify.error('Indian phone must start with 6,7,8,9 and be 10 digits');
          return;
        }
      }

      // Format phone to E.164
      const formattedPhone = phoneNumber.format('E.164');
      const formData = {
        ...data,
        phone: formattedPhone,
      };

      setSubmitting(true);
      await notify.run('Sending message...', () => submitContactForm(formData), {
        success: 'Thank you! Your message has been sent. We will contact you shortly.',
        error: 'Unable to send message. Please call us directly or try WhatsApp.',
      });
      reset();
      setPhoneTouched(false);
    } catch (error) {
      notify.error(error.response?.data?.detail || 'Something went wrong. Please try again.');
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
                    onBlur={handlePhoneBlur}
                    defaultCountry="in"
                    preferredCountries={['in', 'us', 'gb', 'ae', 'ca', 'au']}
                    placeholder="+91 XXXXX XXXXX"
                    inputClassName={`form-control ${errors.phone && phoneTouched ? 'is-invalid' : ''}`}
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
                  {errors.phone && phoneTouched && (
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
    </div>
  );
};

export default ContactForm;