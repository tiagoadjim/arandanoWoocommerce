import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  Settings as SettingsIcon, 
  Search, 
  Bell, 
  Menu, 
  X, 
  Plus, 
  Edit2, 
  Trash2, 
  Sparkles,
  TrendingUp,
  Package,
  Users,
  Image as ImageIcon,
  Tag,
  Ticket,
  ChevronLeft,
  MapPin,
  CreditCard,
  Calendar,
  MoreHorizontal,
  Truck,
  AlertCircle,
  LogOut,
  CheckCircle2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

import { Product, Order, StoreSettings, ViewState, Coupon } from './types';
import { fetchProducts, fetchOrders, fetchCoupons, createCoupon, deleteCoupon, updateOrderStatus, saveProduct, checkConnection } from './services/woocommerceService';
import { generateProductDescription, analyzeSalesTrend } from './services/geminiService';
import { Button, Input, Card, Badge } from './components/Components';

// --- Onboarding Component ---
const Onboarding = ({ onConnect }: { onConnect: (s: StoreSettings) => void }) => {
    const [url, setUrl] = useState('');
    const [key, setKey] = useState('');
    const [secret, setSecret] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsChecking(true);
        
        const settings: StoreSettings = {
            url,
            consumerKey: key,
            consumerSecret: secret,
            isDemoMode: false
        };

        const isConnected = await checkConnection(settings);
        
        if (isConnected) {
            onConnect(settings);
        } else {
            setError("No se pudo conectar. Verifique la URL (asegúrese de tener HTTPS y CORS habilitado) y las claves API.");
        }
        setIsChecking(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg">
                         <Sparkles className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Arandano OS
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Sistema operativo headless para WooCommerce
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                                URL de la Tienda
                            </label>
                            <div className="mt-1">
                                <input
                                    id="url"
                                    name="url"
                                    type="url"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                                    placeholder="https://mitienda.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="key" className="block text-sm font-medium text-gray-700">
                                Consumer Key (CK)
                            </label>
                            <div className="mt-1">
                                <input
                                    id="key"
                                    name="key"
                                    type="text"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                                    placeholder="ck_..."
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="secret" className="block text-sm font-medium text-gray-700">
                                Consumer Secret (CS)
                            </label>
                            <div className="mt-1">
                                <input
                                    id="secret"
                                    name="secret"
                                    type="password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                                    placeholder="cs_..."
                                    value={secret}
                                    onChange={(e) => setSecret(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Error de conexión</h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <p>{error}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <Button 
                                type="submit" 
                                className="w-full flex justify-center py-2 px-4"
                                disabled={isChecking}
                            >
                                {isChecking ? 'Verificando...' : 'Conectar Tienda'}
                            </Button>
                        </div>
                    </form>
                    <div className="mt-6">
                         <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Instrucciones</span>
                            </div>
                        </div>
                        <p className="mt-4 text-xs text-gray-500 text-center">
                            Ve a WooCommerce {'>'} Ajustes {'>'} Avanzado {'>'} REST API para generar tus claves con permisos de Lectura/Escritura.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 1. Sidebar
const Sidebar = ({ currentView, setView, isMobileOpen, setIsMobileOpen, onLogout }: { 
  currentView: ViewState, 
  setView: (v: ViewState) => void,
  isMobileOpen: boolean,
  setIsMobileOpen: (v: boolean) => void,
  onLogout: () => void
}) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Inicio', icon: LayoutDashboard },
    { id: ViewState.PRODUCTS, label: 'Productos', icon: ShoppingBag },
    { id: ViewState.ORDERS, label: 'Ordenes', icon: ShoppingCart },
    { id: ViewState.COUPONS, label: 'Cupones', icon: Ticket },
    { id: ViewState.SETTINGS, label: 'Configuración', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:inset-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        border-r border-gray-200 flex flex-col
      `}>
        <div className="flex items-center justify-start h-20 px-6 border-b border-gray-100">
          <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center mr-3 shadow-md">
                <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">Arandano OS</span>
          <button 
            className="ml-auto md:hidden text-gray-500"
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setView(item.id); setIsMobileOpen(false); }}
              className={`
                group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg w-full transition-all duration-200
                ${currentView === item.id || (currentView === ViewState.PRODUCT_EDIT && item.id === ViewState.PRODUCTS) || (currentView === ViewState.ORDER_DETAIL && item.id === ViewState.ORDERS)
                  ? 'bg-brand-50 text-brand-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <item.icon 
                className={`mr-3 h-5 w-5 transition-colors duration-200 ${currentView === item.id || (currentView === ViewState.PRODUCT_EDIT && item.id === ViewState.PRODUCTS) ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-500'}`} 
              />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 font-bold text-sm ring-2 ring-white">
                        A
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">Admin</p>
                        <p className="text-xs text-gray-500 truncate max-w-[100px]">WooCommerce</p>
                    </div>
                </div>
                <button onClick={onLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                    <LogOut size={18} />
                </button>
            </div>
        </div>
      </div>
    </>
  );
};

// 2. Dashboard View
const DashboardView = ({ orders }: { orders: Order[] }) => {
  const [insight, setInsight] = useState<string>("Cargando análisis de IA...");
  
  // Simulating chart data transformation from orders would happen here in a real app
  const data = [
    { name: 'Lun', sales: 4000, orders: 24 },
    { name: 'Mar', sales: 3000, orders: 13 },
    { name: 'Mie', sales: 2000, orders: 98 },
    { name: 'Jue', sales: 2780, orders: 39 },
    { name: 'Vie', sales: 1890, orders: 48 },
    { name: 'Sab', sales: 2390, orders: 38 },
    { name: 'Dom', sales: 3490, orders: 43 },
  ];

  useEffect(() => {
      // Analyze simplified data
      analyzeSalesTrend(data).then(setInsight);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSales = orders.reduce((acc, order) => acc + parseFloat(order.total), 0).toFixed(2);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
          <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-brand-200 transition-colors">
            <div className="flex items-center">
                <div className="flex-shrink-0 bg-brand-100 rounded-xl p-3">
                    <TrendingUp className="h-6 w-6 text-brand-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ventas Totales</dt>
                        <dd className="flex items-baseline mt-1">
                            <div className="text-2xl font-extrabold text-gray-900">${totalSales}</div>
                        </dd>
                    </dl>
                </div>
            </div>
        </Card>
        <Card className="hover:border-brand-200 transition-colors">
            <div className="flex items-center">
                <div className="flex-shrink-0 bg-emerald-100 rounded-xl p-3">
                    <Package className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ordenes</dt>
                        <dd className="flex items-baseline mt-1">
                            <div className="text-2xl font-extrabold text-gray-900">{orders.length}</div>
                        </dd>
                    </dl>
                </div>
            </div>
        </Card>
        <Card className="hover:border-brand-200 transition-colors">
            <div className="flex items-center">
                <div className="flex-shrink-0 bg-amber-100 rounded-xl p-3">
                    <Users className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-xs font-bold text-gray-500 uppercase tracking-wider">Clientes</dt>
                        <dd className="flex items-baseline mt-1">
                            <div className="text-2xl font-extrabold text-gray-900">{new Set(orders.map(o => o.billing.email)).size}</div>
                        </dd>
                    </dl>
                </div>
            </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title="Rendimiento de Ventas" className="h-full">
                <div className="h-72 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8355ff" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#8355ff" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(val) => `$${val}`} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                                itemStyle={{ color: '#1f2937', fontWeight: 600 }}
                                cursor={{ stroke: '#d1d5db', strokeWidth: 1 }}
                            />
                            <Area type="monotone" dataKey="sales" stroke="#8355ff" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
          </div>

          <Card title="Arandano AI Insights" className="h-full bg-gradient-to-b from-white to-brand-50/30">
             <div className="flex flex-col h-full">
                 <div className="flex items-center mb-4">
                     <div className="p-2 bg-brand-100 rounded-full">
                        <Sparkles className="h-5 w-5 text-brand-600" />
                     </div>
                     <h4 className="ml-3 font-semibold text-brand-900">Análisis Inteligente</h4>
                 </div>
                 <p className="text-gray-700 italic leading-relaxed flex-grow text-sm">
                     "{insight}"
                 </p>
                 <div className="mt-6 pt-4 border-t border-brand-100">
                    <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-brand-500"></span>
                        <span className="text-xs font-bold text-brand-500 uppercase tracking-wide">Recomendación</span>
                    </div>
                    <p className="text-sm text-brand-900 mt-1 font-medium">Optimizar inventario para el fin de semana.</p>
                 </div>
             </div>
          </Card>
      </div>
    </div>
  );
};

// 3. Product Editor (Updated colors)
const ProductEditor = ({ 
    product, 
    onSave, 
    onCancel 
}: { 
    product: Product | null, 
    onSave: (p: Partial<Product>) => void, 
    onCancel: () => void 
}) => {
    const [formData, setFormData] = useState<Partial<Product>>(product || {
        name: '',
        sku: '',
        regular_price: '',
        sale_price: '',
        stock_quantity: 0,
        description: '',
        short_description: '',
        status: 'draft',
        manage_stock: true,
        weight: '',
        categories: [],
        images: [],
        attributes: []
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [newAttributeName, setNewAttributeName] = useState('');

    const handleGenerateDescription = async () => {
        if (!formData.name) return alert("Ingresa el nombre del producto primero.");
        setIsGenerating(true);
        const desc = await generateProductDescription(formData.name || '', formData.short_description || 'High quality');
        setFormData(prev => ({ ...prev, description: desc }));
        setIsGenerating(false);
    };

    const addAttribute = () => {
        if(!newAttributeName) return;
        const newAttr = { id: Date.now(), name: newAttributeName, options: [], visible: true, variation: true };
        setFormData(prev => ({ ...prev, attributes: [...(prev.attributes || []), newAttr] }));
        setNewAttributeName('');
    };

    const addOptionToAttribute = (attrId: number, option: string) => {
        if (!option) return;
        setFormData(prev => ({
            ...prev,
            attributes: prev.attributes?.map(a => a.id === attrId ? { ...a, options: [...a.options, option] } : a)
        }));
    };

    return (
        <div className="max-w-5xl mx-auto pb-10">
            {/* Header actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center">
                    <button onClick={onCancel} className="mr-4 p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900">
                        {product ? formData.name : 'Nuevo Producto'}
                    </h2>
                </div>
                <div className="flex space-x-3 w-full sm:w-auto">
                    <Button variant="secondary" onClick={onCancel} className="flex-1 sm:flex-none">Descartar</Button>
                    <Button onClick={() => onSave(formData)} className="flex-1 sm:flex-none">Guardar Producto</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Column (Left) */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-sm">
                        <div className="space-y-4">
                            <Input 
                                label="Título" 
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                placeholder="Ej. Zapatillas Deportivas"
                            />
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                    <button 
                                        onClick={handleGenerateDescription}
                                        disabled={isGenerating}
                                        className="text-xs flex items-center text-brand-600 hover:text-brand-800 font-medium bg-brand-50 px-2 py-1 rounded transition-colors"
                                    >
                                        {isGenerating ? <div className="animate-spin h-3 w-3 border-2 border-brand-600 rounded-full border-t-transparent mr-1"/> : <Sparkles size={12} className="mr-1" />}
                                        Generar con IA
                                    </button>
                                </div>
                                <textarea 
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm min-h-[200px]"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card title="Multimedia">
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-brand-300 transition-all cursor-pointer">
                            <div className="p-3 bg-brand-50 rounded-full shadow-sm mb-3">
                                <ImageIcon className="h-6 w-6 text-brand-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">Subir archivos</span>
                            <span className="text-xs text-gray-500 mt-1">Imágenes, videos o modelos 3D</span>
                        </div>
                        {formData.images && formData.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-4 mt-4">
                                {formData.images.map(img => (
                                    <div key={img.id} className="relative h-24 w-24 rounded-lg overflow-hidden border border-gray-200 group">
                                        <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all"></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    <Card title="Variantes">
                         <div className="space-y-4">
                            <div className="flex gap-2">
                                <Input 
                                    label="Nombre de opción (ej. Color)" 
                                    value={newAttributeName}
                                    onChange={e => setNewAttributeName(e.target.value)}
                                    className="flex-1 mb-0"
                                />
                                <Button onClick={addAttribute} variant="secondary" className="self-end mb-4">Agregar</Button>
                            </div>
                            
                            {formData.attributes?.map(attr => (
                                <div key={attr.id} className="p-4 bg-gray-50 rounded-md border border-gray-200">
                                    <h4 className="font-medium text-sm text-gray-900 mb-2">{attr.name}</h4>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {attr.options.map((opt, idx) => (
                                            <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white border border-gray-300 shadow-sm">
                                                {opt}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Agregar valor + Enter" 
                                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-brand-500 focus:border-brand-500"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    addOptionToAttribute(attr.id, e.currentTarget.value);
                                                    e.currentTarget.value = '';
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                         </div>
                    </Card>

                    <Card title="Precios">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input 
                                label="Precio" 
                                type="number" 
                                placeholder="0.00"
                                value={formData.regular_price} 
                                onChange={e => setFormData({...formData, regular_price: e.target.value, price: e.target.value})} 
                            />
                            <Input 
                                label="Precio de oferta" 
                                type="number" 
                                placeholder="0.00"
                                value={formData.sale_price} 
                                onChange={e => setFormData({...formData, sale_price: e.target.value})} 
                            />
                        </div>
                    </Card>

                    <Card title="Inventario">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input 
                                label="SKU" 
                                value={formData.sku} 
                                onChange={e => setFormData({...formData, sku: e.target.value})} 
                            />
                            <div className="flex items-center h-full pt-6">
                                <input 
                                    type="checkbox" 
                                    checked={formData.manage_stock}
                                    onChange={e => setFormData({...formData, manage_stock: e.target.checked})}
                                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 h-4 w-4" 
                                />
                                <label className="ml-2 block text-sm text-gray-900">Rastrear inventario</label>
                            </div>
                        </div>
                        {formData.manage_stock && (
                            <div className="mt-4">
                                <Input 
                                    label="Cantidad disponible"
                                    type="number"
                                    value={formData.stock_quantity || 0}
                                    onChange={e => setFormData({...formData, stock_quantity: parseInt(e.target.value)})}
                                />
                            </div>
                        )}
                    </Card>

                    <Card title="Previsualización SEO">
                         <div className="space-y-1 p-2 rounded hover:bg-gray-50">
                             <p className="text-sm text-blue-700 hover:underline cursor-pointer font-medium">{formData.name || 'Título del producto'}</p>
                             <p className="text-xs text-emerald-700">https://tutienda.com/products/{formData.name?.toLowerCase().replace(/ /g, '-') || 'producto'}</p>
                             <p className="text-sm text-gray-600 truncate">{formData.description?.replace(/<[^>]*>?/gm, '').substring(0, 150) || 'Descripción del producto...'}</p>
                         </div>
                    </Card>
                </div>

                {/* Sidebar Column (Right) */}
                <div className="space-y-6">
                    <Card title="Estado">
                        <select 
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md mb-4"
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value as any})}
                        >
                            <option value="publish">Activo</option>
                            <option value="draft">Borrador</option>
                        </select>
                        <div className={`text-xs p-2 rounded ${formData.status === 'publish' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {formData.status === 'publish' ? 'Visible en tienda' : 'Oculto en tienda'}
                        </div>
                    </Card>

                    <Card title="Organización">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categorías</label>
                                <div className="border border-gray-300 rounded-md p-2 max-h-32 overflow-y-auto">
                                    {formData.categories?.map(c => (
                                        <div key={c.id} className="flex items-center justify-between text-sm p-1 hover:bg-gray-50">
                                            <span>{c.name}</span>
                                            <button className="text-gray-400 hover:text-red-500"><X size={14}/></button>
                                        </div>
                                    ))}
                                    {(!formData.categories || formData.categories.length === 0) && <p className="text-xs text-gray-400 italic">Sin categorías</p>}
                                </div>
                                <Button variant="ghost" className="mt-2 w-full text-xs h-8">Gestionar Categorías</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// 4. Order Detail View
const OrderDetailView = ({ orderId, onBack, settings }: { orderId: number, onBack: () => void, settings: StoreSettings }) => {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders(settings).then(orders => {
            const found = orders.find(o => o.id === orderId);
            setOrder(found || null);
            setLoading(false);
        });
    }, [orderId, settings]);

    const handleStatusChange = async (newStatus: string) => {
        if (!order) return;
        try {
             const updated = await updateOrderStatus(settings, order.id, newStatus);
             setOrder(updated);
        } catch(e) {
            alert("Error actualizando estado");
        }
    };

    if (loading) return <div className="flex justify-center p-20"><div className="animate-spin h-10 w-10 border-4 border-brand-600 rounded-full border-t-transparent"/></div>;
    if (!order) return <div className="text-center p-10">Orden no encontrada</div>;

    return (
        <div className="max-w-5xl mx-auto pb-10 animate-fade-in">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="mr-4 text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft /></button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        Orden #{order.id} 
                        <Badge status={order.status} />
                    </h1>
                    <p className="text-sm text-gray-500">{new Date(order.date_created).toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Col */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Items" className="shadow-sm">
                        <div className="flow-root">
                            <ul className="divide-y divide-gray-100">
                                {order.line_items.map((item) => (
                                    <li key={item.id} className="py-4 flex">
                                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                                            {item.image?.src ? (
                                                <img src={item.image.src} alt={item.name} className="h-full w-full object-center object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center"><ImageIcon size={16} className="text-gray-400"/></div>
                                            )}
                                        </div>
                                        <div className="ml-4 flex flex-1 flex-col justify-center">
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <h3>{item.name}</h3>
                                                <p className="ml-4 font-semibold">${item.total}</p>
                                            </div>
                                            <div className="flex flex-1 items-center justify-between text-sm mt-1">
                                                <div className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded">SKU: {item.sku || 'N/A'}</div>
                                                <p className="text-gray-600">x{item.quantity}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Totals */}
                        <div className="border-t border-gray-100 mt-6 pt-4 space-y-2">
                             <div className="flex justify-between text-sm text-gray-600">
                                 <span>Subtotal</span>
                                 <span>${(parseFloat(order.total) - order.shipping_lines.reduce((acc, l) => acc + parseFloat(l.total), 0)).toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between text-sm text-gray-600">
                                 <span>Envío</span>
                                 <span>${order.shipping_lines.reduce((acc, l) => acc + parseFloat(l.total), 0).toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t border-gray-100 mt-2">
                                 <span>Total</span>
                                 <span>${order.total} {order.currency}</span>
                             </div>
                        </div>
                    </Card>

                    <Card title="Historial">
                         <div className="flex items-start space-x-3 pb-6 relative">
                             <div className="absolute top-2 left-4 bottom-0 w-0.5 bg-gray-200"></div>
                             <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center ring-4 ring-white z-10">
                                 <CheckCircle2 className="h-4 w-4 text-brand-600"/>
                             </div>
                             <div className="pt-1.5">
                                 <p className="text-sm font-medium text-gray-900">Orden creada</p>
                                 <p className="text-xs text-gray-500">{new Date(order.date_created).toLocaleString()}</p>
                             </div>
                         </div>
                    </Card>
                </div>

                {/* Right Col */}
                <div className="space-y-6">
                    <Card title="Cliente">
                         <div className="flex items-center mb-6">
                             <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-700 font-bold mr-4 text-lg shadow-inner">
                                 {order.billing.first_name.charAt(0)}
                             </div>
                             <div>
                                 <div className="text-base font-bold text-gray-900">{order.billing.first_name} {order.billing.last_name}</div>
                                 <div className="text-sm text-brand-600 hover:underline cursor-pointer">Ver historial de compras</div>
                             </div>
                         </div>
                         <div className="space-y-4 text-sm">
                             <div className="flex items-start gap-3">
                                 <Users className="h-4 w-4 text-gray-400 mt-0.5"/>
                                 <div>
                                     <div className="text-gray-900">{order.billing.email}</div>
                                     <div className="text-gray-500">{order.billing.phone}</div>
                                 </div>
                             </div>
                             <hr className="border-gray-100"/>
                             <div className="flex items-start gap-3">
                                 <MapPin className="h-4 w-4 text-gray-400 mt-0.5"/>
                                 <div className="text-gray-900">
                                     {order.shipping.address_1}<br/>
                                     {order.shipping.city}, {order.shipping.state}<br/>
                                     {order.shipping.country}
                                 </div>
                             </div>
                         </div>
                    </Card>

                    <Card title="Estado">
                         <div className="space-y-3">
                             <select 
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
                                value={order.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                             >
                                 <option value="pending">Pendiente de pago</option>
                                 <option value="processing">Procesando</option>
                                 <option value="on-hold">En espera</option>
                                 <option value="completed">Completado</option>
                                 <option value="cancelled">Cancelado</option>
                                 <option value="refunded">Reembolsado</option>
                             </select>
                             <Button className="w-full">Actualizar Orden</Button>
                         </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// 5. Coupons View (Polished)
const CouponsView = ({ settings }: { settings: StoreSettings }) => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newCode, setNewCode] = useState('');

    useEffect(() => {
        loadCoupons();
    }, []);

    const loadCoupons = async () => {
        setLoading(true);
        try {
            const data = await fetchCoupons(settings);
            setCoupons(data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if(confirm("¿Eliminar cupón?")) {
            await deleteCoupon(settings, id);
            loadCoupons();
        }
    };

    const handleCreate = async () => {
        if (!newCode) return;
        await createCoupon(settings, { 
            code: newCode, 
            amount: '10', 
            discount_type: 'percent',
            description: 'Creado desde Arandano OS'
        });
        setShowCreate(false);
        setNewCode('');
        loadCoupons();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Cupones</h1>
                <Button onClick={() => setShowCreate(true)}><Plus size={20} className="mr-2"/> Crear Cupón</Button>
            </div>

            {showCreate && (
                <Card className="mb-6 border-l-4 border-brand-500 shadow-lg">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <Input label="Código del cupón" value={newCode} onChange={e => setNewCode(e.target.value.toUpperCase())} placeholder="Ej. VERANO2024" className="mb-0" />
                        </div>
                        <Button onClick={handleCreate}>Guardar</Button>
                        <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancelar</Button>
                    </div>
                </Card>
            )}

            <Card className="overflow-hidden shadow-sm border border-gray-200 p-0">
                {loading ? <div className="p-10 flex justify-center"><div className="animate-spin h-8 w-8 border-2 border-brand-600 rounded-full border-t-transparent"/></div> : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descuento</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uso</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiración</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="p-1.5 bg-brand-50 rounded text-brand-600 mr-3">
                                                <Ticket size={16} />
                                            </div>
                                            <span className="font-mono font-bold text-gray-900">{coupon.code}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                        {coupon.discount_type === 'percent' ? `${coupon.amount}%` : `$${coupon.amount}`}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coupon.usage_count} utilizados</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {coupon.date_expires ? new Date(coupon.date_expires).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleDelete(coupon.id)} className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                            {coupons.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500 flex flex-col items-center">
                                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                            <Ticket className="h-6 w-6 text-gray-400"/>
                                        </div>
                                        No hay cupones activos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </Card>
        </div>
    )
}

// 6. Settings View (Simplified)
const SettingsView = ({ settings, onSave }: { settings: StoreSettings, onSave: (s: StoreSettings) => void }) => {
    const [localSettings, setLocalSettings] = useState(settings);

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuración</h1>
            <Card className="shadow-sm">
                <div className="space-y-6">
                    <div className="bg-brand-50 border border-brand-100 rounded-md p-4 flex items-start">
                        <div className="flex-shrink-0">
                            <CheckCircle2 className="h-5 w-5 text-brand-600" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-brand-800">Conexión Activa</h3>
                            <div className="mt-2 text-sm text-brand-700">
                                <p>Estás conectado a <strong>{settings.url}</strong>. Las credenciales se almacenan localmente en tu navegador.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4">
                        <Input 
                            label="URL de la tienda" 
                            value={localSettings.url} 
                            onChange={e => setLocalSettings({...localSettings, url: e.target.value})}
                        />
                        <Input 
                            label="Consumer Key" 
                            value={localSettings.consumerKey} 
                            onChange={e => setLocalSettings({...localSettings, consumerKey: e.target.value})}
                        />
                        <Input 
                            label="Consumer Secret" 
                            type="password"
                            value={localSettings.consumerSecret} 
                            onChange={e => setLocalSettings({...localSettings, consumerSecret: e.target.value})}
                        />
                    </div>
                    
                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <Button onClick={() => onSave(localSettings)}>Actualizar Credenciales</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

// Main App Component
const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize settings from localStorage
  useEffect(() => {
      const saved = localStorage.getItem('arandano_settings');
      if (saved) {
          try {
              setSettings(JSON.parse(saved));
          } catch (e) {
              localStorage.removeItem('arandano_settings');
          }
      }
  }, []);

  const loadData = useCallback(async () => {
      if (!settings) return;

      setLoading(true);
      setError(null);
      try {
          const [p, o] = await Promise.all([
              fetchProducts(settings),
              fetchOrders(settings)
          ]);
          setProducts(p);
          setOrders(o);
      } catch (err: any) {
          console.error("Error loading data", err);
          setError(err.message || "No se pudo conectar a la tienda.");
      } finally {
          setLoading(false);
      }
  }, [settings]);

  useEffect(() => {
      if (settings) loadData();
  }, [loadData, settings]);

  const handleConnect = (newSettings: StoreSettings) => {
      localStorage.setItem('arandano_settings', JSON.stringify(newSettings));
      setSettings(newSettings);
  };

  const handleLogout = () => {
      localStorage.removeItem('arandano_settings');
      setSettings(null);
      setView(ViewState.DASHBOARD);
  };

  const handleProductSave = async (partial: Partial<Product>) => {
      if(!settings) return;
      try {
        const saved = await saveProduct(settings, partial);
        if (editingProduct) {
            setProducts(products.map(p => p.id === editingProduct.id ? saved : p));
        } else {
            setProducts([saved, ...products]);
        }
        setView(ViewState.PRODUCTS);
        setEditingProduct(null);
      } catch(e) {
          alert("Error guardando producto. Revise la consola.");
      }
  };

  if (!settings) {
      return <Onboarding onConnect={handleConnect} />;
  }

  // --- Render Content Switcher ---
  const renderContent = () => {
      if (loading && view === ViewState.DASHBOARD) return <div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div></div>;

      if (error && view !== ViewState.SETTINGS) {
          return (
              <div className="flex flex-col items-center justify-center h-[60vh]">
                  <div className="bg-red-50 p-6 rounded-full mb-4">
                     <AlertCircle className="h-10 w-10 text-red-500"/>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Error de Sincronización</h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-md text-center mb-6">{error}</p>
                  <Button onClick={loadData} variant="secondary">Reintentar</Button>
              </div>
          );
      }

      switch (view) {
          case ViewState.DASHBOARD:
              return <DashboardView orders={orders} />;
          case ViewState.PRODUCTS:
              return (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
                        <Button onClick={() => { setEditingProduct(null); setView(ViewState.PRODUCT_EDIT); }}>
                            <Plus size={20} className="mr-2" /> Nuevo Producto
                        </Button>
                    </div>
                    
                    <Card className="overflow-hidden shadow-sm border border-gray-200 p-0">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                                            <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventario</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map(product => (
                                        <tr 
                                            key={product.id} 
                                            className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                            onClick={() => { setEditingProduct(product); setView(ViewState.PRODUCT_EDIT); }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                                                <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-12 w-12 flex-shrink-0 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                                        {product.images[0] ? <img src={product.images[0].src} alt="" className="h-full w-full object-cover"/> : <ImageIcon size={20} className="text-gray-400"/>}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">{product.name}</div>
                                                        <div className="text-xs text-gray-500">{product.categories[0]?.name || 'Sin categoría'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge status={product.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.manage_stock ? (
                                                    product.stock_quantity !== null ? 
                                                    <span className={product.stock_quantity < 10 ? 'text-orange-600 font-medium' : ''}>{product.stock_quantity} un.</span> 
                                                    : '0 un.'
                                                ) : <span className="text-gray-400">∞</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                ${product.price}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
              );
            case ViewState.PRODUCT_EDIT:
                return <ProductEditor product={editingProduct} onSave={handleProductSave} onCancel={() => setView(ViewState.PRODUCTS)} />;
            case ViewState.ORDERS:
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl font-bold text-gray-900">Ordenes</h1>
                        <Card className="overflow-hidden shadow-sm border border-gray-200 p-0">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map(order => (
                                        <tr 
                                            key={order.id} 
                                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => { setSelectedOrderId(order.id); setView(ViewState.ORDER_DETAIL); }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">#{order.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(order.date_created).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                     <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 mr-2">
                                                         {order.billing.first_name.charAt(0)}
                                                     </div>
                                                     <div className="text-sm font-medium text-gray-900">{order.billing.first_name} {order.billing.last_name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap"><Badge status={order.status} /></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                                ${order.total}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    </div>
                );
            case ViewState.ORDER_DETAIL:
                return selectedOrderId ? (
                    <OrderDetailView orderId={selectedOrderId} onBack={() => setView(ViewState.ORDERS)} settings={settings} />
                ) : <div>Seleccione una orden</div>;
            case ViewState.COUPONS:
                return <CouponsView settings={settings} />;
            case ViewState.SETTINGS:
                return <SettingsView settings={settings} onSave={handleConnect} />;
          default:
              return <div>404</div>;
      }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      <Sidebar currentView={view} setView={setView} isMobileOpen={sidebarOpen} setIsMobileOpen={setSidebarOpen} onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Topbar */}
        <header className="flex justify-between items-center py-4 px-8 bg-white border-b border-gray-200 shadow-sm z-10">
          <div className="flex items-center w-full max-w-xl">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden mr-4 text-gray-500">
              <Menu size={24} />
            </button>
            <div className="relative hidden sm:block w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                    type="text" 
                    className="block w-full pl-10 sm:text-sm border-gray-200 rounded-lg py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-100 focus:border-brand-400 transition-all" 
                    placeholder="Buscar en Arandano OS..." 
                />
            </div>
          </div>
          
          <div className="flex items-center space-x-5">
            <button className="text-gray-400 hover:text-brand-600 relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
            </button>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm shadow hover:shadow-md cursor-pointer border-2 border-white ring-1 ring-brand-200">
               A
            </div>
          </div>
        </header>

        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 scroll-smooth bg-gray-50">
            <div className="max-w-7xl mx-auto min-h-full">
                {renderContent()}
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;