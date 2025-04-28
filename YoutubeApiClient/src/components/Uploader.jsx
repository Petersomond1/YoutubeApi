import React, { useState } from 'react';
import axios from 'axios';



const Uploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    tags: '',
    thumbnail: '',
    category: '',
    duration: '',
    resolution: '',
    format: '', 
    monetization: '',
    rightsClaims: '',
    comments: '',
    videoTranscript: '',
    geoCoordinates: ''
  });

    // Handle file input change
    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setError(null);
  
      // Dynamically set the format based on the selected file type
      const fileExtension = selectedFile?.name.split('.').pop().toLowerCase();
      setMetadata((prevMetadata) => ({
        ...prevMetadata,
        format: fileExtension,
      }));
    };
  
    // Handle metadata input change
    const handleMetadataChange = (event) => {
      const { name, value } = event.target;
      setMetadata((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (event) => {
      event.preventDefault();
    
      if (!file) {
        alert('Please select a file to upload');
        return;
      }

      setUploading(true);
      setProgress(0);


        try {
          console.log("first requets", file)
          // Step 1: Get a pre-signed URL from the backend
          const { data } = await axios.get('http://localhost:3000/api/media/generate-upload-url', {
              params: {
                  fileName: file.name.replace(/\s+/g, '_'),
                  fileType: file.type,
              },
          });

          if (!data || !data.uploadURL) {
            throw new Error('No valid upload URL returned');
        }

        console.log("data.uploadURL ", data.uploadURL)
        // Step 2: Upload the file to S3 using the pre-signed URL
        try {
          const formData = new FormData();
          formData.append('file', file); // Field name must match "file"
          formData.append('metadata', JSON.stringify(metadata)); // Attach metadata
      
          const response = await axios.post('http://localhost:3000/api/media/uploads', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          
          onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percentCompleted);
            },
        });

        console.log("response from second request ", response)
        // Step 3: Send metadata to the backend after successful upload
        if (response.status === 200) {
            console.log('third request to save metadata', data.uploadURL.split('?')[0])
            console.log('metadata', metadata)
            const uploadResponse = await axios.post('http://localhost:3000/api/media/uploads', {
                fileUrl: data.uploadURL.split('?')[0],
                metadata: JSON.stringify(metadata),
            });
            console.log("uploadResponse ", uploadResponse)
            if (uploadResponse.status === 200) {
                alert('File uploaded successfully');
                if (onUploadSuccess) {
                    onUploadSuccess();
                }
            } else {
                throw new Error('Failed to save metadata');
            }
        }
      } catch (err) {
        console.error('Error uploading file:', err);
        alert('Error uploading file');
        setError(err.message || 'An error occurred during upload');
      }
    } catch (err) {
        console.error('Error in the first request:', err);
        alert('Error in the first request');
        setError(err.message || 'An error occurred during the first request');
    } finally {
        setUploading(false);
    }
  };

  return (
  <div style={{ display: 'flex', flexDirection: 'column', padding: '20px', maxWidth: '600px', margin: 'auto' }}>
    <h2>Upload Media</h2>
    <form onSubmit={handleFileUpload} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={metadata.title}
        onChange={handleMetadataChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={metadata.description}
        onChange={handleMetadataChange}
      />
      <input
        type="text"
        name="tags"
        placeholder="Tags (comma separated)"
        value={metadata.tags}
        onChange={handleMetadataChange}
      />
      <input
        type="text"
        name="thumbnail"
        placeholder="Thumbnail URL"
        value={metadata.thumbnail}
        onChange={handleMetadataChange}
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={metadata.category}
        onChange={handleMetadataChange}
      />
      <input
        type="text"
        name="duration"
        placeholder="Duration"
        value={metadata.duration}
        onChange={handleMetadataChange}
      />
      <input
        type="text"
        name="resolution"
        placeholder="Resolution"
        value={metadata.resolution}
        onChange={handleMetadataChange}
      />
      <select
        name="format"
        value={metadata.format}
        onChange={handleMetadataChange}
      >
        <option value="">Select Format</option>
        <option value="mov">MOV</option>
        <option value="avi">AVI</option>
        <option value="mkv">MKV</option>
        <option value="m4a">M4A</option>
        <option value="txt">TXT</option>
        <option value="jpeg">JPEG</option>
        <option value="jpg">JPG</option>
        <option value="png">PNG</option>
        <option value="gif">GIF</option>
        <option value="mp4">MP4</option>
        <option value="mp3">MP3</option>
        <option value="webm">WEBM</option>
        <option value="pdf">PDF</option>
      </select>
      <input
        type="text"
        name="monetization"
        placeholder="Monetization"
        value={metadata.monetization}
        onChange={handleMetadataChange}
      />
      <input
        type="text"
        name="rightsClaims"
        placeholder="Rights claims"
        value={metadata.rightsClaims}
        onChange={handleMetadataChange}
      />
      <input
        type="text"
        name="comments"
        placeholder="Comments and Opinions"
        value={metadata.comments}
        onChange={handleMetadataChange}
      />
      <input
        type="text"
        name="videoTranscript"
        placeholder="Video Transcript"
        value={metadata.videoTranscript}
        onChange={handleMetadataChange}
      />
      <input
        type="text"
        name="geoCoordinates"
        placeholder="Geographic Coordinates"
        value={metadata.geoCoordinates}
        onChange={handleMetadataChange}
      />
     <button  type="submit" onClick={handleFileUpload} disabled={uploading}>
                {uploading ? `Uploading... ${progress}%` : 'Upload'}
            </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

    </form>
  </div>
);
};
 export default Uploader;
