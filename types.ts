export interface ProductAttribute {
  id: number;
  name: string;
  options: string[];
  visible: boolean;
  variation: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  status: 'publish' | 'draft' | 'private';
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_quantity: number | null;
  manage_stock: boolean;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  images: { id: number; src: string; alt: string }[];
  categories: { id: number; name: string }[];
  tags: { id: number; name: string }[];
  attributes: ProductAttribute[];
}

export interface Order {
  id: number;
  status: 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed';
  total: string;
  currency: string;
  date_created: string;
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  payment_method_title: string;
  line_items: {
    id: number;
    name: string;
    product_id: number;
    quantity: number;
    total: string;
    sku?: string;
    image?: { src: string };
    price: number;
  }[];
  shipping_lines: {
      method_title: string;
      total: string;
  }[];
  customer_note: string;
}

export interface Coupon {
  id: number;
  code: string;
  amount: string;
  discount_type: 'percent' | 'fixed_cart' | 'fixed_product';
  description: string;
  date_expires: string | null;
  usage_count: number;
  minimum_amount: string;
}

export interface StoreSettings {
  url: string;
  consumerKey: string;
  consumerSecret: string;
  isDemoMode: boolean;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  PRODUCTS = 'PRODUCTS',
  PRODUCT_EDIT = 'PRODUCT_EDIT',
  ORDERS = 'ORDERS',
  ORDER_DETAIL = 'ORDER_DETAIL',
  COUPONS = 'COUPONS',
  SETTINGS = 'SETTINGS'
}