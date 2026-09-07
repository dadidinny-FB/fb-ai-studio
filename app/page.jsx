"use client";

import { useState } from "react";

export default function Home() {
  const [product, setProduct] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [contentType, setContentType] = useState("Video TikTok");
  const [duration, setDuration] = useState("10");
  const [style, setStyle] = useState("Cinematic");

  const handleGenerate = () => {
    if (!product) {
      alert("Masukkan nama produk terlebih dahulu.");
      return;
    }

    alert("F&B AI STUDIO siap digunakan!");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#111827",
            color: "white",
            padding: "25px",
            borderRadius: "22px",
            marginBottom: "18px",
          }}
        >
          <div style={{ fontSize: "13px", opacity: 0.7 }}>
            AI CONTENT CREATOR
          </div>

          <h1 style={{ margin: "8px 0" }}>
            🍔 F&B AI STUDIO
          </h1>

          <p style={{ opacity: 0.8 }}>
            Dari foto makanan jadi konten AI.
          </p>

          <div
            style={{
              display: "inline-block",
              marginTop: "10px",
              padding: "8px 14px",
              background: "#ffffff22",
              borderRadius: "20px",
            }}
          >
            🪙 20 Kredit
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "22px",
            borderRadius: "22px",
          }}
        >
          <label>📸 Foto Produk</label>

          <div
            style={{
              border: "2px dashed #ccc",
              borderRadius: "15px",
              padding: "25px",
              textAlign: "center",
              marginTop: "8px",
              marginBottom: "18px",
            }}
          >
            <div style={{ fontSize: "40px" }}>📷</div>

            <p>Upload foto makanan</p>

            <button
              style={{
                padding: "10px 18px",
                border: "none",
                borderRadius: "10px",
                background: "#111827",
                color: "white",
              }}
            >
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
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            style={inputStyle}
          >
            <option>Video TikTok</option>
            <option>Instagram Reels</option>
            <option>Video Affiliate</option>
            <option>Restaurant Promo</option>
            <option>Food Cinematic</option>
            <option>Cooking Video</option>
            <option>Drama F&B
