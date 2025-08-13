"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type MenuItemDTO = {
  item_id: number;
  name: string;
  price: number;
  img: string | null;
};
type ToppingDTO = { id: number; name: string; price: number };

export default function MenuPro({
  menu,
  toppings,
}: {
  menu: MenuItemDTO[];
  toppings: ToppingDTO[];
}) {
  /* ---------- filters ---------- */
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const mapCat = (n: string) =>
    /espresso/i.test(n)
      ? "Espresso"
      : /cappuccino/i.test(n)
      ? "Cappuccino"
      : /latte/i.test(n)
      ? "Latte"
      : /mocha/i.test(n)
      ? "Mocha"
      : /macchiato/i.test(n)
      ? "Macchiato"
      : /matcha|tea/i.test(n)
      ? "Tea"
      : /cold brew/i.test(n)
      ? "Cold Brew"
      : "Coffee";
  const categories = useMemo(() => {
    const set = new Set(["All"]);
    menu.forEach((m) => set.add(mapCat(m.name)));
    return [...set];
  }, [menu]);
  const filtered = useMemo(
    () =>
      menu
        .filter((m) => (cat === "All" ? true : mapCat(m.name) === cat))
        .filter((m) => m.name.toLowerCase().includes(query.toLowerCase())),
    [menu, cat, query]
  );

  /* ---------- cart ---------- */
  type Line = {
    key: string;
    item_id: number;
    name: string;
    basePrice: number;
    qty: number;
    toppingIds: number[];
    toppingPrice: number;
    img: string | null;
  };
  const [cart, setCart] = useState<Line[]>([]);
  const keyOf = (id: number, tops: number[]) =>
    `${id}|${tops
      .slice()
      .sort((a, b) => a - b)
      .join(",")}`;
  const add = (m: MenuItemDTO, tops: number[] = []) => {
    const tp = tops.reduce(
      (s, id) => s + (toppings.find((t) => t.id === id)?.price ?? 0),
      0
    );
    const k = keyOf(m.item_id, tops);
    setCart((p) => {
      const f = p.find((x) => x.key === k);
      return f
        ? p.map((x) => (x.key === k ? { ...x, qty: x.qty + 1 } : x))
        : [
            ...p,
            {
              key: k,
              item_id: m.item_id,
              name: m.name,
              basePrice: m.price,
              qty: 1,
              toppingIds: tops,
              toppingPrice: tp,
              img: m.img,
            },
          ];
    });
  };
  const inc = (k: string) =>
    setCart((p) => p.map((x) => (x.key === k ? { ...x, qty: x.qty + 1 } : x)));
  const dec = (k: string) =>
    setCart((p) =>
      p
        .map((x) => (x.key === k ? { ...x, qty: x.qty - 1 } : x))
        .filter((x) => x.qty > 0)
    );
  const clear = () => setCart([]);
  const subtotal = useMemo(
    () => cart.reduce((s, l) => s + (l.basePrice + l.toppingPrice) * l.qty, 0),
    [cart]
  );
  const discount = 0,
    tax = 0,
    total = subtotal - discount + tax;
  const fmt = (n: number) =>
    new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    }).format(n);
  const oat = toppings.find((t) => /oat|plant/i.test(t.name));

  /* bottom sheet state (mobile) */
  const [sheet, setSheet] = useState(false);

  async function checkout() {
    if (!cart.length) return;
    const payload = {
      items: cart.map((c) => ({
        item_id: c.item_id,
        qty: c.qty,
        toppings: c.toppingIds,
      })),
    };
    const r = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) return alert("Create order failed");
    const d = await r.json();
    window.location.href = `/order/${d.order_id}`;
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
      {/* Main */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Coffee</h1>
          <div className="relative w-full sm:w-[520px]">
            <input
              className="input"
              placeholder="Search for coffee, food etc"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" />
                <path d="M20 20l-3-3" stroke="currentColor" />
              </svg>
            </span>
          </div>

          {/* Mobile: floating cart button */}
          <button
            className="fab xl:hidden"
            onClick={() => setSheet(true)}
            aria-label="Open cart"
          >
            <span className="text-sm font-semibold">
              {cart.reduce((n, c) => n + c.qty, 0) || 0}
            </span>
          </button>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`chip ${cat === c ? "chip-active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid: mobile = 2 columns */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((m) => (
            <article
              key={m.item_id}
              className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
                {m.img ? (
                  <Image
                    src={m.img}
                    alt={m.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-gray-400">
                    No image
                  </div>
                )}
                <button
                  onClick={() => add(m)}
                  className="absolute right-2 top-2 rounded-full bg-amber-500 p-2 text-white shadow-md"
                  title="Quick add"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6h14l-2 8H8L6 6Z" stroke="currentColor" />
                    <circle cx="9" cy="20" r="1.5" fill="currentColor" />
                    <circle cx="18" cy="20" r="1.5" fill="currentColor" />
                  </svg>
                </button>
              </div>
              <div className="mt-2 flex items-start justify-between">
                <div className="font-medium">{m.name}</div>
                <div className="text-sm text-gray-700">{fmt(m.price)}</div>
              </div>
              <div className="mt-1 text-xs text-gray-500">Add plant milk</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Cup />
                  <Cup className="opacity-70" />
                  <Cup className="opacity-60" />
                  <Cup className="opacity-50" />
                </div>
                <button
                  onClick={() => add(m, oat ? [oat.id] : [])}
                  className="rounded-full border px-2 py-1 text-xs hover:bg-gray-50"
                >
                  + Add
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Desktop cart: sticky with correct offset */}
      <aside
        className="card hidden h-fit xl:sticky xl:block"
        style={{ top: "calc(var(--nav-h) + 20px)" }}
      >
        <CartBlock
          {...{
            cart,
            inc,
            dec,
            subtotal,
            discount,
            tax,
            total,
            clear,
            checkout,
            fmt,
          }}
        />
      </aside>

      {/* Mobile cart bottom sheet */}
      <div className={`${sheet ? "sheet-open" : "sheet-closed"}`}>
        <div className="sheet-backdrop" onClick={() => setSheet(false)} />
        <aside className="sheet-panel xl:hidden">
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-semibold">Your Cart</div>
              <button
                onClick={() => setSheet(false)}
                className="rounded-lg px-3 py-1 text-sm ring-1 ring-black/10 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <CartBlock
              {...{
                cart,
                inc,
                dec,
                subtotal,
                discount,
                tax,
                total,
                clear,
                checkout,
                fmt,
              }}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

/* Shared cart block */
function CartBlock(props: any) {
  const {
    cart,
    inc,
    dec,
    subtotal,
    discount,
    tax,
    total,
    clear,
    checkout,
    fmt,
  } = props;
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="font-semibold">Order #2000</div>
        <button onClick={clear} className="text-xs text-gray-500 underline">
          Clear All
        </button>
      </div>
      <ul className="divide-y">
        {cart.map((l: any) => (
          <li
            key={l.key}
            className="py-3 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-black/5">
                {l.img ? (
                  <img src={l.img} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div>
                <div className="text-sm font-medium">{l.name}</div>
                <div className="text-xs text-gray-500">{fmt(l.basePrice)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dec(l.key)}
                className="rounded-full ring-1 ring-black/10 px-2"
              >
                −
              </button>
              <span className="w-5 text-center">{l.qty}</span>
              <button
                onClick={() => inc(l.key)}
                className="rounded-full ring-1 ring-black/10 px-2"
              >
                +
              </button>
            </div>
          </li>
        ))}
        {!cart.length && (
          <li className="py-6 text-center text-sm text-gray-500">
            Your cart is empty
          </li>
        )}
      </ul>
      <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm">
        <Row label="Subtotal" value={fmt(subtotal)} />
        <Row label="Discount sales" value={fmt(discount)} />
        <Row label="Tax" value={fmt(tax)} />
        <div className="mt-2 border-t pt-2 text-base font-semibold flex items-center justify-between">
          <span>Total</span>
          <span>{fmt(total)}</span>
        </div>
      </div>
      <button
        disabled={!cart.length}
        onClick={checkout}
        className="mt-3 w-full btn-primary disabled:opacity-50"
      >
        Print bills
      </button>
    </>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}
function Cup({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M6 7h9v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V7h2Z"
        stroke="currentColor"
      />
      <path d="M15 9h2a2 2 0 0 1 0 4h-2" stroke="currentColor" />
    </svg>
  );
}
