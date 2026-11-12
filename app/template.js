// Re-mounts on every navigation, so each new page fades in. Opacity only —
// a transform here would turn the pages' fixed bars and lightboxes into
// children of this box while it animates.
export default function Template({ children }) {
  return <div className="page-in">{children}</div>;
}
