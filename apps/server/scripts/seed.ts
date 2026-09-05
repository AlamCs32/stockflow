import { AppDataSource, initializeDatabase } from '../src/database/data-source';
import { User } from '../src/entities/user.entity';
import { Category } from '../src/entities/category.entity';
import { Supplier, SupplierCategory, AvailabilityStatus } from '../src/entities/supplier.entity';
import { Design } from '../src/entities/design.entity';
import { ProductVariant } from '../src/entities/product-variant.entity';
import { ChannelPricing, SalesChannel } from '../src/entities/channel-pricing.entity';
import { StockLog, StockLogReason } from '../src/entities/stock-log.entity';
import { buildSku } from '../src/services/sku.service';
import { calculateMargin } from '../src/services/pricing.service';
import { hash } from '@node-rs/bcrypt';
import { Role } from '../src/entities/auth/role.entity';
import { Module } from '../src/entities/auth/module.entity';
import { UserRole } from '../src/entities/auth/user-role.entity';
import { RolePermission } from '../src/entities/auth/role-permission.entity';

async function seed() {
  await initializeDatabase();

  const userRepo = AppDataSource.getRepository(User);
  const categoryRepo = AppDataSource.getRepository(Category);
  const supplierRepo = AppDataSource.getRepository(Supplier);
  const designRepo = AppDataSource.getRepository(Design);
  const variantRepo = AppDataSource.getRepository(ProductVariant);
  const pricingRepo = AppDataSource.getRepository(ChannelPricing);
  const stockLogRepo = AppDataSource.getRepository(StockLog);
  const roleRepo = AppDataSource.getRepository(Role);
  const moduleRepo = AppDataSource.getRepository(Module);
  const userRoleRepo = AppDataSource.getRepository(UserRole);
  const rolePermissionRepo = AppDataSource.getRepository(RolePermission);

  const passwordHash = await hash('password123', 12);
  const user = await userRepo.save(
    userRepo.create({
      email: 'admin@example.com',
      passwordHash,
      fullName: 'Admin',
    })
  );

  const modules = await moduleRepo.save([
    moduleRepo.create({ key: 'catalog', name: 'Catalog' }),
    moduleRepo.create({ key: 'inventory', name: 'Inventory' }),
    moduleRepo.create({ key: 'supplier', name: 'Supplier' }),
    moduleRepo.create({ key: 'orders', name: 'Orders' }),
  ]);

  const adminRole = await roleRepo.save(roleRepo.create({ name: 'Admin' }));

  await userRoleRepo.save(userRoleRepo.create({ userId: user.id, roleId: adminRole.id }));

  for (const mod of modules) {
    await rolePermissionRepo.save(
      rolePermissionRepo.create({
        roleId: adminRole.id,
        moduleId: mod.id,
        canRead: true,
        canWrite: true,
        canUpdate: true,
        canDelete: true,
      })
    );
  }

  const kurti = await categoryRepo.save(
    categoryRepo.create({
      name: 'Kurti',
      code: 'KRT',
      attributesSchema: [
        { name: 'fabricType', label: 'Fabric Type', type: 'select', required: true, options: ['Cotton', 'Silk', 'Rayon', 'Georgette', 'Chiffon', 'Linen'] },
        { name: 'pattern', label: 'Pattern', type: 'select', required: true, options: ['Floral', 'Geometric', 'Abstract', 'Solid', 'Printed', 'Embroidered'] },
        { name: 'sizeRange', label: 'Size Range', type: 'select', required: true, options: ['XS-XL', 'S-XXL', 'M-3XL', 'Free Size'] },
        { name: 'occasion', label: 'Occasion', type: 'select', required: false, options: ['Casual', 'Party', 'Office', 'Festive', 'Wedding'] },
        { name: 'workType', label: 'Work Type', type: 'select', required: false, options: ['Print', 'Embroidery', 'Thread Work', 'Sequins', 'Mirror Work', 'None'] },
        { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Describe the kurti design...' },
      ],
    })
  );

  await categoryRepo.save(
    categoryRepo.create({
      name: 'Bag',
      code: 'BAG',
      attributesSchema: [
        { name: 'material', label: 'Material', type: 'select', required: true, options: ['Leather', 'Canvas', 'Nylon', 'Polyester', 'Jute', 'Denim'] },
        { name: 'bagType', label: 'Bag Type', type: 'select', required: true, options: ['Tote', 'Backpack', 'Clutch', 'Shoulder', 'Crossbody', 'Duffel', 'Messenger'] },
        { name: 'capacity', label: 'Capacity (Litres)', type: 'number', required: false, placeholder: 'e.g. 20' },
        { name: 'compartments', label: 'Compartments', type: 'number', required: false, placeholder: 'e.g. 3' },
        { name: 'hasStrap', label: 'Adjustable Strap', type: 'select', required: false, options: ['Yes', 'No'] },
        { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Describe the bag...' },
      ],
    })
  );

  await categoryRepo.save(
    categoryRepo.create({
      name: 'Electronics',
      code: 'ELC',
      attributesSchema: [
        { name: 'brand', label: 'Brand', type: 'text', required: true, placeholder: 'e.g. Samsung' },
        { name: 'warranty', label: 'Warranty (months)', type: 'number', required: true, placeholder: 'e.g. 12' },
        { name: 'voltage', label: 'Voltage', type: 'text', required: false, placeholder: 'e.g. 220V' },
        { name: 'connectivity', label: 'Connectivity', type: 'select', required: false, options: ['WiFi', 'Bluetooth', 'USB-C', 'Wired', 'NFC'] },
        { name: 'color', label: 'Color', type: 'text', required: false, placeholder: 'e.g. Black' },
        { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Describe the product...' },
      ],
    })
  );

  const supplier = await supplierRepo.save(
    supplierRepo.create({
      code: 'S001',
      name: 'Jaipur Textiles',
      contactEmail: 'sales@jaipurtextiles.in',
      mobileNo: '9876543210',
      category: SupplierCategory.GARMENT,
      trustScore: 85,
      qualityScore: 90,
      availabilityStatus: AvailabilityStatus.ALWAYS_AVAILABLE,
      leadTimeDays: 7,
      address: '123 Textile Market, Pink City',
      city: 'Jaipur',
      state: 'Rajasthan',
      gstNumber: '08AAACB1234F1Z5',
      panNumber: 'AAACB1234F',
    })
  );

  const design = await designRepo.save(
    designRepo.create({
      designCode: 'D001',
      patternCode: 'PAT-BLK-FLR',
      name: 'Floral Print Anarkali Kurti',
      supplierId: supplier.id,
      categoryId: kurti.id,
      categoryAttributes: {
        fabricType: 'Cotton',
        pattern: 'Floral',
        sizeRange: 'S-XXL',
        occasion: 'Casual',
        workType: 'Print',
        description: 'Beautiful floral print anarkali kurti in cotton',
      },
    })
  );

  const costPrice = 130;
  const sku = buildSku({
    supplierId: supplier.code,
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
    `Seed completed: 1 user, 1 admin role, ${modules.length} modules, 3 categories, 1 supplier, 1 design, 1 variant (${sku}), 3 channel pricings`
  );
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
