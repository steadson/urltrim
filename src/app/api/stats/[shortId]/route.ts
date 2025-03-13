// app/api/stats/[shortId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/libs/db";
import { Url, Visit, Referral } from "@/app/models/Url";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { shortId: string } }
) {
  await dbConnect();

  // Await the params before destructuring
  const shortId = await params.shortId;

  try {
    // Find the URL by shortId
    const url = await Url.findOne({ shortId });

    if (!url) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    // Get all visits for this URL
    const visits = await Visit.find({ urlId: url._id });

    // Get all referrals for this URL
    const referrals = await Referral.find({ urlId: url._id });

    // Generate basic stats
    const totalClicks = visits.length;

    // Create device breakdown
    const deviceStats = visits.reduce((acc, visit) => {
      const device = visit.device || "unknown";
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Create geographic breakdown
    const geoStats = visits.reduce((acc, visit) => {
      const country = visit.country || "unknown";
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Create referral stats
    const referralStats = await Promise.all(
      referrals.map(async referral => {
        // Get visits for this referral
        const referralVisits = await Visit.find({
          referralId: referral._id
        });

        return {
          code: referral.code,
          description: referral.description,
          clicks: referralVisits.length,
          devices: referralVisits.reduce((acc, visit) => {
            const device = visit.device || "unknown";
            acc[device] = (acc[device] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          countries: referralVisits.reduce((acc, visit) => {
            const country = visit.country || "unknown";
            acc[country] = (acc[country] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        };
      })
    );

    // Create time-based stats (by day)
    const clicksByDay = visits.reduce((acc, visit) => {
      const date = visit.timestamp.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      shortId: url.shortId,
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      expireAt: url.expireAt,
      stats: {
        totalClicks,
        deviceStats,
        geoStats,
        clicksByDay,
        referralStats
      }
    });
  } catch (error) {
    console.error("Error fetching URL stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch URL statistics" },
      { status: 500 }
    );
  }
}
