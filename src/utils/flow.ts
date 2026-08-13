export type FlowSegment = {
  text: string;
  type: 'step' | 'pipe' | 'sync';
};

/**
 * Splits a "checkout → Xendit → webhook" style flow string into segments,
 * tagging → (pipe) and ⇄ (sync) glyphs so callers can color-code them.
 */
export function parseFlow(flow: string): FlowSegment[] {
  return flow
    .split(/(→|⇄)/)
    .filter(Boolean)
    .map((part) => ({
      text: part,
      type: part === '→' ? 'pipe' : part === '⇄' ? 'sync' : 'step',
    }));
}
