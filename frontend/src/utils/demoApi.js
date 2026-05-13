import { API_ENDPOINTS } from "@/config";
import { ROLES } from "@/constants";

const nowIso = () => new Date().toISOString();

const clone = (value) => JSON.parse(JSON.stringify(value));

const createEnvelope = (data, message = "Demo response") => ({
  success: true,
  message,
  data,
  timestamp: nowIso(),
});

const createResponse = (config, data, message = "Demo response", status = 200) =>
  Promise.resolve({
    data: createEnvelope(data, message),
    status,
    statusText: "OK",
    headers: {},
    config,
    request: { demo: true },
  });

const createBlobResponse = (config, label) =>
  Promise.resolve({
    data: new Blob([label], { type: "text/plain" }),
    status: 200,
    statusText: "OK",
    headers: {},
    config,
    request: { demo: true },
  });

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const paginate = (items, params = {}) => {
  const page = toNumber(params.page, 0);
  const size = Math.max(toNumber(params.size, items.length || 10), 1);
  const start = page * size;
  const content = items.slice(start, start + size);

  return {
    content,
    number: page,
    size,
    totalElements: items.length,
    totalPages: Math.max(Math.ceil(items.length / size), 1),
    first: page === 0,
    last: start + size >= items.length,
  };
};

const demoBranches = [
  {
    id: 1,
    name: "Main Branch",
    branchName: "Main Branch",
    code: "MB-001",
    address: "123 Main Street",
    city: "Demo City",
    state: "Demo State",
    phone: "044-12345678",
    gstNumber: "DEMO-GST-0001",
    active: true,
  },
  {
    id: 2,
    name: "City Branch",
    branchName: "City Branch",
    code: "CB-002",
    address: "77 Central Avenue",
    city: "Demo City",
    state: "Demo State",
    phone: "044-23456789",
    gstNumber: "DEMO-GST-0002",
    active: true,
  },
];

const demoUser = {
  id: 1,
  username: "demo.admin",
  firstName: "Demo",
  lastName: "Admin",
  fullName: "Demo Admin",
  email: "demo@pharmacy.local",
  role: ROLES.SUPER_ADMIN,
  branchId: 1,
  branchName: "Main Branch",
  status: "ACTIVE",
};

const demoCategories = [
  { id: 1, name: "Tablets", status: "ACTIVE" },
  { id: 2, name: "Syrups", status: "ACTIVE" },
  { id: 3, name: "Supplements", status: "ACTIVE" },
];

const demoUnits = [
  { id: 1, name: "Strip", code: "STRIP" },
  { id: 2, name: "Bottle", code: "BOTTLE" },
  { id: 3, name: "Box", code: "BOX" },
];

const demoProducts = [
  {
    id: 101,
    productId: 101,
    productName: "Paracetamol 500mg",
    brandName: "Acme Pharma",
    genericName: "Paracetamol",
    barcode: "890100000101",
    categoryId: 1,
    categoryName: "Tablets",
    unitName: "Strip",
    purchasePrice: 12,
    sellingPrice: 18,
    mrp: 20,
    status: "ACTIVE",
    description: "Pain relief and fever reducer",
  },
  {
    id: 102,
    productId: 102,
    productName: "Amoxicillin 250mg",
    brandName: "Acme Pharma",
    genericName: "Amoxicillin",
    barcode: "890100000102",
    categoryId: 1,
    categoryName: "Tablets",
    unitName: "Strip",
    purchasePrice: 28,
    sellingPrice: 42,
    mrp: 45,
    status: "ACTIVE",
    description: "Antibiotic capsule",
  },
  {
    id: 103,
    productId: 103,
    productName: "Cough Syrup 100ml",
    brandName: "HealWell",
    genericName: "Dextromethorphan",
    barcode: "890100000103",
    categoryId: 2,
    categoryName: "Syrups",
    unitName: "Bottle",
    purchasePrice: 36,
    sellingPrice: 58,
    mrp: 60,
    status: "ACTIVE",
    description: "Relief from dry cough",
  },
  {
    id: 104,
    productId: 104,
    productName: "Vitamin C 500mg",
    brandName: "NutriCare",
    genericName: "Ascorbic Acid",
    barcode: "890100000104",
    categoryId: 3,
    categoryName: "Supplements",
    unitName: "Box",
    purchasePrice: 55,
    sellingPrice: 82,
    mrp: 90,
    status: "ACTIVE",
    description: "Daily vitamin supplement",
  },
  {
    id: 105,
    productId: 105,
    productName: "Antacid Suspension 170ml",
    brandName: "HealWell",
    genericName: "Antacid",
    barcode: "890100000105",
    categoryId: 2,
    categoryName: "Syrups",
    unitName: "Bottle",
    purchasePrice: 30,
    sellingPrice: 49,
    mrp: 55,
    status: "ACTIVE",
    description: "Acidity and indigestion relief",
  },
  {
    id: 106,
    productId: 106,
    productName: "Multivitamin Capsules",
    brandName: "NutriCare",
    genericName: "Multivitamin",
    barcode: "890100000106",
    categoryId: 3,
    categoryName: "Supplements",
    unitName: "Box",
    purchasePrice: 68,
    sellingPrice: 96,
    mrp: 100,
    status: "ACTIVE",
    description: "General health supplement",
  },
];

let demoInventory = demoProducts.map((product, index) => ({
  id: 1000 + index,
  productId: product.productId,
  branchId: 1,
  quantityAvailable: 8 - index,
  quantityOnHand: 10 - index,
  unitCost: product.purchasePrice,
  sellingPrice: product.sellingPrice,
  batchId: 500 + index,
  batchNumber: `BATCH-${index + 1}`,
  expiryDate: new Date(Date.now() + (index + 3) * 86400000 * 30)
    .toISOString()
    .slice(0, 10),
  product: clone(product),
}));

let demoCustomers = [
  {
    id: 201,
    customerId: 201,
    name: "Walk-in Customer",
    phone: "",
    loyaltyPoints: 0,
    status: "ACTIVE",
  },
  {
    id: 202,
    customerId: 202,
    name: "Anita Rao",
    phone: "9000000001",
    loyaltyPoints: 120,
    status: "ACTIVE",
  },
  {
    id: 203,
    customerId: 203,
    name: "Rahul Sharma",
    phone: "9000000002",
    loyaltyPoints: 58,
    status: "ACTIVE",
  },
];

let demoSuppliers = [
  { id: 301, supplierId: 301, name: "Acme Distributors", phone: "044-5000101", status: "ACTIVE" },
  { id: 302, supplierId: 302, name: "Health Source", phone: "044-5000102", status: "ACTIVE" },
];

let demoSales = [
  {
    id: 401,
    saleId: 401,
    saleNumber: "SAL-20260513-001",
    invoiceNumber: "INV-20260513-001",
    branchId: 1,
    customer: demoCustomers[0],
    customerName: demoCustomers[0].name,
    paymentMethod: "CASH",
    saleDate: nowIso(),
    subtotal: 180,
    discountAmount: 0,
    totalAmount: 180,
    paidAmount: 200,
    items: [
      {
        id: 1,
        productId: 101,
        productName: "Paracetamol 500mg",
        quantity: 2,
        unitPrice: 18,
        totalAmount: 36,
      },
      {
        id: 2,
        productId: 103,
        productName: "Cough Syrup 100ml",
        quantity: 1,
        unitPrice: 58,
        totalAmount: 58,
      },
    ],
  },
];

const demoDashboard = {
  todaySales: 12450,
  todayTransactions: 42,
  todayCustomers: 31,
  todayProfit: 3620,
  totalProducts: demoProducts.length,
  totalCustomers: demoCustomers.length,
  lowStockCount: 2,
  expiringCount: 1,
  recentSales: demoSales,
  topProducts: demoProducts.slice(0, 3),
  salesChart: [
    { label: "Mon", value: 8200 },
    { label: "Tue", value: 9400 },
    { label: "Wed", value: 7600 },
    { label: "Thu", value: 11100 },
    { label: "Fri", value: 12450 },
  ],
};

const demoSuperAdminDashboard = {
  stats: [
    { title: "Branches", value: demoBranches.length },
    { title: "Users", value: 18 },
    { title: "Sales Today", value: "₹12.4K" },
    { title: "Low Stock", value: 2 },
  ],
  recentlyAddedUsers: 3,
  systemHealth: { uptime: "99.98%", apiStatus: "Healthy" },
  branchAnalytics: demoBranches.map((branch) => ({
    branchId: branch.id,
    branchName: branch.name,
    revenue: branch.id === 1 ? 12450 : 8420,
  })),
  businessMetrics: {
    revenueGrowth: 8.4,
    orderGrowth: 5.1,
  },
  inventoryOverview: {
    totalItems: demoInventory.length,
    lowStockItems: 2,
  },
  userStatistics: {
    activeUsers: 16,
    inactiveUsers: 2,
  },
  financialSummary: {
    revenue: 12450,
    expenses: 8720,
    profit: 3730,
  },
  recentActivities: [
    { id: 1, message: "Sale completed at Main Branch" },
    { id: 2, message: "New product added" },
  ],
};

const parseJson = (value) => {
  if (!value || typeof value !== "string") return value || {};
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const normalizePath = (url) => {
  const resolved = new URL(url, "http://demo.local");
  return resolved.pathname.replace(/\/$/, "") || "/";
};

const findById = (items, idField, id) =>
  items.find((item) => String(item[idField]) === String(id));

const applySearch = (items, query, fields = ["name"]) => {
  if (!query) return items;
  const normalized = query.toLowerCase();
  return items.filter((item) =>
    fields.some((field) => String(item[field] || "").toLowerCase().includes(normalized))
  );
};

const handleSalesCreate = (body) => {
  const items = Array.isArray(body.items) ? body.items : [];
  const saleId = 500 + demoSales.length;
  const saleNumber = `SAL-${Date.now()}`;
  const invoiceNumber = `INV-${Date.now()}`;
  const subtotal = items.reduce(
    (sum, item) => sum + toNumber(item.unitPrice) * toNumber(item.quantity, 1),
    0
  );
  const totalAmount = Math.max(subtotal - toNumber(body.discountAmount), 0);
  const paidAmount = toNumber(body.paidAmount, totalAmount);
  const sale = {
    id: saleId,
    saleId,
    saleNumber,
    invoiceNumber,
    branchId: body.branchId || 1,
    customer: body.customerId
      ? findById(demoCustomers, "id", body.customerId)
      : body.patientName
        ? { id: body.customerId || null, name: body.patientName }
        : null,
    paymentMethod: body.paymentMethod || "CASH",
    saleDate: nowIso(),
    subtotal,
    discountAmount: toNumber(body.discountAmount),
    totalAmount,
    paidAmount,
    items: items.map((item, index) => ({
      id: index + 1,
      productId: item.productId,
      productName: item.productName || `Product ${item.productId}`,
      quantity: toNumber(item.quantity, 1),
      unitPrice: toNumber(item.unitPrice, 0),
      totalAmount: toNumber(item.unitPrice, 0) * toNumber(item.quantity, 1),
    })),
  };

  demoSales.unshift(sale);
  demoInventory = demoInventory.map((inventoryItem) => {
    const soldItem = items.find(
      (item) => String(item.productId) === String(inventoryItem.productId)
    );
    if (!soldItem) return inventoryItem;

    return {
      ...inventoryItem,
      quantityAvailable: Math.max(
        inventoryItem.quantityAvailable - toNumber(soldItem.quantity, 1),
        0
      ),
      quantityOnHand: Math.max(
        inventoryItem.quantityOnHand - toNumber(soldItem.quantity, 1),
        0
      ),
    };
  });

  return sale;
};

const createDefaultList = (items, params = {}) => paginate(clone(items), params);

export const demoScanResult = (scanData, context, branchId) => {
  const matchedProduct =
    demoProducts.find(
      (product) =>
        product.barcode === scanData ||
        product.productName.toLowerCase().includes(String(scanData).toLowerCase())
    ) || demoProducts[0];

  const inventoryItem = demoInventory.find(
    (item) => String(item.productId) === String(matchedProduct.productId)
  );

  return {
    success: true,
    context,
    branchId: branchId || 1,
    productName: matchedProduct.productName,
    product: clone(matchedProduct),
    inventory: clone(inventoryItem),
    alerts: [],
  };
};

export const demoAdapter = async (config) => {
  const method = String(config.method || "get").toLowerCase();
  const pathname = normalizePath(config.url || "");
  const params = config.params || {};
  const body = parseJson(config.data);

  if (config.responseType === "blob") {
    return createBlobResponse(config, `Demo file for ${pathname}`);
  }

  if (pathname === API_ENDPOINTS.AUTH.LOGIN && method === "post") {
    return createResponse(
      config,
      {
        user: clone(demoUser),
        accessToken: "demo-access-token",
        refreshToken: "demo-refresh-token",
      },
      "Login successful"
    );
  }

  if (pathname === API_ENDPOINTS.AUTH.LOGOUT && method === "post") {
    return createResponse(config, null, "Logged out");
  }

  if (pathname === API_ENDPOINTS.AUTH.ME && method === "get") {
    return createResponse(config, clone(demoUser), "Current user");
  }

  if (pathname === API_ENDPOINTS.AUTH.REFRESH && method === "post") {
    return createResponse(
      config,
      {
        accessToken: "demo-access-token",
        refreshToken: "demo-refresh-token",
      },
      "Token refreshed"
    );
  }

  if (pathname.startsWith("/dashboard/super-admin")) {
    if (pathname.endsWith("/health")) {
      return createResponse(config, { status: "healthy" }, "Health check");
    }

    if (pathname.endsWith("/system-metrics")) {
      return createResponse(config, { uptime: "99.98%", apiStatus: "Healthy" });
    }

    if (pathname.endsWith("/branch-analytics")) {
      return createResponse(config, demoSuperAdminDashboard.branchAnalytics);
    }

    if (pathname.endsWith("/business-metrics")) {
      return createResponse(config, demoSuperAdminDashboard.businessMetrics);
    }

    if (pathname.endsWith("/inventory-overview")) {
      return createResponse(config, demoSuperAdminDashboard.inventoryOverview);
    }

    if (pathname.endsWith("/user-statistics")) {
      return createResponse(config, demoSuperAdminDashboard.userStatistics);
    }

    if (pathname.endsWith("/financial-summary")) {
      return createResponse(config, demoSuperAdminDashboard.financialSummary);
    }

    if (pathname.endsWith("/recent-activities")) {
      return createResponse(config, demoSuperAdminDashboard.recentActivities);
    }

    return createResponse(config, demoSuperAdminDashboard);
  }

  if (pathname.startsWith("/dashboard")) {
    if (pathname.endsWith("/sales-chart")) {
      return createResponse(config, demoDashboard.salesChart);
    }

    return createResponse(config, demoDashboard);
  }

  if (pathname.startsWith(API_ENDPOINTS.BRANCHES.BASE)) {
    if (method === "get") {
      if (pathname === API_ENDPOINTS.BRANCHES.ACTIVE || pathname === API_ENDPOINTS.BRANCHES.ALL) {
        return createResponse(config, createDefaultList(demoBranches, params));
      }

      const branchIdMatch = pathname.match(/\/branches\/(\d+)/);
      if (branchIdMatch) {
        const branch = findById(demoBranches, "id", branchIdMatch[1]) || demoBranches[0];
        return createResponse(config, clone(branch));
      }

      return createResponse(config, createDefaultList(demoBranches, params));
    }
  }

  if (pathname.startsWith(API_ENDPOINTS.CATEGORIES.BASE)) {
    return createResponse(config, createDefaultList(demoCategories, params));
  }

  if (pathname.startsWith(API_ENDPOINTS.UNITS.BASE)) {
    return createResponse(config, createDefaultList(demoUnits, params));
  }

  if (pathname.startsWith(API_ENDPOINTS.PRODUCTS.BASE)) {
    if (method === "get") {
      if (pathname === API_ENDPOINTS.PRODUCTS.SEARCH) {
        return createResponse(
          config,
          createDefaultList(
            applySearch(demoProducts, params.query || params.search || "", [
              "productName",
              "brandName",
              "genericName",
              "barcode",
            ]),
            params
          )
        );
      }

      if (pathname === API_ENDPOINTS.PRODUCTS.LOW_STOCK) {
        return createResponse(config, createDefaultList(demoProducts.slice(0, 2), params));
      }

      const productIdMatch = pathname.match(/\/products\/(\d+)/);
      if (productIdMatch && pathname !== API_ENDPOINTS.PRODUCTS.BASE) {
        const product = findById(demoProducts, "id", productIdMatch[1]) || demoProducts[0];
        return createResponse(config, clone(product));
      }

      return createResponse(config, createDefaultList(demoProducts, params));
    }

    if (method === "post") {
      const product = {
        id: Date.now(),
        productId: Date.now(),
        status: "ACTIVE",
        ...body,
      };
      demoProducts.unshift(product);
      return createResponse(config, clone(product), "Product created");
    }
  }

  if (pathname.startsWith(API_ENDPOINTS.CUSTOMERS.BASE)) {
    if (method === "get") {
      if (pathname === API_ENDPOINTS.CUSTOMERS.SEARCH) {
        return createResponse(
          config,
          createDefaultList(
            applySearch(demoCustomers, params.query || "", ["name", "phone"]),
            params
          )
        );
      }

      const customerIdMatch = pathname.match(/\/customers\/(\d+)/);
      if (customerIdMatch && pathname !== API_ENDPOINTS.CUSTOMERS.BASE) {
        const customer = findById(demoCustomers, "id", customerIdMatch[1]) || demoCustomers[0];
        return createResponse(config, clone(customer));
      }

      return createResponse(config, createDefaultList(demoCustomers, params));
    }

    if (method === "post") {
      const customer = {
        id: Date.now(),
        customerId: Date.now(),
        loyaltyPoints: 0,
        status: "ACTIVE",
        ...body,
      };
      demoCustomers.unshift(customer);
      return createResponse(config, clone(customer), "Customer created");
    }
  }

  if (pathname.startsWith(API_ENDPOINTS.SUPPLIERS.BASE)) {
    if (method === "get") {
      if (pathname === API_ENDPOINTS.SUPPLIERS.SEARCH) {
        return createResponse(
          config,
          createDefaultList(applySearch(demoSuppliers, params.query || "", ["name"]), params)
        );
      }

      const supplierIdMatch = pathname.match(/\/suppliers\/(\d+)/);
      if (supplierIdMatch && pathname !== API_ENDPOINTS.SUPPLIERS.BASE) {
        const supplier = findById(demoSuppliers, "id", supplierIdMatch[1]) || demoSuppliers[0];
        return createResponse(config, clone(supplier));
      }

      return createResponse(config, createDefaultList(demoSuppliers, params));
    }
  }

  if (pathname.startsWith(API_ENDPOINTS.INVENTORY.BASE)) {
    if (method === "get") {
      if (pathname.includes("/branch/") && pathname.endsWith("/low-stock")) {
        return createResponse(config, createDefaultList(demoInventory.slice(0, 2), params));
      }

      if (pathname.includes("/branch/") && pathname.endsWith("/expiring")) {
        return createResponse(config, createDefaultList(demoInventory.slice(0, 1), params));
      }

      if (pathname.includes("/branch/") && pathname.endsWith("/expired")) {
        return createResponse(config, createDefaultList([], params));
      }

      if (pathname.includes("/product/") && pathname.includes("/branch/") && pathname.endsWith("/batches")) {
        return createResponse(config, createDefaultList(demoInventory, params));
      }

      if (pathname.includes("/product/") && pathname.includes("/branch/") && pathname.endsWith("/available")) {
        return createResponse(config, { availableQuantity: 12 });
      }

      if (pathname.includes("/branch/") && pathname.endsWith("/available")) {
        return createResponse(config, createDefaultList(demoInventory, params));
      }

      if (pathname === API_ENDPOINTS.INVENTORY.ALL_LOW_STOCK) {
        return createResponse(config, createDefaultList(demoInventory.slice(0, 2), params));
      }

      if (pathname === API_ENDPOINTS.INVENTORY.ALL_EXPIRING) {
        return createResponse(config, createDefaultList(demoInventory.slice(0, 2), params));
      }

      if (pathname === API_ENDPOINTS.INVENTORY.ALL_EXPIRED) {
        return createResponse(config, createDefaultList([], params));
      }

      if (pathname.match(/\/inventory\/branch\/\d+$/)) {
        return createResponse(config, createDefaultList(demoInventory, params));
      }

      const productBranchMatch = pathname.match(/\/inventory\/product\/(\d+)\/branch\/(\d+)/);
      if (productBranchMatch) {
        const inventory =
          demoInventory.find(
            (item) =>
              String(item.productId) === String(productBranchMatch[1]) &&
              String(item.branchId) === String(productBranchMatch[2])
          ) || demoInventory[0];
        return createResponse(config, clone(inventory));
      }
    }
  }

  if (pathname.startsWith(API_ENDPOINTS.SALES.BASE)) {
    if (method === "get") {
      if (pathname === API_ENDPOINTS.SALES.LIST || pathname === API_ENDPOINTS.SALES.BASE) {
        return createResponse(config, createDefaultList(demoSales, params));
      }

      if (pathname === API_ENDPOINTS.SALES.BY_DATE_RANGE) {
        return createResponse(config, createDefaultList(demoSales, params));
      }

      const numberMatch = pathname.match(/\/sales\/number\/([^/]+)/);
      if (numberMatch) {
        const sale = demoSales.find((item) => item.saleNumber === numberMatch[1] || item.invoiceNumber === numberMatch[1]) || demoSales[0];
        return createResponse(config, clone(sale));
      }

      const saleIdMatch = pathname.match(/\/sales\/(\d+)/);
      if (saleIdMatch && pathname !== API_ENDPOINTS.SALES.BASE) {
        const sale = findById(demoSales, "id", saleIdMatch[1]) || demoSales[0];
        return createResponse(config, clone(sale));
      }

      if (pathname.includes("/branch/")) {
        return createResponse(config, createDefaultList(demoSales, params));
      }
    }

    if (method === "post") {
      const sale = handleSalesCreate(body);
      return createResponse(config, clone(sale), "Sale completed");
    }
  }

  if (pathname.startsWith("/cash-book")) {
    if (pathname.endsWith("/summary")) {
      return createResponse(config, {
        openingBalance: 5000,
        receipts: 12450,
        payments: 8720,
        closingBalance: 8730,
      });
    }

    return createResponse(config, createDefaultList([], params));
  }

  if (pathname.startsWith("/cash-register")) {
    return createResponse(config, { status: "OPEN", openingBalance: 5000 });
  }

  if (pathname.startsWith("/transactions")) {
    return createResponse(config, createDefaultList([], params));
  }

  if (pathname.startsWith("/employees")) {
    return createResponse(config, createDefaultList([], params));
  }

  if (pathname.startsWith("/payroll")) {
    return createResponse(config, createDefaultList([], params));
  }

  if (pathname.startsWith("/reports")) {
    return createResponse(config, { generated: true, items: [] });
  }

  if (pathname.startsWith("/scan") && method === "post") {
    return createResponse(
      config,
      demoScanResult(body.scanData || "", body.context || "POS", body.branchId),
      "Scan processed"
    );
  }

  if (pathname.startsWith("/notifications")) {
    return createResponse(config, createDefaultList([], params));
  }

  if (pathname.startsWith("/system-config")) {
    return createResponse(config, { demoMode: true });
  }

  if (method === "post" || method === "put" || method === "patch" || method === "delete") {
    return createResponse(config, { ...body, id: body.id || Date.now() }, "Saved successfully");
  }

  return createResponse(config, createDefaultList([], params));
};
