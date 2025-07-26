# forTaylar 🌳🎠

A collection of interactive web components designed for customer service and content presentation. Built with vanilla HTML, CSS, and JavaScript - perfect for MindTouch, CodePen, or any web environment.

## 📦 What's Included

### 1. **Decision Tree** 🌳
An interactive troubleshooting guide for customer service agents during phone calls. Helps agents navigate through structured decision flows with keyboard shortcuts and clear visual guidance.

### 2. **Image Carousel** 🎠
A responsive, touch-friendly image carousel with auto-play, fullscreen support, and smooth transitions. Fully reusable - create multiple carousels on the same page.

## 🚀 Quick Start

### Decision Tree
1. Copy `index.html` content to your HTML section
2. Copy `styles.css` to your CSS section  
3. Copy `script.js` to your JavaScript section
4. Customize the decision tree data (see [Customization](#-customization))

### Image Carousel
1. Copy carousel HTML structure to your HTML section
2. Copy `carousel.css` to your CSS section
3. Copy `carousel.js` to your JavaScript section
4. Update image URLs (see [Customization](#-customization))

### Multiple Carousels
1. Use the reusable version: `carousel-reusable.html`, `carousel-reusable.css`, `carousel-reusable.js`
2. Create as many carousel instances as needed

## 🎯 Decision Tree

### Features
- **Agent-Optimized**: Large text, clear hierarchy, designed for phone support
- **Keyboard Shortcuts**: Numbers 1-9 for options, Space to repeat, Escape to go back
- **Navigation**: Back button with history, start over functionality
- **Article Integration**: Terminal states can link to knowledge base articles
- **Step Counter**: Shows progress through the troubleshooting flow

### Basic Usage

The decision tree uses a simple node-based structure:

```javascript
const decisionTree = {
    nodes: {
        'start': {
            question: 'Ask customer: "Does your TV turn on?"',
            guidance: 'Wait for clear response before proceeding',
            options: [
                { text: 'Yes - TV turns on', next: 'tv-on', hotkey: '1' },
                { text: 'No - TV does not turn on', next: 'power-issue', hotkey: '2' },
                { text: 'Unsure', next: 'clarify', hotkey: '3' }
            ]
        },
        'tv-on': {
            question: 'Ask customer: "Do you have an active subscription?"',
            guidance: 'Check account if needed',
            options: [
                { text: 'Yes - Active subscription', next: 'signal-check', hotkey: '1' },
                { text: 'No subscription', article: 'subscription-setup', hotkey: '2' }
            ]
        }
        // ... more nodes
    }
};
```

### Customizing Your Decision Tree

1. **Edit the `decisionTree.nodes` object** in `script.js`
2. **Node Structure**:
   - `question`: What the agent should ask the customer
   - `guidance`: Additional instructions for the agent
   - `options`: Array of possible responses
3. **Option Types**:
   - `next`: Navigate to another node
   - `article`: Link to knowledge base article (terminal state)
   - `hotkey`: Keyboard shortcut (1-9)

### Example: Tech Support Flow

```javascript
const decisionTree = {
    nodes: {
        'start': {
            question: 'Ask: "What device are you having trouble with?"',
            guidance: 'Listen carefully to device type',
            options: [
                { text: 'Computer/Laptop', next: 'computer-issues', hotkey: '1' },
                { text: 'Mobile Phone', next: 'mobile-issues', hotkey: '2' },
                { text: 'Tablet', next: 'tablet-issues', hotkey: '3' },
                { text: 'Other Device', next: 'other-device', hotkey: '4' }
            ]
        },
        'computer-issues': {
            question: 'Ask: "Is your computer turning on?"',
            guidance: 'Check for power lights or sounds',
            options: [
                { text: 'Yes - Computer turns on', next: 'software-check', hotkey: '1' },
                { text: 'No - No power', next: 'power-troubleshoot', hotkey: '2' },
                { text: 'Partially - Some lights/sounds', next: 'partial-boot', hotkey: '3' }
            ]
        },
        'software-check': {
            question: 'Ask: "Are you able to see the desktop/login screen?"',
            guidance: 'Determine if this is a boot or display issue',
            options: [
                { text: 'Yes - Can see desktop', next: 'application-issues', hotkey: '1' },
                { text: 'No - Black screen', next: 'display-troubleshoot', hotkey: '2' },
                { text: 'Stuck on loading screen', article: 'boot-issues-guide', hotkey: '3' }
            ]
        }
        // Add more nodes as needed...
    }
};
```

### Article Integration

For terminal states (end of troubleshooting), use the `article` property:

```javascript
{
    text: 'Hardware replacement needed',
    article: 'hardware-replacement-guide',
    hotkey: '1'
}
```

In MindTouch, you can customize the `handleArticleLink()` function to navigate to your actual articles:

```javascript
function handleArticleLink(articleId) {
    // Redirect to MindTouch article
    window.open(`/your-knowledge-base/${articleId}`, '_blank');
}
```

## 🎠 Image Carousel

### Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Touch Support**: Swipe gestures on mobile devices
- **Keyboard Navigation**: Arrow keys, spacebar, home/end
- **Auto-Play**: Configurable timing with pause on hover
- **Fullscreen Mode**: Expand carousel to full screen
- **Smooth Animations**: 60fps transitions with easing
- **Error Handling**: Graceful fallback for broken images
- **Accessibility**: Screen reader support, focus management

### Single Carousel Usage

Replace the `imageUrls` array in `carousel.js`:

```javascript
const imageUrls = [
    'https://your-domain.com/image1.jpg',
    'https://your-domain.com/image2.jpg',
    'https://your-domain.com/image3.jpg',
    'https://your-domain.com/image4.jpg',
    'https://your-domain.com/image5.jpg'
];
```

### Multiple Carousels (Reusable Version)

Create carousel instances with the class-based approach:

```javascript
// Product gallery
const productCarousel = new ImageCarousel('product-carousel', [
    'product1.jpg',
    'product2.jpg',
    'product3.jpg'
], {
    autoPlayDelay: 4000,
    enableAutoPlay: true
});

// Team photos  
const teamCarousel = new ImageCarousel('team-carousel', [
    'team1.jpg',
    'team2.jpg',
    'team3.jpg'
], {
    autoPlayDelay: 6000,
    enableAutoPlay: false
});
```

### Carousel Configuration Options

```javascript
const options = {
    autoPlayDelay: 4000,        // Time between slides (ms)
    enableAutoPlay: true,       // Enable auto-play feature
    enableKeyboard: true,       // Enable keyboard navigation
    enableTouch: true,          // Enable touch/swipe gestures
    enableFullscreen: true      // Enable fullscreen button
};
```

### Dynamic Image Updates

Update carousel images after creation:

```javascript
// Update with new images
carousel.updateImages([
    'new-image1.jpg',
    'new-image2.jpg',
    'new-image3.jpg'
]);

// Programmatic control
carousel.goToSlide(2);          // Jump to slide 3
carousel.nextSlide();           // Go to next slide
carousel.prevSlide();           // Go to previous slide
carousel.startAutoPlay();       // Start auto-play
carousel.stopAutoPlay();        // Stop auto-play
```

## 🎨 Customization

### Styling

Both components use CSS custom properties for easy theming:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --text-color: #2c3e50;
    --background-color: #f8f9fa;
    --border-radius: 8px;
    --transition-speed: 0.3s;
}
```

### Decision Tree Styling

Customize colors, fonts, and spacing:

```css
#agent-question {
    font-size: 1.6rem;          /* Larger text for agents */
    color: #2c3e50;
    font-weight: 600;
}

.option-btn {
    background: white;
    border: 2px solid #3498db;
    padding: 20px;              /* Larger click targets */
    font-size: 1.1rem;
}

.option-btn:hover {
    background: #3498db;
    color: white;
    transform: translateY(-2px); /* Subtle hover effect */
}
```

### Carousel Styling

Customize the carousel appearance:

```css
.carousel-container {
    max-width: 1000px;          /* Adjust max width */
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.carousel-header {
    background: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
}

.carousel-btn {
    background: rgba(255, 255, 255, 0.9);
    width: 60px;                /* Larger navigation buttons */
    height: 60px;
}
```

## 🔧 Integration Guides

### MindTouch Integration

1. **CSS Section**: Copy the entire CSS file
2. **HTML Section**: Copy content between `<body>` tags
3. **JavaScript Section**: Copy the entire JavaScript file
4. **Article Links**: Update `handleArticleLink()` function for your knowledge base

### CodePen Integration

1. **HTML Panel**: Copy HTML content (without `<html>`, `<head>`, `<body>` tags)
2. **CSS Panel**: Copy entire CSS file
3. **JS Panel**: Copy entire JavaScript file

### WordPress/Other CMS

1. Add CSS to your theme's stylesheet or custom CSS section
2. Add HTML to your page/post content
3. Add JavaScript to footer or custom JS section

## 📱 Mobile Optimization

Both components are mobile-first and include:

- **Touch Gestures**: Swipe support for carousel, touch-friendly buttons
- **Responsive Design**: Adapts to all screen sizes
- **Large Touch Targets**: Minimum 44px for accessibility
- **Readable Text**: Scales appropriately on mobile devices

## ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and roles
- **Focus Management**: Clear focus indicators
- **High Contrast Support**: Works with system high contrast mode
- **Reduced Motion**: Respects user's motion preferences

## 🎯 Use Cases

### Decision Tree
- **Customer Support**: Phone troubleshooting guides
- **Sales Processes**: Lead qualification flows
- **Onboarding**: Step-by-step user guidance
- **Diagnostics**: Technical problem resolution
- **Training**: Interactive learning paths

### Image Carousel
- **Product Galleries**: E-commerce product images
- **Portfolio Showcases**: Design/photography work
- **Team Pages**: Staff photos and bios
- **Event Documentation**: Photo galleries
- **Before/After**: Transformation showcases

## 🔍 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Legacy Support**: IE11+ (with minor feature degradation)

## 📄 File Structure

```
forTaylar/
├── README.md
├── decision-tree/
│   ├── index.html          # Basic decision tree
│   ├── styles.css          # Decision tree styles
│   └── script.js           # Decision tree logic
├── carousel/
│   ├── carousel.html       # Single carousel
│   ├── carousel.css        # Carousel styles
│   ├── carousel.js         # Single carousel logic
│   ├── carousel-reusable.html    # Multiple carousels
│   ├── carousel-reusable.css     # Reusable carousel styles
│   └── carousel-reusable.js      # Reusable carousel class
└── examples/
    ├── tech-support-tree.js       # Example decision tree
    └── product-gallery.js         # Example carousel setup
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have questions or need help customizing these components:

1. Check the examples in the `/examples` folder
2. Open an issue on GitHub
3. Review the code comments for implementation details

## 🎉 Credits

Built with ❤️ for customer service teams and content creators who need reliable, accessible web components that work everywhere.

---

**Happy coding!** 🚀
