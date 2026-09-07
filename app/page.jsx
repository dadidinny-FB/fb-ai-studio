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
  const [imageLoading, setImageLoading] = useState(false);

  const [result, setResult] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");

  function chooseFile(e) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
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
      setMessage("⏳ Mengupload foto...");

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

      if (error) throw error;

      return fileName;
    } catch (error) {
      console.error(error);

      setMessage(
        "❌ Upload gagal: " +
          (error?.message || "Terjadi kesalahan.")
      );

      return null;
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

    try {
      setLoading(true);
      setResult("");
      setMessage("🤖 AI sedang membuat konten...");

      const imagePath = await uploadPhoto();

      if (!imagePath) {
        setLoading(false);
        return;
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product,
          brand,
          price,
          contentType,
          duration,
          style,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Gagal membuat konten AI."
        );
      }

      setResult(data.content || "");
      setMessage("✅ Konten AI berhasil dibuat!");
    } catch (error) {
      console.error(error);

      setMessage(
        "❌ " +
          (error?.message || "Terjadi kesalahan.")
      );
    } finally {
      setLoading(false);
    }
  }

  async function generateImage() {
    if (!product.trim()) {
      alert("Masukkan nama produk terlebih dahulu.");
      return;
    }

    try {
      setImageLoading(true);
      setGeneratedImage("");
      setMessage("🎨 AI sedang membuat gambar produk...");

      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product,
          brand,
          price,
          style,
          prompt:
            "Buat foto makanan profesional untuk iklan media sosial.",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Gagal membuat gambar AI."
        );
      }

      setGeneratedImage(data.image || "");
      setMessage("✅ Gambar AI berhasil dibuat!");
    } catch (error) {
      console.error(error);

      setMessage(
        "❌ " +
          (error?.message ||
            "Terjadi kesalahan saat membuat gambar.")
      );
    } finally {
      setImageLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#f8fafc,#eef2ff)",
        padding: "20px",
        fontFamily: "Arial,Helvetica,sans-serif",
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
              "linear-gradient(135deg,#111827,#374151)",
            color: "white",
            padding: "25px",
            borderRadius: "24px",
            marginBottom: "18px",
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

          <p style={{ opacity: 0.8 }}>
            Dari Foto Makanan Jadi Konten Viral.
          </p>

          <div
            style={{
              display: "inline-block",
              marginTop: "10px",
              padding: "8px 14px",
              background:
                "rgba(255,255,255,0.12)",
              borderRadius: "20px",
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
          }}
        >
          <h2>🎬 Buat Konten AI</h2>

          {/* FOTO */}

          <label>📸 Foto Produk</label>

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
                  }}
                >
                  🔄 Ganti Foto
                </button>
              </>
            ) : (
              <>
                <div
                  style={{
                    fontSize: "45px",
                  }}
                >
                  📷
                </div>

                <p>
                  Upload foto makanan atau produk
                </p>

                <button
                  type="button"
                  onClick={changePhoto}
                  style={{
                    ...buttonStyle,
                    background: "#111827",
                    color: "white",
                  }}
                >
                  📁 Pilih Foto
                </button>
              </>
            )}
          </div>

          {/* PRODUK */}

          <label>🍔 Nama Produk</label>

          <input
            value={product}
            onChange={(e) =>
              setProduct(e.target.value)
            }
            placeholder="Contoh: Sop Iga Beremah"
            style={inputStyle}
          />

          {/* BRAND */}

          <label>🏪 Nama Brand</label>

          <input
            value={brand}
            onChange={(e) =>
              setBrand(e.target.value)
            }
            placeholder="Contoh: Gris House"
            style={inputStyle}
          />

          {/* HARGA */}

          <label>💰 Harga Produk</label>

          <input
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            placeholder="Contoh: Rp50.000"
            style={inputStyle}
          />

          {/* JENIS KONTEN */}

          <label>🎥 Jenis Konten</label>

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

          <label>⏱️ Durasi Video</label>

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

          <label>🎨 Style Visual</label>

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

          {/* MESSAGE */}

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

          {/* AI IMAGE */}

          <button
            type="button"
            onClick={generateImage}
            disabled={imageLoading}
            style={{
              ...buttonStyle,
              background:
                "linear-gradient(135deg,#f59e0b,#ea580c)",
              color: "white",
              opacity: imageLoading ? 0.6 : 1,
              marginBottom: "12px",
            }}
          >
            {imageLoading
              ? "🎨 AI Sedang Membuat Gambar..."
              : "🖼️ GENERATE AI IMAGE"}
          </button>

          {/* AI CONTENT */}

          <button
            type="button"
            onClick={generateContent}
            disabled={loading}
            style={{
              ...buttonStyle,
              background:
                "linear-gradient(135deg,#7c3aed,#4f46e5)",
              color: "white",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading
              ? "⏳ AI Sedang Bekerja..."
              : "🚀 GENERATE CONTENT"}
          </button>

          {/* GENERATED IMAGE */}

          {generatedImage && (
            <div
              style={{
                marginTop: "25px",
                padding: "15px",
                borderRadius: "16px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <h2>🖼️ Hasil Gambar AI</h2>

              <img
                src={generatedImage}
                alt="AI Generated Food"
                style={{
                  width: "100%",
                  borderRadius: "14px",
                  display: "block",
                }}
              />
            </div>
          )}

          {/* GENERATED CONTENT */}

          {result && (
            <div
              style={{
                marginTop: "25px",
                padding: "20px",
                borderRadius: "16px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <h2>✨ Hasil Konten AI</h2>

              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily:
                    "Arial,Helvetica,sans-serif",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                {result}
              </pre>
            </div>
          )}
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
