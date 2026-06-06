import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col font-sans">
      <header className="px-5 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors">
            <ArrowLeft size={20} className="text-slate-700" />
          </Link>
          <h1 className="text-lg font-bold text-slate-900">免責事項</h1>
        </div>
      </header>

      <main className="flex-1 p-5">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. 情報の正確性について</h2>
              <p>
                当サイトのコンテンツや情報につきまして、可能な限り正確な情報を掲載するよう努めておりますが、必ずしも正確性・信頼性等を保証するものではありません。ゲームのパッチ更新等により、情報が古くなっている場合もございます。
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. 損害等の責任について</h2>
              <p>
                当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
                また、当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. 著作権等の帰属</h2>
              <p>
                当サイトは非公式のファンサイトです。当サイトで掲載しているゲームの画像や動画、キャラクター名等の著作権・肖像権等は、Riot Games, Inc. または各権利所有者に帰属します。
                権利を侵害する目的は一切ございません。記事の内容や掲載画像等に問題がございましたら、各権利所有者様本人がお問い合わせ窓口よりご連絡ください。確認後、迅速に対応させていただきます。
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
