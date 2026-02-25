import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Item from "@/models/Item";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const path: { _id: string; name: string }[] = [];
    let currentId: string | null = id;

    while (currentId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc = await Item.findById(currentId).select("name parentId").lean() as any;
      if (!doc) break;
      path.unshift({ _id: String(doc._id), name: doc.name });
      currentId = doc.parentId ? String(doc.parentId) : null;
    }

    return NextResponse.json(path);
  } catch (error) {
    console.error("Path error:", error);
    return NextResponse.json({ error: "Failed to get path" }, { status: 500 });
  }
}
