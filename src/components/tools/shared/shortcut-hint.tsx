export function ShortcutHint({ children }: { children: string }) {
  return (
    <kbd className="pointer-events-none ml-1 hidden rounded border border-primary-foreground/30 px-1 font-mono text-[0.7rem] opacity-70 sm:inline-block">
      {children}
    </kbd>
  );
}
