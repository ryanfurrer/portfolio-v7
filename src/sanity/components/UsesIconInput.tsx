import {useCallback} from 'react'
import {set, unset, type StringInputProps} from 'sanity'
import {USES_ICONS} from '../../lib/uses-icons'

/**
 * Visual icon picker for the Uses `icon` field — a curated grid of the Lucide
 * icons defined in src/lib/uses-icons.ts (the same set the frontend renders).
 *
 * Deliberately built with plain React + inline styles instead of @sanity/ui:
 * @sanity/ui is only a transitive dependency here, so importing it directly is
 * fragile under pnpm and risks the embedded /admin Studio's dep pre-bundling.
 * The stored value is just the icon name (a string); clicking the selected icon
 * again clears it (unset), so the field stays optional.
 */
export function UsesIconInput(props: StringInputProps) {
  const {onChange, value, readOnly, elementProps} = props

  const handleSelect = useCallback(
    (name: string) => {
      onChange(name === value ? unset() : set(name))
    },
    [onChange, value],
  )

  return (
    <div
      {...elementProps}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))',
        gap: 6,
      }}
    >
      {USES_ICONS.map((icon) => {
        const selected = icon.name === value
        return (
          <button
            key={icon.name}
            type="button"
            title={icon.label}
            aria-label={icon.label}
            aria-pressed={selected}
            disabled={readOnly}
            onClick={() => handleSelect(icon.name)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              aspectRatio: '1 / 1',
              padding: 8,
              borderRadius: 6,
              cursor: readOnly ? 'default' : 'pointer',
              color: selected ? 'var(--card-fg-color, currentColor)' : 'currentColor',
              background: selected
                ? 'var(--card-badge-default-bg-color, rgba(127,127,127,0.25))'
                : 'var(--card-code-bg-color, rgba(127,127,127,0.08))',
              border: `1px solid ${
                selected
                  ? 'var(--card-focus-ring-color, rgba(127,127,127,0.6))'
                  : 'transparent'
              }`,
              opacity: readOnly ? 0.5 : 1,
              transition: 'background 120ms ease, border-color 120ms ease',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              dangerouslySetInnerHTML={{__html: icon.svg}}
            />
          </button>
        )
      })}
    </div>
  )
}
