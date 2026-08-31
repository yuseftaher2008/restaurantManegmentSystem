import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcrypt";
import { Unit } from "../generated/prisma/enums";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const BCRYPT_SALT_ROUNDS = 10;

const categories = [
  { name: "Meals" },
  { name: "Sandwiches" },
  { name: "Dessert" },
  { name: "Drinks" },
];

const menuItems = [
  { name: "Grilled Chicken", categoryId: "Meals", price: 12.99, description: "Grilled chicken breast with herbs", image: "" },
  { name: "Beef Burger", categoryId: "Sandwiches", price: 9.99, description: "Classic beef burger with lettuce and tomato", image: "" },
  { name: "Caesar Salad", categoryId: "Meals", price: 8.49, description: "Fresh romaine lettuce with Caesar dressing", image: "" },
  { name: "Chocolate Cake", categoryId: "Dessert", price: 6.99, description: "Rich chocolate layer cake", image: "" },
  { name: "Iced Tea", categoryId: "Drinks", price: 3.49, description: "Refreshing iced tea with lemon", image: "" },
  { name: "French Fries", categoryId: "Meals", price: 4.99, description: "Crispy golden french fries", image: "" },
  { name: "Club Sandwich", categoryId: "Sandwiches", price: 10.99, description: "Triple-decker club sandwich", image: "" },
  { name: "Ice Cream Sundae", categoryId: "Dessert", price: 5.49, description: "Vanilla ice cream with toppings", image: "" },
  { name: "Coffee", categoryId: "Drinks", price: 2.99, description: "Freshly brewed coffee", image: "" },
  { name: "Pasta Carbonara", categoryId: "Meals", price: 11.99, description: "Creamy pasta with bacon and parmesan", image: "" },
];

const ingredients: { name: string; unit: Unit; quantity: number; minimumQuantity: number }[] = [
  { name: "Chicken Breast", unit: "KG", quantity: 20, minimumQuantity: 5 },
  { name: "Ground Beef", unit: "KG", quantity: 15, minimumQuantity: 5 },
  { name: "Romaine Lettuce", unit: "KG", quantity: 10, minimumQuantity: 3 },
  { name: "Tomato", unit: "KG", quantity: 12, minimumQuantity: 4 },
  { name: "Bread", unit: "PIECE", quantity: 50, minimumQuantity: 10 },
  { name: "Rice", unit: "KG", quantity: 25, minimumQuantity: 5 },
  { name: "Pasta", unit: "KG", quantity: 15, minimumQuantity: 3 },
  { name: "Milk", unit: "L", quantity: 20, minimumQuantity: 5 },
  { name: "Eggs", unit: "PIECE", quantity: 100, minimumQuantity: 20 },
  { name: "Olive Oil", unit: "L", quantity: 10, minimumQuantity: 2 },
  { name: "Sugar", unit: "KG", quantity: 10, minimumQuantity: 2 },
  { name: "Flour", unit: "KG", quantity: 15, minimumQuantity: 3 },
  { name: "Butter", unit: "KG", quantity: 8, minimumQuantity: 2 },
  { name: "Cheese", unit: "KG", quantity: 12, minimumQuantity: 3 },
  { name: "Potatoes", unit: "KG", quantity: 30, minimumQuantity: 8 },
];

async function main() {
  console.log("Seeding database...\n");

  // Seed admin user
  const hashedPassword = await bcrypt.hash("admin123", BCRYPT_SALT_ROUNDS);
  await prisma.user.upsert({
    where: { email: "admin@restaurant.com" },
    update: {},
    create: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@restaurant.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("Seeded admin user: admin@restaurant.com / admin123");

  // Seed categories
  const categoryMap: Record<string, string> = {};
  for (const category of categories) {
    const existing = await prisma.category.findUnique({ where: { name: category.name } });
    if (existing) {
      categoryMap[category.name] = existing.id;
    } else {
      const created = await prisma.category.create({ data: category });
      categoryMap[category.name] = created.id;
      console.log(`Seeded category: ${category.name}`);
    }
  }

  // Seed menu items
  const menuItemMap: Record<string, string> = {};
  for (const item of menuItems) {
    const existing = await prisma.menuItem.findFirst({ where: { name: item.name } });
    if (existing) {
      menuItemMap[item.name] = existing.id;
    } else {
      const created = await prisma.menuItem.create({
        data: {
          name: item.name,
          categoryId: categoryMap[item.categoryId],
          price: item.price,
          description: item.description,
          image: item.image,
        },
      });
      menuItemMap[item.name] = created.id;
      console.log(`Seeded menu item: ${item.name}`);
    }
  }

  // Seed ingredients
  const ingredientMap: Record<string, string> = {};
  for (const ingredient of ingredients) {
    const existing = await prisma.ingredient.findFirst({ where: { name: ingredient.name } });
    if (existing) {
      ingredientMap[ingredient.name] = existing.id;
    } else {
      const created = await prisma.ingredient.create({ data: ingredient });
      ingredientMap[ingredient.name] = created.id;
      console.log(`Seeded ingredient: ${ingredient.name}`);
    }
  }

  // Seed menu-item-ingredient associations
  const associations = [
    { menuItem: "Grilled Chicken", ingredient: "Chicken Breast", quantityRequired: 200 },
    { menuItem: "Grilled Chicken", ingredient: "Olive Oil", quantityRequired: 30 },
    { menuItem: "Grilled Chicken", ingredient: "Romaine Lettuce", quantityRequired: 100 },
    { menuItem: "Beef Burger", ingredient: "Ground Beef", quantityRequired: 180 },
    { menuItem: "Beef Burger", ingredient: "Bread", quantityRequired: 1 },
    { menuItem: "Beef Burger", ingredient: "Tomato", quantityRequired: 50 },
    { menuItem: "Beef Burger", ingredient: "Cheese", quantityRequired: 30 },
    { menuItem: "Caesar Salad", ingredient: "Romaine Lettuce", quantityRequired: 150 },
    { menuItem: "Caesar Salad", ingredient: "Olive Oil", quantityRequired: 20 },
    { menuItem: "Chocolate Cake", ingredient: "Flour", quantityRequired: 200 },
    { menuItem: "Chocolate Cake", ingredient: "Sugar", quantityRequired: 150 },
    { menuItem: "Chocolate Cake", ingredient: "Eggs", quantityRequired: 3 },
    { menuItem: "Chocolate Cake", ingredient: "Butter", quantityRequired: 100 },
    { menuItem: "French Fries", ingredient: "Potatoes", quantityRequired: 200 },
    { menuItem: "French Fries", ingredient: "Olive Oil", quantityRequired: 50 },
    { menuItem: "Club Sandwich", ingredient: "Bread", quantityRequired: 3 },
    { menuItem: "Club Sandwich", ingredient: "Chicken Breast", quantityRequired: 100 },
    { menuItem: "Club Sandwich", ingredient: "Tomato", quantityRequired: 30 },
    { menuItem: "Pasta Carbonara", ingredient: "Pasta", quantityRequired: 200 },
    { menuItem: "Pasta Carbonara", ingredient: "Cheese", quantityRequired: 50 },
    { menuItem: "Pasta Carbonara", ingredient: "Eggs", quantityRequired: 2 },
  ];

  for (const assoc of associations) {
    const existing = await prisma.menuItemIngredient.findUnique({
      where: {
        menuItemId_ingredientId: {
          menuItemId: menuItemMap[assoc.menuItem],
          ingredientId: ingredientMap[assoc.ingredient],
        },
      },
    });
    if (!existing) {
      await prisma.menuItemIngredient.create({
        data: {
          menuItemId: menuItemMap[assoc.menuItem],
          ingredientId: ingredientMap[assoc.ingredient],
          quantityRequired: assoc.quantityRequired,
        },
      });
      console.log(`Seeded association: ${assoc.menuItem} <-> ${assoc.ingredient}`);
    }
  }

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
