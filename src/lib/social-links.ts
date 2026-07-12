export interface SocialLink {
  label: string;
  href: string;
  /** Icon key resolved to an SVG component on the Links page. */
  icon?: string;
  /** Tailwind classes for the Links-page icon tile. */
  iconFill?: string;
  iconBackground?: string;
  followerCount?: number;
  actionLabel?: "Follow" | "Subscribe";
  /** Include in the site footer + home "find me elsewhere" row. */
  footer?: boolean;
}

// Single source for every social profile. The footer / "find me elsewhere" row
// renders the `footer: true` subset in this order; the Links page shows all of
// them sorted by follower count (see links/index.astro).
export const socialLinks: SocialLink[] = [
  {
    label: "Twitter/X",
    href: "https://x.com/ryanfurrer_",
    icon: "x",
    iconFill: "fill-white",
    iconBackground: "bg-zinc-950",
    followerCount: 970,
    actionLabel: "Follow",
    footer: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ryanfurrer/",
    icon: "linkedin",
    iconFill: "fill-white",
    iconBackground: "bg-blue-600",
    followerCount: 1920,
    actionLabel: "Follow",
    footer: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/ryanfurrer",
    icon: "github",
    iconFill: "fill-white",
    iconBackground: "bg-zinc-950",
    followerCount: 59,
    actionLabel: "Follow",
    footer: true,
  },
  {
    label: "Bluesky",
    href: "https://bsky.app/profile/ryandotfurrer.bsky.social",
    icon: "bluesky",
    iconFill: "fill-white",
    iconBackground: "bg-sky-500",
    followerCount: 764,
    actionLabel: "Follow",
  },
  {
    label: "Twitch",
    href: "https://www.twitch.tv/ryandotfurrer",
    icon: "twitch",
    iconFill: "fill-white",
    iconBackground: "bg-violet-600",
    followerCount: 178,
    actionLabel: "Follow",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@ryandotfurrer",
    icon: "youtube",
    iconFill: "fill-white",
    iconBackground: "bg-rose-600",
    followerCount: 46,
    actionLabel: "Subscribe",
  },
];
