/* ==========================================================================
   cart.js — Keranjang belanja. Disimpan di localStorage browser.
   Bentuk data: { "<idProduk>": jumlah }  contoh: { "7": 2, "13": 1 }
   ========================================================================== */

let cartItems = loadCartFromStorage();

function loadCartFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '{}');
  } catch (error) {
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch (error) {
    /* localStorage tidak tersedia: keranjang tetap jalan selama halaman terbuka */
  }
  updateCartBadge();
}

/** Total jumlah barang (bukan jumlah jenis produk). */
function getCartItemCount() {
  return Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);
}

function addToCart(productId, quantity = 1) {
  cartItems[productId] = Math.min(MAX_QUANTITY_PER_ITEM, (cartItems[productId] || 0) + quantity);
  saveCart();
}

/** Menambah/mengurangi jumlah. Jumlah di bawah 1 menghapus produk dari keranjang. */
function changeCartQuantity(productId, delta) {
  const newQuantity = Math.min(MAX_QUANTITY_PER_ITEM, (cartItems[productId] || 0) + delta);
  if (newQuantity < 1) {
    delete cartItems[productId];
  } else {
    cartItems[productId] = newQuantity;
  }
  saveCart();
}

/** Daftar baris keranjang lengkap dengan data produk dan subtotalnya. */
function getCartLines() {
  return Object.keys(cartItems)
    .map(Number)
    .filter((productId) => findProductById(productId) && cartItems[productId] > 0)
    .map((productId) => {
      const product = findProductById(productId);
      const quantity = cartItems[productId];
      return { product, quantity, lineTotal: product.price * quantity };
    });
}

function getCartTotal() {
  return getCartLines().reduce((sum, line) => sum + line.lineTotal, 0);
}

/** Angka kecil di ikon keranjang navbar; disembunyikan saat kosong. */
function updateCartBadge() {
  const badge = $('cart-badge');
  const itemCount = getCartItemCount();
  badge.textContent = itemCount;
  badge.hidden = itemCount === 0;
}
