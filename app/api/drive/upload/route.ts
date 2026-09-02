import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export const dynamic = "force-dynamic";

const drive = google.drive("v3");

async function getOrCreateFolder(
  auth: any,
  parentFolderId: string,
  folderName: string
): Promise<string> {
  const res = await drive.files.list({
    auth,
    q: `'${parentFolderId}' in parents and name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    spaces: "drive",
    fields: "files(id, name)",
    pageSize: 1,
  });

  if (res.data.files && res.data.files.length > 0) {
    return res.data.files[0].id!;
  }

  const createRes = await drive.files.create({
    auth,
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId],
    },
    fields: "id",
  });

  return createRes.data.id!;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GOOGLE_DRIVE_FOLDER_ID) {
      return NextResponse.json(
        { error: "Google Drive not configured" },
        { status: 501 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const platform = formData.get("platform") as string;
    const invoiceNumber = formData.get("invoiceNumber") as string;
    const date = formData.get("date") as string;

    if (!file || !platform) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    const proofsFolder = await getOrCreateFolder(auth, rootFolderId, "Payment Proofs");
    const platformFolder = await getOrCreateFolder(auth, proofsFolder, platform);

    const buffer = await file.arrayBuffer();
    const fileName = `${invoiceNumber}_${date}.${file.name.split(".").pop()}`;

    const uploadRes = await drive.files.create({
      auth,
      requestBody: {
        name: fileName,
        mimeType: file.type,
        parents: [platformFolder],
      },
      media: {
        mimeType: file.type,
        body: Buffer.from(buffer),
      },
      fields: "id, webViewLink, name",
    });

    return NextResponse.json({
      fileId: uploadRes.data.id,
      fileName: uploadRes.data.name,
      fileUrl: uploadRes.data.webViewLink,
    });
  } catch (error) {
    console.error("Drive upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file to Google Drive" },
      { status: 500 }
    );
  }
}
