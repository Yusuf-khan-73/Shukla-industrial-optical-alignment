/**
 * Contact form with React Hook Form validation.
 * Location: client/src/components/Contact/ContactForm.jsx
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { SERVICES_LIST } from '@utils/constants';
import { submitContactForm } from '@api/contact';

const ContactForm = () => {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
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
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await submitContactForm(data);
      toast.success('Thank you! Your message has been sent. We will contact you shortly.');
      reset();
    } catch {
      toast.error('Unable to send message. Please call us directly or try WhatsApp.');
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
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
            />
            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
          </div>

          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">Mobile Number *</label>
            <input
              id="phone"
              type="tel"
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              placeholder="+91 XXXXX XXXXX"
              {...register('phone', {
                required: 'Phone is required',
                pattern: { value: /^[+]?[\d\s-]{10,15}$/, message: 'Enter a valid phone number' },
              })}
            />
            {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
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
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
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
