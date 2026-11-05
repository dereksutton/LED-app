// Single source of truth for business details shown across the site.
export const site = {
  name: 'LED Custom Painting & More',
  shortName: 'LED Custom Painting',
  url: 'https://ledcustompainting.com',
  phone: '(904) 385-0426',
  phoneHref: 'tel:+19043850426',
  // The same number takes texts.
  smsNumber: '+19043850426',
  email: 'info@ledcustompainting.com',
  googleReviewsUrl: 'https://www.google.com/maps?cid=13284018097086639388',
};

// Trust claims. Every page reads these, so a change here updates the whole
// site, including the Google review markup.
// Years in business, worked out from the founding year when the site is
// built, so the claim never goes stale.
const foundedYear = 2011;
const years = `${new Date().getFullYear() - foundedYear}+`;
export const claims = {
  years,
  experience: `${years} years`,
  jobs: '500+',
  foundedYear,
  warranty: '3-year warranty',
  bbb: 'A+ BBB Rating',
  rating: '5.0',
  reviewCount: 82,
  customers: 'hundreds of satisfied customers',
  reviewsLine: 'hundreds of 5-star reviews',
};

// The Text us link: the 904 number with a short message and the visitor's
// ref code filled in. "?&body=" works on both iPhone and Android.
export const smsHref = (refCode) => {
  const body = `Hi LED Custom Painting, I'd like a free painting quote.${refCode ? ` (Ref ${refCode})` : ''}`;
  return `sms:${site.smsNumber}?&body=${encodeURIComponent(body)}`;
};
