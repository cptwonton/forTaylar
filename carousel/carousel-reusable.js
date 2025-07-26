// Reusable Image Carousel Class

class ImageCarousel {
    constructor(containerId, imageUrls, options = {}) {
        // Validate inputs
        if (!containerId || !imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
            throw new Error('ImageCarousel requires a valid container ID and image URLs array');
        }

        // Configuration
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.imageUrls = [...imageUrls];
        this.options = {
            autoPlayDelay: 4000,
            enableAutoPlay: true,
            enableKeyboard: true,
            enableTouch: true,
            enableFullscreen: true,
            ...options
        };

        // State
        this.state = {
            currentSlide: 0,
            totalSlides: this.imageUrls.length,
            isAutoPlaying: false,
            autoPlayInterval: null,
            isTransitioning: false,
            touchStartX: 0,
            touchEndX: 0,
            isDragging: false
        };

        // DOM elements cache
        this.elements = {};

        // Initialize
        this.init();
    }

    init() {
        if (!this.container) {
            console.error(`Container with ID "${this.containerId}" not found`);
            return;
        }

        this.cacheElements();
        this.createSlides();
        this.createIndicators();
        this.setupEventListeners();
        this.updateUI();
        this.preloadImages();
    }

    cacheElements() {
        const container = this.container;
        this.elements = {
            track: container.querySelector('.carousel-track'),
            prevBtn: container.querySelector('.carousel-btn-prev'),
            nextBtn: container.querySelector('.carousel-btn-next'),
            indicators: container.querySelector('.carousel-indicators'),
            currentSlideSpan: container.querySelector('.current-slide'),
            totalSlidesSpan: container.querySelector('.total-slides'),
            playPauseBtn: container.querySelector('.play-pause-btn'),
            fullscreenBtn: container.querySelector('.fullscreen-btn'),
            loadingIndicator: container.querySelector('.loading-indicator'),
            trackContainer: container.querySelector('.carousel-track-container'),
            playIcon: container.querySelector('.play-icon'),
            pauseIcon: container.querySelector('.pause-icon'),
            controlText: container.querySelector('.play-pause-btn .control-text')
        };
    }

    createSlides() {
        this.elements.track.innerHTML = '';
        
        this.imageUrls.forEach((url, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.setAttribute('data-slide', index);
            
            const img = document.createElement('img');
            img.src = url;
            img.alt = `Image ${index + 1} of ${this.imageUrls.length}`;
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
            this.elements.track.appendChild(slide);
        });
        
        // Update total slides
        this.elements.totalSlidesSpan.textContent = this.state.totalSlides;
    }

    createIndicators() {
        this.elements.indicators.innerHTML = '';
        
        for (let i = 0; i < this.state.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('data-slide', i);
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            
            dot.addEventListener('click', () => this.goToSlide(i));
            this.elements.indicators.appendChild(dot);
        }
    }

    setupEventListeners() {
        // Navigation buttons
        this.elements.prevBtn.addEventListener('click', () => this.prevSlide());
        this.elements.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Control buttons
        if (this.options.enableAutoPlay) {
            this.elements.playPauseBtn.addEventListener('click', () => this.toggleAutoPlay());
        } else {
            this.elements.playPauseBtn.style.display = 'none';
        }

        if (this.options.enableFullscreen) {
            this.elements.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        } else {
            this.elements.fullscreenBtn.style.display = 'none';
        }
        
        // Touch/swipe support
        if (this.options.enableTouch) {
            this.elements.trackContainer.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            this.elements.trackContainer.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
            this.elements.trackContainer.addEventListener('touchend', (e) => this.handleTouchEnd(e));
            
            // Mouse drag support
            this.elements.trackContainer.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        }
        
        // Prevent context menu on long press
        this.elements.trackContainer.addEventListener('contextmenu', (e) => {
            if (this.state.isDragging) {
                e.preventDefault();
            }
        });
        
        // Pause auto-play on hover
        this.elements.trackContainer.addEventListener('mouseenter', () => {
            if (this.state.isAutoPlaying) {
                this.pauseAutoPlay();
            }
        });
        
        this.elements.trackContainer.addEventListener('mouseleave', () => {
            if (this.state.isAutoPlaying) {
                this.startAutoPlay();
            }
        });
    }

    // Navigation methods
    nextSlide() {
        if (this.state.isTransitioning) return;
        
        const nextIndex = (this.state.currentSlide + 1) % this.state.totalSlides;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        if (this.state.isTransitioning) return;
        
        const prevIndex = this.state.currentSlide === 0 
            ? this.state.totalSlides - 1 
            : this.state.currentSlide - 1;
        this.goToSlide(prevIndex);
    }

    goToSlide(index) {
        if (this.state.isTransitioning || index === this.state.currentSlide) return;
        
        this.state.isTransitioning = true;
        this.state.currentSlide = index;
        
        // Update transform
        const translateX = -index * 100;
        this.elements.track.style.transform = `translateX(${translateX}%)`;
        
        // Update UI
        this.updateUI();
        
        // Reset transition flag after animation
        setTimeout(() => {
            this.state.isTransitioning = false;
        }, 500);
    }

    updateUI() {
        // Update counter
        this.elements.currentSlideSpan.textContent = this.state.currentSlide + 1;
        
        // Update indicators
        const dots = this.elements.indicators.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.state.currentSlide);
        });
    }

    // Auto-play methods
    toggleAutoPlay() {
        if (this.state.isAutoPlaying) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }

    startAutoPlay() {
        this.state.isAutoPlaying = true;
        this.state.autoPlayInterval = setInterval(() => this.nextSlide(), this.options.autoPlayDelay);
        
        // Update button
        this.elements.playIcon.classList.add('hidden');
        this.elements.pauseIcon.classList.remove('hidden');
        this.elements.controlText.textContent = 'Pause';
        this.elements.playPauseBtn.classList.add('active');
    }

    stopAutoPlay() {
        this.state.isAutoPlaying = false;
        if (this.state.autoPlayInterval) {
            clearInterval(this.state.autoPlayInterval);
            this.state.autoPlayInterval = null;
        }
        
        // Update button
        this.elements.playIcon.classList.remove('hidden');
        this.elements.pauseIcon.classList.add('hidden');
        this.elements.controlText.textContent = 'Auto Play';
        this.elements.playPauseBtn.classList.remove('active');
    }

    pauseAutoPlay() {
        if (this.state.autoPlayInterval) {
            clearInterval(this.state.autoPlayInterval);
            this.state.autoPlayInterval = null;
        }
    }

    // Fullscreen
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.container.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Touch/Swipe support
    handleTouchStart(event) {
        this.state.touchStartX = event.touches[0].clientX;
        this.state.isDragging = true;
        this.elements.trackContainer.classList.add('dragging');
    }

    handleTouchMove(event) {
        if (!this.state.isDragging) return;
        this.state.touchEndX = event.touches[0].clientX;
    }

    handleTouchEnd(event) {
        if (!this.state.isDragging) return;
        
        this.state.isDragging = false;
        this.elements.trackContainer.classList.remove('dragging');
        
        const touchDiff = this.state.touchStartX - this.state.touchEndX;
        const minSwipeDistance = 50;
        
        if (Math.abs(touchDiff) > minSwipeDistance) {
            if (touchDiff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    // Mouse drag support
    handleMouseDown(event) {
        event.preventDefault();
        this.state.touchStartX = event.clientX;
        this.state.isDragging = true;
        this.elements.trackContainer.classList.add('dragging');
    }

    handleMouseMove(event) {
        if (!this.state.isDragging) return;
        this.state.touchEndX = event.clientX;
    }

    handleMouseUp(event) {
        if (!this.state.isDragging) return;
        
        this.state.isDragging = false;
        this.elements.trackContainer.classList.remove('dragging');
        
        const mouseDiff = this.state.touchStartX - this.state.touchEndX;
        const minDragDistance = 50;
        
        if (Math.abs(mouseDiff) > minDragDistance) {
            if (mouseDiff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    // Preload images
    preloadImages() {
        this.elements.loadingIndicator.classList.remove('hidden');
        
        let loadedCount = 0;
        const totalImages = this.imageUrls.length;
        
        this.imageUrls.forEach((url, index) => {
            const img = new Image();
            img.onload = img.onerror = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    this.elements.loadingIndicator.classList.add('hidden');
                }
            };
            img.src = url;
        });
    }

    // Public API methods
    updateImages(newImageUrls) {
        if (!Array.isArray(newImageUrls) || newImageUrls.length === 0) {
            console.error('Invalid image URLs provided');
            return;
        }
        
        // Stop auto-play
        this.stopAutoPlay();
        
        // Update configuration
        this.imageUrls = [...newImageUrls];
        this.state.totalSlides = this.imageUrls.length;
        this.state.currentSlide = 0;
        
        // Recreate carousel
        this.createSlides();
        this.createIndicators();
        this.updateUI();
        this.preloadImages();
        
        // Reset position
        this.elements.track.style.transform = 'translateX(0%)';
    }

    destroy() {
        // Stop auto-play
        this.stopAutoPlay();
        
        // Remove event listeners (basic cleanup)
        this.elements.prevBtn.removeEventListener('click', () => this.prevSlide());
        this.elements.nextBtn.removeEventListener('click', () => this.nextSlide());
        
        // Clear container
        this.container.innerHTML = '';
    }
}

// Global keyboard handler for all carousels
class CarouselKeyboardManager {
    constructor() {
        this.carousels = new Map();
        this.activeCarousel = null;
        this.setupGlobalKeyboard();
    }

    registerCarousel(carousel) {
        this.carousels.set(carousel.containerId, carousel);
        
        // Set focus handlers to track active carousel
        carousel.container.addEventListener('mouseenter', () => {
            this.activeCarousel = carousel;
        });
        
        carousel.container.addEventListener('focus', () => {
            this.activeCarousel = carousel;
        }, true);
    }

    setupGlobalKeyboard() {
        document.addEventListener('keydown', (event) => {
            // Don't interfere with form inputs
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            if (!this.activeCarousel) return;

            switch (event.key) {
                case 'ArrowLeft':
                    this.activeCarousel.prevSlide();
                    event.preventDefault();
                    break;
                case 'ArrowRight':
                    this.activeCarousel.nextSlide();
                    event.preventDefault();
                    break;
                case ' ':
                    if (this.activeCarousel.options.enableAutoPlay) {
                        this.activeCarousel.toggleAutoPlay();
                        event.preventDefault();
                    }
                    break;
                case 'Home':
                    this.activeCarousel.goToSlide(0);
                    event.preventDefault();
                    break;
                case 'End':
                    this.activeCarousel.goToSlide(this.activeCarousel.state.totalSlides - 1);
                    event.preventDefault();
                    break;
            }
        });
    }
}

// Initialize carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const keyboardManager = new CarouselKeyboardManager();

    // Sample image sets for different carousels
    const productImages = [
        'https://picsum.photos/800/400?random=1',
        'https://picsum.photos/800/400?random=2',
        'https://picsum.photos/800/400?random=3',
        'https://picsum.photos/800/400?random=4',
        'https://picsum.photos/800/400?random=5'
    ];

    const teamImages = [
        'https://picsum.photos/800/400?random=6',
        'https://picsum.photos/800/400?random=7',
        'https://picsum.photos/800/400?random=8'
    ];

    const officeImages = [
        'https://picsum.photos/800/400?random=9',
        'https://picsum.photos/800/400?random=10',
        'https://picsum.photos/800/400?random=11',
        'https://picsum.photos/800/400?random=12'
    ];

    // Create carousel instances
    try {
        const carousel1 = new ImageCarousel('carousel-1', productImages, {
            autoPlayDelay: 3000,
            enableAutoPlay: true
        });
        keyboardManager.registerCarousel(carousel1);

        const carousel2 = new ImageCarousel('carousel-2', teamImages, {
            autoPlayDelay: 5000,
            enableAutoPlay: false
        });
        keyboardManager.registerCarousel(carousel2);

        const carousel3 = new ImageCarousel('carousel-3', officeImages, {
            autoPlayDelay: 4000,
            enableAutoPlay: true
        });
        keyboardManager.registerCarousel(carousel3);

        // Make carousels globally accessible for debugging/external control
        window.carousels = {
            carousel1,
            carousel2,
            carousel3
        };

    } catch (error) {
        console.error('Error initializing carousels:', error);
    }
});

// Export for external use
window.ImageCarousel = ImageCarousel;
