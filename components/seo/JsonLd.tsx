/**
 * Renders one or more JSON-LD structured-data objects as a
 * `<script type="application/ld+json">`. Server component — no client JS.
 * The `<` escape guards against breaking out of the script tag.
 */

type JsonLdObject = Record<string, unknown>;

export default function JsonLd({data}: {data: JsonLdObject | JsonLdObject[]}) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: json}}
    />
  );
}
