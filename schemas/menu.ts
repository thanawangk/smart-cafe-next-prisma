import { z } from "zod";

const RelativePath = z.string().regex(/^\/(?!\/).+$/, "Must start with /");

export const MenuItemDTO = z.object({
  item_id: z.number().int().positive(),
  name: z.string().min(1),
  price: z.number().int().nonnegative(),
  img: z.union([z.string().url(), RelativePath]).nullable(),
});

export const MenuListResponse = z.array(MenuItemDTO);
