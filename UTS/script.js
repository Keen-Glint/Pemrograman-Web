let produk = [];
let pelanggan = [];
let keranjang = [];
let transaksi = [];

// Entri Produk
document.getElementById('simpan-produk').addEventListener('click', function() {
    const nama = document.getElementById('nama-produk').value;
    const harga = parseInt(document.getElementById('harga-produk').value);
    const stok = parseInt(document.getElementById('stok-produk').value);

    produk.push({ nama, harga, stok });

    const selectProduk = document.getElementById('produk-terjual');
    const option = document.createElement('option');
    option.value = produk.length - 1;
    option.text = nama;
    selectProduk.appendChild(option);

    document.getElementById('nama-produk').value = '';
    document.getElementById('harga-produk').value = '';
    document.getElementById('stok-produk').value = '';
});

// Entri Pelanggan
document.getElementById('simpan-pelanggan').addEventListener('click', function() {
    const nama = document.getElementById('nama-pelanggan').value;
    const alamat = document.getElementById('alamat-pelanggan').value;

    pelanggan.push({ nama, alamat });
    updatePelangganDropdown();

    document.getElementById('nama-pelanggan').value = '';
    document.getElementById('alamat-pelanggan').value = '';
});

// Tambahkan opsi pelanggan ke dropdown penjualan
function updatePelangganDropdown() {
    const selectPelanggan = document.getElementById('pelanggan-terpilih');
    selectPelanggan.innerHTML = ''; // Kosongkan opsi sebelumnya
    pelanggan.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = item.nama;
        selectPelanggan.appendChild(option);
    });
}
updatePelangganDropdown();

// Penjualan
document.getElementById('tambah-keranjang').addEventListener('click', function() {
    const pelangganIndex = parseInt(document.getElementById('pelanggan-terpilih').value);
    const produkIndex = parseInt(document.getElementById('produk-terjual').value);
    const jumlah = parseInt(document.getElementById('jumlah-terjual').value);
    const produkTerpilih = produk[produkIndex];
    const pelangganTerpilih = pelanggan[pelangganIndex];

    if (produkTerpilih.stok >= jumlah) {
        keranjang.push({ produk: produkTerpilih, jumlah, pelanggan: pelangganTerpilih });
        produkTerpilih.stok -= jumlah;

        const li = document.createElement('li');
        li.textContent = `${produkTerpilih.nama} x${jumlah} (${pelangganTerpilih.nama}) = ${produkTerpilih.harga * jumlah}`;
        document.getElementById('keranjang').appendChild(li);

        const total = keranjang.reduce((acc, item) => acc + (item.produk.harga * item.jumlah), 0);
        document.getElementById('total-harga').textContent = total;
    } else {
        alert('Stok tidak mencukupi!');
    }
});

// Proses Penjualan
document.getElementById('proses-penjualan').addEventListener('click', function() {
    const tanggal = new Date();
    transaksi.push({ keranjang, tanggal });

    alert('Penjualan berhasil diproses!');
    keranjang = [];
    document.getElementById('keranjang').innerHTML = '';
    document.getElementById('total-harga').textContent = 0;
});

// Pencarian Produk
document.getElementById('cari-produk').addEventListener('click', function() {
    const kataKunci = document.getElementById('kata-kunci').value.toLowerCase();
    const hasil = produk.filter(item => item.nama.toLowerCase().includes(kataKunci));

    const hasilPencarian = document.getElementById('hasil-pencarian');
    hasilPencarian.innerHTML = '';

    if (hasil.length > 0) {
        hasil.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.nama} - Rp${item.harga} (Stok: ${item.stok})`;
            hasilPencarian.appendChild(li);
        });
    } else {
        hasilPencarian.innerHTML = '<li>Produk tidak ditemukan</li>';
    }
});

// Laporan Stok
document.getElementById('laporan-stok').addEventListener('click', function() {
    let laporan = '<h2>Laporan Stok</h2>';
    laporan += '<table><thead><tr><th>Nama Produk</th><th>Stok</th></tr></thead><tbody>';
    produk.forEach(item => {
        laporan += `<tr><td>${item.nama}</td><td>${item.stok}</td></tr>`;
    });
    laporan += '</tbody></table>';
    document.getElementById('isi-laporan').innerHTML = laporan;
});

// Laporan Pelanggan
document.getElementById('laporan-pelanggan').addEventListener('click', function() {
    let laporan = '<h2>Laporan Pelanggan</h2>';
    laporan += '<table><thead><tr><th>Nama Pelanggan</th><th>Alamat</th></tr></thead><tbody>';
    pelanggan.forEach(item => {
        laporan += `<tr><td>${item.nama}</td><td>${item.alamat}</td></tr>`;
    });
    laporan += '</tbody></table>';
    document.getElementById('isi-laporan').innerHTML = laporan;
});

// Laporan Faktur
document.getElementById('laporan-faktur').addEventListener('click', function() {
    let laporan = '<h2>Laporan Faktur</h2>';
    transaksi.forEach((transaksiItem, index) => {
        laporan += `<h3>Faktur #${index + 1} (${transaksiItem.tanggal})</h3>`;
        laporan += '<ul>';
        transaksiItem.keranjang.forEach(item => {
            laporan += `<li>${item.produk.nama} x${item.jumlah} (${item.pelanggan.nama}) = Rp${item.produk.harga * item.jumlah}</li>`;
        });
        laporan += '</ul>';
    });
    document.getElementById('isi-laporan').innerHTML = laporan;
});

function rekapPenjualan(filter) {
    const rekap = {};
    transaksi.forEach(transaksiItem => {
        const key = filter(transaksiItem.tanggal);
        if (!rekap[key]) {
            rekap[key] = 0;
        }
        transaksiItem.keranjang.forEach(item => {
            rekap[key] += item.produk.harga * item.jumlah;
        });
    });
    return rekap;
}

// Rekap Harian
document.getElementById('rekap-harian').addEventListener('click', function() {
    const rekap = rekapPenjualan(tanggal => tanggal.toISOString().split('T')[0]);
    let laporan = '<h2>Rekapitulasi Penjualan Harian</h2>';
    for (const tanggal in rekap) {
        laporan += `<p>${tanggal}: Rp${rekap[tanggal]}</p>`;
    }
    document.getElementById('isi-laporan').innerHTML = laporan;
});

// Rekap Bulanan
document.getElementById('rekap-bulanan').addEventListener('click', function() {
    const rekap = rekapPenjualan(tanggal => tanggal.toISOString().slice(0, 7));
    let laporan = '<h2>Rekapitulasi Penjualan Bulanan</h2>';
    for (const bulan in rekap) {
        laporan += `<p>${bulan}: Rp${rekap[bulan]}</p>`;
    }
    document.getElementById('isi-laporan').innerHTML = laporan;
});

// Rekap Tahunan
document.getElementById('rekap-tahunan').addEventListener('click', function() {
    const rekap = rekapPenjualan(tanggal => tanggal.toISOString().slice(0, 4));
    let laporan = '<h2>Rekapitulasi Penjualan Tahunan</h2>';
    for (const tahun in rekap) {
        laporan += `<p>${tahun}: Rp${rekap[tahun]}</p>`;
    }
    document.getElementById('isi-laporan').innerHTML = laporan;
});

// Tambahkan CSS untuk tabel laporan
const style = document.createElement('style');
style.innerHTML = `
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
    }
`;
document.head.appendChild(style);