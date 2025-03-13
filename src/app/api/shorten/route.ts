// app/api/shorten/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/libs/db";
import { Url } from "@/app/models/Url";
import { nanoid } from "nanoid";
import { z } from "zod";

const urlSchema = z.object({
  url: z.string().url(),
  customId: z.string().optional(),
  expiresIn: z.number().optional(), // In days
});

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { url, customId, expiresIn } = urlSchema.parse(body);

    // Generate short ID or use custom one
    const shortId = customId || nanoid(8);

    // Check if custom ID already exists
    if (customId) {
      const existingUrl = await Url.findOne({ shortId });

      if (existingUrl) {
        return NextResponse.json(
          { error: "Custom ID already in use" },
          { status: 400 }
        );
      }
    }

    // Calculate expiration date if provided
    const expireAt = expiresIn
      ? new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000)
      : null;

    // Create new shortened URL
    const newUrl = await Url.create({
      originalUrl: url,
      shortId,
      expireAt: expireAt || undefined,
    });

    return NextResponse.json({
      shortId: newUrl.shortId,
      shortUrl: `${req.nextUrl.origin}/${shortId}`,
      originalUrl: newUrl.originalUrl,
      expireAt: newUrl.expireAt,
    });
  } catch (error) {
    console.error("Error creating shortened URL:", error);
    return NextResponse.json(
      { error: "Failed to create shortened URL" },
      { status: 500 }
    );
  }
}
