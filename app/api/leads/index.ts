// pages/api/leads/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { leads, Lead, LeadState } from "./data";
import formidable, {
  IncomingForm,
  Fields,
  Files,
  File as FormidableFile,
} from "formidable";
import path from "path";
import fs from "fs";

interface ExtendedIncomingForm extends InstanceType<typeof IncomingForm> {
  uploadDir: string;
  keepExtensions: boolean;
}

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parsing
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    return res.status(200).json(leads);
  }

  if (req.method === "POST") {
    const form = new formidable.IncomingForm() as ExtendedIncomingForm;

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    form.uploadDir = uploadDir;
    form.keepExtensions = true;

    form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return res.status(500).json({ error: "Error parsing form data" });
      }

      // Normalize visas field
      const rawVisas = fields.visas as string | string[] | undefined;
      let finalVisas: string[] = [];
      if (rawVisas) {
        finalVisas = Array.isArray(rawVisas) ? rawVisas : [rawVisas];
      }

      const newLead: Lead = {
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
      };

      // Handle file upload for resume
      let resumeFile: FormidableFile | null = null;
      if (files.resume) {
        resumeFile = Array.isArray(files.resume)
          ? files.resume[0]
          : files.resume;
        if (resumeFile) {
          // Optional: Move file from temp location to uploads folder
          const filename = path.basename(resumeFile.filepath);
          const targetPath = path.join(uploadDir, filename);
          fs.renameSync(resumeFile.filepath, targetPath);
          newLead.resumeUrl = "/uploads/" + filename;
        }
      }

      leads.push(newLead);
      return res.status(201).json(newLead);
    });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
