const { test } = require('node:test');
const assert = require('node:assert/strict');
const { checkForSpam } = require('./spamCheck');

test('sales pitches are flagged with a reason', () => {
    const cases = [
        'I noticed your website is not ranking on Google. Our SEO team can get you on the first page of Google.',
        'We help contractors generate more leads with Google Ads management. Free audit, reply STOP to opt out.',
        'Your business is pre-approved for a business loan up to $250k. Working capital in 24 hours.',
        'Check these out: https://a.example https://b.example https://c.example',
    ];
    for (const message of cases) assert.match(checkForSpam({ message }) || '', /^Looks like a sales pitch/, message);
});

test('real painting requests are left alone', () => {
    const cases = [
        'Need the living room and hallway painted before Thanksgiving. Saw your website, love the cabinet work.',
        'Quick question, do you paint kitchen cabinets? Photos here: https://photos.example/abc',
        'Exterior repaint of a 2-story home, some wood rot on the fascia. Referred by my neighbor.',
        '',
    ];
    for (const message of cases) assert.equal(checkForSpam({ message }), null, message);
});
