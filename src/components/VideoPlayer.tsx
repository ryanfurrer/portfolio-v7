import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

/**
 * YouTube player, on-system. Wraps Vidstack's YouTube provider, which sizes the
 * YouTube iframe far larger than its frame and clips to the centre band — so
 * YouTube's title bar, endscreen, and "Watch on YouTube" branding (rendered at
 * the iframe's top/bottom edges) are cropped off entirely, leaving only our
 * controls.
 *
 * Controls are neutral, not the site's vermilion accent (see `--media-brand` in
 * global.css): the accent is reserved for interactive text, so functional video
 * chrome stays neutral.
 *
 * `load="visible"` loads the provider when the player scrolls into view rather
 * than on the first play, so the play() call stays inside the click gesture —
 * fixing the Safari autoplay stall the load-on-play strategy caused. The layout
 * is forced large (`smallLayoutWhen={false}`) because the height-based default
 * renders a broken small/large hybrid at article width.
 */
interface Props {
  /** YouTube video id, e.g. "rx41vYOBLFE". */
  videoId: string;
  title?: string;
}

export default function VideoPlayer({ videoId, title = "" }: Props) {
  const poster = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <MediaPlayer
      className="vp-player my-6 overflow-hidden rounded-xl ring-1 ring-black/5 dark:ring-white/10"
      title={title}
      src={`youtube/${videoId}`}
      load="visible"
      posterLoad="visible"
      playsInline
    >
      <MediaProvider>
        <Poster className="vds-poster" src={poster} alt={title} />
      </MediaProvider>
      <DefaultVideoLayout icons={defaultLayoutIcons} smallLayoutWhen={false} />
    </MediaPlayer>
  );
}
