import { generateTextFromPrompt } from './aiService.js';
import { transcribeAudio } from './audioTranscriber.js';
import fs from 'fs';
import path from 'path';

// 📦 Rename uploaded file
const renameFile = (originalPath, prefix, ext) => {
  const newPath = path.join('uploads', `${prefix}_${Date.now()}.${ext}`);
  fs.renameSync(originalPath, newPath);
  return newPath;
};

// 🏷️ Generate and clean hashtags
const generateHashtags = async (prompt) =>
  (await generateTextFromPrompt(prompt)).trim().split('\n').filter(Boolean);

// 📹 Video Processing
export const processVideo = async (originalPath, metadata) => {
  try {
    const output = renameFile(originalPath, 'short_clip', 'mp4');

    const [caption, hashtags] = await Promise.all([
      generateTextFromPrompt(
        `Create an engaging Instagram Reel caption for the video titled "${metadata.title}". Include 3 trending hashtags.`
      ),
      generateHashtags(`Generate 3 popular Instagram hashtags related to: "${metadata.title}"`)
    ]);

    return { type: 'video', output, caption, hashtags };
  } catch (err) {
    console.error('❌ Video processing failed:', err.message);
    throw err;
  }
};

// 🎧 Audio Processing
export const processAudio = async (originalPath, metadata) => {
  try {
    const output = renameFile(originalPath, 'podcast_audio', 'mp3');
    const transcript = await transcribeAudio(output);

    const [summary, thread, hashtags] = await Promise.all([
      generateTextFromPrompt(
        `You're an expert podcast summarizer. Summarize this transcript in a structured way with key points, timestamps, and a takeaway:\n\nTranscript:\n${transcript}`
      ),
      generateTextFromPrompt(`Convert this podcast summary into a 5-tweet Twitter thread:\n\n${transcript}`),
      generateHashtags(`Suggest 5 relevant SEO-friendly hashtags for this podcast: "${metadata.title}"`)
    ]);

    return { type: 'audio', output, summary, thread, hashtags };
  } catch (err) {
    console.error('❌ Audio processing failed:', err.message);
    throw err;
  }
};

// 📝 Text Processing
export const processText = async (path, metadata) => {
  try {
    const [blog, seo, hashtags] = await Promise.all([
      generateTextFromPrompt(
        `Write a professional LinkedIn-style blog post based on the title: "${metadata.title}". Use headings, short paragraphs, and end with a strong CTA.`
      ),
      generateTextFromPrompt(
        `Generate a meta title and meta description for SEO based on the blog topic: "${metadata.title}". Format: \nTitle: ...\nDescription: ...`
      ),
      generateHashtags(`Suggest 5 SEO-optimized hashtags for this blog post topic: "${metadata.title}"`)
    ]);

    return { type: 'text', output: 'formatted_blog.txt', blog, seo, hashtags };
  } catch (err) {
    console.error('❌ Text processing failed:', err.message);
    throw err;
  }
};
