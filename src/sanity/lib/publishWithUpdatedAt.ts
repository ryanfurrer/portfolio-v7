import {useDocumentOperation, type DocumentActionComponent} from 'sanity'

/**
 * Document types that carry an `updatedAt` field (see shared.ts). The
 * publish wrapper below only stamps the timestamp for these, so it never
 * adds a stray `updatedAt` to types that don't define it (about/now/company).
 */
const TYPES_WITH_UPDATED_AT = ['post', 'project', 'appearance']

/**
 * Wraps the default Publish action so `updatedAt` is set to "now" only when
 * a published version already exists — i.e. this publish is an *update*, not
 * the first one. First publishes leave `updatedAt` empty, which is why the
 * field has no initialValue. Patches bypass the field's readOnly UI flag, so
 * the stamp still applies even though editors can't set it by hand.
 */
export function publishWithUpdatedAt(
  originalPublish: DocumentActionComponent,
): DocumentActionComponent {
  const WrappedPublish: DocumentActionComponent = (props) => {
    const original = originalPublish(props)
    const {patch} = useDocumentOperation(props.id, props.type)
    if (!original) return original

    return {
      ...original,
      onHandle: () => {
        if (props.published && TYPES_WITH_UPDATED_AT.includes(props.type)) {
          patch.execute([{set: {updatedAt: new Date().toISOString()}}])
        }
        original.onHandle?.()
      },
    }
  }

  return WrappedPublish
}
