// ===== Slideshow =====

const slideshow = new Slideshow('.slideshow-container'); // Create a slideshow object

// ===== Sliding menu =====
const sideMenu = new SideMenu(); // Create the side menu object

// ===== Google API & Markers =====
var stationsMap;
function initMap() { stationsMap = new StationsMap(); }

// ===== Register data =====
const booking = new Booking();