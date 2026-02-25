import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Item from "@/models/Item";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { fileId } = await request.json();

    if (!fileId) {
      return NextResponse.json({ error: "fileId is required" }, { status: 400 });
    }

    const item = await Item.findByIdAndUpdate(
      fileId,
      { status: "complete" },
      { new: true }
    );

    if (!item) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Upload confirm error:", error);
    return NextResponse.json({ error: "Failed to confirm upload" }, { status: 500 });
  }
}
