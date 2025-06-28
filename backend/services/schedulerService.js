// ✅ This service allows you to schedule when to run specific tasks (like content repurposing, posting, etc.)

// ✅ This service allows scheduling recurring jobs (like posting or repurposing content)


import cron from 'node-cron';
import { generateTextFromPrompt } from './aiService.js';
import GeneratedContent from '../models/GeneratedContent.js';

// 🔁 Define all jobs with config
const jobs = [
  {
    schedule: '0 10 * * *', // 🧵 Daily Twitter thread at 10:00 AM
    prompt: 'Generate a Twitter thread on how content repurposing boosts ROI for creators',
    type: 'twitter-thread',
    platform: 'Twitter',
    purpose: 'ROI Awareness',
    log: '🕙 Twitter Thread',
  },
  {
    schedule: '30 10 * * *', // 🏷️ Hashtag suggestions at 10:30 AM
    prompt: 'Generate 10 SEO-optimized hashtags for content about AI and digital marketing.',
    type: 'hashtags',
    platform: 'Instagram',
    purpose: 'SEO Boost',
    log: '🏷️ Hashtag Suggestions',
  },
  {
    schedule: '0 9 * * MON', // 📈 Weekly SEO blog every Monday at 9:00 AM
    prompt: 'Write an SEO-optimized blog post about the benefits of content repurposing for creators.',
    type: 'blog',
    platform: 'LinkedIn',
    purpose: 'SEO Blog',
    log: '📈 SEO Blog',
  }
];

// ⚙️ Register all jobs in loop
export const startSchedulers = () => {
  console.log('✅ Starting scheduled tasks...');

  jobs.forEach(({ schedule, prompt, type, platform, purpose, log }) => {
    cron.schedule(schedule, async () => {
      try {
        console.log(`${log} generation started...`);
        const content = await generateTextFromPrompt(prompt);

        console.log(`✅ ${log} Generated:\n`, content);

        await GeneratedContent.create({ type, platform, content, purpose });
      } catch (err) {
        console.error(`❌ ${log} generation failed:`, err.message);
      }
    });
  });
};
