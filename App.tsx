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
  AlertCircle
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
import { fetchProducts, fetchOrders, fetchCoupons, createCoupon, deleteCoupon, updateOrderStatus, saveProduct } from './services/woocommerceService';
import { generateProductDescription, analyzeSalesTrend } from './services/geminiService';
import { Button, Input, Card, Badge } from './components/Components';

// 1. Sidebar
const Sidebar = ({ currentView, setView, isMobileOpen, setIsMobileOpen }: { 
  currentView: ViewState, 
  setView: (v: ViewState) => void,
  isMobileOpen: boolean,
  setIsMobileOpen: (v: boolean) => void
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
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:inset-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        border-r border-gray-200
      `}>
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-100">
          <span className="text-xl font-bold tracking-tight text-tn-700">WooAdmin AI</span>
          <button 
            className="ml-auto md:hidden text-gray-500"
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-5 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setView(item.id); setIsMobileOpen(false); }}
              className={`
                group flex items-center px-3 py-2.5 text-sm font-medium rounded-md w-full transition-all duration-200
                ${currentView === item.id || (currentView === ViewState.PRODUCT_EDIT && item.id === ViewState.PRODUCTS) || (currentView === ViewState.ORDER_DETAIL && item.id === ViewState.ORDERS)
                  ? 'bg-tn-50 text-tn-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <item.icon 
                className={`mr-3 h-5 w-5 transition-colors duration-200 ${currentView === item.id || (currentView === ViewState.PRODUCT_EDIT && item.id === ViewState.PRODUCTS) ? 'text-tn-600' : 'text-gray-400 group-hover:text-gray-500'}`} 
              />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t bg-gray-50">
            <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-tn-200 flex items-center justify-center text-tn-700 font-bold text-sm">
                    A
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">Admin User</p>
                    <p className="text-xs text-gray-500">admin@store.com</p>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

// 2. Dashboard View
const DashboardView = ({ orders }: { orders: Order[] }) => {
  const [insight, setInsight] = useState<string>("Cargando análisis de IA...");
  
  const data = [
    { name: 'Mon', sales: 4000, orders: 24 },
    { name: 'Tue', sales: 3000, orders: 13 },
    { name: 'Wed', sales: 2000, orders: 98 },
    { name: 'Thu', sales: 2780, orders: 39 },
    { name: 'Fri', sales: 1890, orders: 48 },
    { name: 'Sat', sales: 2390, orders: 38 },
    { name: 'Sun', sales: 3490, orders: 43 },
  ];

  useEffect(() => {
      analyzeSalesTrend(data).then(setInsight);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSales = orders.reduce((acc, order) => acc + parseFloat(order.total), 0).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
          <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-50 rounded-lg p-3">
                    <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ventas Totales</dt>
                        <dd className="flex items-baseline mt-1">
                            <div className="text-2xl font-bold text-gray-900">${totalSales}</div>
                        </dd>
                    </dl>
                </div>
            </div>
        </Card>
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-50 rounded-lg p-3">
                    <Package className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ordenes</dt>
                        <dd className="flex items-baseline mt-1">
                            <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
                        </dd>
                    </dl>
                </div>
            </div>
        </Card>
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
                <div className="flex-shrink-0 bg-orange-50 rounded-lg p-3">
                    <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Clientes</dt>
                        <dd className="flex items-baseline mt-1">
                            <div className="text-2xl font-bold text-gray-900">12</div>
                        </dd>
                    </dl>
                </div>
            </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title="Resumen de Ventas" className="h-full border border-gray-200 shadow-sm">
                <div className="h-72 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(val) => `$${val}`} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                                itemStyle={{ color: '#1f2937', fontWeight: 600 }}
                            />
                            <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
          </div>

          <Card title="Insights IA" className="border border-gray-200 shadow-sm h-full">
             <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-lg h-full flex flex-col">
                 <div className="flex items-center mb-4">
                     <div className="p-2 bg-white rounded-full shadow-sm">
                        <Sparkles className="h-5 w-5 text-indigo-600" />
                     </div>
                     <h4 className="ml-3 font-semibold text-indigo-900">Análisis de Gemini</h4>
                 </div>
                 <p className="text-gray-600 italic leading-relaxed flex-grow">
                     "{insight}"
                 </p>
                 <div className="mt-6 pt-4 border-t border-indigo-100">
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">Recomendación</span>
                    <p className="text-sm text-indigo-800 mt-1">Consider activating more marketing campaigns on Wednesday.</p>
                 </div>
             </div>
          </Card>
      </div>
    </div>
  );
};

// 3. Shopify-Style Product Editor
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
                        {product ? formData.name : 'Agregar Producto'}
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
                    <Card className="shadow-sm border border-gray-200">
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
                                        className="text-xs flex items-center text-purple-600 hover:text-purple-800 font-medium"
                                    >
                                        {isGenerating ? <div className="animate-spin h-3 w-3 border-2 border-purple-600 rounded-full border-t-transparent mr-1"/> : <Sparkles size={12} className="mr-1" />}
                                        Generar con IA
                                    </button>
                                </div>
                                <textarea 
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-tn-500 focus:border-tn-500 sm:text-sm min-h-[200px]"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card title="Multimedia" className="shadow-sm border border-gray-200">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                                <ImageIcon className="h-6 w-6 text-tn-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">Agregar archivos</span>
                            <span className="text-xs text-gray-500 mt-1">Acepta imágenes, videos o modelos 3D</span>
                        </div>
                        {formData.images && formData.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-4 mt-4">
                                {formData.images.map(img => (
                                    <div key={img.id} className="relative h-24 w-24 rounded-lg overflow-hidden border border-gray-200">
                                        <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    <Card title="Variantes" className="shadow-sm border border-gray-200">
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
                                            <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white border border-gray-300">
                                                {opt}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Agregar valor (ej. Rojo)" 
                                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded"
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
                            {(!formData.attributes || formData.attributes.length === 0) && (
                                <p className="text-sm text-gray-500">Agrega opciones como tamaño o color para crear variantes de este producto.</p>
                            )}
                         </div>
                    </Card>

                    <Card title="Precios" className="shadow-sm border border-gray-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input 
                                label="Precio" 
                                type="number" 
                                placeholder="0.00"
                                value={formData.regular_price} 
                                onChange={e => setFormData({...formData, regular_price: e.target.value, price: e.target.value})} 
                            />
                            <Input 
                                label="Precio de comparación" 
                                type="number" 
                                placeholder="0.00"
                                value={formData.sale_price} 
                                onChange={e => setFormData({...formData, sale_price: e.target.value})} 
                            />
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
                            <input type="checkbox" className="rounded border-gray-300 text-tn-600 focus:ring-tn-500" />
                            Cobrar impuestos sobre este producto
                        </div>
                    </Card>

                    <Card title="Inventario" className="shadow-sm border border-gray-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input 
                                label="SKU (Stock Keeping Unit)" 
                                value={formData.sku} 
                                onChange={e => setFormData({...formData, sku: e.target.value})} 
                            />
                            <Input 
                                label="Código de barras (ISBN, GTIN, etc.)" 
                                placeholder=""
                            />
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center mb-4">
                                <input 
                                    type="checkbox" 
                                    checked={formData.manage_stock}
                                    onChange={e => setFormData({...formData, manage_stock: e.target.checked})}
                                    className="rounded border-gray-300 text-tn-600 focus:ring-tn-500 h-4 w-4" 
                                />
                                <label className="ml-2 block text-sm text-gray-900">Rastrear cantidad</label>
                            </div>
                            {formData.manage_stock && (
                                <div>
                                    <hr className="border-gray-100 mb-4"/>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Cantidad</span>
                                        <input 
                                            type="number"
                                            className="w-32 px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-tn-500 focus:border-tn-500"
                                            value={formData.stock_quantity || 0}
                                            onChange={e => setFormData({...formData, stock_quantity: parseInt(e.target.value)})}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                     <Card title="Envíos" className="shadow-sm border border-gray-200">
                        <div className="flex items-center mb-4">
                            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-tn-600 focus:ring-tn-500 h-4 w-4" />
                            <label className="ml-2 block text-sm text-gray-900">Este es un producto físico</label>
                        </div>
                        <hr className="border-gray-100 mb-4"/>
                        <div className="flex gap-4">
                             <div className="flex-1">
                                <Input 
                                    label="Peso" 
                                    placeholder="0.0"
                                    value={formData.weight}
                                    onChange={e => setFormData({...formData, weight: e.target.value})}
                                />
                             </div>
                             <div className="w-24 mt-1">
                                 <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                                 <select className="block w-full pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-tn-500 focus:border-tn-500 sm:text-sm rounded-md">
                                     <option>kg</option>
                                     <option>lb</option>
                                     <option>oz</option>
                                     <option>g</option>
                                 </select>
                             </div>
                        </div>
                    </Card>

                    <Card title="Vista previa del anuncio en buscadores" className="shadow-sm border border-gray-200">
                         <div className="space-y-1">
                             <p className="text-sm text-blue-800 hover:underline cursor-pointer font-medium">{formData.name || 'Título del producto'}</p>
                             <p className="text-xs text-green-700">https://tutienda.com/products/{formData.name?.toLowerCase().replace(/ /g, '-') || 'producto'}</p>
                             <p className="text-sm text-gray-600 truncate">{formData.description?.replace(/<[^>]*>?/gm, '') || 'Descripción del producto...'}</p>
                         </div>
                         <div className="mt-4 text-right">
                             <button className="text-sm text-tn-600 hover:underline">Editar SEO del sitio web</button>
                         </div>
                    </Card>
                </div>

                {/* Sidebar Column (Right) */}
                <div className="space-y-6">
                    <Card title="Estado del producto" className="shadow-sm border border-gray-200">
                        <select 
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-tn-500 focus:border-tn-500 sm:text-sm rounded-md mb-4"
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value as any})}
                        >
                            <option value="publish">Activo</option>
                            <option value="draft">Borrador</option>
                        </select>
                        <p className="text-xs text-gray-500">
                            Este producto estará {formData.status === 'publish' ? 'visible' : 'oculto'} en tu tienda.
                        </p>
                    </Card>

                    <Card title="Organización del producto" className="shadow-sm border border-gray-200">
                        <div className="space-y-4">
                            <Input label="Tipo de producto" placeholder="Ej. Camisetas" />
                            <Input label="Vendedor" placeholder="Ej. Nike" />
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Colecciones</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Buscar colecciones..." 
                                        className="pl-9 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-tn-500 focus:border-tn-500"
                                    />
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {formData.categories?.map(c => (
                                        <span key={c.id} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                            {c.name}
                                            <button className="ml-1.5 text-gray-400 hover:text-gray-600">
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Etiquetas</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Vintage, Algodón, Verano" 
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-tn-500 focus:border-tn-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// 4. Order Detail View
const OrderDetailView = ({ orderId, onBack }: { orderId: number, onBack: () => void }) => {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    // Using a fake ref to settings for demo purposes within this component, normally passed via context or props
    const settings = { url: '', consumerKey: '', consumerSecret: '', isDemoMode: true };

    useEffect(() => {
        fetchOrders(settings).then(orders => {
            const found = orders.find(o => o.id === orderId);
            setOrder(found || null);
            setLoading(false);
        });
    }, [orderId]);

    const handleStatusChange = async (newStatus: string) => {
        if (!order) return;
        const updated = await updateOrderStatus(settings, order.id, newStatus);
        setOrder(updated);
    };

    if (loading) return <div className="flex justify-center p-10"><div className="animate-spin h-8 w-8 border-2 border-tn-600 rounded-full border-t-transparent"/></div>;
    if (!order) return <div>Orden no encontrada</div>;

    return (
        <div className="max-w-5xl mx-auto pb-10">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="mr-4 text-gray-500 hover:text-gray-700"><ChevronLeft /></button>
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
                    <Card title="Detalles del Pedido" className="shadow-sm border border-gray-200">
                        <div className="flow-root">
                            <ul className="divide-y divide-gray-200">
                                {order.line_items.map((item) => (
                                    <li key={item.id} className="py-4 flex">
                                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            {item.image?.src ? (
                                                <img src={item.image.src} alt={item.name} className="h-full w-full object-center object-cover" />
                                            ) : (
                                                <div className="h-full w-full bg-gray-100 flex items-center justify-center"><ImageIcon size={16} className="text-gray-400"/></div>
                                            )}
                                        </div>
                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <h3>{item.name}</h3>
                                                    <p className="ml-4">${item.total}</p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">SKU: {item.sku}</p>
                                            </div>
                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                <p className="text-gray-500">Cant: {item.quantity}</p>
                                                <p className="text-gray-500">${item.price} x {item.quantity}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Totals */}
                        <div className="border-t border-gray-200 mt-6 pt-4 space-y-2">
                             <div className="flex justify-between text-sm text-gray-600">
                                 <span>Subtotal</span>
                                 <span>${(parseFloat(order.total) - order.shipping_lines.reduce((acc, l) => acc + parseFloat(l.total), 0)).toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between text-sm text-gray-600">
                                 <span>Envío</span>
                                 <span>${order.shipping_lines.reduce((acc, l) => acc + parseFloat(l.total), 0).toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                                 <span>Total</span>
                                 <span>${order.total} {order.currency}</span>
                             </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <Button variant="secondary">Reembolsar</Button>
                            <Button variant="secondary">Editar</Button>
                        </div>
                    </Card>
                    
                    <Card title="Preparación de pedidos" className="shadow-sm border border-gray-200">
                         <div className="flex items-center justify-between">
                             <div className="flex items-center">
                                 <div className="p-2 bg-yellow-50 rounded-md mr-3">
                                     <Package className="h-5 w-5 text-yellow-600"/>
                                 </div>
                                 <div>
                                     <p className="text-sm font-medium text-gray-900">Pendiente de envío</p>
                                     <p className="text-xs text-gray-500">0 de {order.line_items.length} artículos enviados</p>
                                 </div>
                             </div>
                             <Button variant="primary" className="text-sm">Preparar pedido</Button>
                         </div>
                    </Card>

                    <Card title="Línea de tiempo" className="shadow-sm border border-gray-200">
                        <div className="flex space-x-3 mb-4">
                            <Input label="" placeholder="Dejar un comentario..." className="flex-1 mb-0"/>
                            <Button variant="secondary" className="self-end h-[38px] mt-auto">Publicar</Button>
                        </div>
                        <div className="flow-root">
                            <ul className="-mb-8">
                                <li className="relative pb-8">
                                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                    <div className="relative flex space-x-3">
                                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                                            <ShoppingCart className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                            <div>
                                                <p className="text-sm text-gray-500">Orden creada desde Woocommerce</p>
                                            </div>
                                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                <time>{new Date(order.date_created).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</time>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </Card>
                </div>

                {/* Right Col */}
                <div className="space-y-6">
                    <Card title="Notas" className="shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-600 italic">{order.customer_note || "No hay notas del cliente."}</p>
                    </Card>

                    <Card title="Cliente" className="shadow-sm border border-gray-200">
                         <div className="flex items-center mb-4">
                             <div className="h-10 w-10 rounded-full bg-tn-100 flex items-center justify-center text-tn-700 font-bold mr-3">
                                 {order.billing.first_name.charAt(0)}
                             </div>
                             <div>
                                 <div className="text-sm font-medium text-gray-900">{order.billing.first_name} {order.billing.last_name}</div>
                                 <div className="text-sm text-tn-600 hover:underline cursor-pointer">Ver perfil</div>
                             </div>
                         </div>
                         <div className="space-y-3">
                             <div className="flex justify-between text-sm">
                                 <span className="text-gray-500">Contacto</span>
                                 <div className="text-right">
                                     <div className="text-gray-900">{order.billing.email}</div>
                                     <div className="text-gray-500">{order.billing.phone}</div>
                                 </div>
                             </div>
                             <hr className="border-gray-100"/>
                             <div className="flex justify-between text-sm">
                                 <span className="text-gray-500">Dirección de envío</span>
                                 <div className="text-right text-gray-900 max-w-[150px]">
                                     {order.shipping.address_1}, {order.shipping.city}, {order.shipping.state} {order.shipping.postcode}
                                 </div>
                             </div>
                             <hr className="border-gray-100"/>
                             <div className="flex justify-between text-sm">
                                 <span className="text-gray-500">Facturación</span>
                                 <div className="text-right text-gray-900">
                                     Igual a la de envío
                                 </div>
                             </div>
                         </div>
                    </Card>

                    <Card title="Acciones de Orden" className="shadow-sm border border-gray-200">
                         <div className="space-y-2">
                             <label className="text-sm text-gray-700">Cambiar Estado</label>
                             <select 
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-tn-500 focus:border-tn-500 sm:text-sm rounded-md"
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
                             <Button variant="primary" className="w-full mt-2">Actualizar</Button>
                         </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// 5. Coupons View
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
            description: 'Creado desde admin'
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

            {/* Summary Cards for Coupons */}
             <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <Card className="border border-gray-200 shadow-sm">
                    <div className="text-sm font-medium text-gray-500">Activos</div>
                    <div className="mt-1 text-2xl font-bold text-gray-900">{coupons.length}</div>
                </Card>
                <Card className="border border-gray-200 shadow-sm">
                    <div className="text-sm font-medium text-gray-500">Usos totales</div>
                    <div className="mt-1 text-2xl font-bold text-gray-900">{coupons.reduce((acc, c) => acc + c.usage_count, 0)}</div>
                </Card>
            </div>

            {showCreate && (
                <Card className="mb-6 border-l-4 border-tn-500 shadow-lg">
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
                 <div className="border-b border-gray-200 bg-gray-50 px-6 py-3 flex gap-6 text-sm font-medium text-gray-600">
                    <span className="text-tn-600 border-b-2 border-tn-600 pb-2.5 -mb-3.5 cursor-pointer">Todos</span>
                    <span className="hover:text-gray-900 cursor-pointer">Programados</span>
                    <span className="hover:text-gray-900 cursor-pointer">Caducados</span>
                </div>
                {loading ? <div className="p-8 text-center">Cargando...</div> : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uso</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiración</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-sm font-mono font-medium text-tn-700 bg-tn-50 rounded border border-tn-200">{coupon.code}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coupon.discount_type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                        {coupon.discount_type === 'percent' ? `${coupon.amount}%` : `$${coupon.amount}`}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coupon.usage_count} veces</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {coupon.date_expires ? new Date(coupon.date_expires).toLocaleDateString() : 'Nunca'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleDelete(coupon.id)} className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                            {coupons.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">No hay cupones creados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </Card>
        </div>
    )
}

// 6. Settings View
const SettingsView = ({ settings, onSave }: { settings: StoreSettings, onSave: (s: StoreSettings) => void }) => {
    const [localSettings, setLocalSettings] = useState(settings);

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuración de la Tienda</h1>
            <Card className="shadow-md border border-gray-200">
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <SettingsIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">Conexión WooCommerce</h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <p>Para conectar tu tienda, necesitas crear claves API con permisos de lectura/escritura en WooCommerce {'>'} Ajustes {'>'} Avanzado {'>'} REST API.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                        <div className="flex items-center">
                            <div className={`h-2.5 w-2.5 rounded-full mr-3 ${localSettings.isDemoMode ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
                            <div>
                                <span className="text-sm font-medium text-gray-900">Modo Demo</span>
                                <p className="text-xs text-gray-500">Usa datos simulados para probar la interfaz.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setLocalSettings(s => ({...s, isDemoMode: !s.isDemoMode}))}
                            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tn-500 ${localSettings.isDemoMode ? 'bg-tn-600' : 'bg-gray-200'}`}
                        >
                            <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${localSettings.isDemoMode ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4">
                        <Input 
                            label="URL de la tienda" 
                            value={localSettings.url} 
                            onChange={e => setLocalSettings({...localSettings, url: e.target.value})}
                            disabled={localSettings.isDemoMode}
                            placeholder="https://mitienda.com"
                        />
                        <Input 
                            label="Consumer Key" 
                            value={localSettings.consumerKey} 
                            onChange={e => setLocalSettings({...localSettings, consumerKey: e.target.value})}
                            disabled={localSettings.isDemoMode}
                            placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxx"
                        />
                        <Input 
                            label="Consumer Secret" 
                            type="password"
                            value={localSettings.consumerSecret} 
                            onChange={e => setLocalSettings({...localSettings, consumerSecret: e.target.value})}
                            disabled={localSettings.isDemoMode}
                            placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxx"
                        />
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200 flex justify-end">
                        <Button onClick={() => onSave(localSettings)}>Guardar cambios</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

// Main App Component
const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [settings, setSettings] = useState<StoreSettings>({
      url: '', consumerKey: '', consumerSecret: '', isDemoMode: true
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
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
          setError("No se pudieron cargar los datos. Verifique la configuración de su API o active el Modo Demo.");
      } finally {
          setLoading(false);
      }
  }, [settings]);

  useEffect(() => {
      loadData();
  }, [loadData]);

  const handleProductSave = async (partial: Partial<Product>) => {
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
          alert("Error guardando producto");
      }
  };

  // --- Render Content Switcher ---
  const renderContent = () => {
      if (loading && view === ViewState.DASHBOARD) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tn-600"></div></div>;

      if (error && view !== ViewState.SETTINGS) {
          return (
              <div className="text-center p-10">
                  <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4"/>
                  <h3 className="text-lg font-medium text-gray-900">Error de conexión</h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">{error}</p>
                  <div className="mt-6">
                      <Button onClick={() => setView(ViewState.SETTINGS)}>Ir a Configuración</Button>
                  </div>
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
                            <Plus size={20} className="mr-2" /> Agregar producto
                        </Button>
                    </div>
                    
                    <Card className="overflow-hidden border border-gray-200 shadow-sm p-0">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3 flex gap-6 text-sm font-medium text-gray-600">
                            <span className="text-tn-600 border-b-2 border-tn-600 pb-2.5 -mb-3.5 cursor-pointer">Todos</span>
                            <span className="hover:text-gray-900 cursor-pointer">Activos</span>
                            <span className="hover:text-gray-900 cursor-pointer">Borradores</span>
                            <span className="hover:text-gray-900 cursor-pointer">Archivados</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                                            <input type="checkbox" className="rounded border-gray-300 text-tn-600 focus:ring-tn-500" />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventario</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
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
                                                <input type="checkbox" className="rounded border-gray-300 text-tn-600 focus:ring-tn-500" />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-12 w-12 flex-shrink-0 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                                        {product.images[0] ? <img src={product.images[0].src} alt="" className="h-full w-full object-cover"/> : <ImageIcon size={20} className="text-gray-400"/>}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-semibold text-gray-900 group-hover:text-tn-600">{product.name}</div>
                                                        {product.sku && <div className="text-xs text-gray-500">SKU: {product.sku}</div>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge status={product.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.stock_quantity !== null ? 
                                                    <span className={product.stock_quantity < 10 ? 'text-orange-600 font-medium' : ''}>{product.stock_quantity} en stock</span> 
                                                    : '∞'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.categories[0]?.name || '-'}
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
                        <Card className="overflow-hidden border border-gray-200 shadow-sm p-0">
                             <div className="border-b border-gray-200 bg-gray-50 px-6 py-3 flex gap-6 text-sm font-medium text-gray-600">
                                <span className="text-tn-600 border-b-2 border-tn-600 pb-2.5 -mb-3.5 cursor-pointer">Todas</span>
                                <span className="hover:text-gray-900 cursor-pointer">Sin procesar</span>
                                <span className="hover:text-gray-900 cursor-pointer">No pagadas</span>
                            </div>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-white">
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
                                            <td className="px-6 py-4 whitespace-nowrap font-semibold text-tn-600">#{order.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(order.date_created).toLocaleDateString()} <span className="text-gray-400 text-xs">{new Date(order.date_created).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{order.billing.first_name} {order.billing.last_name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap"><Badge status={order.status} /></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                    <OrderDetailView orderId={selectedOrderId} onBack={() => setView(ViewState.ORDERS)} />
                ) : <div>Seleccione una orden</div>;
            case ViewState.COUPONS:
                return <CouponsView settings={settings} />;
            case ViewState.SETTINGS:
                return <SettingsView settings={settings} onSave={(s) => { setSettings(s); alert("Configuración guardada"); }} />;
          default:
              return <div>404</div>;
      }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans text-gray-900">
      <Sidebar currentView={view} setView={setView} isMobileOpen={sidebarOpen} setIsMobileOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Topbar */}
        <header className="flex justify-between items-center py-3 px-6 bg-white border-b border-gray-200 shadow-sm z-10">
          <div className="flex items-center w-full max-w-xl">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden mr-4 text-gray-500">
              <Menu size={24} />
            </button>
            <div className="relative rounded-md shadow-sm hidden sm:block w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                    type="text" 
                    className="focus:ring-tn-500 focus:border-tn-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 bg-gray-50 focus:bg-white transition-colors" 
                    placeholder="Buscar productos, ordenes, clientes..." 
                />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-gray-600 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-tn-600 to-tn-800 flex items-center justify-center text-white font-bold shadow-sm cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-tn-500 transition-all">
               AU
            </div>
          </div>
        </header>

        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth">
            <div className="max-w-7xl mx-auto min-h-full">
                {renderContent()}
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;