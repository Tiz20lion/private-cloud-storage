import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Item from "@/models/Item";
import { deleteObject } from "@/lib/s3";

async function deleteRecursive(itemId: string): Promise<void> {
  const item = await Item.findById(itemId);
  if (!item) return;

  if (item.type === "folder") {
    const children = await Item.find({ parentId: itemId });
    for (const child of children) {
      await deleteRecursive(child._id.toString());
    }
  } else if (item.s3Key) {
    await deleteObject(item.s3Key);
  }

  await Item.findByIdAndDelete(itemId);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const item = await Item.findById(id);

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await deleteRecursive(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete item error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
