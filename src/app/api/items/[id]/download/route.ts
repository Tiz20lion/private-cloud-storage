import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Item from "@/models/Item";
import { getDownloadUrl } from "@/lib/s3";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const item = await Item.findById(id);

    if (!item || item.type !== "file") {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const url = await getDownloadUrl(item.s3Key, item.name);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 });
  }
}
