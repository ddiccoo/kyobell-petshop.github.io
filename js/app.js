/* ==========================================================================
   app.js — Router (pindah halaman lewat hash #/...) dan penanganan klik.
   Ini satu-satunya file yang "menjalankan" aplikasi; halaman ada di pages.js.
   ========================================================================== */

/**
 * Daftar halaman.
 *   render      → fungsi yang mengembalikan HTML halaman
 *   afterRender → (opsional) dipanggil setelah HTML tampil, untuk memasang event
 */
const ROUTES = {
  '/': { render: renderHomePage },
  '/katalog': { render: renderCatalogPage, afterRender: setupCatalogPage },
  '/produk': { render: renderProductDetailPage, afterRender: setupProductDetailPage },
  '/langganan': { render: renderSubscriptionPage, afterRender: setupSubscriptionPage },
  '/konsultasi': { render: renderConsultationPage, afterRender: setupConsultationPage },
  '/kontak': { render: renderContactPage },
  '/wishlist': { render: renderCartPage },
};

/** "#/produk?id=7" → { path: '/produk', params: URLSearchParams(id=7) } */
function parseLocationHash() {
  const hashText = location.hash.slice(1) || '/';
  const [path, queryString = ''] = hashText.split('?');
  return { path: ROUTES[path] ? path : '/', params: new URLSearchParams(queryString) };
}

/* ---------- Menu hamburger (layar HP) ---------- */

const DESKTOP_MENU_MEDIA_QUERY = '(min-width: 800px)';  // harus sama dengan breakpoint navbar di style.css

function isMobileMenuOpen() {
  return $('site-menu').classList.contains('is-open');
}

/** Buka/tutup panel menu: mengatur kelas, lapisan latar, dan atribut aksesibilitas tombol. */
function setMobileMenuOpen(shouldOpen) {
  const toggleButton = $('menu-toggle');
  $('site-menu').classList.toggle('is-open', shouldOpen);
  $('menu-backdrop').hidden = !shouldOpen;
  toggleButton.setAttribute('aria-expanded', String(shouldOpen));
  toggleButton.setAttribute('aria-label', shouldOpen ? 'Tutup menu' : 'Buka menu');
}

/** Memberi tanda "aktif" pada menu navbar sesuai halaman. */
function highlightActiveMenuLink(currentPath) {
  const activeMenuPath = currentPath === '/produk' ? '/katalog' : currentPath;
  document.querySelectorAll('#site-menu .navbar-link').forEach((link) => {
    link.classList.toggle('is-active', link.dataset.route === activeMenuPath);
  });
}

/** Menampilkan halaman sesuai URL saat ini. */
function renderCurrentRoute({ keepScrollPosition = false } = {}) {
  const { path, params } = parseLocationHash();
  const route = ROUTES[path];
  const scrollY = window.scrollY;

  setMobileMenuOpen(false);  // menu hamburger selalu menutup saat pindah halaman

  $('app').innerHTML = route.render(params);
  if (route.afterRender) route.afterRender(params);
  highlightActiveMenuLink(path);

  window.scrollTo(0, keepScrollPosition ? scrollY : 0);
}

/* ---------- Penanganan klik (satu listener untuk seluruh halaman) ---------- */

/** Tombol keranjang di kartu produk: tambah 1 dan beri umpan balik sesaat. */
function handleAddToCartClick(button) {
  addToCart(Number(button.dataset.addToCart), 1);

  const label = button.querySelector('span');
  button.classList.add('is-added');
  label.textContent = 'Ditambahkan';
  clearTimeout(button.resetTimer);
  button.resetTimer = setTimeout(() => {
    button.classList.remove('is-added');
    label.textContent = 'Tambah';
  }, 1300);
}

/** Tombol − dan + di halaman Keranjang. */
function handleCartQuantityClick(button) {
  changeCartQuantity(Number(button.dataset.productId), Number(button.dataset.cartChange));
  renderCurrentRoute({ keepScrollPosition: true });
}

document.addEventListener('click', (event) => {
  // Menu hamburger: tombol, lapisan latar, dan link menu
  if (event.target.closest('#menu-toggle')) return setMobileMenuOpen(!isMobileMenuOpen());
  if (event.target.closest('#menu-backdrop') || event.target.closest('.navbar-link')) setMobileMenuOpen(false);

  const addButton = event.target.closest('[data-add-to-cart]');
  if (addButton) return handleAddToCartClick(addButton);

  const quantityButton = event.target.closest('[data-cart-change]');
  if (quantityButton) return handleCartQuantityClick(quantityButton);
});

/* ---------- Mulai ---------- */

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMobileMenuOpen(false);
});
// Jika layar dilebarkan ke ukuran desktop, pastikan keadaan menu hamburger direset.
window.matchMedia(DESKTOP_MENU_MEDIA_QUERY).addEventListener('change', (event) => {
  if (event.matches) setMobileMenuOpen(false);
});

window.addEventListener('hashchange', () => renderCurrentRoute());
$('whatsapp-fab').href = buildWhatsAppUrl('Halo Kyobell, saya mau tanya-tanya.');
updateCartBadge();
renderCurrentRoute();
