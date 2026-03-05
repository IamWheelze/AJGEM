/**
 * AJGEM - Applied Geophysics & Mineral Exploration
 * Main JavaScript File
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initNavigation();
    initScrollEffects();
    initAnimations();
    initGalleryFilter();
    initContactForm();
    initCounterAnimation();
    initSkillBars();
    initMineralTrade();
    initMineralNews();
});

/**
 * Preloader
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');

    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hidden');
            // Enable body scroll
            document.body.style.overflow = 'visible';
        }, 1000);
    });

    // Prevent body scroll while loading
    document.body.style.overflow = 'hidden';
}

/**
 * Navigation
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/**
 * Scroll Effects
 */
function initScrollEffects() {
    const backToTop = document.getElementById('backToTop');

    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Animations
 */
function initAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animateElements = document.querySelectorAll(
        '.service-card, .project-card, .role-card, .skill-category, .timeline-item, .gallery-item, .tool-item'
    );

    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    // Add animate class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Gallery Filter
 */
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Add transition styles to gallery items
    galleryItems.forEach(item => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
}

/**
 * Contact Form
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Simple validation
            if (!data.name || !data.email || !data.subject || !data.message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            if (!isValidEmail(data.email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Submit via Web3Forms
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    access_key: '435c3454-fdd1-4590-86d4-40180d5de896',
                    name: data.name,
                    email: data.email,
                    subject: data.subject,
                    message: data.message
                })
            })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitBtn.style.background = '#50c878';
                    showNotification('Thank you! Your message has been sent successfully.', 'success');
                    setTimeout(() => {
                        contactForm.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                    }, 2000);
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            })
            .catch(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                showNotification('Something went wrong. Please try again or email directly.', 'error');
            });
        });
    }
}

/**
 * Email Validation
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Notification System
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#50c878' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

/**
 * Counter Animation
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

/**
 * Animate Counter
 */
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

/**
 * Skill Bars Animation
 */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
                observer.unobserve(bar);
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => observer.observe(bar));
}

/**
 * Parallax Effect for Hero
 */
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');

    if (hero && scrolled < window.innerHeight) {
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    }
});

/**
 * Mineral Card Hover Effect
 */
document.querySelectorAll('.mineral-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

/**
 * Typing Effect for Hero (Optional Enhancement)
 */
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

/**
 * Lazy Loading for Images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

/**
 * Newsletter Form
 */
document.querySelector('.newsletter-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;

    if (isValidEmail(email)) {
        showNotification('Thank you for subscribing!', 'success');
        this.reset();
    } else {
        showNotification('Please enter a valid email address', 'error');
    }
});

/**
 * Initialize Particles Background (Simple version)
 */
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    // Create floating particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(212, 175, 55, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }

    // Add float animation
    if (!document.querySelector('#particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize particles on load
window.addEventListener('load', initParticles);

/* =========================================================
   MINERAL DATA — prices, demand, facts for all 16 minerals
   ========================================================= */
const MINERAL_DATA = {
    gold: {
        priceType: 'live', priceKey: 'gold',
        unit: '/ troy oz', demand: 'High', demandClass: 'demand-high',
        urgency: '⭐⭐⭐⭐',
        production: '~3 t/yr Nigeria · 3,300 t/yr global',
        keyUses: 'Jewellery, Electronics, Central Bank Reserves',
        hotFact: 'Gold hit all-time highs in 2024–25. Zamfara belt is Nigeria\'s richest strike.'
    },
    silver: {
        priceType: 'live', priceKey: 'silver',
        unit: '/ troy oz', demand: 'High', demandClass: 'demand-high',
        urgency: '⭐⭐⭐⭐',
        production: 'Underdeveloped in Nigeria — high upside · 25,000 t/yr global',
        keyUses: 'Solar panels, Electronics, Photography, Jewellery',
        hotFact: 'Solar panel demand is driving record silver consumption worldwide.'
    },
    lithium: {
        priceType: 'ref', refPrice: '$13,500',
        unit: '/ tonne (LCE)', demand: 'Critical', demandClass: 'demand-critical',
        urgency: '⭐⭐⭐⭐⭐',
        production: '10M+ tonne reserves (Nasarawa) · 180,000 t/yr global LCE',
        keyUses: 'EV Batteries, Grid Storage, Electronics',
        hotFact: 'Global lithium demand projected to grow 10× by 2040. Nigeria sits on a fortune.'
    },
    monazite: {
        priceType: 'ref', refPrice: '$2,800',
        unit: '/ tonne', demand: 'Critical', demandClass: 'demand-critical',
        urgency: '⭐⭐⭐⭐⭐',
        production: 'Strategic — restricted globally · Lagos, Ogun, Ondo coastal sands',
        keyUses: 'Rare Earth Elements, Wind Turbines, EV Motors, Defence',
        hotFact: 'Every EV motor and wind turbine needs rare earths locked inside monazite.'
    },
    cassiterite: {
        priceType: 'ref', refPrice: '$27,000',
        unit: '/ tonne (LME Tin ref)', demand: 'High', demandClass: 'demand-high',
        urgency: '⭐⭐⭐⭐',
        production: 'Jos Plateau — Nigeria was 6th global tin producer · 340,000 t/yr global',
        keyUses: 'Solder, Electronics, Packaging, Bronze Alloys',
        hotFact: 'Tin is essential for semiconductor solder — demand soaring with global chip expansion.'
    },
    'iron-ore': {
        priceType: 'ref', refPrice: '$105',
        unit: '/ tonne (62% Fe IODEX ref)', demand: 'High', demandClass: 'demand-high',
        urgency: '⭐⭐⭐',
        production: '3B+ tonne reserves (Kogi, Enugu) · 2.5B t/yr global',
        keyUses: 'Steel Production, Construction, Infrastructure',
        hotFact: 'Nigeria imports ₦2 trillion in steel annually — massive local demand opportunity.'
    },
    zircon: {
        priceType: 'ref', refPrice: '$1,650',
        unit: '/ tonne', demand: 'Moderate', demandClass: 'demand-moderate',
        urgency: '⭐⭐⭐',
        production: 'Beach sands alongside monazite (Lagos, Ogun) · 1.5M t/yr global',
        keyUses: 'Ceramics, Nuclear Reactors, Gemstone, Foundry Sand',
        hotFact: 'Zirconium is critical for nuclear fuel rod cladding — strategic material.'
    },
    columbite: {
        priceType: 'ref', refPrice: '$45',
        unit: '/ kg Nb content', demand: 'Critical', demandClass: 'demand-critical',
        urgency: '⭐⭐⭐⭐⭐',
        production: 'Nigeria was #1 global producer — Plateau State revival underway',
        keyUses: 'Aerospace Alloys, Superconductors, Pipeline Steel, Jet Engines',
        hotFact: 'Nigeria once supplied 80% of global columbite. Those days can return — and soon.'
    },
    tantalite: {
        priceType: 'ref', refPrice: '$130',
        unit: '/ kg Ta₂O₅', demand: 'Critical', demandClass: 'demand-critical',
        urgency: '⭐⭐⭐⭐⭐',
        production: 'Plateau, Nasarawa, Kogi tin belt · ~2,000 t/yr global refined',
        keyUses: 'Smartphone Capacitors, Medical Implants, Aerospace, Military',
        hotFact: 'Every smartphone contains tantalum. Demand growing 15 % per year — act now.'
    },
    galena: {
        priceType: 'ref', refPrice: '$2,100',
        unit: '/ tonne (LME Lead ref)', demand: 'Moderate', demandClass: 'demand-moderate',
        urgency: '⭐⭐⭐',
        production: 'Benue Trough, Abakaliki · 4.5M t/yr global refined lead',
        keyUses: 'Lead-Acid Batteries, Radiation Shielding, Cables, Ammunition',
        hotFact: 'Lead-acid batteries still dominate energy storage globally — steady demand.'
    },
    wolframite: {
        priceType: 'ref', refPrice: '$35,000',
        unit: '/ tonne (APT ref)', demand: 'High', demandClass: 'demand-high',
        urgency: '⭐⭐⭐⭐',
        production: 'Plateau, Kaduna, Bauchi Younger Granite · ~90,000 t/yr W global',
        keyUses: 'Cutting Tools, Military Munitions, High-Temp Alloys, Electronics',
        hotFact: 'China controls 80% of global supply — sourcing from Nigeria is strategically attractive.'
    },
    rutile: {
        priceType: 'ref', refPrice: '$1,250',
        unit: '/ tonne', demand: 'High', demandClass: 'demand-high',
        urgency: '⭐⭐⭐⭐',
        production: 'Lagos, Cross River, Akwa Ibom coastal sands · 700,000 t/yr global',
        keyUses: 'Titanium Metal, Aerospace, Welding Rods, Pigments',
        hotFact: 'Titanium from rutile is the material of choice for next-gen aircraft and medical implants.'
    },
    ilmenite: {
        priceType: 'ref', refPrice: '$360',
        unit: '/ tonne', demand: 'Moderate', demandClass: 'demand-moderate',
        urgency: '⭐⭐⭐',
        production: 'Coastal & Plateau States · 8M t/yr global',
        keyUses: 'TiO₂ Pigment, Titanium Metal, Aerospace',
        hotFact: 'TiO₂ is the most widely used white pigment — in every can of paint and tube of sunscreen.'
    },
    barite: {
        priceType: 'ref', refPrice: '$220',
        unit: '/ tonne', demand: 'High', demandClass: 'demand-high',
        urgency: '⭐⭐⭐⭐',
        production: 'Cross River, Taraba, Benue · 9M t/yr global',
        keyUses: 'Oil Drilling Mud, Oil & Gas Operations, Paints',
        hotFact: 'Every oil well drilled in Nigeria needs barite. Domestic demand is strong and growing.'
    },
    tourmaline: {
        priceType: 'ref', refPrice: '$60',
        unit: '/ carat (gem quality)', demand: 'Moderate', demandClass: 'demand-moderate',
        urgency: '⭐⭐⭐',
        production: 'Oyo, Kwara, Nassarawa pegmatites · gem market variable',
        keyUses: 'Fine Jewellery, Gem Collectors, Industrial Abrasive',
        hotFact: 'Nigerian tourmalines are gaining attention on international gem markets for their vivid colours.'
    },
    sapphire: {
        priceType: 'ref', refPrice: '$200',
        unit: '/ carat (gem quality)', demand: 'High', demandClass: 'demand-high',
        urgency: '⭐⭐⭐⭐',
        production: 'Kaduna, Plateau, Taraba gravels · limited global supply',
        keyUses: 'Fine Jewellery, Luxury Watches, Gem Collectors',
        hotFact: 'Nigerian sapphires are emerging in international gem markets — early movers have the edge.'
    }
};

/**
 * Inject trade block into each mineral card based on data-mineral attribute
 */
function initMineralTrade() {
    document.querySelectorAll('.gallery-item[data-mineral]').forEach(item => {
        const key = item.getAttribute('data-mineral');
        const data = MINERAL_DATA[key];
        if (!data) return;

        const info = item.querySelector('.mineral-info');
        if (!info) return;

        const priceLabel = data.priceType === 'live'
            ? `<span class="price-dot-live"></span> <span class="mineral-live-price-val" data-price-key="${data.priceKey}">Loading…</span> ${data.unit}`
            : `<span>Ref. ${data.refPrice}</span> ${data.unit}`;

        const tradeBlock = document.createElement('div');
        tradeBlock.className = 'mineral-trade';
        tradeBlock.innerHTML = `
            <div class="mineral-price-row">
                <span class="mineral-live-price">${priceLabel}</span>
                <span class="demand-badge ${data.demandClass}">${data.demand} Demand</span>
            </div>
            <div class="mineral-quick-facts">
                <span><i class="fas fa-globe-africa"></i> ${data.production}</span>
                <span><i class="fas fa-industry"></i> ${data.keyUses}</span>
                <span><i class="fas fa-star"></i> Urgency: ${data.urgency}</span>
            </div>
            <div class="mineral-hot-fact">
                <i class="fas fa-fire" style="color:var(--accent-gold);margin-right:5px;"></i>${data.hotFact}
            </div>
            <a href="#contact" class="btn-trade">
                <i class="fas fa-handshake"></i> Enquire to Trade
            </a>`;
        info.appendChild(tradeBlock);
    });

    // Fetch live gold/silver prices
    fetchLivePrices();
    // Refresh every 5 minutes
    setInterval(fetchLivePrices, 5 * 60 * 1000);
}

/**
 * Fetch live gold and silver prices from metals.live (free, no API key)
 */
function fetchLivePrices() {
    fetch('https://api.metals.live/v1/spot')
        .then(r => r.json())
        .then(data => {
            // data is an array of objects [{gold: price}, {silver: price}, ...]
            let prices = {};
            if (Array.isArray(data)) {
                data.forEach(obj => Object.assign(prices, obj));
            } else {
                prices = data;
            }

            const gold = prices.gold ? `$${Number(prices.gold).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : null;
            const silver = prices.silver ? `$${Number(prices.silver).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : null;
            const now = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

            // Update ticker strip
            if (gold) document.getElementById('ticker-gold') && (document.getElementById('ticker-gold').textContent = gold + ' / oz');
            if (silver) document.getElementById('ticker-silver') && (document.getElementById('ticker-silver').textContent = silver + ' / oz');
            const tickerTime = document.getElementById('ticker-time');
            if (tickerTime) tickerTime.textContent = now;

            // Update card price labels
            if (gold) {
                document.querySelectorAll('.mineral-live-price-val[data-price-key="gold"]').forEach(el => {
                    el.textContent = gold;
                });
            }
            if (silver) {
                document.querySelectorAll('.mineral-live-price-val[data-price-key="silver"]').forEach(el => {
                    el.textContent = silver;
                });
            }
        })
        .catch(() => {
            // Silently fail — ref prices are still shown for other minerals
            ['ticker-gold', 'ticker-silver'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = 'unavailable';
            });
            document.querySelectorAll('.mineral-live-price-val').forEach(el => {
                el.textContent = 'Contact for price';
            });
        });
}

/**
 * Fetch mineral market news from Mining.com RSS via rss2json
 */
function initMineralNews() {
    const grid = document.getElementById('news-grid');
    if (!grid) return;

    const rssUrl = encodeURIComponent('https://www.mining.com/feed/');
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}&count=6`;

    fetch(apiUrl)
        .then(r => r.json())
        .then(data => {
            if (!data.items || data.items.length === 0) throw new Error('No items');

            const icons = ['⛏️', '💎', '🪨', '🔬', '🌍', '📈'];
            grid.innerHTML = data.items.map((item, i) => {
                const date = new Date(item.pubDate).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'});
                const desc = item.description
                    ? item.description.replace(/<[^>]*>/g, '').slice(0, 180) + '…'
                    : '';
                const imgSrc = item.thumbnail || item.enclosure?.link || '';
                const imgEl = imgSrc
                    ? `<img src="${imgSrc}" alt="" class="news-card-img" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="news-card-img-placeholder" style="display:none">${icons[i % icons.length]}</div>`
                    : `<div class="news-card-img-placeholder">${icons[i % icons.length]}</div>`;

                return `
                <div class="news-card">
                    ${imgEl}
                    <div class="news-card-body">
                        <div class="news-card-date">${date}</div>
                        <div class="news-card-title">${item.title}</div>
                        <div class="news-card-desc">${desc}</div>
                        <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="news-card-link">
                            Read full story <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>`;
            }).join('');
        })
        .catch(() => {
            grid.innerHTML = `
                <div class="news-error">
                    <i class="fas fa-satellite-dish" style="font-size:2rem;color:var(--accent-gold);display:block;margin-bottom:12px;"></i>
                    Could not load live news right now. Visit
                    <a href="https://www.mining.com" target="_blank" rel="noopener noreferrer" style="color:var(--accent-gold);">Mining.com</a>
                    for the latest mineral market updates.
                </div>`;
        });
}

/**
 * Console Welcome Message
 */
console.log('%c AJGEM ', 'background: linear-gradient(135deg, #d4af37 0%, #b87333 100%); color: #0a0f14; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 5px;');
console.log('%c Applied Geophysics & Mineral Exploration ', 'color: #1a5f7a; font-size: 14px;');
console.log('%c Unlocking Earth\'s potential through science and technology ', 'color: #636e72; font-style: italic;');
