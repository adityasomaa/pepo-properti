/* ===========================================================================
   PAKET PEMBANGUNAN DAN TARIF KALKULATOR
   ===========================================================================

   Dipakai halaman Bangun & Desain dan kalkulator estimasi biaya.

   ---------------------------------------------------------------------------
   PENTING: TARIF DI BAWAH MASIH ANGKA CONTOH
   ---------------------------------------------------------------------------
   Tarif per meter persegi di file ini BELUM berasal dari Korva Studio. Angka
   ini hanya untuk memperlihatkan cara kerja kalkulator. Selama tanda di bawah
   masih true, kalkulator menampilkan peringatan di layar bahwa hasilnya belum
   memakai tarif resmi.

   Setelah tarif asli diterima:
     1. ganti angka `pricePerSqm` tiap paket,
     2. ubah RATES_CONFIRMED menjadi true,
     3. peringatan di layar hilang dengan sendirinya.
   =========================================================================== */

export const RATES_CONFIRMED = false;

export type BuildPackage = {
  /** Dipakai di alamat dan penyimpanan, jangan diubah setelah dipublikasikan. */
  key: "standard" | "premium" | "luxury";
  name: { id: string; en: string };
  /** Harga bangun per meter persegi, dalam Rupiah, angka saja. */
  pricePerSqm: number;
  description: { id: string; en: string };
  /** Poin spesifikasi. Tulis apa yang termasuk, bukan janji mutu. */
  includes: { id: string[]; en: string[] };
};

export const buildPackages: BuildPackage[] = [
  {
    key: "standard",
    name: { id: "Standard", en: "Standard" },
    pricePerSqm: 6500000,
    description: {
      id: "Spesifikasi bangunan untuk hunian tinggal dengan material umum yang tersedia di pasaran Bali.",
      en: "Building specification for a private residence using materials commonly available in Bali.",
    },
    includes: {
      id: [
        "Gambar arsitektur dan gambar kerja",
        "Gambar struktur",
        "Pekerjaan struktur dan finishing standar",
        "Instalasi listrik dan plumbing dasar",
      ],
      en: [
        "Architectural and working drawings",
        "Structural drawings",
        "Structural work and standard finishes",
        "Basic electrical and plumbing installation",
      ],
    },
  },
  {
    key: "premium",
    name: { id: "Premium", en: "Premium" },
    pricePerSqm: 9500000,
    description: {
      id: "Spesifikasi untuk villa sewa atau hunian dengan finishing lebih tinggi dan penyesuaian desain.",
      en: "Specification for rental villas or homes with higher finishes and design adjustments.",
    },
    includes: {
      id: [
        "Seluruh lingkup paket Standard",
        "Rendering 3D eksterior dan interior",
        "Finishing lantai dan dinding kelas menengah atas",
        "Pekerjaan kolam renang",
        "Pengurusan PBG",
      ],
      en: [
        "Everything in the Standard package",
        "3D exterior and interior rendering",
        "Upper mid-range floor and wall finishes",
        "Swimming pool works",
        "PBG permit handling",
      ],
    },
  },
  {
    key: "luxury",
    name: { id: "Luxury", en: "Luxury" },
    pricePerSqm: 14000000,
    description: {
      id: "Spesifikasi untuk villa komersial dan bangunan dengan detail arsitektur khusus.",
      en: "Specification for commercial villas and buildings with bespoke architectural detail.",
    },
    includes: {
      id: [
        "Seluruh lingkup paket Premium",
        "Detail arsitektur khusus dan material impor",
        "Perencanaan MEP menyeluruh",
        "Desain lanskap",
        "Pengurusan PBG dan SLF",
      ],
      en: [
        "Everything in the Premium package",
        "Bespoke architectural detail and imported materials",
        "Full MEP planning",
        "Landscape design",
        "PBG and SLF permit handling",
      ],
    },
  },
];

/** Batas luas bangunan yang bisa dimasukkan ke kalkulator, dalam meter persegi. */
export const BUILD_AREA_LIMITS = { min: 20, max: 2000, step: 10, default: 150 };

/** Layanan Korva Studio, ditampilkan di halaman Bangun & Desain. */
export type StudioService = {
  key: string;
  name: { id: string; en: string };
  description: { id: string; en: string };
};

export const studioServices: StudioService[] = [
  {
    key: "arsitektur",
    name: { id: "Arsitektur dan Desain 3D", en: "Architecture and 3D Design" },
    description: {
      id: "Perencanaan tata ruang, gambar arsitektur, dan visualisasi 3D interior maupun eksterior.",
      en: "Spatial planning, architectural drawings, and 3D visualisation of interiors and exteriors.",
    },
  },
  {
    key: "struktur",
    name: { id: "Gambar Kerja dan Struktur", en: "Working and Structural Drawings" },
    description: {
      id: "Gambar kerja, gambar struktur, serta perencanaan mekanikal, elektrikal, dan plumbing.",
      en: "Working drawings, structural drawings, and mechanical, electrical, and plumbing planning.",
    },
  },
  {
    key: "konstruksi",
    name: { id: "Kontraktor dan Konstruksi", en: "Contracting and Construction" },
    description: {
      id: "Pelaksanaan pembangunan unit villa, rumah, dan ruang komersial dengan pengawasan proyek.",
      en: "Construction of villas, houses, and commercial spaces with project supervision.",
    },
  },
  {
    key: "perizinan",
    name: { id: "Perizinan PBG dan SLF", en: "PBG and SLF Permits" },
    description: {
      id: "Pengurusan Persetujuan Bangunan Gedung dan Sertifikat Laik Fungsi sesuai regulasi daerah di Bali.",
      en: "Handling of Building Approval (PBG) and Certificate of Fitness for Use (SLF) under Bali regional regulations.",
    },
  },
];
