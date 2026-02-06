// Activities API Route
import { NextRequest, NextResponse } from "next/server";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const actionType = searchParams.get("actionType");
  const status = searchParams.get("status");

  try {
    // This would typically call the Convex function
    // For now, return mock data or proxy to Convex
    return NextResponse.json({
      activities: [],
      nextCursor: null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.actionType || !body.description || !body.agentId) {
      return NextResponse.json(
        { error: "Missing required fields: actionType, description, agentId" },
        { status: 400 }
      );
    }

    // This would call the Convex mutation
    // await fetch(`${CONVEX_URL}/api/mutation`, ...)

    return NextResponse.json({
      success: true,
      activityId: "generated-id",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to log activity" },
      { status: 500 }
    );
  }
}