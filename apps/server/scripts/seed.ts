import { AppDataSource, initializeDatabase } from '../src/database/data-source';
import { User } from '../src/entities/user.entity';
import { Category } from '../src/entities/category.entity';
import { Item } from '../src/entities/item.entity';
import { Vendor } from '../src/entities/vendor.entity';
import { Design } from '../src/entities/design.entity';
import { ProductVariant } from '../src/entities/product-variant.entity';
import { ChannelPricing, SalesChannel } from '../src/entities/channel-pricing.entity';
import { StockLog, StockLogReason } from '../src/entities/stock-log.entity';
import { buildSku } from '../src/services/sku.service';
import { calculateMargin } from '../src/services/pricing.service';

async function seed() {
  await initializeDatabase();

  const userRepo = AppDataSource.getRepository(User);
  const categoryRepo = AppDataSource.getRepository(Category);
  const itemRepo = AppDataSource.getRepository(Item);
  const vendorRepo = AppDataSource.getRepository(Vendor);
  const designRepo = AppDataSource.getRepository(Design);
  const variantRepo = AppDataSource.getRepository(ProductVariant);
  const pricingRepo = AppDataSource.getRepository(ChannelPricing);
  const stockLogRepo = AppDataSource.getRepository(StockLog);

  const user = await userRepo.save(
    userRepo.create({ email: 'admin@example.com', password: 'password123', name: 'Admin' })
  );

  const electronics = await categoryRepo.save(categoryRepo.create({ name: 'Electronics', code: 'ELE' }));
  const furniture = await categoryRepo.save(categoryRepo.create({ name: 'Furniture', code: 'FUR' }));
  const kurti = await categoryRepo.save(categoryRepo.create({ name: 'Kurti', code: 'KRT' }));

  await itemRepo.save([
    itemRepo.create({ name: 'Laptop', userId: user.id, categoryId: electronics.id }),
    itemRepo.create({ name: 'Desk', userId: user.id, categoryId: furniture.id }),
    itemRepo.create({ name: 'Monitor', userId: user.id, categoryId: electronics.id }),
  ]);

  const vendor = await vendorRepo.save(
    vendorRepo.create({ id: 'V001', name: 'Jaipur Textiles', contactEmail: 'sales@jaipurtextiles.in' })
  );

  const design = await designRepo.save(
    designRepo.create({
      designCode: 'D001',
      patternCode: 'PAT-BLK-FLR',
      name: 'Floral Print Anarkali Kurti',
      vendorId: vendor.id,
      categoryId: kurti.id,
    })
  );

  const costPrice = 130;
  const sku = buildSku({
    vendorId: vendor.id,
    categoryCode: kurti.code,
    designCode: design.designCode,
    costPrice,
    colorCode: 'BLK',
    size: 'XL',
  });

  const variant = await variantRepo.save(
    variantRepo.create({
      sku,
      colorName: 'Black',
      colorCode: 'BLK',
      size: 'XL',
      costPrice,
      stockQuantity: 50,
      status: 'ACTIVE',
      designId: design.id,
    })
  );

  await stockLogRepo.save(
    stockLogRepo.create({
      variantId: variant.id,
      quantityChange: 50,
      reason: StockLogReason.INWARD,
      channel: null,
    })
  );

  const channelPrices: Array<[SalesChannel, number]> = [
    [SalesChannel.MEESHO, 399],
    [SalesChannel.FLIPKART, 449],
    [SalesChannel.AMAZON, 459],
  ];

  for (const [channelName, sellingPrice] of channelPrices) {
    await pricingRepo.save(
      pricingRepo.create({
        variantId: variant.id,
        channelName,
        sellingPrice,
        margin: calculateMargin(sellingPrice, costPrice),
      })
    );
  }

  console.log(
    `Seed completed: 1 user, 3 categories, 3 items, 1 vendor, 1 design, 1 variant (${sku}), 3 channel pricings`
  );
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
