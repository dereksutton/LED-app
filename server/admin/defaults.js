// Starting text for terms and the contract. The owner edits all of it in
// Settings; none of it is legal advice and a lawyer should review it.

const quoteTerms = `This estimate is based on the work described above and the conditions visible at the time of the estimate. Hidden damage (rot, water damage, failing drywall or previous coatings) found once work starts will be discussed with you before any extra work is done. Prices include labor, paint and materials unless noted otherwise.`;

const invoiceTerms = `Payment is due by the due date shown. Thank you for your business.`;

const paymentInstructions = `We accept cash, check (payable to LED Custom Painting & More) and Zelle.`;

const contractTemplate = `PAINTING SERVICES AGREEMENT

This agreement is made on {{date}} between {{businessName}} ("Contractor") and {{customerName}} ("Customer") for work at {{customerAddress}}.

1. SCOPE OF WORK
Contractor will perform the following work, as described in quote {{quoteNumber}}:
{{scope}}

2. PRICE AND PAYMENT
The total contract price is {{total}}. A deposit of {{deposit}} is due before work is scheduled. The remaining balance is due when the work is complete. Changes to the scope must be agreed in writing and may change the price.

3. SCHEDULE
Contractor will start on a date agreed with Customer. Weather, material availability and other conditions outside Contractor's control may change the schedule.

4. PREPARATION AND ACCESS
Customer will give Contractor access to the work areas, water and electricity, and will move small or fragile items. Contractor will protect floors, furniture and fixtures in the work areas and clean up when the work is done.

5. HIDDEN CONDITIONS
If Contractor finds hidden damage such as rot, water damage or failing surfaces, Contractor will stop and discuss it with Customer before doing any extra work.

6. WARRANTY
Contractor warrants its workmanship against peeling, blistering and flaking for the period stated by Contractor in writing. The warranty does not cover damage from moisture, structural movement, abuse or normal wear.

7. INSURANCE
Contractor carries general liability insurance and will provide proof on request.

8. CANCELLATION
Customer may cancel within three business days of signing for a full refund of any deposit. After that, the deposit may be kept to cover materials ordered and scheduling.

9. ENTIRE AGREEMENT
This agreement and the referenced quote are the whole agreement between the parties. Florida law governs this agreement.

By signing below, Customer agrees to these terms.`;

// Fills {{placeholders}} in the template.
const fillTemplate = (template, values) =>
    String(template || '').replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) =>
        Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match);

module.exports = { quoteTerms, invoiceTerms, paymentInstructions, contractTemplate, fillTemplate };
