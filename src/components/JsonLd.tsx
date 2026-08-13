/**
 * 構造化データを <script type="application/ld+json"> として埋め込む。
 * JSON.stringify した文字列に "</script>" が現れるとタグが閉じてしまうため、
 * "<" をエスケープしてから出力する。
 */
export default function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      // 構造化データはこちらで組み立てた値のみで、外部入力は含まない
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
