/* ===========================================================================
   DATA LISTING PROPERTI
   ===========================================================================

   SEMUA properti yang tampil di website diambil dari file ini. Tidak ada
   database. Untuk menambah, mengubah, atau menghapus properti, cukup edit
   daftar di bawah lalu simpan.

   ---------------------------------------------------------------------------
   PENTING: ISI FILE INI MASIH DATA CONTOH
   ---------------------------------------------------------------------------
   Semua properti di bawah adalah contoh untuk memperlihatkan tampilan website,
   bukan properti yang sedang dijual. Website menampilkan penanda "data contoh"
   di halaman listing dan di setiap halaman detail selama tanda di bawah ini
   masih bernilai true. Setelah data asli dimasukkan, ubah menjadi false dan
   penanda itu hilang dari seluruh situs.
   =========================================================================== */

export const SAMPLE_DATA = true;

/* ---------------------------------------------------------------------------
   CARA MENAMBAH PROPERTI BARU

   1. Salin satu blok properti yang sudah ada, dari tanda { sampai },
   2. Tempel di dalam daftar listings di bawah,
   3. Ganti isinya, lalu simpan.

   ARTI SETIAP KOLOM

   code         Kode listing, dipakai di pesan WhatsApp. Contoh: "PP-V-009".
                Harus unik, tidak boleh sama dengan properti lain.

   slug         Potongan alamat website untuk properti ini. Contoh:
                "villa-tiga-kamar-canggu" akan bisa dibuka di
                /id/listing/villa-tiga-kamar-canggu
                Huruf kecil semua, tanpa spasi, pakai tanda minus.
                Harus unik. Kalau sudah pernah dibagikan ke calon pembeli,
                jangan diubah lagi supaya link lama tidak mati.

   type         Jenis properti. Hanya boleh salah satu dari:
                "villa" | "rumah" | "tanah" | "ruko"

   status       Hanya boleh salah satu dari:
                "dijual" | "disewa"

   area         Nama kecamatan atau kawasan. Ini yang dipakai filter Lokasi.
                Tulis persis sama untuk properti di kawasan yang sama supaya
                tidak muncul dua pilihan yang sebenarnya sama.

   regency      Kabupaten atau kota.

   price        Harga dalam Rupiah, angka saja, tanpa titik dan tanpa "Rp".
                Contoh: 4850000000

   priceUnit    Satuan harga. Hanya boleh salah satu dari:
                "total"     harga keseluruhan, dipakai untuk properti dijual
                "per_tahun" harga sewa per tahun
                "per_bulan" harga sewa per bulan

   bedrooms     Jumlah kamar tidur. Tulis null kalau tidak berlaku (tanah).
   bathrooms    Jumlah kamar mandi. Tulis null kalau tidak berlaku.
   landSize     Luas tanah dalam meter persegi, angka saja.
   buildingSize Luas bangunan dalam meter persegi. Tulis null untuk tanah.
   certificate  Jenis sertifikat. Contoh: "SHM", "HGB".

   tenure       Status hak. Hanya boleh salah satu dari:
                "freehold"  hak milik, dijual putus
                "leasehold" hak sewa untuk jangka waktu tertentu

   zoning       Peruntukan lahan menurut ITR. Hanya boleh salah satu dari:
                "perumahan" | "komersial" | "pariwisata"
                Tulis null kalau peruntukannya belum dipastikan.

   featured     true kalau mau ditandai di halaman depan, selain itu false.
   publishedAt  Tanggal masuk, format "TAHUN-BULAN-TANGGAL". Dipakai untuk
                mengurutkan mana yang terbaru.

   title        Judul properti. Isi dua-duanya:
                  id  judul bahasa Indonesia
                  en  judul bahasa Inggris
   description  Keterangan properti, juga dua bahasa.

   images       Daftar gambar. Sekarang masih memakai gambar tempat kosong
                yang dibuat otomatis oleh sistem. Kalau nanti sudah ada foto
                asli, unggah foto ke folder public/photos lalu ganti isinya
                menjadi contoh: ["/photos/villa-canggu-1.jpg", ...]
                Gambar pertama dipakai sebagai gambar utama.
   --------------------------------------------------------------------------- */

export type PropertyType = "villa" | "rumah" | "tanah" | "ruko";
export type ListingStatus = "dijual" | "disewa";
export type PriceUnit = "total" | "per_tahun" | "per_bulan";
export type Tenure = "freehold" | "leasehold";
export type Zoning = "perumahan" | "komersial" | "pariwisata";

export type Listing = {
  code: string;
  slug: string;
  type: PropertyType;
  status: ListingStatus;
  area: string;
  regency: string;
  price: number;
  priceUnit: PriceUnit;
  bedrooms: number | null;
  bathrooms: number | null;
  landSize: number;
  buildingSize: number | null;
  certificate: string;
  tenure: Tenure;
  zoning: Zoning | null;
  featured: boolean;
  publishedAt: string;
  title: { id: string; en: string };
  description: { id: string; en: string };
  images: string[];
};

export const listings: Listing[] = [
  {
    code: "PP-V-001",
    slug: "villa-tiga-kamar-kolam-renang-canggu",
    type: "villa",
    status: "dijual",
    area: "Kuta Utara",
    regency: "Badung",
    price: 4850000000,
    priceUnit: "total",
    bedrooms: 3,
    bathrooms: 3,
    landSize: 320,
    buildingSize: 210,
    certificate: "SHM",
    tenure: "freehold",
    zoning: "pariwisata",
    featured: true,
    publishedAt: "2026-08-14",
    title: {
      id: "Villa Tiga Kamar dengan Kolam Renang di Canggu",
      en: "Three-Bedroom Villa with Pool in Canggu",
    },
    description: {
      id: "Villa satu lantai dengan tiga kamar tidur dan kolam renang di halaman belakang. Ruang tamu terbuka menghadap taman, dapur terpisah, dan carport untuk satu mobil. Berada di kawasan Kuta Utara.",
      en: "Single-storey villa with three bedrooms and a pool in the rear garden. Open living area facing the garden, a separate kitchen, and a carport for one car. Located in the Kuta Utara area.",
    },
    images: [
      "/graphics/pp-v-001-1.svg",
      "/graphics/pp-v-001-2.svg",
      "/graphics/pp-v-001-3.svg",
      "/graphics/pp-v-001-4.svg",
    ],
  },
  {
    code: "PP-V-002",
    slug: "villa-dua-kamar-seminyak",
    type: "villa",
    status: "disewa",
    area: "Kuta",
    regency: "Badung",
    price: 385000000,
    priceUnit: "per_tahun",
    bedrooms: 2,
    bathrooms: 2,
    landSize: 190,
    buildingSize: 140,
    certificate: "HGB",
    tenure: "leasehold",
    zoning: "pariwisata",
    featured: true,
    publishedAt: "2026-08-11",
    title: {
      id: "Villa Dua Kamar di Seminyak",
      en: "Two-Bedroom Villa in Seminyak",
    },
    description: {
      id: "Villa dua lantai dengan dua kamar tidur, kolam renang kecil, dan teras atas. Sudah berisi perabot. Disewakan per tahun di kawasan Seminyak, Kuta.",
      en: "Two-storey villa with two bedrooms, a small pool, and an upper terrace. Comes furnished. Available on a yearly rental in the Seminyak area of Kuta.",
    },
    images: [
      "/graphics/pp-v-002-1.svg",
      "/graphics/pp-v-002-2.svg",
      "/graphics/pp-v-002-3.svg",
      "/graphics/pp-v-002-4.svg",
    ],
  },
  {
    code: "PP-V-003",
    slug: "villa-empat-kamar-ubud",
    type: "villa",
    status: "dijual",
    area: "Ubud",
    regency: "Gianyar",
    price: 7250000000,
    priceUnit: "total",
    bedrooms: 4,
    bathrooms: 4,
    landSize: 640,
    buildingSize: 380,
    certificate: "SHM",
    tenure: "freehold",
    zoning: "pariwisata",
    featured: true,
    publishedAt: "2026-08-09",
    title: {
      id: "Villa Empat Kamar dengan Taman di Ubud",
      en: "Four-Bedroom Villa with Garden in Ubud",
    },
    description: {
      id: "Villa empat kamar tidur dengan taman di sekeliling bangunan dan kolam renang memanjang. Terdapat paviliun terpisah yang bisa dipakai sebagai ruang kerja. Berada di Ubud, Gianyar.",
      en: "Four-bedroom villa with garden on all sides and a lap pool. A separate pavilion can be used as a workspace. Located in Ubud, Gianyar.",
    },
    images: [
      "/graphics/pp-v-003-1.svg",
      "/graphics/pp-v-003-2.svg",
      "/graphics/pp-v-003-3.svg",
      "/graphics/pp-v-003-4.svg",
    ],
  },
  {
    code: "PP-V-004",
    slug: "villa-tiga-kamar-jimbaran",
    type: "villa",
    status: "disewa",
    area: "Kuta Selatan",
    regency: "Badung",
    price: 295000000,
    priceUnit: "per_tahun",
    bedrooms: 3,
    bathrooms: 2,
    landSize: 250,
    buildingSize: 165,
    certificate: "HGB",
    tenure: "leasehold",
    zoning: "pariwisata",
    featured: false,
    publishedAt: "2026-08-06",
    title: {
      id: "Villa Tiga Kamar di Jimbaran",
      en: "Three-Bedroom Villa in Jimbaran",
    },
    description: {
      id: "Villa tiga kamar tidur dengan kolam renang dan halaman belakang tertutup. Terletak di Jimbaran, Kuta Selatan. Disewakan per tahun.",
      en: "Three-bedroom villa with a pool and an enclosed rear yard. Located in Jimbaran, Kuta Selatan. Available on a yearly rental.",
    },
    images: [
      "/graphics/pp-v-004-1.svg",
      "/graphics/pp-v-004-2.svg",
      "/graphics/pp-v-004-3.svg",
      "/graphics/pp-v-004-4.svg",
    ],
  },
  {
    code: "PP-V-005",
    slug: "villa-dua-kamar-sanur",
    type: "villa",
    status: "dijual",
    area: "Denpasar Selatan",
    regency: "Denpasar",
    price: 3150000000,
    priceUnit: "total",
    bedrooms: 2,
    bathrooms: 2,
    landSize: 210,
    buildingSize: 135,
    certificate: "SHM",
    tenure: "freehold",
    zoning: "pariwisata",
    featured: true,
    publishedAt: "2026-08-04",
    title: {
      id: "Villa Dua Kamar di Sanur",
      en: "Two-Bedroom Villa in Sanur",
    },
    description: {
      id: "Villa dua kamar tidur dengan kolam renang kecil dan teras kayu. Bangunan satu lantai di kawasan Sanur, Denpasar Selatan.",
      en: "Two-bedroom villa with a small pool and a timber deck. Single-storey building in the Sanur area of Denpasar Selatan.",
    },
    images: [
      "/graphics/pp-v-005-1.svg",
      "/graphics/pp-v-005-2.svg",
      "/graphics/pp-v-005-3.svg",
      "/graphics/pp-v-005-4.svg",
    ],
  },
  {
    code: "PP-V-006",
    slug: "villa-lima-kamar-kolam-renang-taman-uluwatu",
    type: "villa",
    status: "dijual",
    area: "Kuta Selatan",
    regency: "Badung",
    price: 12400000000,
    priceUnit: "total",
    bedrooms: 5,
    bathrooms: 5,
    landSize: 980,
    buildingSize: 520,
    certificate: "SHM",
    tenure: "freehold",
    zoning: "pariwisata",
    featured: false,
    publishedAt: "2026-08-02",
    title: {
      id: "Villa Lima Kamar Tidur dengan Kolam Renang Pribadi dan Area Taman Luas di Kawasan Uluwatu, Kuta Selatan",
      en: "Five-Bedroom Villa with Private Swimming Pool and Extensive Garden Grounds in the Uluwatu Area of Kuta Selatan",
    },
    description: {
      id: "Villa lima kamar tidur di atas tanah luas dengan kolam renang pribadi dan area taman di sisi depan dan belakang bangunan. Terdiri dari bangunan utama dan satu bangunan tamu terpisah. Berada di kawasan Uluwatu, Kuta Selatan.",
      en: "Five-bedroom villa on a large plot with a private pool and garden areas to the front and rear of the building. Comprises a main building and one separate guest building. Located in the Uluwatu area of Kuta Selatan.",
    },
    images: [
      "/graphics/pp-v-006-1.svg",
      "/graphics/pp-v-006-2.svg",
      "/graphics/pp-v-006-3.svg",
      "/graphics/pp-v-006-4.svg",
    ],
  },
  {
    code: "PP-V-007",
    slug: "villa-satu-kamar-tabanan",
    type: "villa",
    status: "disewa",
    area: "Kediri",
    regency: "Tabanan",
    price: 18500000,
    priceUnit: "per_bulan",
    bedrooms: 1,
    bathrooms: 1,
    landSize: 145,
    buildingSize: 78,
    certificate: "HGB",
    tenure: "leasehold",
    zoning: "pariwisata",
    featured: false,
    publishedAt: "2026-07-29",
    title: {
      id: "Villa Satu Kamar di Tabanan",
      en: "One-Bedroom Villa in Tabanan",
    },
    description: {
      id: "Villa satu kamar tidur dengan dapur terbuka dan teras menghadap sawah. Disewakan per bulan di Kediri, Tabanan.",
      en: "One-bedroom villa with an open kitchen and a terrace facing rice fields. Available on a monthly rental in Kediri, Tabanan.",
    },
    images: [
      "/graphics/pp-v-007-1.svg",
      "/graphics/pp-v-007-2.svg",
      "/graphics/pp-v-007-3.svg",
      "/graphics/pp-v-007-4.svg",
    ],
  },
  {
    code: "PP-V-008",
    slug: "villa-tiga-kamar-pererenan",
    type: "villa",
    status: "dijual",
    area: "Mengwi",
    regency: "Badung",
    price: 5680000000,
    priceUnit: "total",
    bedrooms: 3,
    bathrooms: 3,
    landSize: 400,
    buildingSize: 245,
    certificate: "SHM",
    tenure: "freehold",
    zoning: "pariwisata",
    featured: false,
    publishedAt: "2026-07-25",
    title: {
      id: "Villa Tiga Kamar di Pererenan",
      en: "Three-Bedroom Villa in Pererenan",
    },
    description: {
      id: "Villa tiga kamar tidur dengan kolam renang dan ruang keluarga terbuka. Dua kamar berada di lantai atas dengan balkon. Berada di Pererenan, Mengwi.",
      en: "Three-bedroom villa with a pool and an open family room. Two bedrooms sit on the upper floor with a balcony. Located in Pererenan, Mengwi.",
    },
    images: [
      "/graphics/pp-v-008-1.svg",
      "/graphics/pp-v-008-2.svg",
      "/graphics/pp-v-008-3.svg",
      "/graphics/pp-v-008-4.svg",
    ],
  },
  {
    code: "PP-R-001",
    slug: "rumah-dua-lantai-panjer",
    type: "rumah",
    status: "dijual",
    area: "Denpasar Selatan",
    regency: "Denpasar",
    price: 2340000000,
    priceUnit: "total",
    bedrooms: 4,
    bathrooms: 3,
    landSize: 180,
    buildingSize: 195,
    certificate: "SHM",
    tenure: "freehold",
    zoning: "perumahan",
    featured: false,
    publishedAt: "2026-08-12",
    title: {
      id: "Rumah Dua Lantai Empat Kamar di Panjer",
      en: "Two-Storey Four-Bedroom House in Panjer",
    },
    description: {
      id: "Rumah dua lantai dengan empat kamar tidur, ruang keluarga di lantai atas, dan carport untuk dua mobil. Berada di Panjer, Denpasar Selatan.",
      en: "Two-storey house with four bedrooms, an upstairs family room, and a carport for two cars. Located in Panjer, Denpasar Selatan.",
    },
    images: [
      "/graphics/pp-r-001-1.svg",
      "/graphics/pp-r-001-2.svg",
      "/graphics/pp-r-001-3.svg",
      "/graphics/pp-r-001-4.svg",
    ],
  },
  {
    code: "PP-R-002",
    slug: "rumah-tiga-kamar-denpasar-barat",
    type: "rumah",
    status: "disewa",
    area: "Denpasar Barat",
    regency: "Denpasar",
    price: 95000000,
    priceUnit: "per_tahun",
    bedrooms: 3,
    bathrooms: 2,
    landSize: 150,
    buildingSize: 120,
    certificate: "SHM",
    tenure: "leasehold",
    zoning: "perumahan",
    featured: false,
    publishedAt: "2026-08-08",
    title: {
      id: "Rumah Tiga Kamar di Denpasar Barat",
      en: "Three-Bedroom House in Denpasar Barat",
    },
    description: {
      id: "Rumah satu lantai dengan tiga kamar tidur dan halaman depan. Kondisi kosong tanpa perabot. Disewakan per tahun di Denpasar Barat.",
      en: "Single-storey house with three bedrooms and a front yard. Unfurnished. Available on a yearly rental in Denpasar Barat.",
    },
    images: [
      "/graphics/pp-r-002-1.svg",
      "/graphics/pp-r-002-2.svg",
      "/graphics/pp-r-002-3.svg",
      "/graphics/pp-r-002-4.svg",
    ],
  },
  {
    code: "PP-R-003",
    slug: "rumah-lima-kamar-denpasar-timur",
    type: "rumah",
    status: "dijual",
    area: "Denpasar Timur",
    regency: "Denpasar",
    price: 3720000000,
    priceUnit: "total",
    bedrooms: 5,
    bathrooms: 4,
    landSize: 300,
    buildingSize: 280,
    certificate: "SHM",
    tenure: "freehold",
    zoning: "perumahan",
    featured: false,
    publishedAt: "2026-07-31",
    title: {
      id: "Rumah Lima Kamar di Denpasar Timur",
      en: "Five-Bedroom House in Denpasar Timur",
    },
    description: {
      id: "Rumah dua lantai dengan lima kamar tidur, ruang makan terpisah, dan taman belakang. Berada di Denpasar Timur.",
      en: "Two-storey house with five bedrooms, a separate dining room, and a rear garden. Located in Denpasar Timur.",
    },
    images: [
      "/graphics/pp-r-003-1.svg",
      "/graphics/pp-r-003-2.svg",
      "/graphics/pp-r-003-3.svg",
      "/graphics/pp-r-003-4.svg",
    ],
  },
  {
    code: "PP-R-004",
    slug: "rumah-dua-kamar-kuta-utara",
    type: "rumah",
    status: "dijual",
    area: "Kuta Utara",
    regency: "Badung",
    price: 1890000000,
    priceUnit: "total",
    bedrooms: 2,
    bathrooms: 1,
    landSize: 125,
    buildingSize: 90,
    certificate: "SHM",
    tenure: "freehold",
    zoning: "perumahan",
    featured: false,
    publishedAt: "2026-07-22",
    title: {
      id: "Rumah Dua Kamar di Kuta Utara",
      en: "Two-Bedroom House in Kuta Utara",
    },
    description: {
      id: "Rumah satu lantai dengan dua kamar tidur dan halaman kecil di belakang. Berada di Kuta Utara, Badung.",
      en: "Single-storey house with two bedrooms and a small rear yard. Located in Kuta Utara, Badung.",
    },
    images: [
      "/graphics/pp-r-004-1.svg",
      "/graphics/pp-r-004-2.svg",
      "/graphics/pp-r-004-3.svg",
      "/graphics/pp-r-004-4.svg",
    ],
  },
  {
    code: "PP-T-001",
    slug: "tanah-lima-are-kuta-utara",
    type: "tanah",
    status: "dijual",
    area: "Kuta Utara",
    regency: "Badung",
    price: 4200000000,
    priceUnit: "total",
    bedrooms: null,
    bathrooms: null,
    landSize: 500,
    buildingSize: null,
    certificate: "SHM",
    tenure: "freehold",
    zoning: "pariwisata",
    featured: false,
    publishedAt: "2026-08-10",
    title: {
      id: "Tanah Lima Are di Kuta Utara",
      en: "Five-Are Land Plot in Kuta Utara",
    },
    description: {
      id: "Tanah kosong seluas 500 meter persegi dengan bentuk persegi panjang dan akses jalan di sisi depan. Berada di Kuta Utara, Badung.",
      en: "Vacant plot of 500 square metres, rectangular in shape with road access along the front boundary. Located in Kuta Utara, Badung.",
    },
    images: [
      "/graphics/pp-t-001-1.svg",
      "/graphics/pp-t-001-2.svg",
      "/graphics/pp-t-001-3.svg",
    ],
  },
  {
    code: "PP-T-002",
    slug: "tanah-delapan-are-ubud",
    type: "tanah",
    status: "dijual",
    area: "Ubud",
    regency: "Gianyar",
    price: 3480000000,
    priceUnit: "total",
    bedrooms: null,
    bathrooms: null,
    landSize: 800,
    buildingSize: null,
    certificate: "SHM",
    tenure: "freehold",
    zoning: "pariwisata",
    featured: false,
    publishedAt: "2026-07-27",
    title: {
      id: "Tanah Delapan Are di Ubud",
      en: "Eight-Are Land Plot in Ubud",
    },
    description: {
      id: "Tanah kosong seluas 800 meter persegi berkontur landai dengan pandangan ke arah lembah. Berada di Ubud, Gianyar.",
      en: "Vacant plot of 800 square metres with a gentle slope and an outlook toward the valley. Located in Ubud, Gianyar.",
    },
    images: [
      "/graphics/pp-t-002-1.svg",
      "/graphics/pp-t-002-2.svg",
      "/graphics/pp-t-002-3.svg",
    ],
  },
  {
    code: "PP-K-001",
    slug: "ruko-dua-lantai-denpasar-selatan",
    type: "ruko",
    status: "disewa",
    area: "Denpasar Selatan",
    regency: "Denpasar",
    price: 145000000,
    priceUnit: "per_tahun",
    bedrooms: null,
    bathrooms: 2,
    landSize: 90,
    buildingSize: 160,
    certificate: "HGB",
    tenure: "leasehold",
    zoning: "komersial",
    featured: false,
    publishedAt: "2026-08-13",
    title: {
      id: "Ruko Dua Lantai di Denpasar Selatan",
      en: "Two-Storey Shophouse in Denpasar Selatan",
    },
    description: {
      id: "Ruko dua lantai dengan ruang usaha terbuka di lantai bawah dan dua ruang tertutup di lantai atas. Menghadap jalan dua arah di Denpasar Selatan.",
      en: "Two-storey shophouse with an open commercial floor at ground level and two enclosed rooms upstairs. Fronting a two-way road in Denpasar Selatan.",
    },
    images: [
      "/graphics/pp-k-001-1.svg",
      "/graphics/pp-k-001-2.svg",
      "/graphics/pp-k-001-3.svg",
    ],
  },
  {
    code: "PP-K-002",
    slug: "ruko-tiga-lantai-denpasar-barat",
    type: "ruko",
    status: "dijual",
    area: "Denpasar Barat",
    regency: "Denpasar",
    price: 5950000000,
    priceUnit: "total",
    bedrooms: null,
    bathrooms: 3,
    landSize: 120,
    buildingSize: 310,
    certificate: "HGB",
    tenure: "freehold",
    zoning: "komersial",
    featured: false,
    publishedAt: "2026-07-20",
    title: {
      id: "Ruko Tiga Lantai di Denpasar Barat",
      en: "Three-Storey Shophouse in Denpasar Barat",
    },
    description: {
      id: "Ruko tiga lantai dengan lantai dasar untuk ruang usaha dan dua lantai di atasnya untuk ruang kerja atau gudang. Berada di Denpasar Barat.",
      en: "Three-storey shophouse with a ground-floor commercial space and two upper floors suited to office or storage use. Located in Denpasar Barat.",
    },
    images: [
      "/graphics/pp-k-002-1.svg",
      "/graphics/pp-k-002-2.svg",
      "/graphics/pp-k-002-3.svg",
    ],
  },
];
