// Dashboard JavaScript functionality
class DashboardManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.handleImageLoading();
        this.initializeAnimations();
        this.setupScrollEffects();
    }

    setupEventListeners() {
        // Add click event listeners to metric cards for enhanced interactivity
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach(card => {
            card.addEventListener('click', this.handleMetricCardClick.bind(this));
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', this.handleCardKeydown.bind(this));
        });

        // Add click event listeners to chart cards
        const chartCards = document.querySelectorAll('.chart-card');
        chartCards.forEach(card => {
            card.addEventListener('click', this.handleChartCardClick.bind(this));
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', this.handleCardKeydown.bind(this));
        });

        // Add click event listeners to insight cards
        const insightCards = document.querySelectorAll('.insight-card');
        insightCards.forEach(card => {
            card.addEventListener('click', this.handleInsightCardClick.bind(this));
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', this.handleCardKeydown.bind(this));
        });

        // Handle window resize for responsive adjustments
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleMetricCardClick(event) {
        const card = event.currentTarget;
        this.animateCardSelection(card);
        
        // Get metric data
        const value = card.querySelector('.metric-value').textContent;
        const label = card.querySelector('.metric-label').textContent;
        
        // Log interaction (could be sent to analytics)
        console.log('Metric card clicked:', { label, value });
    }

    handleChartCardClick(event) {
        const card = event.currentTarget;
        const chartTitle = card.querySelector('h4').textContent;
        
        this.animateCardSelection(card);
        
        // Log interaction
        console.log('Chart card clicked:', chartTitle);
        
        // Show chart modal
        this.showChartModal(card);
    }

    handleInsightCardClick(event) {
        const card = event.currentTarget;
        const insightTitle = card.querySelector('h4').textContent;
        
        this.animateCardSelection(card);
        
        // Log interaction
        console.log('Insight card clicked:', insightTitle);
    }

    handleCardKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.currentTarget.click();
        }
    }

    animateCardSelection(card) {
        // Add visual feedback for card selection
        card.style.transform = 'scale(0.98)';
        card.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            card.style.transform = '';
            card.style.transition = '';
        }, 150);
    }

    showChartModal(chartCard) {
        const chartImage = chartCard.querySelector('.chart-image');
        const chartTitle = chartCard.querySelector('h4').textContent;
        
        if (chartImage) {
            // Create modal overlay
            const modal = document.createElement('div');
            modal.className = 'chart-modal';
            modal.innerHTML = `
                <div class="chart-modal-content">
                    <div class="chart-modal-header">
                        <h3>${chartTitle}</h3>
                        <button class="chart-modal-close" aria-label="Close modal">&times;</button>
                    </div>
                    <div class="chart-modal-body">
                        <img src="${chartImage.src}" alt="${chartImage.alt}" class="chart-modal-image">
                    </div>
                </div>
            `;
            
            // Add modal styles
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            const modalContent = modal.querySelector('.chart-modal-content');
            modalContent.style.cssText = `
                background: var(--color-surface);
                border-radius: var(--radius-lg);
                max-width: 90vw;
                max-height: 90vh;
                overflow: hidden;
                box-shadow: var(--shadow-lg);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            `;
            
            const modalHeader = modal.querySelector('.chart-modal-header');
            modalHeader.style.cssText = `
                padding: var(--space-16) var(--space-20);
                border-bottom: 1px solid var(--color-border);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: var(--color-secondary);
            `;
            
            const modalBody = modal.querySelector('.chart-modal-body');
            modalBody.style.cssText = `
                padding: var(--space-20);
                text-align: center;
            `;
            
            const modalImage = modal.querySelector('.chart-modal-image');
            modalImage.style.cssText = `
                max-width: 100%;
                height: auto;
                border-radius: var(--radius-sm);
            `;
            
            const closeButton = modal.querySelector('.chart-modal-close');
            closeButton.style.cssText = `
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: var(--color-text);
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s ease;
            `;
            
            closeButton.addEventListener('mouseover', () => {
                closeButton.style.backgroundColor = 'var(--color-secondary-hover)';
            });
            
            closeButton.addEventListener('mouseout', () => {
                closeButton.style.backgroundColor = 'transparent';
            });
            
            // Add event listeners
            closeButton.addEventListener('click', () => this.closeModal(modal));
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal(modal);
            });
            
            // Handle escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    this.closeModal(modal);
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
            
            // Show modal
            document.body.appendChild(modal);
            
            // Animate in
            requestAnimationFrame(() => {
                modal.style.opacity = '1';
                modalContent.style.transform = 'scale(1)';
            });
        }
    }

    closeModal(modal) {
        const modalContent = modal.querySelector('.chart-modal-content');
        
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    handleImageLoading() {
        const chartImages = document.querySelectorAll('.chart-image');
        
        chartImages.forEach(img => {
            // Show image immediately if already loaded
            if (img.complete && img.naturalHeight !== 0) {
                img.style.display = 'block';
                img.style.opacity = '1';
                return;
            }
            
            // Set initial state
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            
            // Handle successful image load
            const handleLoad = () => {
                img.style.opacity = '1';
                console.log('Chart image loaded successfully:', img.alt);
            };
            
            // Handle image error
            const handleError = () => {
                console.error('Failed to load chart image:', img.src);
                
                // Create error placeholder
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = `
                    width: 100%;
                    height: 200px;
                    background: var(--color-secondary);
                    border-radius: var(--radius-sm);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: var(--color-text-secondary);
                    font-size: var(--font-size-sm);
                    text-align: center;
                    padding: var(--space-16);
                `;
                errorDiv.innerHTML = `
                    <div style="font-size: var(--font-size-lg); margin-bottom: var(--space-8);">📊</div>
                    <div>Chart Image</div>
                    <div style="font-size: var(--font-size-xs); margin-top: var(--space-4);">
                        ${img.alt || 'Visualization'}
                    </div>
                `;
                
                // Replace image with placeholder
                img.parentNode.replaceChild(errorDiv, img);
            };
            
            // Add event listeners
            img.addEventListener('load', handleLoad);
            img.addEventListener('error', handleError);
            
            // Trigger load if image src is already set
            if (img.src) {
                if (img.complete) {
                    if (img.naturalHeight === 0) {
                        handleError();
                    } else {
                        handleLoad();
                    }
                }
            }
        });
    }

    initializeAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all cards
        const cards = document.querySelectorAll('.metric-card, .chart-card, .insight-card, .analysis-section');
        cards.forEach(card => {
            card.classList.add('animate-ready');
            observer.observe(card);
        });

        // Add CSS for animations
        this.addAnimationStyles();
    }

    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .animate-ready {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .metric-card.animate-ready {
                transition-delay: var(--animation-delay, 0s);
            }
        `;
        document.head.appendChild(style);

        // Add staggered delays to metric cards
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach((card, index) => {
            card.style.setProperty('--animation-delay', `${index * 0.1}s`);
        });
    }

    setupScrollEffects() {
        // Smooth scrolling for any internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add scroll-to-top functionality
        this.addScrollToTop();
    }

    addScrollToTop() {
        const scrollButton = document.createElement('button');
        scrollButton.innerHTML = '↑';
        scrollButton.className = 'scroll-to-top';
        scrollButton.setAttribute('aria-label', 'Scroll to top');
        scrollButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--color-primary);
            color: var(--color-btn-primary-text);
            border: none;
            font-size: 20px;
            cursor: pointer;
            box-shadow: var(--shadow-md);
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            z-index: 1000;
            transform: translateY(20px);
        `;
        
        scrollButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(scrollButton);
        
        // Show/hide scroll button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollButton.style.opacity = '1';
                scrollButton.style.transform = 'translateY(0)';
            } else {
                scrollButton.style.opacity = '0';
                scrollButton.style.transform = 'translateY(20px)';
            }
        });
    }

    handleResize() {
        // Handle responsive adjustments if needed
        const width = window.innerWidth;
        
        // Adjust chart modal size on mobile
        const modal = document.querySelector('.chart-modal');
        if (modal && width < 768) {
            const modalContent = modal.querySelector('.chart-modal-content');
            if (modalContent) {
                modalContent.style.maxWidth = '95vw';
                modalContent.style.maxHeight = '95vh';
            }
        }
    }

    // Utility method to get dashboard statistics
    getDashboardStats() {
        return {
            totalAttendees: 15,
            day1Attendance: 15,
            day2Attendance: 14,
            retentionRate: 93.3,
            averageAge: 36.5,
            genderBalance: { male: 8, female: 7 },
            experiencedOrgs: 9,
            greenSMESupport: 11
        };
    }

    // Method to export dashboard data (for future use)
    exportData() {
        const stats = this.getDashboardStats();
        const dataString = JSON.stringify(stats, null, 2);
        
        const blob = new Blob([dataString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'green-forward-dashboard-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new DashboardManager();
    
    // Make dashboard instance globally available
    window.dashboard = dashboard;
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+E to export data
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            dashboard.exportData();
        }
    });
    
    console.log('Green Forward Dashboard loaded successfully');
});