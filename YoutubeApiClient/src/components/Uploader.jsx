import React, { useState, useRef } from 'react';
import axios from 'axios';

const Uploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    tags: '',
    thumbnailUrl: '', // For manual URL input
    category: 'New',
    duration: '',
    resolution: '',
    format: '', 
    monetization: '0',
    rightsClaims: '',
    comments: '',
    videoTranscript: '',
    geoCoordinates: ''
  });

  // Handle main file input change
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setError(null);
    setSuccess(null);

    if (selectedFile) {
      // Auto-set format based on file extension
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      setMetadata((prevMetadata) => ({
        ...prevMetadata,
        format: fileExtension,
        title: prevMetadata.title || selectedFile.name.split('.')[0] // Auto-fill title if empty
      }));

      // If it's a video file, try to extract duration and resolution
      if (selectedFile.type.startsWith('video/')) {
        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';
        videoElement.onloadedmetadata = () => {
          const duration = Math.round(videoElement.duration);
          const minutes = Math.floor(duration / 60);
          const seconds = duration % 60;
          const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          
          setMetadata(prev => ({
            ...prev,
            duration: formattedDuration,
            resolution: `${videoElement.videoWidth}x${videoElement.videoHeight}`
          }));
          
          window.URL.revokeObjectURL(videoElement.src);
        };
        videoElement.src = URL.createObjectURL(selectedFile);
      }
    }
  };

  // Handle thumbnail file upload
  const handleThumbnailFileChange = (event) => {
    const selectedThumbnail = event.target.files[0];
    
    if (selectedThumbnail) {
      // Validate that it's an image
      if (!selectedThumbnail.type.startsWith('image/')) {
        setError('Thumbnail must be an image file (jpg, png, gif, etc.)');
        return;
      }
      
      setThumbnailFile(selectedThumbnail);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result);
      };
      reader.readAsDataURL(selectedThumbnail);
      
      // Clear manual URL if file is selected
      setMetadata(prev => ({ ...prev, thumbnailUrl: '' }));
    }
  };

  // Generate thumbnail from video (for video files only)
  const generateThumbnailFromVideo = () => {
    if (!file || !file.type.startsWith('video/')) {
      setError('Please select a video file first');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return;

    video.addEventListener('loadeddata', () => {
      // Set video to 10% duration for thumbnail
      video.currentTime = video.duration * 0.1;
    });

    video.addEventListener('seeked', () => {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const thumbnailFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
        setThumbnailFile(thumbnailFile);
        setThumbnailPreview(canvas.toDataURL());
        setMetadata(prev => ({ ...prev, thumbnailUrl: '' }));
      }, 'image/jpeg', 0.8);
    });

    video.src = URL.createObjectURL(file);
  };

  // Handle metadata input change
  const handleMetadataChange = (event) => {
    const { name, value } = event.target;
    setMetadata((prev) => ({ ...prev, [name]: value }));
    
    // If manual thumbnail URL is entered, clear file thumbnail
    if (name === 'thumbnailUrl' && value) {
      setThumbnailFile(null);
      setThumbnailPreview(value);
    }
  };

  // Main upload function
  const handleFileUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add thumbnail file if selected
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }
      
      // Prepare metadata
      const uploadMetadata = {
        ...metadata,
        // Use manual URL if no file thumbnail
        thumbnailUrl: thumbnailFile ? '' : metadata.thumbnailUrl
      };
      
      formData.append('metadata', JSON.stringify(uploadMetadata));

      // Upload to backend
      const response = await axios.post('http://localhost:5000/api/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      if (response.status === 200) {
        setSuccess('File uploaded successfully!');
        
        // Reset form
        setFile(null);
        setThumbnailFile(null);
        setThumbnailPreview(null);
        setMetadata({
          title: '',
          description: '',
          tags: '',
          thumbnailUrl: '',
          category: 'New',
          duration: '',
          resolution: '',
          format: '', 
          monetization: '0',
          rightsClaims: '',
          comments: '',
          videoTranscript: '',
          geoCoordinates: ''
        });
        
        // Reset file inputs
        event.target.reset();
        
        if (onUploadSuccess) {
          onUploadSuccess(response.data);
        }
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.error || err.message || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '20px', 
      maxWidth: '800px', 
      margin: 'auto',
      backgroundColor: '#1a1a1a',
      borderRadius: '10px',
      color: 'white'
    }}>
      <h2 style={{ color: '#FC1503', marginBottom: '20px' }}>Upload Media</h2>
      
      <form onSubmit={handleFileUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Main File Upload */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Select File *
          </label>
          <input 
            type="file" 
            onChange={handleFileChange}
            accept="video/*,audio/*,image/*,.pdf,.txt"
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '5px', 
              border: '1px solid #333',
              backgroundColor: '#2a2a2a',
              color: 'white'
            }}
          />
        </div>

        {/* Basic Metadata */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="Video title"
              value={metadata.title}
              onChange={handleMetadataChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '5px', 
                border: '1px solid #333',
                backgroundColor: '#2a2a2a',
                color: 'white'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Category *
            </label>
            <select
              name="category"
              value={metadata.category}
              onChange={handleMetadataChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '5px', 
                border: '1px solid #333',
                backgroundColor: '#2a2a2a',
                color: 'white'
              }}
            >
              <option value="New">New</option>
              <option value="Home">Home</option>
              <option value="training">Training</option>
              <option value="programming">Programming</option>
              <option value="music">Music</option>
              <option value="sports">Sports</option>
              <option value="news">News</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Description
          </label>
          <textarea
            name="description"
            placeholder="Video description"
            value={metadata.description}
            onChange={handleMetadataChange}
            rows="4"
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '5px', 
              border: '1px solid #333',
              backgroundColor: '#2a2a2a',
              color: 'white',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Thumbnail Section */}
        <div style={{ border: '1px solid #333', padding: '15px', borderRadius: '5px', backgroundColor: '#2a2a2a' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#FC1503' }}>Thumbnail Options</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Upload Thumbnail Image
              </label>
              <input 
                type="file" 
                onChange={handleThumbnailFileChange}
                accept="image/*"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '5px', 
                  border: '1px solid #333',
                  backgroundColor: '#1a1a1a',
                  color: 'white'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Or Enter Thumbnail URL
              </label>
              <input
                type="url"
                name="thumbnailUrl"
                placeholder="https://example.com/thumbnail.jpg"
                value={metadata.thumbnailUrl}
                onChange={handleMetadataChange}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '5px', 
                  border: '1px solid #333',
                  backgroundColor: '#1a1a1a',
                  color: 'white'
                }}
              />
            </div>
          </div>

          {/* Generate from video button */}
          {file && file.type.startsWith('video/') && (
            <button
              type="button"
              onClick={generateThumbnailFromVideo}
              style={{
                padding: '8px 15px',
                backgroundColor: '#FC1503',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginBottom: '15px'
              }}
            >
              Generate Thumbnail from Video
            </button>
          )}

          {/* Thumbnail Preview */}
          {thumbnailPreview && (
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Thumbnail Preview:
              </label>
              <img 
                src={thumbnailPreview} 
                alt="Thumbnail preview" 
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '150px', 
                  borderRadius: '5px',
                  border: '1px solid #333'
                }}
              />
            </div>
          )}
        </div>

        {/* Additional Metadata */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={metadata.tags}
            onChange={handleMetadataChange}
            style={{ 
              padding: '10px', 
              borderRadius: '5px', 
              border: '1px solid #333',
              backgroundColor: '#2a2a2a',
              color: 'white'
            }}
          />
          
          <input
            type="text"
            name="duration"
            placeholder="Duration (auto-filled for videos)"
            value={metadata.duration}
            onChange={handleMetadataChange}
            style={{ 
              padding: '10px', 
              borderRadius: '5px', 
              border: '1px solid #333',
              backgroundColor: '#2a2a2a',
              color: 'white'
            }}
          />
          
          <input
            type="text"
            name="resolution"
            placeholder="Resolution (auto-filled for videos)"
            value={metadata.resolution}
            onChange={handleMetadataChange}
            style={{ 
              padding: '10px', 
              borderRadius: '5px', 
              border: '1px solid #333',
              backgroundColor: '#2a2a2a',
              color: 'white'
            }}
          />
        </div>

        {/* Upload Button */}
        <button  
          type="submit" 
          disabled={uploading || !file}
          style={{
            padding: '15px',
            backgroundColor: uploading ? '#666' : '#FC1503',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: uploading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s'
          }}
        >
          {uploading ? `Uploading... ${progress}%` : 'Upload File'}
        </button>

        {/* Status Messages */}
        {error && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#ff4444', 
            color: 'white', 
            borderRadius: '5px' 
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#44ff44', 
            color: 'black', 
            borderRadius: '5px' 
          }}>
            {success}
          </div>
        )}

        {/* Progress Bar */}
        {uploading && (
          <div style={{ 
            width: '100%', 
            backgroundColor: '#333', 
            borderRadius: '5px', 
            overflow: 'hidden' 
          }}>
            <div 
              style={{ 
                width: `${progress}%`, 
                height: '10px', 
                backgroundColor: '#FC1503', 
                transition: 'width 0.3s' 
              }}
            />
          </div>
        )}
      </form>

      {/* Hidden video and canvas for thumbnail generation */}
      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default Uploader;