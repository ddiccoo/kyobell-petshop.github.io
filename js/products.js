/* ==========================================================================
   products.js — Data produk + fungsi pencarian produk.

   CARA MENAMBAH PRODUK / VARIAN RASA BARU
   1. Salin salah satu objek di PRODUCTS, ganti id (harus unik) dan isinya.
   2. Taruh foto di assets/img/ lalu isi `image` dengan path-nya.
   3. Varian rasa/warna: beri `variantGroup` yang SAMA pada semua saudaranya dan isi
      `flavorLabel`. Otomatis muncul di bagian "Varian lainnya" pada halaman detail.

   Arti field:
     id            nomor unik
     name          nama di kartu
     category      jenis produk, harus salah satu kunci CATEGORY_DESCRIPTIONS di bawah
     audience      untuk siapa: 'kucing' | 'anjing' | 'steril' | 'kitten' | 'puppy' | 'picky'
     sizeLabel     ukuran/kemasan yang dijual, mis. "Dry 1kg"
     price         harga tetap (Rp)
     badge         label kecil di kartu (opsional)
     soldCount     dipakai untuk urutan "Terlaris"
     emoji, fallbackColor   tampilan cadangan bila foto tidak ada
   ========================================================================== */

const AUDIENCE_LABELS = {
  kucing: 'Kucing', anjing: 'Anjing', steril: 'Kucing steril',
  kitten: 'Kitten', puppy: 'Puppy', picky: 'Picky eater',
};

/** Pilihan pada dropdown "Untuk" di katalog. */
const AUDIENCE_FILTERS = [
  { key: 'semua', label: 'Semua hewan' },
  { key: 'kucing', label: 'Kucing' },
  { key: 'anjing', label: 'Anjing' },
  { key: 'steril', label: 'Kucing Steril' },
  { key: 'kitten', label: 'Kitten & Puppy' },
  { key: 'picky', label: 'Picky Eater' },
];

/** Kartu "Shop by" di beranda. */
const SHOP_BY_SHORTCUTS = [
  { audience: 'kucing', emoji: '🐱', label: 'Kucing' },
  { audience: 'anjing', emoji: '🐶', label: 'Anjing' },
  { audience: 'steril', emoji: '✂️', label: 'Kucing Steril' },
  { audience: 'kitten', emoji: '🍼', label: 'Kitten & Puppy' },
  { audience: 'picky', emoji: '😋', label: 'Picky Eater' },
];

/** Kalimat penjelas per kategori, ditambahkan di bawah deskripsi produk. */
const CATEGORY_DESCRIPTIONS = {
  'Makanan Kering': 'Formulanya seimbang, kibble renyah membantu menjaga kebersihan gigi, dan banyak anabul langsung doyan. Cocok jadi makanan harian.',
  'Makanan Basah': 'Tekstur lembut dan aroma menggugah, membantu anabul cukup cairan. Pas jadi topping atau penggugah selera saat malas makan.',
  'Pasir': 'Menggumpal rapi sehingga bersih-bersihnya cepat, bau tertahan, dan nyaman di kaki anabul. Rumah tetap segar.',
  'Vitamin': 'Membantu merawat bulu dari dalam supaya rontok berkurang dan tampilannya lembut berkilau. Diberikan rutin sesuai petunjuk.',
  'Mainan': 'Bikin anabul aktif bergerak, mengurangi bosan, dan mempererat waktu main bareng pemiliknya.',
  'Aksesoris': 'Bahannya nyaman dan kuat untuk pemakaian harian, dengan ukuran yang bisa dipilih sesuai anabul.',
  'Layanan': 'Dikerjakan pelan dan hati-hati oleh tim yang terbiasa dengan anabul, tanpa perlu janji temu.',
};

const PRODUCTS = [
  { id: 1, name: 'Kitchen Flavor Grain Free', category: 'Makanan Kering', audience: ['kucing'], sizeLabel: 'Dry 1kg', price: 45000, badge: 'Terlaris', soldCount: 320, emoji: '🐟', fallbackColor: '#fde6cf', image: 'assets/img/kitchen-flavor-grain-free.webp',
    description: 'Grain free dengan potongan daging asli, untuk kecantikan bulu dan kulit semua usia.' },
  { id: 2, name: 'Royal Canin Kitten Sterilised', category: 'Makanan Kering', audience: ['kucing', 'steril', 'kitten'], sizeLabel: 'Repack 400g', price: 48000, badge: 'Steril', soldCount: 210, emoji: '🐱', fallbackColor: '#dbe9f5', image: 'assets/img/royal-canin-kitten-sterilised.webp',
    description: 'Untuk kitten steril usia 6–12 bulan: imun kuat, pertumbuhan dan berat badan terkontrol.' },
  { id: 3, name: 'Excel Mother & Kitten', category: 'Makanan Kering', audience: ['kitten', 'kucing'], sizeLabel: 'Pack 500g', price: 28000, badge: 'Kitten', soldCount: 150, emoji: '🍼', fallbackColor: '#fbe3e0', image: 'assets/img/excel-mother-kitten.webp',
    description: 'Rasa ayam & ikan tuna untuk induk menyusui dan kitten: dukung imun, tulang, dan gigi.' },
  { id: 4, name: 'Bolt Adult Dog Food', category: 'Makanan Kering', audience: ['anjing'], sizeLabel: 'Repack 1kg', price: 38000, badge: 'Hemat', soldCount: 180, emoji: '🦴', fallbackColor: '#f3e3c9', image: 'assets/img/bolt-adult-dog-food.webp',
    description: 'Makanan anjing dewasa, mudah dicerna dengan rasa yang digemari untuk kulit dan bulu sehat.' },
  { id: 5, name: 'Dog Choize Puppy Beef', category: 'Makanan Kering', audience: ['puppy', 'anjing'], sizeLabel: 'Pack 800g', price: 45000, badge: 'Puppy', soldCount: 120, emoji: '🐶', fallbackColor: '#e3efd9', image: 'assets/img/dog-choize-puppy-beef.webp',
    description: 'Rasa beef untuk anak anjing: protein berkualitas, mendukung tulang dan gigi, kibble sesuai puppy.' },

  // Makanan basah — Me-O Pouch (variantGroup 'meo-pouch')
  { id: 6, name: 'Me-O Pouch Adult', category: 'Makanan Basah', audience: ['kucing', 'picky'], sizeLabel: 'Sachet 80g', price: 12000, badge: 'Terlaris', soldCount: 400, emoji: '🥫', fallbackColor: '#fde6cf', image: 'assets/img/meo-pouch-adult.webp',
    variantGroup: 'meo-pouch', flavorLabel: 'Adult · Ikan Putih & Serpihan Ayam',
    description: 'Otak-otak ikan putih dan serpihan ayam dari ikan asli, bertekstur lembut.' },
  { id: 21, name: 'Me-O Pouch Kitten', category: 'Makanan Basah', audience: ['kucing', 'kitten', 'picky'], sizeLabel: 'Sachet 80g', price: 12000, badge: 'Kitten', soldCount: 100, emoji: '🥫', fallbackColor: '#fff0c2', image: 'assets/img/meo-pouch-kitten.webp',
    variantGroup: 'meo-pouch', flavorLabel: 'Kitten · Otak-otak Ikan Putih',
    description: 'Otak-otak ikan putih dari ikan asli untuk anak kucing, tekstur lembut.' },

  // Makanan basah — Me-O Kaleng (variantGroup 'meo-kaleng')
  { id: 7, name: 'Me-O Kaleng Tuna', category: 'Makanan Basah', audience: ['kucing', 'picky'], sizeLabel: '400g', price: 22000, soldCount: 140, emoji: '🥫', fallbackColor: '#f3e3c9', image: 'assets/img/meo-kaleng-tuna.webp',
    variantGroup: 'meo-kaleng', flavorLabel: 'Tuna in Jelly (Adult)',
    description: 'Tuna dalam jelly untuk kucing dewasa, dari ikan asli dengan aroma menggugah selera.' },
  { id: 18, name: 'Me-O Kaleng Sardine', category: 'Makanan Basah', audience: ['kucing', 'picky'], sizeLabel: '400g', price: 22000, soldCount: 120, emoji: '🥫', fallbackColor: '#e3efd9', image: 'assets/img/meo-kaleng-sardine.webp',
    variantGroup: 'meo-kaleng', flavorLabel: 'Sardine in Prawn Jelly (Adult)',
    description: 'Sarden dalam jelly udang untuk kucing dewasa, aroma ikannya disukai.' },
  { id: 19, name: 'Me-O Kaleng Seafood', category: 'Makanan Basah', audience: ['kucing', 'picky'], sizeLabel: '400g', price: 22000, soldCount: 100, emoji: '🥫', fallbackColor: '#e7e0f3', image: 'assets/img/meo-kaleng-seafood.webp',
    variantGroup: 'meo-kaleng', flavorLabel: 'Seafood Platter in Prawn Jelly (Adult)',
    description: 'Perpaduan seafood dalam jelly udang, variasi rasa untuk kucing dewasa.' },
  { id: 20, name: 'Me-O Kaleng Kitten', category: 'Makanan Basah', audience: ['kucing', 'kitten', 'picky'], sizeLabel: '400g', price: 23000, badge: 'Kitten', soldCount: 90, emoji: '🥫', fallbackColor: '#fbe3e0', image: 'assets/img/meo-kaleng-kitten.webp',
    variantGroup: 'meo-kaleng', flavorLabel: 'Kitten · Tuna in Jelly',
    description: 'Tuna dalam jelly bertekstur lembut khusus anak kucing.' },

  { id: 8, name: 'Dr.Litter Bentonit Lavender', category: 'Pasir', audience: ['kucing'], sizeLabel: '10L', price: 55000, badge: 'Terlaris', soldCount: 290, emoji: '🪣', fallbackColor: '#e7e0f3', image: 'assets/img/drlitter-bentonit-lavender.webp',
    description: 'Aroma lavender, kontrol bau, daya serap tinggi, bebas debu, dan menggumpal baik.' },
  { id: 9, name: 'Dr.Litter Tofu Soya Coffee', category: 'Pasir', audience: ['kucing', 'kitten'], sizeLabel: '7L', price: 60000, badge: 'Baru', soldCount: 60, emoji: '🌱', fallbackColor: '#e3efd9', image: 'assets/img/drlitter-tofu-soya-coffee.webp',
    description: 'Pasir tofu premium aroma kopi: flushable, menggumpal kuat, 99% bebas debu.' },
  { id: 10, name: 'Puainta Multivitamin', category: 'Vitamin', audience: ['kucing', 'anjing'], sizeLabel: '200 tablet', price: 65000, badge: 'Bulu Lembut', soldCount: 170, emoji: '💊', fallbackColor: '#fff0c2', image: 'assets/img/puainta-multivitamin.webp',
    description: '12 vitamin esensial untuk kulit dan bulu, membantu nafsu makan dan daya tahan tubuh.' },

  { id: 11, name: 'Mainan Bola Lonceng', category: 'Mainan', audience: ['kucing', 'kitten'], sizeLabel: 'Isi 3', price: 22000, soldCount: 110, emoji: '🧶', fallbackColor: '#dbe9f5', image: 'assets/img/mainan-bola-lonceng.webp',
    description: 'Bola berlonceng warna-warni, bikin kucing aktif bergerak dan lupa bosan.' },
  { id: 12, name: 'Mainan Tongkat Bulu', category: 'Mainan', audience: ['kucing'], sizeLabel: 'Satuan', price: 18000, soldCount: 95, emoji: '🪶', fallbackColor: '#fbe3e0', image: 'assets/img/mainan-tongkat-bulu.webp',
    description: 'Tongkat bulu warna-warni dengan lonceng, teaser interaktif untuk main bareng.' },

  { id: 13, name: 'Kalung Lonceng Motif Cakar', category: 'Aksesoris', audience: ['kucing', 'anjing'], sizeLabel: '1 pcs', price: 15000, soldCount: 130, emoji: '🔔', fallbackColor: '#d6e6f4', image: 'assets/img/kalung-lonceng-warna-warni.webp',
    description: 'Motif cakar dengan lonceng, ukuran bisa diatur dan ada gesper pengaman. Pilih warna saat konfirmasi via WhatsApp.' },
  { id: 14, name: 'Harness + Tali Anjing', category: 'Aksesoris', audience: ['anjing'], sizeLabel: 'S', price: 79000, soldCount: 80, emoji: '🐕', fallbackColor: '#e3efd9', image: 'assets/img/harness-anjing.webp',
    description: 'Harness nylon kuat dengan tali, ukuran bisa diatur supaya nyaman saat jalan.' },
  { id: 17, name: 'Harness Kucing + Tali', category: 'Aksesoris', audience: ['kucing', 'kitten'], sizeLabel: 'S', price: 65000, soldCount: 90, emoji: '🐈', fallbackColor: '#fbe3e0', image: 'assets/img/harness-kucing.webp',
    description: 'Harness rompi empuk dengan tali, bahan jaring bernapas dan ada strip reflektif.' },

  // Mangkok — variantGroup 'mangkok-double' (varian warna)
  { id: 15, name: 'Mangkok Double Stainless Hijau', category: 'Aksesoris', audience: ['kucing', 'anjing', 'picky'], sizeLabel: 'Satu set', price: 38000, soldCount: 100, emoji: '🥣', fallbackColor: '#fde6cf', image: 'assets/img/mangkok-double-hijau.webp',
    variantGroup: 'mangkok-double', flavorLabel: 'Hijau',
    description: 'Dua mangkok stainless untuk makan dan minum, dasar kokoh dan mudah dibersihkan.' },
  { id: 22, name: 'Mangkok Double Stainless Biru', category: 'Aksesoris', audience: ['kucing', 'anjing', 'picky'], sizeLabel: 'Satu set', price: 38000, soldCount: 60, emoji: '🥣', fallbackColor: '#d6e6f4', image: 'assets/img/mangkok-double-biru.webp',
    variantGroup: 'mangkok-double', flavorLabel: 'Biru',
    description: 'Dua mangkok stainless untuk makan dan minum, dasar kokoh dan mudah dibersihkan.' },

  { id: 16, name: 'Potong Kuku & Bersihkan Telinga (walk-in)', category: 'Layanan', audience: ['kucing', 'anjing'], sizeLabel: 'Kucing', price: 25000, badge: 'Layanan', soldCount: 70, emoji: '✂️', fallbackColor: '#e7e0f3', image: 'assets/img/poster-layanan-potong-kuku.webp',
    description: 'Layanan untuk anjing dan kucing, tanpa janji temu, langsung datang ke toko.' },
];

/* ---------- Fungsi pencarian produk ---------- */

function findProductById(productId) {
  return PRODUCTS.find((product) => product.id === productId);
}

/** Produk terlaris berdasarkan soldCount. */
function getBestSellers(limit) {
  return [...PRODUCTS].sort((a, b) => b.soldCount - a.soldCount).slice(0, limit);
}

/** Semua produk dalam satu variantGroup (termasuk produk itu sendiri), maksimal 4. */
function getVariantSiblings(product) {
  if (!product.variantGroup) return [];
  return PRODUCTS.filter((other) => other.variantGroup === product.variantGroup).slice(0, 4);
}

/** Produk lain dengan kategori sama, di luar variantGroup-nya sendiri. */
function getRelatedProducts(product, limit) {
  return PRODUCTS
    .filter((other) => other.id !== product.id
      && other.category === product.category
      && (!product.variantGroup || other.variantGroup !== product.variantGroup))
    .slice(0, limit);
}

/** Produk makanan yang boleh dipilih di halaman Langganan. */
function getSubscribableProducts() {
  return PRODUCTS.filter((product) => product.category.startsWith('Makanan'));
}
