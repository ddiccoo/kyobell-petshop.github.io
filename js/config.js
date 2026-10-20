/* ==========================================================================
   config.js — Pengaturan toko dan konstanta.
   Ubah nomor WhatsApp, alamat, jam buka, dan aturan ongkir di file ini saja.
   ========================================================================== */

const STORE = {
  name: 'Kyobell Petshop',
  whatsappNumber: '6285737304988',       // format internasional, tanpa "+" atau spasi
  whatsappDisplay: '+62 857-3730-4988',  // versi yang tampil di halaman
  city: 'Singaraja, Buleleng, Bali',
  openingHours: 'setiap hari 08.00–20.00 WITA',
  sameDayCutoff: '16.00',                // order sebelum jam ini = diantar hari yang sama
  mapsLink: 'https://maps.app.goo.gl/y1ZfMg6ym6Rou5ix9',
  mapsEmbedUrl: 'https://www.google.com/maps?q=-8.1452473,115.0585847&z=18&output=embed',
  showEmbeddedMap: true,                 // false = tampilkan ilustrasi peta (tanpa iframe)
};

const SHIPPING = {
  freeShippingMinimum: 150000,           // gratis ongkir minimal belanja (Rp)
  flatFee: 10000,                        // ongkir di bawah minimum (Rp)
};

const SUBSCRIPTION_INTERVALS_IN_WEEKS = [2, 3, 4];
const MAX_QUANTITY_PER_ITEM = 99;
const CART_STORAGE_KEY = 'kyobell_cart';
const HERO_IMAGE = 'assets/img/hero-dog-and-cat.webp';
