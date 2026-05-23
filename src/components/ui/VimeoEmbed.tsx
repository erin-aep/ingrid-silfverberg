type VimeoEmbedProps = {
  src: string;
  title: string;
  className?: string;
};

export function VimeoEmbed({ src, title, className = "" }: VimeoEmbedProps) {
  const embedSrc = src.includes("player.vimeo.com")
    ? `${src}?title=0&byline=0&portrait=0`
    : src;

  return (
    <iframe
      src={embedSrc}
      title={title}
      className={`absolute inset-0 h-full w-full border-0 ${className}`}
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
      allowFullScreen
      loading="lazy"
    />
  );
}
