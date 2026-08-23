/* ===========================================================================
   PORTOFOLIO KORVA STUDIO
   ===========================================================================

   Dipakai halaman Portofolio dan bagian portofolio di halaman Bangun & Desain.

   ---------------------------------------------------------------------------
   PENTING: ISI FILE INI MASIH DATA CONTOH
   ---------------------------------------------------------------------------
   Proyek di bawah adalah contoh untuk memperlihatkan tampilan halaman, bukan
   proyek yang benar-benar dikerjakan. Selama SAMPLE_PROJECTS masih true,
   penanda "data contoh" tampil di layar.

   Setelah proyek asli dimasukkan, ubah menjadi false.

   ---------------------------------------------------------------------------
   CARA MENAMBAH PROYEK

   slug        Potongan alamat halaman, huruf kecil, pakai tanda minus, unik.
   type        "villa" | "rumah" | "komersial"
   area        Kawasan proyek, misal "Canggu" atau "Ubud".
   regency     Kabupaten atau kota.
   scope       Daftar lingkup pekerjaan yang ditangani di proyek ini.
   buildingSize Luas bangunan dalam meter persegi, angka saja.
   title       Judul proyek, dua bahasa.
   description Keterangan proyek, dua bahasa.

   before      Gambar tahap awal, misal render 3D atau kondisi lahan.
   after       Gambar hasil jadi.
               Keduanya sekarang memakai gambar tempat kosong yang dibuat
               otomatis. Kalau sudah ada render dan foto asli, unggah ke folder
               public/photos lalu ganti isinya, contoh:
               before: "/photos/villa-canggu-render.jpg"
               after:  "/photos/villa-canggu-jadi.jpg"
   =========================================================================== */

export const SAMPLE_PROJECTS = true;

export type ProjectType = "villa" | "rumah" | "komersial";

export type Project = {
  slug: string;
  type: ProjectType;
  area: string;
  regency: string;
  buildingSize: number;
  scope: { id: string[]; en: string[] };
  title: { id: string; en: string };
  description: { id: string; en: string };
  before: string;
  after: string;
};

export const projects: Project[] = [
  {
    slug: "villa-dua-lantai-canggu",
    type: "villa",
    area: "Kuta Utara",
    regency: "Badung",
    buildingSize: 240,
    scope: {
      id: ["Desain arsitektur", "Rendering 3D", "Gambar struktur", "Konstruksi", "PBG"],
      en: ["Architectural design", "3D rendering", "Structural drawings", "Construction", "PBG"],
    },
    title: {
      id: "Villa Dua Lantai di Canggu",
      en: "Two-Storey Villa in Canggu",
    },
    description: {
      id: "Villa dua lantai dengan kolam renang dan ruang terbuka di lantai dasar. Dikerjakan dari tahap desain sampai perizinan PBG.",
      en: "Two-storey villa with a pool and open living space on the ground floor. Handled from design through to PBG permitting.",
    },
    before: "/graphics/project-villa-dua-lantai-canggu-before.svg",
    after: "/graphics/project-villa-dua-lantai-canggu-after.svg",
  },
  {
    slug: "villa-taman-ubud",
    type: "villa",
    area: "Ubud",
    regency: "Gianyar",
    buildingSize: 310,
    scope: {
      id: ["Desain arsitektur", "Desain lanskap", "Konstruksi", "PBG", "SLF"],
      en: ["Architectural design", "Landscape design", "Construction", "PBG", "SLF"],
    },
    title: {
      id: "Villa dengan Taman di Ubud",
      en: "Garden Villa in Ubud",
    },
    description: {
      id: "Villa satu lantai dengan paviliun terpisah dan taman mengelilingi bangunan. Lingkup mencakup desain lanskap dan pengurusan SLF.",
      en: "Single-storey villa with a separate pavilion and garden on all sides. Scope covered landscape design and SLF handling.",
    },
    before: "/graphics/project-villa-taman-ubud-before.svg",
    after: "/graphics/project-villa-taman-ubud-after.svg",
  },
  {
    slug: "rumah-tinggal-jimbaran",
    type: "rumah",
    area: "Kuta Selatan",
    regency: "Badung",
    buildingSize: 165,
    scope: {
      id: ["Desain arsitektur", "Gambar struktur", "Konstruksi"],
      en: ["Architectural design", "Structural drawings", "Construction"],
    },
    title: {
      id: "Rumah Tinggal di Jimbaran",
      en: "Private House in Jimbaran",
    },
    description: {
      id: "Rumah tinggal dua lantai dengan carport dan halaman belakang. Dikerjakan dari gambar kerja sampai serah terima bangunan.",
      en: "Two-storey private house with a carport and rear yard. Handled from working drawings through to handover.",
    },
    before: "/graphics/project-rumah-tinggal-jimbaran-before.svg",
    after: "/graphics/project-rumah-tinggal-jimbaran-after.svg",
  },
  {
    slug: "ruang-komersial-kedungu",
    type: "komersial",
    area: "Kediri",
    regency: "Tabanan",
    buildingSize: 420,
    scope: {
      id: ["Desain arsitektur", "Rendering 3D", "MEP", "Konstruksi", "PBG", "SLF"],
      en: ["Architectural design", "3D rendering", "MEP", "Construction", "PBG", "SLF"],
    },
    title: {
      id: "Ruang Komersial di Kedungu",
      en: "Commercial Space in Kedungu",
    },
    description: {
      id: "Bangunan komersial satu lantai dengan area terbuka dan ruang servis terpisah. Lingkup mencakup perencanaan MEP dan perizinan.",
      en: "Single-storey commercial building with an open area and separate service space. Scope covered MEP planning and permitting.",
    },
    before: "/graphics/project-ruang-komersial-kedungu-before.svg",
    after: "/graphics/project-ruang-komersial-kedungu-after.svg",
  },
];
