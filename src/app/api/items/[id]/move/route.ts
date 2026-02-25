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
    const { targetFolderId } = await request.json();

    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (targetFolderId) {
      const targetFolder = await Item.findById(targetFolderId);
      if (!targetFolder || targetFolder.type !== "folder") {
        return NextResponse.json({ error: "Target folder not found" }, { status: 404 });
      }

      if (item.type === "folder") {
        let currentId: string | null = targetFolderId;
        while (currentId) {
          if (currentId === id) {
            return NextResponse.json(
              { error: "Cannot move a folder into its own subfolder" },
              { status: 400 }
            );
          }
          const parent = await Item.findById(currentId);
          currentId = parent?.parentId?.toString() || null;
        }
      }
    }

    const existing = await Item.findOne({
      _id: { $ne: id },
      name: item.name,
      type: item.type,
      parentId: targetFolderId || null,
    });

    if (existing) {
      return NextResponse.json(
        { error: "An item with this name already exists in the target folder" },
        { status: 409 }
      );
    }

    item.parentId = targetFolderId || null;
    await item.save();

    return NextResponse.json(item);
  } catch (error) {
    console.error("Move error:", error);
    return NextResponse.json({ error: "Failed to move item" }, { status: 500 });
  }
}
