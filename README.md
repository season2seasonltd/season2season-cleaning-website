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

The quotation form submits directly to Netlify Forms using a normal HTML POST and redirects to `thank-you.html` after successful handling. Netlify provides built-in spam filtering; the form also uses a hidden honeypot field. These measures reduce spam but cannot guarantee that every unwanted submission will be blocked.


## Deployment and domain

The site can be hosted by any static hosting service that serves HTML files and supports custom domains and HTTPS (for example, GitHub Pages, Netlify, Cloudflare Pages or Azure Static Web Apps). Netlify Forms requires Netlify hosting and automatic form detection; the configured quotation form will not submit on other static hosts. Configure the hosting provider with this folder as the site root, connect the client-owned domain using the provider’s instructions, enable HTTPS, and test the deployed pages and form. Update DNS only after confirming the client owns or controls the domain.