import { fal } from "@fal-ai/client";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      imageUrl,
      product,
      brand,
      style,
      duration = "10",
    } = body;

    if (!imageUrl) {
      return Response.json(
        { error: "Foto produk tidak ditemukan." },
        { status: 400 }
      );
    }

    const apiKey = process.env.FAL_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "FAL_KEY belum dipasang di Vercel." },
        { status: 500 }
      );
    }

    fal.config({
      credentials: apiKey,
    });

    const prompt = `
Create a professional 10-second food advertising video from the provided product image.

Product: ${product || "food product"}
Brand: ${brand || "F&B brand"}
Visual style: ${style || "cinematic"}

Keep the food appearance, shape, color, texture and identity highly consistent with the source image.

Create realistic subtle motion:
- cinematic camera movement
- slow push-in
- appetizing food presentation
- realistic lighting
- natural depth of field
- premium restaurant advertising look
- realistic steam or subtle movement when appropriate
- highly detailed food texture

Do not change the food into another product.
Do not add text.
Do not add logos that are not already present.
Do not distort the food.

Vertical social media advertising style.
`;

    const result = await fal.subscribe(
      "wan/v2.6/image-to-video/flash",
      {
        input: {
          prompt,
          image_url: imageUrl,
          resolution: "720p",
          duration: String(duration),
          generate_audio: false,
          enable_prompt_expansion: true,
          multi_shots: false,
          enable_safety_checker: true,
        },
        logs: false,
      }
    );

    const videoUrl = result?.data?.video?.url;

    if (!videoUrl) {
      return Response.json(
        { error: "AI tidak mengembalikan video." },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      video: videoUrl,
    });
  } catch (error) {
    console.error("VIDEO ERROR:", error);

    return Response.json(
      {
        error:
          error?.message ||
          "Gagal membuat video AI.",
      },
      { status: 500 }
    );
  }
}
