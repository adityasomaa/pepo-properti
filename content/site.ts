/**
 * Data kantor dan kontak.
 *
 * Angka dan alamat di file ini diambil dari profil Google Bisnis milik
 * Agency Pepo Properti Indonesia. Kalau ada yang berubah, ubah di sini saja:
 * halaman Kontak, footer, dan structured data semuanya membaca dari file ini.
 */

export const site = {
  name: "Pepo Properti",
  legalName: "Agency Pepo Properti Indonesia",

  // Alamat kantor.
  address: {
    street: "Pertokoan Grand Sudirman Agung Blok C No. 22",
    locality: "Panjer, Denpasar Selatan",
    region: "Bali",
    postalCode: "80113",
    country: "ID",
    countryName: { id: "Indonesia", en: "Indonesia" },
  },

  // Titik kantor di peta.
  geo: { lat: -8.6757474, lng: 115.2180345 },

  // Nomor telepon. `whatsapp` dipakai untuk semua tombol tanya di situs.
  phoneDisplay: "+62 812-3644-7099",
  phoneHref: "tel:+6281236447099",
  whatsapp: "6281236447099",

  email: "",

  // Jam buka. `days` memakai format hari Schema.org.
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "10:00", closes: "17:00" },
  ],
  closedDays: ["Sunday"],

  mapsUrl: "https://maps.google.com/?cid=5181306759239992846",

  // Alamat website. Dipakai untuk canonical, sitemap, robots, gambar preview,
  // dan tautan halaman yang ikut terkirim di setiap pesan WhatsApp.
  // Diisi lewat NEXT_PUBLIC_SITE_URL saat deploy.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://pepo.onyxcreative.asia",
} as const;

export type Site = typeof site;
