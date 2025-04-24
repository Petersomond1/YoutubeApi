import React, { useState } from 'react';
import axios from 'axios';

const Uploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
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

  // // Handle file upload to the backend via pre-signed URL
  // const handleFileUpload = async (event) => {
  //   event.preventDefault();
  //   if (!file) {
  //     alert('Please select a file to upload');
  //     return;
  //   }

  //   try {
  //     // Request a pre-signed URL from the backend
  //     const { data } = await axios.get(`http://localhost:3000/api/media/generate-upload-url`, {
  //       params: {
  //         fileName: file.name.replace(/\s+/g, '_'),
  //         fileType: file.type,
  //       },
  //     });

  //     if (!data || !data.uploadURL) {
  //       alert('No valid upload URL returned');
  //       return;
  //     }

  //     // Upload the file to S3 using the pre-signed URL
  //     const response = await axios.put(data.uploadURL, file, {
  //       headers: { 'Content-Type': file.type },
  //     });

  //     if (response.status === 200) {
  //       const mediaUrl = data.uploadURL.split('?')[0];
  //       const metadataWithUrl = { ...metadata, mediaUrl };

  //       // Send the metadata to the backend
  //       await axios.post('/api/media/upload', metadataWithUrl);
  //       onUploadSuccess(mediaUrl); // Callback to notify success
  //       alert('File uploaded successfully');
  //     } else {
  //       alert('File upload failed');
  //     }
  //   } catch (err) {
  //     console.error('Error uploading file:', err);
  //     alert('Error uploading file');
  //   }
  // };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      alert('Please select a file to upload');
      return;
    }
  
    try {
      // Request a pre-signed URL from the backend
      const { data } = await axios.get(`http://localhost:3000/api/media/generate-upload-url`, {
        params: {
          fileName: file.name.replace(/\s+/g, '_'),
          fileType: file.type,
        },
      });
  
      if (!data || !data.uploadURL) {
        alert('No valid upload URL returned');
        return;
      }
  
      const { uploadURL, expirationTime } = data;

      // Check if the pre-signed URL is still valid based on expiration time
      const currentTime = Math.floor(Date.now() / 1000); // Current UTC time in seconds
      if (expirationTime < currentTime) {
        alert('The pre-signed URL has expired');
        return;
      }
      // Upload the file to S3 using the pre-signed URL
      const response = await axios.put(data.uploadURL, file, {
        headers: { 'Content-Type': file.type },
      });
  
      if (response.status === 200) {
        const mediaUrl = data.uploadURL.split('?')[0];
        const metadataWithUrl = { ...metadata, mediaUrl };
  
        // Send the metadata to the backend
        await axios.post('/api/media/upload', metadataWithUrl);
        onUploadSuccess(mediaUrl); // Callback to notify success
        alert('File uploaded successfully');
      } else {
        alert('File upload failed');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Error uploading file');
    }
  };


  return (
  <div style={{ display: 'flex', flexDirection: 'column', padding: '20px', maxWidth: '600px', margin: 'auto' }}>
    <h2>Upload Media</h2>
    <form onSubmit={handleFileUpload} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
      <button type="submit">Upload Media</button>
    </form>
  </div>
);
};

export default Uploader;



// import React, { useState } from 'react';
// import axios from 'axios';

// const Uploader = ({ onUploadSuccess }) => {
//   const [file, setFile] = useState(null);
//   const [metadata, setMetadata] = useState({
//     title: '',
//     description: '',
//     tags: '',
//     thumbnail: '',
//     category: '',
//     duration: '',
//     resolution: '',
//     format: '', 
//     monetization: '',
//     rightsClaims: '',
//     comments: '',
//     videoTranscript: '',
//     geoCoordinates: ''
//   });


//   // Handle file input change
//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     setFile(selectedFile);

    
//     // Dynamically set the format based on the selected file type
//     const fileExtension = selectedFile?.name.split('.').pop().toLowerCase();
//     setMetadata((prevMetadata) => ({
//       ...prevMetadata,
//       format: fileExtension
//     }));
//   };

//    // Handle metadata input change
//    const handleMetadataChange = (event) => {
//     const { name, value } = event.target;
//     setMetadata((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle file upload to the backend via pre-signed URL
//   const handleFileUpload = async (event) => {
//     event.preventDefault();

//     if (!file) {
//         alert('Please select a file to upload');
//         return;
//     }


//     try {
//    // Request a pre-signed URL from the backend
//     //  const { data } = await axios.get(`/api/media/generate-upload-url?fileName=${file.name.replace(/\s+/g, '_')}&fileType=${file.type}`);
//    const { data } = await axios.get(`http://localhost:300/api/media/generate-upload-url`, {
//     params: {
//       fileName: file.name.replace(/\s+/g, '_'),
//       fileType: file.type,
//     },
//   });


//    if (!data || typeof data !== 'object' || !data.uploadURL) {
//        console.error("Error: Invalid response or pre-signed URL not found in response", data);
//        alert("Error: No valid upload URL returned from the server");
//        return;
//    }
   
//    const presignedUrl = data.uploadURL;
//    console.log('@ft front-end request Pre-signed URL:', presignedUrl);

   
//    const formData = new FormData();
//    formData.append('file', file);

//         // Upload file to S3 via the pre-signed URL
//         console.log("second request ", file)
//         const response = await axios.put(presignedUrl, file, {
//               headers: {
//                 'Content-Type': 'multipart/form-data',
//               },
//             });

//         console.log("upload resonse", response)
//         if (response.status === 200) {
//             console.log('File uploaded successfully');
//             console.log('Media URL:', presignedUrl);
//             const mediaUrl = presignedUrl.split('?')[0];  
//             //const mediaUrl = response.data.Location;
           


//             // Now send the metadata and media URL to the backend
//             const metadataWithUrl = { ...metadata, mediaUrl };

//             const dbResponse = await axios.post('/api/media/upload', metadataWithUrl);

//             onUploadSuccess(dbResponse.data.url);
//             alert('File uploaded successfully and metadata stored in DB');
//             console.log('File URL:', dbResponse.data.url);
//         } else {
//             console.error('Error uploading file');
//         }
//     } catch (err) {
//         console.error('Error uploading file:', err);
//         alert('Error uploading file');
//     }
// };

// return (
//   <div style={{ display: 'flex', flexDirection: 'column', padding: '20px', maxWidth: '600px', margin: 'auto' }}>
//     <h2>Upload Media</h2>
//     <form onSubmit={handleFileUpload} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//       <input type="file" onChange={handleFileChange} />
//       <input
//         type="text"
//         name="title"
//         placeholder="Title"
//         value={metadata.title}
//         onChange={handleMetadataChange}
//       />
//       <textarea
//         name="description"
//         placeholder="Description"
//         value={metadata.description}
//         onChange={handleMetadataChange}
//       />
//       <input
//         type="text"
//         name="tags"
//         placeholder="Tags (comma separated)"
//         value={metadata.tags}
//         onChange={handleMetadataChange}
//       />
//       <input
//         type="text"
//         name="thumbnail"
//         placeholder="Thumbnail URL"
//         value={metadata.thumbnail}
//         onChange={handleMetadataChange}
//       />
//       <input
//         type="text"
//         name="category"
//         placeholder="Category"
//         value={metadata.category}
//         onChange={handleMetadataChange}
//       />
//       <input
//         type="text"
//         name="duration"
//         placeholder="Duration"
//         value={metadata.duration}
//         onChange={handleMetadataChange}
//       />
//       <input
//         type="text"
//         name="resolution"
//         placeholder="Resolution"
//         value={metadata.resolution}
//         onChange={handleMetadataChange}
//       />
//       <select
//         name="format"
//         value={metadata.format}
//         onChange={handleMetadataChange}
//       >
//         <option value="">Select Format</option>
//         <option value="mov">MOV</option>
//         <option value="avi">AVI</option>
//         <option value="mkv">MKV</option>
//         <option value="m4a">M4A</option>
//         <option value="txt">TXT</option>
//         <option value="jpeg">JPEG</option>
//         <option value="jpg">JPG</option>
//         <option value="png">PNG</option>
//         <option value="gif">GIF</option>
//         <option value="mp4">MP4</option>
//         <option value="mp3">MP3</option>
//         <option value="webm">WEBM</option>
//         <option value="pdf">PDF</option>
//       </select>
//       <input
//         type="text"
//         name="monetization"
//         placeholder="Monetization"
//         value={metadata.monetization}
//         onChange={handleMetadataChange}
//       />
//       <input
//         type="text"
//         name="rightsClaims"
//         placeholder="Rights claims"
//         value={metadata.rightsClaims}
//         onChange={handleMetadataChange}
//       />
//       <input
//         type="text"
//         name="comments"
//         placeholder="Comments and Opinions"
//         value={metadata.comments}
//         onChange={handleMetadataChange}
//       />
//       <input
//         type="text"
//         name="videoTranscript"
//         placeholder="Video Transcript"
//         value={metadata.videoTranscript}
//         onChange={handleMetadataChange}
//       />
//       <input
//         type="text"
//         name="geoCoordinates"
//         placeholder="Geographic Coordinates"
//         value={metadata.geoCoordinates}
//         onChange={handleMetadataChange}
//       />
//       <button type="submit">Upload Media</button>
//     </form>
//   </div>
// );
// };

// export default Uploader;
