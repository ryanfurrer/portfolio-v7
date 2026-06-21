export function formatFollowerCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

export function getColorClasses(color: string): string {
  const colorMap: Record<string, string> = {
    zinc: "bg-zinc-500/10 text-zinc-950  dark:text-zinc-50 dark:bg-zinc-500/20 border-zinc-500/50 dark:border-zinc-400/50",
    blue: "bg-blue-500/10 text-blue-950 ring-blue-500/50! dark:text-blue-50 dark:bg-blue-500/20 border-blue-500/50 dark:border-blue-400/50",
    violet:
      "bg-violet-500/10 text-violet-950 dark:text-violet-50 ring-violet-500/50! dark:bg-violet-500/20 border-violet-500/50 dark:border-violet-400/50",
    rose: "bg-rose-500/10 text-rose-950 dark:text-rose-50 ring-rose-500/50! dark:bg-rose-500/20 border-rose-500/50 dark:border-rose-400/50",
    slate:
      "bg-slate-500/10 text-slate-950 dark:text-slate-50 ring-slate-500/50! dark:bg-slate-500/20 border-slate-500/50 dark:border-slate-400/50",
    sky: "bg-sky-500/10 text-sky-950 dark:text-sky-50 ring-sky-500/50! dark:bg-sky-500/20 border-sky-500/50 dark:border-sky-400/50",
  };
  return colorMap[color] || colorMap.zinc;
}
