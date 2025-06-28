
# 🚀 Repli Cast

> **One Input → Many Outputs**  
> Transform a single video, audio, or text file into multiple platform-optimized formats automatically using AI.

---

## 🎯 Objective

This project streamlines the content creation process by repurposing a single piece of content into multiple formats such as YouTube Shorts, Instagram Reels, Twitter threads, LinkedIn blogs, and more. Powered by AI, the platform dramatically reduces manual workload by up to 90%, enabling creators and marketers to focus on strategy and storytelling.

---

## 🧩 Features

- ✅ Upload from file or URL
- 🎬 Convert long videos into shorts
- ✍️ Generate blog posts & summaries
- 🧵 Convert into Twitter threads
- 🎧 Transcribe and summarize podcasts
- 📈 Performance Dashboard (Optional)
- 📅 Schedule content for publishing
- 🧠 AI-Powered formatting and SEO optimization

---

## 🖼️ UI Screenshots

### Upload Page
![Upload Page](https://github.com/Ansh-Majumdar619/RepliCast-AI/blob/main/frontend/public/uploadpage.png)

### Home Page
![Preview Page](https://github.com/Ansh-Majumdar619/RepliCast-AI/blob/main/frontend/public/homepage.png)

### Dashboard Page
![Dashboard](https://github.com/Ansh-Majumdar619/RepliCast-AI/blob/main/frontend/public/dashboard.png)

---

## 🧱 UI Sketch / Wireframe

```
┌──────────────────────────────┐
│         Navbar               │
│ ┌──────┐  ┌──────┐  ┌──────┐ │
│ │ Home │  │Upload│  │ Docs │ │
│ └──────┘  └──────┘  └──────┘ │
└──────────────────────────────┘

┌─────────────── Upload Page ───────────────┐
│ [📁 Upload File]  or  [🔗 Paste URL]       │
│ File Type: [Auto-Detect]                  │
│ Metadata: Title, Duration, Keywords       │
│ [Generate Formats]  → [Processing...]     │
└───────────────────────────────────────────┘

┌────────── Generated Formats ─────────────┐
│ 🎬 Reels    [Preview] [Download]         │
│ ✍️ Blog     [View/Edit] [Copy]           │
│ 🧵 Thread   [View/Edit] [Copy]           │
│ 🎧 Podcast  [Play] [Download]            │
└──────────────────────────────────────────┘

┌──── Dashboard (Optional) ────┐
│ Format: Reel | 📈 12% Engage │
│ Scheduled: ✅ | #AI #Growth  │
└─────────────────────────────┘
```

---

## 🔁 Pipeline Overview

```
User Upload → Metadata Extraction → Bull Queue →
AI Repurposing (Video/Text/Audio) → GPT Rewriting →
Content Previews → Download / Schedule Output
```

---

## ⚙️ Tech Stack

- **Frontend**: React.js + Framer Motion
- **Backend**: Node.js, Express, Bull Queue
- **AI**: OpenAI GPT (Summarization, SEO, Threads)
- **Media Tools**: FFmpeg, yt-dlp
- **Storage**: Local / Cloud (Multer, fs)
- **Database**: PostgreSQL

---

## 📂 Documentation

- [`API_Documentation.md`](./docs/API_Documentation.md)
- [`Pipeline_Flow_Diagram.png`](./docs/Pipeline_Flow_Diagram.png)
- [`ROI_Analysis.pdf`](./docs/ROI_Analysis.pdf)

---

> ⚡ Create once. Repurpose everywhere.
