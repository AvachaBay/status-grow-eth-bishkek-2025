import { NextRequest, NextResponse } from "next/server";
import { getRedisClient } from "~~/lib/redis";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    const redis = getRedisClient();
    const userState = await redis.get(`user-state:${walletAddress.toLowerCase()}`);

    if (!userState) {
      return NextResponse.json({
        walletAddress,
        questProgress: [],
        totalXP: 0,
        level: 1,
        questCompletionPercentage: 0,
        lastUpdated: Date.now(),
        createdAt: Date.now(),
      });
    }

    return NextResponse.json(userState);
  } catch (error) {
    console.error("Error fetching user state:", error);
    return NextResponse.json({ error: "Failed to fetch user state" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, questProgress, totalXP, level, questCompletionPercentage } = body;

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    const userState = {
      walletAddress: walletAddress.toLowerCase(),
      questProgress,
      totalXP,
      level,
      questCompletionPercentage,
      lastUpdated: Date.now(),
      createdAt: body.createdAt || Date.now(),
    };

    const redis = getRedisClient();
    await redis.set(`user-state:${walletAddress.toLowerCase()}`, userState);

    return NextResponse.json({ success: true, userState });
  } catch (error) {
    console.error("Error saving user state:", error);
    return NextResponse.json({ error: "Failed to save user state" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    const redis = getRedisClient();
    await redis.del(`user-state:${walletAddress.toLowerCase()}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user state:", error);
    return NextResponse.json({ error: "Failed to delete user state" }, { status: 500 });
  }
}
