"use client";

import { useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export default function Home() {
  const fileInputRef = useRef(null);

  const [product, setProduct] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [contentType, setContentType] = useState("Video TikTok");
  const [duration, setDuration] = useState("10");
  const [style, setStyle] = useState("Cinematic");

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedPath, setUploadedPath] = useState("");
  const [message, setMessage] = useState("");

  function choosePhoto() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("File harus berupa gambar.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage("Ukuran foto maksimal 10 MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadedPath("");
    setMessage("Foto siap di-upload.");
  }

  async function uploadPhoto() {
    if (!imageFile) {
      setMessage("Pilih foto terlebih dahulu.");
      return;
    }

    setUploading(true);
    setMessage("Sedang meng-upload foto...");

    try {
      const extension = imageFile.name.split(".").pop() || "jpg";

      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}.${extension}`;

      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(filePath, imageFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: imageFile.type,
        });

      if (error) {
        throw error;
      }

      setUploadedPath(filePath);
      setMessage("✅ Foto berhasil disimpan ke Supabase!");
    } catch (error) {
      console.error(error);
      setMessage(`❌ Upload gagal: ${error.message}`);
    } finally {
      setUploading(false);
    }
  }

  function generateContent() {
    if (!product.trim()) {
      alert("Masukkan nama produk terlebih dahulu.");
      return;
    }

    if (!imageFile) {
      alert("Pilih foto produk terlebih dahulu.");
      return;
    }

    if (!uploadedPath) {
      alert("Upload foto terlebih dahulu.");
      return;
    }

    alert("Data siap diproses AI. Tahap AI Generator akan kita sambungkan berikutnya.");
  }

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>

        <section style={headerStyle}>
          <div style={{ fontSize: "13px", opacity: 0.7 }}>
            AI CONTENT CREATOR
          </div>

          <h1 style={{ margin: "8px 0", fontSize: "30px" }}>
            🍔 F&B AI STUDIO
          </h1>

          <p style={{ opacity: 0.8, marginBottom: "12px" }}>
            Dari foto makanan jadi konten AI.
          </p>

          <div style={creditStyle}>
            🪙 20 Kredit
          </div>
        </section>

        <section style={cardStyle}>

          <h2 style={{ marginTop: 0 }}>
            Buat Konten Baru
          </h2>

          <label>📸 Foto Produk</label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div style={uploadBoxStyle}>

            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Preview produk"
                  style={previewStyle}
                />

                <button
                  onClick={choosePhoto}
                  style={smallButtonStyle}
                >
                  Ganti Foto
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: "45px" }}>📷</div>

                <p>Upload foto makanan</p>

                <button
                  onClick={choosePhoto}
                  style={darkButtonStyle}
                >
                  Pilih Foto
                </button>
              </>
            )}

          </div>

          {imageFile && !uploadedPath && (
            <button
              onClick={uploadPhoto}
              disabled={uploading}
              style={uploadButtonStyle}
            >
              {uploading
                ? "⏳ Meng-upload..."
                : "☁️ Upload Foto ke Supabase"}
            </button>
          )}

          {message && (
            <div style={messageStyle}>
              {message}
            </div>
          )}

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
