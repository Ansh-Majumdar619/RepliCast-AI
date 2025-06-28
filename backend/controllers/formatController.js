// ✅ Dummy endpoint to show formats
export const getFormats = (req, res) => {
  res.json({
    message: 'Formats retrieved',
    formats: ['YouTube Shorts', 'Twitter Thread', 'Blog Post'],
  });
};
