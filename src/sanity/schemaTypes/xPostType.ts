import { TwitterIcon } from "@sanity/icons/Twitter";
import { defineField, defineType } from "sanity";

/**
 * X post embed — a block-level post inside `blockContent`.
 *
 * Authors only paste the public post URL. The front-end renders an accessible
 * link as its fallback and lets X's widgets script enhance it into the full
 * embed in the browser.
 */
const X_POST_URL_RE =
  /^https?:\/\/(?:www\.|mobile\.)?(?:x\.com|twitter\.com)\/(?:[a-z0-9_]+|i\/web)\/status\/\d+(?:[/?#].*)?$/i;

export const xPostType = defineType({
  name: "xPost",
  title: "X Post",
  type: "object",
  icon: TwitterIcon,
  fields: [
    defineField({
      name: "url",
      title: "Post URL",
      type: "url",
      description: "Paste a public post URL from x.com or twitter.com.",
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["http", "https"] })
          .custom((value) =>
            !value || X_POST_URL_RE.test(value)
              ? true
              : "Must be a valid X or Twitter post URL",
          ),
    }),
  ],
  preview: {
    select: { url: "url" },
    prepare({ url }) {
      return { title: "X post", subtitle: url };
    },
  },
});
