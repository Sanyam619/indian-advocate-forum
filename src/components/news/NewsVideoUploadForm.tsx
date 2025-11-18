import React, { useState, useEffect } from 'react';
import { Upload, X, Play, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

interface NewsVideoUploadFormProps {
  onSubmit: (formData: {
    title: string;
    content: string;
    category: string;
    tags: string[];
    imageUrl?: string;
    videoUrl?: string;
    videoThumbnail?: string;
    hasVideo: boolean;
  }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  articleId?: string; // Optional prop for edit mode
}

const NewsVideoUploadForm: React.FC<NewsVideoUploadFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  articleId
}) => {
  const router = useRouter();
  const [fetchingData, setFetchingData] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Legal Update',
    tags: '',
    imageUrl: '',
    videoUrl: '',
    videoThumbnail: '',
    hasVideo: false
  });

  const [dragActive, setDragActive] = useState(false);
  
  // Check if we're in edit mode
  const isEditMode = !!articleId || !!router.query.id;
  const id = articleId || (router.query.id as string);

  const categories = [
    'Supreme Court',
    'High Court',
    'Legal Update',
    'Judgment',
    'Case Analysis'
  ];

  // Fetch news data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchNews = async () => {
        setFetchingData(true);
        try {
          const response = await fetch(`/api/news?id=${id}`);
          const result = await response.json();
          
          if (result.success && result.news) {
            const newsItem = result.news;
            setFormData({
              title: newsItem.title || '',
              content: newsItem.content || '',
              category: newsItem.category || 'Legal Update',
              tags: (newsItem.tags || []).join(', '),
              imageUrl: newsItem.imageUrl || '',
              videoUrl: newsItem.videoUrl || '',
              videoThumbnail: newsItem.videoThumbnail || '',
              hasVideo: newsItem.hasVideo || false
            });
          } else {
            toast.error('Failed to load news article data');
          }
        } catch (error) {
          console.error('Error fetching news:', error);
          toast.error('Error loading news article data');
        } finally {
          setFetchingData(false);
        }
      };
      
      fetchNews();
    }
  }, [isEditMode, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    onSubmit({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: tagsArray,
      imageUrl: formData.imageUrl || undefined,
      videoUrl: formData.videoUrl || undefined,
      videoThumbnail: formData.videoThumbnail || undefined,
      hasVideo: formData.hasVideo && !!formData.videoUrl
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit News Article' : 'Create News Article'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Article Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter article title"
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
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Article Content *
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={8}
                value={formData.content}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
                placeholder="Enter the full article content"
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter tags separated by commas (e.g., Criminal Law, Evidence, Procedure)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate multiple tags with commas
              </p>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Video Support Toggle */}
            <div className="border rounded-lg p-4 bg-purple-50">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="hasVideo"
                  name="hasVideo"
                  checked={formData.hasVideo}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="hasVideo" className="ml-2 text-sm font-medium text-gray-700">
                  This article includes video content
                </label>
              </div>

              {formData.hasVideo && (
                <div className="space-y-4">
                  {/* Video URL */}
                  <div>
                    <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                      Video URL *
                    </label>
                    <input
                      type="url"
                      id="videoUrl"
                      name="videoUrl"
                      required={formData.hasVideo}
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://res.cloudinary.com/your-cloud/video/upload/v1234567890/video.mp4"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Upload your video to Cloudinary and paste the URL here
                    </p>
                  </div>

                  {/* Video Thumbnail */}
                  <div>
                    <label htmlFor="videoThumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                      Video Thumbnail URL
                    </label>
                    <input
                      type="url"
                      id="videoThumbnail"
                      name="videoThumbnail"
                      value={formData.videoThumbnail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://res.cloudinary.com/your-cloud/image/upload/v1234567890/thumbnail.jpg"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Optional: Thumbnail image that appears before video plays
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Media Preview */}
            {(formData.imageUrl || (formData.hasVideo && formData.videoUrl)) && (
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Media Preview</h3>
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  {formData.hasVideo && formData.videoUrl ? (
                    <div className="relative w-full h-full">
                      {formData.videoThumbnail ? (
                        <img
                          src={formData.videoThumbnail}
                          alt="Video thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Play className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-purple-600 ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  ) : formData.imageUrl ? (
                    <img
                      src={formData.imageUrl}
                      alt="Article preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || fetchingData}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {fetchingData ? 'Loading...' : isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Article' : 'Create Article')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsVideoUploadForm;