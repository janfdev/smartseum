import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { items } from "@/lib/db/schema";
import cloudinary from "@/lib/cloudinary";
import qrcode from "qrcode";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    // @ts-expect-error custom user type
    const role = session?.user?.role;
    if (!session || !session.user) {
      return NextResponse.json(
        {
          error:
            "Unauthorized: Please login first (Missing CSRF or invalid Session Cookie)",
        },
        { status: 401 },
      );
    }

    if (role !== "admin" && role !== "uploader") {
      return NextResponse.json(
        { error: `Forbidden: Restricted Role (${role})` },
        { status: 403 },
      );
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const creatorName = formData.get("creator_name") as string;
    const yearStr = formData.get("year") as string;

    let year = null;
    if (yearStr) {
      if (!/^\d+$/.test(yearStr)) {
        return NextResponse.json(
          { error: "Year form must only contain numbers" },
          { status: 400 },
        );
      }
      year = parseInt(yearStr, 10);
    }

    const origin = formData.get("origin") as string;
    const file = formData.get("file") as File;

    if (!file || !title || !origin) {
      return NextResponse.json(
        { error: "Title, origin and file are required" },
        { status: 400 },
      );
    }

    if (!file.name.endsWith(".glb")) {
      return NextResponse.json(
        { error: "Only .glb files are allowed" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload .glb to Cloudinary
    const uploadResult: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "raw", folder: "3d_items" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      stream.end(buffer);
    });

    const fileUrl = uploadResult.secure_url;

    // Insert into DB first to get ID
    const inserted = await db
      .insert(items)
      .values({
        title,
        description,
        fileUrl,
        creatorName,
        year,
        origin,
        userId: session.user.id as string,
      })
      .returning();

    const id = inserted[0].id;

    // Generate QR Code. The payload is simply the item's ID.
    // Our scanner will use this ID to fetch the item's .glb file URL and display it.
    const qrDataUrl = await qrcode.toDataURL(id, {
      width: 300,
      errorCorrectionLevel: "H",
    });

    // Upload QR Code to Cloudinary
    const qrUploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        qrDataUrl,
        { folder: "qr_codes" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
    });

    const qrCodeUrl = qrUploadResult.secure_url;

    // Update DB with QR code URL
    await db.update(items).set({ qrCodeUrl }).where(eq(items.id, id));

    return NextResponse.json(
      { success: true, item: { ...inserted[0], qrCodeUrl } },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const allItems = await db
      .select()
      .from(items)
      .orderBy(desc(items.createdAt));
    return NextResponse.json({ items: allItems });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
