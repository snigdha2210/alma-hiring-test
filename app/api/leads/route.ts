import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { leads } from "./leadsStore";
import { LeadState } from "./data";
import formidable, { Fields, Files, File as FormidableFile } from "formidable";
import path from "path";
import fs from "fs";
import { Readable } from "stream";
import { IncomingMessage } from "http";

// Disable Next.js body parsing so Formidable can handle the multipart request.
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET() {
  return NextResponse.json(leads, { status: 200 });
}

export async function POST(request: Request) {
  // Ensure the uploads directory exists.
  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Create a Formidable instance using the new API (v2+)
  const form = formidable({
    uploadDir,
    keepExtensions: true,
  });

  // Convert the Next.js Request body to a Buffer.
  const buffer = await request.arrayBuffer();
  // Create a Node.js Readable stream from the Buffer.
  const nodeStream = Readable.from(Buffer.from(buffer));
  // Create a fake IncomingMessage by adding headers from the Request.
  const nodeReq = Object.assign(nodeStream, {
    headers: Object.fromEntries(request.headers.entries()),
  }) as unknown as IncomingMessage;

  // Wrap form parsing in a Promise so we can await it.
  return new Promise((resolve) => {
    form.parse(nodeReq, (err: Error | null, fields: Fields, files: Files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        resolve(
          NextResponse.json(
            { error: "Error parsing form data" },
            { status: 500 },
          ),
        );
        return;
      }

      console.log("Fields:", fields);
      console.log("Files:", files);

      // Normalize visas field.
      const rawVisas = fields.visas as string | string[] | undefined;
      const finalVisas = rawVisas
        ? Array.isArray(rawVisas)
          ? rawVisas
          : [rawVisas]
        : [];

      const newLead = {
        id: uuidv4(),
        firstName: fields.firstName as unknown as string,
        lastName: fields.lastName as unknown as string,
        email: fields.email as unknown as string,
        linkedin: fields.linkedin as unknown as string,
        country: fields.country as unknown as string,
        visas: finalVisas,
        additionalInfo: fields.additionalInfo as unknown as string,
        state: LeadState.PENDING,
        submittedAt: new Date().toISOString(),
        resumeUrl: "",
      };

      // Handle file upload for resume.
      let resumeFile: FormidableFile | null = null;
      if (files.resume) {
        resumeFile = Array.isArray(files.resume)
          ? files.resume[0]
          : files.resume;
        console.log("Received file:", resumeFile);
        if (resumeFile && resumeFile.filepath) {
          const filename = path.basename(resumeFile.filepath);
          const targetPath = path.join(uploadDir, filename);
          try {
            fs.renameSync(resumeFile.filepath, targetPath);
            console.log("File moved using renameSync:", targetPath);
          } catch (error) {
            console.error("renameSync failed, trying copyFileSync:", error);
            try {
              fs.copyFileSync(resumeFile.filepath, targetPath);
              fs.unlinkSync(resumeFile.filepath);
              console.log("File copied and original removed:", targetPath);
            } catch (copyError) {
              console.error("Error copying file:", copyError);
            }
          }
          newLead.resumeUrl = "/uploads/" + filename;
        }
      }

      leads.push(newLead);
      resolve(NextResponse.json(newLead, { status: 201 }));
    });
  });
}
