/* =========================================================
   INVENTRA — SCRIPT.JS
   Sistem Manajemen Inventaris Ruangan
   Semua fitur berjalan di sisi client (tanpa backend/database)
   ========================================================= */

/* ---------------------------------------------------------
   1. KONSTANTA & STATE GLOBAL
--------------------------------------------------------- */
const STORAGE_KEY_DATA = "inventarisData";
const STORAGE_KEY_THEME = "inventraTheme";
const STORAGE_KEY_ACTIVITY = "inventraActivity";

const KATEGORI_LIST = [
  { value: "Elektronik", icon: "🔌" },
  { value: "Furniture", icon: "🪑" },
  { value: "Peralatan Komputer", icon: "🖥️" },
  { value: "Peralatan Laboratorium", icon: "🧪" },
  { value: "Buku", icon: "📚" },
  { value: "Peralatan Kantor", icon: "🗄️" },
  { value: "Lainnya", icon: "📦" }
];

const KONDISI_LIST = ["Baik", "Rusak Ringan", "Rusak Berat", "Dalam Perbaikan", "Tidak Digunakan"];
const STATUS_LIST = ["Tersedia", "Sedang Digunakan", "Dipinjam", "Dalam Perbaikan", "Tidak Digunakan"];
const SATUAN_LIST = ["Unit", "Pcs", "Set", "Buah", "Paket", "Lusin", "Rim", "Box"];

// Data contoh awal — hanya dipakai jika localStorage benar-benar kosong
const SAMPLE_DATA = [
  {
    id: "1", foto: "", nama: "Monitor Samsung 24 Inch", kode: "INV-001", kategori: "Elektronik",
    merek: "Samsung", model: "S24F350", nomorSeri: "SN-24001", tahunPembelian: "2022",
    tanggalMasuk: "2022-03-10", harga: 1850000, jumlah: 25, satuan: "Unit",
    ruangan: "Lab Komputer", lokasiDetail: "Meja baris A1-A25", kondisi: "Baik", status: "Tersedia",
    penanggungJawab: "Budi Santoso", deskripsi: "Monitor LED 24 inch untuk laboratorium komputer.",
    catatanKondisi: "Kondisi baik, layar tanpa cacat.", createdAt: Date.now() - 86400000 * 30, updatedAt: Date.now() - 86400000 * 2
  },
  {
    id: "2", foto: "", nama: "Keyboard Logitech K120", kode: "INV-002", kategori: "Peralatan Komputer",
    merek: "Logitech", model: "K120", nomorSeri: "SN-24002", tahunPembelian: "2022",
    tanggalMasuk: "2022-03-10", harga: 95000, jumlah: 25, satuan: "Unit",
    ruangan: "Lab Komputer", lokasiDetail: "Meja baris A1-A25", kondisi: "Baik", status: "Tersedia",
    penanggungJawab: "Budi Santoso", deskripsi: "Keyboard kabel standar untuk unit komputer lab.",
    catatanKondisi: "Semua tombol berfungsi normal.", createdAt: Date.now() - 86400000 * 30, updatedAt: Date.now() - 86400000 * 5
  },
  {
    id: "3", foto: "", nama: "Kursi Kuliah Lipat", kode: "INV-003", kategori: "Furniture",
    merek: "Chitose", model: "Unichair", nomorSeri: "-", tahunPembelian: "2021",
    tanggalMasuk: "2021-07-01", harga: 320000, jumlah: 40, satuan: "Unit",
    ruangan: "Ruang Kelas", lokasiDetail: "Ruang Kelas 101", kondisi: "Baik", status: "Sedang Digunakan",
    penanggungJawab: "Siti Aminah", deskripsi: "Kursi kuliah lipat dengan meja tulis terpasang.",
    catatanKondisi: "Beberapa engsel mulai longgar namun masih aman digunakan.", createdAt: Date.now() - 86400000 * 200, updatedAt: Date.now() - 86400000 * 20
  },
  {
    id: "4", foto: "", nama: "Proyektor Epson EB-X05", kode: "INV-004", kategori: "Elektronik",
    merek: "Epson", model: "EB-X05", nomorSeri: "SN-EPX05-11", tahunPembelian: "2020",
    tanggalMasuk: "2020-01-15", harga: 5200000, jumlah: 2, satuan: "Unit",
    ruangan: "Ruang Kelas", lokasiDetail: "Ruang Kelas 102", kondisi: "Rusak Ringan", status: "Dalam Perbaikan",
    penanggungJawab: "Siti Aminah", deskripsi: "Proyektor untuk presentasi kelas, lampu mulai redup.",
    catatanKondisi: "Lampu proyektor meredup, perlu penggantian bohlam.", createdAt: Date.now() - 86400000 * 400, updatedAt: Date.now() - 86400000 * 1
  },
  {
    id: "5", foto: "", nama: "Rak Buku Kayu 5 Susun", kode: "INV-005", kategori: "Furniture",
    merek: "Olympic", model: "RK-500", nomorSeri: "-", tahunPembelian: "2019",
    tanggalMasuk: "2019-05-20", harga: 890000, jumlah: 10, satuan: "Unit",
    ruangan: "Perpustakaan", lokasiDetail: "Sisi utara ruangan", kondisi: "Baik", status: "Sedang Digunakan",
    penanggungJawab: "Rina Wulandari", deskripsi: "Rak penyimpanan buku koleksi umum.",
    catatanKondisi: "Kokoh dan tidak ada kerusakan.", createdAt: Date.now() - 86400000 * 500, updatedAt: Date.now() - 86400000 * 60
  },
  {
    id: "6", foto: "", nama: "Printer Canon iP2770", kode: "INV-006", kategori: "Elektronik",
    merek: "Canon", model: "iP2770", nomorSeri: "SN-CN2770-3", tahunPembelian: "2018",
    tanggalMasuk: "2018-09-12", harga: 650000, jumlah: 2, satuan: "Unit",
    ruangan: "Ruang Guru", lokasiDetail: "Meja administrasi", kondisi: "Rusak Berat", status: "Tidak Digunakan",
    penanggungJawab: "Rina Wulandari", deskripsi: "Printer inkjet untuk kebutuhan cetak administrasi guru.",
    catatanKondisi: "Head printer rusak, tinta bocor. Menunggu keputusan penggantian.", createdAt: Date.now() - 86400000 * 700, updatedAt: Date.now() - 86400000 * 3
  },
  {
    id: "7", foto: "", nama: "Mikroskop Binokuler", kode: "INV-007", kategori: "Peralatan Laboratorium",
    merek: "Olympus", model: "CX23", nomorSeri: "SN-OLY23-7", tahunPembelian: "2021",
    tanggalMasuk: "2021-02-18", harga: 7500000, jumlah: 8, satuan: "Unit",
    ruangan: "Lab Komputer", lokasiDetail: "Lemari alat lab", kondisi: "Baik", status: "Dipinjam",
    penanggungJawab: "Budi Santoso", deskripsi: "Mikroskop untuk praktikum biologi dan sains.",
    catatanKondisi: "Lensa bersih, kondisi optimal.", createdAt: Date.now() - 86400000 * 150, updatedAt: Date.now() - 86400000 * 4
  },
  {
    id: "8", foto: "", nama: "Buku Paket Matematika Kelas X", kode: "INV-008", kategori: "Buku",
    merek: "Erlangga", model: "-", nomorSeri: "-", tahunPembelian: "2023",
    tanggalMasuk: "2023-07-01", harga: 65000, jumlah: 60, satuan: "Buah",
    ruangan: "Perpustakaan", lokasiDetail: "Rak buku pelajaran", kondisi: "Baik", status: "Tersedia",
    penanggungJawab: "Rina Wulandari", deskripsi: "Buku paket kurikulum terbaru untuk siswa kelas X.",
    catatanKondisi: "Stok baru, kondisi sangat baik.", createdAt: Date.now() - 86400000 * 10, updatedAt: Date.now() - 86400000 * 10
  }
];

let inventoryData = [];      // seluruh data inventaris
let activityLog = [];        // log aktivitas terbaru
let currentEditId = null;    // id yang sedang diedit (null = mode tambah)
let pendingDeleteId = null;  // id yang menunggu konfirmasi hapus ("__ALL__" / "__BULK__" / id item)
let chartKondisiDash = null;
let chartKondisi = null;
let chartRuangan = null;

// --- State fitur tambahan ---
let sortField = null;          // kolom yang sedang diurutkan
let sortDirection = "asc";     // "asc" atau "desc"
let currentPage = 1;           // halaman tabel aktif
const ITEMS_PER_PAGE = 8;      // jumlah baris per halaman
let selectedIds = new Set();   // id item yang dicentang untuk aksi massal
const RUSAK_BERAT_THRESHOLD = 5; // ambang batas peringatan barang rusak berat
let currentQrItemId = null;    // item yang sedang ditampilkan QR-nya
let currentDetailId = null;    // item yang sedang dibuka di halaman detail
let currentPhotoDataUrl = "";  // foto yang sedang disiapkan di form (base64)
let scanStream = null;         // MediaStream kamera aktif untuk scan
let scanRafId = null;          // requestAnimationFrame id untuk loop scan
let lastDetailReturnPage = "inventaris"; // halaman sebelum membuka detail, untuk tombol kembali

/* ---------------------------------------------------------
   2. UTIL LOCALSTORAGE
--------------------------------------------------------- */
function defaultItemFields() {
  return {
    foto: "",
    kategori: "Lainnya",
    merek: "",
    model: "",
    nomorSeri: "",
    tahunPembelian: "",
    tanggalMasuk: "",
    harga: 0,
    satuan: "Unit",
    lokasiDetail: "",
    status: "Tersedia",
    penanggungJawab: "",
    deskripsi: "",
    catatanKondisi: "",
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

/* Memastikan setiap item memiliki seluruh field baru dengan nilai default,
   tanpa menghapus atau merusak data lama yang sudah ada. */
function normalizeItem(raw) {
  const defaults = defaultItemFields();
  const item = { ...defaults, ...raw };
  item.id = item.id || generateId();
  item.nama = item.nama || "";
  item.kode = item.kode || "";
  item.ruangan = item.ruangan || "";
  item.jumlah = Number(item.jumlah || 0);
  item.harga = Number(item.harga || 0);
  item.kondisi = KONDISI_LIST.includes(item.kondisi) ? item.kondisi : "Baik";
  item.status = STATUS_LIST.includes(item.status) ? item.status : "Tersedia";
  item.kategori = item.kategori || "Lainnya";
  item.satuan = item.satuan || "Unit";
  item.history = Array.isArray(item.history) ? item.history : [];
  return item;
}

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY_DATA);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error("format salah");
      inventoryData = parsed.map(normalizeItem);
    } catch (e) {
      inventoryData = [];
    }
  } else {
    // Belum ada data sama sekali -> isi dengan contoh data
    inventoryData = SAMPLE_DATA.map(item => normalizeItem({
      ...item,
      history: [{ type: "add", text: "Barang ditambahkan ke inventaris", time: Date.now() }]
    }));
    saveData();
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(inventoryData));
  } catch (e) {
    // localStorage penuh (mis. terlalu banyak foto beresolusi besar)
    showToast("⚠️ Penyimpanan penuh! Coba hapus beberapa foto/barang lama.", "error");
  }
}

function loadActivity() {
  const raw = localStorage.getItem(STORAGE_KEY_ACTIVITY);
  try {
    activityLog = raw ? JSON.parse(raw) : [];
  } catch (e) {
    activityLog = [];
  }
}

function saveActivity() {
  // simpan maksimal 50 aktivitas terbaru saja
  activityLog = activityLog.slice(0, 50);
  localStorage.setItem(STORAGE_KEY_ACTIVITY, JSON.stringify(activityLog));
}

function pushActivity(type, text) {
  activityLog.unshift({ type, text, time: Date.now() });
  saveActivity();
  renderActivity();
}

/* Menambahkan satu entri riwayat ke dalam item tertentu */
function pushItemHistory(item, type, text) {
  if (!item) return;
  if (!Array.isArray(item.history)) item.history = [];
  item.history.unshift({ type, text, time: Date.now() });
  item.history = item.history.slice(0, 20); // simpan maksimal 20 entri per item
}

/* ---------------------------------------------------------
   3. UTIL UMUM
--------------------------------------------------------- */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function formatNumber(n) {
  return Number(n || 0).toLocaleString("id-ID");
}

function formatCurrency(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function timeAgo(timestamp) {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return Math.floor(diff / 60) + " menit lalu";
  if (diff < 86400) return Math.floor(diff / 3600) + " jam lalu";
  return Math.floor(diff / 86400) + " hari lalu";
}

function badgeClassFor(kondisi) {
  switch (kondisi) {
    case "Baik": return "badge-baik";
    case "Rusak Ringan": return "badge-rr";
    case "Rusak Berat": return "badge-rb";
    case "Dalam Perbaikan": return "badge-perbaikan";
    case "Tidak Digunakan": return "badge-nonaktif";
    default: return "badge-baik";
  }
}

function statusBadgeClassFor(status) {
  switch (status) {
    case "Tersedia": return "status-tersedia";
    case "Sedang Digunakan": return "status-digunakan";
    case "Dipinjam": return "status-dipinjam";
    case "Dalam Perbaikan": return "status-perbaikan";
    case "Tidak Digunakan": return "status-nonaktif";
    default: return "status-tersedia";
  }
}

function kategoriIcon(kategori) {
  const found = KATEGORI_LIST.find(k => k.value === kategori);
  return found ? found.icon : "📦";
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

/* Placeholder foto barang berbentuk SVG inline (tidak butuh file eksternal) */
function photoPlaceholderSvg(icon) {
  const safeIcon = icon || "📦";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="20" fill="#E9EEF6"/><text x="50%" y="54%" font-size="72" text-anchor="middle" dominant-baseline="middle">${safeIcon}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function itemPhotoSrc(item) {
  if (item && item.foto) return item.foto;
  return photoPlaceholderSvg(kategoriIcon(item ? item.kategori : ""));
}

/* ---------------------------------------------------------
   4. TOAST NOTIFICATION
--------------------------------------------------------- */
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

/* ---------------------------------------------------------
   5. NAVIGASI HALAMAN (SPA sederhana)
--------------------------------------------------------- */
function goToPage(pageName) {
  // Hentikan kamera scan jika berpindah keluar dari halaman scan
  if (pageName !== "scan") stopScanCamera();

  document.querySelectorAll(".page").forEach(p => p.classList.remove("is-active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("is-active"));

  const targetPage = document.getElementById(`page-${pageName}`);
  const targetNav = document.querySelector(`.nav-item[data-page="${pageName}"]`);
  if (targetPage) targetPage.classList.add("is-active");
  if (targetNav) targetNav.classList.add("is-active");

  const badge = document.getElementById("page-badge");
  if (targetNav) badge.textContent = targetNav.querySelector("span").textContent;
  else if (pageName === "detail") badge.textContent = "Detail Barang";
  else if (pageName === "scan") badge.textContent = "Scan Barang";

  document.getElementById("content").scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  window.scrollTo(0, 0);

  closeMobileSidebar();

  if (pageName === "statistik") renderStatistikCharts();
  if (pageName === "dashboard") renderDashboardChart();
}

function initNavigation() {
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.page === "inventaris") lastDetailReturnPage = "inventaris";
      goToPage(btn.dataset.page);
    });
  });
}

/* ---------------------------------------------------------
   6. SIDEBAR MOBILE
--------------------------------------------------------- */
function openMobileSidebar() {
  document.getElementById("sidebar").classList.add("is-open");
  document.getElementById("sidebar-overlay").classList.add("is-open");
}
function closeMobileSidebar() {
  document.getElementById("sidebar").classList.remove("is-open");
  document.getElementById("sidebar-overlay").classList.remove("is-open");
}

/* ---------------------------------------------------------
   7. TEMA (DARK MODE)
--------------------------------------------------------- */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEY_THEME, theme);
  const label = document.getElementById("theme-toggle-label");
  if (label) label.textContent = theme === "dark" ? "Mode Terang" : "Mode Gelap";
  // Perbarui warna grafik agar kontras dengan tema baru
  renderDashboardChart();
  if (document.getElementById("page-statistik").classList.contains("is-active")) {
    renderStatistikCharts();
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  applyTheme(current === "dark" ? "light" : "dark");
}

function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY_THEME) || "light";
  applyTheme(saved);
}

/* ---------------------------------------------------------
   8. RENDER: STATISTIK DASHBOARD
--------------------------------------------------------- */
function countByKondisi(kondisi) {
  return inventoryData.filter(i => i.kondisi === kondisi).reduce((sum, i) => sum + Number(i.jumlah || 0), 0);
}

function computeStats() {
  const total = inventoryData.reduce((sum, i) => sum + Number(i.jumlah || 0), 0);
  return {
    total,
    baik: countByKondisi("Baik"),
    rr: countByKondisi("Rusak Ringan"),
    rb: countByKondisi("Rusak Berat"),
    perbaikan: countByKondisi("Dalam Perbaikan"),
    nonaktif: countByKondisi("Tidak Digunakan")
  };
}

function renderStats() {
  const { total, baik, rr, rb, perbaikan } = computeStats();
  document.getElementById("stat-total").textContent = formatNumber(total);
  document.getElementById("stat-baik").textContent = formatNumber(baik);
  document.getElementById("stat-rr").textContent = formatNumber(rr);
  document.getElementById("stat-rb").textContent = formatNumber(rb);
  const statPerbaikanEl = document.getElementById("stat-perbaikan");
  if (statPerbaikanEl) statPerbaikanEl.textContent = formatNumber(perbaikan);
  const statJenisDashEl = document.getElementById("stat-jenis-dash");
  if (statJenisDashEl) statJenisDashEl.textContent = formatNumber(inventoryData.length);

  // Statistik halaman ke-2
  document.getElementById("stat-total-2").textContent = formatNumber(total);
  document.getElementById("stat-jenis").textContent = formatNumber(inventoryData.length);
  const ruanganUnik = new Set(inventoryData.map(i => i.ruangan)).size;
  document.getElementById("stat-ruangan").textContent = formatNumber(ruanganUnik);

  renderAlertBanner(rb);
  renderBarangTerbaru();
  renderPerluPerhatian();
}

function renderAlertBanner(jumlahRusakBerat) {
  const banner = document.getElementById("alert-banner");
  const text = document.getElementById("alert-banner-text");
  if (jumlahRusakBerat >= RUSAK_BERAT_THRESHOLD) {
    text.textContent = `Perhatian! Ada ${formatNumber(jumlahRusakBerat)} unit barang dalam kondisi rusak berat. Segera tindak lanjuti perbaikan atau penggantian.`;
    banner.hidden = false;
  } else {
    banner.hidden = true;
  }
}

/* Kartu "Barang Terbaru" di dashboard */
function renderBarangTerbaru() {
  const wrap = document.getElementById("barang-terbaru-list");
  if (!wrap) return;
  const terbaru = inventoryData.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 4);

  if (!terbaru.length) {
    wrap.innerHTML = `<p class="mini-empty">Belum ada barang yang ditambahkan.</p>`;
    return;
  }

  wrap.innerHTML = terbaru.map(item => `
    <button class="mini-item-card" data-id="${item.id}">
      <img class="mini-item-photo" src="${itemPhotoSrc(item)}" alt="${escapeHtml(item.nama)}">
      <div class="mini-item-body">
        <span class="mini-item-name">${escapeHtml(item.nama)}</span>
        <span class="mini-item-meta">${escapeHtml(item.kode)} · ${escapeHtml(item.ruangan)}</span>
        <span class="badge ${badgeClassFor(item.kondisi)} badge-sm"><span class="badge-dot"></span>${escapeHtml(item.kondisi)}</span>
      </div>
    </button>
  `).join("");

  wrap.querySelectorAll(".mini-item-card").forEach(btn =>
    btn.addEventListener("click", () => openDetailPage(btn.dataset.id, "dashboard"))
  );
}

/* Section "Barang Perlu Perhatian" di dashboard */
function renderPerluPerhatian() {
  const wrap = document.getElementById("perlu-perhatian-list");
  const section = document.getElementById("perlu-perhatian-section");
  if (!wrap || !section) return;

  const perluPerhatian = inventoryData.filter(i =>
    i.kondisi === "Rusak Ringan" || i.kondisi === "Rusak Berat" || i.kondisi === "Dalam Perbaikan"
  ).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

  if (!perluPerhatian.length) {
    section.hidden = true;
    return;
  }
  section.hidden = false;

  wrap.innerHTML = perluPerhatian.slice(0, 6).map(item => `
    <button class="attention-card ${badgeClassFor(item.kondisi)}" data-id="${item.id}">
      <img class="attention-photo" src="${itemPhotoSrc(item)}" alt="${escapeHtml(item.nama)}">
      <div class="attention-body">
        <span class="attention-name">${escapeHtml(item.nama)}</span>
        <span class="attention-meta">${escapeHtml(item.kode)} · ${escapeHtml(item.ruangan)}</span>
      </div>
      <span class="badge ${badgeClassFor(item.kondisi)} badge-sm"><span class="badge-dot"></span>${escapeHtml(item.kondisi)}</span>
    </button>
  `).join("");

  wrap.querySelectorAll(".attention-card").forEach(btn =>
    btn.addEventListener("click", () => openDetailPage(btn.dataset.id, "dashboard"))
  );
}

/* ---------------------------------------------------------
   9. RENDER: AKTIVITAS TERBARU
--------------------------------------------------------- */
function renderActivityListInto(elementId, items) {
  const list = document.getElementById(elementId);
  if (!items.length) {
    list.innerHTML = `<li class="activity-empty">Belum ada aktivitas. Mulai tambahkan inventaris!</li>`;
    return;
  }
  list.innerHTML = items.map(a => `
    <li class="activity-item">
      <span class="activity-dot ${a.type}"></span>
      <span class="activity-text">${a.text}</span>
      <span class="activity-time">${timeAgo(a.time)}</span>
    </li>
  `).join("");
}

function renderActivity() {
  renderActivityListInto("activity-list", activityLog.slice(0, 8));
}

function renderActivityFull() {
  renderActivityListInto("activity-list-full", activityLog);
}

function openActivityModal() {
  renderActivityFull();
  document.getElementById("activity-modal-overlay").classList.add("is-open");
}
function closeActivityModal() {
  document.getElementById("activity-modal-overlay").classList.remove("is-open");
}

/* ---------------------------------------------------------
   10. RENDER: FILTER DINAMIS (ruangan & kategori dari data)
--------------------------------------------------------- */
function renderRuanganFilterOptions() {
  const select = document.getElementById("filter-ruangan");
  const currentValue = select.value;
  const ruanganList = Array.from(new Set(inventoryData.map(i => i.ruangan))).filter(Boolean).sort();

  select.innerHTML = `<option value="all">Semua Ruangan</option>` +
    ruanganList.map(r => `<option value="${escapeHtml(r)}">${escapeHtml(r)}</option>`).join("");

  if (ruanganList.includes(currentValue)) select.value = currentValue;

  // Datalist ruangan pada form tambah/edit — gabungkan default + ruangan yang sudah ada
  const datalist = document.getElementById("ruangan-list");
  if (datalist) {
    const defaults = ["Lab Komputer", "Ruang Kelas", "Perpustakaan", "Ruang Guru"];
    const combined = Array.from(new Set([...defaults, ...ruanganList]));
    datalist.innerHTML = combined.map(r => `<option value="${escapeHtml(r)}">`).join("");
  }
}

/* ---------------------------------------------------------
   11. RENDER: TABEL INVENTARIS (+ pencarian & filter)
--------------------------------------------------------- */
function getFilteredData() {
  const keyword = (document.getElementById("search-input").value || "").trim().toLowerCase();
  const ruangan = document.getElementById("filter-ruangan").value;
  const kondisi = document.getElementById("filter-kondisi").value;
  const kategoriEl = document.getElementById("filter-kategori");
  const statusEl = document.getElementById("filter-status");
  const kategori = kategoriEl ? kategoriEl.value : "all";
  const status = statusEl ? statusEl.value : "all";

  let result = inventoryData.filter(item => {
    const matchKeyword =
      !keyword ||
      (item.nama || "").toLowerCase().includes(keyword) ||
      (item.kode || "").toLowerCase().includes(keyword) ||
      (item.kategori || "").toLowerCase().includes(keyword) ||
      (item.merek || "").toLowerCase().includes(keyword) ||
      (item.nomorSeri || "").toLowerCase().includes(keyword) ||
      (item.ruangan || "").toLowerCase().includes(keyword);
    const matchRuangan = ruangan === "all" || item.ruangan === ruangan;
    const matchKondisi = kondisi === "all" || item.kondisi === kondisi;
    const matchKategori = kategori === "all" || item.kategori === kategori;
    const matchStatus = status === "all" || item.status === status;
    return matchKeyword && matchRuangan && matchKondisi && matchKategori && matchStatus;
  });

  if (sortField) {
    result = result.slice().sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  return result;
}

function initSortableHeaders() {
  document.querySelectorAll(".data-table thead th.sortable").forEach(th => {
    th.addEventListener("click", () => {
      const field = th.dataset.sort;
      if (sortField === field) {
        sortDirection = sortDirection === "asc" ? "desc" : "asc";
      } else {
        sortField = field;
        sortDirection = "asc";
      }
      document.querySelectorAll(".data-table thead th.sortable").forEach(h => h.classList.remove("sort-asc", "sort-desc"));
      th.classList.add(sortDirection === "asc" ? "sort-asc" : "sort-desc");
      currentPage = 1;
      renderTable();
    });
  });
}

function renderTable() {
  const tbody = document.getElementById("table-body");
  const emptyState = document.getElementById("empty-state");
  const noResultState = document.getElementById("no-result-state");
  const paginationBar = document.getElementById("pagination-bar");
  const filtered = getFilteredData();

  if (inventoryData.length === 0) {
    tbody.innerHTML = "";
    emptyState.hidden = false;
    noResultState.hidden = true;
    paginationBar.hidden = true;
    updateBulkBar();
    return;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = "";
    emptyState.hidden = true;
    noResultState.hidden = false;
    paginationBar.hidden = true;
    updateBulkBar();
    return;
  }

  emptyState.hidden = true;
  noResultState.hidden = true;

  // --- Pagination ---
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  if (currentPage > totalPages) currentPage = totalPages;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  tbody.innerHTML = pageItems.map((item) => `
    <tr>
      <td class="col-check" data-label=""><input type="checkbox" class="row-checkbox" data-id="${item.id}" ${selectedIds.has(item.id) ? "checked" : ""}></td>
      <td class="col-foto" data-label="Foto">
        <img class="table-thumb" src="${itemPhotoSrc(item)}" alt="${escapeHtml(item.nama)}" data-id="${item.id}">
      </td>
      <td class="item-name item-name-clickable" data-label="Nama Barang" data-id="${item.id}">${escapeHtml(item.nama)}</td>
      <td class="item-code" data-label="Kode">${escapeHtml(item.kode)}</td>
      <td data-label="Kategori"><span class="kategori-chip">${kategoriIcon(item.kategori)} ${escapeHtml(item.kategori)}</span></td>
      <td data-label="Lokasi">${escapeHtml(item.ruangan)}</td>
      <td data-label="Jumlah">${formatNumber(item.jumlah)} ${escapeHtml(item.satuan || "")}</td>
      <td data-label="Kondisi">
        <span class="badge ${badgeClassFor(item.kondisi)}">
          <span class="badge-dot"></span>${escapeHtml(item.kondisi)}
        </span>
      </td>
      <td data-label="Status">
        <span class="status-pill ${statusBadgeClassFor(item.status)}">${escapeHtml(item.status)}</span>
      </td>
      <td data-label="Aksi">
        <div class="action-cell">
          <button class="action-btn detail-btn" data-id="${item.id}" aria-label="Detail ${escapeHtml(item.nama)}" title="Detail Lengkap">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          </button>
          <button class="action-btn qr-btn" data-id="${item.id}" aria-label="QR ${escapeHtml(item.nama)}" title="QR Code">
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3M14 20h3M20 14v3M20 20v.01"/></svg>
          </button>
          <button class="action-btn edit-btn" data-id="${item.id}" aria-label="Edit ${escapeHtml(item.nama)}" title="Edit">
            <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
          <button class="action-btn delete-btn" data-id="${item.id}" aria-label="Hapus ${escapeHtml(item.nama)}" title="Hapus">
            <svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join("");

  // Pasang event listener aksi
  tbody.querySelectorAll(".edit-btn").forEach(btn =>
    btn.addEventListener("click", () => openEditModal(btn.dataset.id))
  );
  tbody.querySelectorAll(".delete-btn").forEach(btn =>
    btn.addEventListener("click", () => openDeleteModal(btn.dataset.id))
  );
  tbody.querySelectorAll(".detail-btn").forEach(btn =>
    btn.addEventListener("click", () => openDetailPage(btn.dataset.id, "inventaris"))
  );
  tbody.querySelectorAll(".qr-btn").forEach(btn =>
    btn.addEventListener("click", () => openQrModal(btn.dataset.id))
  );
  tbody.querySelectorAll(".item-name-clickable").forEach(el =>
    el.addEventListener("click", () => openDetailPage(el.dataset.id, "inventaris"))
  );
  tbody.querySelectorAll(".table-thumb").forEach(el =>
    el.addEventListener("click", () => openDetailPage(el.dataset.id, "inventaris"))
  );
  tbody.querySelectorAll(".row-checkbox").forEach(cb =>
    cb.addEventListener("change", () => {
      if (cb.checked) selectedIds.add(cb.dataset.id);
      else selectedIds.delete(cb.dataset.id);
      updateBulkBar();
      updateSelectAllCheckbox(filtered);
    })
  );

  // --- Render kontrol pagination ---
  if (totalPages > 1) {
    paginationBar.hidden = false;
    document.getElementById("pagination-info").textContent =
      `Menampilkan ${startIndex + 1}-${Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} dari ${filtered.length} barang`;
    document.getElementById("pagination-current").textContent = `${currentPage} / ${totalPages}`;
    document.getElementById("btn-prev-page").disabled = currentPage === 1;
    document.getElementById("btn-next-page").disabled = currentPage === totalPages;
  } else {
    paginationBar.hidden = true;
  }

  updateSelectAllCheckbox(filtered);
  updateBulkBar();
}

function updateSelectAllCheckbox(filtered) {
  const selectAll = document.getElementById("select-all-checkbox");
  const idsOnPage = Array.from(document.querySelectorAll(".row-checkbox")).map(cb => cb.dataset.id);
  const allChecked = idsOnPage.length > 0 && idsOnPage.every(id => selectedIds.has(id));
  selectAll.checked = allChecked;
}

function updateBulkBar() {
  const bar = document.getElementById("bulk-bar");
  const countText = document.getElementById("bulk-count-text");
  if (selectedIds.size > 0) {
    bar.hidden = false;
    countText.textContent = `${selectedIds.size} item dipilih`;
  } else {
    bar.hidden = true;
  }
}

function initPaginationControls() {
  document.getElementById("btn-prev-page").addEventListener("click", () => {
    if (currentPage > 1) { currentPage--; renderTable(); }
  });
  document.getElementById("btn-next-page").addEventListener("click", () => {
    currentPage++; renderTable();
  });
}

function initBulkSelection() {
  document.getElementById("select-all-checkbox").addEventListener("change", (e) => {
    const filtered = getFilteredData();
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    if (e.target.checked) pageItems.forEach(item => selectedIds.add(item.id));
    else pageItems.forEach(item => selectedIds.delete(item.id));
    renderTable();
  });

  document.getElementById("btn-bulk-cancel").addEventListener("click", () => {
    selectedIds.clear();
    renderTable();
  });

  document.getElementById("btn-bulk-delete").addEventListener("click", () => {
    pendingDeleteId = "__BULK__";
    document.getElementById("delete-item-name").textContent = `${selectedIds.size} item terpilih`;
    document.getElementById("delete-modal-overlay").classList.add("is-open");
  });
}

/* ---------------------------------------------------------
   12. RENDER SEMUA (dipanggil setiap kali data berubah)
--------------------------------------------------------- */
function renderAll() {
  saveData();
  renderStats();
  renderRuanganFilterOptions();
  renderTable();
  renderDashboardChart();
  if (document.getElementById("page-statistik").classList.contains("is-active")) {
    renderStatistikCharts();
  }
  if (currentDetailId && document.getElementById("page-detail").classList.contains("is-active")) {
    renderDetailPage(currentDetailId);
  }
}

/* ---------------------------------------------------------
   13. PENCARIAN & FILTER — EVENT
--------------------------------------------------------- */
function resetPageAndRenderTable() {
  currentPage = 1;
  renderTable();
}

function initSearchAndFilter() {
  document.getElementById("search-input").addEventListener("input", resetPageAndRenderTable);
  document.getElementById("filter-ruangan").addEventListener("change", resetPageAndRenderTable);
  document.getElementById("filter-kondisi").addEventListener("change", resetPageAndRenderTable);
  const filterKategori = document.getElementById("filter-kategori");
  const filterStatus = document.getElementById("filter-status");
  if (filterKategori) filterKategori.addEventListener("change", resetPageAndRenderTable);
  if (filterStatus) filterStatus.addEventListener("change", resetPageAndRenderTable);

  document.getElementById("btn-reset-filter").addEventListener("click", () => {
    document.getElementById("search-input").value = "";
    document.getElementById("filter-ruangan").value = "all";
    document.getElementById("filter-kondisi").value = "all";
    if (filterKategori) filterKategori.value = "all";
    if (filterStatus) filterStatus.value = "all";
    resetPageAndRenderTable();
  });

  // Search bar di topbar -> ikut mengisi search halaman inventaris & pindah halaman
  document.getElementById("topbar-search-input").addEventListener("input", (e) => {
    const val = e.target.value;
    document.getElementById("search-input").value = val;
    if (val.trim() !== "") goToPage("inventaris");
    resetPageAndRenderTable();
  });
}

function populateStaticSelectOptions() {
  // Kategori (form + filter)
  const kategoriTargets = document.querySelectorAll(".kategori-options");
  kategoriTargets.forEach(select => {
    const isFilter = select.dataset.filter === "true";
    select.innerHTML = (isFilter ? `<option value="all">Semua Kategori</option>` : "") +
      KATEGORI_LIST.map(k => `<option value="${k.value}">${k.icon} ${k.value}</option>`).join("");
  });
  // Kondisi (form + filter)
  document.querySelectorAll(".kondisi-options").forEach(select => {
    const isFilter = select.dataset.filter === "true";
    select.innerHTML = (isFilter ? `<option value="all">Semua Kondisi</option>` : "") +
      KONDISI_LIST.map(k => `<option value="${k}">${k}</option>`).join("");
  });
  // Status (form + filter)
  document.querySelectorAll(".status-options").forEach(select => {
    const isFilter = select.dataset.filter === "true";
    select.innerHTML = (isFilter ? `<option value="all">Semua Status</option>` : "") +
      STATUS_LIST.map(s => `<option value="${s}">${s}</option>`).join("");
  });
  // Satuan (form saja)
  document.querySelectorAll(".satuan-options").forEach(select => {
    select.innerHTML = SATUAN_LIST.map(s => `<option value="${s}">${s}</option>`).join("");
  });
}

/* ---------------------------------------------------------
   14. FITUR FOTO (upload, preview, kompresi)
--------------------------------------------------------- */
function compressImageFile(file, maxDim = 720, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      reject(new Error("Format tidak didukung"));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round(height * (maxDim / width));
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round(width * (maxDim / height));
          height = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Gagal memuat gambar"));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.readAsDataURL(file);
  });
}

function setPhotoPreview(dataUrl) {
  currentPhotoDataUrl = dataUrl || "";
  const previewImg = document.getElementById("photo-preview-img");
  const dropZone = document.getElementById("photo-drop-zone");
  const previewWrap = document.getElementById("photo-preview-wrap");
  if (currentPhotoDataUrl) {
    previewImg.src = currentPhotoDataUrl;
    dropZone.hidden = true;
    previewWrap.hidden = false;
  } else {
    previewImg.src = "";
    dropZone.hidden = false;
    previewWrap.hidden = true;
  }
}

async function handlePhotoFile(file) {
  if (!file) return;
  try {
    const compressed = await compressImageFile(file);
    setPhotoPreview(compressed);
  } catch (err) {
    showToast("⚠️ Gagal memproses foto. Gunakan format JPG, PNG, atau WEBP.", "error");
  }
}

function initPhotoUpload() {
  const dropZone = document.getElementById("photo-drop-zone");
  const fileInput = document.getElementById("photo-file-input");
  const btnChoose = document.getElementById("btn-choose-photo");
  const btnChange = document.getElementById("btn-change-photo");
  const btnRemove = document.getElementById("btn-remove-photo");

  btnChoose.addEventListener("click", () => fileInput.click());
  btnChange.addEventListener("click", () => fileInput.click());
  btnRemove.addEventListener("click", () => setPhotoPreview(""));

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) handlePhotoFile(file);
    e.target.value = "";
  });

  dropZone.addEventListener("click", () => fileInput.click());

  ["dragenter", "dragover"].forEach(evt => {
    dropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add("is-dragover");
    });
  });
  ["dragleave", "drop"].forEach(evt => {
    dropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove("is-dragover");
    });
  });
  dropZone.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files[0];
    if (file) handlePhotoFile(file);
  });
}

/* ---------------------------------------------------------
   15. MODAL TAMBAH / EDIT
--------------------------------------------------------- */
function openAddModal() {
  currentEditId = null;
  document.getElementById("form-modal-title").textContent = "Tambah Inventaris";
  document.getElementById("btn-submit-form").textContent = "💾 Simpan Inventaris";
  document.getElementById("inventory-form").reset();
  document.getElementById("form-id").value = "";
  document.getElementById("form-kategori").value = "Elektronik";
  document.getElementById("form-satuan").value = "Unit";
  document.getElementById("form-kondisi").value = "Baik";
  document.getElementById("form-status").value = "Tersedia";
  setPhotoPreview("");
  clearFormErrors();
  document.getElementById("form-modal-overlay").classList.add("is-open");
  setTimeout(() => document.getElementById("form-nama").focus(), 200);
}

function openEditModal(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;
  currentEditId = id;
  document.getElementById("form-modal-title").textContent = "Edit Inventaris";
  document.getElementById("btn-submit-form").textContent = "💾 Simpan Perubahan";
  document.getElementById("form-id").value = item.id;
  document.getElementById("form-nama").value = item.nama;
  document.getElementById("form-kode").value = item.kode;
  document.getElementById("form-kategori").value = item.kategori || "Lainnya";
  document.getElementById("form-merek").value = item.merek || "";
  document.getElementById("form-model").value = item.model || "";
  document.getElementById("form-nomor-seri").value = item.nomorSeri || "";
  document.getElementById("form-tahun").value = item.tahunPembelian || "";
  document.getElementById("form-tanggal-masuk").value = item.tanggalMasuk || "";
  document.getElementById("form-harga").value = item.harga || 0;
  document.getElementById("form-jumlah").value = item.jumlah;
  document.getElementById("form-satuan").value = item.satuan || "Unit";
  document.getElementById("form-ruangan").value = item.ruangan;
  document.getElementById("form-lokasi-detail").value = item.lokasiDetail || "";
  document.getElementById("form-kondisi").value = item.kondisi;
  document.getElementById("form-status").value = item.status || "Tersedia";
  document.getElementById("form-penanggung-jawab").value = item.penanggungJawab || "";
  document.getElementById("form-deskripsi").value = item.deskripsi || "";
  document.getElementById("form-catatan-kondisi").value = item.catatanKondisi || "";
  setPhotoPreview(item.foto || "");
  clearFormErrors();
  document.getElementById("form-modal-overlay").classList.add("is-open");
}

function closeFormModal() {
  document.getElementById("form-modal-overlay").classList.remove("is-open");
  currentEditId = null;
}

function clearFormErrors() {
  ["nama", "kode", "ruangan", "jumlah"].forEach(field => {
    const errEl = document.getElementById(`err-${field}`);
    const inputEl = document.getElementById(`form-${field}`);
    if (errEl) errEl.textContent = "";
    if (inputEl) inputEl.classList.remove("has-error");
  });
}

function setFieldError(field, message) {
  const errEl = document.getElementById(`err-${field}`);
  const inputEl = document.getElementById(`form-${field}`);
  if (errEl) errEl.textContent = message;
  if (inputEl) inputEl.classList.add("has-error");
}

function validateForm(nama, kode, ruangan, jumlah) {
  clearFormErrors();
  let valid = true;

  if (!nama) { setFieldError("nama", "⚠️ Mohon lengkapi semua data terlebih dahulu!"); valid = false; }
  if (!kode) { setFieldError("kode", "⚠️ Mohon lengkapi semua data terlebih dahulu!"); valid = false; }
  if (!ruangan) { setFieldError("ruangan", "⚠️ Mohon lengkapi semua data terlebih dahulu!"); valid = false; }

  if (valid) {
    const duplicateKode = inventoryData.find(
      i => i.kode.toLowerCase() === kode.toLowerCase() && i.id !== currentEditId
    );
    if (duplicateKode) {
      setFieldError("kode", "⚠️ Kode inventaris sudah terdaftar!");
      valid = false;
    }
  }

  if (!jumlah || Number(jumlah) < 1) {
    setFieldError("jumlah", "⚠️ Jumlah barang minimal 1!");
    valid = false;
  }

  return valid;
}

function initFormModal() {
  document.getElementById("btn-open-add").addEventListener("click", openAddModal);
  document.getElementById("form-modal-close").addEventListener("click", closeFormModal);
  document.getElementById("btn-cancel-form").addEventListener("click", closeFormModal);
  document.getElementById("form-modal-overlay").addEventListener("click", (e) => {
    if (e.target.id === "form-modal-overlay") closeFormModal();
  });

  document.getElementById("inventory-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = document.getElementById("form-nama").value.trim();
    const kode = document.getElementById("form-kode").value.trim();
    const ruangan = document.getElementById("form-ruangan").value.trim();
    const jumlah = document.getElementById("form-jumlah").value;
    const kondisi = document.getElementById("form-kondisi").value;
    const status = document.getElementById("form-status").value;
    const kategori = document.getElementById("form-kategori").value;
    const merek = document.getElementById("form-merek").value.trim();
    const model = document.getElementById("form-model").value.trim();
    const nomorSeri = document.getElementById("form-nomor-seri").value.trim();
    const tahunPembelian = document.getElementById("form-tahun").value.trim();
    const tanggalMasuk = document.getElementById("form-tanggal-masuk").value;
    const harga = Number(document.getElementById("form-harga").value || 0);
    const satuan = document.getElementById("form-satuan").value;
    const lokasiDetail = document.getElementById("form-lokasi-detail").value.trim();
    const penanggungJawab = document.getElementById("form-penanggung-jawab").value.trim();
    const deskripsi = document.getElementById("form-deskripsi").value.trim();
    const catatanKondisi = document.getElementById("form-catatan-kondisi").value.trim();
    const foto = currentPhotoDataUrl;

    if (!validateForm(nama, kode, ruangan, jumlah)) {
      showToast("Terjadi kesalahan. Silakan periksa kembali data Anda!", "error");
      return;
    }

    if (currentEditId) {
      // Mode edit
      const item = inventoryData.find(i => i.id === currentEditId);
      const perubahan = [];
      if (item.nama !== nama) perubahan.push(`nama: "${item.nama}" → "${nama}"`);
      if (item.kode !== kode) perubahan.push(`kode: "${item.kode}" → "${kode}"`);
      if (item.ruangan !== ruangan) perubahan.push(`ruangan: "${item.ruangan}" → "${ruangan}"`);
      if (Number(item.jumlah) !== Number(jumlah)) perubahan.push(`jumlah: ${item.jumlah} → ${jumlah}`);
      if (item.kondisi !== kondisi) perubahan.push(`kondisi: "${item.kondisi}" → "${kondisi}"`);
      if (item.status !== status) perubahan.push(`status: "${item.status}" → "${status}"`);
      if ((item.foto || "") !== (foto || "")) perubahan.push("foto diperbarui");

      item.nama = nama;
      item.kode = kode;
      item.kategori = kategori;
      item.merek = merek;
      item.model = model;
      item.nomorSeri = nomorSeri;
      item.tahunPembelian = tahunPembelian;
      item.tanggalMasuk = tanggalMasuk;
      item.harga = harga;
      item.jumlah = Number(jumlah);
      item.satuan = satuan;
      item.ruangan = ruangan;
      item.lokasiDetail = lokasiDetail;
      item.kondisi = kondisi;
      item.status = status;
      item.penanggungJawab = penanggungJawab;
      item.deskripsi = deskripsi;
      item.catatanKondisi = catatanKondisi;
      item.foto = foto;
      item.updatedAt = Date.now();

      pushItemHistory(item, "edit", perubahan.length ? `Diubah (${escapeHtml(perubahan.join(", "))})` : "Diperbarui");
      pushActivity("edit", `Mengubah data <b>${escapeHtml(nama)}</b>`);
      showToast("✏️ Data inventaris berhasil diperbarui!", "success");
    } else {
      // Mode tambah
      const newItem = {
        id: generateId(),
        foto, nama, kode, kategori, merek, model, nomorSeri, tahunPembelian, tanggalMasuk,
        harga, jumlah: Number(jumlah), satuan, ruangan, lokasiDetail, kondisi, status,
        penanggungJawab, deskripsi, catatanKondisi,
        createdAt: Date.now(), updatedAt: Date.now(),
        history: []
      };
      pushItemHistory(newItem, "add", "Barang ditambahkan ke inventaris");
      inventoryData.unshift(newItem);
      pushActivity("add", `Menambahkan <b>${escapeHtml(nama)}</b>`);
      showToast("✅ Data berhasil ditambahkan!", "success");
    }

    renderAll();
    closeFormModal();
  });
}

/* ---------------------------------------------------------
   16. MODAL KONFIRMASI HAPUS
--------------------------------------------------------- */
function openDeleteModal(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;
  pendingDeleteId = id;
  document.getElementById("delete-item-name").textContent = item.nama;
  document.getElementById("delete-modal-overlay").classList.add("is-open");
}

function closeDeleteModal() {
  document.getElementById("delete-modal-overlay").classList.remove("is-open");
  pendingDeleteId = null;
}

function initDeleteModal() {
  document.getElementById("btn-cancel-delete").addEventListener("click", closeDeleteModal);
  document.getElementById("delete-modal-overlay").addEventListener("click", (e) => {
    if (e.target.id === "delete-modal-overlay") closeDeleteModal();
  });

  document.getElementById("btn-confirm-delete").addEventListener("click", () => {
    if (!pendingDeleteId) return;
    if (pendingDeleteId === "__ALL__" || pendingDeleteId === "__BULK__") return; // ditangani handler lain
    const item = inventoryData.find(i => i.id === pendingDeleteId);
    inventoryData = inventoryData.filter(i => i.id !== pendingDeleteId);
    selectedIds.delete(pendingDeleteId);
    if (item) pushActivity("delete", `Menghapus <b>${escapeHtml(item.nama)}</b>`);
    if (currentDetailId === pendingDeleteId) {
      currentDetailId = null;
      goToPage(lastDetailReturnPage);
    }
    renderAll();
    showToast("🗑️ Data inventaris berhasil dihapus!", "success");
    closeDeleteModal();
  });
}

/* ---------------------------------------------------------
   17. GRAFIK (Chart.js)
--------------------------------------------------------- */
function getChartTextColor() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  return isDark ? "#93A2BC" : "#64748B";
}
function getChartGridColor() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  return isDark ? "rgba(255,255,255,.06)" : "rgba(15,23,42,.06)";
}

function renderDashboardChart() {
  const canvas = document.getElementById("chart-kondisi-dash");
  if (!canvas || typeof Chart === "undefined") return;
  const { baik, rr, rb, perbaikan, nonaktif } = computeStats();

  if (chartKondisiDash) chartKondisiDash.destroy();
  chartKondisiDash = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: ["Baik", "Rusak Ringan", "Rusak Berat", "Dalam Perbaikan", "Tidak Digunakan"],
      datasets: [{
        data: [baik, rr, rb, perbaikan, nonaktif],
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444", "#6366F1", "#94A3B8"],
        borderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: getChartTextColor(), boxWidth: 10, padding: 14, font: { size: 11.5 } }
        }
      }
    }
  });
}

function renderStatistikCharts() {
  if (typeof Chart === "undefined") return;
  const { baik, rr, rb, perbaikan, nonaktif } = computeStats();

  // Chart 1: Kondisi barang (bar)
  const canvasKondisi = document.getElementById("chart-kondisi");
  if (chartKondisi) chartKondisi.destroy();
  chartKondisi = new Chart(canvasKondisi, {
    type: "bar",
    data: {
      labels: ["Baik", "Rusak Ringan", "Rusak Berat", "Perbaikan", "Nonaktif"],
      datasets: [{
        label: "Jumlah Barang",
        data: [baik, rr, rb, perbaikan, nonaktif],
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444", "#6366F1", "#94A3B8"],
        borderRadius: 8,
        maxBarThickness: 56
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: getChartTextColor() } },
        y: { beginAtZero: true, grid: { color: getChartGridColor() }, ticks: { color: getChartTextColor(), precision: 0 } }
      }
    }
  });

  // Chart 2: Barang per ruangan (horizontal bar)
  const ruanganMap = {};
  inventoryData.forEach(item => {
    ruanganMap[item.ruangan] = (ruanganMap[item.ruangan] || 0) + Number(item.jumlah || 0);
  });
  const ruanganLabels = Object.keys(ruanganMap);
  const ruanganValues = Object.values(ruanganMap);

  const canvasRuangan = document.getElementById("chart-ruangan");
  if (chartRuangan) chartRuangan.destroy();
  chartRuangan = new Chart(canvasRuangan, {
    type: "bar",
    data: {
      labels: ruanganLabels.length ? ruanganLabels : ["Belum ada data"],
      datasets: [{
        label: "Jumlah Barang",
        data: ruanganValues.length ? ruanganValues : [0],
        backgroundColor: "#3B82F6",
        borderRadius: 8,
        maxBarThickness: 32
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, grid: { color: getChartGridColor() }, ticks: { color: getChartTextColor(), precision: 0 } },
        y: { grid: { display: false }, ticks: { color: getChartTextColor() } }
      }
    }
  });
}

/* ---------------------------------------------------------
   18. HALAMAN DETAIL BARANG (halaman penuh, bukan modal)
--------------------------------------------------------- */
function detailInfoRow(label, value) {
  return `<div class="detail-row"><span class="detail-row-label">${escapeHtml(label)}</span><span class="detail-row-value">${value}</span></div>`;
}

function openDetailPage(id, fromPage) {
  if (fromPage) lastDetailReturnPage = fromPage;
  currentDetailId = id;
  renderDetailPage(id);
  goToPage("detail");
}

function renderDetailPage(id) {
  const item = inventoryData.find(i => i.id === id);
  const container = document.getElementById("page-detail");
  if (!item) {
    container.innerHTML = `
      <div class="page-head"><div><h1>Barang Tidak Ditemukan</h1></div></div>
      <div class="panel empty-state">
        <div class="empty-emoji">❓</div>
        <p class="empty-title">Data barang tidak ditemukan atau sudah dihapus.</p>
        <button class="btn btn-primary" id="btn-detail-back-missing" style="margin-top:14px;">Kembali</button>
      </div>`;
    document.getElementById("btn-detail-back-missing").addEventListener("click", () => goToPage(lastDetailReturnPage));
    return;
  }

  container.innerHTML = `
    <div class="page-head">
      <button class="back-link" id="btn-detail-back">
        <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg> Kembali
      </button>
    </div>

    <div class="detail-header-card">
      <img class="detail-header-photo" src="${itemPhotoSrc(item)}" alt="${escapeHtml(item.nama)}">
      <div class="detail-header-info">
        <span class="kategori-chip">${kategoriIcon(item.kategori)} ${escapeHtml(item.kategori)}</span>
        <h1>${escapeHtml(item.nama)}</h1>
        <p class="detail-header-code">Kode: ${escapeHtml(item.kode)}</p>
        <div class="detail-header-badges">
          <span class="badge ${badgeClassFor(item.kondisi)}"><span class="badge-dot"></span>Kondisi: ${escapeHtml(item.kondisi)}</span>
          <span class="status-pill ${statusBadgeClassFor(item.status)}">Status: ${escapeHtml(item.status)}</span>
        </div>
        <div class="detail-header-actions">
          <button class="btn btn-primary btn-sm" id="btn-detail-edit">✏️ Edit Barang</button>
          <button class="btn btn-secondary btn-sm" id="btn-detail-qr">🔳 Cetak QR</button>
          <button class="btn btn-secondary btn-sm" id="btn-detail-download-qr">⬇️ Download QR</button>
          <button class="btn btn-ghost btn-sm" id="btn-detail-scan">📷 Scan Barang</button>
          <button class="btn btn-danger btn-sm" id="btn-detail-delete">🗑️ Hapus Barang</button>
        </div>
      </div>
    </div>

    <div class="detail-grid">
      <div class="panel detail-section">
        <h2 class="detail-section-title">Informasi Umum</h2>
        ${detailInfoRow("Nama", escapeHtml(item.nama))}
        ${detailInfoRow("Kode Inventaris", escapeHtml(item.kode))}
        ${detailInfoRow("Kategori", `${kategoriIcon(item.kategori)} ${escapeHtml(item.kategori)}`)}
        ${detailInfoRow("Jumlah", `${formatNumber(item.jumlah)} ${escapeHtml(item.satuan || "")}`)}
      </div>

      <div class="panel detail-section">
        <h2 class="detail-section-title">Informasi Produk</h2>
        ${detailInfoRow("Merek", escapeHtml(item.merek) || "-")}
        ${detailInfoRow("Model", escapeHtml(item.model) || "-")}
        ${detailInfoRow("Nomor Seri", escapeHtml(item.nomorSeri) || "-")}
        ${detailInfoRow("Tahun Pembelian", escapeHtml(item.tahunPembelian) || "-")}
        ${detailInfoRow("Tanggal Masuk", formatDate(item.tanggalMasuk))}
        ${detailInfoRow("Harga", formatCurrency(item.harga))}
      </div>

      <div class="panel detail-section">
        <h2 class="detail-section-title">Lokasi</h2>
        ${detailInfoRow("Ruangan", escapeHtml(item.ruangan))}
        ${detailInfoRow("Lokasi Detail", escapeHtml(item.lokasiDetail) || "-")}
        ${detailInfoRow("Penanggung Jawab", escapeHtml(item.penanggungJawab) || "-")}
      </div>

      <div class="panel detail-section">
        <h2 class="detail-section-title">Kondisi</h2>
        ${detailInfoRow("Kondisi Barang", `<span class="badge ${badgeClassFor(item.kondisi)}"><span class="badge-dot"></span>${escapeHtml(item.kondisi)}</span>`)}
        ${detailInfoRow("Status Barang", `<span class="status-pill ${statusBadgeClassFor(item.status)}">${escapeHtml(item.status)}</span>`)}
        ${detailInfoRow("Terakhir Diupdate", timeAgo(item.updatedAt || item.createdAt || Date.now()))}
        ${detailInfoRow("Catatan Kondisi", escapeHtml(item.catatanKondisi) || "-")}
      </div>

      <div class="panel detail-section detail-section-wide">
        <h2 class="detail-section-title">Deskripsi</h2>
        <p class="detail-desc-text">${escapeHtml(item.deskripsi) || "Belum ada deskripsi untuk barang ini."}</p>
      </div>

      <div class="panel detail-section detail-section-wide">
        <h2 class="detail-section-title">Riwayat Aktivitas Barang</h2>
        <ul class="history-list" id="detail-page-history-list"></ul>
      </div>
    </div>
  `;

  const historyList = document.getElementById("detail-page-history-list");
  const history = Array.isArray(item.history) ? item.history : [];
  if (!history.length) {
    historyList.innerHTML = `<li class="history-empty">Belum ada riwayat perubahan untuk barang ini.</li>`;
  } else {
    historyList.innerHTML = history.map(h => `
      <li class="history-item">
        <span class="history-dot ${h.type}"></span>
        <span class="history-text">${h.text}<br><span class="history-time">${timeAgo(h.time)}</span></span>
      </li>
    `).join("");
  }

  document.getElementById("btn-detail-back").addEventListener("click", () => goToPage(lastDetailReturnPage));
  document.getElementById("btn-detail-edit").addEventListener("click", () => openEditModal(item.id));
  document.getElementById("btn-detail-qr").addEventListener("click", () => openQrModal(item.id));
  document.getElementById("btn-detail-download-qr").addEventListener("click", () => downloadQr(item.id));
  document.getElementById("btn-detail-scan").addEventListener("click", () => goToPage("scan"));
  document.getElementById("btn-detail-delete").addEventListener("click", () => openDeleteModal(item.id));
}

/* ---------------------------------------------------------
   19. QR CODE — GENERATE, CETAK, DOWNLOAD
--------------------------------------------------------- */
function openQrModal(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item || typeof QRCode === "undefined") {
    showToast("⚠️ Fitur QR Code tidak tersedia (perlu koneksi internet).", "error");
    return;
  }
  currentQrItemId = id;
  document.getElementById("qr-item-name").textContent = `${item.nama} — ${item.kode}`;

  const qrBox = document.getElementById("qr-box");
  qrBox.innerHTML = "";
  new QRCode(qrBox, {
    text: `INVENTRA|${item.kode}|${item.nama}|${item.ruangan}`,
    width: 200,
    height: 200,
    colorDark: "#0F172A",
    colorLight: "#ffffff"
  });

  document.getElementById("qr-modal-overlay").classList.add("is-open");
}

function closeQrModal() {
  document.getElementById("qr-modal-overlay").classList.remove("is-open");
  currentQrItemId = null;
}

function printQr() {
  const qrBox = document.getElementById("qr-box");
  const item = inventoryData.find(i => i.id === currentQrItemId);
  if (!qrBox.innerHTML || !item) return;

  const printWindow = window.open("", "_blank", "width=400,height=500");
  printWindow.document.write(`
    <html>
      <head>
        <title>QR ${escapeHtml(item.kode)}</title>
        <style>
          body{ font-family:sans-serif; text-align:center; padding:24px; }
          h3{ margin-bottom:4px; }
          p{ color:#555; margin-top:0; }
        </style>
      </head>
      <body>
        <h3>${escapeHtml(item.nama)}</h3>
        <p>${escapeHtml(item.kode)} — ${escapeHtml(item.ruangan)}</p>
        ${qrBox.innerHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 300);
}

function downloadQr(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item || typeof QRCode === "undefined") {
    showToast("⚠️ Fitur QR Code tidak tersedia (perlu koneksi internet).", "error");
    return;
  }
  // Buat QR sementara di elemen tersembunyi agar bisa diunduh tanpa membuka modal
  const temp = document.createElement("div");
  temp.style.position = "fixed";
  temp.style.left = "-9999px";
  document.body.appendChild(temp);
  new QRCode(temp, {
    text: `INVENTRA|${item.kode}|${item.nama}|${item.ruangan}`,
    width: 400,
    height: 400,
    colorDark: "#0F172A",
    colorLight: "#ffffff"
  });

  setTimeout(() => {
    const canvas = temp.querySelector("canvas");
    const img = temp.querySelector("img");
    const dataUrl = canvas ? canvas.toDataURL("image/png") : (img ? img.src : null);
    if (dataUrl) {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `QR-${item.kode}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast("⬇️ QR Code berhasil diunduh!", "success");
    }
    temp.remove();
  }, 150);
}

/* ---------------------------------------------------------
   20. SCAN QR / BARCODE BARANG
--------------------------------------------------------- */
function findItemByScannedCode(rawText) {
  if (!rawText) return null;
  const text = rawText.trim();
  // Format khusus INVENTRA|KODE|NAMA|RUANGAN
  if (text.startsWith("INVENTRA|")) {
    const parts = text.split("|");
    const kode = parts[1];
    return inventoryData.find(i => i.kode.toLowerCase() === (kode || "").toLowerCase()) || null;
  }
  // Fallback: anggap teks langsung berupa kode inventaris
  return inventoryData.find(i => i.kode.toLowerCase() === text.toLowerCase()) || null;
}

function showScanResult(item) {
  const foundBox = document.getElementById("scan-result-found");
  const notFoundBox = document.getElementById("scan-result-notfound");
  const emptyBox = document.getElementById("scan-result-empty");

  if (!item) {
    foundBox.hidden = true;
    emptyBox.hidden = true;
    notFoundBox.hidden = false;
    return;
  }

  emptyBox.hidden = true;
  notFoundBox.hidden = true;
  foundBox.hidden = false;

  foundBox.innerHTML = `
    <div class="scan-card">
      <img class="scan-card-photo" src="${itemPhotoSrc(item)}" alt="${escapeHtml(item.nama)}">
      <div class="scan-card-head">
        <span class="kategori-chip">${kategoriIcon(item.kategori)} ${escapeHtml(item.kategori)}</span>
        <h2>${escapeHtml(item.nama)}</h2>
        <p class="scan-card-code">Kode: ${escapeHtml(item.kode)}</p>
        <div class="detail-header-badges">
          <span class="badge ${badgeClassFor(item.kondisi)}"><span class="badge-dot"></span>Kondisi: ${escapeHtml(item.kondisi)}</span>
          <span class="status-pill ${statusBadgeClassFor(item.status)}">Status: ${escapeHtml(item.status)}</span>
        </div>
      </div>

      <div class="scan-card-section">
        <h3>Informasi Inventaris</h3>
        ${detailInfoRow("Kode Inventaris", escapeHtml(item.kode))}
        ${detailInfoRow("Nama Barang", escapeHtml(item.nama))}
        ${detailInfoRow("Kategori", escapeHtml(item.kategori))}
        ${detailInfoRow("Jumlah", `${formatNumber(item.jumlah)} ${escapeHtml(item.satuan || "")}`)}
        ${detailInfoRow("Lokasi/Ruangan", escapeHtml(item.ruangan))}
      </div>

      <div class="scan-card-section">
        <h3>Informasi Barang</h3>
        ${detailInfoRow("Merek", escapeHtml(item.merek) || "-")}
        ${detailInfoRow("Model", escapeHtml(item.model) || "-")}
        ${detailInfoRow("Nomor Seri", escapeHtml(item.nomorSeri) || "-")}
        ${detailInfoRow("Tahun Pembelian", escapeHtml(item.tahunPembelian) || "-")}
        ${detailInfoRow("Tanggal Masuk", formatDate(item.tanggalMasuk))}
        ${detailInfoRow("Harga", formatCurrency(item.harga))}
      </div>

      <div class="scan-card-section">
        <h3>Informasi Tambahan</h3>
        ${detailInfoRow("Deskripsi", escapeHtml(item.deskripsi) || "-")}
        ${detailInfoRow("Penanggung Jawab", escapeHtml(item.penanggungJawab) || "-")}
        ${detailInfoRow("Terakhir Diupdate", timeAgo(item.updatedAt || item.createdAt || Date.now()))}
      </div>

      <div class="modal-actions">
        <button class="btn btn-ghost" id="btn-scan-again">🔄 Scan Lagi</button>
        <button class="btn btn-primary" id="btn-scan-open-detail">📄 Buka Detail Lengkap</button>
      </div>
    </div>
  `;

  document.getElementById("btn-scan-again").addEventListener("click", resetScanUI);
  document.getElementById("btn-scan-open-detail").addEventListener("click", () => openDetailPage(item.id, "scan"));
  pushActivity("edit", `Memindai QR/kode barang <b>${escapeHtml(item.nama)}</b>`);
}

function resetScanUI() {
  document.getElementById("scan-result-found").hidden = true;
  document.getElementById("scan-result-notfound").hidden = true;
  document.getElementById("scan-result-empty").hidden = false;
  document.getElementById("scan-manual-input").value = "";
  startScanCamera();
}

function processScannedText(text) {
  stopScanCamera();
  const loadingEl = document.getElementById("scan-loading");
  if (loadingEl) loadingEl.hidden = false;
  setTimeout(() => {
    if (loadingEl) loadingEl.hidden = true;
    const item = findItemByScannedCode(text);
    showScanResult(item);
  }, 350);
}

function startScanCamera() {
  const video = document.getElementById("scan-video");
  const statusEl = document.getElementById("scan-camera-status");
  if (!video) return;

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    if (statusEl) statusEl.textContent = "Kamera tidak didukung di perangkat ini. Gunakan input kode manual di bawah.";
    return;
  }
  if (typeof jsQR === "undefined") {
    if (statusEl) statusEl.textContent = "Pemindai QR tidak tersedia (perlu koneksi internet). Gunakan input kode manual.";
    return;
  }

  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      scanStream = stream;
      video.srcObject = stream;
      video.setAttribute("playsinline", true);
      video.play();
      if (statusEl) statusEl.textContent = "Arahkan kamera ke QR Code barang...";
      requestAnimationFrame(scanLoop);
    })
    .catch(() => {
      if (statusEl) statusEl.textContent = "Tidak dapat mengakses kamera. Periksa izin kamera atau gunakan input kode manual.";
    });
}

function stopScanCamera() {
  if (scanRafId) {
    cancelAnimationFrame(scanRafId);
    scanRafId = null;
  }
  if (scanStream) {
    scanStream.getTracks().forEach(track => track.stop());
    scanStream = null;
  }
}

function scanLoop() {
  const video = document.getElementById("scan-video");
  const canvas = document.getElementById("scan-canvas");
  if (!video || !canvas || !scanStream) return;

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    try {
      const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
      if (code && code.data) {
        processScannedText(code.data);
        return;
      }
    } catch (e) {
      // frame gagal diproses, lanjutkan ke frame berikutnya
    }
  }
  scanRafId = requestAnimationFrame(scanLoop);
}

function initScanPage() {
  document.getElementById("btn-scan-start").addEventListener("click", startScanCamera);
  document.getElementById("btn-scan-stop").addEventListener("click", () => {
    stopScanCamera();
    const statusEl = document.getElementById("scan-camera-status");
    if (statusEl) statusEl.textContent = "Kamera dihentikan.";
  });

  document.getElementById("btn-scan-manual").addEventListener("click", () => {
    const val = document.getElementById("scan-manual-input").value.trim();
    if (!val) {
      showToast("⚠️ Masukkan kode inventaris terlebih dahulu!", "error");
      return;
    }
    processScannedText(val);
  });
  document.getElementById("scan-manual-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("btn-scan-manual").click();
    }
  });

  document.getElementById("btn-scan-notfound-again").addEventListener("click", resetScanUI);
  document.getElementById("btn-scan-notfound-back").addEventListener("click", () => goToPage("dashboard"));
}

/* ---------------------------------------------------------
   21. EXPORT / IMPORT DATA
--------------------------------------------------------- */
function exportData() {
  const blob = new Blob([JSON.stringify(inventoryData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "inventaris-backup.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("📥 Data berhasil diexport!", "success");
}

function exportCSV() {
  if (!inventoryData.length) {
    showToast("⚠️ Tidak ada data untuk diexport!", "error");
    return;
  }
  const header = ["No", "Nama Barang", "Kode", "Kategori", "Merek", "Model", "Nomor Seri", "Tahun Pembelian", "Tanggal Masuk", "Harga", "Jumlah", "Satuan", "Ruangan", "Lokasi Detail", "Kondisi", "Status", "Penanggung Jawab"];
  const rows = inventoryData.map((item, i) => [
    i + 1, item.nama, item.kode, item.kategori, item.merek, item.model, item.nomorSeri,
    item.tahunPembelian, item.tanggalMasuk, item.harga, item.jumlah, item.satuan,
    item.ruangan, item.lokasiDetail, item.kondisi, item.status, item.penanggungJawab
  ]);
  const csvContent = [header, ...rows]
    .map(row => row.map(cell => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\r\n");

  // Tambahkan BOM agar karakter dibaca benar oleh Excel
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "inventaris-data.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("📊 Data berhasil diexport ke CSV!", "success");
}

function printReport() {
  const filtered = getFilteredData();
  const dataToPrint = filtered.length ? filtered : inventoryData;

  document.getElementById("print-report-date").textContent =
    "Dicetak pada: " + new Date().toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });

  document.getElementById("print-report-body").innerHTML = dataToPrint.map((item, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(item.nama)}</td>
      <td>${escapeHtml(item.kode)}</td>
      <td>${escapeHtml(item.ruangan)}</td>
      <td>${formatNumber(item.jumlah)}</td>
      <td>${escapeHtml(item.kondisi)}</td>
    </tr>
  `).join("");

  window.print();
}

function isValidInventoryArray(arr) {
  if (!Array.isArray(arr)) return false;
  return arr.every(item =>
    item && typeof item === "object" &&
    typeof item.nama === "string" &&
    typeof item.kode === "string" &&
    typeof item.ruangan === "string" &&
    (typeof item.jumlah === "number" || !isNaN(Number(item.jumlah))) &&
    typeof item.kondisi === "string"
  );
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!isValidInventoryArray(parsed)) {
        showToast("⚠️ Format file tidak valid!", "error");
        return;
      }
      inventoryData = parsed.map(normalizeItem);
      selectedIds.clear();
      currentPage = 1;
      pushActivity("add", "Mengimport data inventaris baru");
      renderAll();
      showToast("✅ Data berhasil diimport!", "success");
    } catch (err) {
      showToast("⚠️ File tidak dapat dibaca. Pastikan formatnya JSON yang valid!", "error");
    }
  };
  reader.readAsText(file);
}

/* ---------------------------------------------------------
   22. BACKUP & RESTORE (seluruh data aplikasi)
--------------------------------------------------------- */
function backupAllData() {
  const payload = {
    app: "INVENTRA",
    version: 2,
    exportedAt: new Date().toISOString(),
    inventarisData: inventoryData,
    inventraTheme: localStorage.getItem(STORAGE_KEY_THEME) || "light"
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "inventra-full-backup.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("💾 Backup lengkap berhasil dibuat!", "success");
}

function restoreAllData(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed || !isValidInventoryArray(parsed.inventarisData)) {
        showToast("⚠️ File backup tidak valid!", "error");
        return;
      }
      inventoryData = parsed.inventarisData.map(normalizeItem);
      selectedIds.clear();
      currentPage = 1;
      if (parsed.inventraTheme) applyTheme(parsed.inventraTheme);
      pushActivity("add", "Memulihkan data dari backup");
      renderAll();
      showToast("✅ Data berhasil dipulihkan dari backup!", "success");
    } catch (err) {
      showToast("⚠️ Gagal memulihkan data. File tidak valid!", "error");
    }
  };
  reader.readAsText(file);
}

function initExtraButtons() {
  document.getElementById("btn-export-csv").addEventListener("click", exportCSV);
  document.getElementById("btn-print-report").addEventListener("click", printReport);

  document.getElementById("qr-modal-close").addEventListener("click", closeQrModal);
  document.getElementById("qr-modal-overlay").addEventListener("click", (e) => {
    if (e.target.id === "qr-modal-overlay") closeQrModal();
  });
  document.getElementById("btn-print-qr").addEventListener("click", printQr);
  document.getElementById("btn-download-qr").addEventListener("click", () => {
    if (currentQrItemId) downloadQr(currentQrItemId);
  });

  document.getElementById("btn-view-all-activity").addEventListener("click", openActivityModal);
  document.getElementById("activity-modal-close").addEventListener("click", closeActivityModal);
  document.getElementById("activity-modal-overlay").addEventListener("click", (e) => {
    if (e.target.id === "activity-modal-overlay") closeActivityModal();
  });
}

function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    if (isCtrlOrCmd && e.key.toLowerCase() === "k") {
      e.preventDefault();
      goToPage("inventaris");
      document.getElementById("search-input").focus();
    }
    if (isCtrlOrCmd && e.key.toLowerCase() === "n") {
      e.preventDefault();
      goToPage("inventaris");
      openAddModal();
    }
  });
}

function initBackupRestore() {
  document.getElementById("btn-export").addEventListener("click", exportData);
  document.getElementById("import-file-input").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) importData(file);
    e.target.value = "";
  });
  document.getElementById("btn-backup-all").addEventListener("click", backupAllData);
  document.getElementById("restore-file-input").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) restoreAllData(file);
    e.target.value = "";
  });
}

/* ---------------------------------------------------------
   23. HALAMAN PENGATURAN
--------------------------------------------------------- */
function initSettingsPage() {
  document.getElementById("btn-toggle-theme-settings").addEventListener("click", toggleTheme);

  document.getElementById("btn-reset-sample").addEventListener("click", () => {
    inventoryData = SAMPLE_DATA.map(item => normalizeItem({
      ...item,
      id: generateId(),
      history: [{ type: "add", text: "Barang ditambahkan ke inventaris", time: Date.now() }]
    }));
    selectedIds.clear();
    currentPage = 1;
    pushActivity("add", "Memuat ulang data contoh");
    renderAll();
    showToast("✅ Data contoh berhasil dimuat!", "success");
  });

  document.getElementById("btn-clear-all").addEventListener("click", () => {
    pendingDeleteId = "__ALL__";
    document.getElementById("delete-item-name").textContent = "seluruh data inventaris";
    document.getElementById("delete-modal-overlay").classList.add("is-open");
  });
}

/* Modifikasi handler hapus supaya mendukung hapus semua data & hapus massal */
function initDeleteAllSupport() {
  const originalConfirmBtn = document.getElementById("btn-confirm-delete");
  originalConfirmBtn.addEventListener("click", () => {
    if (pendingDeleteId === "__ALL__") {
      inventoryData = [];
      selectedIds.clear();
      pushActivity("delete", "Menghapus seluruh data inventaris");
      renderAll();
      showToast("🗑️ Seluruh data berhasil dihapus!", "success");
      closeDeleteModal();
    } else if (pendingDeleteId === "__BULK__") {
      const jumlahDihapus = selectedIds.size;
      inventoryData = inventoryData.filter(i => !selectedIds.has(i.id));
      selectedIds.clear();
      pushActivity("delete", `Menghapus ${jumlahDihapus} item sekaligus`);
      renderAll();
      showToast(`🗑️ ${jumlahDihapus} item berhasil dihapus!`, "success");
      closeDeleteModal();
    }
  });
}

/* ---------------------------------------------------------
   24. INISIALISASI APLIKASI
--------------------------------------------------------- */
function initGeneralUI() {
  document.getElementById("hamburger-btn").addEventListener("click", openMobileSidebar);
  document.getElementById("sidebar-close").addEventListener("click", closeMobileSidebar);
  document.getElementById("sidebar-overlay").addEventListener("click", closeMobileSidebar);
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

  // Tutup modal dengan tombol ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeFormModal();
      closeDeleteModal();
      closeQrModal();
      closeActivityModal();
    }
  });
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").catch(() => {
        // Gagal mendaftarkan service worker (mis. dijalankan tanpa server lokal) — abaikan dengan aman
      });
    });
  }
}

function initApp() {
  loadData();
  loadActivity();
  initTheme();
  populateStaticSelectOptions();

  initGeneralUI();
  initNavigation();
  initSearchAndFilter();
  initSortableHeaders();
  initPaginationControls();
  initBulkSelection();
  initPhotoUpload();
  initFormModal();
  initDeleteModal();
  initDeleteAllSupport();
  initBackupRestore();
  initExtraButtons();
  initScanPage();
  initKeyboardShortcuts();
  initSettingsPage();

  renderAll();
  renderActivity();
  registerServiceWorker();

  // Sembunyikan splash screen & tampilkan aplikasi
  setTimeout(() => {
    document.getElementById("app").hidden = false;
    const splash = document.getElementById("splash-screen");
    setTimeout(() => splash.remove(), 700);
  }, 500);
}

document.addEventListener("DOMContentLoaded", initApp);