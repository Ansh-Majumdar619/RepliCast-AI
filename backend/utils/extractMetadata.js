// ✅ Extract mock metadata from file
export const extractMetadata = async (file) => {
  return {
    title: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
  };
};
