/* ==========================================================================
   components.js — Potongan HTML yang dipakai ulang di beberapa halaman.
   Setiap fungsi `render...` mengembalikan string HTML.
   ========================================================================== */

const CART_ICON_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H6"/></svg>`;

const FAQ_ITEMS = [
  { question: 'Order jam berapa supaya sampai hari ini?',
    answer: `Order sebelum ${STORE.sameDayCutoff} dan kami antar hari itu juga ke area Singaraja. Setelah itu, diantar besok pagi.` },
  { question: 'Bagaimana cara skip atau ubah jadwal langganan?',
    answer: 'Balas reminder H-1 lewat WhatsApp: skip, tunda, ganti produk, atau berhenti kapan saja tanpa biaya.' },
  { question: 'Kalau salah beli atau anabul tidak cocok?',
    answer: 'Tukar maksimal 3 hari selama segel utuh. Kalau kemasan sudah dibuka, kabari kami dulu dan kita cari solusinya bareng.' },
  { question: 'Metode pembayaran apa saja?',
    answer: 'Transfer bank, QRIS, atau bayar di tempat (COD) untuk area Singaraja. Detailnya dikirim via WhatsApp setelah stok dikonfirmasi.' },
  { question: 'Bagaimana memilih makanan yang tepat?',
    answer: 'Ceritakan umur, ras, dan kondisi anabul di halaman Konsultasi. Kami sarankan seperlunya, bukan semahalnya. Saat ganti makanan, campur bertahap selama 5–7 hari.' },
];

const TESTIMONIALS = [
  { quote: 'Order jam 2 siang, jam 4 sore makanan Mochi udah sampe. Beneran cepet!', author: 'Ayu, pemilik Mochi (British Shorthair)' },
  { quote: 'Dikasih saran ganti ke makanan steril, bulu Luna jadi nggak rontok lagi. Nggak disuruh beli yang mahal-mahal.', author: 'Komang, pemilik Luna' },
  { quote: 'Langganan 3 mingguan, dikabarin H-1. Nggak pernah kehabisan lagi.', author: 'Dewi, pemilik Bruno (Golden)' },
];

/** Foto produk; jika tidak ada foto, tampilkan emoji. */
function renderProductMedia(product) {
  return product.image
    ? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
    : product.emoji;
}

/**
 * Kartu produk di katalog / beranda / produk serupa.
 * Urutan isi: foto → badge → nama → harga → tombol keranjang.
 */
function renderProductCard(product, isCurrent = false) {
  const badge = product.badge ? `<span class="badge">${product.badge}</span>` : '';
  const mediaBackground = product.image ? '#fff' : product.fallbackColor;

  return `
    <div class="product-card${isCurrent ? ' is-current' : ''}">
      <a class="product-card-link" href="#/produk?id=${product.id}">
        <div class="product-card-media" style="background:${mediaBackground}">${renderProductMedia(product)}</div>
        <div class="product-card-body">
          ${badge}
          <h3 class="product-card-name">${product.name}</h3>
          <div class="price">${formatRupiah(product.price)} <small>/ ${product.sizeLabel}</small></div>
        </div>
      </a>
      <div class="product-card-actions">
        <button type="button" class="add-to-cart-button" data-add-to-cart="${product.id}"
                aria-label="Tambah ${product.name} ke keranjang">${CART_ICON_SVG}<span>Tambah</span></button>
      </div>
    </div>`;
}

/** Deretan langkah bernomor (dipakai di "Auto-Restock" dan "Cara order"). */
function renderStepCards(steps) {
  return `<div class="steps">${steps.map((step) => `
    <div class="step"><h3>${step.title}</h3><p>${step.text}</p></div>`).join('')}
  </div>`;
}

function renderTestimonials() {
  return `<div class="testimonials">${TESTIMONIALS.map((item) => `
    <blockquote>“${item.quote}”<cite>${item.author}</cite></blockquote>`).join('')}
  </div>`;
}

function renderFaqSection() {
  return `
    <section class="section">
      <h2>Pertanyaan yang sering ditanya</h2>
      <p class="section-subtitle">Belum ketemu jawabannya? Chat kami lewat WhatsApp.</p>
      ${FAQ_ITEMS.map((item) => `
        <details class="faq-item"><summary>${item.question}</summary><p>${item.answer}</p></details>`).join('')}
    </section>`;
}

/** Blok kepercayaan: retur & garansi, cara bayar, testimoni. */
function renderTrustBlock() {
  return `
    <section class="section">
      <h2>Belanja tenang di Kyobell</h2>
      <p class="section-subtitle">Kebijakan jelas, bayar fleksibel, dan cerita pet parent lain.</p>
      <div class="card-pair">
        <div class="info-card">
          <h3>🛡️ Retur &amp; garansi</h3>
          <ul>
            <li>Salah beli? Tukar maksimal 3 hari selama segel utuh.</li>
            <li>Produk rusak atau mendekati expired? Kami ganti baru, ongkir ditanggung Kyobell.</li>
            <li>Kurang cocok setelah dibuka? Hubungi kami, kita cari solusinya bareng.</li>
          </ul>
        </div>
        <div class="info-card">
          <h3>💳 Cara bayar</h3>
          <ul>
            <li>Transfer bank (nomor rekening dikirim via WA)</li>
            <li>QRIS</li>
            <li>Bayar di tempat (COD) untuk area Singaraja</li>
          </ul>
        </div>
      </div>
      <div class="section-block-gap">${renderTestimonials()}</div>
    </section>`;
}
