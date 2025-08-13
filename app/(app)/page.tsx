import MenuPro from "@/components/menu/MenuPro";

async function getData() {
  const menuRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/menu`,
    { cache: "no-store" }
  );
  if (!menuRes.ok) throw new Error("Failed to load menu");
  return { menu: await menuRes.json() };
}

export default async function Home() {
  const { menu } = await getData();
  return <MenuPro menu={menu} toppings={menu} />;
}
