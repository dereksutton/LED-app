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

// Quote or callback form submitted successfully. form: 'quote' | 'callback'.
export const trackLead = ({ service, form = 'quote' } = {}) => {
  gtag('event', 'generate_lead', { form, service });
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

// "Text us" tapped.
export const trackText = ({ location } = {}) => {
  gtag('event', 'click_to_text', { location });
  fbq('track', 'Contact', { method: 'text' });
};

// First field touched on a form, to compare form starts with leads.
export const trackFormStart = ({ form }) => {
  gtag('event', 'form_start', { form });
};

// Tells the API about a Call or Text tap (no personal details), so the owner
// can tie the call or text he gets to the visit it came from. Fire and
// forget: the tap has already opened the dialer or messages app.
export const recordContactIntent = ({ kind, refCode, attribution }) => {
  try {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/contact-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, refCode, attribution: attribution || undefined, page: window.location.pathname }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // never block the tap
  }
};
