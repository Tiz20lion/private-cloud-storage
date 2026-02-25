import mongoose, { Schema, Document, Model } from "mongoose";

export interface IItem extends Document {
  name: string;
  type: "file" | "folder";
  parentId: mongoose.Types.ObjectId | null;
  size: number;
  mimeType: string;
  s3Key: string;
  status: "pending" | "complete";
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["file", "folder"], required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Item", default: null },
    size: { type: Number, default: 0 },
    mimeType: { type: String, default: "" },
    s3Key: { type: String, default: "" },
    status: { type: String, enum: ["pending", "complete"], default: "complete" },
  },
  {
    timestamps: true,
  }
);

ItemSchema.index({ parentId: 1, type: 1 });
ItemSchema.index({ s3Key: 1 });

const Item: Model<IItem> = mongoose.models.Item || mongoose.model<IItem>("Item", ItemSchema);

export default Item;
