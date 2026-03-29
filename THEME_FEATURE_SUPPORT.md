# Theme Feature Support

This theme includes the storefront support needed for Shopify Theme Store feature requirements. Some features also require merchant-side admin setup before they appear on the storefront.

## Theme-supported features

- Sections Everywhere: JSON templates and section groups are present across storefront templates.
- Discounts: line-item and cart-level discounts render on the cart page and customer order page.
- Accelerated checkout buttons: supported on product and cart pages.
- Faceted search filtering: supported on collection and search templates.
- Gift cards: gift card template is present.
- Image focal points: supported on product media and theme image surfaces that crop merchant-selected images.
- Social sharing images: Open Graph tags use `page_image` support.
- Country and language selection: localization selectors are present in the header/announcement bar.
- Multi-level menus: the sidebar navigation now supports nested child and grandchild links.
- Newsletter signup: footer and newsletter section submit to Shopify customer/newsletter forms.
- Pickup availability: supported on the product page.
- Related product recommendations: supported with Shopify automatic recommendations.
- Complementary product recommendations: supported with Shopify complementary recommendations.
- Rich product media: supported on the product template, and the reusable `main-product` section is available as a featured product section preset.
- Search template and predictive search: both are present.
- Selling plans: supported on product, cart, and customer order pages.
- Shop Pay Installments: supported on the product page.
- Unit pricing: supported on collection, product, cart, and customer order pages.
- Variant images: supported via featured media switching on variant change.
- Follow on Shop: supported from the footer via the `login_button` filter.

## Admin setup required

- Discounts:
  Create automatic or discount-code promotions in Shopify Admin so discount allocations exist to display.
- Accelerated checkout buttons:
  Enable supported accelerated payment methods in Shopify Admin. Dynamic checkout buttons must also remain enabled on product pages.
- Country selection:
  Configure Shopify Markets and enable local currencies for the countries you want to sell in.
- Language selection:
  Add and publish storefront languages in Shopify Admin.
- Gift cards:
  Enable gift cards and publish gift card products if the store sells them.
- Faceted search filtering:
  Configure filters in the Shopify Search & Discovery app so collection and search filters have available facets.
- Pickup availability:
  Enable local pickup and inventory at store locations.
- Related product recommendations:
  Shopify generates these automatically from storefront and catalog data.
- Complementary product recommendations:
  Configure complementary products in the Shopify Search & Discovery app for stronger merchandising control.
- Selling plans:
  Install and configure a subscriptions app that creates selling plans.
- Shop Pay Installments:
  Enable Shop Pay and confirm store eligibility for installments in Shopify payments settings.
- Unit pricing:
  Populate unit price measurements on relevant variants/products.
- Variant images:
  Assign media to individual variants in the product admin.
- Follow on Shop:
  Enable the Shop channel/app and keep the Follow on Shop footer block enabled.

## Recommended theme editor checks

- Keep the `buy_buttons` block enabled with dynamic checkout turned on.
- Keep both `related-products` and `complementary-products` sections on the product template.
- Keep localization selectors visible in the header or announcement bar when selling internationally.
- Keep a newsletter block or newsletter section enabled so storefront email capture remains available.
