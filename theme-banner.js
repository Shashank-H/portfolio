// Load SVG banners inline to make them theme-aware
function loadBanner() {
  const bannerContainer = document.querySelector('.blog-banner');
  const bannerImg = bannerContainer?.querySelector('img');

  if (!bannerImg || !bannerImg.src.endsWith('.svg')) {
    return;
  }

  // Add loading state
  bannerContainer.classList.add('loading');

  const svgUrl = bannerImg.src;
  const altText = bannerImg.alt;
  const cacheKey = `banner-svg:${svgUrl}`;

  function injectSVG(svgText) {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;

    // Preserve attributes
    svgElement.setAttribute('role', 'img');
    svgElement.setAttribute('aria-label', altText);

    // Replace img with inline SVG
    bannerImg.replaceWith(svgElement);

    // Remove loading state
    bannerContainer.classList.remove('loading');
  }

  // Check sessionStorage cache first
  const cachedSVG = sessionStorage.getItem(cacheKey);
  if (cachedSVG) {
    injectSVG(cachedSVG);
    return;
  }

  // Fetch and cache
  fetch(svgUrl)
    .then(response => response.text())
    .then(svgText => {
      // Cache for this session
      try {
        sessionStorage.setItem(cacheKey, svgText);
      } catch (e) {
        // Ignore quota errors
      }
      injectSVG(svgText);
    })
    .catch(error => {
      console.error('Failed to load banner SVG:', error);
      // Show the img if fetch fails
      if (bannerImg) {
        bannerImg.style.opacity = '1';
      }
      bannerContainer.classList.remove('loading');
    });
}

// Run as soon as DOM is interactive (earlier than DOMContentLoaded)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadBanner);
} else {
  loadBanner();
}
