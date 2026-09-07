export async function POST(request) {
  try {
    const body = await request.json();

    const {
      product,
      brand,
      price,
      style,
      prompt,
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

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error: "OPENAI_API_KEY belum tersedia.",
        },
        {
          status: 500,
        }
      );
    }

    const imagePrompt = `
Create a premium commercial food photography image.

PRODUCT:
${product}

BRAND:
${brand || "Restaurant"}

PRICE:
${price || "Not specified"}

VISUAL STYLE:
${style || "Cinematic"}

${prompt || ""}

IMPORTANT VISUAL DIRECTION:

Create an appetizing, photorealistic food advertisement.

Make the food look fresh, delicious and premium.

Use professional restaurant photography.

Use cinematic lighting, realistic shadows,
beautiful highlights, shallow depth of field,
natural food textures and realistic colors.

Composition should be suitable for
TikTok, Instagram Reels and restaurant promotion.

Do not create a cartoon.

Do not create an illustration.

Do not distort the food.

Do not add random objects.

Do not add fake logos.

Keep the main food as the visual focus.

High-end commercial food photography,
professional camera,
85mm lens,
shallow depth of field,
cinematic lighting,
photorealistic,
high detail.
`;

    const openAIResponse = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-image-2",
          prompt: imagePrompt,
          n: 1,
          size: "1024x1024",
          quality: "medium",
          output_format: "png",
        }),
      }
    );

    const data = await openAIResponse.json();

    if (!openAIResponse.ok) {
      console.error("OpenAI Image Error:", data);

      return Response.json(
        {
          error:
            data?.error?.message ||
            "Gagal membuat gambar AI.",
        },
        {
          status: openAIResponse.status,
        }
      );
    }

    const imageData = data?.data?.[0]?.b64_json;

    if (!imageData) {
      return Response.json(
        {
          error: "OpenAI tidak mengembalikan gambar.",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json({
      success: true,
      image: `data:image/png;base64,${imageData}`,
    });
  } catch (error) {
    console.error("Image Generator Error:", error);

    return Response.json(
      {
        error:
          error?.message ||
          "Terjadi kesalahan saat membuat gambar.",
      },
      {
        status: 500,
      }
    );
  }
}
