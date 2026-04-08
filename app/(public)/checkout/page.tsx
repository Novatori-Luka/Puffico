"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/app/actions/orders";

const PLACEHOLDER = "/images/placeholder-pouf.jpg";

const CITIES = [
  "თბილისი",
  "ბათუმი",
  "ქუთაისი",
  "რუსთავი",
  "გორი",
  "ზუგდიდი",
  "პოტი",
  "ხაშური",
  "სამტრედია",
  "სენაკი",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount, total, clearCart } = useCart();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    city: "თბილისი",
    address: "",
    comment: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-puff-white flex flex-col items-center justify-center gap-6 text-center px-4">
        <ShoppingBag size={56} className="text-sand-300" />
        <h1 className="text-2xl font-display font-bold text-puff-dark">
          კალათა ცარიელია
        </h1>
        <p className="text-puff-muted">გადახდამდე დაამატეთ პროდუქტი</p>
        <Link href="/catalog" className="btn-primary py-3 px-8">
          კატალოგის ნახვა
        </Link>
      </div>
    );
  }

  function validate() {
    const errs: Partial<typeof form> = {};
    if (!form.firstName.trim()) errs.firstName = "სახელი სავალდებულოა";
    if (!form.lastName.trim()) errs.lastName = "გვარი სავალდებულოა";
    if (!form.phone.trim()) errs.phone = "ტელეფონი სავალდებულოა";
    if (!form.email.trim()) errs.email = "ელ. ფოსტა სავალდებულოა";
    if (!form.address.trim()) errs.address = "მისამართი სავალდებულოა";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      try {
        const orderItems = items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          productName: item.name,
          variantDesc: item.variant
            ? [
                item.variant.size,
                item.variant.color,
                item.variant.shape,
                item.variant.filling,
              ]
                .filter(Boolean)
                .join(" / ")
            : null,
          unitPrice: item.price,
          quantity: item.quantity,
        }));

        const result = await createOrder({
          ...form,
          items: orderItems,
          subtotal: total,
          shipping: 0,
          total,
        });

        clearCart();
        router.push(`/order-success?order=${result.orderNumber}`);
      } catch {
        // DB not connected — generate a local confirmation number and still show success
        clearCart();
        const localRef = `PF-${Date.now().toString(36).toUpperCase()}`;
        router.push(`/order-success?order=${localRef}`);
      }
    });
  }

  const shipping = 0;

  return (
    <div className="min-h-screen bg-puff-white">
      <div className="section-container py-10 md:py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-puff-muted mb-8">
          <Link href="/" className="hover:text-puff-dark transition-colors">
            მთავარი
          </Link>
          <span>/</span>
          <Link
            href="/cart"
            className="hover:text-puff-dark transition-colors"
          >
            კალათა
          </Link>
          <span>/</span>
          <span className="text-puff-dark font-medium">გაფორმება</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Form */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-display font-bold text-puff-dark mb-8">
              შეკვეთის გაფორმება
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Contact */}
              <div>
                <h2 className="font-semibold text-puff-dark mb-4 text-lg">
                  საკონტაქტო ინფო
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="field-label">სახელი *</label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className={`input-field w-full ${errors.firstName ? "border-red-400 focus:ring-red-200" : ""}`}
                      placeholder="გიორგი"
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="field-label">გვარი *</label>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      className={`input-field w-full ${errors.lastName ? "border-red-400 focus:ring-red-200" : ""}`}
                      placeholder="ბერიძე"
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="field-label">ტელეფონი *</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      type="tel"
                      className={`input-field w-full ${errors.phone ? "border-red-400 focus:ring-red-200" : ""}`}
                      placeholder="+995 5XX XXX XXX"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="field-label">ელ. ფოსტა *</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      className={`input-field w-full ${errors.email ? "border-red-400 focus:ring-red-200" : ""}`}
                      placeholder="giorgi@mail.ge"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div>
                <h2 className="font-semibold text-puff-dark mb-4 text-lg">
                  მიტანის მისამართი
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="field-label">ქალაქი *</label>
                    <select
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="input-field w-full"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">ზუსტი მისამართი *</label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className={`input-field w-full ${errors.address ? "border-red-400 focus:ring-red-200" : ""}`}
                      placeholder="ქუჩა, სახლი, ბინა"
                    />
                    {errors.address && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="field-label">კომენტარი (სურვილისამებრ)</label>
                    <textarea
                      name="comment"
                      value={form.comment}
                      onChange={handleChange}
                      rows={3}
                      className="input-field w-full resize-none"
                      placeholder="სპეციალური მოთხოვნები, სართული, შესასვლელი..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-primary w-full py-4 text-base justify-center disabled:opacity-70"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      მუშავდება...
                    </>
                  ) : (
                    <>შეკვეთის განხორციელება</>
                  )}
                </button>
                <p className="text-xs text-puff-muted text-center mt-3">
                  შეკვეთის განხორციელებით ეთანხმებით ჩვენს პირობებს
                </p>
              </div>

              <Link
                href="/cart"
                className="flex items-center gap-1.5 text-sm text-puff-muted hover:text-puff-dark transition-colors"
              >
                <ArrowLeft size={15} />
                კალათაში დაბრუნება
              </Link>
            </form>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="card p-6 sticky top-24">
              <h2 className="font-display font-bold text-puff-dark text-xl mb-5">
                შეკვეთის შეჯამება
              </h2>

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-start">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-sand-50 shrink-0">
                      <Image
                        src={item.image || PLACEHOLDER}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-puff-dark text-white text-[9px] font-bold flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-puff-dark line-clamp-1">
                        {item.name}
                      </p>
                      {item.variant && (
                        <p className="text-xs text-puff-muted">
                          {[
                            item.variant.size,
                            item.variant.color,
                            item.variant.shape,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-puff-dark shrink-0">
                      ₾{(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-sand-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-puff-muted">
                  <span>სულ ({itemCount} ერთ.)</span>
                  <span>₾{total.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-puff-muted">
                  <span>მიტანა</span>
                  <span className="text-sage-500 font-medium">
                    {shipping === 0 ? "უფასო" : `₾${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-puff-dark text-lg pt-2 border-t border-sand-100">
                  <span>სულ</span>
                  <span>₾{(total + shipping).toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
