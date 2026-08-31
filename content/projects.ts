/* ===========================================================================
   PORTOFOLIO PROYEK
   ===========================================================================

   Daftar ini KOSONG karena Korva belum mengirimkan materinya.

   Yang dibutuhkan per proyek: sepasang gambar tahap rencana dan hasil jadi,
   lokasi (desa atau kecamatan, dan kabupaten), luas bangunan, dan lingkup
   pekerjaan yang dikerjakan Korva.

   Folder VILLA REHAN di Drive berisi 30 foto villa yang sudah jadi, tetapi
   tidak ada foto tahap rencananya dan lokasinya tidak pernah disebut, jadi
   belum bisa dipakai di sini.

   Selama daftar ini kosong, halaman Portofolio menampilkan keterangan kosong
   dan bagian portofolio di beranda tidak muncul sama sekali. Itu memang yang
   diinginkan: lebih baik kosong daripada memajang proyek yang tidak pernah
   dikerjakan.

   Cara menambah: salin bentuk Project di bawah, isi datanya, simpan.
   =========================================================================== */

export const SAMPLE_PROJECTS = false;

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

export const projects: Project[] = [];
