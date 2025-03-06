// pages/api/leads/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { leads, Lead } from "./data";
import formidable, {
  IncomingForm,
  Fields,
  Files,
  File as FormidableFile,
} from "formidable";
import path from "path";

// Define an extended interface for the incoming form instance
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
    // Create a new instance of IncomingForm and cast it as ExtendedIncomingForm.
    const form = new formidable.IncomingForm() as ExtendedIncomingForm;
    form.uploadDir = path.join(process.cwd(), "public/uploads"); // Ensure this folder exists
    form.keepExtensions = true;

    form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error parsing form data" });
      }

      // Normalize the visas field: it could be undefined, a string, or an array of strings.
      const rawVisas = fields.visas as string | string[] | undefined;
      let finalVisas: string[];
      if (!rawVisas) {
        finalVisas = [];
      } else if (Array.isArray(rawVisas)) {
        finalVisas = rawVisas;
      } else {
        finalVisas = [rawVisas];
      }

      const newLead: Lead = {
        id: uuidv4(),
        firstName: fields.firstName as unknown as string,
        lastName: fields.lastName as unknown as string,
        email: fields.email as unknown as string,
        linkedin: fields.linkedin as unknown as string,
        visas: finalVisas,
        additionalInfo: fields.additionalInfo as unknown as string,
        state: "PENDING",
        submittedAt: new Date().toISOString(),
      };

      // Handle file upload for resume
      let resumeFile: FormidableFile | null = null;
      if (files.resume) {
        if (Array.isArray(files.resume)) {
          resumeFile = files.resume[0];
        } else {
          resumeFile = files.resume;
        }
        if (resumeFile) {
          newLead.resumeUrl = "/uploads/" + path.basename(resumeFile.filepath);
        }
      }

      leads.push(newLead);
      return res.status(201).json(newLead);
    });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
