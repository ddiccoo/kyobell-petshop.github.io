/* ==========================================================================
   utils.js — Fungsi bantu kecil yang dipakai di banyak tempat.
   ========================================================================== */

/** Singkatan untuk document.getElementById. */
const $ = (elementId) => document.getElementById(elementId);

/** 45000 → "Rp45.000" */
function formatRupiah(amount) {
  return 'Rp' + amount.toLocaleString('id-ID');
}

/** Membuat link wa.me dengan pesan yang sudah terisi. */
function buildWhatsAppUrl(message) {
  return `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Teks varian produk, mis. "Tuna in Jelly (Adult) · 400g". */
function describeVariant(product) {
  return (product.flavorLabel ? product.flavorLabel + ' · ' : '') + product.sizeLabel;
}
