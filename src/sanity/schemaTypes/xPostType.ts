import { TwitterIcon } from "@sanity/icons/Twitter";
import { defineField, defineType } from "sanity";

import { parseXEmbedUrl } from "../../lib/x-embed";

export const xPostType = defineType({
  name: "xPost",
  title: "X Post",
  type: "object",
  icon: TwitterIcon,
  fields: [
    defineField({
      name: "url",
      title: "Post or broadcast URL",
      type: "url",
      description:
        "Paste a public post or broadcast URL from x.com or twitter.com.",
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["http", "https"] })
          .custom((value) =>
            !value || parseXEmbedUrl(value)
              ? true
              : "Must be a valid X or Twitter post or broadcast URL",
          ),
    }),
  ],
  preview: {
    select: { url: "url" },
    prepare({ url }) {
      return {
        title:
          parseXEmbedUrl(url)?.kind === "broadcast" ? "X broadcast" : "X post",
        subtitle: url,
      };
    },
  },
});
