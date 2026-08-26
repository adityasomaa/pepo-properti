/**
 * Two languages, one shape.
 *
 * `dict.id` is the source of truth for the shape; `dict.en` is typed against it,
 * so a missing English string is a compile error rather than a blank on screen.
 *
 * The chosen language lives in the URL (/id/... or /en/...) so every page is
 * shareable in the language it was read in. A cookie remembers the choice for
 * the next visit, but only once the visitor has accepted cookies.
 *
 * COPY SOURCE. The Indonesian marketing copy follows the client's own brief for
 * the KORVA ecosystem. English is a translation of it, not a separate pitch.
 * Nothing here states a figure the client has not supplied: no project counts,
 * no years in business, no ratings.
 */

export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";

export const LOCALE_COOKIE = "korva_lang";

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Path segments are shared by both languages: one route tree, two dictionaries. */
export const routes = {
  home: "",
  listings: "listings",
  build: "build",
  portfolio: "portfolio",
  submit: "submit-property",
  contact: "contact",
  privacy: "privacy",
  terms: "terms",
} as const;

export type RouteKey = keyof typeof routes;

export function path(locale: Locale, key: RouteKey, slug?: string): string {
  const seg = routes[key];
  const base = seg ? `/${locale}/${seg}` : `/${locale}`;
  return slug ? `${base}/${slug}` : base;
}

const id = {
  meta: {
    localeName: "Bahasa Indonesia",
    localeShort: "ID",
    htmlLang: "id-ID",
  },
  nav: {
    home: "Beranda",
    listings: "Properti",
    build: "Bangun & Desain",
    portfolio: "Portofolio",
    submit: "Titipkan Properti",
    contact: "Kontak",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
    menuLabel: "Menu utama",
    skip: "Lewati ke konten utama",
  },
  lang: {
    label: "Bahasa",
    choose: "Pilih bahasa",
    current: "Bahasa saat ini",
  },
  common: {
    viewDetail: "Lihat detail",
    viewAll: "Lihat semua properti",
    viewVillas: "Lihat semua villa",
    askWhatsApp: "Konsultasi lewat WhatsApp",
    askAboutThis: "Tanya properti ini",
    askBuild: "Konsultasi bangun",
    backToListings: "Kembali ke daftar properti",
    backToPortfolio: "Kembali ke portofolio",
    sampleBadge: "Data contoh",
    sampleNoteShort:
      "Properti di bawah ini adalah data contoh untuk memperlihatkan tampilan situs, bukan properti yang sedang ditawarkan.",
    sampleNoteListing:
      "Ini adalah data contoh untuk memperlihatkan tampilan halaman detail. Properti ini tidak sedang ditawarkan.",
    sampleNoteProjects:
      "Proyek di bawah ini adalah contoh untuk memperlihatkan tampilan halaman, bukan proyek yang sudah dikerjakan.",
    loading: "Memuat",
    close: "Tutup",
    previous: "Sebelumnya",
    next: "Berikutnya",
    image: "Gambar",
    of: "dari",
    required: "wajib diisi",
  },
  division: {
    proLabel: "Pemasaran properti",
    studioLabel: "Arsitektur & konstruksi",
    proCta: "Cek listing properti",
    studioCta: "Konsultasi desain & konstruksi",
    chooseHeadline: "Mau bicara dengan divisi yang mana?",
    chooseBody: "Pilih satu supaya pesan Anda langsung sampai ke tim yang tepat.",
    proWhatsApp: "Konsultasi beli atau sewa lahan",
    studioWhatsApp: "Konsultasi bangun dan PBG/SLF",
  },
  type: {
    villa: "Villa",
    rumah: "Rumah",
    tanah: "Tanah",
    ruko: "Ruko",
  },
  typePlural: {
    villa: "Villa",
    rumah: "Rumah",
    tanah: "Tanah",
    ruko: "Ruko",
  },
  projectType: {
    villa: "Villa",
    rumah: "Rumah",
    komersial: "Komersial",
  },
  status: {
    dijual: "Dijual",
    disewa: "Disewakan",
  },
  tenure: {
    freehold: "Hak milik",
    leasehold: "Hak sewa",
  },
  zoning: {
    perumahan: "Perumahan",
    komersial: "Komersial",
    pariwisata: "Pariwisata",
  },
  priceUnit: {
    total: "",
    per_tahun: "per tahun",
    per_bulan: "per bulan",
  },
  home: {
    metaTitle: "Properti, Arsitektur, dan Konstruksi Terpadu di Bali",
    metaDescription:
      "KORVA menggabungkan Korva Pro untuk pemasaran properti dan Korva Studio untuk arsitektur, konstruksi, dan perizinan PBG/SLF di Badung, Denpasar, Gianyar, dan Tabanan.",
    heroHeadline: "One-Stop Solution Properti, Arsitektur, dan Konstruksi Terpadu di Bali",
    heroDescription:
      "Wujudkan hunian dan investasi properti impian Anda, mulai dari akuisisi lahan strategis hingga pembangunan unit siap huni bersama Korva Pro dan Korva Studio.",
    searchLabel: "Cari properti",
    searchPlaceholder: "Cari villa, rumah, tanah, atau kawasan",
    searchSubmit: "Cari",

    /* Pita berjalan di bawah judul. Isinya wilayah kerja dan lingkup layanan,
       keduanya fakta dari brief. Tidak ada klaim di sini. */
    tickerLabel: "Wilayah kerja dan lingkup layanan",
    ticker: [
      "Badung",
      "Denpasar",
      "Gianyar",
      "Tabanan",
      "Villa",
      "Rumah",
      "Tanah",
      "Ruko",
      "Arsitektur",
      "Rendering 3D",
      "Gambar struktur",
      "Konstruksi",
      "PBG",
      "SLF",
    ],

    synergy: {
      label: "Sekilas tentang kami",
      headline: "Dua entitas, satu alur kerja",
      description:
        "KORVA hadir sebagai jawaban atas kebutuhan layanan properti terintegrasi di Bali. Kami menggabungkan dua entitas bisnis untuk memberikan pengalaman yang mulus dan efisien bagi para pemilik tanah, pembeli, maupun investor.",
      closing:
        "Dengan sinergi ini, Anda tidak perlu lagi repot mencari agen properti dan kontraktor secara terpisah. Setelah menemukan lahan ideal bersama Korva Pro, proyek pembangunan Anda dapat langsung ditangani oleh Korva Studio secara terpadu.",
      cta: "Lihat layanan Korva Studio",
    },

    advantages: {
      label: "Keunggulan ekosistem KORVA",
      headline: "Kenapa satu ekosistem",
      description: "Empat hal yang membedakan alur kerja terpadu dari mengurus semuanya sendiri.",
      cta: "Konsultasi sekarang",
      items: [
        {
          title: "Ekosistem terintegrasi",
          body: "Solusi menyeluruh dari tahap pencarian lahan, perencanaan desain, perizinan, hingga eksekusi konstruksi bangunan.",
        },
        {
          title: "Desain presisi dan visualisasi 3D realistis",
          body: "Mengubah ide Anda menjadi rencana arsitektur yang matang beserta rancangan struktur yang aman dan efisien.",
        },
        {
          title: "Perizinan dan legalitas terjamin",
          body: "Memastikan seluruh dokumen legalitas bangunan, PBG dan SLF, diurus secara transparan dan sesuai regulasi daerah.",
        },
        {
          title: "Pengetahuan lokal yang kuat",
          body: "Berfokus pada area pengembangan strategis seperti Badung, Denpasar, Gianyar, Tabanan, dan seluruh wilayah Bali.",
        },
      ],
    },

    latest: {
      label: "Listing Korva Pro",
      headline: "Properti yang terakhir masuk",
      description: "Villa, rumah, tanah, dan ruko di kawasan Badung, Denpasar, Gianyar, dan Tabanan.",
      cta: "Lihat semua properti",
    },

    build: {
      label: "Layanan Korva Studio",
      headline: "Dari gambar sampai izin terbit",
      description:
        "Perancangan arsitektur, gambar kerja dan struktur, rendering 3D, pelaksanaan konstruksi, serta pengurusan PBG dan SLF.",
      cta: "Buka halaman Bangun & Desain",
    },

    portfolio: {
      label: "Portofolio",
      headline: "Rencana di sebelah kiri, hasil di sebelah kanan",
      description: "Geser pembatas untuk membandingkan tahap rencana dengan hasil pembangunan.",
      cta: "Lihat seluruh portofolio",
    },

    categories: {
      label: "Kategori properti",
      headline: "Rumah, tanah, dan ruko",
      description: "Selain villa, tersedia juga rumah tinggal, tanah kavling, dan ruko di beberapa kawasan.",
      cta: "Lihat semua properti",
    },
  },
  listings: {
    metaTitle: "Listing Properti Korva Pro",
    metaDescription:
      "Villa, rumah, tanah kavling, dan ruko yang dijual dan disewakan di Badung, Denpasar, Gianyar, dan Tabanan.",
    label: "Korva Pro",
    headline: "Katalog properti dan lahan",
    description: "Saring berdasarkan tipe, status, lokasi, zonasi, status hak, dan rentang harga.",
    cta: "Titipkan properti Anda",
    filters: "Filter",
    openFilters: "Buka filter",
    closeFilters: "Tutup filter",
    applyFilters: "Terapkan filter",
    resetFilters: "Atur ulang",
    filterPanelLabel: "Filter listing",
    search: "Kata kunci",
    searchPlaceholder: "Nama kawasan atau tipe",
    type: "Tipe properti",
    status: "Status",
    location: "Lokasi",
    tenure: "Status hak",
    zoning: "Zonasi",
    priceRange: "Rentang harga",
    priceMin: "Harga terendah",
    priceMax: "Harga tertinggi",
    priceHint: "Dalam Rupiah. Titik ribuan ditambahkan otomatis.",
    anyType: "Semua tipe",
    anyStatus: "Semua status",
    anyLocation: "Semua lokasi",
    anyTenure: "Semua status hak",
    anyZoning: "Semua zonasi",
    sort: "Urutkan",
    sortNewest: "Terbaru",
    sortPriceAsc: "Harga terendah",
    sortPriceDesc: "Harga tertinggi",
    resultsOne: "1 properti",
    resultsMany: "{n} properti",
    emptyHeadline: "Tidak ada properti yang cocok",
    emptyBody: "Coba longgarkan salah satu filter, atau sampaikan kebutuhan Anda lewat WhatsApp.",
    emptyCta: "Atur ulang filter",
  },
  listing: {
    label: "Detail properti",
    code: "Kode listing",
    specs: "Spesifikasi",
    bedrooms: "Kamar tidur",
    bathrooms: "Kamar mandi",
    landSize: "Luas tanah",
    buildingSize: "Luas bangunan",
    certificate: "Sertifikat",
    tenure: "Status hak",
    zoning: "Zonasi",
    description: "Deskripsi",
    location: "Lokasi",
    locationNote: "Lokasi ditampilkan pada tingkat kawasan. Titik persisnya diberikan saat kunjungan.",
    openMaps: "Buka di Google Maps",
    gallery: "Galeri",
    openGallery: "Perbesar gambar",
    priceLabel: "Harga",
    statusLabel: "Status",
    ctaHeadline: "Ingin tahu lebih lanjut tentang properti ini?",
    ctaDescription: "Kirim pertanyaan lewat WhatsApp. Kode listing dan tautan halaman ini ikut terkirim otomatis.",
    /* Cross-sell dari konsep klien: dari halaman lahan langsung ke Korva Studio. */
    crossSell: {
      label: "Lanjut ke pembangunan",
      headline: "Tertarik dengan lahan ini?",
      description:
        "Kami siap membantu mewujudkan konsep bangunan Anda, dari desain 3D hingga izin PBG dan SLF.",
      cta: "Lihat contoh desain dan estimasi bangun",
    },
    related: {
      label: "Properti lain",
      headline: "Listing lain yang mungkin cocok",
      description: "Properti lain dengan tipe atau kawasan yang sama.",
      cta: "Lihat semua properti",
    },
    notFound: "Properti tidak ditemukan",
    notFoundBody: "Tautan ini mungkin sudah tidak berlaku. Lihat daftar properti yang tersedia.",
  },
  build: {
    metaTitle: "Bangun & Desain",
    metaDescription:
      "Korva Studio menangani perancangan arsitektur, gambar kerja dan struktur, rendering 3D, konstruksi, serta perizinan PBG dan SLF di Bali.",
    label: "Korva Studio",
    headline: "Arsitektur, konstruksi, dan perizinan",
    description:
      "Perancangan arsitektur, gambar kerja dan struktur, visualisasi rendering 3D, jasa kontraktor pembangunan, hingga pengurusan PBG dan SLF.",
    cta: "Konsultasi desain & konstruksi",
    servicesHeading: "Lingkup layanan",
    packagesLabel: "Paket pembangunan",
    packagesHeadline: "Tiga tingkat spesifikasi",
    packagesDescription: "Setiap paket menyebutkan apa saja yang termasuk di dalamnya.",
    packagesCta: "Hitung estimasi",
    perSqm: "per m2",
    includes: "Termasuk",
    calculator: {
      label: "Estimasi biaya",
      headline: "Kalkulator estimasi bangun",
      description: "Masukkan luas bangunan dan pilih paket untuk melihat gambaran awal anggaran konstruksi.",
      areaLabel: "Luas bangunan",
      areaHint: "Dalam meter persegi, antara 20 dan 2.000.",
      packageLabel: "Paket",
      rateLabel: "Tarif per m2",
      resultLabel: "Perkiraan biaya konstruksi",
      formula: "{area} m2 dikali {rate}",
      disclaimer:
        "Angka ini hanya gambaran awal, bukan penawaran. Biaya sebenarnya bergantung pada desain, kondisi lahan, dan material yang dipilih.",
      unconfirmed:
        "Tarif per meter persegi di kalkulator ini masih angka contoh dan belum dikonfirmasi Korva Studio. Gunakan hasilnya sebagai ilustrasi cara kerja kalkulator saja.",
      cta: "Kirim estimasi ini lewat WhatsApp",
    },
    permitsLabel: "Perizinan",
    permitsHeadline: "PBG dan SLF",
    permitsDescription:
      "Pengurusan Persetujuan Bangunan Gedung dan Sertifikat Laik Fungsi sesuai regulasi daerah di Bali.",
    permitsCta: "Tanya soal perizinan",
  },
  portfolio: {
    metaTitle: "Portofolio Korva Studio",
    metaDescription: "Proyek arsitektur dan konstruksi Korva Studio di Bali, dari tahap rencana sampai hasil jadi.",
    label: "Portofolio",
    headline: "Proyek Korva Studio",
    description: "Bandingkan tahap rencana dengan hasil pembangunan pada setiap proyek.",
    cta: "Konsultasi desain & konstruksi",
    scope: "Lingkup pekerjaan",
    buildingSize: "Luas bangunan",
    beforeLabel: "Rencana",
    afterLabel: "Hasil",
    sliderLabel: "Geser untuk membandingkan rencana dan hasil",
    sliderInstruction: "Geser dengan tetikus, sentuhan, atau tombol panah kiri dan kanan.",
    empty: "Belum ada proyek yang ditampilkan.",
  },
  submit: {
    metaTitle: "Titipkan Properti",
    metaDescription: "Titipkan villa, rumah, tanah, atau ruko Anda untuk dipasarkan bersama Korva Pro.",
    label: "Titipkan properti",
    headline: "Titipkan properti Anda",
    description: "Isi keterangan singkat properti Anda. Ringkasannya dikirim ke WhatsApp Korva Pro.",
    cta: "Lihat katalog properti",
    formLabel: "Formulir titip properti",
    name: "Nama",
    namePlaceholder: "Nama Anda",
    phone: "Nomor WhatsApp",
    phonePlaceholder: "Contoh: 0812 3456 7890",
    type: "Tipe properti",
    status: "Untuk",
    location: "Lokasi",
    locationPlaceholder: "Kecamatan atau kawasan",
    price: "Perkiraan harga",
    pricePlaceholder: "Dalam Rupiah",
    notes: "Keterangan",
    notesPlaceholder: "Luas tanah, luas bangunan, jumlah kamar, sertifikat, dan hal lain yang perlu diketahui",
    submit: "Kirim lewat WhatsApp",
    submitting: "Menyiapkan",
    selectType: "Pilih tipe properti",
    selectStatus: "Pilih status",
    forSale: "Dijual",
    forRent: "Disewakan",
    successHeadline: "Ringkasan siap dikirim",
    successBody:
      "WhatsApp akan terbuka dengan pesan yang sudah terisi. Kalau tidak terbuka otomatis, gunakan tombol di bawah.",
    successOpen: "Buka WhatsApp",
    successAgain: "Isi formulir lagi",
    errorTitle: "Ada isian yang perlu diperbaiki",
    errors: {
      name: "Isi nama Anda.",
      nameLong: "Nama terlalu panjang.",
      phone: "Isi nomor WhatsApp yang bisa dihubungi.",
      phoneFormat: "Nomor hanya boleh berisi angka, spasi, tanda plus, dan tanda minus.",
      type: "Pilih tipe properti.",
      status: "Pilih dijual atau disewakan.",
      location: "Isi lokasi properti.",
      notesLong: "Keterangan terlalu panjang.",
      generic: "Formulir tidak dapat diproses. Coba lagi.",
    },
  },
  contact: {
    metaTitle: "Kontak",
    metaDescription: "Alamat kantor KORVA di Jimbaran, jam buka, dan nomor WhatsApp Korva Pro serta Korva Studio.",
    label: "Kontak",
    headline: "Hubungi kami",
    description: "Kantor kami berada di Jl. Goa Gong, Jimbaran, Kuta Selatan. Pertanyaan bisa dikirim lewat WhatsApp.",
    cta: "Konsultasi lewat WhatsApp",
    address: "Alamat",
    hours: "Jam buka",
    phone: "Telepon",
    whatsapp: "WhatsApp",
    legal: "Badan usaha",
    closed: "Tutup",
    days: {
      Monday: "Senin",
      Tuesday: "Selasa",
      Wednesday: "Rabu",
      Thursday: "Kamis",
      Friday: "Jumat",
      Saturday: "Sabtu",
      Sunday: "Minggu",
    },
    openMaps: "Buka di Google Maps",
  },
  footer: {
    ctaLabel: "Langkah berikutnya",
    ctaHeadline: "Mulai dari lahan, atau mulai dari gambar?",
    ctaDescription:
      "Cek katalog lahan dan unit bersama Korva Pro, atau bicarakan rencana bangun dan perizinan dengan Korva Studio.",
    ctaWhatsApp: "Konsultasi lewat WhatsApp",
    ctaSubmit: "Titipkan properti",
    ctaListings: "Cek listing properti",
    ctaBuild: "Konsultasi desain & konstruksi",
    ctaPortfolio: "Lihat portofolio",
    ctaContact: "Lihat kontak",
    navHeading: "Halaman",
    contactHeading: "Kantor",
    legalHeading: "Ketentuan",
    entitiesHeading: "Badan usaha",
    privacy: "Kebijakan Privasi",
    terms: "Syarat dan Ketentuan",
    rights: "Seluruh hak dilindungi.",
  },
  cookies: {
    title: "Cookie",
    body: "Situs ini dapat menyimpan pilihan bahasa Anda di perangkat ini supaya tidak perlu dipilih ulang pada kunjungan berikutnya. Tanpa persetujuan, pilihan bahasa hanya bertahan selama tab ini terbuka.",
    accept: "Terima",
    decline: "Tolak",
    more: "Kebijakan Privasi",
    label: "Pemberitahuan cookie",
  },
  privacy: {
    metaTitle: "Kebijakan Privasi",
    metaDescription: "Kebijakan privasi situs KORVA.",
    label: "Ketentuan",
    headline: "Kebijakan Privasi",
    description: "Penjelasan mengenai data yang disimpan situs ini dan cara menghubungi kami.",
    cta: "Lihat kontak",
    sections: [
      {
        heading: "Data yang disimpan di perangkat Anda",
        body: "Situs ini menyimpan satu pilihan di peramban Anda, yaitu bahasa yang Anda pilih. Bila Anda menerima pemberitahuan cookie, pilihan itu disimpan sebagai cookie sehingga masih berlaku pada kunjungan berikutnya. Bila Anda menolak, pilihan bahasa hanya bertahan selama tab peramban terbuka dan cookie yang sudah ada dihapus.",
      },
      {
        heading: "Data yang Anda kirim sendiri",
        body: "Formulir titip properti dan kalkulator estimasi tidak menyimpan data di situs ini. Isian Anda diubah menjadi pesan WhatsApp yang Anda kirim sendiri dari aplikasi WhatsApp Anda. Setelah pesan terkirim, data tersebut berada di percakapan WhatsApp antara Anda dan kami.",
      },
      {
        heading: "Layanan pihak ketiga",
        body: "Tautan WhatsApp dan tautan peta membawa Anda ke layanan milik pihak lain. Penggunaan layanan tersebut tunduk pada ketentuan dan kebijakan privasi masing-masing penyedia.",
      },
      {
        heading: "Mengubah pilihan Anda",
        body: "Anda dapat menghapus cookie situs ini melalui pengaturan peramban kapan saja. Setelah dihapus, pemberitahuan cookie akan muncul kembali pada kunjungan berikutnya.",
      },
      {
        heading: "Pertanyaan",
        body: "Pertanyaan mengenai kebijakan ini dapat disampaikan melalui kontak yang tercantum di halaman Kontak.",
      },
    ],
  },
  terms: {
    metaTitle: "Syarat dan Ketentuan",
    metaDescription: "Syarat dan ketentuan penggunaan situs KORVA.",
    label: "Ketentuan",
    headline: "Syarat dan Ketentuan",
    description: "Ketentuan penggunaan situs ini dan batasan informasi yang ditampilkan.",
    cta: "Lihat kontak",
    sections: [
      {
        heading: "Sifat informasi",
        body: "Informasi properti dan proyek di situs ini bersifat keterangan awal dan dapat berubah sewaktu-waktu tanpa pemberitahuan. Keterangan yang tampil di situs bukan penawaran yang mengikat dan bukan bagian dari perjanjian.",
      },
      {
        heading: "Estimasi biaya pembangunan",
        body: "Hasil kalkulator estimasi bangun adalah gambaran awal berdasarkan luas bangunan dan paket yang dipilih. Angka tersebut bukan penawaran, bukan kontrak, dan tidak mengikat. Biaya sebenarnya ditetapkan setelah survei lahan dan perencanaan teknis.",
      },
      {
        heading: "Pemeriksaan sebelum transaksi",
        body: "Sebelum melakukan transaksi, pembeli atau penyewa dianjurkan memeriksa sendiri keadaan fisik properti, kelengkapan dokumen, zonasi, dan status hukumnya, termasuk melalui pihak yang berwenang dan penasihat yang dipilih sendiri.",
      },
      {
        heading: "Penggunaan situs",
        body: "Isi situs ini, termasuk teks dan gambar, disediakan untuk keperluan informasi. Penggandaan atau penggunaan kembali untuk keperluan lain memerlukan izin tertulis dari kami.",
      },
      {
        heading: "Tautan ke pihak lain",
        body: "Situs ini memuat tautan ke layanan pihak lain, antara lain WhatsApp dan layanan peta. Kami tidak mengendalikan isi maupun ketersediaan layanan tersebut.",
      },
      {
        heading: "Perubahan ketentuan",
        body: "Ketentuan ini dapat diperbarui sewaktu-waktu. Versi yang berlaku adalah versi yang tampil di halaman ini.",
      },
    ],
  },
  notFound: {
    headline: "Halaman tidak ditemukan",
    body: "Tautan yang Anda buka mungkin sudah berubah atau tidak berlaku lagi.",
    cta: "Lihat katalog properti",
  },
};

// Widened on purpose: `id` is the shape, not a set of literal values, so the
// English dictionary is checked for completeness rather than for equality.
type Dict = typeof id;

const en: Dict = {
  meta: {
    localeName: "English",
    localeShort: "EN",
    htmlLang: "en",
  },
  nav: {
    home: "Home",
    listings: "Properties",
    build: "Build & Design",
    portfolio: "Portfolio",
    submit: "List Your Property",
    contact: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuLabel: "Main menu",
    skip: "Skip to main content",
  },
  lang: {
    label: "Language",
    choose: "Choose language",
    current: "Current language",
  },
  common: {
    viewDetail: "View detail",
    viewAll: "View all properties",
    viewVillas: "View all villas",
    askWhatsApp: "Talk to us on WhatsApp",
    askAboutThis: "Ask about this property",
    askBuild: "Ask about building",
    backToListings: "Back to properties",
    backToPortfolio: "Back to portfolio",
    sampleBadge: "Sample data",
    sampleNoteShort:
      "The properties below are sample data used to show how the site works. They are not properties currently on offer.",
    sampleNoteListing:
      "This is sample data used to show how a detail page works. This property is not on offer.",
    sampleNoteProjects:
      "The projects below are examples used to show how the page works, not work that has been carried out.",
    loading: "Loading",
    close: "Close",
    previous: "Previous",
    next: "Next",
    image: "Image",
    of: "of",
    required: "required",
  },
  division: {
    proLabel: "Property marketing",
    studioLabel: "Architecture & construction",
    proCta: "Browse properties",
    studioCta: "Design & construction enquiry",
    chooseHeadline: "Which team should this reach?",
    chooseBody: "Pick one so your message goes straight to the right people.",
    proWhatsApp: "Buying or leasing land",
    studioWhatsApp: "Building, PBG and SLF",
  },
  type: {
    villa: "Villa",
    rumah: "House",
    tanah: "Land",
    ruko: "Shophouse",
  },
  typePlural: {
    villa: "Villas",
    rumah: "Houses",
    tanah: "Land",
    ruko: "Shophouses",
  },
  projectType: {
    villa: "Villa",
    rumah: "House",
    komersial: "Commercial",
  },
  status: {
    dijual: "For sale",
    disewa: "For rent",
  },
  tenure: {
    freehold: "Freehold",
    leasehold: "Leasehold",
  },
  zoning: {
    perumahan: "Residential",
    komersial: "Commercial",
    pariwisata: "Tourism",
  },
  priceUnit: {
    total: "",
    per_tahun: "per year",
    per_bulan: "per month",
  },
  home: {
    metaTitle: "Integrated Property, Architecture, and Construction in Bali",
    metaDescription:
      "KORVA brings together Korva Pro for property marketing and Korva Studio for architecture, construction, and PBG/SLF permits across Badung, Denpasar, Gianyar, and Tabanan.",
    heroHeadline: "One-Stop Property, Architecture, and Construction in Bali",
    heroDescription:
      "Build the home or the investment you have in mind, from acquiring the right land to handing over a finished unit, with Korva Pro and Korva Studio.",
    searchLabel: "Search properties",
    searchPlaceholder: "Search a villa, house, land plot, or area",
    searchSubmit: "Search",

    tickerLabel: "Service areas and scope of work",
    ticker: [
      "Badung",
      "Denpasar",
      "Gianyar",
      "Tabanan",
      "Villas",
      "Houses",
      "Land",
      "Shophouses",
      "Architecture",
      "3D rendering",
      "Structural drawings",
      "Construction",
      "PBG",
      "SLF",
    ],

    synergy: {
      label: "About us",
      headline: "Two companies, one workflow",
      description:
        "KORVA exists to answer the need for integrated property services in Bali. We bring two businesses together to give landowners, buyers, and investors a smooth and efficient experience.",
      closing:
        "With this pairing you no longer have to find a property agent and a contractor separately. Once you have found the right land with Korva Pro, the build itself can be handled directly by Korva Studio.",
      cta: "See what Korva Studio does",
    },

    advantages: {
      label: "What the KORVA ecosystem offers",
      headline: "Why one ecosystem",
      description: "Four things that separate an integrated workflow from arranging everything yourself.",
      cta: "Start a conversation",
      items: [
        {
          title: "An integrated ecosystem",
          body: "A complete route from finding land, through design and permitting, to carrying out the construction itself.",
        },
        {
          title: "Precise design and realistic 3D visualisation",
          body: "Turning your idea into a resolved architectural plan alongside a structural design that is sound and efficient.",
        },
        {
          title: "Permits and legality assured",
          body: "Making sure every building document, PBG and SLF, is handled transparently and in line with regional regulations.",
        },
        {
          title: "Strong local knowledge",
          body: "Focused on the strategic development areas of Badung, Denpasar, Gianyar, Tabanan, and Bali more widely.",
        },
      ],
    },

    latest: {
      label: "Korva Pro listings",
      headline: "The most recent properties",
      description: "Villas, houses, land, and shophouses across Badung, Denpasar, Gianyar, and Tabanan.",
      cta: "View all properties",
    },

    build: {
      label: "Korva Studio services",
      headline: "From drawing to permit issued",
      description:
        "Architectural design, working and structural drawings, 3D rendering, construction, and PBG and SLF permit handling.",
      cta: "Open Build & Design",
    },

    portfolio: {
      label: "Portfolio",
      headline: "The plan on one side, the result on the other",
      description: "Drag the divider to compare the planning stage with the finished build.",
      cta: "See the full portfolio",
    },

    categories: {
      label: "Property categories",
      headline: "Houses, land, and shophouses",
      description: "Alongside villas, there are houses, land plots, and shophouses in several areas.",
      cta: "View all properties",
    },
  },
  listings: {
    metaTitle: "Korva Pro Property Listings",
    metaDescription:
      "Villas, houses, land plots, and shophouses for sale and for rent across Badung, Denpasar, Gianyar, and Tabanan.",
    label: "Korva Pro",
    headline: "Property and land catalogue",
    description: "Filter by type, status, area, zoning, tenure, and price range.",
    cta: "List your property",
    filters: "Filters",
    openFilters: "Open filters",
    closeFilters: "Close filters",
    applyFilters: "Apply filters",
    resetFilters: "Reset",
    filterPanelLabel: "Listing filters",
    search: "Keyword",
    searchPlaceholder: "Area name or property type",
    type: "Property type",
    status: "Status",
    location: "Area",
    tenure: "Tenure",
    zoning: "Zoning",
    priceRange: "Price range",
    priceMin: "Lowest price",
    priceMax: "Highest price",
    priceHint: "In Rupiah. Thousand separators are added as you type.",
    anyType: "All types",
    anyStatus: "All statuses",
    anyLocation: "All areas",
    anyTenure: "Any tenure",
    anyZoning: "Any zoning",
    sort: "Sort",
    sortNewest: "Newest",
    sortPriceAsc: "Lowest price",
    sortPriceDesc: "Highest price",
    resultsOne: "1 property",
    resultsMany: "{n} properties",
    emptyHeadline: "No properties match",
    emptyBody: "Try loosening one of the filters, or tell us what you are looking for on WhatsApp.",
    emptyCta: "Reset filters",
  },
  listing: {
    label: "Property detail",
    code: "Listing code",
    specs: "Specifications",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    landSize: "Land size",
    buildingSize: "Building size",
    certificate: "Certificate",
    tenure: "Tenure",
    zoning: "Zoning",
    description: "Description",
    location: "Location",
    locationNote: "Location is shown at area level. The exact position is given at the time of a viewing.",
    openMaps: "Open in Google Maps",
    gallery: "Gallery",
    openGallery: "Enlarge image",
    priceLabel: "Price",
    statusLabel: "Status",
    ctaHeadline: "Want to know more about this property?",
    ctaDescription:
      "Send your question on WhatsApp. The listing code and the link to this page are attached automatically.",
    crossSell: {
      label: "Take it further",
      headline: "Interested in this land?",
      description:
        "We can take your building concept from 3D design through to PBG and SLF permits.",
      cta: "See design examples and a build estimate",
    },
    related: {
      label: "Other properties",
      headline: "Other listings that may suit",
      description: "Other properties of the same type or in the same area.",
      cta: "View all properties",
    },
    notFound: "Property not found",
    notFoundBody: "This link may no longer be valid. Have a look at the properties currently listed.",
  },
  build: {
    metaTitle: "Build & Design",
    metaDescription:
      "Korva Studio handles architectural design, working and structural drawings, 3D rendering, construction, and PBG and SLF permits in Bali.",
    label: "Korva Studio",
    headline: "Architecture, construction, and permits",
    description:
      "Architectural design, working and structural drawings, 3D visualisation, construction contracting, and PBG and SLF permit handling.",
    cta: "Design & construction enquiry",
    servicesHeading: "What we cover",
    packagesLabel: "Build packages",
    packagesHeadline: "Three specification levels",
    packagesDescription: "Each package states exactly what is included in it.",
    packagesCta: "Work out an estimate",
    perSqm: "per m2",
    includes: "Includes",
    calculator: {
      label: "Cost estimate",
      headline: "Build cost calculator",
      description: "Enter a building area and pick a package to see an opening view of the construction budget.",
      areaLabel: "Building area",
      areaHint: "In square metres, between 20 and 2,000.",
      packageLabel: "Package",
      rateLabel: "Rate per m2",
      resultLabel: "Estimated construction cost",
      formula: "{area} m2 times {rate}",
      disclaimer:
        "This figure is an opening view, not an offer. Actual cost depends on the design, the condition of the land, and the materials chosen.",
      unconfirmed:
        "The per square metre rates in this calculator are still placeholder figures and have not been confirmed by Korva Studio. Treat the result as an illustration of how the calculator works.",
      cta: "Send this estimate on WhatsApp",
    },
    permitsLabel: "Permits",
    permitsHeadline: "PBG and SLF",
    permitsDescription:
      "Handling of Building Approval (PBG) and Certificate of Fitness for Use (SLF) under Bali regional regulations.",
    permitsCta: "Ask about permits",
  },
  portfolio: {
    metaTitle: "Korva Studio Portfolio",
    metaDescription: "Korva Studio architecture and construction projects in Bali, from planning stage to finished build.",
    label: "Portfolio",
    headline: "Korva Studio projects",
    description: "Compare the planning stage with the finished build on each project.",
    cta: "Design & construction enquiry",
    scope: "Scope of work",
    buildingSize: "Building area",
    beforeLabel: "Plan",
    afterLabel: "Result",
    sliderLabel: "Drag to compare plan and result",
    sliderInstruction: "Drag with a mouse, with touch, or with the left and right arrow keys.",
    empty: "No projects to show yet.",
  },
  submit: {
    metaTitle: "List Your Property",
    metaDescription: "List your villa, house, land, or shophouse for marketing with Korva Pro.",
    label: "List your property",
    headline: "List your property with us",
    description: "Fill in a short summary of your property. The summary is sent to Korva Pro on WhatsApp.",
    cta: "See the property catalogue",
    formLabel: "Property submission form",
    name: "Name",
    namePlaceholder: "Your name",
    phone: "WhatsApp number",
    phonePlaceholder: "For example: +62 812 3456 7890",
    type: "Property type",
    status: "Listing as",
    location: "Area",
    locationPlaceholder: "District or area",
    price: "Price expectation",
    pricePlaceholder: "In Rupiah",
    notes: "Details",
    notesPlaceholder: "Land size, building size, number of rooms, certificate, and anything else we should know",
    submit: "Send on WhatsApp",
    submitting: "Preparing",
    selectType: "Choose a property type",
    selectStatus: "Choose a status",
    forSale: "For sale",
    forRent: "For rent",
    successHeadline: "Your summary is ready to send",
    successBody:
      "WhatsApp will open with the message already filled in. If it does not open on its own, use the button below.",
    successOpen: "Open WhatsApp",
    successAgain: "Fill in the form again",
    errorTitle: "Some fields need attention",
    errors: {
      name: "Enter your name.",
      nameLong: "That name is too long.",
      phone: "Enter a WhatsApp number we can reach you on.",
      phoneFormat: "The number may only contain digits, spaces, a plus sign, and hyphens.",
      type: "Choose a property type.",
      status: "Choose whether it is for sale or for rent.",
      location: "Enter the area the property is in.",
      notesLong: "Those details are too long.",
      generic: "The form could not be processed. Please try again.",
    },
  },
  contact: {
    metaTitle: "Contact",
    metaDescription: "KORVA office address in Jimbaran, opening hours, and WhatsApp numbers for Korva Pro and Korva Studio.",
    label: "Contact",
    headline: "Get in touch",
    description: "Our office is on Jl. Goa Gong in Jimbaran, Kuta Selatan. Questions can be sent on WhatsApp.",
    cta: "Talk to us on WhatsApp",
    address: "Address",
    hours: "Opening hours",
    phone: "Phone",
    whatsapp: "WhatsApp",
    legal: "Legal entities",
    closed: "Closed",
    days: {
      Monday: "Monday",
      Tuesday: "Tuesday",
      Wednesday: "Wednesday",
      Thursday: "Thursday",
      Friday: "Friday",
      Saturday: "Saturday",
      Sunday: "Sunday",
    },
    openMaps: "Open in Google Maps",
  },
  footer: {
    ctaLabel: "Next step",
    ctaHeadline: "Start from the land, or start from the drawing?",
    ctaDescription:
      "Browse land and units with Korva Pro, or talk through a build and its permits with Korva Studio.",
    ctaWhatsApp: "Talk to us on WhatsApp",
    ctaSubmit: "List your property",
    ctaListings: "Browse properties",
    ctaBuild: "Design & construction enquiry",
    ctaPortfolio: "See the portfolio",
    ctaContact: "See contact details",
    navHeading: "Pages",
    contactHeading: "Office",
    legalHeading: "Legal",
    entitiesHeading: "Legal entities",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    rights: "All rights reserved.",
  },
  cookies: {
    title: "Cookies",
    body: "This site can store your language choice on this device so you do not have to pick it again next time. Without consent, the language choice only lasts as long as this tab stays open.",
    accept: "Accept",
    decline: "Decline",
    more: "Privacy Policy",
    label: "Cookie notice",
  },
  privacy: {
    metaTitle: "Privacy Policy",
    metaDescription: "Privacy policy for the KORVA website.",
    label: "Legal",
    headline: "Privacy Policy",
    description: "What this site stores, and how to reach us about it.",
    cta: "See contact details",
    sections: [
      {
        heading: "What is stored on your device",
        body: "This site stores one preference in your browser: the language you choose. If you accept the cookie notice, that choice is kept as a cookie so it still applies on your next visit. If you decline, the language choice only lasts while the browser tab is open, and any existing cookie is removed.",
      },
      {
        heading: "What you send yourself",
        body: "The property submission form and the cost calculator store nothing on this site. What you enter is turned into a WhatsApp message that you send yourself from your own WhatsApp app. Once sent, that information sits in the WhatsApp conversation between you and us.",
      },
      {
        heading: "Third party services",
        body: "WhatsApp links and map links take you to services run by other companies. Using those services is subject to each provider's own terms and privacy policy.",
      },
      {
        heading: "Changing your choice",
        body: "You can clear this site's cookies from your browser settings at any time. Once cleared, the cookie notice appears again on your next visit.",
      },
      {
        heading: "Questions",
        body: "Questions about this policy can be sent using the details on the Contact page.",
      },
    ],
  },
  terms: {
    metaTitle: "Terms of Service",
    metaDescription: "Terms of service for the KORVA website.",
    label: "Legal",
    headline: "Terms of Service",
    description: "How this site may be used, and the limits of the information shown on it.",
    cta: "See contact details",
    sections: [
      {
        heading: "Nature of the information",
        body: "Property and project information on this site is preliminary and may change at any time without notice. What is shown is not a binding offer and does not form part of any agreement.",
      },
      {
        heading: "Build cost estimates",
        body: "The result of the build cost calculator is an opening view based on the building area and package selected. It is not an offer, not a contract, and not binding. Actual cost is set after a site survey and technical planning.",
      },
      {
        heading: "Checks before a transaction",
        body: "Before entering into a transaction, buyers and tenants are advised to inspect the property, its documents, its zoning, and its legal status themselves, including through the relevant authorities and advisers of their own choosing.",
      },
      {
        heading: "Use of the site",
        body: "The contents of this site, including text and graphics, are provided for information. Reproducing or reusing them for other purposes requires our written permission.",
      },
      {
        heading: "Links to other parties",
        body: "This site links to services run by others, including WhatsApp and map services. We do not control the content or availability of those services.",
      },
      {
        heading: "Changes to these terms",
        body: "These terms may be updated from time to time. The version that applies is the one shown on this page.",
      },
    ],
  },
  notFound: {
    headline: "Page not found",
    body: "The link you opened may have changed or may no longer be valid.",
    cta: "View the property catalogue",
  },
};

export const dictionaries = { id, en } as const;

export function getDict(locale: Locale): Dict {
  return dictionaries[locale];
}

export type Dictionary = Dict;

export function otherLocale(locale: Locale): Locale {
  return locale === "id" ? "en" : "id";
}
