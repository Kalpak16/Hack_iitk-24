let interactionData = [];

function logEvent(event) {
  const eventData = {
    type: event.type,
    target: event.target.tagName,
    timestamp: new Date().toISOString(),
    x: event.clientX || null,
    y: event.clientY || null
  };
  interactionData.push(eventData);
  console.log(eventData);
}

document.addEventListener('click', logEvent);
document.addEventListener('mouseover', logEvent);
document.addEventListener('scroll', logEvent);
document.addEventListener('keypress', logEvent);
document.addEventListener('submit', logEvent); // Form submission
document.addEventListener('dblclick', logEvent); // Double click
document.addEventListener('dragstart', logEvent); // Drag and drop
document.addEventListener('drop', logEvent);
document.addEventListener('wheel', logEvent); // Pinch/Zoom gestures
document.addEventListener('mousemove', logEvent); // Mouse movement
document.addEventListener('focus', logEvent, true); // Window focus/blur
document.addEventListener('blur', logEvent, true);
document.addEventListener('visibilitychange', logEvent); // Page visibility
document.addEventListener('contextmenu', logEvent); // Context menu
window.addEventListener('resize', logEvent); // Resize
document.addEventListener('copy', logEvent); // Copy
document.addEventListener('paste', logEvent); // Paste
document.addEventListener('select', logEvent); // Text selection
document.addEventListener('print', logEvent); // Print

// Video
document.querySelectorAll('video').forEach(video => {
  video.addEventListener('play', logEvent);
  video.addEventListener('pause', logEvent);
  video.addEventListener('seeked', logEvent);
});

// Audio
document.querySelectorAll('audio').forEach(audio => {
  audio.addEventListener('play', logEvent);
  audio.addEventListener('pause', logEvent);
  audio.addEventListener('volumechange', logEvent);
});

// Idle/Active State Tracking, 1 minute of inactivity considered as idle
let idleTimer;
document.addEventListener('mousemove', () => {
  clearTimeout(idleTimer);
  logEvent({ type: 'active', target: document.body });
  idleTimer = setTimeout(() => {
    logEvent({ type: 'idle', target: document.body });
  }, 60000);
});

// Gesture Tracking
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

function handleGesture() {
  if (touchendX < touchstartX) {
    logEvent({ type: 'swipeLeft', target: document.body });
  }
  if (touchendX > touchstartX) {
    logEvent({ type: 'swipeRight', target: document.body });
  }
  if (touchendY < touchstartY) {
    logEvent({ type: 'swipeUp', target: document.body });
  }
  if (touchendY > touchstartY) {
    logEvent({ type: 'swipeDown', target: document.body });
  }
}

document.addEventListener('touchstart', (event) => {
  touchstartX = event.changedTouches[0].screenX;
  touchstartY = event.changedTouches[0].screenY;
});

document.addEventListener('touchend', (event) => {
  touchendX = event.changedTouches[0].screenX;
  touchendY = event.changedTouches[0].screenY;
  handleGesture();
});

// Input Field Change Tracking
document.querySelectorAll('input, textarea, select').forEach(input => {
  input.addEventListener('change', logEvent);
});

// Slider Interaction Tracking
document.querySelectorAll('input[type="range"]').forEach(slider => {
  slider.addEventListener('input', logEvent);
});

// Navigation Menu Interaction Tracking
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', logEvent);
  link.addEventListener('mouseover', logEvent);
});

// Scroll Depth Tracking
window.addEventListener('scroll', () => {
  const scrollDepth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
  logEvent({ type: 'scrollDepth', target: document.body, depth: scrollDepth });
});

// Mouse Click Position Tracking
document.addEventListener('click', (event) => {
  logEvent({ type: 'clickPosition', x: event.clientX, y: event.clientY, target: event.target });
});

// Search Interaction Tracking
document.querySelectorAll('input[type="search"]').forEach(search => {
  search.addEventListener('input', logEvent);
  search.addEventListener('search', logEvent);
});

// Progress Bar Interaction Tracking
document.querySelectorAll('progress').forEach(progress => {
  progress.addEventListener('click', logEvent);
  progress.addEventListener('change', logEvent);
});

// Hover Intent Tracking
let hoverTimer;
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('mouseover', (event) => {
    hoverTimer = setTimeout(() => {
      logEvent({ type: 'hoverIntent', target: event.target });
    }, 1000); // 1 second delay to detect intent
  });
  link.addEventListener('mouseout', () => {
    clearTimeout(hoverTimer);
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          const element = entry.target;
          focusData[element.tagName] = (focusData[element.tagName] || 0) + 1;
      }
  });
});

document.querySelectorAll('*').forEach(element => observer.observe(element));

async function sendInteractions() {
  try {
      const response = await fetch('http://localhost:3000/generate-narrative', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ interactions: interactionData, focusData: focusData })
      });
      const data = await response.json();
      console.log('Narrative:', data.narrative);
      interactionData = []; 
  } catch (error) {
      console.error('Error sending interactions:', error);
  }
}

// Send interactions to the server every 5 seconds
setInterval(sendInteractions, 5000);