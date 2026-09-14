export function getImageSrcSet(src: string, widths: number[] = [320, 640, 960, 1280, 1920]): string {
  if (src.startsWith("http")) return src;
  return widths.map((w) => `${src}?w=${w}&q=75`).join(", ");
}

export function getOptimizedImageProps(src: string, alt: string, width: number, height: number) {
  return {
    src,
    alt,
    width,
    height,
    loading: "lazy" as const,
    quality: 75,
  };
}

export function shouldUseCDN(src: string): boolean {
  return src.startsWith("http");
}