import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data (optional - for development)
  // await prisma.orderItem.deleteMany();
  // await prisma.order.deleteMany();
  // await prisma.rating.deleteMany();
  // await prisma.menu.deleteMany();
  // await prisma.category.deleteMany();
  // await prisma.user.deleteMany();

  // 1. Create users (using simple password for development)
  const customer = await prisma.user.create({
    data: {
      name: "Customer One",
      email: "customer1@example.com",
      password: "password123", // In production, use proper hashing
      role: "customer",
    },
  });

  const kasir = await prisma.user.create({
    data: {
      name: "Cashier One",
      email: "cashier1@example.com",
      password: "password123",
      role: "cashier",
    },
  });

  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    },
  });

  console.log("✅ Users created");

  // 2. Create categories
  const mainDishCategory = await prisma.category.create({
    data: {
      name: "Main Dish",
      desc: "Delicious main course dishes",
    },
  });

  const beverageCategory = await prisma.category.create({
    data: {
      name: "Beverages",
      desc: "Fresh drinks and beverages",
    },
  });

  const dessertCategory = await prisma.category.create({
    data: {
      name: "Desserts",
      desc: "Sweet treats and desserts",
    },
  });

  console.log("✅ Categories created");

  // 3. Create menu items with real Unsplash images
  const menu1 = await prisma.menu.create({
    data: {
      name: "Nasi Goreng Spesial",
      desc: "Nasi goreng dengan telur, ayam, dan kerupuk",
      price: 25000,
      category_id: mainDishCategory.id,
      is_available: true,
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop&crop=center",
    },
  });

  const menu2 = await prisma.menu.create({
    data: {
      name: "Mie Ayam Bakso",
      desc: "Mie ayam dengan tambahan bakso sapi",
      price: 20000,
      category_id: mainDishCategory.id,
      is_available: true,
      image:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&crop=center",
    },
  });

  await prisma.menu.create({
    data: {
      name: "Ayam Bakar",
      desc: "Ayam bakar bumbu kecap dengan nasi dan lalapan",
      price: 28000,
      category_id: mainDishCategory.id,
      is_available: false, // Test unavailable item
      image:
        "https://images.unsplash.com/photo-1598514983318-2f64c8946d4a?w=400&h=300&fit=crop&crop=center",
    },
  });

  const menu4 = await prisma.menu.create({
    data: {
      name: "Rendang Daging",
      desc: "Rendang daging sapi dengan bumbu rempah tradisional",
      price: 35000,
      category_id: mainDishCategory.id,
      is_available: true,
      image:
        "https://images.unsplash.com/photo-1565895405229-71bec9b7bb90?w=400&h=300&fit=crop&crop=center",
    },
  });

  const drink1 = await prisma.menu.create({
    data: {
      name: "Es Teh Manis",
      desc: "Es teh manis segar",
      price: 5000,
      category_id: beverageCategory.id,
      is_available: true,
      image:
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&crop=center",
    },
  });

  const drink2 = await prisma.menu.create({
    data: {
      name: "Jus Jeruk",
      desc: "Jus jeruk segar tanpa gula tambahan",
      price: 12000,
      category_id: beverageCategory.id,
      is_available: true,
      image:
        "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop&crop=center",
    },
  });

  const drink3 = await prisma.menu.create({
    data: {
      name: "Es Kelapa Muda",
      desc: "Es kelapa muda segar langsung dari buahnya",
      price: 15000,
      category_id: beverageCategory.id,
      is_available: true,
      image:
        "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop&crop=center",
    },
  });

  await prisma.menu.create({
    data: {
      name: "Es Krim Vanilla",
      desc: "Es krim vanilla dengan topping coklat",
      price: 15000,
      category_id: dessertCategory.id,
      is_available: true,
      image:
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop&crop=center",
    },
  });

  const dessert2 = await prisma.menu.create({
    data: {
      name: "Pisang Goreng",
      desc: "Pisang goreng crispy dengan madu",
      price: 10000,
      category_id: dessertCategory.id,
      is_available: true,
      image:
        "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400&h=300&fit=crop&crop=center",
    },
  });

  console.log("✅ Menu items created");

  // 4. Create sample orders with different statuses
  await prisma.order.create({
    data: {
      customer_id: customer.id,
      kasir_id: kasir.id,
      table_number: 5,
      order_status: "pending",
      payment_status: "pending",
      total_amount: 45000,
      order_time: new Date(),
      order_items: {
        create: [
          {
            menu_id: menu1.id,
            price: menu1.price,
            quantity: 1,
            subtotal: menu1.price * 1,
          },
          {
            menu_id: menu2.id,
            price: menu2.price,
            quantity: 1,
            subtotal: menu2.price * 1,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      customer_id: customer.id,
      kasir_id: kasir.id,
      table_number: 3,
      order_status: "cooking",
      payment_status: "paid",
      total_amount: 43000,
      order_time: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      order_items: {
        create: [
          {
            menu_id: menu4.id,
            price: menu4.price,
            quantity: 1,
            subtotal: menu4.price * 1,
            customization: "Tidak pedas",
          },
          {
            menu_id: drink1.id,
            price: drink1.price,
            quantity: 1,
            subtotal: drink1.price * 1,
          },
          {
            menu_id: drink3.id,
            price: drink3.price,
            quantity: 1,
            subtotal: drink3.price * 1,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      customer_id: customer.id,
      kasir_id: kasir.id,
      table_number: 7,
      order_status: "ready",
      payment_status: "paid",
      total_amount: 42000,
      order_time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      order_items: {
        create: [
          {
            menu_id: menu2.id,
            price: menu2.price,
            quantity: 1,
            subtotal: menu2.price * 1,
          },
          {
            menu_id: drink2.id,
            price: drink2.price,
            quantity: 1,
            subtotal: drink2.price * 1,
          },
          {
            menu_id: dessert2.id,
            price: dessert2.price,
            quantity: 1,
            subtotal: dessert2.price * 1,
          },
        ],
      },
    },
  });

  // Additional pending order for testing
  await prisma.order.create({
    data: {
      customer_id: customer.id,
      kasir_id: kasir.id,
      table_number: 2,
      order_status: "pending",
      payment_status: "pending",
      total_amount: 50000,
      order_time: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      order_items: {
        create: [
          {
            menu_id: menu4.id,
            price: menu4.price,
            quantity: 1,
            subtotal: menu4.price * 1,
          },
          {
            menu_id: dessert2.id,
            price: dessert2.price,
            quantity: 1,
            subtotal: dessert2.price * 1,
          },
          {
            menu_id: drink1.id,
            price: drink1.price,
            quantity: 1,
            subtotal: drink1.price * 1,
          },
        ],
      },
    },
  });

  console.log("✅ Orders created");

  // 5. Create sample ratings
  await prisma.rating.create({
    data: {
      customer_id: customer.id,
      menu_id: menu1.id,
      rating: 5,
      review: "Nasi gorengnya enak banget! Porsi juga besar.",
    },
  });

  await prisma.rating.create({
    data: {
      customer_id: customer.id,
      menu_id: menu2.id,
      rating: 4,
      review: "Mie ayamnya mantap, tapi baksonya agak kecil.",
    },
  });

  await prisma.rating.create({
    data: {
      customer_id: customer.id,
      menu_id: menu4.id,
      rating: 5,
      review: "Rendangnya otentik banget! Bumbu meresap sempurna.",
    },
  });

  await prisma.rating.create({
    data: {
      customer_id: customer.id,
      menu_id: drink2.id,
      rating: 4,
      review: "Jus jeruknya segar, tidak terlalu asam.",
    },
  });

  console.log("✅ Ratings created");

  // 6. Summary
  const userCount = await prisma.user.count();
  const categoryCount = await prisma.category.count();
  const menuCount = await prisma.menu.count();
  const orderCount = await prisma.order.count();
  const ratingCount = await prisma.rating.count();

  console.log("\n📊 Seed Summary:");
  console.log(`👥 Users: ${userCount}`);
  console.log(`📂 Categories: ${categoryCount}`);
  console.log(`🍽️  Menu Items: ${menuCount}`);
  console.log(`📋 Orders: ${orderCount}`);
  console.log(`⭐ Ratings: ${ratingCount}`);

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
