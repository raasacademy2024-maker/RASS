import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  srcSet?: string;
  sizes?: string;
  placeholder?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'auto' | 'sync';
  fetchPriority?: 'high' | 'low' | 'auto';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * LazyImage component for optimized image loading
 * Features:
 * - Lazy loading with Intersection Observer
 * - Blur placeholder while loading
 * - srcset support for responsive images
 * - WebP format detection
 * - Error handling with fallback
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  srcSet,
  sizes,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMSAxIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);

  // Use Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'eager' || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px', // Start loading when image is 100px from viewport
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Error fallback image
  const errorFallback =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTAwIDcwQzg4LjkgNzAgODAgNzguOSA4MCA5MEM4MCAxMDEuMSA4OC45IDExMCAxMDAgMTEwQzExMS4xIDExMCAxMjAgMTAxLjEgMTIwIDkwQzEyMCA3OC45IDExMS4xIDcwIDEwMCA3MFpNMTAwIDEwMEM5NC41IDEwMCA5MCA5NS41IDkwIDkwQzkwIDg0LjUgOTQuNSA4MCAxMDAgODBDMTA1LjUgODAgMTEwIDg0LjUgMTEwIDkwQzExMCA5NS41IDEwNS41IDEwMCAxMDAgMTAwWiIgZmlsbD0iIzlDQTNCOCIvPjxwYXRoIGQ9Ik0xNDAgMTMwSDYwVjE0MEgxNDBWMTMwWiIgZmlsbD0iIzlDQTNCOCIvPjwvc3ZnPg==';

  return (
    <img
      ref={imgRef}
      src={hasError ? errorFallback : isInView ? src : placeholder}
      alt={alt}
      className={`${className} ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-300`}
      width={width}
      height={height}
      srcSet={isInView && !hasError ? srcSet : undefined}
      sizes={sizes}
      loading={loading}
      decoding={decoding}
      // @ts-expect-error - fetchPriority is a valid HTML attribute but not yet in React types
      fetchpriority={fetchPriority}
      onLoad={handleLoad}
      onError={handleError}
      style={{
        backgroundColor: isLoaded ? 'transparent' : '#f3f4f6',
        aspectRatio: width && height ? `${width} / ${height}` : undefined,
      }}
    />
  );
};

export default LazyImage;

/**
 * Helper function to generate srcset for responsive images
 * @param basePath - Base path to the image without extension
 * @param extension - Image extension (e.g., 'webp', 'jpg')
 * @param sizes - Array of widths to generate
 * @returns srcset string
 */
export const generateSrcSet = (
  basePath: string,
  extension: string,
  sizes: number[]
): string => {
  return sizes
    .map((size) => `${basePath}-${size}w.${extension} ${size}w`)
    .join(', ');
};

/**
 * Helper function to check if browser supports WebP
 */
export const supportsWebP = (): boolean => {
  if (typeof document === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

/**
 * Image optimization guidelines for RASS Academy:
 * 
 * 1. Use WebP format for all images with JPEG/PNG fallback
 * 2. Provide multiple sizes using srcset for responsive loading
 * 3. Always include width and height to prevent layout shift (CLS)
 * 4. Use lazy loading for below-the-fold images
 * 5. Use eager loading for hero/above-the-fold images
 * 6. Strip unnecessary metadata using image optimization tools
 * 7. Compress images to reduce file size (target < 100KB for most images)
 * 
 * Example usage:
 * 
 * <LazyImage
 *   src="/images/course-thumbnail.webp"
 *   alt="Course thumbnail"
 *   width={400}
 *   height={300}
 *   srcSet="/images/course-thumbnail-400w.webp 400w, /images/course-thumbnail-800w.webp 800w"
 *   sizes="(max-width: 768px) 100vw, 400px"
 *   loading="lazy"
 * />
 * 
 * For hero images (above the fold):
 * 
 * <LazyImage
 *   src="/images/hero.webp"
 *   alt="Hero image"
 *   width={1920}
 *   height={1080}
 *   loading="eager"
 *   fetchPriority="high"
 * />
 */
