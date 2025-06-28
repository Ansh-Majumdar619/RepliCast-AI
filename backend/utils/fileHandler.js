import fs from 'fs';
import path from 'path';

export const saveFileToStorage = async (file) => {
  const uploadsDir = path.join(process.cwd(), 'uploads'); // Absolute path to /uploads
  const ext = path.extname(file.originalname);
  const newFilename = `${file.fieldname}_${Date.now()}${ext}`;
  const newPath = path.join(uploadsDir, newFilename);

  // Ensure the uploads folder exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Move file to new location
  await fs.promises.rename(file.path, newPath);

  // Return relative path to serve on frontend
  return `uploads/${newFilename}`;
};
