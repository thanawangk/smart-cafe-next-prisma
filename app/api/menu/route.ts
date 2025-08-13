import prisma from "@/lib/prisma";
import { respond } from "@/lib/zod";
import { MenuListResponse } from "@/schemas/menu";

export async function GET() {
  const rows = await prisma.menuItem.findMany({ orderBy: { id: "asc" } });
  const payload = rows.map((m) => ({
    item_id: m.id,
    name: m.name,
    price: m.price,
    img: m.img ?? null,
  }));
  return respond(MenuListResponse, payload);
}
