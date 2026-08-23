/**
 * Data perusahaan dan kontak.
 *
 * KORVA adalah payung untuk dua badan usaha:
 *   Korva Pro    PT Maha Anugrah Selaras Propertindo, pemasaran properti
 *   Korva Studio PT Berkah Bali Bersinar, arsitektur, konstruksi, perizinan
 *
 * Semua yang ada di file ini tampil di header, footer, halaman Kontak, dan
 * structured data. Kalau ada yang berubah, ubah di sini saja.
 */

export const site = {
  name: "KORVA",
  tagline: { id: "Properti, Arsitektur, dan Konstruksi", en: "Property, Architecture, and Construction" },

  /* -------------------------------------------------------------------------
     DUA DIVISI
     `whatsapp` masing-masing divisi dipakai tombol tanya di halaman terkait.

     CATATAN: pembagian nomor ke divisi belum dikonfirmasi klien. Nomor
     0812-3644-7099 dipakai untuk Korva Pro karena nomor itu yang sudah
     terdaftar di profil bisnis pemasaran properti. Kalau ternyata terbalik,
     cukup tukar dua baris `whatsapp` di bawah.
     ------------------------------------------------------------------------- */
  divisions: {
    pro: {
      key: "pro",
      name: "Korva Pro",
      legalName: "PT Maha Anugrah Selaras Propertindo",
      whatsapp: "6281236447099",
      phoneDisplay: "+62 812-3644-7099",
      phoneHref: "tel:+6281236447099",
      role: {
        id: "Pemasaran properti, konsultasi investasi lahan, jual beli villa dan tanah kavling.",
        en: "Property marketing, land investment consulting, sale and purchase of villas and land plots.",
      },
    },
    studio: {
      key: "studio",
      name: "Korva Studio",
      legalName: "PT Berkah Bali Bersinar",
      whatsapp: "62881037652019",
      phoneDisplay: "+62 881-0376-52019",
      phoneHref: "tel:+62881037652019",
      role: {
        id: "Perancangan arsitektur, gambar kerja dan struktur, rendering 3D, jasa kontraktor, serta pengurusan PBG dan SLF.",
        en: "Architectural design, working and structural drawings, 3D rendering, contracting, and PBG and SLF permit handling.",
      },
    },
  },

  /** Kantor bersama kedua divisi. */
  address: {
    street: "Jl. Goa Gong, Pertokoan No. 5",
    locality: "Jimbaran, Kec. Kuta Selatan",
    regency: "Kabupaten Badung",
    region: "Bali",
    postalCode: "80361",
    country: "ID",
    countryName: { id: "Indonesia", en: "Indonesia" },
  },

  /**
   * Titik peta. Ini koordinat ruas Jl. Goa Gong di Jimbaran, bukan titik pasti
   * pertokoan nomor 5, karena nomor itu belum terdaftar di peta. Tombol peta di
   * situs memakai pencarian alamat, bukan koordinat ini, supaya tidak
   * menunjukkan titik yang salah.
   */
  geo: { lat: -8.8023, lng: 115.1727 },
  mapsQuery: "Jl. Goa Gong Pertokoan No. 5, Jimbaran, Kuta Selatan, Badung, Bali",

  /** Wilayah kerja yang disebut di konsep. */
  serviceAreas: ["Badung", "Denpasar", "Gianyar", "Tabanan"],

  /**
   * Jam buka. Angka ini terbawa dari profil bisnis pemasaran properti yang
   * sudah ada milik pemilik yang sama. BELUM dikonfirmasi untuk kantor
   * Jimbaran. Konfirmasi ke klien lalu perbaiki di sini kalau berbeda.
   */
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "10:00", closes: "17:00" },
  ],
  closedDays: ["Sunday"],

  url: process.env.NEXT_PUBLIC_SITE_URL || "https://pepo.onyxcreative.asia",
} as const;

export type Division = keyof typeof site.divisions;
export type Site = typeof site;

/** Kedua divisi sebagai daftar, untuk bagian yang menampilkan keduanya. */
export const divisionList = [site.divisions.pro, site.divisions.studio] as const;
