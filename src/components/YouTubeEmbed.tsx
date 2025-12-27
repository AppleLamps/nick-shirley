interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

export default function YouTubeEmbed({ videoId, title = 'Video' }: YouTubeEmbedProps) {
  return (
    <div className="relative w-full aspect-video bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
