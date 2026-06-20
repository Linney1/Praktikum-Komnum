# Praktikum Komputasi Numerik - PPT 6

Aplikasi berbasis web untuk menghitung dan membandingkan integrasi numerik menggunakan **Metode Trapezoidal Komposit** dan **Metode Romberg (Richardson Extrapolation)**. Website ini memvisualisasikan hasil perhitungan dalam bentuk tabel iterasi serta grafik interaktif.

## Anggota Kelompok 7
* I Dewa Gede Putra Susila — 5025251196
* Muhammad Raffy Adika P.R. — 5025251229
* Althof Rahmatullah — 5025251204

---

## Fitur Utama
* **Komparasi Metode**: Membandingkan hasil integrasi, jumlah interval, dan estimasi error antara Trapezoidal dan Romberg.
* **Tabel Romberg**: Menampilkan matriks ekstrapolasi Richardson ($R[i][j]$) secara dinamis.
* **Tabel Trapesium**: Menampilkan tahapan nilai integrasi berdasarkan variasi jumlah interval.
* **Grafik Interaktif**: Visualisasi kurva fungsi $f(x)$ bersamaan dengan pendekatan area menggunakan Chart.js.

---

## Format Input Fungsi
Penulisan fungsi matematika pada kolom input `f(x)` memanfaatkan fungsi `eval()` JavaScript standard, sehingga harus mengikuti format objek `Math` bawaan:

* **Variabel**: Gunakan huruf `x` kecil.
* **Operasi Dasar**: Gunakan `*` untuk perkalian, `/` untuk pembagian, `+` untuk penjumlahan, dan `-` untuk pengurangan.
* **Pangkat**: Gunakan `Math.pow(x, 2)` atau operator eksponen `x**2`.
* **Fungsi Matematika**:
  * Sinus: `Math.sin(x)`
  * Kosinus: `Math.cos(x)`
  * Eksponensial ($e^x$): `Math.exp(x)`
  * Logaritma Natural ($\ln(x)$): `Math.log(x)`

---

## Format Output
* **Tabel Perbandingan**: Menampilkan komparasi *final result* dan persentase error estimasi dari kedua metode.
* **Tabel Iterasi**: *Breakdown* nilai kalkulasi per tingkat level/interval.
* **Visualisasi Grafik**: Plot kurva $f(x)$, grid area trapesium, dan titik-titik sampel subinterval Romberg.

---

## Panduan Penggunaan
1. Masukkan rumus fungsi pada kolom **f(x)** (misal: `x**2` atau `Math.sin(x)`).
2. Tentukan nilai **Batas Bawah (a)** dan **Batas Atas (b)**.
3. Masukkan parameter **Level Romberg (n)**, jumlah **Interval Trapesium**, serta tingkat **Presisi** angka di belakang koma.
4. Klik tombol **Hitung & Bandingkan** untuk memproses data.
5. Gunakan navigasi tab untuk berpindah antara panel Perbandingan, Tabel Romberg, Tabel Trapesium, dan Grafik.

