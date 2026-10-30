// Single source of truth for business details shown across the site.
export const site = {
  name: 'LED Custom Painting & More',
  shortName: 'LED Custom Painting',
  url: 'https://ledcustompainting.com',
  phone: '(904) 385-0426',
  phoneHref: 'tel:+19043850426',
  email: 'info@ledcustompainting.com',
  googleReviewsUrl: 'https://www.google.com/maps?cid=13284018097086639388',
};

// Trust claims. Every page reads these, so a change here updates the whole
// site, including the Google review markup.
const years = '13+';
export const claims = {
  years,
  experience: `${years} years`,
  jobs: '500+',
  foundedYear: 2011,
  warranty: '3-year warranty',
  bbb: 'A+ BBB Rating',
  rating: '5.0',
  reviewCount: 82,
  customers: 'hundreds of satisfied customers',
  reviewsLine: 'hundreds of 5-star reviews',
};
