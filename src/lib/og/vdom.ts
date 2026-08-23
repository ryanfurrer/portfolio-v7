/** Minimal hyperscript so we can build Satori's VDOM without JSX in a .ts file. */
export type Node = { type: string; props: Record<string, unknown> };

export const h = (
  type: string,
  props: Record<string, unknown> = {},
  ...children: Array<Node | string>
): Node => ({
  type,
  props: { ...props, children: children.length === 1 ? children[0] : children },
});
