# FBRO website, draft v0.4 (6 pages, topbar + photo hero with cards)

Pages: index, about, programs, gallery, get-involved, contact. Static site with shared styles.css and script.js; photos in assets/img (WebP, 800px and 1600px).
The four photos showing open burning of rubbish were left out of the site on purpose; ask the client before adding them.

Preview: open index.html in a browser (fonts load from Google Fonts when online).
Deploy: drag this folder onto Netlify or Cloudflare Pages. The contact form uses Netlify Forms (data-netlify="true"); on Cloudflare Pages swap in a Formspree action.

Before launch
- Replace logo.png with the client's original logo file (current one is a 500px JPEG with the background removed)
- Confirm photo captions and alt text with the client
- Get consent for published photos, especially of young people
- Confirm the phone numbers and emails may be shown publicly
- Set the real domain, then add og:image and canonical tags
