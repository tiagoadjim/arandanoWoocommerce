import { Product, Order, StoreSettings, Coupon } from '../types';

// --- Helpers ---

const getHeaders = (settings: StoreSettings) => {
    const auth = btoa(`${settings.consumerKey}:${settings.consumerSecret}`);
    return {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
    };
};

const getBaseUrl = (settings: StoreSettings) => {
    // Remove trailing slashes and ensure /wp-json/wc/v3
    const cleanUrl = settings.url.replace(/\/$/, "");
    if (cleanUrl.includes('/wp-json')) {
         return cleanUrl;
    }
    return `${cleanUrl}/wp-json/wc/v3`;
};

// --- Connection Check ---

export const checkConnection = async (settings: StoreSettings): Promise<boolean> => {
    if (!settings.url || !settings.consumerKey || !settings.consumerSecret) return false;
    try {
        // Try to fetch system status or just one product to validate keys
        const response = await fetch(`${getBaseUrl(settings)}/system_status`, { 
            headers: getHeaders(settings) 
        });
        // Some servers might block system_status, try products if that fails or returns 401/403
        if (!response.ok) {
             const prodResponse = await fetch(`${getBaseUrl(settings)}/products?per_page=1`, { 
                headers: getHeaders(settings) 
            });
            return prodResponse.ok;
        }
        return response.ok;
    } catch (error) {
        console.error("Connection check failed:", error);
        return false;
    }
};

// --- Products ---

export const fetchProducts = async (settings: StoreSettings): Promise<Product[]> => {
  if (!settings.url) throw new Error("URL de la tienda no configurada");

  try {
      const response = await fetch(`${getBaseUrl(settings)}/products?per_page=20`, { headers: getHeaders(settings) });
      if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Error ${response.status}: ${errText}`);
      }
      return await response.json();
  } catch (error) {
      console.error("Fetch Products Error:", error);
      throw error;
  }
};

export const saveProduct = async (settings: StoreSettings, product: Partial<Product>): Promise<Product> => {
    if (!settings.url) throw new Error("URL de la tienda no configurada");

    const url = product.id 
        ? `${getBaseUrl(settings)}/products/${product.id}`
        : `${getBaseUrl(settings)}/products`;
    
    const method = product.id ? 'PUT' : 'POST';

    const response = await fetch(url, {
        method,
        headers: getHeaders(settings),
        body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error("Error al guardar producto");
    return await response.json();
};

// --- Orders ---

export const fetchOrders = async (settings: StoreSettings): Promise<Order[]> => {
  if (!settings.url) throw new Error("URL de la tienda no configurada");

  try {
      const response = await fetch(`${getBaseUrl(settings)}/orders?per_page=20`, { headers: getHeaders(settings) });
      if (!response.ok) throw new Error("Error al obtener ordenes");
      return await response.json();
  } catch (error) {
      console.error("Fetch Orders Error:", error);
      throw error;
  }
};

export const updateOrderStatus = async (settings: StoreSettings, orderId: number, status: string): Promise<Order> => {
    if (!settings.url) throw new Error("URL de la tienda no configurada");
    
    const response = await fetch(`${getBaseUrl(settings)}/orders/${orderId}`, {
        method: 'PUT',
        headers: getHeaders(settings),
        body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error("Error al actualizar orden");
    return await response.json();
};

// --- Coupons ---

export const fetchCoupons = async (settings: StoreSettings): Promise<Coupon[]> => {
    if (!settings.url) throw new Error("URL de la tienda no configurada");

    const response = await fetch(`${getBaseUrl(settings)}/coupons`, { headers: getHeaders(settings) });
    if (!response.ok) throw new Error("Error al obtener cupones");
    return await response.json();
};

export const createCoupon = async (settings: StoreSettings, coupon: Partial<Coupon>): Promise<Coupon> => {
    if (!settings.url) throw new Error("URL de la tienda no configurada");

    const response = await fetch(`${getBaseUrl(settings)}/coupons`, {
        method: 'POST',
        headers: getHeaders(settings),
        body: JSON.stringify(coupon)
    });
    if (!response.ok) throw new Error("Error al crear cupón");
    return await response.json();
};

export const deleteCoupon = async (settings: StoreSettings, id: number): Promise<boolean> => {
    if (!settings.url) throw new Error("URL de la tienda no configurada");

    const response = await fetch(`${getBaseUrl(settings)}/coupons/${id}?force=true`, {
        method: 'DELETE',
        headers: getHeaders(settings)
    });
    return response.ok;
};