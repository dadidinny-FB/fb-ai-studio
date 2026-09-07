"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export default function Home() {
  const [product, setProduct] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [contentType, setContentType] = useState("Video TikTok");
  const [duration, setDuration] = useState("10");
  const [style, setStyle] = useState("Cinematic");

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  function handleFileChange(e) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Silakan pilih file gambar.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("Ukuran foto maksimal 10 MB.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setMessage("");
  }

  async function uploadPhoto() {
    if (!file) {
      alert("Silakan pilih foto terlebih dahulu.");
      return null;
    }

    setUploading(true);
    setMessage("");

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error(error);
      setUploading(false);
      setMessage("❌ Upload gagal: " + error.message);
      return null;
    }

    setUploading(false);
    setMessage("✅ Foto berhasil diupload ke Supabase.");

    return filePath;
  }

  async function generate() {
    if (!product.trim()) {
      alert("Masukkan nama produk terlebih dahulu.");
      return;
    }

    if (!file) {
      alert("Silakan upload foto produk terlebih dahulu.");
      return;
    }

    const uploadedPath = await uploadPhoto();

    if (!uploadedPath) return;

    alert(
      "🎉 Foto berhasil disimpan!\n\nTahap berikutnya kita akan membuat AI Generator."
    );
  }

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
          <h2 style={{ marginTop: 0 }}>Buat Konten Baru</h2>

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
            {preview ? (
              <img
                src={preview}
                alt="Preview produk"
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                  borderRadius: "12px",
                  marginBottom: "15px",
                }}
              />
            ) : (
              <>
                <div style={{ fontSize: "40px" }}>📷</div>
                <p>Upload foto makanan</p>
              </>
            )}

            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <label
              htmlFor="photo"
              style={{
                display: "inline-block",
                padding: "10px 18px",
                borderRadius: "10px",
                background: "#111827",
                color: "white",
                cursor: "pointer",
              }}
            >
              {file ? "Ganti Foto" : "Pilih Foto"}
            </label>
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

          {message && (
            <div
              style={{
                marginTop: "10px",
                padding: "12px",
                background: "#f3f4f6",
                borderRadius: "10px",
                fontSize: "14px",
              }}
            >
              {message}
            </div>
          )}

          <button
            onClick={generate}
            disabled={uploading}
            style={generateButton}
          >
            {uploading ? "⏳ UPLOAD..." : "🚀 GENERATE CONTENT"}
          </button>
        </div>
      </div>
    </main>
  );
}

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
  cursor: "pointer",
};
