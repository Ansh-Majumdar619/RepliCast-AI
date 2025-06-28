// import fs from 'fs';
// import path from 'path';
// import { exec } from 'child_process';
// import ytdl from 'ytdl-core';
// import { extractMetadata } from '../utils/extractMetadata.js';
// import { processVideo, processAudio, processText } from '../services/mediaProcessor.js';
// import { saveFileToStorage } from '../utils/fileHandler.js';
// import ContentJob from '../models/ContentJob.js';
// import GeneratedContent from '../models/GeneratedContent.js';




import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import ytdl from 'ytdl-core';
import { extractMetadata } from '../utils/extractMetadata.js';
import { processVideo, processAudio, processText } from '../services/mediaProcessor.js';
import { saveFileToStorage } from '../utils/fileHandler.js';
import ContentJob from '../models/ContentJob.js';
import GeneratedContent from '../models/GeneratedContent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);








// const __dirname = path.resolve();

// 🔁 Fallback content generator
const fallbackContent = (r) =>
  r.blog || r.summary || r.caption || r.thread || JSON.stringify(r) || 'No content generated';

// 📤 Upload from file
export const uploadContent = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const file = req.file;
    const metadata = await extractMetadata(file);
    const savedPath = await saveFileToStorage(file);
    const mimetype = file.mimetype;

    const [processor, type] =
      mimetype.startsWith('video')
        ? [processVideo, 'video']
        : mimetype.startsWith('audio')
        ? [processAudio, 'audio']
        : [processText, 'text'];

    const result = await processor(savedPath, metadata);

    await Promise.all([
      ContentJob.create({ type, title: metadata.title, status: 'completed', output: JSON.stringify(result) }),
      GeneratedContent.create({ type, content: fallbackContent(result) }),
    ]);

    res.status(200).json({ message: 'Processed successfully', result });
  } catch (err) {
    console.error('❌ Processing failed:', err.message);
    res.status(500).json({ error: 'Processing failed', details: err.message });
  }
};

// 🔗 Upload from YouTube URL
export const uploadFromURL = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'No URL provided' });

    const downloadsDir = path.join(__dirname, 'uploads');
    // const ytDlpPath = path.join(__dirname, 'utils', 'yt-dlp.exe');
    const ytDlpPath = path.join(__dirname, "utils", "yt-dlp"); // no .exe

    if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir);

    // 🏷️ Get video title
    exec(`"${ytDlpPath}" --get-title "${url}"`, (err, stdout) => {
      if (err) return res.status(500).json({ error: 'Title fetch failed', details: err.message });

      const rawTitle = stdout.trim();
      const safeTitle = rawTitle.replace(/[<>:"/\\|?*]+/g, '').replace(/\s+/g, '_');
      const outputPath = path.join(downloadsDir, `${safeTitle}.mp4`);
      const metadata = { title: rawTitle };

      // 🎞️ Download video
      exec(`"${ytDlpPath}" -f best -o "${outputPath}" "${url}"`, async (err) => {
        if (err) return res.status(500).json({ error: 'Download failed', details: err.message });

        const result = await processVideo(outputPath, metadata);

        await Promise.all([
          ContentJob.create({ type: 'video', title: rawTitle, status: 'completed', output: JSON.stringify(result) }),
          GeneratedContent.create({ type: 'video', content: fallbackContent(result), result }),
        ]);

        res.status(200).json({ message: 'YouTube video processed', result });
      });
    });
  } catch (err) {
    console.error('❌ Upload from URL failed:', err.message);
    res.status(500).json({ error: 'URL processing failed', details: err.message });
  }
};
