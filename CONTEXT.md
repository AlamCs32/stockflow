# StockFlow

Multi-channel e-commerce inventory management for Indian marketplaces. Tracks designs, variants, stock levels, and pricing across Meesho, Flipkart, and Amazon.

## Language

### Products

**Item**:
A top-level product listing that groups related designs under a single name. Currently has no direct relationship to Design—this is a known gap.
_Avoid_: Product, listing, SKU

**Design**:
A specific pattern or style identified by a unique design code. Each design belongs to one supplier and category, and can have multiple variants (sizes, colors).
_Avoid_: Pattern, style, collection

**ProductVariant**:
A sellable unit identified by a unique SKU. Combines design, color, size, and cost price. Tracks stock quantity and channel-specific pricing.
_Avoid_: SKU, variant, size

**Category**:
A product classification (e.g., Saree, Kurta, Dress). Both Items and Designs belong to categories.
_Avoid_: Type, group, classification

### Supply Chain

**Supplier**:
A vendor who provides designs. Identified by a unique code and contact email.
_Avoid_: Vendor, manufacturer, partner

### Sales Channels

**SalesChannel**:
A marketplace where products are sold. Each channel has its own pricing and margin for each variant.
_Avoid_: Platform, marketplace

**ChannelPricing**:
The selling price and profit margin for a specific variant on a specific sales channel.
_Avoid_: Price, pricing rule, margin config

### Inventory

**StockLog**:
A record of stock movement for a variant. Captures quantity change, reason, and optional channel reference.
_Avoid_: Stock movement, inventory log, transaction

**StockLogReason**:
The cause of a stock movement. One of: Inward (received stock), Sale (sold), Return (customer return), Adjustment (manual correction).
_Avoid*: Movement type, transaction type

### Authentication

**User**:
A person with access to the system. Has email, password, and optional roles.
_Avoid*: Account, admin, person

**Role**:
A named set of permissions (e.g., Admin, Manager, Viewer). Users can have multiple roles.
_Avoid*: Permission group, access level

**RefreshToken**:
A long-lived token used to obtain new access tokens without re-authentication.
_Avoid*: Session, token

## Open Questions

1. **Item ↔ Design relationship**: Item has no foreign key to Design. Should an Item contain multiple Designs? Or are Item and Design the same concept at different abstraction levels?
2. **Category ownership**: Both Item and Design have their own category_id. Should they share the same category, or can an Item's category differ from its Designs' categories?
