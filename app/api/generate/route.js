export async function POST(request) {
  try {
    const body = await request.json();

    const {
      product,
      brand,
      price,
      contentType,
      duration,
      style,
    } = body;

    if (!product) {
      return Response.json(
        {
          error: "Nama produk wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    const prompt = `
Kamu adalah AI Content Creator profesional khusus Food & Beverage.

Buat paket konten viral untuk produk makanan berikut.

DATA PRODUK:
Nama Produk: ${product}
Brand: ${brand || "-"}
Harga: ${price || "-"}
Jenis Konten: ${contentType || "Video TikTok"}
Durasi: ${duration || "10"} detik
Style Visual: ${style || "Cinematic"}

HASILKAN DALAM BAHASA INDONESIA.

Buat output dengan format berikut:

1. JUDUL
Buat 3 pilihan judul yang menarik.

2. MASTER HOOK
Buat 3 hook kuat untuk 3 detik pertama.

3. SCRIPT
Buat script video sesuai durasi ${duration || "10"} detik.
Gunakan bahasa Indonesia yang natural, singkat dan persuasif.

4. STORYBOARD
Buat storyboard berdasarkan durasi video.
Untuk setiap scene tuliskan:
- Durasi
- Visual
- Gerakan kamera
- Aksi
- Text overlay

5. VIDEO PROMPT
Buat prompt video AI yang sangat detail.
Gunakan style ${style || "Cinematic"}.
Pertahankan bentuk dan tampilan produk secara konsisten.
Jelaskan lighting, kamera, angle, motion dan suasana.

6. VOICE OVER
Buat voice over bahasa Indonesia yang sesuai dengan script.

7. CAPTION
Buat caption TikTok/Reels yang menarik dan mengundang komentar.

8. HASHTAG
Berikan tepat 5 hashtag yang relevan dan berpotensi menjangkau audience F&B.

9. CTA
Buat CTA yang mendorong penonton untuk membeli atau mengunjungi brand.

10. IDE KOMENTAR
Buat 3 pertanyaan yang bisa digunakan untuk memancing komentar.

PENTING:
- Jangan memberikan penjelasan di luar format.
- Fokus pada konten yang siap digunakan.
- Gunakan gaya bahasa Indonesia yang menarik.
- Jangan mengarang informasi selain data produk yang diberikan.
`;

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error: "OPENAI_API_KEY belum tersedia di server.",
        },
        {
          status: 500,
        }
      );
    }

    const openAIResponse = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-5.6-luna",
          input: prompt,
        }),
      }
    );

    const data = await openAIResponse.json();

    if (!openAIResponse.ok) {
      console.error("OpenAI error:", data);

      return Response.json(
        {
          error:
            data?.error?.message ||
            "Gagal menghubungkan ke OpenAI.",
        },
        {
          status: openAIResponse.status,
        }
      );
    }

    const output =
      data.output_text ||
      data.output
        ?.map((item) =>
          item.content
            ?.map((content) => content.text || "")
            .join("")
        )
        .join("") ||
      "";

    return Response.json({
      success: true,
      content: output,
    });
  } catch (error) {
    console.error("Generate API error:", error);

    return Response.json(
      {
        error:
          error?.message ||
          "Terjadi kesalahan pada server.",
      },
      {
        status: 500,
      }
    );
  }
}
