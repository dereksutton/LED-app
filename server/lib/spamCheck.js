// Spots sales pitches sent through the quote form (SEO, web design, loans
// and the like). A flagged lead is still saved and the owner still gets the
// email; it just lands in the dashboard's Spam folder instead of the leads
// list, where one click moves it back.

// Words a homeowner asking about painting almost never uses.
const PITCH_TERMS = [
    ['SEO', /\bseo\b|search engine optimi[sz]/i],
    ['Google ranking', /first page (of|on) google|rank(ing)? (higher|better|on google|#?1)|top of google|google ranking/i],
    ['backlinks', /\bback ?links?\b|guest post/i],
    ['web design', /\bweb ?(site)? ?(design|redesign|development)\b|website (design|redesign|development)|new website for you/i],
    ['marketing services', /digital marketing|marketing (agency|services|team|strategy)|social media (management|marketing|growth)|ppc (management|campaign)|google ads (management|expert)/i],
    ['lead generation', /lead gen(eration)?|generate (more )?(leads|customers|sales)|more (leads|customers|clients) (for|to) your/i],
    ['business listing', /google (my business|business profile)|business listing|citation building|map pack/i],
    ['business financing', /business (loan|funding|financing|line of credit)|merchant cash advance|working capital|pre-?approved for/i],
    ['payment processing', /credit card processing|merchant services|payment processing/i],
    ['outsourcing', /virtual assistants?|outsourc|offshore team|white ?label|appointment setting/i],
    ['app or software pitch', /app development|software development|ai (chatbot|receptionist|agent) for your/i],
    ['crypto or investment', /\bcrypto|bitcoin|forex|investment opportunity/i],
];

// Phrases that turn a mention into a pitch.
const PITCH_PHRASES = /your (website|business|company|online presence)|our (services|agency|team|company) (can|will|helps?)|we (help|work with) (businesses|contractors|companies)|quick question|partnership|unsubscribe|opt[- ]out|reply stop|free (audit|consultation|analysis|report)/gi;

const LINK = /(https?:\/\/|www\.)\S+/gi;

// Returns a short reason when the lead reads like a sales pitch, or null.
const checkForSpam = (lead = {}) => {
    const text = [lead.message, lead.sourceDetail, lead.name, lead.projectType].filter(Boolean).join('\n');
    if (!text) return null;
    const terms = PITCH_TERMS.filter(([, re]) => re.test(text)).map(([label]) => label);
    const phrases = (text.match(PITCH_PHRASES) || []).length;
    const links = (text.match(LINK) || []).length;
    const score = terms.length * 2 + Math.min(phrases, 2) + Math.min(links, 3);
    if (score < 3) return null;
    const why = [];
    if (terms.length) why.push(`mentions ${terms.slice(0, 3).join(', ')}`);
    if (links) why.push(`${links} link${links === 1 ? '' : 's'} in the message`);
    if (!why.length) why.push('reads like a sales pitch');
    return `Looks like a sales pitch: ${why.join('; ')}`;
};

module.exports = { checkForSpam };
