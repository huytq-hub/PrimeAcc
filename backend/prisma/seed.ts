import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL in environment');
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // Create account categories
  const streamingCategory = await prisma.accountCategory.upsert({
    where: { id: 'streaming-cat' },
    update: {},
    create: {
      id: 'streaming-cat',
      name: 'Streaming',
    },
  });

  const musicCategory = await prisma.accountCategory.upsert({
    where: { id: 'music-cat' },
    update: {},
    create: {
      id: 'music-cat',
      name: 'Music',
    },
  });

  const designCategory = await prisma.accountCategory.upsert({
    where: { id: 'design-cat' },
    update: {},
    create: {
      id: 'design-cat',
      name: 'Design',
    },
  });

  const aiCategory = await prisma.accountCategory.upsert({
    where: { id: 'ai-cat' },
    update: {},
    create: {
      id: 'ai-cat',
      name: 'AI Tools',
    },
  });

  console.log('✅ Categories created');

  // Create products
  const netflixProduct = await prisma.accountProduct.upsert({
    where: { id: 'netflix-1m' },
    update: {},
    create: {
      id: 'netflix-1m',
      name: 'Netflix Premium - 1 Month',
      description: 'Tài khoản Netflix Premium, xem 4K, 4 màn hình cùng lúc',
      price: 45000,
      categoryId: streamingCategory.id,
    },
  });

  const spotifyProduct = await prisma.accountProduct.upsert({
    where: { id: 'spotify-1y' },
    update: {},
    create: {
      id: 'spotify-1y',
      name: 'Spotify Premium Family - 1 Year',
      description: 'Spotify Premium Family, 6 tài khoản, không quảng cáo',
      price: 180000,
      categoryId: musicCategory.id,
    },
  });

  const canvaProduct = await prisma.accountProduct.upsert({
    where: { id: 'canva-pro' },
    update: {},
    create: {
      id: 'canva-pro',
      name: 'Canva Pro (Team Invite)',
      description: 'Canva Pro với đầy đủ tính năng, template premium',
      price: 25000,
      categoryId: designCategory.id,
    },
  });

  const chatgptProduct = await prisma.accountProduct.upsert({
    where: { id: 'chatgpt-plus' },
    update: {},
    create: {
      id: 'chatgpt-plus',
      name: 'ChatGPT Plus (Shared)',
      description: 'ChatGPT Plus với GPT-4, ưu tiên truy cập',
      price: 95000,
      categoryId: aiCategory.id,
    },
  });

  const youtubeProduct = await prisma.accountProduct.upsert({
    where: { id: 'youtube-premium' },
    update: {},
    create: {
      id: 'youtube-premium',
      name: 'Youtube Premium - No Ads',
      description: 'Youtube Premium, không quảng cáo, tải video offline',
      price: 35000,
      categoryId: streamingCategory.id,
    },
  });

  const adobeProduct = await prisma.accountProduct.upsert({
    where: { id: 'adobe-cc' },
    update: {},
    create: {
      id: 'adobe-cc',
      name: 'Adobe Creative Cloud',
      description: 'Adobe Creative Cloud All Apps, Photoshop, Illustrator, Premiere Pro',
      price: 120000,
      categoryId: designCategory.id,
    },
  });

  console.log('✅ Products created');

  // Create stock for each product
  const products = [
    { product: netflixProduct, count: 12 },
    { product: spotifyProduct, count: 5 },
    { product: canvaProduct, count: 48 },
    { product: chatgptProduct, count: 2 },
    { product: youtubeProduct, count: 24 },
    { product: adobeProduct, count: 8 },
  ];

  for (const { product, count } of products) {
    for (let i = 1; i <= count; i++) {
      await prisma.accountStock.upsert({
        where: { id: `${product.id}-stock-${i}` },
        update: {},
        create: {
          id: `${product.id}-stock-${i}`,
          productId: product.id,
          content: `user${i}@example.com|password${i}`,
          isSold: false,
        },
      });
    }
    console.log(`✅ Created ${count} stock items for ${product.name}`);
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
