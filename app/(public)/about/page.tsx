import Link from "next/link";
import Image from "next/image";
import { Leaf, MapPin, Heart, Award, ArrowRight } from "lucide-react";

export const metadata = {
  title: "ჩვენს შესახებ — Puffico",
  description: "Puffico — ქართული ბრენდი, რომელიც ბუნებრივი მასალებით ხელნაკეთ პუფებს ქმნის",
};

const VALUES = [
  {
    icon: Leaf,
    title: "ბუნებრივი მასალები",
    desc: "ვიყენებთ მხოლოდ სერტიფიცირებულ ბუნებრივ ბოჭკოებს — ლინენს, ბამბასა და ეკო-მატყლს.",
  },
  {
    icon: Heart,
    title: "ხელნაკეთი სიყვარულით",
    desc: "ყოველი პუფი კეთდება ხელით, ყოველი ნაკერი შემოწმდება. ეს არ არის სერიული წარმოება.",
  },
  {
    icon: MapPin,
    title: "ადგილობრივი წარმოება",
    desc: "სახელოსნო თბილისში, საქართველოში. ვემსახურებით ადგილობრივ ეკონომიკასა და ოსტატებს.",
  },
  {
    icon: Award,
    title: "ხარისხის გარანტია",
    desc: "1 წლიანი გარანტია ყველა პუფზე. ისეთი პროდუქტი, რომელსაც ათი წელი გაუძლებს.",
  },
];

const TEAM = [
  {
    name: "მარიამ გელაშვილი",
    role: "დამფუძნებელი & მთავარი დიზაინერი",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  },
  {
    name: "გიორგი ბერიძე",
    role: "მთავარი ოსტატი",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  },
  {
    name: "ნინო კვარაცხელია",
    role: "ქსოვილის სპეციალისტი",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-puff-white">
      {/* Hero */}
      <section className="relative bg-puff-dark text-cream-100 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400"
            alt="Puffico სახელოსნო"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="section-container py-20 md:py-28 relative">
          <p className="text-sm font-medium text-earth-300 mb-3 uppercase tracking-widest">
            ჩვენს შესახებ
          </p>
          <h1 className="text-4xl md:text-6xl font-display font-bold max-w-2xl leading-tight mb-6">
            ყოველი პუფი — ერთი ისტორია
          </h1>
          <p className="text-cream-300 max-w-xl text-lg leading-relaxed">
            Puffico დაარსდა 2022 წელს ერთი მარტივი რწმენით: სახლი უნდა ასახავდეს
            ადამიანს, ვინც ცხოვრობს. ჩვენ ვქმნით პუფებს, რომლებიც ათწლეულობით
            გრძელდება.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold text-puff-dark mb-5">
              ჩვენი ისტორია
            </h2>
            <div className="space-y-4 text-puff-muted leading-relaxed">
              <p>
                ყველაფერი დაიწყო ერთი კითხვით: რატომ არ შეიძლება ხელნაკეთი ნივთი
                იყოს ხელმისაწვდომი? Puffico-ს დამფუძნებელმა მარიამმა გაიარა
                ტრადიციული ქართული სახელოსნოების გზა და შეიძინა ოსტატობა, რომელიც
                დღეს ყოველ პუფში ჩანს.
              </p>
              <p>
                2022 წელს გაიხსნა პირველი სახელოსნო — პატარა ოთახი ძველ თბილისში,
                სადაც 3 ადამიანი მუშაობდა. დღეს ჩვენ ვართ 6-კაციანი გუნდი,
                რომელმაც 500-ზე მეტი ოჯახი მოამარაგა Puffico-ს ნივთებით.
              </p>
              <p>
                ყოველი ჩვენი პუფი — ეს არის ვინმეს ოჯახის ნაწილი. ეს გვაძლევს
                ენერგიას ყოველ დღე კარგად ვიმუშაოთ.
              </p>
            </div>
          </div>
          <div className="relative h-80 md:h-[420px] rounded-3xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700"
              alt="Puffico სახელოსნო"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream-50 border-y border-sand-100">
        <div className="section-container py-16 md:py-20">
          <h2 className="text-3xl font-display font-bold text-puff-dark text-center mb-12">
            ჩვენი ღირებულებები
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="card p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-earth-50 flex items-center justify-center mx-auto mb-4">
                    <Icon size={22} className="text-earth-500" />
                  </div>
                  <h3 className="font-semibold text-puff-dark mb-2">{v.title}</h3>
                  <p className="text-sm text-puff-muted leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-container py-16 md:py-20">
        <h2 className="text-3xl font-display font-bold text-puff-dark text-center mb-12">
          ჩვენი გუნდი
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {TEAM.map((member) => (
            <div key={member.name} className="text-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 bg-sand-100">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
              <h3 className="font-semibold text-puff-dark">{member.name}</h3>
              <p className="text-sm text-puff-muted mt-0.5">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-earth-400 text-white">
        <div className="section-container py-14 text-center">
          <h2 className="text-3xl font-display font-bold mb-3">
            გაიცანით Puffico სახელოსნო
          </h2>
          <p className="text-earth-100 mb-6 max-w-md mx-auto">
            გვეწვიეთ პირადად ან დაათვალიერეთ ჩვენი კოლექცია ონლაინ
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/catalog"
              className="bg-white text-earth-600 font-semibold px-6 py-3 rounded-2xl hover:bg-cream-100 transition-colors flex items-center gap-2"
            >
              კოლექცია
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/gallery"
              className="border border-white/40 text-white px-6 py-3 rounded-2xl hover:bg-white/10 transition-colors"
            >
              გალერეა
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
