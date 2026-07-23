import {defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons/Play'

/**
 * Uploaded video — a block-level, self-hosted clip embedded inside
 * `blockContent`. Stores the Sanity `file` asset (restricted to `video/*`);
 * the front-end (`PortableTextVideo.astro`) builds the CDN file URL from the
 * asset ref via `@sanity/asset-utils` (mirroring how images resolve from a
 * ref, so the GROQ projections don't need to dereference the asset).
 *
 * Playback is decorative: muted + looping autoplay, gated client-side so it
 * stays paused under `prefers-reduced-motion`; native controls are always
 * available.
 *
 * `aspectRatio` sizes the frame so the border hugs the video with no letterbox
 * gap — Sanity doesn't store video dimensions, so this is chosen at author time
 * (defaults to 16:9). The value is a ready-to-use CSS `aspect-ratio`.
 */
export const videoType = defineType({
  name: 'video',
  title: 'Video',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'file',
      title: 'Video file',
      type: 'file',
      options: {accept: 'video/*'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect ratio',
      type: 'string',
      description: 'Match this to your video so the frame has no black bars.',
      initialValue: '16 / 9',
      options: {
        list: [
          {title: '16:9 (widescreen)', value: '16 / 9'},
          {title: '16:10', value: '16 / 10'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description:
        'Optional — shown beneath the video and used as its accessible label.',
    }),
  ],
  preview: {
    select: {caption: 'caption', filename: 'file.asset.originalFilename'},
    prepare({caption, filename}) {
      return {title: caption || 'Video', subtitle: filename}
    },
  },
})
