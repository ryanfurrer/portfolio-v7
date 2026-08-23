import { GITHUB_URL } from "./flavors";

const RAW_CHANGELOG_URL =
  "https://raw.githubusercontent.com/ryanfurrer/hearth-theme";

export const CHANGELOG_URL = `${GITHUB_URL}/blob/main/CHANGELOG.md`;

export interface HearthChangelogGroup {
  title: string;
  items: string[];
}

export interface HearthRelease {
  version: string;
  date?: string;
  groups: HearthChangelogGroup[];
}

function plainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

export function parseHearthChangelog(markdown: string): HearthRelease[] {
  const releases: HearthRelease[] = [];
  let release: HearthRelease | undefined;
  let group: HearthChangelogGroup | undefined;

  for (const rawLine of markdown.split("\n")) {
    const line = rawLine.trim();
    const releaseMatch = line.match(
      /^## \[([^\]]+)\](?:\s+[—-]\s+(\d{4}-\d{2}-\d{2}))?$/,
    );

    if (releaseMatch) {
      if (release && release.version !== "Unreleased") releases.push(release);
      release = {
        version: releaseMatch[1],
        date: releaseMatch[2],
        groups: [],
      };
      group = undefined;
      continue;
    }

    if (!release) continue;

    const groupMatch = line.match(/^### (.+)$/);
    if (groupMatch) {
      group = { title: plainText(groupMatch[1]), items: [] };
      release.groups.push(group);
      continue;
    }

    const itemMatch = line.match(/^- (.+)$/);
    if (itemMatch && group) {
      group.items.push(plainText(itemMatch[1]));
      continue;
    }

    if (line && group?.items.length) {
      const last = group.items.length - 1;
      group.items[last] = `${group.items[last]} ${plainText(line)}`;
    }
  }

  if (release && release.version !== "Unreleased") releases.push(release);
  return releases;
}

export async function fetchHearthChangelog(
  version?: string,
): Promise<HearthRelease[]> {
  const refs = version ? [`v${version.replace(/^v/, "")}`, "main"] : ["main"];

  for (const ref of refs) {
    try {
      const response = await fetch(`${RAW_CHANGELOG_URL}/${ref}/CHANGELOG.md`);
      if (!response.ok) continue;
      const releases = parseHearthChangelog(await response.text());
      if (releases.length) return releases.slice(0, 3);
    } catch {
      // A missing changelog should not prevent the rest of the landing page
      // from building. The component keeps a link to the full file as fallback.
    }
  }

  return [];
}
