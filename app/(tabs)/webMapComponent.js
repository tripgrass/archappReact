// Function to load Google Maps API
function loadGoogleMapsAPI(callback) {
    const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY;

    if (window.google && window.google.maps) {
      // Google Maps API is already loaded, call the callback function
      callback();
    } else {
      // Google Maps API is not loaded, dynamically load it
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = callback;
  
      // Append the script to the document
      document.head.appendChild(script);
    }
  }
  
  export default loadGoogleMapsAPI;
  