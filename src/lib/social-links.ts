export interface SocialLink {
  label: string;
  href: string;
  /** Icon key resolved to an SVG component on the Links page. */
  icon?: string;
  /** Tailwind classes for the Links-page icon tile. */
  iconFill?: string;
  iconBackground?: string;
  followerCount?: number;
  actionLabel?: "Follow" | "Subscribe" | "Connect";
  /** Supporting copy for a profile without a follower metric. */
  description?: string;
  /** Display order for cards on the Links page. */
  linksPageOrder: number;
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
    linksPageOrder: 1,
    footer: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ryanfurrer/",
    icon: "linkedin",
    iconFill: "fill-white",
    iconBackground: "bg-blue-600",
    actionLabel: "Connect",
    description: "Professional profile",
    linksPageOrder: 6,
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
    linksPageOrder: 3,
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
    linksPageOrder: 2,
  },
  {
    label: "Twitch",
    href: "https://www.twitch.tv/ryandotfurrer",
    icon: "twitch",
    iconFill: "fill-white",
    iconBackground: "bg-violet-600",
    followerCount: 178,
    actionLabel: "Follow",
    linksPageOrder: 5,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@ryandotfurrer",
    icon: "youtube",
    iconFill: "fill-white",
    iconBackground: "bg-rose-600",
    followerCount: 46,
    actionLabel: "Subscribe",
    linksPageOrder: 4,
  },
];
