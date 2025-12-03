
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { menuData } from './data';
import { MenuItem, CartItem, FilterType, Size } from './types';
import { 
  ShoppingBag, 
  Search, 
  Menu as MenuIcon, 
  X, 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Globe,
  ArrowUp,
  Star,
  Flame,
  Sparkles,
  Crown,
  LayoutGrid,
  CheckCircle,
  AlertCircle,
  Trash2,
  Plus,
  Minus,
  Eye,
  ShoppingCart,
  MessageCircle,
  Send
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

// --- Custom Icons ---

const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
  </svg>
);

// --- Sub-components placed in same file to meet constraints, usually these would be separate files ---

// --- 1. Toast Notification ---
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}
const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className={`fixed bottom-8 right-8 z-[5000] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border-r-4 min-w-[300px] backdrop-blur-md ${
        type === 'success' ? 'bg-dark-card border-green-500' : 'bg-dark-card border-red-500'
      }`}
    >
      {type === 'success' ? <CheckCircle className="text-green-500" /> : <AlertCircle className="text-red-500" />}
      <span className="font-medium text-white">{message}</span>
    </motion.div>
  );
};

// --- 2. Navbar ---
interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onSearch: (q: string) => void;
  searchTerm: string;
}
const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick, onSearch, searchTerm }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${
      scrolled ? 'bg-dark-bg/95 backdrop-blur-md border-gold/20 py-2' : 'bg-transparent border-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-3 group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img 
              src="https://res.cloudinary.com/dsi7eogpq/image/upload/e_background_removal/v1764717648/Untitled_design_pjpnyf.png" 
              alt="Logo" 
              className="w-12 h-12 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light hidden sm:block">
              النيل جورميه
            </span>
          </a>

          <div className="flex-1 max-w-md relative hidden md:block">
            <input 
              type="text" 
              placeholder="ابحث عن طبقك المفضل..."
              className="w-full bg-dark-card border border-gold/30 rounded-full py-2.5 px-10 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all placeholder:text-gray-500"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gold w-4 h-4" />
          </div>

          <button 
            onClick={onCartClick}
            className="relative w-12 h-12 rounded-full bg-dark-card border border-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-dark-bg transition-all duration-300 hover:scale-105"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
        
        {/* Category Tabs Scrollable */}
        <div className="flex gap-3 overflow-x-auto pb-2 pt-3 mt-1 scrollbar-hide">
          {menuData.map((cat, idx) => (
             <button
               key={idx}
               onClick={() => scrollToSection(`cat-${idx}`)}
               className="whitespace-nowrap px-4 py-1.5 rounded-full bg-dark-card border border-white/5 text-gray-400 text-sm font-medium hover:border-gold hover:text-gold transition-colors flex items-center gap-2"
             >
               {/* Map basic icons or use generic */}
               <span>{cat.category_ar}</span>
             </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

// --- 3. Hero Section ---
const Hero: React.FC<{ onSearch: (val: string) => void }> = ({ onSearch }) => {
  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.15)_0%,rgba(10,10,10,0)_70%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="w-48 h-48 mb-6 relative animate-[float_4s_ease-in-out_infinite]">
            <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-[spin_20s_linear_infinite]" />
            <img 
              src="https://res.cloudinary.com/dsi7eogpq/image/upload/e_background_removal/v1764717648/Untitled_design_pjpnyf.png" 
              alt="Hero Logo" 
              className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-gold via-gold-light to-gold-dark">
            النيل جورميه
          </span>
        </h1>
        <p className="text-gray-500 text-lg md:text-xl font-light mb-8 max-w-2xl">
          أشهى المأكولات المصرية الأصيلة | Nile Gourmet
        </p>

        <div className="flex flex-wrap gap-8 justify-center mb-10">
           <div className="text-center">
             <div className="text-3xl font-bold text-gold">70+</div>
             <div className="text-xs text-gray-500 uppercase tracking-wider">طبق شهي</div>
           </div>
           <div className="text-center">
             <div className="text-3xl font-bold text-gold">4.9</div>
             <div className="text-xs text-gray-500 uppercase tracking-wider">تقييم العملاء</div>
           </div>
           <div className="text-center">
             <div className="text-3xl font-bold text-gold">100%</div>
             <div className="text-xs text-gray-500 uppercase tracking-wider">طعم أصلي</div>
           </div>
        </div>

        <div className="w-full max-w-lg relative md:hidden">
            <input 
              type="text" 
              placeholder="ابحث عن طبقك المفضل..."
              className="w-full bg-dark-card border border-gold/30 rounded-full py-3 px-12 text-base focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all placeholder:text-gray-500"
              onChange={(e) => onSearch(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gold" size={20} />
        </div>
      </motion.div>
    </section>
  );
};

// --- 4. Product Card ---
interface ProductCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  onToggleFav: (id: number) => void;
  isFav: boolean;
  onOpenModal: (item: MenuItem) => void;
  delay: number;
}
const ProductCard: React.FC<ProductCardProps> = ({ item, onAdd, onToggleFav, isFav, onOpenModal, delay }) => {
  // Determine badge styling
  const getBadgeStyle = (badge: string) => {
    switch(badge) {
      case 'bestseller': return { bg: 'bg-gradient-to-r from-red-500 to-red-600', icon: <Flame size={12} />, text: 'الأكثر مبيعاً' };
      case 'new': return { bg: 'bg-gradient-to-r from-green-500 to-green-600', icon: <Sparkles size={12} />, text: 'جديد' };
      case 'special': return { bg: 'bg-gradient-to-r from-gold via-yellow-500 to-gold-dark text-black', icon: <Crown size={12} />, text: 'مميز' };
      default: return null;
    }
  };
  const badgeInfo = item.badge ? getBadgeStyle(item.badge) : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      className="group bg-dark-card rounded-[1.25rem] border border-white/5 overflow-hidden hover:border-gold/30 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300 relative flex flex-col h-full"
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={item.image[0]} 
          alt={item.name_ar} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent opacity-60" />
        
        {badgeInfo && (
          <div className={`absolute top-4 right-4 ${badgeInfo.bg} text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg`}>
            {badgeInfo.icon}
            {badgeInfo.text}
          </div>
        )}

        <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
           <button 
             onClick={() => onToggleFav(item.id)}
             className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 ${isFav ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-gold hover:text-black'}`}
           >
             <Heart size={18} fill={isFav ? "currentColor" : "none"} />
           </button>
           <button 
             onClick={() => onOpenModal(item)}
             className="w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md hover:bg-gold hover:text-black transition-all duration-300 hover:scale-110"
           >
             <Eye size={18} />
           </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gold text-center mb-1">{item.name_ar}</h3>
        <p className="text-gray-500 text-sm text-center mb-4 font-light">{item.name_en}</p>
        
        <div className="mt-auto">
          {item.sizes ? (
            <div className="space-y-2 mb-4">
              {item.sizes.map((s, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-1 last:border-0">
                  <span className="text-gray-400">{s.size_ar}</span>
                  <span className="text-gold font-bold">{s.price} درهم</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5 text-2xl font-black text-gold mb-4">
              {item.price} <span className="text-sm font-medium text-gray-400 mt-1">درهم</span>
            </div>
          )}

          <button 
            onClick={() => onAdd(item)}
            className="w-full py-3 rounded-full bg-gradient-to-r from-gold to-gold-dark text-dark-bg font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-300"
          >
            <ShoppingCart size={18} />
            أضف للسلة
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- 5. Cart Sidebar ---
interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onClear: () => void;
}
const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, items, onRemove, onUpdateQty, onClear }) => {
  const total = items.reduce((sum, item) => sum + (item.finalPrice * item.qty), 0);

  const handleCheckout = () => {
    if (items.length === 0) return;
    let message = '🍽️ *طلب جديد من النيل جورميه*\n\n';
    items.forEach(item => {
      message += `• ${item.name_ar} ${item.selectedSize ? `(${item.selectedSize.size_ar})` : ''} × ${item.qty} = ${(item.finalPrice * item.qty).toFixed(2)} درهم\n`;
    });
    message += `\n💰 *الإجمالي: ${total.toFixed(2)} درهم*`;
    const encoded = encodeURIComponent(message);
    // Updated whatsapp number: 0554099255 -> 971554099255
    window.open(`https://wa.me/971554099255?text=${encoded}`, '_blank');
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />
      <div className={`fixed top-0 left-0 h-full w-full max-w-md bg-dark-card z-[70] transition-transform duration-300 flex flex-col shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gold flex items-center gap-3">
            <ShoppingBag /> سلة الطلبات
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
              <ShoppingBag size={64} className="mb-4" />
              <p className="text-xl font-medium">السلة فارغة</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartItemId} className="flex gap-4 p-4 bg-dark-hover rounded-2xl animate-in slide-in-from-right-10 fade-in duration-300">
                <img src={item.image[0]} alt={item.name_ar} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gold text-lg line-clamp-1">{item.name_ar}</h3>
                    <button onClick={() => onRemove(item.cartItemId)} className="text-red-500 hover:bg-red-500/10 p-1 rounded-full"><Trash2 size={16} /></button>
                  </div>
                  {item.selectedSize && <p className="text-xs text-gray-400 mb-2">{item.selectedSize.size_ar}</p>}
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-gray-300">{item.finalPrice} درهم</span>
                    <div className="flex items-center gap-3 bg-dark-bg rounded-full px-2 py-1">
                      <button onClick={() => onUpdateQty(item.cartItemId, -1)} className="w-6 h-6 rounded-full bg-dark-card text-gold flex items-center justify-center hover:bg-gold hover:text-dark-bg transition-colors"><Minus size={14} /></button>
                      <span className="w-4 text-center text-sm font-bold">{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.cartItemId, 1)} className="w-6 h-6 rounded-full bg-dark-card text-gold flex items-center justify-center hover:bg-gold hover:text-dark-bg transition-colors"><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-white/10 bg-dark-card">
          <div className="flex justify-between items-center mb-6 text-xl">
            <span className="text-gray-400">الإجمالي:</span>
            <span className="font-black text-gold text-2xl">{total.toFixed(2)} درهم</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={items.length === 0}
            className="w-full py-4 rounded-full bg-gradient-to-r from-gold to-gold-dark text-dark-bg font-bold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-6 h-6" alt="WhatsApp" />
            اطلب عبر واتساب
          </button>
          {items.length > 0 && (
            <button onClick={onClear} className="w-full mt-3 py-2 text-red-500 hover:text-red-400 text-sm font-medium transition-colors">
              تفريغ السلة
            </button>
          )}
        </div>
      </div>
    </>
  );
};

// --- 6. Quick View Modal ---
interface ModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, size?: Size) => void;
}
const ProductModal: React.FC<ModalProps> = ({ item, onClose, onAddToCart }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-dark-card w-full max-w-2xl rounded-3xl overflow-hidden border border-gold/20 shadow-2xl flex flex-col max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-red-500 transition-colors">
          <X size={20} />
        </button>
        
        <div className="h-64 sm:h-80 relative shrink-0">
          <img src={item.image[0]} alt={item.name_ar} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent" />
        </div>

        <div className="p-8 flex flex-col flex-1 overflow-y-auto">
          <h2 className="text-3xl font-black text-gold mb-1">{item.name_ar}</h2>
          <p className="text-lg text-gray-500 font-light mb-6">{item.name_en}</p>
          
          <div className="mt-auto space-y-4">
             {item.sizes ? (
                <div className="grid gap-3">
                  <p className="text-gray-400 text-sm mb-1">اختر الحجم:</p>
                  {item.sizes.map((s, i) => (
                    <button 
                      key={i}
                      onClick={() => { onAddToCart(item, s); onClose(); }}
                      className="flex justify-between items-center p-4 rounded-xl bg-dark-hover border border-white/5 hover:border-gold hover:bg-white/5 transition-all group"
                    >
                      <span className="font-bold group-hover:text-gold transition-colors">{s.size_ar}</span>
                      <span className="text-gold font-bold text-lg">{s.price} درهم</span>
                    </button>
                  ))}
                </div>
             ) : (
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-gold">{item.price} <span className="text-lg text-gray-400">درهم</span></span>
                </div>
             )}
             
             {!item.sizes && (
               <button 
                 onClick={() => { onAddToCart(item); onClose(); }}
                 className="w-full py-4 rounded-full bg-gradient-to-r from-gold to-gold-dark text-dark-bg font-bold text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
               >
                 <ShoppingCart /> أضف للسلة
               </button>
             )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- 7. Footer ---
const Footer = () => (
  <footer className="bg-dark-card border-t border-gold/20 pt-16 pb-8 px-4 mt-20">
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <h4 className="text-gold font-bold text-xl mb-6 flex items-center gap-2">
            <LayoutGrid size={20} /> عن النيل جورميه
          </h4>
          <p className="text-gray-400 leading-relaxed">
            نقدم لكم أشهى المأكولات المصرية الأصيلة بجودة عالية ومذاق لا يُنسى. نستخدم أفضل المكونات الطازجة لضمان تجربة طعام استثنائية.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="https://www.instagram.com/al_nile_gourmet/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-dark-hover text-gray-400 flex items-center justify-center hover:bg-gold hover:text-dark-bg hover:-translate-y-1 transition-all">
              <Instagram size={18} />
            </a>
            <a href="https://www.facebook.com/alnilegourmet" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-dark-hover text-gray-400 flex items-center justify-center hover:bg-gold hover:text-dark-bg hover:-translate-y-1 transition-all">
              <Facebook size={18} />
            </a>
            <a href="https://www.tiktok.com/@nile.gourmet?is_from_webapp=1&sender_device=pc" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-dark-hover text-gray-400 flex items-center justify-center hover:bg-gold hover:text-dark-bg hover:-translate-y-1 transition-all">
              <TikTokIcon size={18} />
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="text-gold font-bold text-xl mb-6 flex items-center gap-2">
            <div className="w-5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
            ساعات العمل
          </h4>
          <ul className="space-y-4">
            <li className="flex justify-between text-gray-400 border-b border-white/5 pb-2">
              <span className="text-white">الأحد - الأربعاء</span>
              <span>11:00 ص - 11:00 م</span>
            </li>
            <li className="flex justify-between text-gray-400 border-b border-white/5 pb-2">
              <span className="text-white">الخميس - السبت</span>
              <span>11:00 ص - 12:00 منتصف الليل</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold font-bold text-xl mb-6 flex items-center gap-2">
            <Phone size={20} /> تواصل معنا
          </h4>
          <div className="space-y-4 text-gray-400">
            <div className="flex items-start gap-3">
              <MapPin className="text-gold shrink-0 mt-1" size={18} />
              <span>دبي الامارات المتحدة البرشا جنوب 3 ارجان بناية روز بالاس محل رقم 15</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-gold shrink-0" size={18} />
              <span dir="ltr">0554099255 - 045770810</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-gold shrink-0" size={18} />
              <span>info@nilegourmet.ae</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/5 pt-8 text-center text-gray-500 text-sm">
        <p>© 2024 <span className="text-gold font-bold">النيل جورميه</span> - جميع الحقوق محفوظة</p>
      </div>
    </div>
  </footer>
);

// --- 8. AI Chat Widget ---
const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string, chunks?: any[]}[]>([
    { role: 'model', text: 'مرحباً! أنا مساعد النيل جورميه الذكي. يمكنني مساعدتك في العثور على موقعنا أو معلومات جغرافية حول المطعم باستخدام خرائط جوجل.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userText,
        config: {
          tools: [{googleMaps: {}}],
          systemInstruction: "You are a helpful assistant for Nile Gourmet restaurant. Address: Dubai, Al Barsha South 3, Arjan, Rose Palace Building, Shop 15. Respond in Arabic. If the user asks about location, directions, or nearby places, use the Google Maps tool.",
        },
      });
      
      const text = response.text;
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      setMessages(prev => [...prev, { role: 'model', text: text || "عذراً، لم أستطع الحصول على إجابة.", chunks }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: "حدث خطأ في الاتصال بالمساعد الذكي." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 left-8 z-40 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
        title="AI Assistant"
      >
        <MessageCircle size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-40 left-8 z-50 w-80 md:w-96 bg-dark-card border border-gold/20 rounded-2xl shadow-2xl flex flex-col h-[500px] overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-800 flex justify-between items-center">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Sparkles size={16} /> مساعد الموقع الذكي
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white"><X size={18} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-bg/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-dark-hover text-gray-200 rounded-bl-none border border-white/5'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
                {msg.chunks && msg.chunks.length > 0 && (
                  <div className="mt-2 text-xs text-gray-400 max-w-[85%] bg-black/20 p-2 rounded-lg">
                    <p className="mb-1 font-bold text-gold flex items-center gap-1"><MapPin size={10} /> خرائط جوجل:</p>
                    <div className="flex flex-col gap-1">
                      {msg.chunks.map((chunk: any, i: number) => {
                        if (chunk.web?.uri) {
                           return <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-400 underline truncate"><Globe size={10} /> {chunk.web.title || 'ويب'}</a>
                        }
                        if (chunk.maps?.uri) {
                           return <a key={i} href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gold underline truncate"><MapPin size={10} /> {chunk.maps.title || 'عرض في الخرائط'}</a>
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-dark-hover p-3 rounded-2xl rounded-bl-none border border-white/5">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-white/10 bg-dark-card">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اسأل عن الموقع..."
                className="w-full bg-dark-hover border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-400 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// --- MAIN APP ---

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Initialize
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 2000);
    // Load local storage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedFav = localStorage.getItem('favorites');
    if (savedFav) setFavorites(JSON.parse(savedFav));

    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Save to local storage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cart));
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [cart, favorites, loading]);

  const showToastMsg = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
  };

  const handleAddToCart = (item: MenuItem, size?: Size) => {
    const finalPrice = size ? size.price : item.price;
    const cartItemId = `${item.id}-${size?.size_en || 'default'}`;
    
    setCart(prev => {
      const existing = prev.find(i => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map(i => i.cartItemId === cartItemId ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, cartItemId, selectedSize: size, qty: 1, finalPrice }];
    });
    
    showToastMsg(`تم إضافة ${item.name_ar} للسلة`);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart(prev => {
      const updated = prev.map(item => {
        if (item.cartItemId === id) {
          return { ...item, qty: item.qty + delta };
        }
        return item;
      });
      return updated.filter(item => item.qty > 0);
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.cartItemId !== id));
    showToastMsg('تم حذف العنصر من السلة', 'error');
  };

  const handleToggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(fid => fid !== id));
      showToastMsg('تم الإزالة من المفضلة', 'error');
    } else {
      setFavorites(prev => [...prev, id]);
      showToastMsg('تم الإضافة للمفضلة');
    }
  };

  // Filter Logic
  const filteredCategories = useMemo(() => {
    if (!searchQuery && activeFilter === 'all') return menuData;

    return menuData.map(cat => ({
      ...cat,
      items: cat.items.filter(item => {
        const matchesSearch = item.name_ar.includes(searchQuery) || item.name_en.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'all' || item.badge === activeFilter;
        
        // If searching, ignore filter tabs, just show results. 
        // If not searching, respect filter tabs.
        if (searchQuery) return matchesSearch;
        return matchesFilter;
      })
    })).filter(cat => cat.items.length > 0);
  }, [searchQuery, activeFilter]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-dark-bg flex flex-col items-center justify-center z-50">
        <div className="w-40 h-40 relative mb-8">
           <img 
              src="https://res.cloudinary.com/dsi7eogpq/image/upload/e_background_removal/v1764717648/Untitled_design_pjpnyf.png" 
              alt="Loading"
              className="w-full h-full object-contain animate-pulse" 
           />
        </div>
        <div className="text-gold text-xl font-bold mb-4">جاري تحميل القائمة...</div>
        <div className="w-64 h-1 bg-dark-card rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-gold to-gold-light w-1/2 animate-[loading_1s_ease-in-out_infinite]" />
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white selection:bg-gold selection:text-black pb-20">
      <Navbar 
        cartCount={cart.reduce((sum, i) => sum + i.qty, 0)} 
        onCartClick={() => setIsCartOpen(true)}
        searchTerm={searchQuery}
        onSearch={setSearchQuery}
      />
      
      <Hero onSearch={setSearchQuery} />

      {/* Filters */}
      <div className="sticky top-[72px] z-30 bg-dark-bg/95 backdrop-blur-md py-4 mb-8 border-b border-white/5">
        <div className="container mx-auto px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 justify-start md:justify-center min-w-max">
            {[
              { id: 'all', label: 'الكل', icon: LayoutGrid },
              { id: 'bestseller', label: 'الأكثر مبيعاً', icon: Flame },
              { id: 'special', label: 'المميز', icon: Crown },
              { id: 'new', label: 'جديد', icon: Sparkles },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as FilterType)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeFilter === f.id 
                    ? 'bg-gradient-to-r from-gold to-gold-dark text-dark-bg shadow-lg shadow-gold/20 scale-105' 
                    : 'bg-dark-card text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <f.icon size={16} />
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 space-y-20 min-h-[50vh]">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <Search size={64} className="mx-auto mb-6 text-gray-600" />
            <h3 className="text-2xl font-bold text-gray-400">لا توجد نتائج</h3>
            <p className="text-gray-500 mt-2">جرب البحث بكلمات أخرى</p>
          </div>
        ) : (
          filteredCategories.map((category, catIndex) => (
            <section key={catIndex} id={`cat-${catIndex}`} className="scroll-mt-32">
              <div className="relative h-64 rounded-3xl overflow-hidden mb-8 group">
                 <img src={category.image} alt={category.category_ar} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                 <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h2 className="text-4xl font-black text-gold mb-2 flex items-center gap-3">
                      {/* Using generic icon for simplicity, could map icons dynamically if needed */}
                      {category.category_ar}
                    </h2>
                    <p className="text-xl text-gray-300 font-light">{category.category_en}</p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-md border border-gold/20">
                      <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                      {category.items.length} طبق
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.items.map((item, index) => (
                  <ProductCard 
                    key={item.id} 
                    item={item} 
                    onAdd={(i) => i.sizes ? setSelectedItem(i) : handleAddToCart(i)} 
                    onToggleFav={handleToggleFavorite}
                    isFav={favorites.includes(item.id)}
                    onOpenModal={setSelectedItem}
                    delay={index % 4}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <Footer />

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onRemove={handleRemoveFromCart}
        onUpdateQty={handleUpdateQty}
        onClear={() => { setCart([]); showToastMsg('تم تفريغ السلة', 'error'); }}
      />
      
      <AIChatWidget />

      <AnimatePresence>
        {selectedItem && (
          <ProductModal 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 left-8 w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark text-dark-bg flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 z-40 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <ArrowUp size={24} />
      </button>

    </div>
  );
};

export default App;
