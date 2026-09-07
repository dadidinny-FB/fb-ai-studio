"use client";

import { useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  marginTop: "8px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  background: "#fff",
};

const buttonStyle = {
  width: "100%",
  padding: "15px",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};

export default function Home() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [product, setProduct] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");

  const [contentType, setContentType] = useState("Video TikTok");
  const [duration, setDuration] = useState("10");
  const [style, setStyle] = useState("Cinematic");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function chooseFile(e) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);

    const imageUrl = URL.createObjectURL(selectedFile);
    setPreview(imageUrl);

    setMessage("");
  }

  function changePhoto() {
    fileInputRef.current?.click();
  }

  async function uploadPhoto() {
    if (!file) {
      alert("Silakan pilih foto produk terlebih dahulu.");
      return null;
    }

    try {
      setLoading(true);
      setMessage("⏳ Sedang mengupload foto...");

      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName =
        `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 10)}.${extension}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      setMessage("✅ Foto berhasil disimpan ke Supabase.");

      return fileName;
    } catch (error) {
      console.error(error);

      setMessage(
        "❌ Upload gagal: " +
          (error?.message || "Terjadi kesalahan.")
      );

      return null;
    } finally {
      setLoading(false);
    }
  }

  async function generateContent() {
    if (!product.trim()) {
      alert("Masukkan nama produk terlebih dahulu.");
      return;
    }

    if (!file) {
      alert("Upload foto produk terlebih dahulu.");
      return;
    }

    setLoading(true);
    setMessage("🤖 Menyiapkan konten AI...");

    const uploadedPath = await uploadPhoto();

    if (!uploadedPath) {
      setLoading(false);
      return;
    }

    const contentData = {
      product,
      brand,
      price,
      contentType,
      duration,
      style,
      imagePath: uploadedPath,
    };

    console.log("CONTENT DATA:", contentData);

    setMessage(
      "✅ Data berhasil disiapkan. Tahap berikutnya kita hubungkan ke AI Generator."
    );

    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
        padding: "20px",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "650px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #111827, #374151)",
            color: "white",
            padding: "25px",
            borderRadius: "24px",
            marginBottom: "18px",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.12)",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "2px",
              opacity: 0.7,
            }}
          >
            AI CONTENT CREATOR
          </div>

          <h1
            style={{
              margin: "8px 0",
              fontSize: "28px",
            }}
          >
            🍔 F&B AI STUDIO
          </h1>

          <p
            style={{
              margin: 0,
              opacity: 0.8,
              fontSize: "15px",
            }}
          >
            Dari Foto Makanan Jadi Konten Viral.
          </p>

          <div
            style={{
              display: "inline-block",
              marginTop: "15px",
              padding: "9px 15px",
              background: "rgba(255,255,255,0.12)",
              borderRadius: "20px",
              fontSize: "14px",
            }}
          >
            🪙 20 Kredit
          </div>
        </div>

        {/* FORM */}
        <div
          style={{
            background: "white",
            padding: "22px",
            borderRadius: "24px",
            boxShadow:
              "0 8px 25px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              fontSize: "21px",
            }}
          >
            🎬 Buat Konten AI
          </h2>

          {/* UPLOAD FOTO */}
          <label
            style={{
              fontWeight: "bold",
              display: "block",
            }}
          >
            📸 Foto Produk
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={chooseFile}
            style={{ display: "none" }}
          />

          <div
            style={{
              border: "2px dashed #cbd5e1",
              borderRadius: "16px",
              padding: "20px",
              textAlign: "center",
              marginTop: "8px",
              marginBottom: "20px",
              background: "#f8fafc",
            }}
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Preview produk"
                  style={{
                    width: "100%",
                    maxHeight: "320px",
                    objectFit: "contain",
                    borderRadius: "14px",
                  }}
                />

                <button
                  type="button"
                  onClick={changePhoto}
                  style={{
                    marginTop: "12px",
                    padding: "10px 18px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#111827",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  🔄 Ganti Foto
                </button>
              </>
            ) : (
              <>
                <div
                  style={{
                    fontSize: "48px",
                  }}
                >
                  📷
                </div>

                <p
                  style={{
                    color: "#64748b",
                  }}
                >
                  Upload foto makanan atau produk
                </p>

                <button
                  type="button"
                  onClick={changePhoto}
                  style={{
                    ...buttonStyle,
                    background: "#111827",
                    color: "white",
                    maxWidth: "220px",
                  }}
                >
                  📁 Pilih Foto
                </button>
              </>
            )}
          </div>

          {/* NAMA PRODUK */}
          <label
            style={{
              fontWeight: "bold",
            }}
          >
            🍔 Nama Produk
          </label>

          <input
            value={product}
            onChange={(e) =>
              setProduct(e.target.value)
            }
            placeholder="Contoh: Ayam Crispy"
            style={inputStyle}
          />

          {/* BRAND */}
          <label
            style={{
              fontWeight: "bold",
            }}
          >
            🏪 Nama Brand
          </label>

          <input
            value={brand}
            onChange={(e) =>
              setBrand(e.target.value)
            }
            placeholder="Contoh: Big Daddy's"
            style={inputStyle}
          />

          {/* HARGA */}
          <label
            style={{
              fontWeight: "bold",
            }}
          >
            💰 Harga Produk
          </label>

          <input
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            placeholder="Contoh: Rp15.000"
            style={inputStyle}
          />

          {/* JENIS KONTEN */}
          <label
            style={{
              fontWeight: "bold",
            }}
          >
            🎥 Jenis Konten
          </label>

          <select
            value={contentType}
            onChange={(e) =>
              setContentType(e.target.value)
            }
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

          {/* DURASI */}
          <label
            style={{
              fontWeight: "bold",
            }}
          >
            ⏱️ Durasi Video
          </label>

          <select
            value={duration}
            onChange={(e) =>
              setDuration(e.target.value)
            }
            style={inputStyle}
          >
            <option value="5">5 detik</option>
            <option value="10">10 detik</option>
            <option value="15">15 detik</option>
            <option value="30">30 detik</option>
            <option value="60">60 detik</option>
          </select>

          {/* STYLE */}
          <label
            style={{
              fontWeight: "bold",
            }}
          >
            🎨 Style Visual
          </label>

          <select
            value={style}
            onChange={(e) =>
              setStyle(e.target.value)
            }
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

          {/* STATUS */}
          {message && (
            <div
              style={{
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "10px",
                background: "#f1f5f9",
                fontSize: "14px",
              }}
            >
              {message}
            </div>
          )}

          {/* UPLOAD */}
          <button
            type="button"
            onClick={uploadPhoto}
            disabled={loading}
            style={{
              ...buttonStyle,
              background: "#16a34a",
              color: "white",
              marginBottom: "10px",
              opacity: loading ? 0.6 : 1,
            }}
          >
            ☁️ Simpan Foto ke Supabase
          </button>

          {/* GENERATE */}
          <button
            type="button"
            onClick={generateContent}
            disabled={loading}
            style={{
              ...buttonStyle,
              background:
                "linear-gradient(135deg, #7c3aed, #4f46e5)",
              color: "white",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading
              ? "⏳ Memproses..."
              : "🚀 GENERATE CONTENT"}
          </button>
        </div>

        {/* FOOTER */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#64748b",
            fontSize: "12px",
          }}
        >
          F&B AI STUDIO © 2026
        </div>
      </div>
    </main>
  );
}
