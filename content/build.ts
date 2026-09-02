/* ===========================================================================
   LAYANAN KORVA STUDIO
   ===========================================================================

   Daftar lingkup pekerjaan yang ditawarkan Korva Studio, tampil di halaman
   Bangun & Desain.

   ---------------------------------------------------------------------------
   KALKULATOR ESTIMASI BANGUN DIKELUARKAN SEMENTARA
   ---------------------------------------------------------------------------
   Paket harga dan kalkulator estimasi biaya sudah dihapus dari situs karena
   Korva belum pernah mengirimkan daftar harga konstruksi. Angka yang sempat
   ada di sini adalah perkiraan, bukan tarif Korva.

   Untuk memasangnya kembali, yang dibutuhkan dari Korva: harga per meter
   persegi untuk tiap paket, dan apa saja yang termasuk di dalamnya.
   =========================================================================== */

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
