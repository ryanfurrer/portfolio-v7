import {
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  Flex,
  Stack,
  Text,
  TextArea,
  useToast,
} from "@sanity/ui";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  PatchEvent,
  set,
  type ArraySchemaType,
  type FormPatch,
  type ObjectInputProps,
} from "sanity";
import {
  markdownToPortableText,
  type MarkdownFrontmatter,
} from "../lib/markdownToPortableText";

type PostValue = {
  body?: unknown[];
  title?: string;
  description?: string;
  slug?: { current?: string };
  publishedAt?: string;
  [key: string]: unknown;
};

function frontmatterPatches(frontmatter: MarkdownFrontmatter): FormPatch[] {
  const patches: FormPatch[] = [];

  if (frontmatter.title) patches.push(set(frontmatter.title, ["title"]));
  if (frontmatter.description)
    patches.push(set(frontmatter.description, ["description"]));
  if (frontmatter.slug) {
    patches.push(set({ _type: "slug", current: frontmatter.slug }, ["slug"]));
  }
  if (frontmatter.publishedAt) {
    patches.push(set(frontmatter.publishedAt, ["publishedAt"]));
  }

  return patches;
}

export function MarkdownPostInput(props: ObjectInputProps<PostValue>) {
  const { onChange, readOnly, renderDefault, schemaType, value } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [applyFrontmatter, setApplyFrontmatter] = useState(true);
  const [error, setError] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const bodySchemaType = useMemo(
    () =>
      schemaType.fields.find((field) => field.name === "body")?.type as
        ArraySchemaType | undefined,
    [schemaType.fields],
  );
  const hasBody = Array.isArray(value?.body) && value.body.length > 0;

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setError(undefined);
  }, []);

  const handleFile = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.[0];
      event.currentTarget.value = "";
      if (!file) return;

      try {
        setMarkdown(await file.text());
        setError(undefined);
      } catch {
        setError(
          "That file could not be read. Try pasting its Markdown instead.",
        );
      }
    },
    [],
  );

  const importMarkdown = useCallback(
    (mode: "append" | "replace") => {
      if (!bodySchemaType) {
        setError("The Body schema could not be loaded.");
        return;
      }

      if (!markdown.trim()) {
        setError("Paste Markdown or choose a Markdown file first.");
        return;
      }

      try {
        const result = markdownToPortableText(markdown, bodySchemaType);

        if (result.blocks.length === 0) {
          setError("No body content was found in that Markdown.");
          return;
        }

        const existingBody = Array.isArray(value?.body) ? value.body : [];
        const nextBody =
          mode === "append"
            ? [...existingBody, ...result.blocks]
            : result.blocks;
        const patches: FormPatch[] = [set(nextBody, ["body"])];

        if (applyFrontmatter)
          patches.push(...frontmatterPatches(result.frontmatter));

        onChange(PatchEvent.from(patches));
        closeDialog();
        setMarkdown("");

        toast.push({
          status: result.warnings.length > 0 ? "warning" : "success",
          title: mode === "append" ? "Markdown appended" : "Markdown imported",
          description:
            result.warnings.length > 0
              ? result.warnings.join(" ")
              : "Review the converted Body, then publish when it looks right.",
          duration: 8000,
        });
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "The Markdown could not be imported.",
        );
      }
    },
    [
      applyFrontmatter,
      bodySchemaType,
      closeDialog,
      markdown,
      onChange,
      toast,
      value?.body,
    ],
  );

  return (
    <Stack gap={4}>
      <Card border padding={3} radius={2} tone="transparent">
        <Flex align="center" gap={3} justify="space-between" wrap="wrap">
          <Stack gap={2} style={{ maxWidth: 560 }}>
            <Text size={1} weight="semibold">
              Write locally in Markdown
            </Text>
            <Text muted size={1}>
              Import a .md file or paste Markdown. It becomes editable Portable
              Text and keeps this site’s existing rich-content blocks available.
            </Text>
          </Stack>
          <Button
            disabled={readOnly || !bodySchemaType}
            mode="ghost"
            onClick={() => setDialogOpen(true)}
            text="Import Markdown"
            tone="primary"
          />
        </Flex>
      </Card>

      {renderDefault(props)}

      {dialogOpen && (
        <Dialog
          footer={
            <Flex gap={2} justify="flex-end" padding={3} wrap="wrap">
              <Button mode="bleed" onClick={closeDialog} text="Cancel" />
              {hasBody && (
                <Button
                  disabled={!markdown.trim()}
                  mode="ghost"
                  onClick={() => importMarkdown("append")}
                  text="Append to body"
                />
              )}
              <Button
                disabled={!markdown.trim()}
                onClick={() => importMarkdown("replace")}
                text={hasBody ? "Replace body" : "Import Markdown"}
                tone={hasBody ? "critical" : "primary"}
              />
            </Flex>
          }
          header="Import Markdown"
          id="markdown-post-import"
          onClose={closeDialog}
          width={2}
        >
          <Box padding={4}>
            <Stack gap={4}>
              <Stack gap={2}>
                <Text size={1} weight="semibold">
                  Markdown source
                </Text>
                <Text muted size={1}>
                  Standard headings, emphasis, links, lists, blockquotes, inline
                  code, and fenced code blocks are converted automatically.
                </Text>
              </Stack>

              <Box>
                <input
                  ref={fileInputRef}
                  accept=".md,.markdown,text/markdown,text/plain"
                  hidden
                  onChange={handleFile}
                  type="file"
                />
                <Button
                  mode="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  text="Choose Markdown file"
                />
              </Box>

              <TextArea
                aria-label="Markdown source"
                onChange={(event) => {
                  setMarkdown(event.currentTarget.value);
                  setError(undefined);
                }}
                placeholder={
                  "---\ntitle: My post\nslug: my-post\n---\n\n## Start writing…"
                }
                rows={18}
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                }}
                value={markdown}
              />

              <Card border padding={3} radius={2}>
                <Flex align="flex-start" gap={3}>
                  <Checkbox
                    checked={applyFrontmatter}
                    id="apply-markdown-frontmatter"
                    onChange={(event) =>
                      setApplyFrontmatter(event.currentTarget.checked)
                    }
                  />
                  <Stack
                    as="label"
                    gap={2}
                    htmlFor="apply-markdown-frontmatter"
                  >
                    <Text size={1} weight="semibold">
                      Apply YAML frontmatter
                    </Text>
                    <Text muted size={1}>
                      Updates title, description (or excerpt/summary), slug, and
                      publishedAt (or date) when those values are present. Other
                      fields stay unchanged.
                    </Text>
                  </Stack>
                </Flex>
              </Card>

              {hasBody && (
                <Card padding={3} radius={2} tone="caution">
                  <Text size={1}>
                    This post already has Body content. Append keeps it; Replace
                    overwrites it in the draft. Sanity’s normal undo and review
                    workflow still applies.
                  </Text>
                </Card>
              )}

              {error && (
                <Card padding={3} radius={2} tone="critical">
                  <Text size={1}>{error}</Text>
                </Card>
              )}
            </Stack>
          </Box>
        </Dialog>
      )}
    </Stack>
  );
}
