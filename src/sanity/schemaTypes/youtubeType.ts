import {defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons'

/**
 * YouTube embed — stores a plain YouTube URL. The front-end
 * (`YouTubeBlock.astro`) extracts the video id and renders the neutral-themed
 * Vidstack player. Any URL shape works (watch, youtu.be, embed, shorts);
 * the same regex validates here and parses on the front end.
 */
const YT_URL = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))[\w-]{11}/

export const youtubeType = defineType({
  name: 'youtube',
  title: 'YouTube',
  type: 'object',
  icon: PlayIcon,
  // NOTE: the dialog modal is configured on the array-member reference in
  // blockContentType (the point of use), not here — a Portable Text block
  // object reads its modal presentation from the array, not the object type.
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube URL',
      type: 'url',
      description: 'Paste any YouTube link — watch, youtu.be, embed, or shorts.',
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            !value || YT_URL.test(value)
              ? true
              : 'Must be a valid YouTube video URL.',
          ),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description:
        'Accessible label for the player (announced to screen readers). Optional but recommended.',
    }),
  ],
  preview: {
    select: {title: 'title', url: 'url'},
    prepare({title, url}) {
      return {title: title || 'YouTube video', subtitle: url}
    },
  },
})
