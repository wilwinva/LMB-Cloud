export function formatLinkAsHTML(ds?: string | null) {
  return ds ? `${ds.replace(/\./g, '_').toLowerCase()}.html` : undefined;
}
