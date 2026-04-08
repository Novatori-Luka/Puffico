import Link from "next/link";
import { CheckCircle, ArrowRight, Home } from "lucide-react";

interface PageProps {
  searchParams: { order?: string };
}

export default function OrderSuccessPage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 py-16">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-sage-50 flex items-center justify-center">
            <CheckCircle size={48} className="text-sage-500" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold text-puff-dark">
            შეკვეთა განხორციელდა!
          </h1>
          {searchParams.order && (
            <p className="text-puff-muted text-sm">
              შეკვეთის ნომერი:{" "}
              <span className="font-semibold text-puff-dark font-mono">
                {searchParams.order}
              </span>
            </p>
          )}
        </div>

        {/* Message */}
        <div className="bg-puff-white rounded-2xl p-5 text-left space-y-3 shadow-soft">
          <p className="text-sm font-semibold text-puff-dark">რა ხდება შემდეგ?</p>
          <ul className="space-y-2 text-sm text-puff-muted">
            <li className="flex gap-2">
              <span className="text-earth-400 font-bold shrink-0">1.</span>
              ჩვენი გუნდი 24 საათის განმავლობაში დაგიკავშირდებათ შეკვეთის დასადასტურებლად
            </li>
            <li className="flex gap-2">
              <span className="text-earth-400 font-bold shrink-0">2.</span>
              მიტანა განხორციელდება 3–5 სამუშაო დღეში
            </li>
            <li className="flex gap-2">
              <span className="text-earth-400 font-bold shrink-0">3.</span>
              გადახდა ხდება მიტანის დროს
            </li>
          </ul>
        </div>

        {/* CTAs */}
        <div className="space-y-3 pt-2">
          <Link
            href="/catalog"
            className="btn-primary w-full py-3.5 justify-center"
          >
            კატალოგზე დაბრუნება
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/"
            className="btn-ghost w-full py-2.5 justify-center text-sm"
          >
            <Home size={15} />
            მთავარ გვერდზე
          </Link>
        </div>
      </div>
    </div>
  );
}
