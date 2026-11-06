// Where LED works: every Clay County community except Keystone Heights, plus
// Mandarin and the St. Johns area. The site's schema, service pages and
// footer all read this list.
export const CLAY_COUNTY = [
  'Orange Park',
  'Fleming Island',
  'Green Cove Springs',
  'Middleburg',
  'Oakleaf',
  'Lakeside',
  'Lake Asbury',
  'Doctors Inlet',
  'Penney Farms',
];
export const NEARBY = ['Mandarin', 'St. Johns', 'Fruit Cove', 'Julington Creek'];

export const SERVICE_AREAS = [...CLAY_COUNTY, ...NEARBY];

export const areaSummary = 'Clay County, Mandarin and St. Johns';

// schema.org areaServed for the business and service pages.
export const areaServedSchema = [
  { '@type': 'AdministrativeArea', name: 'Clay County, FL' },
  ...SERVICE_AREAS.map((name) => ({ '@type': 'Place', name: `${name}, FL` })),
];
