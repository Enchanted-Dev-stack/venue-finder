const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload a file to Cloudinary
 * @param {string} file - File path or URL
 * @param {Object} options - Upload options (folder, resource_type, etc)
 * @returns {Promise} - Cloudinary upload result
 */
const uploadToCloudinary = async (file, options = {}) => {
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'venue_uploads';
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    throw new Error('Cloudinary cloud name is not configured');
  }

  // Create form data for upload
  const formData = new FormData();
  formData.append('upload_preset', preset);
  
  // Handle both File objects and base64 strings
  if (typeof file === 'string' && file.startsWith('data:')) {
    formData.append('file', file);
  } else if (file instanceof File) {
    formData.append('file', file);
  } else {
    throw new Error('Invalid file format');
  }

  // Add any additional options
  Object.keys(options).forEach(key => {
    formData.append(key, options[key]);
  });

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload image');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - Cloudinary public ID of the file
 * @returns {Promise} - Cloudinary deletion result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary
}; 