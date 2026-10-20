/* ==========================================================================
   pages.js — Satu fungsi `render...Page` per halaman (mengembalikan HTML) dan,
   bila perlu, satu fungsi `setup...Page` yang memasang event setelah HTML tampil.
   Daftar rute ada di app.js.
   ========================================================================== */

/* ---------- Teks yang dipakai ulang ---------- */

const AUTO_RESTOCK_STEPS = [
  { title: 'Pilih makanan & frekuensi', text: 'Setiap 2, 3, atau 4 minggu sesuai kebutuhan anabul.' },
  { title: 'Kami anter otomatis', text: 'Ada reminder H-1. Mau skip? Tinggal kabari via WA.' },
  { title: 'Hemat dan fleksibel', text: 'Stok aman, tanpa komitmen kaku. Bisa berhenti kapan saja.' },
];

const HOW_TO_ORDER_STEPS = [
  { title: 'Atur jumlah', text: 'Tentukan jumlah dengan tombol − dan +, lalu tap Add to Cart. Total harga ikut berubah.' },
  { title: 'Cek keranjang', text: 'Buka Keranjang untuk menambah produk lain atau mengubah jumlah.' },
  { title: 'Order via WhatsApp', text: 'Tap Order semua via WhatsApp. Pesan terisi otomatis: produk, jumlah, dan total.' },
  { title: 'Konfirmasi & diantar', text: `Kami cek stok dan kirim detail pembayaran. Order sebelum ${STORE.sameDayCutoff} sampai hari ini juga di area Singaraja.` },
];

/* ==========================================================================
   BERANDA  (#/)
   ========================================================================== */

function renderHomePage() {
  return `
    <!-- 1. Hero -->
    <section class="container hero">
      <div>
        <h1>Bingung pilih makanan yang <span>pas</span> buat anabul?</h1>
        <p>Same-day delivery — atau sekalian langganan, kami yang inget jadwalnya.</p>
        <div class="button-row">
          <a class="btn" href="#/katalog">Belanja Sekarang</a>
          <a class="btn btn-outline" href="#/langganan">Set Auto-Restock</a>
        </div>
      </div>
      <div class="framed-art">
        <img class="hero-image" src="${HERO_IMAGE}" alt="Anjing dan kucing yang senang, sahabat anabul">
      </div>
    </section>

    <!-- 2. Trust strip -->
    <div class="container">
      <div class="trust-strip">
        <div>⏰ Same-day sebelum ${STORE.sameDayCutoff}</div>
        <div>📅 Expired date jauh (ditulis)</div>
        <div>🔁 Salah beli? Dibantu tukar</div>
      </div>
    </div>

    <!-- 3. Auto-Restock -->
    <section class="section">
      <div class="container">
        <h2>Auto-Restock: nggak ada lagi “kehabisan pas malem”</h2>
        <p class="section-subtitle">Tiga langkah, selesai. Kami yang inget jadwalnya.</p>
        ${renderStepCards(AUTO_RESTOCK_STEPS)}
        <div class="button-row"><a class="btn" href="#/langganan">Atur Langganan</a></div>
      </div>
    </section>

    <!-- 4. Shop by -->
    <section class="section section-tinted">
      <div class="container">
        <h2>Belanja sesuai kondisi anabul</h2>
        <p class="section-subtitle">Bukan cuma per merek — pilih dari kebutuhannya.</p>
        <div class="shop-by-grid">
          ${SHOP_BY_SHORTCUTS.map((shortcut) => `
            <a href="#/katalog?audience=${shortcut.audience}"><span>${shortcut.emoji}</span>${shortcut.label}</a>`).join('')}
        </div>
      </div>
    </section>

    <!-- 5. Best seller -->
    <section class="section">
      <div class="container">
        <h2>Best Seller</h2>
        <p class="section-subtitle">Paling sering dipesan pet parent Singaraja.</p>
        <div class="product-grid">${getBestSellers(8).map((product) => renderProductCard(product)).join('')}</div>
      </div>
    </section>

    <!-- 6. Konsultasi Gratis -->
    <section class="section">
      <div class="container">
        <div class="consult-band">
          <div>
            <h2>Konsultasi Gratis</h2>
            <p>Ceritain umur, ras, &amp; masalahnya (bulu rontok? pup lembek?) — kami saranin produk seperlunya, bukan semahalnya.</p>
          </div>
          <a class="btn btn-white" href="#/konsultasi">Mulai Konsultasi</a>
        </div>
      </div>
    </section>

    <!-- 7. Testimoni -->
    <section class="section">
      <div class="container">
        <h2>Kata pet parent</h2>
        <p class="section-subtitle">Cepet datang, sarannya pas.</p>
        ${renderTestimonials()}
      </div>
    </section>

    <!-- 8. CTA -->
    <div class="cta-band">
      <h2>Anabul makin sehat, bulu lembut dan berkilau.</h2>
      <a class="btn btn-white" target="_blank" rel="noopener" href="${buildWhatsAppUrl('Halo Kyobell, saya mau order.')}">Order Sekarang</a>
    </div>`;
}

/* ==========================================================================
   KATALOG  (#/katalog)
   ========================================================================== */

/** Filter yang sedang aktif. Disimpan di luar halaman agar tidak hilang saat kembali dari detail. */
const catalogFilters = { audience: 'semua', searchText: '', sortBy: 'best' };

function renderCatalogPage(params) {
  // Link "Shop by" di beranda membawa ?audience=...
  if (params.get('audience')) catalogFilters.audience = params.get('audience');

  return `
    <section class="container section">
      <h1 class="page-title">Katalog</h1>
      <p class="section-subtitle">Semua kebutuhan anabul dalam satu tempat. Stok dikonfirmasi via WA sebelum diantar.</p>

      <div class="catalog-toolbar">
        <input id="catalog-search" type="search" placeholder="Cari produk, mis. pasir, steril…" aria-label="Cari produk">
        <select id="catalog-audience" aria-label="Untuk">
          ${AUDIENCE_FILTERS.map((filter) => `<option value="${filter.key}">${filter.label}</option>`).join('')}
        </select>
        <select id="catalog-sort" aria-label="Urutkan">
          <option value="best">Terlaris</option>
          <option value="cheapest">Termurah</option>
          <option value="priciest">Termahal</option>
        </select>
      </div>

      <p class="result-count" id="catalog-count"></p>
      <div class="product-grid" id="catalog-grid"></div>
    </section>`;
}

function getFilteredProducts() {
  const searchText = catalogFilters.searchText.trim().toLowerCase();

  const matchingProducts = PRODUCTS.filter((product) => {
    // Filter "Kitten & Puppy" (key 'kitten') juga mencakup produk puppy.
    const matchesAudience = catalogFilters.audience === 'semua'
      || product.audience.includes(catalogFilters.audience)
      || (catalogFilters.audience === 'kitten' && product.audience.includes('puppy'));
    const searchableText = `${product.name} ${product.category} ${product.description} ${product.flavorLabel || ''}`.toLowerCase();
    return matchesAudience && (!searchText || searchableText.includes(searchText));
  });

  const sortRules = {
    best: (a, b) => b.soldCount - a.soldCount,
    cheapest: (a, b) => a.price - b.price,
    priciest: (a, b) => b.price - a.price,
  };
  return matchingProducts.sort(sortRules[catalogFilters.sortBy]);
}

/** Menggambar ulang jumlah hasil dan grid produk (tanpa menyentuh kolom cari). */
function updateCatalogResults() {
  const products = getFilteredProducts();
  $('catalog-count').textContent = `${products.length} produk ditemukan`;

  $('catalog-grid').innerHTML = products.length
    ? products.map((product) => renderProductCard(product)).join('')
    : `<div class="empty-state product-grid-empty">Produk belum ketemu. Coba kata lain, atau <a class="text-link" href="#/konsultasi">tanya kami</a>.</div>`;
}

function setupCatalogPage() {
  const searchInput = $('catalog-search');
  const audienceSelect = $('catalog-audience');
  const sortSelect = $('catalog-sort');

  searchInput.value = catalogFilters.searchText;
  audienceSelect.value = catalogFilters.audience;
  sortSelect.value = catalogFilters.sortBy;

  searchInput.oninput = () => { catalogFilters.searchText = searchInput.value; updateCatalogResults(); };
  audienceSelect.onchange = () => { catalogFilters.audience = audienceSelect.value; updateCatalogResults(); };
  sortSelect.onchange = () => { catalogFilters.sortBy = sortSelect.value; updateCatalogResults(); };

  updateCatalogResults();
}

/* ==========================================================================
   DETAIL PRODUK  (#/produk?id=NOMOR)
   ========================================================================== */

function renderProductDetailPage(params) {
  const product = findProductById(Number(params.get('id')));
  if (!product) {
    return `<div class="container empty-state"><h2>Produk tidak ditemukan</h2><a class="btn" href="#/katalog">Ke Katalog</a></div>`;
  }

  const variantSiblings = getVariantSiblings(product);
  const relatedProducts = getRelatedProducts(product, 4);
  const audienceText = product.audience.map((key) => AUDIENCE_LABELS[key]).join(', ');
  const variantLine = product.flavorLabel
    ? `<p class="detail-meta">Varian: <b>${product.flavorLabel}</b></p>` : '';
  const subscriptionTip = product.category.startsWith('Makanan')
    ? `<li>🔁 Bisa <a class="text-link" href="#/langganan">langganan auto-restock</a> supaya tidak kehabisan.</li>` : '';

  return `
    <div class="container">
      <a class="back-link" href="#/katalog">← Kembali ke katalog</a>

      <div class="product-detail">
        <div class="product-detail-media">${renderProductMedia(product)}</div>

        <div>
          <small class="detail-meta">${product.category}${product.badge ? ' · ' + product.badge : ''}</small>
          <h1 class="product-detail-title">${product.name}</h1>
          ${variantLine}
          <div class="price detail-price" id="detail-total"></div>
          <small class="detail-meta" id="detail-breakdown"></small>

          <p>${product.description} ${CATEGORY_DESCRIPTIONS[product.category]}</p>
          <p class="detail-meta">Cocok untuk: ${audienceText}</p>
          <p class="detail-size">Ukuran: <b>${product.sizeLabel}</b></p>

          <b class="detail-label">Jumlah</b>
          <div class="quantity-stepper">
            <button type="button" class="quantity-button" id="detail-decrease" aria-label="Kurangi jumlah">−</button>
            <output id="detail-quantity" aria-live="polite">1</output>
            <button type="button" class="quantity-button" id="detail-increase" aria-label="Tambah jumlah">+</button>
          </div>

          <div class="button-row">
            <button type="button" class="btn" id="detail-add-to-cart">${CART_ICON_SVG} Add to Cart</button>
          </div>
          <div class="detail-message" id="detail-message" aria-live="polite"></div>

          <div class="info-card detail-info-card">
            <b>Info penting</b>
            <ul>
              <li>🚚 Same-day area Singaraja untuk order sebelum ${STORE.sameDayCutoff}. Gratis ongkir min. belanja ${formatRupiah(SHIPPING.freeShippingMinimum)}, di bawahnya ongkir flat ${formatRupiah(SHIPPING.flatFee)}.</li>
              <li>🛡️ Garansi: produk rusak atau tidak sesuai kami ganti baru.</li>
              <li>📅 Expired date jauh dan kami tuliskan di nota.</li>
              ${subscriptionTip}
            </ul>
          </div>
        </div>
      </div>

      ${variantSiblings.length > 1 ? `
        <section class="section">
          <h2>Varian lainnya</h2>
          <p class="section-subtitle">Pilihan rasa atau warna lain dari produk ini.</p>
          <div class="product-grid">${variantSiblings.map((sibling) => renderProductCard(sibling, sibling.id === product.id)).join('')}</div>
        </section>` : ''}

      <section class="section">
        <h2>Cara order</h2>
        <p class="section-subtitle">Empat langkah, tanpa ribet.</p>
        ${renderStepCards(HOW_TO_ORDER_STEPS)}
      </section>

      ${renderTrustBlock()}

      ${relatedProducts.length ? `
        <section class="section">
          <h2>Produk serupa</h2>
          <div class="product-grid">${relatedProducts.map((related) => renderProductCard(related)).join('')}</div>
        </section>` : ''}
    </div>`;
}

function setupProductDetailPage(params) {
  const product = findProductById(Number(params.get('id')));
  if (!product) return;

  let selectedQuantity = 1;

  function refreshPriceAndQuantity() {
    $('detail-total').textContent = formatRupiah(product.price * selectedQuantity);
    $('detail-breakdown').textContent = `${selectedQuantity} × ${formatRupiah(product.price)} (${product.sizeLabel})`;
    $('detail-quantity').textContent = selectedQuantity;
    $('detail-decrease').disabled = selectedQuantity <= 1;
    $('detail-increase').disabled = selectedQuantity >= MAX_QUANTITY_PER_ITEM;
  }

  $('detail-decrease').onclick = () => { selectedQuantity -= 1; refreshPriceAndQuantity(); };
  $('detail-increase').onclick = () => { selectedQuantity += 1; refreshPriceAndQuantity(); };
  $('detail-add-to-cart').onclick = () => {
    addToCart(product.id, selectedQuantity);
    $('detail-message').innerHTML = `✓ ${selectedQuantity} × ${product.name} masuk keranjang. <a href="#/wishlist">Lihat Keranjang</a>`;
  };

  refreshPriceAndQuantity();
}

/* ==========================================================================
   LANGGANAN AUTO-RESTOCK  (#/langganan)
   ========================================================================== */

function renderSubscriptionPage() {
  // Pilihan makanan ditampilkan sebagai daftar baris (bukan <select>) supaya nama panjang tidak terpotong di HP.
  const productChoices = getSubscribableProducts().map((product, index) => `
    <label class="choice">
      <input type="radio" name="subscription-product" value="${product.id}"${index === 0 ? ' checked' : ''}>
      <span class="choice-body">
        ${product.image
          ? `<img class="choice-image" src="${product.image}" alt="">`
          : `<span class="choice-image">${product.emoji}</span>`}
        <span class="choice-text">
          <b>${product.name}</b>
          <small>${product.sizeLabel} · ${formatRupiah(product.price)}</small>
        </span>
      </span>
    </label>`).join('');

  const intervalChoices = SUBSCRIPTION_INTERVALS_IN_WEEKS.map((weeks, index) => `
    <label class="choice">
      <input type="radio" name="subscription-interval" value="${weeks}"${index === 0 ? ' checked' : ''}>
      <span class="choice-body">${weeks} minggu</span>
    </label>`).join('');

  return `
    <div class="container">
      <section class="section">
        <h1 class="page-title">Langganan Auto-Restock</h1>
        <p class="section-subtitle">Pilih makanan, pilih frekuensi. Reminder H-1, bisa skip via WA.</p>
        <form class="form-card" id="subscription-form">
          <fieldset class="field-group">
            <legend>1. Pilih makanan</legend>
            <div class="choice-list">${productChoices}</div>
          </fieldset>
          <fieldset class="field-group">
            <legend>2. Antar setiap</legend>
            <div class="choice-pills">${intervalChoices}</div>
          </fieldset>
          <label>3. Alamat (area Singaraja)<input id="subscription-address" placeholder="Jl. ..., Kelurahan ..."></label>
          <div class="total-price" id="subscription-total"></div>
          <a class="btn" id="subscription-submit" target="_blank" rel="noopener">Mulai Langganan via WA</a>
        </form>
      </section>
      ${renderFaqSection()}
      ${renderTrustBlock()}
    </div>`;
}

function setupSubscriptionPage() {
  const form = $('subscription-form');
  const getCheckedValue = (fieldName) => form.querySelector(`input[name="${fieldName}"]:checked`).value;

  function refreshSubscriptionSummary() {
    const product = findProductById(Number(getCheckedValue('subscription-product')));
    const weeks = getCheckedValue('subscription-interval');

    $('subscription-total').textContent = `${formatRupiah(product.price)} / ${weeks} minggu`;
    $('subscription-submit').href = buildWhatsAppUrl(
      `Halo Kyobell, saya mau langganan auto-restock:\n${product.name} (${describeVariant(product)})\nSetiap ${weeks} minggu\nAlamat: ${$('subscription-address').value}`);
  }

  form.addEventListener('submit', (event) => event.preventDefault());  // Enter di kolom alamat tidak memuat ulang halaman
  form.addEventListener('input', refreshSubscriptionSummary);
  form.addEventListener('change', refreshSubscriptionSummary);
  refreshSubscriptionSummary();
}

/* ==========================================================================
   KONSULTASI  (#/konsultasi)
   ========================================================================== */

function renderConsultationPage() {
  return `
    <div class="container">
      <section class="section">
        <h1 class="page-title">Konsultasi Produk</h1>
        <p class="section-subtitle">Kami saranin produk seperlunya, bukan semahalnya.</p>
        <div class="form-card">
          <label>Jenis<select id="consult-pet-type"><option>Kucing</option><option>Anjing</option></select></label>
          <label>Umur<input id="consult-age" placeholder="mis. 8 bulan"></label>
          <label>Ras<input id="consult-breed" placeholder="mis. domestik, golden"></label>
          <label>Kondisi
            <select id="consult-condition">
              <option>Sehat / umum</option><option>Steril</option><option>Bulu rontok</option>
              <option>Pup lembek</option><option>Picky eater</option>
            </select>
          </label>
          <label>Cerita singkat<textarea id="consult-story" rows="3" style="resize: vertical"></textarea></label>
          <a class="btn" id="consult-submit" target="_blank" rel="noopener">Kirim ke WhatsApp</a>
        </div>
      </section>
    </div>`;
}

function setupConsultationPage() {
  function refreshConsultationLink() {
    $('consult-submit').href = buildWhatsAppUrl(
      `Halo Kyobell, mau konsultasi.\nJenis: ${$('consult-pet-type').value}\nUmur: ${$('consult-age').value}\nRas: ${$('consult-breed').value}\nKondisi: ${$('consult-condition').value}\nCerita: ${$('consult-story').value}`);
  }

  ['consult-pet-type', 'consult-age', 'consult-breed', 'consult-condition', 'consult-story'].forEach((fieldId) => {
    $(fieldId).oninput = refreshConsultationLink;
  });
  refreshConsultationLink();
}

/* ==========================================================================
   KONTAK  (#/kontak)
   ========================================================================== */

/** Ilustrasi peta, dipakai bila peta Google tidak boleh dimuat (STORE.showEmbeddedMap = false). */
const MAP_ILLUSTRATION_SVG = `
  <svg class="map-illustration" viewBox="0 0 600 220" role="img" aria-label="Peta lokasi Kyobell Petshop">
    <rect width="600" height="220" fill="#F6EEE1"/>
    <rect x="30" y="20" width="150" height="70" rx="8" fill="#e3efd9"/>
    <rect x="420" y="130" width="150" height="70" rx="8" fill="#dbe9f5"/>
    <path d="M0 110H600M300 0V220M120 0L210 220" stroke="#fff" stroke-width="16" fill="none"/>
    <path d="M300 108c-14-22-22-30-22-42a22 22 0 0144 0c0 12-8 20-22 42z" fill="#E8843C"/>
    <circle cx="300" cy="66" r="8" fill="#fff"/>
    <text x="332" y="72" font-size="16" font-weight="700" fill="#33261C" font-family="sans-serif">Kyobell Petshop</text>
    <text x="300" y="200" text-anchor="middle" font-size="13" fill="#7a6a5c" font-family="sans-serif">Ketuk untuk buka di Google Maps</text>
  </svg>`;

function renderContactPage() {
  const mapMarkup = STORE.showEmbeddedMap
    ? `<iframe class="map-frame" title="Peta Kyobell Petshop" loading="lazy" src="${STORE.mapsEmbedUrl}"></iframe>`
    : `<a href="${STORE.mapsLink}" target="_blank" rel="noopener" aria-label="Buka peta Kyobell Petshop di Google Maps">${MAP_ILLUSTRATION_SVG}</a>`;

  return `
    <div class="container">
      <section class="section">
        <h1 class="page-title">Kontak</h1>
        <p class="section-subtitle">Paling cepat lewat WhatsApp. Kami biasanya balas dalam hitungan menit.</p>

        <div class="card-pair">
          <div class="info-card">
            <h3>💬 WhatsApp</h3>
            <p class="info-card-text">${STORE.whatsappDisplay}<br>Respon rata-rata di bawah 10 menit, ${STORE.openingHours}.</p>
            <a class="btn" target="_blank" rel="noopener" href="${buildWhatsAppUrl('Halo Kyobell!')}">Chat via WhatsApp</a>
          </div>
          <div class="info-card">
            <h3>📍 ${STORE.name}</h3>
            <p class="info-card-text">${STORE.city}<br>Buka ${STORE.openingHours}. Walk-in welcome untuk pilih produk langsung dan potong kuku.</p>
            <a class="btn btn-outline" target="_blank" rel="noopener" href="${STORE.mapsLink}">Buka di Google Maps</a>
          </div>
        </div>

        <div class="framed-art section-block-gap">${mapMarkup}</div>

        <div class="info-card section-block-gap">
          <b>🚚 Area antar</b>
          <p class="info-card-text is-tight">Same-day untuk wilayah Singaraja, order sebelum ${STORE.sameDayCutoff}. Di luar area, tanyakan dulu via WhatsApp.</p>
        </div>
      </section>
      ${renderFaqSection()}
    </div>`;
}

/* ==========================================================================
   KERANJANG  (#/wishlist — path lama dipertahankan agar link lama tetap jalan)
   ========================================================================== */

function renderCartPage() {
  const cartLines = getCartLines();

  if (cartLines.length === 0) {
    return `
      <div class="container empty-state">
        <h2>Keranjang masih kosong</h2>
        <p>Tambahkan produk lewat tombol keranjang di katalog.</p>
        <a class="btn" href="#/katalog">Lihat Katalog</a>
      </div>`;
  }

  const cartTotal = getCartTotal();
  const orderMessage = buildCartOrderMessage(cartLines, cartTotal);

  const cartRows = cartLines.map(({ product, quantity, lineTotal }) => `
    <div class="cart-row">
      <a class="cart-row-image" href="#/produk?id=${product.id}">${renderProductMedia(product)}</a>
      <div class="cart-row-info">
        <a href="#/produk?id=${product.id}"><b>${product.name}</b></a>
        <small>${product.sizeLabel} · ${formatRupiah(product.price)}</small>
        <div class="cart-row-controls">
          <div class="quantity-stepper is-small">
            <button type="button" class="quantity-button" data-cart-change="-1" data-product-id="${product.id}" aria-label="Kurangi jumlah">−</button>
            <output>${quantity}</output>
            <button type="button" class="quantity-button" data-cart-change="1" data-product-id="${product.id}" aria-label="Tambah jumlah">+</button>
          </div>
          <b class="cart-row-total">${formatRupiah(lineTotal)}</b>
        </div>
      </div>
    </div>`).join('');

  return `
    <div class="container">
      <section class="section">
        <h1 class="page-title">Keranjang</h1>
        <p class="section-subtitle">Atur jumlah tiap produk, lalu order sekaligus lewat WhatsApp.</p>
        <div class="cart-list">${cartRows}</div>
        <div class="info-card cart-summary">
          <div>
            <small class="detail-meta">Total belanja</small>
            <div class="total-price">${formatRupiah(cartTotal)}</div>
          </div>
          <a class="btn" target="_blank" rel="noopener" href="${buildWhatsAppUrl(orderMessage)}">Order semua via WhatsApp</a>
        </div>
      </section>
    </div>`;
}

function buildCartOrderMessage(cartLines, cartTotal) {
  const itemLines = cartLines.map(({ product, quantity, lineTotal }, index) =>
    `${index + 1}. ${product.name} (${describeVariant(product)}) × ${quantity} — ${formatRupiah(lineTotal)}`);

  return `Halo Kyobell, saya mau order:\n\n${itemLines.join('\n')}\n\nTotal: ${formatRupiah(cartTotal)}\n\nMohon dicek stok dan ongkirnya ya. Terima kasih!`;
}
