// Image Carousel JavaScript

// Configuration - Replace these URLs with your actual image URLs
const imageUrls = [
    'https://picsum.photos/800/400?random=1',
    'https://picsum.photos/800/400?random=2',
    'https://picsum.photos/800/400?random=3',
    'https://picsum.photos/800/400?random=4',
    'https://picsum.photos/800/400?random=5',
    'https://picsum.photos/800/400?random=6',
    'https://picsum.photos/800/400?random=7',
    'https://picsum.photos/800/400?random=8',
    'https://picsum.photos/800/400?random=9',
    'https://picsum.photos/800/400?random=10'
];

// Carousel state
let carouselState = {
    currentSlide: 0,
    totalSlides: imageUrls.length,
    isAutoPlaying: false,
    autoPlayInterval: null,
    autoPlayDelay: 4000, // 4 seconds
    isTransitioning: false,
    touchStartX: 0,
    touchEndX: 0,
    isDragging: false
};

// DOM elements
let elements = {};

// Initialize carousel
function initCarousel() {
    // Cache DOM elements
    elements = {
        track: document.getElementById('carousel-track'),
        prevBtn: document.getElementById('prev-btn'),
        nextBtn: document.getElementById('next-btn'),
        indicators: document.getElementById('carousel-indicators'),
        currentSlideSpan: document.getElementById('current-slide'),
        totalSlidesSpan: document.getElementById('total-slides'),
        playPauseBtn: document.getElementById('play-pause-btn'),
        fullscreenBtn: document.getElementById('fullscreen-btn'),
        loadingIndicator: document.getElementById('loading-indicator'),
        trackContainer: document.querySelector('.carousel-track-container'),
        playIcon: document.querySelector('.play-icon'),
        pauseIcon: document.querySelector('.pause-icon'),
        controlText: document.querySelector('#play-pause-btn .control-text')
    };

    // Set up carousel
    createSlides();
    createIndicators();
    setupEventListeners();
    updateUI();
    
    // Preload images
    preloadImages();
}

// Create slide elements
function createSlides() {
    elements.track.innerHTML = '';
    
    imageUrls.forEach((url, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.setAttribute('data-slide', index);
        
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Image ${index + 1} of ${imageUrls.length}`;
        img.loading = 'lazy';
        
        // Add loading state
        img.addEventListener('load', () => {
            img.classList.remove('loading');
        });
        
        img.addEventListener('error', () => {
            img.alt = `Failed to load image ${index + 1}`;
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
        });
        
        img.classList.add('loading');
        slide.appendChild(img);
        elements.track.appendChild(slide);
    });
    
    // Update total slides
    elements.totalSlidesSpan.textContent = carouselState.totalSlides;
}

// Create indicator dots
function createIndicators() {
    elements.indicators.innerHTML = '';
    
    for (let i = 0; i < carouselState.totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('data-slide', i);
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        
        dot.addEventListener('click', () => goToSlide(i));
        elements.indicators.appendChild(dot);
    }
}

// Set up event listeners
function setupEventListeners() {
    // Navigation buttons
    elements.prevBtn.addEventListener('click', prevSlide);
    elements.nextBtn.addEventListener('click', nextSlide);
    
    // Control buttons
    elements.playPauseBtn.addEventListener('click', toggleAutoPlay);
    elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
    
    // Touch/swipe support
    elements.trackContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    elements.trackContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
    elements.trackContainer.addEventListener('touchend', handleTouchEnd);
    
    // Mouse drag support (optional)
    elements.trackContainer.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Prevent context menu on long press
    elements.trackContainer.addEventListener('contextmenu', (e) => {
        if (carouselState.isDragging) {
            e.preventDefault();
        }
    });
    
    // Pause auto-play on hover
    elements.trackContainer.addEventListener('mouseenter', () => {
        if (carouselState.isAutoPlaying) {
            pauseAutoPlay();
        }
    });
    
    elements.trackContainer.addEventListener('mouseleave', () => {
        if (carouselState.isAutoPlaying) {
            startAutoPlay();
        }
    });
    
    // Handle visibility change (pause when tab is not active)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && carouselState.isAutoPlaying) {
            pauseAutoPlay();
        } else if (!document.hidden && carouselState.isAutoPlaying) {
            startAutoPlay();
        }
    });
}

// Navigation functions
function nextSlide() {
    if (carouselState.isTransitioning) return;
    
    const nextIndex = (carouselState.currentSlide + 1) % carouselState.totalSlides;
    goToSlide(nextIndex);
}

function prevSlide() {
    if (carouselState.isTransitioning) return;
    
    const prevIndex = carouselState.currentSlide === 0 
        ? carouselState.totalSlides - 1 
        : carouselState.currentSlide - 1;
    goToSlide(prevIndex);
}

function goToSlide(index) {
    if (carouselState.isTransitioning || index === carouselState.currentSlide) return;
    
    carouselState.isTransitioning = true;
    carouselState.currentSlide = index;
    
    // Update transform
    const translateX = -index * 100;
    elements.track.style.transform = `translateX(${translateX}%)`;
    
    // Update UI
    updateUI();
    
    // Reset transition flag after animation
    setTimeout(() => {
        carouselState.isTransitioning = false;
    }, 500);
}

// Update UI elements
function updateUI() {
    // Update counter
    elements.currentSlideSpan.textContent = carouselState.currentSlide + 1;
    
    // Update indicators
    const dots = elements.indicators.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === carouselState.currentSlide);
    });
    
    // Update navigation buttons (optional: disable at ends)
    // elements.prevBtn.disabled = carouselState.currentSlide === 0;
    // elements.nextBtn.disabled = carouselState.currentSlide === carouselState.totalSlides - 1;
}

// Auto-play functionality
function toggleAutoPlay() {
    if (carouselState.isAutoPlaying) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
}

function startAutoPlay() {
    carouselState.isAutoPlaying = true;
    carouselState.autoPlayInterval = setInterval(nextSlide, carouselState.autoPlayDelay);
    
    // Update button
    elements.playIcon.classList.add('hidden');
    elements.pauseIcon.classList.remove('hidden');
    elements.controlText.textContent = 'Pause';
    elements.playPauseBtn.classList.add('active');
}

function stopAutoPlay() {
    carouselState.isAutoPlaying = false;
    if (carouselState.autoPlayInterval) {
        clearInterval(carouselState.autoPlayInterval);
        carouselState.autoPlayInterval = null;
    }
    
    // Update button
    elements.playIcon.classList.remove('hidden');
    elements.pauseIcon.classList.add('hidden');
    elements.controlText.textContent = 'Auto Play';
    elements.playPauseBtn.classList.remove('active');
}

function pauseAutoPlay() {
    if (carouselState.autoPlayInterval) {
        clearInterval(carouselState.autoPlayInterval);
        carouselState.autoPlayInterval = null;
    }
}

// Fullscreen functionality
function toggleFullscreen() {
    const container = document.querySelector('.carousel-container');
    
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            console.log('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Keyboard navigation
function handleKeyboard(event) {
    // Don't interfere with form inputs
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch (event.key) {
        case 'ArrowLeft':
            prevSlide();
            event.preventDefault();
            break;
        case 'ArrowRight':
            nextSlide();
            event.preventDefault();
            break;
        case ' ':
            toggleAutoPlay();
            event.preventDefault();
            break;
        case 'Escape':
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            break;
        case 'Home':
            goToSlide(0);
            event.preventDefault();
            break;
        case 'End':
            goToSlide(carouselState.totalSlides - 1);
            event.preventDefault();
            break;
    }
}

// Touch/Swipe support
function handleTouchStart(event) {
    carouselState.touchStartX = event.touches[0].clientX;
    carouselState.isDragging = true;
    elements.trackContainer.classList.add('dragging');
}

function handleTouchMove(event) {
    if (!carouselState.isDragging) return;
    carouselState.touchEndX = event.touches[0].clientX;
}

function handleTouchEnd(event) {
    if (!carouselState.isDragging) return;
    
    carouselState.isDragging = false;
    elements.trackContainer.classList.remove('dragging');
    
    const touchDiff = carouselState.touchStartX - carouselState.touchEndX;
    const minSwipeDistance = 50;
    
    if (Math.abs(touchDiff) > minSwipeDistance) {
        if (touchDiff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

// Mouse drag support (desktop)
function handleMouseDown(event) {
    event.preventDefault();
    carouselState.touchStartX = event.clientX;
    carouselState.isDragging = true;
    elements.trackContainer.classList.add('dragging');
}

function handleMouseMove(event) {
    if (!carouselState.isDragging) return;
    carouselState.touchEndX = event.clientX;
}

function handleMouseUp(event) {
    if (!carouselState.isDragging) return;
    
    carouselState.isDragging = false;
    elements.trackContainer.classList.remove('dragging');
    
    const mouseDiff = carouselState.touchStartX - carouselState.touchEndX;
    const minDragDistance = 50;
    
    if (Math.abs(mouseDiff) > minDragDistance) {
        if (mouseDiff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

// Preload images for better performance
function preloadImages() {
    elements.loadingIndicator.classList.remove('hidden');
    
    let loadedCount = 0;
    const totalImages = imageUrls.length;
    
    imageUrls.forEach((url, index) => {
        const img = new Image();
        img.onload = img.onerror = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                elements.loadingIndicator.classList.add('hidden');
            }
        };
        img.src = url;
    });
}

// Utility function to update image URLs (for dynamic content)
function updateImages(newImageUrls) {
    if (!Array.isArray(newImageUrls) || newImageUrls.length === 0) {
        console.error('Invalid image URLs provided');
        return;
    }
    
    // Stop auto-play
    stopAutoPlay();
    
    // Update configuration
    imageUrls.length = 0;
    imageUrls.push(...newImageUrls);
    carouselState.totalSlides = imageUrls.length;
    carouselState.currentSlide = 0;
    
    // Recreate carousel
    createSlides();
    createIndicators();
    updateUI();
    preloadImages();
    
    // Reset position
    elements.track.style.transform = 'translateX(0%)';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCarousel);

// Export for external use (if needed)
window.ImageCarousel = {
    updateImages,
    goToSlide,
    nextSlide,
    prevSlide,
    startAutoPlay,
    stopAutoPlay
};
