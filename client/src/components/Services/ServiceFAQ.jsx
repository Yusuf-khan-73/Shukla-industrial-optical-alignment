/**
 * Service FAQ accordion using Bootstrap collapse.
 * Location: client/src/components/Services/ServiceFAQ.jsx
 */
const ServiceFAQ = ({ faqs, serviceSlug }) => {
  const accordionId = `faq-${serviceSlug}`;

  if (!faqs?.length) return null;

  return (
    <div className="service-faq accordion" id={accordionId}>
      {faqs.map((item, index) => {
        const itemId = `${accordionId}-item-${index}`;
        return (
          <div key={item.q} className="accordion-item service-faq__item">
            <h4 className="accordion-header">
              <button
                className="accordion-button collapsed service-faq__btn"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#${itemId}`}
                aria-expanded="false"
                aria-controls={itemId}
              >
                {item.q}
              </button>
            </h4>
            <div id={itemId} className="accordion-collapse collapse" data-bs-parent={`#${accordionId}`}>
              <div className="accordion-body service-faq__body">{item.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServiceFAQ;
