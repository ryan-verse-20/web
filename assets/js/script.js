/* ==========================================================================
   Vvekslab Global Interactive JS Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initActiveNavLink();
  initBackToTopButton();
  initCarousel();
  initTickerCarousel();
  initReadMoreToggles();
  initAccordions();
  initGalleryFilter();
  initPublicationsFilter();
  initContactForm();
});

/* --- Sticky Header --- */
function initStickyHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* --- Mobile Menu Navigation & Submenu Toggle --- */
function initMobileMenu() {
  const navToggler = document.querySelector('[data-nav-toggler]');
  const navbar = document.querySelector('[data-navbar]');
  if (!navToggler || !navbar) return;

  navToggler.addEventListener('click', () => {
    navbar.classList.toggle('active');
    navToggler.classList.toggle('active');
  });

  // Close menu when normal link is clicked (excluding dropdown toggles)
  const navLinks = navbar.querySelectorAll('.navbar-link:not(.dropdown-toggle)');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('active');
      navToggler.classList.remove('active');
    });
  });

  // Close menu when sub-item links inside dropdown are clicked
  const dropdownSubLinks = navbar.querySelectorAll('.dropdown-content a');
  dropdownSubLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('active');
      navToggler.classList.remove('active');
    });
  });

  // Mobile Dropdown Submenu Toggle
  const dropdownToggles = navbar.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        const dropdownParent = toggle.closest('.dropdown');
        if (dropdownParent) {
          dropdownParent.classList.toggle('open');
        }
      }
    });
  });
}

/* --- Active Navigation Links --- */
function initActiveNavLink() {
  const navLinks = document.querySelectorAll('.navbar-link');
  let currentPath = window.location.pathname.split('/').pop() || 'index.html';
  if (!currentPath) currentPath = 'index.html';

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (linkPath === 'team.html' && currentPath === 'alumni.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  const dropdownLinks = document.querySelectorAll('.dropdown-content a');
  dropdownLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --- Back to Top Button --- */
function initBackToTopButton() {
  const backTopBtn = document.querySelector('[data-back-top-btn]');
  if (!backTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 150) {
      backTopBtn.classList.add('active');
    } else {
      backTopBtn.classList.remove('active');
    }
  });
}

/* --- Auto-Advance Hero Carousel (Infinite Loop) --- */
function initCarousel() {
  const carousel = document.querySelector('.carousel-inner');
  const items = document.querySelectorAll('.carousel-item');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  if (!carousel || items.length === 0) return;

  // Prevent duplicate clone initialization if called multiple times
  if (carousel.getAttribute('data-carousel-inited') === 'true') return;
  carousel.setAttribute('data-carousel-inited', 'true');

  // Clone first and last items for seamless infinite looping
  const firstClone = items[0].cloneNode(true);
  const lastClone = items[items.length - 1].cloneNode(true);

  carousel.appendChild(firstClone);
  carousel.insertBefore(lastClone, items[0]);

  let currentIndex = 1;
  const totalItems = items.length;
  const slideInterval = 5000; // 5 seconds
  let isMoving = false;
  let timer = null;

  // Initial position at first real slide
  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

  function showSlide(index) {
    if (isMoving) return;
    isMoving = true;
    currentIndex = index;
    carousel.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  function nextSlide() {
    if (isMoving) return;
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    if (isMoving) return;
    showSlide(currentIndex - 1);
  }

  carousel.addEventListener('transitionend', () => {
    isMoving = false;
    if (currentIndex >= totalItems + 1) {
      carousel.style.transition = 'none';
      currentIndex = 1;
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    } else if (currentIndex <= 0) {
      carousel.style.transition = 'none';
      currentIndex = totalItems;
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  });

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(() => {
      nextSlide();
    }, slideInterval);
  }

  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
    });
  }

  // Pause on hover, resume on mouse leave
  const heroSection = document.querySelector('.hero-carousel');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoplay);
    heroSection.addEventListener('mouseleave', startAutoplay);
  }

  // Start initial autoplay
  startAutoplay();
}

/* --- Announcement Ticker Vertical Fade Carousel --- */
function initTickerCarousel() {
  const items = document.querySelectorAll('.announcement-ticker .ticker-item');
  if (items.length === 0) return;

  let currentIndex = 0;
  items[currentIndex].classList.add('active');

  if (items.length === 1) return;

  setInterval(() => {
    const currentItem = items[currentIndex];
    currentItem.classList.remove('active');
    currentItem.classList.add('exit');

    setTimeout(() => {
      currentItem.classList.remove('exit');
    }, 600);

    currentIndex = (currentIndex + 1) % items.length;
    items[currentIndex].classList.add('active');
  }, 4500); // Cycles every 4.5 seconds
}

/* --- Read More/Less Toggles --- */
function initReadMoreToggles() {
  const toggles = document.querySelectorAll('.btn-readmore');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const targetCard = toggle.closest('.research-card');
      if (!targetCard) return;

      const isExpanded = targetCard.classList.toggle('expanded');
      toggle.innerHTML = isExpanded
        ? `Read Less <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/></svg>`
        : `Read More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>`;
    });
  });
}

/* --- Accordions --- */
function initAccordions() {
  const accordions = document.querySelectorAll('.accordion-header');

  accordions.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const icon = header.querySelector('.accordion-icon');

      const isActive = item.classList.contains('active');

      // Close all other accordions in the same group
      const parent = item.closest('.accordion');
      if (parent) {
        parent.querySelectorAll('.accordion-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.accordion-content');
            if (otherContent) otherContent.style.maxHeight = null;
            const otherIcon = otherItem.querySelector('.accordion-icon');
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
          }
        });
      }

      // Toggle current accordion
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* --- Gallery Responsive Grid & Lightbox Logic --- */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-buttons .filter-btn');
  const cards = document.querySelectorAll('.gallery-grid .gallery-card');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  if (cards.length === 0) return;

  let currentVisibleCards = Array.from(cards);
  let lightboxIndex = 0;

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });

      // Update active visible cards list for Lightbox navigation
      currentVisibleCards = Array.from(cards).filter(card => !card.classList.contains('hidden'));
    });
  });

  // Lightbox functionality
  function openLightbox(index) {
    if (currentVisibleCards.length === 0) return;
    lightboxIndex = (index + currentVisibleCards.length) % currentVisibleCards.length;
    const activeCard = currentVisibleCards[lightboxIndex];
    const img = activeCard ? activeCard.querySelector('img') : null;

    if (img && lightbox && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'Gallery image';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const visibleIndex = currentVisibleCards.indexOf(card);
      if (visibleIndex !== -1) {
        openLightbox(visibleIndex);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(lightboxIndex - 1); });
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(lightboxIndex + 1); });

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(lightboxIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(lightboxIndex + 1);
  });
}

/* --- Mock Contact Form --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill out all fields.');
      return;
    }

    // Success response mockup
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';

    setTimeout(() => {
      alert(`Thank you, ${name}! Your message has been sent successfully. We will get back to you shortly.`);
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }, 1500);
  });
}

/* --- Publications Category Filter --- */
function initPublicationsFilter() {
  const filterButtons = document.querySelectorAll('.pub-filter-btn');
  const pubSections = document.querySelectorAll('.pub-section');
  if (filterButtons.length === 0 || pubSections.length === 0) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Hide all sections, show only the matched one
      pubSections.forEach(section => {
        if (section.getAttribute('id') === filterValue) {
          section.style.display = 'block';
        } else {
          section.style.display = 'none';
        }
      });
    });
  });
}

/* --- Team Category Filter --- */
function initTeamFilter() {
  const filterBtns = document.querySelectorAll('#team-filter-buttons .filter-btn');
  const teamItems = document.querySelectorAll('.team-member-item');
  
  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active to current
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      teamItems.forEach(item => {
        const categories = item.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// Ensure the new filter function runs when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initTeamFilter();
  initMobileFilterScrollbars();
});

/* --- Persistent Custom Mobile Filter Scrollbar --- */
function initMobileFilterScrollbars() {
  const filterContainers = document.querySelectorAll('.pub-filter-buttons, .gallery-filter-buttons, .team-filter-buttons');

  filterContainers.forEach(container => {
    // Prevent duplicate creation
    let parent = container.parentElement;
    if (parent.querySelector('.custom-scroll-bar')) return;

    const scrollBar = document.createElement('div');
    scrollBar.className = 'custom-scroll-bar';
    scrollBar.innerHTML = '<div class="custom-scroll-thumb"></div>';
    
    // Insert immediately after container
    container.insertAdjacentElement('afterend', scrollBar);

    const thumb = scrollBar.querySelector('.custom-scroll-thumb');

    function updateThumb() {
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const maxScroll = scrollWidth - clientWidth;

      if (maxScroll <= 5) {
        scrollBar.style.display = 'none';
        return;
      } else {
        scrollBar.style.display = 'block';
      }

      const ratio = clientWidth / scrollWidth;
      const thumbWidth = Math.max(clientWidth * ratio, 35);
      thumb.style.width = thumbWidth + 'px';

      const scrollLeft = container.scrollLeft;
      const maxThumbLeft = clientWidth - thumbWidth;
      const thumbLeft = (scrollLeft / maxScroll) * maxThumbLeft;

      thumb.style.transform = `translateX(${thumbLeft}px)`;
    }

    container.addEventListener('scroll', updateThumb, { passive: true });
    window.addEventListener('resize', updateThumb);
    setTimeout(updateThumb, 100);
    updateThumb();
  });
}
