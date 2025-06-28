// 📦 Imports
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { extractMetadata } from '../utils/extractMetadata.js';
import { processVideo, processAudio, processText } from '../services/mediaProcessor.js';
import { saveFileToStorage } from '../utils/fileHandler.js';
import ContentJob from '../models/ContentJob.js';
import GeneratedContent from '../models/GeneratedContent.js';

// 🧭 __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extractVideoId = (url) => {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
};

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

// 📥 Helper to download stream
const downloadFile = async (url, outputPath) => {
  const response = await axios({ url, responseType: 'stream' });
  const writer = fs.createWriteStream(outputPath);
  return new Promise((resolve, reject) => {
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

// 🔗 Upload from YouTube URL using Piped.video
export const uploadFromURL = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'No URL provided' });

    const videoId = extractVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    const pipedAPI = `https://pipedapi.kavin.rocks/streams/${videoId}`;
    const response = await axios.get(pipedAPI);

    const videoTitle = response.data.title || 'youtube_video';
    const safeTitle = videoTitle.replace(/[<>:"/\\|?*]+/g, '').replace(/\s+/g, '_');
    const videoStreamUrl = response.data.videoStreams?.[0]?.url;

    if (!videoStreamUrl) return res.status(500).json({ error: 'No stream found for video' });

    const downloadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });

    const filePath = path.join(downloadsDir, `${safeTitle}.mp4`);

    const videoStream = await axios({
      method: 'get',
      url: videoStreamUrl,
      responseType: 'stream',
    });

    await pipeline(videoStream.data, fs.createWriteStream(filePath));

    const result = await processVideo(filePath, { title: videoTitle });

    await Promise.all([
      ContentJob.create({ type: 'video', title: videoTitle, status: 'completed', output: JSON.stringify(result) }),
      GeneratedContent.create({ type: 'video', content: result.blog || result.caption || 'Generated', result }),
    ]);

    res.status(200).json({ message: 'YouTube video processed via Piped', result });
  } catch (err) {
    console.error('❌ Upload from URL failed:', err);
    res.status(500).json({ error: 'URL processing failed', details: err.message });
  }
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

