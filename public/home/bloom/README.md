# Homepage artwork and extension points

Source reference: Lavender Bloom Crochet Shop-Picsart-AiImageEnhancer.png.
Generated using the built-in image generation tool, then converted to WebP at quality 88 with alpha retained.

Prompt set:
1. Storefront: preserve original framing, shop geometry, signage, awning, window displays, open door, cat, chalkboard, plants and pavement. Remove the large foreground blossom branches and floating petals, reconstruct obscured shop surfaces, and remove right-side sky/distant town to transparency. Keep the hanging sign intact.
2. Foreground: isolate only the softly focused cherry branch across the upper left and the bottom-corner flowers. Preserve their placement on the full wide canvas. Remove all shop architecture, signs, ground and background to transparency.
3. Sky: pastel lavender-blue sky and pink clouds with defocused village houses/trees in the bottom quarter, matching the reference lighting. No shop, foreground branches, signs or text.

Files: storefront.webp, blossoms.webp, sky.webp.
These are reconstructed layers, not pixel-exact masks of the original.

Floating petals are CSS shapes animated by GSAP. All layers share one coordinate system. Mobile uses a modest centered crop, five particles and smaller parallax offsets. Reduced-motion disables animation; offscreen/hidden scenes pause ambient loops.

Future content:
- app/page.tsx: replace collection previews with live collection links when ready.
- Replace the new-arrivals empty state with real product cards. No demo skincare products are displayed on this homepage.
- components/home/storefront-hero.tsx: isolated client animation component.
- components/home/home.module.css: responsive layout and scene styling.
