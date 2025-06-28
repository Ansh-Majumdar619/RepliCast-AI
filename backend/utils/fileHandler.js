// import fs from 'fs';
// import path from 'path';

// export const saveFileToStorage = async (file) => {
//   const uploadsDir = path.join(process.cwd(), 'uploads'); // Absolute path to /uploads
//   const ext = path.extname(file.originalname);
//   const newFilename = `${file.fieldname}_${Date.now()}${ext}`;
//   const newPath = path.join(uploadsDir, newFilename);

//   // Ensure the uploads folder exists
//   if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir, { recursive: true });
//   }

//   // Move file to new location
//   await fs.promises.rename(file.path, newPath);

//   // Return relative path to serve on frontend
//   return `uploads/${newFilename}`;
// };












import fs from 'fs';
import path from 'path';

/**
 * Moves the uploaded file to the /uploads folder and returns paths.
 * @param {Object} file - Multer file object with .path and .originalname
 * @returns {Object} { relativePath, absolutePath }
 */
export const saveFileToStorage = async (file) => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const ext = path.extname(file.originalname || ''); // fallback for yt-dlp
  const newFilename = `${file.fieldname || 'media'}_${Date.now()}${ext}`;
  const newPath = path.join(uploadsDir, newFilename);

  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Move file to new location (only if using multer)
  if (file.path && fs.existsSync(file.path)) {
    await fs.promises.rename(file.path, newPath);
  }

  return {
    relativePath: `uploads/${newFilename}`,    // used by frontend or static serving
    absolutePath: newPath                      // used internally for processing
  };
};
