// Thin wrapper around gtag / Meta Pixel so components can report conversions
// without caring which tags are installed.

export const GA_ID = 'G-059TGJP58C';
export const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || '';
export const ADS_LEAD_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL || '';
export const ADS_CALL_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL || '';
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

const gtag = (...args) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
};

const fbq = (...args) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(...args);
  }
};

// Quote form submitted successfully.
export const trackLead = ({ service } = {}) => {
  gtag('event', 'generate_lead', { form: 'quote', service });
  if (ADS_ID && ADS_LEAD_LABEL) {
    gtag('event', 'conversion', { send_to: `${ADS_ID}/${ADS_LEAD_LABEL}` });
  }
  fbq('track', 'Lead', service ? { content_name: service } : undefined);
};

// Phone number tapped.
export const trackCall = ({ location } = {}) => {
  gtag('event', 'click_to_call', { location });
  if (ADS_ID && ADS_CALL_LABEL) {
    gtag('event', 'conversion', { send_to: `${ADS_ID}/${ADS_CALL_LABEL}` });
  }
  fbq('track', 'Contact', { method: 'phone' });
};

// Email address clicked.
export const trackEmail = ({ location } = {}) => {
  gtag('event', 'click_email', { location });
  fbq('track', 'Contact', { method: 'email' });
};
