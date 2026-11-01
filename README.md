# Season2season Limited website

## Project structure

```text
index.html                 Home
services.html              Domestic and commercial cleaning
about.html                 About and approach
areas.html                 Service-area information
faq.html                    Frequently asked questions
contact.html               Enquiry form and contact details
thank-you.html             Confirmation page for successful enquiries
privacy.html               Privacy notice
css/style.css              Shared responsive design system
js/config.js               Central business and form configuration
js/main.js                 Shared navigation and contact configuration
js/contact-form.js         Enquiry validation and provider submission
images/                    Locally stored, licensed photography
                           Includes the social-sharing preview image
assets/favicon.svg         Site favicon
robots.txt                 Crawler guidance
sitemap.xml                Sitemap template
```

## Configure before launch

Edit `js/config.js` to supply verified details:

- Replace `companyName`, `phone`, `email`, `locations`, `address`, `openingHours`, social links and `websiteDomain`. The site-wide WhatsApp button uses `phone`; enter it in full international format and confirm that number is registered with WhatsApp.
- Confirm the exact service categories before changing `services`. The enquiry form offers only categories configured there.
- The quotation form is configured for Netlify Forms. Deploy to Netlify, enable automatic form detection, confirm the form appears in the dashboard, configure and verify the Zoho email notification, and submit a test enquiry before launch.
- Set `websiteDomain` to the production HTTPS origin and set `allowIndexing` to `true` only for production. Public pages have indexable metadata; keep staging and the enquiry confirmation page out of search results.
- Update `robots.txt` and every `YOUR-DOMAIN.example` URL in `sitemap.xml` to the actual canonical domain.
- Canonical and Open Graph URL tags are populated from `websiteDomain`.
- Replace the generic brand mark/name where appropriate and supply approved business imagery if preferred.

The quotation form submits directly to Netlify Forms using a normal HTML POST and redirects to `thank-you.html` after successful handling. Netlify provides built-in spam filtering; the form also uses a hidden honeypot field. These measures reduce spam but cannot guarantee that every unwanted submission will be blocked.


### Netlify Forms setup

1. Deploy the site to the client-owned Netlify account. The static form markup is included so Netlify can detect it during deployment.
2. In the Netlify site dashboard, enable [automatic form detection](https://docs.netlify.com/manage/forms/setup/) and redeploy if prompted. Confirm that the `quote-request` form appears under Forms.
3. Configure an [email notification](https://docs.netlify.com/manage/forms/notifications/) for verified submissions and enter the client’s confirmed Zoho inbox address. Complete any recipient verification requested by Netlify.
4. Review Netlify’s current plan limits, terms, privacy information, spam handling, retention controls and data-processing locations. Ensure the privacy notice reflects the actual setup.
5. Submit a test enquiry from the deployed site. Confirm it appears in Netlify’s submissions and the notification reaches the client’s Zoho inbox. Check the spam submissions view if a test is filtered.
6. Confirm that `thank-you.html` loads after a successful submission and that the client can reply to the customer using the received email details.

The form uses Netlify’s built-in spam filtering and a honeypot field. If spam becomes an issue, consider enabling Netlify’s reCAPTCHA protection and test the added visitor interaction. Never put mailbox passwords, SMTP credentials or private API keys in the public site files.

## Deployment and domain

The site can be hosted by any static hosting service that serves HTML files and supports custom domains and HTTPS (for example, GitHub Pages, Netlify, Cloudflare Pages or Azure Static Web Apps). Netlify Forms requires Netlify hosting and automatic form detection; the configured quotation form will not submit on other static hosts. Configure the hosting provider with this folder as the site root, connect the client-owned domain using the provider’s instructions, enable HTTPS, and test the deployed pages and form. Update DNS only after confirming the client owns or controls the domain.

The sitemap and on-page metadata provide a technical starting point; they do not guarantee search rankings.

## Before launch

- [ ] Confirm the company’s trading/legal name, approved logo/branding and domain.
- [ ] Confirm phone, email, opening hours, social profiles and service locations.
- [ ] Confirm which specific cleaning services may be advertised.
- [ ] Review all copy, photography rights and image descriptions.
- [ ] Configure Netlify Forms, verify Zoho notification delivery and complete a real submission test.
- [ ] Complete and review the privacy notice with the actual data practices and provider.
- [ ] Replace the sitemap and robots domain placeholders.
- [ ] Set the verified canonical production URL and enable indexing only on production.
- [ ] Test navigation, form validation, focus states, keyboard operation and page layout at 320, 375, 390, 768, 1024 and 1440 pixels.
- [ ] Test mobile menu, HTTPS, deployed links, form delivery, browser console and image loading on the live site.
- [ ] Verify no unsupported claims, unapproved services or development placeholders remain.

## Maintenance and handover

Keep business details and confirmed services in `js/config.js`; page content and service-area explanations live in their respective HTML files. Review provider terms, privacy wording, links, supported browsers and image licensing when making changes. Back up the deployed source and retain access to the domain, hosting and form-provider accounts with the business.