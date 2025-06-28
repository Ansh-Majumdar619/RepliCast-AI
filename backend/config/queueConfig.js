// ✅ Redis queue configuration and processors using Bull
// import Bull from 'bull';
// import dotenv from 'dotenv';
// import { processAudio, processVideo, processText } from '../services/mediaProcessor.js';
// import ContentJob from '../models/ContentJob.js';

// dotenv.config();

// // ✅ Queues
// export const videoQueue = new Bull('videoQueue', process.env.REDIS_URL);
// export const audioQueue = new Bull('audioQueue', process.env.REDIS_URL);
// export const textQueue = new Bull('textQueue', process.env.REDIS_URL);

// // ✅ Process Video Jobs
// videoQueue.process(async (job) => {
//   const { filePath, metadata } = job.data;
//   console.log('🎥 Processing video job...');

//   const result = await processVideo(filePath, metadata);

//   await ContentJob.create({
//     type: 'video',
//     title: metadata.title || 'Untitled Video',
//     status: 'completed',
//     output: JSON.stringify(result),
//   });

//   console.log('✅ Video job completed and saved');
//   return result;
// });

// // ✅ Process Audio Jobs
// audioQueue.process(async (job) => {
//   const { filePath, metadata } = job.data;
//   console.log('🎧 Processing audio job...');

//   const result = await processAudio(filePath, metadata);

//   await ContentJob.create({
//     type: 'audio',
//     title: metadata.title || 'Untitled Audio',
//     status: 'completed',
//     output: JSON.stringify(result),
//   });

//   console.log('✅ Audio job completed and saved');
//   return result;
// });

// // ✅ Process Text Jobs
// textQueue.process(async (job) => {
//   const { filePath, metadata } = job.data;
//   console.log('📝 Processing text job...');

//   const result = await processText(filePath, metadata);

//   await ContentJob.create({
//     type: 'text',
//     title: metadata.title || 'Untitled Text',
//     status: 'completed',
//     output: JSON.stringify(result),
//   });

//   console.log('✅ Text job completed and saved');
//   return result;
// });

// // ✅ Queue Setup Function
// export const setupQueues = () => {
//   console.log('✅ Queues initialized and processors attached');
// };








import Bull from 'bull';
import dotenv from 'dotenv';
import { processAudio, processVideo, processText } from '../services/mediaProcessor.js';
import ContentJob from '../models/ContentJob.js';

dotenv.config();

// 🧠 Helper: Save content job
const saveJob = (type, title, result) =>
  ContentJob.create({
    type,
    title: title || `Untitled ${type[0].toUpperCase() + type.slice(1)}`,
    status: 'completed',
    output: JSON.stringify(result),
  });

// 🔁 Generic processor generator
const createProcessor = (type, handler) =>
  async ({ data: { filePath, metadata } }) => {
    console.log(`${type.emoji} Processing ${type.label} job...`);
    const result = await handler(filePath, metadata);
    await saveJob(type.key, metadata.title, result);
    console.log(`✅ ${type.label} job completed`);
    return result;
  };

// 🚀 Create queues
export const videoQueue = new Bull('videoQueue', process.env.REDIS_URL);
export const audioQueue = new Bull('audioQueue', process.env.REDIS_URL);
export const textQueue  = new Bull('textQueue', process.env.REDIS_URL);

// ⚙️ Attach processors to each queue
videoQueue.process(createProcessor({ key: 'video', emoji: '🎥', label: 'video' }, processVideo));
audioQueue.process(createProcessor({ key: 'audio', emoji: '🎧', label: 'audio' }, processAudio));
textQueue.process(createProcessor({ key: 'text', emoji: '📝', label: 'text' }, processText));

// ✅ Boot log
export const setupQueues = () => console.log('✅ Queues initialized and processors attached');
