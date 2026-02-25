import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Item from "@/models/Item";

export async function GET() {
  try {
    await connectDB();

    const result = await Item.aggregate([
      { $match: { type: "file", status: "complete" } },
      {
        $group: {
          _id: null,
          totalSize: { $sum: "$size" },
          totalFiles: { $sum: 1 },
        },
      },
    ]);

    const totalFolders = await Item.countDocuments({ type: "folder" });

    const stats = result[0] || { totalSize: 0, totalFiles: 0 };

    return NextResponse.json({
      totalSize: stats.totalSize,
      totalFiles: stats.totalFiles,
      totalFolders,
    });
  } catch (error) {
    console.error("Storage stats error:", error);
    return NextResponse.json({ error: "Failed to get storage stats" }, { status: 500 });
  }
}
