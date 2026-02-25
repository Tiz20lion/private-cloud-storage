import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Item from "@/models/Item";
import { getUploadUrl } from "@/lib/s3";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { fileName, size, mimeType, parentId } = await request.json();

    if (!fileName || !size || !mimeType) {
      return NextResponse.json({ error: "fileName, size, and mimeType are required" }, { status: 400 });
    }

    const ext = fileName.includes(".") ? fileName.split(".").pop() : "";
    const s3Key = `files/${uuidv4()}${ext ? `.${ext}` : ""}`;

    const item = await Item.create({
      name: fileName,
      type: "file",
      parentId: parentId || null,
      size,
      mimeType,
      s3Key,
      status: "pending",
    });

    const uploadUrl = await getUploadUrl(s3Key, mimeType);

    return NextResponse.json({
      fileId: item._id,
      uploadUrl,
      s3Key,
    });
  } catch (error) {
    console.error("Upload init error:", error);
    return NextResponse.json({ error: "Failed to initiate upload" }, { status: 500 });
  }
}
