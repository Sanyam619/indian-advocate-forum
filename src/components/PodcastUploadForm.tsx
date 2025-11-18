import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { VideoCameraIcon, LinkIcon, TagIcon } from '@heroicons/react/24/outline';

interface PodcastFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
}

const categories = [
  'Legal Discussion',
  'Case Analysis', 
  'Supreme Court Updates',
  'High Court News',
  'Legal Education',
  'Constitutional Law',
  'Criminal Law',
  'Civil Law',
  'Corporate Law',
  'Legal Tips'
];

const PodcastUploadForm: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // For edit mode
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [formData, setFormData] = useState<PodcastFormData>({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: '',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');

  // Fetch podcast data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchPodcast = async () => {
        setFetchingData(true);
        try {
          // Use admin endpoint to bypass isPublished check
          const response = await fetch(`/api/podcasts/${id}`);
          const result = await response.json();
          
          if (result.success && result.podcast) {
            setFormData({
              title: result.podcast.title || '',
              description: result.podcast.description || '',
              videoUrl: result.podcast.videoUrl || '',
              thumbnailUrl: result.podcast.thumbnailUrl || '',
              category: result.podcast.category || '',
              tags: result.podcast.tags || []
            });
          } else {
            toast.error('Failed to load podcast data');
          }
        } catch (error) {
          console.error('Error fetching podcast:', error);
          toast.error('Error loading podcast data');
        } finally {
          setFetchingData(false);
        }
      };
      
      fetchPodcast();
    }
  }, [isEditMode, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return false;
    }
    if (!formData.videoUrl.trim()) {
      toast.error('Video URL is required');
      return false;
    }
    if (!formData.category) {
      toast.error('Category is required');
      return false;
    }
    if (!formData.videoUrl.includes('cloudinary.com')) {
      toast.error('Please provide a valid Cloudinary video URL');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const url = isEditMode ? '/api/admin/edit-podcast' : '/api/podcasts';
      const method = isEditMode ? 'PUT' : 'POST';
      const body = isEditMode 
        ? JSON.stringify({ podcastId: id, ...formData })
        : JSON.stringify(formData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Podcast ${isEditMode ? 'updated' : 'created'} successfully!`);
        router.push('/admin-panel');
      } else {
        toast.error(data.message || `Failed to ${isEditMode ? 'update' : 'create'} podcast`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} podcast:`, error);
      toast.error(`Error ${isEditMode ? 'updating' : 'creating'} podcast`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading podcast data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditMode ? 'Edit' : 'Upload New'} Video Podcast
        </h1>
        <p className="text-gray-600">
          {isEditMode ? 'Update' : 'Add a new'} video podcast by providing the Cloudinary URL and details
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">📤 Upload Instructions:</h3>
        <ol className="text-blue-800 text-sm space-y-1">
          <li>1. Upload your video to Cloudinary dashboard</li>
          <li>2. Copy the video URL from Cloudinary</li>
          <li>3. Paste the URL below and fill in the details</li>
          <li>4. Submit to publish your podcast</li>
        </ol>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Podcast Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g. Supreme Court Analysis on Privacy Rights"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe what this podcast covers..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Video URL */}
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
            <VideoCameraIcon className="h-5 w-5 inline mr-1" />
            Cloudinary Video URL *
          </label>
          <input
            type="url"
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleInputChange}
            placeholder="https://res.cloudinary.com/your-cloud/video/upload/v1234567890/video.mp4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Paste the full Cloudinary video URL here
          </p>
        </div>

        {/* Thumbnail URL */}
        <div>
          <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700 mb-2">
            <LinkIcon className="h-5 w-5 inline mr-1" />
            Thumbnail URL (Optional)
          </label>
          <input
            type="url"
            id="thumbnailUrl"
            name="thumbnailUrl"
            value={formData.thumbnailUrl}
            onChange={handleInputChange}
            placeholder="https://res.cloudinary.com/your-cloud/image/upload/v1234567890/thumbnail.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Leave empty to auto-generate from video
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <TagIcon className="h-5 w-5 inline mr-1" />
            Tags (Optional)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a tag and press Enter"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Add
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading 
              ? `${isEditMode ? 'Updating' : 'Creating'} Podcast...` 
              : `🎬 ${isEditMode ? 'Update' : 'Create'} Video Podcast`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PodcastUploadForm;