// Builds the owner notification email for a quote request.
// Every value comes from a public form, so all of it is escaped before it
// touches HTML.

const escapeHtml = (value = '') =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

// Keep only characters a phone dialer understands.
const telHref = (phone = '') => `tel:${String(phone).replace(/[^\d+]/g, '')}`;

const row = (label, value) =>
    value
        ? `<tr><td style="padding: 8px 0;"><strong>${label}:</strong></td><td style="padding: 8px 0;">${escapeHtml(value)}</td></tr>`
        : '';

const buildLeadEmail = (lead, { to, from }) => {
    const {
        name, email, phone, address, projectType, propertyType, timeline,
        budgetRange, paintingArea, message, howDidYouHear,
    } = lead;

    const submittedDate = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        dateStyle: 'full',
        timeStyle: 'short',
    });

    const messageSection = message
        ? `<h3 style="color: #1a1a1a;">Project Details &amp; Special Requirements:</h3><div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #E8B4B8; margin-bottom: 20px;">${escapeHtml(message).replace(/\n/g, '<br>')}</div>`
        : '';

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Quote Request</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #0F172A 100%); padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: #F7E7CE; margin: 0; text-align: center;">New Quote Request</h1>
        </div>

        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #E8B4B8; padding-bottom: 10px;">Contact Information</h2>
          <table style="width: 100%; margin-bottom: 20px;">
            ${row('Name', name)}
            <tr>
              <td style="padding: 8px 0;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #1a1a1a;">${escapeHtml(email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Phone:</strong></td>
              <td style="padding: 8px 0;"><a href="${telHref(phone)}" style="color: #1a1a1a;">${escapeHtml(phone)}</a></td>
            </tr>
            ${row('Property Address or ZIP', address)}
          </table>

          <h2 style="color: #1a1a1a; border-bottom: 2px solid #E8B4B8; padding-bottom: 10px;">Project Details</h2>
          <table style="width: 100%; margin-bottom: 20px;">
            ${row('Project Type', projectType)}
            ${row('Property Type', propertyType)}
            ${row('Timeline', timeline)}
            ${row('Budget Range', budgetRange)}
            ${row('Painting Area', paintingArea)}
            ${row('How They Heard About Us', howDidYouHear)}
          </table>

          ${messageSection}

          <div style="margin-top: 30px; padding: 20px; background: #FEFCF8; border-radius: 5px; text-align: center;">
            <p style="margin: 0 0 15px 0;"><strong>Submitted:</strong> ${submittedDate}</p>
            <a href="${telHref(phone)}" style="display: inline-block; padding: 12px 30px; background: #1a1a1a; color: #F7E7CE; text-decoration: none; border-radius: 5px; margin: 5px;">Call Customer</a>
            <a href="mailto:${escapeHtml(email)}" style="display: inline-block; padding: 12px 30px; background: #0F172A; color: #F7E7CE; text-decoration: none; border-radius: 5px; margin: 5px;">Email Customer</a>
          </div>
        </div>

        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
          <p>This is an automated notification from your website's quote request form.</p>
        </div>
      </body>
      </html>
    `;

    const optional = [
        ['Property Type', propertyType],
        ['Timeline', timeline],
        ['Budget Range', budgetRange],
        ['Painting Area', paintingArea],
        ['How They Heard About Us', howDidYouHear],
    ]
        .filter(([, value]) => value)
        .map(([label, value]) => `${label}: ${value}\n`)
        .join('');

    const text = `New Quote Request\n\nCONTACT INFORMATION\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nProperty Address: ${address}\n\nPROJECT DETAILS\nProject Type: ${projectType}\n${optional}${message ? `\nProject Details & Special Requirements:\n${message}\n` : ''}\nSubmitted: ${submittedDate}`;

    return {
        from,
        to,
        reply_to: email,
        // Strip line breaks so a name can't smuggle extra headers into the subject.
        subject: `Quote Request from ${name.replace(/[\r\n]+/g, ' ')}`,
        html,
        text,
    };
};

module.exports = { buildLeadEmail, escapeHtml, telHref };
