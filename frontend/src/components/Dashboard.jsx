/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { fetchGeneratedContent } from '../api/contentAPI';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// 📊 Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [filteredType, setFilteredType] = useState('all');
  const [sortKey, setSortKey] = useState('impressions');

  // 🧠 Fetch content from API on component mount
  useEffect(() => {
    fetchGeneratedContent()
      .then(res => setItems(res.data))
      .catch(console.error);
  }, []);

  // 🔐 Safely parse JSON content (fallback if not valid JSON)
  const safeParse = (input) => {
    try {
      return JSON.parse(input);
    } catch {
      return { fallbackText: input };
    }
  };

  // 🔍 Filter and sort items based on dropdown selections
  const filteredItems = items
    .filter(item => filteredType === 'all' || item.type === filteredType)
    .sort((a, b) => b[sortKey] - a[sortKey]);

  // 📊 Chart config
  const chartData = {
    labels: filteredItems.map((item, i) => `${item.type}-${i + 1}`),
    datasets: [{
      label: `📊 ${sortKey === 'impressions' ? 'Impressions' : 'Clicks'}`,
      data: filteredItems.map(item => item[sortKey]),
      backgroundColor: '#dfcea9',
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '📊 Performance Overview' },
    },
  };

  return (
    <div className="min-h-screen bg-black text-[#dfcea9] p-4 sm:p-6 md:p-8">
      {/* 🔥 Dashboard Title */}
      <motion.h2 
        initial={{ y: -40, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl font-bold mb-6 text-center"
      >
        🚀 Dashboard Overview
      </motion.h2>

      {/* 🎛️ Filter and Sort Controls */}
      <motion.div
        className="flex flex-wrap gap-4 justify-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Filter by Type */}
        <label className="flex flex-col text-sm">
          Filter Type:
          <select
            value={filteredType}
            onChange={(e) => setFilteredType(e.target.value)}
            className="bg-black text-[#dfcea9] border border-[#dfcea9] px-3 py-1 rounded"
          >
            {['all', 'video', 'audio', 'text'].map(type => (
              <option key={type} value={type}>{type[0].toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </label>

        {/* Sort by Metric */}
        <label className="flex flex-col text-sm">
          Sort By:
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="bg-black text-[#dfcea9] border border-[#dfcea9] px-3 py-1 rounded"
          >
            {['impressions', 'clicks'].map(key => (
              <option key={key} value={key}>{key[0].toUpperCase() + key.slice(1)}</option>
            ))}
          </select>
        </label>
      </motion.div>

      {/* 📊 Chart Area */}
      {filteredItems.length > 0 && (
        <motion.div
          className="bg-[#1a1a1a] p-4 rounded-xl shadow-md mb-10"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Bar data={chartData} options={chartOptions} />
        </motion.div>
      )}

      {/* 🧾 Content Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <p className="col-span-full text-center text-lg">No content found.</p>
        ) : (
          filteredItems.map((item, idx) => {
            const data = safeParse(item.content);
            return (
              <motion.div
                key={idx}
                className="bg-[#1f1f1f] p-5 rounded-lg shadow-lg border border-[#dfcea9]/30"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
              >
                {/* 🧩 Card Content */}
                <h3 className="text-xl font-semibold mb-2">
                  {{
                    video: '🎬 Instagram Reel',
                    audio: '🎧 Podcast',
                    text: '📝 Blog Post',
                  }[item.type]}
                </h3>
                <p className="text-sm mb-1">📅 Scheduled: {item.scheduledAt ? '✅' : '❌'}</p>
                <p className="text-sm mb-1">📈 Impressions: {item.impressions}</p>
                <p className="text-sm mb-1">🖱️ Clicks: {item.clicks}</p>
                <p className="text-sm mb-1">📊 Engagement: {item.engagementRate}%</p>

                {/* 🏷️ Hashtags */}
                {data.hashtags?.length > 0 && (
                  <p className="text-sm mt-2 text-[#dfcea9]">
                    Hashtags: {data.hashtags.map(tag => `#${tag}`).join(' ')}
                  </p>
                )}

                {/* 📝 Fallback Raw Text */}
                {data.fallbackText && (
                  <p className="text-sm mt-2 text-gray-300">{data.fallbackText}</p>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
