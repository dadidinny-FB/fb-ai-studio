"use client";

import { useState } from "react";

export default function Home() {
  const [product, setProduct] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("Video TikTok");
  const [duration, setDuration] = useState("10");
  const [style, setStyle] = useState("Cinematic");

  function generate() {
    if (!product.trim()) {
      alert("Masukkan nama produk terlebih dahulu.");
      return;
    }

    alert(
      "F&B AI STUDIO siap!\n\nProduk: " +
        product +
        "\nBrand: " +
        (brand || "-") +
        "\nHarga: " +
        (price || "-") +
        "\nJenis: " +
        type +
        "\nDurasi: " +
        duration +
        " detik\nStyle: " +
        style
    );
  }

  return (
    <main style={mainStyle}>
      <div style={containerStyle}>
        <section style={headerStyle}>
          <small>AI CONTENT CREATOR</small>
          <h1>🍔 F&B AI STUDIO</h1>
          <p>Dari foto makanan jadi konten AI.</p>
          <span style={creditStyle}>🪙 20 Kredit</span>
        </section>

        <section style={cardStyle}>
          <h2>Buat Konten Baru</h2>

          <label>📸 Foto Produk</label>

          <div style={uploadStyle}>
            <div style={{ fontSize: 40 }}>📷</div>
            <p>Upload foto makanan</p>
            <button type="button" style={darkButton}>
              Pilih Foto
            </button>
          </div>

          <label>Nama Produk</label>
          <input
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Contoh: Ayam Crispy"
            style={inputStyle}
          />

          <label>Nama Brand</label>
          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Contoh: Big Daddy's"
            style={inputStyle}
          />

          <label>Harga Produk</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Contoh: Rp15.000"
            style={inputStyle}
          />

          <label>Jenis Konten</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={inputStyle}
          >
            <option>Video TikTok</option>
            <option>Instagram Reels</option>
            <option>Video Affiliate</option>
            <option>Restaurant Promo</option>
            <option>Food Cinematic</option>
            <option>Cooking Video</option>
            <option>Drama F&B</option>
          </select>

          <label>Durasi</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={inputStyle}
          >
            <option value="5">5 detik</option>
            <option value="10">10 detik</option>
            <option value="15">15 detik</option>
            <option value="30">30 detik</option>
            <option value="60">60 detik</option>
          </select>

          <label>Style Visual</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            style={inputStyle}
          >
            <option>Cinematic</option>
            <option>Hyper Realistic</option>
            <option>Luxury Food</option>
            <option>Street Food</option>
            <option>Korean Food</option>
            <option>Japanese Food</option>
            <option>3D Animation</option>
          </select>

          <button type="button" onClick={generate} style={generateButton}>
            🚀 GENERATE CONTENT
          </button>
        </section>
      </div>
    </main>
  );
}

const mainStyle = {
  minHeight: "100vh",
  background: "#f5f5f5",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
};

const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
};

const headerStyle = {
  background: "#111827",
  color: "white",
  padding: "25px",
  borderRadius: "22px",
  marginBottom: "18px",
};

const creditStyle = {
  display: "inline-block",
  padding: "8px 14px",
  background: "#ffffff22",
  borderRadius: "20px",
};

const cardStyle = {
  background: "white",
  padding: "22px",
  borderRadius: "22px",
};

const uploadStyle = {
  border: "2px dashed #ccc",
  borderRadius: "15px",
  padding: "25px",
  textAlign: "center",
  marginTop: "8px",
  marginBottom: "18px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  marginTop: "8px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
};

const darkButton = {
  padding: "10px 18px",
  border: "none",
  borderRadius: "10px",
  background: "#111827",
  color: "white",
};

const generateButton = {
  width: "100%",
  marginTop: "15px",
  padding: "16px",
  border: "none",
  borderRadius: "14px",
  background: "#111827",
  color: "white",
  fontSize: "17px",
  fontWeight: "bold",
};
