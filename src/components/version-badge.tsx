// Small, unobtrusive build-SHA chip in the bottom-right of every page.
// Lets support ask users "what version do you see?" and immediately know
// whether they're on a stale cached bundle. select-all on the text means
// one click selects the whole hash for copy/paste.
export function VersionBadge() {
  const sha = process.env.NEXT_PUBLIC_BUILD_SHA
  if (!sha || sha === 'dev') return null
  return (
    <div
      aria-hidden="true"
      className="fixed bottom-2 right-2 z-10 select-all rounded-sm bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/60 backdrop-blur-sm"
      title="Build version"
    >
      v{sha}
    </div>
  )
}
