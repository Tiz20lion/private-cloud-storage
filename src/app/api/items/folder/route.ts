import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Item from "@/models/Item";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, parentId } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
    }

    const existing = await Item.findOne({
      name: name.trim(),
      type: "folder",
      parentId: parentId || null,
    });

    if (existing) {
      return NextResponse.json({ error: "Folder already exists" }, { status: 409 });
    }

    const folder = await Item.create({
      name: name.trim(),
      type: "folder",
      parentId: parentId || null,
    });

    return NextResponse.json(folder, { status: 201 });
  } catch (error) {
    console.error("Create folder error:", error);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}
