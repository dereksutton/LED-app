// Where LED wants work, by ZIP. Efrain's area is every Clay County community
// except Keystone Heights, plus Mandarin and the St. Johns area. ZIPs still
// to confirm with him; change a zone here and every new lead follows it.
//   core:   Clay County
//   nearby: Mandarin and St. Johns
//   edge:   next door, taken case by case
//   out:    anywhere else (Keystone Heights, the beaches, Ponte Vedra, Fernandina…)
// Out-of-area leads are still saved and emailed, never turned away.
const ZONES = {
    core: {
        label: 'Clay County',
        zips: ['32003', '32006', '32030', '32043', '32050', '32065', '32067', '32068', '32073', '32079'],
    },
    nearby: {
        label: 'Mandarin and St. Johns',
        zips: ['32223', '32257', '32258', '32259'],
    },
    edge: {
        label: 'Edge of the service area',
        zips: ['32222', '32244', '32092'],
    },
};

const ZONE_LABELS = { core: 'Clay County', nearby: 'Mandarin / St. Johns', edge: 'Edge of area', out: 'Out of area' };

// '32073-1234' -> 'core'. No ZIP (a call or text logged without one) -> undefined.
const zoneForZip = (zip) => {
    const five = typeof zip === 'string' ? (zip.trim().match(/^(\d{5})/) || [])[1] : undefined;
    if (!five) return undefined;
    for (const [zone, { zips }] of Object.entries(ZONES)) {
        if (zips.includes(five)) return zone;
    }
    return 'out';
};

// What the visitor sees after sending a request from outside the area.
const OUT_OF_AREA_MESSAGE = 'We mainly serve Clay County, Mandarin and St. Johns, and we\'ll let you know within a day if we can take your project.';

module.exports = { ZONES, ZONE_LABELS, zoneForZip, OUT_OF_AREA_MESSAGE };
