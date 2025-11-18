import { Product, Order, StoreSettings, Coupon } from '../types';

// --- Mock Data ---

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Premium Cotton T-Shirt",
    slug: "premium-cotton-t-shirt",
    status: 'publish',
    description: "<p>Experience ultimate comfort with our Premium Cotton T-Shirt.</p>",
    short_description: "100% Organic Cotton",
    sku: "TSHIRT-001",
    price: "29.99",
    regular_price: "29.99",
    sale_price: "",
    on_sale: false,
    stock_quantity: 50,
    manage_stock: true,
    weight: "0.2",
    dimensions: { length: "20", width: "15", height: "2" },
    images: [{ id: 101, src: "https://picsum.photos/400/400?random=1", alt: "T-Shirt" }],
    categories: [{ id: 1, name: "Clothing" }],
    tags: [{ id: 1, name: "Summer" }],
    attributes: [
        { id: 1, name: "Size", options: ["S", "M", "L"], visible: true, variation: true },
        { id: 2, name: "Color", options: ["White", "Black"], visible: true, variation: true }
    ]
  },
  {
    id: 2,
    name: "Minimalist Leather Wallet",
    slug: "minimalist-wallet",
    status: 'publish',
    description: "<p>Sleek, durable, and perfect for everyday carry.</p>",
    short_description: "Genuine Leather",
    sku: "WALLET-002",
    price: "45.00",
    regular_price: "55.00",
    sale_price: "45.00",
    on_sale: true,
    stock_quantity: 12,
    manage_stock: true,
    weight: "0.1",
    dimensions: { length: "10", width: "8", height: "1" },
    images: [{ id: 102, src: "https://picsum.photos/400/400?random=2", alt: "Wallet" }],
    categories: [{ id: 2, name: "Accessories" }],
    tags: [{ id: 2, name: "Gift" }],
    attributes: []
  },
  {
    id: 3,
    name: "Wireless Noise Cancelling Headphones",
    slug: "headphones-nc",
    status: 'draft',
    description: "<p>Immerse yourself in music.</p>",
    short_description: "30h Battery Life",
    sku: "AUDIO-003",
    price: "199.99",
    regular_price: "199.99",
    sale_price: "",
    on_sale: false,
    stock_quantity: 0,
    manage_stock: true,
    weight: "0.5",
    dimensions: { length: "25", width: "20", height: "10" },
    images: [{ id: 103, src: "https://picsum.photos/400/400?random=3", alt: "Headphones" }],
    categories: [{ id: 3, name: "Electronics" }],
    tags: [],
    attributes: []
  }
];

const MOCK_ORDERS: Order[] = [
  {
    id: 1001,
    status: 'processing',
    total: "74.99",
    currency: "USD",
    date_created: "2023-10-25T14:00:00",
    payment_method_title: "Credit Card (Stripe)",
    billing: { 
        first_name: "John", last_name: "Doe", email: "john@example.com", phone: "555-0123",
        address_1: "123 Main St", city: "New York", state: "NY", postcode: "10001", country: "US"
    },
    shipping: {
        first_name: "John", last_name: "Doe",
        address_1: "123 Main St", city: "New York", state: "NY", postcode: "10001", country: "US"
    },
    line_items: [
        { id: 1, name: "Premium Cotton T-Shirt", product_id: 1, quantity: 1, total: "29.99", sku: "TSHIRT-001", image: { src: "https://picsum.photos/400/400?random=1" }, price: 29.99 }, 
        { id: 2, name: "Minimalist Leather Wallet", product_id: 2, quantity: 1, total: "45.00", sku: "WALLET-002", image: { src: "https://picsum.photos/400/400?random=2" }, price: 45.00 }
    ],
    shipping_lines: [
        { method_title: "Flat Rate", total: "0.00" }
    ],
    customer_note: "Please leave at the front door."
  },
  {
    id: 1002,
    status: 'completed',
    total: "34.99",
    currency: "USD",
    date_created: "2023-10-24T10:30:00",
    payment_method_title: "PayPal",
    billing: { 
        first_name: "Jane", last_name: "Smith", email: "jane@example.com", phone: "555-0124",
        address_1: "456 Oak Ave", city: "Los Angeles", state: "CA", postcode: "90001", country: "US"
    },
    shipping: {
        first_name: "Jane", last_name: "Smith",
        address_1: "456 Oak Ave", city: "Los Angeles", state: "CA", postcode: "90001", country: "US"
    },
    line_items: [{ id: 3, name: "Premium Cotton T-Shirt", product_id: 1, quantity: 1, total: "29.99", sku: "TSHIRT-001", image: { src: "https://picsum.photos/400/400?random=1" }, price: 29.99 }],
    shipping_lines: [
        { method_title: "Express", total: "5.00" }
    ],
    customer_note: ""
  }
];

const MOCK_COUPONS: Coupon[] = [
    { id: 1, code: 'WELCOME20', amount: '20', discount_type: 'percent', description: 'Welcome discount', date_expires: null, usage_count: 15, minimum_amount: '0' },
    { id: 2, code: 'SUMMER10', amount: '10', discount_type: 'fixed_cart', description: 'Summer Sale', date_expires: '2024-08-31T00:00:00', usage_count: 42, minimum_amount: '50' }
];

// --- Helpers ---

const getHeaders = (settings: StoreSettings) => {
    const auth = btoa(`${settings.consumerKey}:${settings.consumerSecret}`);
    return {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
    };
};

const getBaseUrl = (settings: StoreSettings) => {
    return settings.url.replace(/\/$/, "") + "/wp-json/wc/v3";
};

// --- Products ---

export const fetchProducts = async (settings: StoreSettings): Promise<Product[]> => {
  if (settings.isDemoMode) return new Promise(resolve => setTimeout(() => resolve([...MOCK_PRODUCTS]), 600));
  
  if (!settings.url) return []; // Prevent fetch if URL is missing

  const response = await fetch(`${getBaseUrl(settings)}/products`, { headers: getHeaders(settings) });
  if (!response.ok) throw new Error("Failed to fetch products");
  return await response.json();
};

export const saveProduct = async (settings: StoreSettings, product: Partial<Product>): Promise<Product> => {
    if (settings.isDemoMode) {
        return new Promise(resolve => setTimeout(() => resolve({ ...MOCK_PRODUCTS[0], ...product, id: product.id || Date.now() } as Product), 600));
    }

    if (!settings.url) throw new Error("Store URL is missing");

    const url = product.id 
        ? `${getBaseUrl(settings)}/products/${product.id}`
        : `${getBaseUrl(settings)}/products`;
    
    const method = product.id ? 'PUT' : 'POST';

    const response = await fetch(url, {
        method,
        headers: getHeaders(settings),
        body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error("Failed to save product");
    return await response.json();
};

// --- Orders ---

export const fetchOrders = async (settings: StoreSettings): Promise<Order[]> => {
  if (settings.isDemoMode) return new Promise(resolve => setTimeout(() => resolve([...MOCK_ORDERS]), 600));
  if (!settings.url) return [];

  const response = await fetch(`${getBaseUrl(settings)}/orders`, { headers: getHeaders(settings) });
  if (!response.ok) throw new Error("Failed to fetch orders");
  return await response.json();
};

export const updateOrderStatus = async (settings: StoreSettings, orderId: number, status: string): Promise<Order> => {
    if (settings.isDemoMode) {
        const order = MOCK_ORDERS.find(o => o.id === orderId);
        if (order) {
            order.status = status as any;
            return new Promise(resolve => setTimeout(() => resolve({...order}), 400));
        }
        throw new Error("Order not found");
    }

    if (!settings.url) throw new Error("Store URL is missing");
    
    const response = await fetch(`${getBaseUrl(settings)}/orders/${orderId}`, {
        method: 'PUT',
        headers: getHeaders(settings),
        body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error("Failed to update order");
    return await response.json();
};

// --- Coupons ---

export const fetchCoupons = async (settings: StoreSettings): Promise<Coupon[]> => {
    if (settings.isDemoMode) return new Promise(resolve => setTimeout(() => resolve([...MOCK_COUPONS]), 500));
    if (!settings.url) return [];

    const response = await fetch(`${getBaseUrl(settings)}/coupons`, { headers: getHeaders(settings) });
    if (!response.ok) throw new Error("Failed to fetch coupons");
    return await response.json();
};

export const createCoupon = async (settings: StoreSettings, coupon: Partial<Coupon>): Promise<Coupon> => {
    if (settings.isDemoMode) {
        return new Promise(resolve => setTimeout(() => resolve({ ...coupon, id: Date.now(), usage_count: 0 } as Coupon), 500));
    }
    if (!settings.url) throw new Error("Store URL is missing");

    const response = await fetch(`${getBaseUrl(settings)}/coupons`, {
        method: 'POST',
        headers: getHeaders(settings),
        body: JSON.stringify(coupon)
    });
    if (!response.ok) throw new Error("Failed to create coupon");
    return await response.json();
};

export const deleteCoupon = async (settings: StoreSettings, id: number): Promise<boolean> => {
    if (settings.isDemoMode) return new Promise(resolve => setTimeout(() => resolve(true), 400));
    if (!settings.url) throw new Error("Store URL is missing");

    const response = await fetch(`${getBaseUrl(settings)}/coupons/${id}?force=true`, {
        method: 'DELETE',
        headers: getHeaders(settings)
    });
    return response.ok;
};