import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Item from "@/models/Item";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const parentId = request.nextUrl.searchParams.get("parentId") || null;

    const query = parentId ? { parentId } : { parentId: null };
    const items = await Item.find({ ...query, status: "complete" })
      .sort({ type: -1, name: 1 })
      .lean();

    return NextResponse.json(items);
  } catch (error) {
    console.error("List items error:", error);
    return NextResponse.json({ error: "Failed to list items" }, { status: 500 });
  }
}
