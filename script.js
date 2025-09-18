// Travlysis Web App JavaScript
// Integrates GPS tracking, statistics, survey data collection, and trip review

// --- GPS Tracker Section ---
const startTrackingBtn = document.querySelector('.btn');
const locationSpan = document.getElementById('location');
const distanceSpan = document.getElementById('distance');

// Variables for tracking
let tracking = false;
let watchId = null;
let positions = [];
let totalDistance = 0;

// Helper: Calculates distance between two GPS points (Haversine formula)
function calcDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2-lat1) * Math.PI / 180;
    const dLon = (lon2-lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Start/Stop GPS tracking
startTrackingBtn.addEventListener('click', () => {
    if (!tracking) {
        if ("geolocation" in navigator) {
            watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    locationSpan.textContent = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
                    positions.push({lat: latitude, lon: longitude, time: Date.now()});
                    // Calculate distance if there's a previous position
                    if (positions.length > 1) {
                        const prev = positions[positions.length - 2];
                        const dist = calcDistance(prev.lat, prev.lon, latitude, longitude);
                        totalDistance += dist;
                        distanceSpan.textContent = `${totalDistance.toFixed(2)} km`;
                    }
                    updateStats();
                },
                (err) => {
                    locationSpan.textContent = "Error: " + err.message;
                },
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
            );
            tracking = true;
            startTrackingBtn.textContent = "Stop Tracking";
        } else {
            locationSpan.textContent = "GPS not supported";
        }
    } else {
        navigator.geolocation.clearWatch(watchId);
        tracking = false;
        startTrackingBtn.textContent = "Start Tracking";
        // Optionally, handle trip completion (review, analytics, etc.)
    }
});

// --- Statistics & Analytics Section ---
function updateStats() {
    // Time of day
    const statTime = document.getElementById('stat-time');
    const statDuration = document.getElementById('stat-duration');
    const statSpeed = document.getElementById('stat-speed');
    const statRoute = document.getElementById('stat-route');
    const statMode = document.getElementById('stat-mode');
    
    if (positions.length > 0) {
        const start = positions[0].time;
        const end = positions[positions.length - 1].time;
        const durationMin = ((end - start) / 60000).toFixed(1); // in minutes
        statTime.textContent = new Date(start).toLocaleTimeString();
        statDuration.textContent = `${durationMin} min`;
        // Simple average speed
        const speed = totalDistance / (durationMin / 60);
        statSpeed.textContent = `${isFinite(speed) ? speed.toFixed(2) : 0} km/h`;
        statRoute.textContent = `${positions.length} points`;
        // Mode guessing placeholder
        statMode.textContent = guessMode(speed);
    }
}

function guessMode(speed) {
    // Very simple mode guessing
    if (speed < 5) return "Walking";
    if (speed < 15) return "Cycling";
    if (speed < 50) return "Car";
    return "Other";
}

// --- Survey Section ---
const surveyForm = document.querySelector('#survey form');
surveyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Collect survey data
    const purpose = this.purpose.value;
    const transport = this.transport.value;
    const distance = this.distance.value;
    // Save or send survey data (placeholder)
    alert(`Survey submitted!\nPurpose: ${purpose}\nTransport: ${transport}\nDistance: ${distance} km`);
    this.reset();
});

// --- Trip Review Section ---
const confirmBtn = document.querySelector('.confirm-btn');
confirmBtn.addEventListener('click', () => {
    // Placeholder: In reality, you'd review/adjust trips with more logic
    alert("All trips confirmed! Thank you for your input.");
});

// Optionally, add logic for editing trips, storing data, integrating charts, etc.

// --- (Optional) Initialization ---
window.onload = () => {
    // Pre-fill statistics if needed
    updateStats();
};
