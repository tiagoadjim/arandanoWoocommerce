import { Product, Order, StoreSettings, Coupon } from '../types';

// --- Helpers ---

const getHeaders = (method: string = 'GET') => {
    const headers: Record<string, string> = {};

    if (method !== 'GET') {
        headers['Content-Type'] = 'application/json';
    }

    return headers;
};

const getBaseUrl = (settings: StoreSettings) => {
    // Remove trailing slashes and normalize Woocommerce REST base path
    const cleanUrl = settings.url.replace(/\/+$/, "");

    // If user already provided the full wc endpoint, just use it
    if (/\/wp-json\/wc\/v\d+$/i.test(cleanUrl)) {
        return cleanUrl;
    }

    // If user provided the wp-json root only, append the wc namespace
    if (/\/wp-json$/i.test(cleanUrl)) {
        return `${cleanUrl}/wc/v3`;
    }

    // Otherwise assume it's the store root URL
    return `${cleanUrl}/wp-json/wc/v3`;
};

const withAuthParams = (url: string, settings: StoreSettings) => {
    const urlObj = new URL(url);
    urlObj.searchParams.set('consumer_key', settings.consumerKey);
    urlObj.searchParams.set('consumer_secret', settings.consumerSecret);
    return urlObj.toString();
};

// --- Connection Check ---

export const checkConnection = async (settings: StoreSettings): Promise<boolean> => {
    if (!settings.url || !settings.consumerKey || !settings.consumerSecret) return false;
    try {
        // Try to fetch system status or just one product to validate keys
        const response = await fetch(withAuthParams(`${getBaseUrl(settings)}/system_status`, settings), {
            headers: getHeaders()
        });
        // Some servers might block system_status, try products if that fails or returns 401/403
        if (!response.ok) {
             const prodResponse = await fetch(withAuthParams(`${getBaseUrl(settings)}/products?per_page=1`, settings), {
                headers: getHeaders()
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
      const response = await fetch(withAuthParams(`${getBaseUrl(settings)}/products?per_page=20`, settings), { headers: getHeaders() });
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

    const response = await fetch(withAuthParams(url, settings), {
        method,
        headers: getHeaders(method),
        body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error("Error al guardar producto");
    return await response.json();
};

// --- Orders ---

export const fetchOrders = async (settings: StoreSettings): Promise<Order[]> => {
  if (!settings.url) throw new Error("URL de la tienda no configurada");

  try {
      const response = await fetch(withAuthParams(`${getBaseUrl(settings)}/orders?per_page=20`, settings), { headers: getHeaders() });
      if (!response.ok) throw new Error("Error al obtener ordenes");
      return await response.json();
  } catch (error) {
      console.error("Fetch Orders Error:", error);
      throw error;
  }
};

export const updateOrderStatus = async (settings: StoreSettings, orderId: number, status: string): Promise<Order> => {
    if (!settings.url) throw new Error("URL de la tienda no configurada");
    
    const response = await fetch(withAuthParams(`${getBaseUrl(settings)}/orders/${orderId}`, settings), {
        method: 'PUT',
        headers: getHeaders('PUT'),
        body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error("Error al actualizar orden");
    return await response.json();
};

// --- Coupons ---

export const fetchCoupons = async (settings: StoreSettings): Promise<Coupon[]> => {
    if (!settings.url) throw new Error("URL de la tienda no configurada");

    const response = await fetch(withAuthParams(`${getBaseUrl(settings)}/coupons`, settings), { headers: getHeaders() });
    if (!response.ok) throw new Error("Error al obtener cupones");
    return await response.json();
};

export const createCoupon = async (settings: StoreSettings, coupon: Partial<Coupon>): Promise<Coupon> => {
    if (!settings.url) throw new Error("URL de la tienda no configurada");

    const response = await fetch(withAuthParams(`${getBaseUrl(settings)}/coupons`, settings), {
        method: 'POST',
        headers: getHeaders('POST'),
        body: JSON.stringify(coupon)
    });
    if (!response.ok) throw new Error("Error al crear cupón");
    return await response.json();
};

export const deleteCoupon = async (settings: StoreSettings, id: number): Promise<boolean> => {
    if (!settings.url) throw new Error("URL de la tienda no configurada");

    const response = await fetch(withAuthParams(`${getBaseUrl(settings)}/coupons/${id}?force=true`, settings), {
        method: 'DELETE',
        headers: getHeaders('DELETE')
    });
    return response.ok;
};