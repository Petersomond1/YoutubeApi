const fetchMedia = async () => {
    const response = await fetch('https://your-backend-api-url/media');
    const data = await response.json();
    setMediaData(data);  // Set the media data in the state
  };
  