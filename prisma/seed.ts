import { PrismaClient, Prisma } from "../app/generated/prisma";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    email: "barista@smartcafe.local",
    name: "Barista",
    password: "barista@123",
    role: "barista",
  },
];

const menuData: Prisma.MenuItemCreateInput[] = [
  { name: "Espresso", price: 55, img: "/images/espresso.jpg" },
  { name: "Americano", price: 60, img: "/images/americano.jpg" },
  { name: "Latte", price: 65, img: "/images/latte.jpg" },
  { name: "Cappuccino", price: 65, img: "/images/cappuccino.jpg" },
  { name: "Mocha", price: 70, img: "/images/mocha.jpg" },
  { name: "Matcha Latte", price: 75, img: "/images/matcha.jpg" },
  { name: "Thai Tea", price: 55, img: "/images/thaitea.jpg" },
  { name: "Lemon Tea", price: 50, img: "/images/lemontea.jpg" },
  { name: "Caramel Macchiato", price: 75, img: "/images/caramel.jpg" },
  { name: "Chocolate", price: 60, img: "/images/chocolate.jpg" },
  { name: "Milo", price: 70, img: "/images/milo.jpg" },
  { name: "Milk", price: 70, img: "/images/milk.jpg" },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }

  for (const m of menuData) {
    await prisma.menuItem.create({ data: m });
  }
}

main();
