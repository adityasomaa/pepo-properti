/**
 * The running band under the headline.
 *
 * It carries facts, not adjectives: the four regencies the business works in
 * and the disciplines it covers. A band that scrolls slogans past the reader
 * would be decoration; this one is the answer to "where, and what".
 *
 * Accessibility. The strip is duplicated so the loop has no seam, and the
 * duplicate is hidden from assistive technology, so the list is announced once.
 * The animation pauses on hover and on keyboard focus, and stops entirely under
 * prefers-reduced-motion, where the band becomes an ordinary scrollable row.
 * The separators are drawn as elements, never as typed glyphs.
 */
export function Ticker({ items, label }: { items: readonly string[]; label: string }) {
  const group = (hidden: boolean) => (
    <ul className="ticker__group" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="ticker__item">
          <span>{item}</span>
          <span aria-hidden="true" className="ticker__dot" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="ticker" role="group" aria-label={label}>
      <div className="ticker__track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
