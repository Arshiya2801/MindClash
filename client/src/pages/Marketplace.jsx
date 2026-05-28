import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { marketplaceAPI, userAPI } from '../services/api';
import {
    ShoppingBag, Sparkles, Zap, Crown, Palette,
    Frame, Award, Package, Star, Check, User, Shield, Battery
} from 'lucide-react';

const Marketplace = () => {
    const { user, updateUser } = useAuth();
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(null);
    const [equipping, setEquipping] = useState(null);
    const [activeTab, setActiveTab] = useState('shop'); // 'shop' | 'inventory'

    const categories = [
        { id: 'all', label: 'ALL MODULES', icon: <Package size={16} /> },
        { id: 'avatar', label: 'AVATARS', icon: <User size={16} /> },
        { id: 'frame', label: 'BORDERS', icon: <Frame size={16} /> },
        { id: 'badge', label: 'INSIGNIAS', icon: <Award size={16} /> },
        { id: 'powerup', label: 'TACTICS', icon: <Zap size={16} /> },
    ];

    useEffect(() => {
        fetchItems();
    }, [category]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await marketplaceAPI.getItems({ category: category === 'all' ? undefined : category });
            setItems(res.data?.items || []);
        } catch (err) {
            console.error('Error fetching items:', err);
            // Dummy fallback if API fails
            setItems([
                { _id: '1', itemId: 'crown_gold', name: 'IMPERIAL CROWN', type: 'avatar', rarity: 'legendary', price: 5000, description: 'RESTRICTED ACCESS FOR CHAMPIONS ONLY.' },
                { _id: '2', itemId: 'frame_fire', name: 'PLASMA EDGE', type: 'frame', rarity: 'epic', price: 2500, description: 'THERMAL CONTAINMENT FIELD ACTIVE.' },
                { _id: '3', itemId: 'badge_quick', name: 'SYNAPSE BOOSTER', type: 'badge', rarity: 'rare', price: 1000, description: 'ENHANCED COGNITIVE REFLEXES.' },
                { _id: '4', itemId: 'powerup_time', name: 'TEMPORAL SHIFT', type: 'powerUp', rarity: 'common', price: 500, description: '+30S TEMPORAL DILATION FIELD.' },
                { _id: '5', itemId: 'avatar_neon', name: 'CYBER GHOST', type: 'avatar', rarity: 'epic', price: 3000, description: 'STEALTH PROTOCOL ACTIVATED.' },
                { _id: '6', itemId: 'frame_diamond', name: 'QUANTUM MATRIX', type: 'frame', rarity: 'legendary', price: 7500, description: 'PURE ENERGY CRYSTALLIZATION.' },
            ]);
        }
        setLoading(false);
    };

    const handlePurchase = async (item) => {
        if (user?.xp < item.price) {
            alert('INSUFFICIENT FUNDS. ACQUIRE MORE XP.');
            return;
        }

        setPurchasing(item._id);
        try {
            const res = await marketplaceAPI.purchase(item._id);
            // Update user inventory locally to avoid refetch
            const updatedUser = { ...user, xp: user.xp - item.price };
            if (item.type === 'avatar') updatedUser.ownedAvatars = [...(user.ownedAvatars || []), item.itemId];
            if (item.type === 'frame') updatedUser.ownedFrames = [...(user.ownedFrames || []), item.itemId];
            if (item.type === 'badge') updatedUser.ownedBadges = [...(user.ownedBadges || []), item.itemId];

            updateUser(updatedUser);
            alert(`✅ ACQUIRED: ${item.name}!`);
        } catch (err) {
            console.error('Purchase failed:', err);
            alert(err.response?.data?.message || 'TRANSACTION FAILED. RETRYING.');
        }
        setPurchasing(null);
    };

    const handleEquip = async (item) => {
        setEquipping(item._id);
        try {
            const res = await userAPI.equipItem({ type: item.type, itemId: item.itemId });
            if (res.data?.success) {
                updateUser({ ...user, avatar: res.data.user.avatar, frame: res.data.user.frame });
                alert(`EQUIPPED: ${item.name}!`);
            }
        } catch (err) {
            console.error('Equip failed:', err);
            alert(err.response?.data?.message || 'EQUIP FAILED.');
        }
        setEquipping(null);
    };

    const isOwned = (item) => {
        if (item.type === 'avatar') return user?.ownedAvatars?.includes(item.itemId);
        if (item.type === 'frame') return user?.ownedFrames?.includes(item.itemId);
        if (item.type === 'badge') return user?.ownedBadges?.includes(item.itemId);
        return false; // powerups are consumable
    };

    const isEquipped = (item) => {
        if (item.type === 'avatar') return user?.avatar === item.itemId;
        if (item.type === 'frame') return user?.frame === item.itemId;
        return false;
    };

    const getRarityConfig = (rarity) => {
        const configs = {
            common: { label: 'COMMON', color: 'var(--text-muted)', border: 'var(--gray-600)', bg: 'var(--bg-secondary)', shadow: 'none', glow: 'none' },
            rare: { label: 'RARE', color: 'var(--accent-blue)', border: 'var(--accent-blue)', bg: 'rgba(0, 240, 255, 0.05)', shadow: '0 0 20px rgba(0, 240, 255, 0.2)', glow: '0 0 10px var(--accent-blue)' },
            epic: { label: 'EPIC', color: 'var(--accent-purple)', border: 'var(--accent-purple)', bg: 'rgba(139, 92, 246, 0.1)', shadow: '0 0 30px rgba(139, 92, 246, 0.3)', glow: '0 0 15px var(--accent-purple)' },
            legendary: { label: 'LEGENDARY', color: 'var(--accent-amber)', border: 'var(--accent-amber)', bg: 'rgba(255, 184, 0, 0.15)', shadow: '0 0 50px rgba(255, 184, 0, 0.5)', glow: '0 0 20px var(--accent-amber)' },
        };
        return configs[rarity?.toLowerCase()] || configs.common;
    };

    const getTypeIcon = (type, rarityColor) => {
        const icons = {
            avatar: <User size={48} />,
            frame: <Frame size={48} />,
            badge: <Award size={48} />,
            powerup: <Battery size={48} />,
        };
        return (
            <div style={{ color: rarityColor, filter: `drop-shadow(0 0 10px ${rarityColor})` }}>
                {icons[type] || <Package size={48} />}
            </div>
        );
    };

    const displayItems = activeTab === 'shop'
        ? items
        : items.filter(item => isOwned(item) || item.type === 'powerup');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Cinematic Command Center Header */}
            <div className="arena-card" style={{ padding: '60px 32px', position: 'relative', overflow: 'hidden', borderBottom: '4px solid var(--accent-emerald)' }}>
                {/* Holographic Matrix Background */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '50%', right: '-10%', transform: 'translateY(-50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
                
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '32px' }}>
                    <div>
                        <div className="badge pulse-element" style={{ marginBottom: '16px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', borderColor: 'var(--accent-emerald)' }}>
                            <ShoppingBag size={14} /> ARMORY ONLINE
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px', fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', letterSpacing: '2px', lineHeight: 1.1 }}>
                            <span style={{ color: 'var(--accent-emerald)' }}>BLACK</span> MARKET
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            ACQUIRE COSMETICS. INTIMIDATE OPPONENTS.
                        </p>
                    </div>

                    {/* Animated XP Wallet */}
                    <div className="arena-card" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        padding: '24px 32px',
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid var(--accent-amber)',
                        boxShadow: 'inset 0 0 20px rgba(255,184,0,0.1), 0 0 30px rgba(255,184,0,0.2)'
                    }}>
                        <div className="pulse-element" style={{
                            width: '50px', height: '50px', background: 'rgba(255,184,0,0.1)', border: '1px solid var(--accent-amber)', color: 'var(--accent-amber)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                        }}>
                            <Zap size={24} style={{ filter: 'drop-shadow(0 0 5px var(--accent-amber))' }} />
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px', marginBottom: '4px' }}>AVAILABLE FUNDS</p>
                            <p style={{ fontSize: '32px', fontWeight: '700', color: 'var(--accent-amber)', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px', lineHeight: 1, textShadow: '0 0 15px rgba(255,184,0,0.5)' }}>
                                {(user?.xp || 0).toLocaleString()} <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>XP</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Cyber Tab Toggle */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '40px', position: 'relative', zIndex: 1 }}>
                    <button
                        onClick={() => setActiveTab('shop')}
                        style={{
                            padding: '16px 40px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                            background: activeTab === 'shop' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${activeTab === 'shop' ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.1)'}`,
                            color: activeTab === 'shop' ? 'var(--accent-emerald)' : 'var(--text-muted)',
                            transition: 'all 0.3s', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px',
                            clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)'
                        }}
                    >
                        <ShoppingBag size={18} /> THE ARMORY
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        style={{
                            padding: '16px 40px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                            background: activeTab === 'inventory' ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${activeTab === 'inventory' ? 'var(--accent-blue)' : 'rgba(255,255,255,0.1)'}`,
                            color: activeTab === 'inventory' ? 'var(--accent-blue)' : 'var(--text-muted)',
                            transition: 'all 0.3s', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px',
                            clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)'
                        }}
                    >
                        <User size={18} /> PERSONAL CACHE
                    </button>
                </div>
            </div>

            {/* Segmented Filter Controls */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        style={{
                            padding: '12px 24px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                            border: `1px solid ${category === cat.id ? 'var(--accent-emerald)' : 'var(--gray-700)'}`,
                            background: category === cat.id ? 'rgba(16,185,129,0.1)' : 'var(--bg-secondary)',
                            color: category === cat.id ? 'var(--accent-emerald)' : 'var(--text-muted)',
                            transition: 'all 0.2s ease', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px', textTransform: 'uppercase',
                            boxShadow: category === cat.id ? '0 0 20px rgba(16,185,129,0.2)' : 'none',
                            clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                        }}
                        onMouseOver={(e) => { if(category !== cat.id) { e.currentTarget.style.borderColor = 'var(--text-muted)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                        onMouseOut={(e) => { if(category !== cat.id) { e.currentTarget.style.borderColor = 'var(--gray-700)'; e.currentTarget.style.color = 'var(--text-muted)'; } }}
                    >
                        {cat.icon}
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Rarity Holographic Product Grid */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
                    <div style={{ color: 'var(--accent-emerald)' }}><Package size={48} style={{ animation: 'pulse-live 2s infinite' }} /></div>
                </div>
            ) : displayItems.length > 0 ? (
                <div className="grid-3">
                    <AnimatePresence>
                        {displayItems.map((item, i) => {
                            const rarity = getRarityConfig(item.rarity);
                            const owned = isOwned(item);
                            const equipped = isEquipped(item);
                            
                            return (
                                <motion.div
                                    key={item._id || i}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2, delay: i * 0.05 }}
                                    className="arena-card"
                                    style={{
                                        padding: '0',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%',
                                        border: `1px solid ${rarity.border}`,
                                        background: 'var(--bg-secondary)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    whileHover={{ scale: 1.05, y: -10, boxShadow: rarity.shadow }}
                                >
                                    {/* Rarity Hologram Background */}
                                    <div style={{
                                        height: '180px',
                                        background: rarity.bg,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        borderBottom: `1px solid ${rarity.border}`
                                    }}>
                                        {/* Radial Rarity Glow */}
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: `radial-gradient(circle, color-mix(in srgb, ${rarity.color} 30%, transparent) 0%, transparent 70%)` }} />
                                        
                                        <div className={item.rarity === 'legendary' ? 'float-element' : ''} style={{ position: 'relative', zIndex: 2 }}>
                                            {getTypeIcon(item.type, rarity.color)}
                                        </div>

                                        <div style={{
                                            position: 'absolute', top: '12px', right: '12px',
                                            padding: '4px 12px', background: 'rgba(0,0,0,0.6)', border: `1px solid ${rarity.border}`,
                                            color: rarity.color, fontSize: '10px', fontWeight: '700', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px', textShadow: rarity.glow
                                        }}>
                                            {rarity.label}
                                        </div>
                                    </div>

                                    {/* Item Details */}
                                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}>
                                            {item.name}
                                        </h3>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5', flex: 1, marginBottom: '24px', fontFamily: "monospace" }}>
                                            {item.description}
                                        </p>

                                        {/* Actions */}
                                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            {owned ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontSize: '14px', fontWeight: '700', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}>
                                                    <Check size={16} /> ACQUIRED
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontSize: '18px', fontWeight: '700', fontFamily: "'Oswald', sans-serif", textShadow: '0 0 10px rgba(255,184,0,0.3)' }}>
                                                    <Zap size={18} /> {item.price.toLocaleString()}
                                                </div>
                                            )}

                                            {activeTab === 'shop' && !owned && (
                                                <button
                                                    onClick={() => handlePurchase(item)}
                                                    disabled={purchasing === item._id || user?.xp < item.price}
                                                    style={{
                                                        padding: '10px 20px', background: 'transparent', border: '1px solid var(--accent-amber)', color: 'var(--accent-amber)',
                                                        fontSize: '13px', fontWeight: '700', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px', cursor: 'pointer',
                                                        opacity: user?.xp < item.price ? 0.5 : 1
                                                    }}
                                                    onMouseOver={(e) => { if(user?.xp >= item.price) { e.currentTarget.style.background = 'var(--accent-amber)'; e.currentTarget.style.color = '#000'; } }}
                                                    onMouseOut={(e) => { if(user?.xp >= item.price) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent-amber)'; } }}
                                                >
                                                    {purchasing === item._id ? 'PROCESSING...' : 'PURCHASE'}
                                                </button>
                                            )}

                                            {(activeTab === 'inventory' || owned) && item.type !== 'powerup' && (
                                                <button
                                                    onClick={() => handleEquip(item)}
                                                    disabled={equipping === item._id || equipped}
                                                    style={{
                                                        padding: '10px 20px', background: equipped ? 'var(--accent-blue)' : 'transparent', border: '1px solid var(--accent-blue)', color: equipped ? '#000' : 'var(--accent-blue)',
                                                        fontSize: '13px', fontWeight: '700', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px', cursor: 'pointer'
                                                    }}
                                                    onMouseOver={(e) => { if(!equipped) { e.currentTarget.style.background = 'var(--accent-blue)'; e.currentTarget.style.color = '#000'; } }}
                                                    onMouseOut={(e) => { if(!equipped) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent-blue)'; } }}
                                                >
                                                    {equipping === item._id ? 'SYNCING...' : equipped ? 'EQUIPPED' : 'EQUIP'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="arena-card" style={{ padding: '80px', textAlign: 'center', border: '1px dashed var(--gray-600)' }}>
                    <Package size={64} style={{ color: 'var(--gray-600)', margin: '0 auto 24px', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px' }}>
                        {activeTab === 'shop' ? 'INVENTORY UNAVAILABLE' : 'CACHE EMPTY'}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        {activeTab === 'shop' ? 'NO ITEMS CURRENTLY MATCH YOUR SENSORS.' : 'YOU HAVE NOT ACQUIRED ANY MODULES YET.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
