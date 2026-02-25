import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Item from "@/models/Item";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const existing = await Item.findOne({
      _id: { $ne: id },
      name: name.trim(),
      type: item.type,
      parentId: item.parentId,
    });

    if (existing) {
      return NextResponse.json({ error: "An item with this name already exists" }, { status: 409 });
    }

    item.name = name.trim();
    await item.save();

    return NextResponse.json(item);
  } catch (error) {
    console.error("Rename error:", error);
    return NextResponse.json({ error: "Failed to rename item" }, { status: 500 });
  }
}
