/* ===========================================================================
   DATA LISTING PROPERTI
   ===========================================================================

   SEMUA properti yang tampil di website diambil dari file ini. Tidak ada
   database. Untuk menambah, mengubah, atau menghapus properti, cukup edit
   daftar di bawah lalu simpan.

   ---------------------------------------------------------------------------
   ASAL DATA
   ---------------------------------------------------------------------------
   Dari sales kit Korva di Google Drive: dokumen INFORMATION dan Pricelist tiap
   proyek. Kalau dokumen dan ringkasan di chat berbeda, yang dipakai Pricelist,
   karena itu yang paling rinci dan paling baru.

   Foto yang dipakai hanya foto properti. Tangkapan layar peta, gambar daftar
   harga, dan satu spanduk yang memuat nomor telepon pribadi sengaja TIDAK
   dipakai. Jangan masukkan kembali.

   MARKUP SUDAH DITERAPKAN untuk listing Bali daratan.

   Korva menyebut "semua harga jual diatas ditambahkan 35jt", dan klien sudah
   memastikan itu berlaku untuk seluruh listing dari utas WhatsApp. Jadi harga
   yang tertulis di bawah untuk mbakind01, mahar01, dekpi01, buyand01, dan
   buyand02 SUDAH termasuk markup Rp 35 juta.

   Listing Nusa Penida dan Surabaya TIDAK ditambah markup: harganya berasal
   dari Pricelist di sales kit, bukan dari utas itu. Kalau ternyata markup
   berlaku di sana juga, tambahkan Rp 35 juta ke masing-masing.

   =========================================================================== */

export const SAMPLE_DATA = false;

/* ---------------------------------------------------------------------------
   CARA MENAMBAH PROPERTI BARU

   1. Salin satu blok properti yang sudah ada, dari tanda { sampai },
   2. Tempel di dalam daftar listings di bawah,
   3. Ganti isinya, lalu simpan.

   ARTI SETIAP KOLOM

   code         Kode listing, dipakai di pesan WhatsApp. Harus unik.

   slug         Potongan alamat website untuk properti ini, misalnya
                "tanah-kavling-pejukutan-d" akan bisa dibuka di
                /id/listings/tanah-kavling-pejukutan-d
                Huruf kecil semua, tanpa spasi, pakai tanda minus. Harus unik.
                Kalau sudah pernah dibagikan ke calon pembeli, jangan diubah
                lagi supaya link lama tidak mati.

   type         "villa" | "rumah" | "tanah" | "ruko"
   status       "dijual" | "disewa"

   area         Nama desa, kecamatan, atau kawasan. Ini yang dipakai filter
                Lokasi. Tulis persis sama untuk properti di kawasan yang sama.

   regency      Kabupaten atau kota.

   price        Harga dalam Rupiah, angka saja, tanpa titik dan tanpa "Rp".
   priceUnit    "total" | "per_tahun" | "per_bulan"

   bedrooms     Jumlah kamar tidur, null kalau tidak berlaku (tanah).
   bathrooms    Jumlah kamar mandi, null kalau tidak berlaku.
   landSize     Luas tanah dalam meter persegi, angka saja.
   buildingSize Luas bangunan dalam meter persegi, null kalau tidak ada angka
                resminya. Jangan dihitung sendiri dari ukuran ruangan.
   certificate  "SHM", "HGB", dan seterusnya.

   tenure       "freehold" hak milik, dijual putus
                "leasehold" hak sewa untuk jangka waktu tertentu

   zoning       "perumahan" | "komersial" | "pariwisata"
                Tulis null kalau peruntukannya belum ada dokumennya. Jangan
                menebak dari "cocok untuk villa" di brosur.

   featured     true kalau mau ditandai di halaman depan.
   publishedAt  Tanggal masuk, format "TAHUN-BULAN-TANGGAL".

   title        Judul properti, dua bahasa.
   description  Keterangan properti, dua bahasa. Tulis fakta terukur saja:
                luas, jarak, sertifikat, utilitas. Tanpa klaim keuntungan,
                tanpa kata "murah", tanpa janji waktu.

   images       Daftar foto. Setiap foto ditulis sebagai album dan slug, bukan
                alamat file:  { album: "p4-pejukutan", slug: "dji-0149-hdr" }
                Album adalah nama folder di public/photos, slug diambil dari
                manifest.json di folder itu. Website memilih sendiri ukuran dan
                format paling kecil yang cocok untuk layar pembaca.

                Menambah foto:
                  npm run photos -- "<folder asal>" "<nama-album>"
                Foto pertama dipakai sebagai foto utama.
   --------------------------------------------------------------------------- */

export type PropertyType = "villa" | "rumah" | "tanah" | "ruko";
export type ListingStatus = "dijual" | "disewa";
export type PriceUnit = "total" | "per_tahun" | "per_bulan";
export type Tenure = "freehold" | "leasehold";
export type Zoning = "perumahan" | "komersial" | "pariwisata";

/** Satu foto, ditunjuk lewat album dan slug di public/photos. */
export type PhotoRef = { album: string; slug: string };

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
  images: PhotoRef[];
};

const PEJUKUTAN = [
  { album: "p4-pejukutan", slug: "dji-0149-hdr" },
  { album: "p4-pejukutan", slug: "dji-0154-hdr" },
  { album: "p4-pejukutan", slug: "dji-0159-hdr" },
  { album: "p4-pejukutan", slug: "photo-from-moniq" },
  { album: "p4-pejukutan", slug: "whatsapp-image-2024-03-20-at-17-04-33" },
  { album: "p4-pejukutan", slug: "whatsapp-image-2017-02-04-at-1-59-05-pm" },
];

const KELINGKING = [
  { album: "p9-kelingking", slug: "l4-16122020-dji-0057-1" },
  { album: "p9-kelingking", slug: "dji-0001-hdr-4" },
  { album: "p9-kelingking", slug: "dji-0011-hdr-3" },
  { album: "p9-kelingking", slug: "view-kav-14" },
  { album: "p9-kelingking", slug: "sunset-kv-14" },
  { album: "p9-kelingking", slug: "sunset-p914" },
];

export const listings: Listing[] = [
  {
    code: "P4-D",
    slug: "tanah-kavling-pejukutan-kavling-d",
    type: "tanah",
    status: "dijual",
    area: "Pejukutan",
    regency: "Klungkung",
    price: 350000000,
    priceUnit: "total",
    bedrooms: null,
    bathrooms: null,
    landSize: 500,
    buildingSize: null,
    certificate: "SHM",
    tenure: "freehold",
    zoning: "pariwisata",
    featured: true,
    publishedAt: "2026-08-28",
    title: {
      id: "Tanah Kavling 500 m² di Pejukutan, Nusa Penida",
      en: "500 sqm Land Plot in Pejukutan, Nusa Penida",
    },
    description: {
      id: "Kavling D di Desa Pejukutan, Nusa Penida. Luas 500 m² dengan lebar depan 20 meter, kontur teras siring, dan akses jalan aspal selebar 8 meter. Listrik PLN dan air PDAM sudah tersedia. Berada di ketinggian dengan pemandangan laut. Jarak tempuh 15 menit ke Dermaga Sampalan, 20 menit ke pusat kota, dan 20 menit ke Pantai Atuh. Sertifikat SHM. Tersedia dokumen KKPR untuk villa.",
      en: "Plot D in Pejukutan village, Nusa Penida. 500 sqm with a 20-metre frontage, terraced contour, and an 8-metre asphalt access road. Mains electricity and water are connected. Elevated position with a sea view. Fifteen minutes to Sampalan harbour, twenty to the town centre, twenty to Atuh Beach. Freehold title. KKPR documentation for villa use is available.",
    },
    images: PEJUKUTAN,
  },
  {
    code: "P4-E",
    slug: "tanah-kavling-pejukutan-kavling-e",
    type: "tanah",
    status: "dijual",
    area: "Pejukutan",
    regency: "Klungkung",
    price: 350000000,
    priceUnit: "total",
    bedrooms: null,
    bathrooms: null,
    landSize: 480,
    buildingSize: null,
    certificate: "SHM",
    tenure: "freehold",
    zoning: "pariwisata",
    featured: false,
    publishedAt: "2026-08-28",
    title: {
      id: "Tanah Kavling 480 m² di Pejukutan, Nusa Penida",
      en: "480 sqm Land Plot in Pejukutan, Nusa Penida",
    },
    description: {
      id: "Kavling E di Desa Pejukutan, Nusa Penida. Luas 480 m², kontur teras siring, akses jalan aspal selebar 8 meter. Listrik PLN dan air PDAM sudah tersedia. Berada di ketinggian dengan pemandangan laut. Jarak tempuh 15 menit ke Dermaga Sampalan dan 20 menit ke pusat kota. Sertifikat SHM. Tersedia dokumen KKPR untuk villa.",
      en: "Plot E in Pejukutan village, Nusa Penida. 480 sqm, terraced contour, 8-metre asphalt access road. Mains electricity and water are connected. Elevated position with a sea view. Fifteen minutes to Sampalan harbour, twenty to the town centre. Freehold title. KKPR documentation for villa use is available.",
    },
    images: PEJUKUTAN,
  },
  {
    code: "P6-6",
    slug: "tanah-kavling-tebing-sekartaji",
    type: "tanah",
    status: "dijual",
    area: "Sekartaji",
    regency: "Klungkung",
    price: 1901376750,
    priceUnit: "total",
    bedrooms: null,
    bathrooms: null,
    landSize: 650,
    buildingSize: null,
    certificate: "SHM",
    tenure: "freehold",
    zoning: null,
    featured: true,
    publishedAt: "2026-08-28",
    title: {
      id: "Tanah Kavling 650 m² Tepi Tebing di Sekartaji, Nusa Penida",
      en: "650 sqm Clifftop Land Plot in Sekartaji, Nusa Penida",
    },
    description: {
      id: "Kavling 6 di Desa Sekartaji, Nusa Penida. Luas 650 m² atau 6,5 are, dimensi sekitar 44 × 15 meter dengan lebar depan 15 meter. Berada tepat di tepi tebing menghadap Samudra Hindia. Kontur tanah rata, akses jalan aspal selebar 8 meter. Listrik PLN sudah tersedia; pipa PDAM sudah terpasang, namun air dari pemerintah belum mengalir dan waktunya belum diketahui. Jarak tempuh 40 menit ke Dermaga Toyapakeh dan 30 menit ke pusat kota. Sertifikat SHM.",
      en: "Plot 6 in Sekartaji village, Nusa Penida. 650 sqm, roughly 44 × 15 metres with a 15-metre frontage, sitting directly on the cliff edge above the Indian Ocean. Level ground, 8-metre asphalt access road. Mains electricity is connected; water pipes are laid but the municipal supply is not yet flowing and no date has been given. Forty minutes to Toyapakeh harbour, thirty to the town centre. Freehold title.",
    },
    images: [
      { album: "p6-sekartaji", slug: "sekartaji-cliff-6-on-the-land-1" },
      { album: "p6-sekartaji", slug: "20170716-141935-1" },
      { album: "p6-sekartaji", slug: "20170716-142004-effects-1" },
      { album: "p6-sekartaji", slug: "20170716-141736-1" },
    ],
  },
  {
    code: "P9-9",
    slug: "tanah-kavling-tebing-kelingking-9",
    type: "tanah",
    status: "dijual",
    area: "Bunga Mekar",
    regency: "Klungkung",
    price: 1200000000,
    priceUnit: "total",
    bedrooms: null,
    bathrooms: null,
    landSize: 545,
    buildingSize: null,
    certificate: "SHM",
    tenure: "freehold",
    zoning: "pariwisata",
    featured: true,
    publishedAt: "2026-08-28",
    title: {
      id: "Tanah Kavling 545 m² Tepi Tebing dekat Pantai Kelingking",
      en: "545 sqm Clifftop Land Plot near Kelingking Beach",
    },
    description: {
      id: "Kavling 9 di Desa Bunga Mekar, Nusa Penida. Luas 545 m² dengan dimensi 15 × 39 meter, kontur teras siring, akses jalan aspal selebar 8 meter. Berada di tepi tebing dengan dua arah pandang: Pantai Kelingking di depan kavling dan matahari terbenam di belakangnya. Listrik PLN dan air PDAM belum tersedia; pilihannya membeli air atau membuat sumur bor. Jarak tempuh 5 menit ke Pantai Kelingking, 35 menit ke Dermaga Toyapakeh, dan 35 menit ke RS Pratama. Sertifikat SHM. Tersedia dokumen KKPR untuk villa.",
      en: "Plot 9 in Bunga Mekar village, Nusa Penida. 545 sqm measuring 15 × 39 metres, terraced contour, 8-metre asphalt access road. On the cliff edge with two outlooks: Kelingking Beach in front and the sunset behind. Neither mains electricity nor water is connected; the options are trucked water or a bore well. Five minutes to Kelingking Beach, thirty-five to Toyapakeh harbour, thirty-five to Pratama hospital. Freehold title. KKPR documentation for villa use is available.",
    },
    images: KELINGKING,
  },
  {
    code: "P9-14",
    slug: "tanah-kavling-tebing-kelingking-14",
    type: "tanah",
    status: "dijual",
    area: "Bunga Mekar",
    regency: "Klungkung",
    price: 1000000000,
    priceUnit: "total",
    bedrooms: null,
    bathrooms: null,
    landSize: 446,
    buildingSize: null,
    certificate: "SHM",
    tenure: "freehold",
    zoning: "pariwisata",
    featured: false,
    publishedAt: "2026-08-28",
    title: {
      id: "Tanah Kavling 446 m² Tepi Tebing dekat Pantai Kelingking",
      en: "446 sqm Clifftop Land Plot near Kelingking Beach",
    },
    description: {
      id: "Kavling 14 di Desa Bunga Mekar, Nusa Penida. Luas 446 m², kontur teras siring, akses jalan aspal selebar 8 meter. Berada di tepi tebing dengan pandangan ke laut dan matahari terbenam. Listrik PLN dan air PDAM belum tersedia; pilihannya membeli air atau membuat sumur bor. Jarak tempuh 5 menit ke Pantai Kelingking dan 35 menit ke Dermaga Toyapakeh. Sertifikat SHM. Tersedia dokumen KKPR untuk villa.",
      en: "Plot 14 in Bunga Mekar village, Nusa Penida. 446 sqm, terraced contour, 8-metre asphalt access road. On the cliff edge looking out to sea and to the sunset. Neither mains electricity nor water is connected; the options are trucked water or a bore well. Five minutes to Kelingking Beach, thirty-five to Toyapakeh harbour. Freehold title. KKPR documentation for villa use is available.",
    },
    images: KELINGKING,
  },
  {
    code: "P11-A1",
    slug: "tanah-kavling-klumpu-a1",
    type: "tanah",
    status: "dijual",
    area: "Klumpu",
    regency: "Klungkung",
    price: 275000000,
    priceUnit: "total",
    bedrooms: null,
    bathrooms: null,
    landSize: 330,
    buildingSize: null,
    certificate: "SHM",
    tenure: "freehold",
    zoning: null,
    featured: false,
    publishedAt: "2026-08-28",
    title: {
      id: "Tanah Kavling 330 m² di Klumpu, Nusa Penida",
      en: "330 sqm Land Plot in Klumpu, Nusa Penida",
    },
    description: {
      id: "Kavling A1 di Desa Klumpu, Nusa Penida. Luas 330 m² atau 3,3 are, kontur tanah rata dan lahan sudah selesai ditata. Listrik PLN dan air PDAM sudah tersedia, tiang listrik sudah berdiri. Berada di tengah pemukiman, 500 meter dari jalan poros menuju Broken Beach, dekat SPBU, bank, dan jalan lingkar. Jarak tempuh 10 menit ke Dermaga Toyapakeh, 20 menit ke pusat kota, 15 menit ke Pura Dalem Ped. Sertifikat SHM.",
      en: "Plot A1 in Klumpu village, Nusa Penida. 330 sqm on level, already-graded ground. Mains electricity and water are connected and the power poles are up. Set among housing, 500 metres from the main road to Broken Beach, close to a petrol station, a bank, and the ring road. Ten minutes to Toyapakeh harbour, twenty to the town centre, fifteen to Pura Dalem Ped. Freehold title.",
    },
    images: [
      { album: "p11-klumpu", slug: "klumpu" },
      { album: "p11-klumpu", slug: "20210724-112126" },
      { album: "p11-klumpu", slug: "20210724-112136" },
      { album: "p11-klumpu", slug: "20190712-094921" },
      { album: "p11-klumpu", slug: "20190712-095156" },
      { album: "p11-klumpu", slug: "photo-from-moniq" },
    ],
  },
  {
    code: "SBY-KOST",
    slug: "rumah-kost-24-kamar-pradah-indah-surabaya",
    type: "rumah",
    status: "dijual",
    area: "Pradah Indah",
    regency: "Surabaya",
    price: 14000000000,
    priceUnit: "total",
    bedrooms: 24,
    bathrooms: 24,
    landSize: 1883,
    buildingSize: null,
    certificate: "SHM",
    tenure: "freehold",
    zoning: "komersial",
    featured: false,
    publishedAt: "2026-08-28",
    title: {
      id: "Rumah Kost 24 Kamar di Pradah Indah, Surabaya Barat",
      en: "24-Room Boarding House in Pradah Indah, West Surabaya",
    },
    description: {
      id: "Rumah kost di Jalan Bulu Jaya 6, Pradah Indah Lontar, Surabaya Barat. Luas tanah 1.883 m² termasuk 188 m² akses jalan. Terdiri dari bangunan kost dua lantai berisi 24 kamar berukuran 3 × 6 meter yang masing-masing sudah memiliki kamar mandi dalam dan meteran PDAM sendiri, rumah induk tiga lantai berukuran 9 × 12 meter per lantai, dan paviliun dua lantai berukuran 8 × 12 meter. Daya listrik terpisah untuk tiap bangunan. Sertifikat SHM. Harga masih dapat dinegosiasikan.",
      en: "Boarding house on Jalan Bulu Jaya 6, Pradah Indah Lontar, West Surabaya. 1,883 sqm of land including a 188 sqm access road. It comprises a two-storey block of 24 rooms, each 3 × 6 metres with its own bathroom and water meter; a three-storey main house of 9 × 12 metres per floor; and a two-storey pavilion of 8 × 12 metres. Each building has its own electricity supply. Freehold title. The price is negotiable.",
    },
    images: [
      { album: "kost-bulu-jaya", slug: "whatsapp-image-2024-03-06-at-13-41-53" },
      { album: "kost-bulu-jaya", slug: "whatsapp-image-2024-03-06-at-13-41-54" },
      { album: "kost-bulu-jaya", slug: "whatsapp-image-2024-03-06-at-13-41-55" },
      { album: "kost-bulu-jaya", slug: "whatsapp-image-2024-03-06-at-13-41-56" },
      { album: "kost-bulu-jaya", slug: "whatsapp-image-2024-03-06-at-13-41-57" },
      { album: "kost-bulu-jaya", slug: "whatsapp-image-2024-03-06-at-13-41-54-1" },
    ],
  },
  {
    code: "SBY-RUKO",
    slug: "ruko-tiga-unit-darmo-park-surabaya",
    type: "ruko",
    status: "dijual",
    area: "Darmo Park",
    regency: "Surabaya",
    price: 4000000000,
    priceUnit: "total",
    bedrooms: null,
    bathrooms: null,
    landSize: 180,
    buildingSize: null,
    certificate: "HGB",
    tenure: "freehold",
    zoning: "komersial",
    featured: false,
    publishedAt: "2026-08-28",
    title: {
      id: "Tiga Ruko Tersambung Dua Lantai di Darmo Park, Surabaya",
      en: "Three Connected Two-Storey Shophouses in Darmo Park, Surabaya",
    },
    description: {
      id: "Tiga unit ruko yang tersambung menjadi satu di Komplek Darmo Park 1, Jalan Mayjen Sungkono, Kecamatan Sawahan, Surabaya. Luas tanah 180 m², tiap unit berukuran 5 × 12 meter dan bertingkat dua. Terdapat ruang dapur bekas restoran dengan cerobong besar, teras di lantai dua berukuran 1,8 × 10 meter, dan gudang. Tangga ke lantai dua hanya satu. Daya listrik 10.800 watt dari dua token PLN. Dibeli dari pengembang tahun 1984 dan direnovasi tahun 2016. Sertifikat HGB.",
      en: "Three shophouse units joined into one at Darmo Park 1, Jalan Mayjen Sungkono, Sawahan, Surabaya. 180 sqm of land, each unit 5 × 12 metres over two floors. It includes a former restaurant kitchen with a large extraction flue, a 1.8 × 10 metre first-floor terrace, and a store room. There is a single staircase to the upper floor. Electricity is 10,800 watts across two meters. Bought from the developer in 1984 and renovated in 2016. Leasehold-to-build title (HGB).",
    },
    /* Foto "2" tidak dipakai: di situ terpampang papan DIJUAL milik agen lain
       lengkap dengan nomor teleponnya, dan itu akan ikut tayang di situs. */
    images: [
      { album: "ruko-darmo-park", slug: "17" },
      { album: "ruko-darmo-park", slug: "3" },
      { album: "ruko-darmo-park", slug: "16" },
      { album: "ruko-darmo-park", slug: "9" },
      { album: "ruko-darmo-park", slug: "7" },
      { album: "ruko-darmo-park", slug: "10" },
    ],
  },
  {
    code: "dekpi01",
    slug: "tanah-77-are-getakan-klungkung",
    type: "tanah",
    status: "dijual",
    area: "Getakan",
    regency: "Klungkung",
    /* Rp 55 juta per are x 77 are. Penjual menyebut "buka harga 55/are",
       jadi angka ini hasil perkalian, bukan total yang dia sebut langsung. */
    price: 4270000000,
    priceUnit: "total",
    bedrooms: null,
    bathrooms: null,
    landSize: 7700,
    buildingSize: null,
    certificate: "Belum dikonfirmasi",
    tenure: "freehold",
    zoning: null,
    featured: false,
    publishedAt: "2026-08-28",
    title: {
      id: "Lahan 77 Are di Getakan, Klungkung",
      en: "7,700 sqm Land in Getakan, Klungkung",
    },
    description: {
      id: "Lahan seluas 77 are di daerah Getakan, Klungkung. Berada di samping jalan raya. Di atas lahan terdapat tanaman pohon cengkeh. Harga pembuka Rp 55 juta per are. Jenis sertifikat belum dikonfirmasi penjual.",
      en: "A 7,700 sqm parcel in Getakan, Klungkung, beside the main road, planted with clove trees. Asking price is Rp 55 million per are. The certificate type has not yet been confirmed by the seller.",
    },
    images: [
      { album: "dekpi01-getakan", slug: "dekpi01-getakan-01-selatan" },
      { album: "dekpi01-getakan", slug: "dekpi01-getakan-02-barat" },
      { album: "dekpi01-getakan", slug: "dekpi01-getakan-03-utara" },
      { album: "dekpi01-getakan", slug: "dekpi01-getakan-04-timur" },
      { album: "dekpi01-getakan", slug: "dekpi01-getakan-05" },
      { album: "dekpi01-getakan", slug: "dekpi01-getakan-06" },
      { album: "dekpi01-getakan", slug: "dekpi01-getakan-07" },
    ],
  },
  {
    code: "mahar01",
    slug: "tanah-2-are-saba-gianyar",
    type: "tanah",
    status: "dijual",
    area: "Saba",
    regency: "Gianyar",
    price: 735000000,
    priceUnit: "total",
    bedrooms: null,
    bathrooms: null,
    landSize: 200,
    buildingSize: null,
    certificate: "Belum dikonfirmasi",
    tenure: "freehold",
    zoning: null,
    featured: false,
    publishedAt: "2026-08-28",
    title: {
      id: "Tanah 2 Are di Kawasan Villa dekat Saba, Gianyar",
      en: "200 sqm Land in a Villa Area near Saba, Gianyar",
    },
    description: {
      id: "Tanah seluas 2 are di kawasan villa dekat Saba, Gianyar. Ditawarkan Rp 700 juta untuk keseluruhan bidang. Jenis sertifikat belum dikonfirmasi penjual.",
      en: "A 200 sqm plot in a villa area near Saba, Gianyar. Offered at Rp 700 million for the whole parcel. The certificate type has not yet been confirmed by the seller.",
    },
    images: [
      { album: "mahar01-saba", slug: "mahar01-saba-03" },
      { album: "mahar01-saba", slug: "mahar01-saba-04" },
      { album: "mahar01-saba", slug: "mahar01-saba-01" },
      { album: "mahar01-saba", slug: "mahar01-saba-02" },
    ],
  },
  {
    code: "buyand01",
    slug: "tanah-1-09-are-ungasan-badung",
    type: "tanah",
    status: "dijual",
    area: "Ungasan",
    regency: "Badung",
    price: 563000000,
    priceUnit: "total",
    bedrooms: null,
    bathrooms: null,
    landSize: 109,
    buildingSize: null,
    certificate: "Belum dikonfirmasi",
    tenure: "freehold",
    zoning: null,
    featured: false,
    publishedAt: "2026-08-28",
    title: {
      id: "Tanah 1,09 Are di Ungasan, Kuta Selatan",
      en: "109 sqm Land in Ungasan, South Kuta",
    },
    description: {
      id: "Tanah seluas 1,09 are di Ungasan, Kecamatan Kuta Selatan, Badung. Harga Rp 528 juta dan masih dapat dinegosiasikan. Penjual mengoreksi luasnya dari 96 m² menjadi 1,09 are. Surat ukur tersedia; jenis sertifikat belum dikonfirmasi penjual.",
      en: "A 109 sqm plot in Ungasan, South Kuta, Badung. Priced at Rp 528 million, negotiable. The seller corrected the area from 96 sqm to 1.09 are. A survey letter is available; the certificate type has not yet been confirmed by the seller.",
    },
    images: [
      { album: "buyand01-ungasan", slug: "buyand01-ungasan-01" },
      { album: "buyand01-ungasan", slug: "buyand01-ungasan-02" },
      { album: "buyand01-ungasan", slug: "buyand01-ungasan-03" },
    ],
  },
  {
    code: "mbakind01",
    slug: "tanah-8-32-are-jimbaran-badung",
    type: "tanah",
    status: "dijual",
    area: "Jimbaran",
    regency: "Badung",
    /* Rp 850 juta per are, dikonfirmasi klien, x 8,32 are = Rp 7,072 M,
       ditambah markup Rp 35 juta. */
    price: 7107000000,
    priceUnit: "total",
    bedrooms: null,
    bathrooms: null,
    landSize: 832,
    buildingSize: null,
    certificate: "SHM",
    tenure: "freehold",
    zoning: "perumahan",
    featured: true,
    publishedAt: "2026-08-28",
    title: {
      id: "Tanah 8,32 Are di Jimbaran, Kuta Selatan",
      en: "832 sqm Land in Jimbaran, South Kuta",
    },
    description: {
      id: "Tanah seluas 8,32 are di Jimbaran, Kuta Selatan, Badung. Bentuk kotak dengan kontur rata, lebar depan 22 meter dan menghadap langsung ke jalan. Akses jalan paving selebar 6 meter. Berjarak satu menit ke Pantai Jimbaran dan 150 meter dari Harley Davidson Jimbaran, dekat Intercontinental Hotel. Sertifikat SHM dengan aspek perumahan. Harga masih dapat dinegosiasikan.",
      en: "A 832 sqm plot in Jimbaran, South Kuta, Badung. Square in shape and level, with a 22-metre frontage facing directly onto the road. Access is a 6-metre paved road. One minute from Jimbaran Beach and 150 metres from Harley Davidson Jimbaran, near the Intercontinental Hotel. Freehold title, zoned residential. The price is negotiable.",
    },
    images: [{ album: "mbakind01-jimbaran", slug: "mbakind01-jimbaran-01" }],
  },
  {
    /* Bidang di sebelah buyand01, dikonfirmasi klien sebagai properti terpisah.
       Korva mengirimnya dengan kode yang sama, jadi kode di sini dibedakan agar
       pesan WhatsApp tiap listing tetap bisa ditelusuri. Foto yang dipakai sama
       persis dengan buyand01 — sudah diverifikasi identik — karena Korva memang
       mengirim satu set foto untuk kedua bidang yang bersebelahan itu. */
    code: "buyand02",
    slug: "tanah-140-m2-ungasan-badung",
    type: "tanah",
    status: "dijual",
    area: "Ungasan",
    regency: "Badung",
    price: 885000000,
    priceUnit: "total",
    bedrooms: null,
    bathrooms: null,
    landSize: 140,
    buildingSize: null,
    certificate: "Belum dikonfirmasi",
    tenure: "freehold",
    zoning: null,
    featured: false,
    publishedAt: "2026-08-28",
    title: {
      id: "Tanah 140 m² di Ungasan, Kuta Selatan",
      en: "140 sqm Land in Ungasan, South Kuta",
    },
    description: {
      id: "Tanah seluas 140 m² di Ungasan, Kecamatan Kuta Selatan, Badung. Bersebelahan dengan bidang 1,09 are yang juga ditawarkan. Ditawarkan Rp 850 juta untuk keseluruhan bidang dan masih dapat dinegosiasikan. Jenis sertifikat belum dikonfirmasi penjual.",
      en: "A 140 sqm plot in Ungasan, South Kuta, Badung, adjoining the 109 sqm parcel also on offer. Offered at Rp 850 million for the whole parcel, negotiable. The certificate type has not yet been confirmed by the seller.",
    },
    images: [
      { album: "buyand01-ungasan", slug: "buyand01-ungasan-02" },
      { album: "buyand01-ungasan", slug: "buyand01-ungasan-03" },
      { album: "buyand01-ungasan", slug: "buyand01-ungasan-01" },
    ],
  },
];
