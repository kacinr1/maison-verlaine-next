import { Anthropic } from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const CATALOG = {
  laines: [
    "Marine",
    "Camel",
    "Gris",
    "Noir",
    "Bordeaux",
    "Cognac",
    "Vert olive",
    "Charbon",
  ],
  motifs: ["Uni", "Fines rayures", "Carreaux"],
  cravates: ["Unie", "Club"],
  souliers: ["Oxford noir", "Cognac", "Marron clair", "Noir brillant"],
};

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, faceData } = await request.json();

    if (!imageBase64 || !faceData) {
      return NextResponse.json(
        { error: "Missing image or face data" },
        { status: 400 }
      );
    }

    const prompt = `You are a luxury tailor's style advisor. Analyze the face in this image and recommend colors and styles for a three-piece suit.

The suit consists of:
- Jacket (Veste): Choose from ${CATALOG.laines.join(", ")}
- Vest (Gilet): Choose from ${CATALOG.laines.join(", ")}
- Trousers (Pantalon): Choose from ${CATALOG.laines.join(", ")}
- Tie (Cravate): Choose from ${CATALOG.cravates.join(", ")}
- Shoes (Souliers): Choose from ${CATALOG.souliers.join(", ")}
- Fabric patterns: ${CATALOG.motifs.join(", ")}

Analyze:
1. Skin tone (mat/glossy, warm/cool undertones)
2. Hair color
3. Face shape and features
4. Recommend a complete outfit that harmonizes with their appearance

IMPORTANT: The outfit names MUST exactly match the catalog options above.

Return ONLY a valid JSON object (no markdown, no code blocks):
{
  "face": {"cx": 0.5, "cy": 0.4, "w": 0.3, "h": 0.4},
  "teint": "mat ou glossy",
  "sous_ton": "chaud ou froid",
  "cheveux": "couleur",
  "tenue": {
    "veste": "exact catalog name",
    "gilet": "exact catalog name",
    "pantalon": "exact catalog name",
    "motif": "exact pattern name",
    "cravate": "exact tie name",
    "souliers": "exact shoe name"
  },
  "conseil": "2 phrases max in French, poetic and luxurious tone"
}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    let advice;
    try {
      advice = JSON.parse(content.text);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse advice" },
        { status: 500 }
      );
    }

    return NextResponse.json(advice);
  } catch (error) {
    console.error("Stylist API error:", error);
    return NextResponse.json(
      { error: "Failed to generate advice" },
      { status: 500 }
    );
  }
}
