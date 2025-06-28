// 📦 Imports
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ytdl from 'ytdl-core';
import { extractMetadata } from '../utils/extractMetadata.js';
import { processVideo, processAudio, processText } from '../services/mediaProcessor.js';
import { saveFileToStorage } from '../utils/fileHandler.js';
import ContentJob from '../models/ContentJob.js';
import GeneratedContent from '../models/GeneratedContent.js';

// 🧭 __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔁 Fallback content generator
const fallbackContent = (r) =>
  r.blog || r.summary || r.caption || r.thread || JSON.stringify(r) || 'No content generated';

// 📤 Upload from file
export const uploadContent = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const file = req.file;
    const metadata = await extractMetadata(file);
    const { absolutePath } = await saveFileToStorage(file);
    const mimetype = file.mimetype;

    const [processor, type] =
      mimetype.startsWith('video')
        ? [processVideo, 'video']
        : mimetype.startsWith('audio')
        ? [processAudio, 'audio']
        : [processText, 'text'];

    const result = await processor(absolutePath, metadata);

    await Promise.all([
      ContentJob.create({ type, title: metadata.title, status: 'completed', output: JSON.stringify(result) }),
      GeneratedContent.create({ type, content: fallbackContent(result) }),
    ]);

    res.status(200).json({ message: 'Processed successfully', result });
  } catch (err) {
    console.error('❌ File processing failed:', err);
    res.status(500).json({ error: 'Processing failed', details: err.message });
  }
};

// 🔗 Upload from YouTube URL
export const uploadFromURL = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'No URL provided' });
  let info;
  try {
    info = await ytdl.getInfo(url);
  } catch (e) {
    console.error('❌ ytdl.getInfo failed:', e);
    return res.status(500).json({ error: 'Fetch info failed', details: e.message });
  }

  const rawTitle = info.videoDetails.title;
  const safeTitle = rawTitle.replace(/[<>:"/\\|?*]+/g, '').replace(/\s+/g, '_');
  const downloadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });

  const outputPath = path.join(downloadsDir, `${safeTitle}.mp4`);
  console.log('➡️ Downloading to:', outputPath);

  const video = ytdl(url, { quality: 'highestvideo' });
  const writeStream = fs.createWriteStream(outputPath);

  video.pipe(writeStream);

  writeStream.on('finish', async () => {
    console.log('✅ Download finished, processing video.');
    try {
      const result = await processVideo(outputPath, { title: rawTitle });
      await Promise.all([
        ContentJob.create({ type: 'video', title: rawTitle, status: 'completed', output: JSON.stringify(result) }),
        GeneratedContent.create({ type: 'video', content: fallbackContent(result), result })
      ]);
      return res.status(200).json({ message: 'Processed', result });
    } catch (e) {
      console.error('❌ Video processing error:', e);
      return res.status(500).json({ error: 'Processing failed', details: e.message });
    }
  });

  writeStream.on('error', (e) => {
    console.error('❌ File write error:', e);
    return res.status(500).json({ error: 'Download failed', details: e.message });
  });
};
















// // 📦 Imports
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { exec } from 'child_process';
// import ytdl from 'ytdl-core';
// import { extractMetadata } from '../utils/extractMetadata.js';
// import { processVideo, processAudio, processText } from '../services/mediaProcessor.js';
// import { saveFileToStorage } from '../utils/fileHandler.js';
// import ContentJob from '../models/ContentJob.js';
// import GeneratedContent from '../models/GeneratedContent.js';

// // 🧭 __dirname equivalent for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// 🔁 Fallback content generator
// const fallbackContent = (r) =>
//   r.blog || r.summary || r.caption || r.thread || JSON.stringify(r) || 'No content generated';

// // 📤 Upload from file
// export const uploadContent = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

//     const file = req.file;
//     const metadata = await extractMetadata(file);
//     const { absolutePath } = await saveFileToStorage(file);
//     const mimetype = file.mimetype;

//     const [processor, type] =
//       mimetype.startsWith('video')
//         ? [processVideo, 'video']
//         : mimetype.startsWith('audio')
//         ? [processAudio, 'audio']
//         : [processText, 'text'];

//     const result = await processor(absolutePath, metadata);

//     await Promise.all([
//       ContentJob.create({ type, title: metadata.title, status: 'completed', output: JSON.stringify(result) }),
//       GeneratedContent.create({ type, content: fallbackContent(result) }),
//     ]);

//     res.status(200).json({ message: 'Processed successfully', result });
//   } catch (err) {
//     console.error('❌ File processing failed:', err);
//     res.status(500).json({ error: 'Processing failed', details: err.message });
//   }
// };

// // 🔗 Upload from YouTube URL
// export const uploadFromURL = async (req, res) => {
//   try {
//     const { url } = req.body;
//     if (!url) return res.status(400).json({ error: 'No URL provided' });

//     const downloadsDir = path.join(__dirname, 'uploads');
//     // const ytDlpPath = path.join(__dirname, 'utils', 'yt-dlp'); // Linux binary
//     const ytDlpPath = path.join(__dirname, '..', 'utils', 'yt-dlp');


    // if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });

    // // 🏷️ Get video title
    // exec(`"${ytDlpPath}" --get-title "${url}"`, (err, stdout) => {
    //   if (err) {
    //     console.error('⛔ yt-dlp title fetch error:', err);
    //     return res.status(500).json({ error: 'Title fetch failed', details: err.message });
    //   }

    //   const rawTitle = stdout.trim();
    //   const safeTitle = rawTitle.replace(/[<>:"/\\|?*]+/g, '').replace(/\s+/g, '_');
    //   const outputPath = path.join(downloadsDir, `${safeTitle}.mp4`);
    //   const metadata = { title: rawTitle };

    //   // 🎞️ Download video
    //   exec(`"${ytDlpPath}" -f best -o "${outputPath}" "${url}"`, async (err) => {
    //     if (err) {
    //       console.error('⛔ yt-dlp download error:', err);
    //       return res.status(500).json({ error: 'Download failed', details: err.message });
    //     }

//         try {
//           const result = await processVideo(outputPath, metadata);

//           await Promise.all([
//             ContentJob.create({ type: 'video', title: rawTitle, status: 'completed', output: JSON.stringify(result) }),
//             GeneratedContent.create({ type: 'video', content: fallbackContent(result), result }),
//           ]);

//           res.status(200).json({ message: 'YouTube video processed', result });
//         } catch (processingError) {
//           console.error('❌ Video processing error:', processingError);
//           res.status(500).json({ error: 'Processing failed', details: processingError.message });
//         }
//       });
//     });
//   } catch (err) {
//     console.error('❌ Upload from URL failed:', err);
//     res.status(500).json({ error: 'URL processing failed', details: err.message });
//   }
// };

