import {defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons/Play'

/**
 * YouTube embed — a block-level video embedded inside `blockContent`.
 * Stores only the video URL; the front-end (`YouTubeEmbed.astro`) parses the
 * video ID and renders a click-to-load facade so no YouTube JS/iframe loads
 * until the reader actually plays the video.
 */

// Accepts watch, youtu.be, shorts, embed, and live URL shapes.
const YOUTUBE_URL_RE =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)[\w-]{11}/

export const youtubeType = defineType({
  name: 'youtube',
  title: 'YouTube',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube URL',
      type: 'url',
      description:
        'Paste any YouTube link (watch, youtu.be, Shorts, or live).',
      validation: (rule) =>
        rule
          .required()
          .uri({scheme: ['http', 'https']})
          .custom((value) =>
            !value || YOUTUBE_URL_RE.test(value)
              ? true
              : 'Must be a valid YouTube video URL',
          ),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional — used as the video caption and accessible label.',
    }),
  ],
  preview: {
    select: {url: 'url', title: 'title'},
    prepare({url, title}) {
      return {title: title || 'YouTube video', subtitle: url}
    },
  },
})
