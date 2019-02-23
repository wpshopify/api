import {
   get,
   post
} from '../request';


function endpointSettings() {
   return 'settings';
}

function endpointSettingAddToCartColor() {
   return 'settings/products_add_to_cart_color';
}

function endpointSettingVariantColor() {
   return 'settings/products_variant_color';
}

function endpointSettingCheckoutColor() {
   return 'settings/cart_checkout_color';
}

function endpointSettingCartCounterColor() {
   return 'settings/cart_counter_color';
}

function endpointSettingCartCounterFixedColor() {
   return 'settings/cart_counter_fixed_color';
}

function endpointSettingCartFixedBackgroundColor() {
   return 'settings/cart_fixed_background_color';
}

function endpointSettingCartIconFixedColor() {
   return 'settings/cart_icon_fixed_color';
}

function endpointSettingCartIconColor() {
   return 'settings/cart_icon_color';
}

function endpointSettingProductsHeadingToggle() {
   return 'settings/products_heading_toggle';
}

function endpointSettingProductsHeading() {
   return 'settings/products_heading';
}

function endpointSettingCollectionsHeadingToggle() {
   return 'settings/collections_heading_toggle';
}

function endpointSettingCollectionsHeading() {
   return 'settings/collections_heading';
}

function endpointSettingRelatedProductsHeading() {
   return 'settings/related_products_heading';
}

function endpointSettingRelatedProductsHeadingToggle() {
   return 'settings/related_products_heading_toggle';
}

function endpointSettingProductsImagesSizingToggle() {
   return 'settings/products_images_sizing_toggle';
}

function endpointSettingProductsImagesSizingWidth() {
   return 'settings/products_images_sizing_width';
}

function endpointSettingProductsImagesSizingHeight() {
   return 'settings/products_images_sizing_height';
}

function endpointSettingProductsImagesSizingCrop() {
   return 'settings/products_images_sizing_crop';
}

function endpointSettingProductsImagesSizingScale() {
   return 'settings/products_images_sizing_scale';
}

function endpointSettingCollectionsImagesSizingToggle() {
   return 'settings/collections_images_sizing_toggle';
}

function endpointSettingCollectionsImagesSizingWidth() {
   return 'settings/collections_images_sizing_width';
}

function endpointSettingCollectionsImagesSizingHeight() {
   return 'settings/collections_images_sizing_height';
}

function endpointSettingCollectionsImagesSizingCrop() {
   return 'settings/collections_images_sizing_crop';
}

function endpointSettingCollectionsImagesSizingScale() {
   return 'settings/collections_images_sizing_scale';
}

function endpointSettingRelatedProductsImagesSizingToggle() {
   return 'settings/related_products_images_sizing_toggle';
}

function endpointSettingRelatedProductsImagesSizingWidth() {
   return 'settings/related_products_images_sizing_width';
}

function endpointSettingRelatedProductsImagesSizingHeight() {
   return 'settings/related_products_images_sizing_height';
}

function endpointSettingRelatedProductsImagesSizingCrop() {
   return 'settings/related_products_images_sizing_crop';
}

function endpointSettingRelatedProductsImagesSizingScale() {
   return 'settings/related_products_images_sizing_scale';
}

function endpointSettingCheckoutEnableCustomCheckoutDomain() {
   return 'settings/checkout_enable_custom_checkout_domain';
}

function endpointSettingPricingCompareAt() {
   return 'settings/products_compare_at';
}

function endpointSettingSelectedCollections() {
   return 'settings/selected_collections';
}


/*

Update setting: Add to cart color

*/
function updateSettingAddToCartColor(data) {
   return post(endpointSettingAddToCartColor(), data);
}


/*

Update setting: Variant color

*/
function updateSettingVariantColor(data) {
   return post(endpointSettingVariantColor(), data);
}


/*

Update setting: Checkout color

*/
function updateSettingCheckoutColor(data) {
   return post(endpointSettingCheckoutColor(), data);
}


/*

Update setting: Cart counter color

*/
function updateSettingCartCounterColor(data) {
   return post(endpointSettingCartCounterColor(), data);
}


/*

Update setting: Cart icon color

*/
function updateSettingCartIconColor(data) {
   return post(endpointSettingCartIconColor(), data);
}


/*

,
  ,


Update setting: Cart icon color

*/
function updateSettingCartFixedBackgroundColor(data) {
   return post(endpointSettingCartIconColor(), data);
}


/*

Update setting: Cart icon color

*/
function updateSettingCartCounterFixedColor(data) {
   return post(endpointSettingCartCounterFixedColor(), data);
}


/*

Update setting: Cart icon color

*/
function updateSettingCartIconFixedColor(data) {
   return post(endpointSettingCartIconFixedColor(), data);
}


/*

Update setting: products heading toggle

*/
function updateSettingProductsHeadingToggle(data) {
   return post(endpointSettingProductsHeadingToggle(), data);
}


/*

Update setting: Cart icon color

*/
function updateSettingProductsHeading(data) {
   return post(endpointSettingProductsHeading(), data);
}


/*

Update setting: collections heading

*/
function updateSettingCollectionsHeadingToggle(data) {
   return post(endpointSettingCollectionsHeadingToggle(), data);
}


/*

Update setting: related products heading toggle

*/
function updateSettingRelatedProductsHeadingToggle(data) {
   return post(endpointSettingRelatedProductsHeadingToggle(), data);
}


/*

Update setting: collections heading

*/
function updateSettingCollectionsHeading(data) {
   return post(endpointSettingCollectionsHeading(), data);
}


/*

Update setting: related products heading

*/
function updateSettingRelatedProductsHeading(data) {
   return post(endpointSettingRelatedProductsHeading(), data);
}


/*

Update setting: related products heading toggle

*/
function updateSettingProductsImagesSizingToggle(data) {
   return post(endpointSettingProductsImagesSizingToggle(), data);
}


/*

Update setting: related products heading toggle

*/
function updateSettingProductsImagesSizingWidth(data) {
   return post(endpointSettingProductsImagesSizingWidth(), data);
}


/*

Update setting: related products heading toggle

*/
function updateSettingProductsImagesSizingHeight(data) {
   return post(endpointSettingProductsImagesSizingHeight(), data);
}


/*

Update setting: related products heading toggle

*/
function updateSettingProductsImagesSizingCrop(data) {
   return post(endpointSettingProductsImagesSizingCrop(), data);
}


/*

Update setting: related products heading toggle

*/
function updateSettingProductsImagesSizingScale(data) {
   return post(endpointSettingProductsImagesSizingScale(), data);
}





/*

Update setting: related products heading toggle

*/
function updateSettingCollectionsImagesSizingToggle(data) {
   return post(endpointSettingCollectionsImagesSizingToggle(), data);
}


/*

Update setting: related products heading toggle

*/
function updateSettingCollectionsImagesSizingWidth(data) {
   return post(endpointSettingCollectionsImagesSizingWidth(), data);
}


/*

Update setting: related products heading toggle

*/
function updateSettingCollectionsImagesSizingHeight(data) {
   return post(endpointSettingCollectionsImagesSizingHeight(), data);
}


/*

Update setting: related products heading toggle

*/
function updateSettingCollectionsImagesSizingCrop(data) {
   return post(endpointSettingCollectionsImagesSizingCrop(), data);
}


/*

Update setting: related products heading toggle

*/
function updateSettingCollectionsImagesSizingScale(data) {
   return post(endpointSettingCollectionsImagesSizingScale(), data);
}


/*

Update setting: related products heading toggle

*/
function updateSettingRelatedProductsImagesSizingToggle(data) {
   return post(endpointSettingRelatedProductsImagesSizingToggle(), data);
}


/*

Update setting: related products heading toggle

*/
function updateSettingRelatedProductsImagesSizingWidth(data) {
   return post(endpointSettingRelatedProductsImagesSizingWidth(), data);
}


/*

Update setting: related products heading toggle

*/
function updateSettingRelatedProductsImagesSizingHeight(data) {
   return post(endpointSettingRelatedProductsImagesSizingHeight(), data);
}


/*

Update setting: related products heading toggle

*/
function updateSettingRelatedProductsImagesSizingCrop(data) {
   return post(endpointSettingRelatedProductsImagesSizingCrop(), data);
}


/*

Update setting: related products heading toggle

*/
function updateSettingRelatedProductsImagesSizingScale(data) {
   return post(endpointSettingRelatedProductsImagesSizingScale(), data);
}


/*

Update setting: related products heading toggle

*/
function updateSettingCheckoutEnableCustomCheckoutDomain(data) {
   return post(endpointSettingCheckoutEnableCustomCheckoutDomain(), data);
}


export {
   updateSettingAddToCartColor,
   updateSettingVariantColor,
   updateSettingCheckoutColor,
   updateSettingCartCounterColor,
   updateSettingCartIconColor,
   updateSettingCartIconFixedColor,
   updateSettingProductsHeadingToggle,
   updateSettingProductsHeading,
   updateSettingCollectionsHeading,
   updateSettingRelatedProductsHeading,
   updateSettingCollectionsHeadingToggle,
   updateSettingRelatedProductsHeadingToggle,
   updateSettingProductsImagesSizingToggle,
   updateSettingProductsImagesSizingWidth,
   updateSettingProductsImagesSizingHeight,
   updateSettingProductsImagesSizingCrop,
   updateSettingProductsImagesSizingScale,
   updateSettingCollectionsImagesSizingToggle,
   updateSettingCollectionsImagesSizingWidth,
   updateSettingCollectionsImagesSizingHeight,
   updateSettingCollectionsImagesSizingCrop,
   updateSettingCollectionsImagesSizingScale,
   updateSettingRelatedProductsImagesSizingToggle,
   updateSettingRelatedProductsImagesSizingWidth,
   updateSettingRelatedProductsImagesSizingHeight,
   updateSettingRelatedProductsImagesSizingCrop,
   updateSettingRelatedProductsImagesSizingScale,
   updateSettingCheckoutEnableCustomCheckoutDomain,
   updateSettingCartCounterFixedColor,
   updateSettingCartFixedBackgroundColor
}
