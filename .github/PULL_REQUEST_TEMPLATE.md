## Summary
<!-- Provide a concise overview of the problem, motivation, and solution implemented in this PR. -->

## Files Changed
<!-- List the primary files modified or added, with brief rationale. -->
- 

## Testing Performed
<!-- Detail the validation steps taken before submitting. -->
- [ ] Ran `npm test` (`node scripts/smoke-test.js`) — 0 broken links and syntax valid
- [ ] Verified page rendering locally via `npm start` / `node scripts/serve.js`
- [ ] Tested contact, partnership, and newsletter forms (success, error, and mailto fallback)
- [ ] Checked accessibility in light and dark modes (contrast, focus states, skip link)
- [ ] Verified responsive layout across mobile and desktop viewports

## Deployment Notes
<!-- Any DNS, GitHub Pages, or configuration instructions necessary for release. -->
- Custom domain: `futurebuildersrefugeeorganization.com`
- EmailJS keys remain empty by default (graceful mailto fallback active)
- CNAME file verified
