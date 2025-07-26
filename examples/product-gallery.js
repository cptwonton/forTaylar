// Example: Product Gallery Carousel Setup
// Use this as a reference for creating multiple carousels

document.addEventListener('DOMContentLoaded', () => {
    // Product Images - Replace with your actual product images
    const productImages = [
        'https://your-domain.com/products/product1-main.jpg',
        'https://your-domain.com/products/product1-side.jpg',
        'https://your-domain.com/products/product1-back.jpg',
        'https://your-domain.com/products/product1-detail.jpg',
        'https://your-domain.com/products/product1-packaging.jpg'
    ];

    // Team Photos - Replace with your team photos
    const teamPhotos = [
        'https://your-domain.com/team/ceo.jpg',
        'https://your-domain.com/team/cto.jpg',
        'https://your-domain.com/team/team-photo.jpg'
    ];

    // Office/Location Images
    const officeImages = [
        'https://your-domain.com/office/lobby.jpg',
        'https://your-domain.com/office/workspace.jpg',
        'https://your-domain.com/office/meeting-room.jpg',
        'https://your-domain.com/office/kitchen.jpg'
    ];

    // Create Product Gallery Carousel
    const productCarousel = new ImageCarousel('product-carousel', productImages, {
        autoPlayDelay: 4000,        // 4 seconds between slides
        enableAutoPlay: true,       // Enable auto-play
        enableKeyboard: true,       // Enable keyboard navigation
        enableTouch: true,          // Enable touch/swipe
        enableFullscreen: true      // Enable fullscreen button
    });

    // Create Team Photos Carousel (no auto-play)
    const teamCarousel = new ImageCarousel('team-carousel', teamPhotos, {
        autoPlayDelay: 6000,        // 6 seconds (if auto-play is enabled)
        enableAutoPlay: false,      // Disable auto-play for team photos
        enableKeyboard: true,       // Enable keyboard navigation
        enableTouch: true,          // Enable touch/swipe
        enableFullscreen: true      // Enable fullscreen button
    });

    // Create Office Images Carousel (fast auto-play)
    const officeCarousel = new ImageCarousel('office-carousel', officeImages, {
        autoPlayDelay: 3000,        // 3 seconds between slides
        enableAutoPlay: true,       // Enable auto-play
        enableKeyboard: true,       // Enable keyboard navigation
        enableTouch: true,          // Enable touch/swipe
        enableFullscreen: false     // Disable fullscreen for office images
    });

    // Example: Dynamic image updates
    // You can update carousel images after creation
    setTimeout(() => {
        // Example: Update product images after 10 seconds
        const newProductImages = [
            'https://your-domain.com/products/product2-main.jpg',
            'https://your-domain.com/products/product2-side.jpg',
            'https://your-domain.com/products/product2-back.jpg'
        ];
        
        // Uncomment to test dynamic updates
        // productCarousel.updateImages(newProductImages);
    }, 10000);

    // Example: Programmatic control
    // You can control carousels programmatically
    
    // Jump to specific slide
    // productCarousel.goToSlide(2);
    
    // Navigate slides
    // productCarousel.nextSlide();
    // productCarousel.prevSlide();
    
    // Control auto-play
    // productCarousel.startAutoPlay();
    // productCarousel.stopAutoPlay();

    // Make carousels globally accessible for debugging
    window.carousels = {
        product: productCarousel,
        team: teamCarousel,
        office: officeCarousel
    };

    // Example: Event handling (if you need custom behavior)
    // You can add custom event listeners to carousel containers
    
    document.getElementById('product-carousel').addEventListener('click', (e) => {
        if (e.target.classList.contains('carousel-slide')) {
            console.log('Product image clicked');
            // Add your custom behavior here
        }
    });
});

// Example: Creating carousels with different themes
function createThemedCarousel(containerId, images, theme) {
    const themeOptions = {
        'product': {
            autoPlayDelay: 4000,
            enableAutoPlay: true,
            enableFullscreen: true
        },
        'gallery': {
            autoPlayDelay: 5000,
            enableAutoPlay: true,
            enableFullscreen: true
        },
        'testimonial': {
            autoPlayDelay: 8000,
            enableAutoPlay: true,
            enableFullscreen: false
        },
        'portfolio': {
            autoPlayDelay: 6000,
            enableAutoPlay: false,
            enableFullscreen: true
        }
    };

    const options = themeOptions[theme] || themeOptions['product'];
    return new ImageCarousel(containerId, images, options);
}

// Example usage:
// const portfolioCarousel = createThemedCarousel('portfolio-carousel', portfolioImages, 'portfolio');
