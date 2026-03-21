// Load SVG banners inline to make them theme-aware
document.addEventListener('DOMContentLoaded', () => {
  const bannerImg = document.querySelector('.blog-banner img');

  if (!bannerImg || !bannerImg.src.endsWith('.svg')) {
    return;
  }

  const svgUrl = bannerImg.src;
  const altText = bannerImg.alt;

  fetch(svgUrl)
    .then(response => response.text())
    .then(svgText => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElement = svgDoc.documentElement;

      // Preserve attributes
      svgElement.setAttribute('role', 'img');
      svgElement.setAttribute('aria-label', altText);

      // Preserve aspect ratio styling
      svgElement.style.width = '100%';
      svgElement.style.display = 'block';

      // Replace img with inline SVG
      bannerImg.replaceWith(svgElement);
    })
    .catch(error => {
      console.error('Failed to load banner SVG:', error);
    });
});
