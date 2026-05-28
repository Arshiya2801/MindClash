import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { marketplaceAPI, userAPI } from '../services/api';
import {
    ShoppingBag, Sparkles, Zap, Crown, Palette,
    Frame, Award, Package, Star, Check, User
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
        { id: 'all', label: 'All Items', icon: <ShoppingBag size={16} /> },
        { id: 'avatar', label: 'Avatars', icon: <Star size={16} /> },
        { id: 'frame', label: 'Frames', icon: <Frame size={16} /> },
        { id: 'badge', label: 'Badges', icon: <Award size={16} /> },
        { id: 'powerup', label: 'Power-Ups', icon: <Zap size={16} /> },
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
                { _id: '1', itemId: 'crown_gold', name: 'Golden Crown', type: 'avatar', rarity: 'legendary', price: 5000, description: 'For true champions!' },
                { _id: '2', itemId: 'frame_fire', name: 'Fire Frame', type: 'frame', rarity: 'epic', price: 2500, description: 'Burn bright in debates' },
                { _id: '3', itemId: 'badge_quick', name: 'Quick Thinker', type: 'badge', rarity: 'rare', price: 1000, description: 'Show your wit' },
                { _id: '4', itemId: 'powerup_time', name: 'Time Boost', type: 'powerUp', rarity: 'common', price: 500, description: '+30 seconds in debates' },
                { _id: '5', itemId: 'avatar_neon', name: 'Neon Avatar', type: 'avatar', rarity: 'epic', price: 3000, description: 'Glow in the dark' },
                { _id: '6', itemId: 'frame_diamond', name: 'Diamond Frame', type: 'frame', rarity: 'legendary', price: 7500, description: 'Pure luxury' },
            ]);
        }
        setLoading(false);
    };

    const handlePurchase = async (item) => {
        if (user?.xp < item.price) {
            alert('Not enough XP!');
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
            alert(`🎉 Purchased ${item.name}!`);
        } catch (err) {
            console.error('Purchase failed:', err);
            alert(err.response?.data?.message || 'Purchase failed. Try again!');
        }
        setPurchasing(null);
    };

    const handleEquip = async (item) => {
        setEquipping(item._id);
        try {
            const res = await userAPI.equipItem({ type: item.type, itemId: item.itemId });
            if (res.data?.success) {
                updateUser({ ...user, avatar: res.data.user.avatar, frame: res.data.user.frame });
                alert(`Equipped ${item.name}!`);
            }
        } catch (err) {
            console.error('Equip failed:', err);
            alert(err.response?.data?.message || 'Equip failed.');
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
            common: { label: 'Common', color: '#737373', bg: '#f5f5f5', border: '#e5e5e5' },
            rare: { label: 'Rare', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
            epic: { label: 'Epic', color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
            legendary: { label: 'Legendary', color: '#f59e0b', bg: '#fffbeb', border: '#fcd34d' },
        };
        return configs[rarity] || configs.common;
    };

    const getTypeIcon = (type) => {
        const icons = {
            avatar: <Star size={28} />,
            frame: <Frame size={28} />,
            badge: <Award size={28} />,
            powerup: <Zap size={28} />,
        };
        return icons[type] || <Package size={28} />;
    };

    // Filter items based on active tab
    const displayItems = activeTab === 'shop'
        ? items
        : items.filter(item => isOwned(item) || item.type === 'powerup'); // Inventory only shows owned or consumables

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '28px',
                            fontWeight: '700',
                            color: '#171717',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <ShoppingBag size={28} style={{ color: '#6366f1' }} />
                            <span className="text-gradient">Marketplace & Inventory</span>
                        </h1>
                        <p style={{ color: '#737373', fontSize: '14px' }}>
                            Spend your XP or manage your collection!
                        </p>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 20px',
                        background: '#fffbeb',
                        borderRadius: '16px',
                        border: '1px solid #fcd34d'
                    }}>
                        <Zap size={24} style={{ color: '#f59e0b' }} />
                        <div>
                            <p style={{ fontSize: '12px', color: '#92400e', fontWeight: '500' }}>Your Balance</p>
                            <p style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b' }}>
                                {(user?.xp || 0).toLocaleString()} XP
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs Toggle */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '24px', borderBottom: '1px solid #e5e5e5', paddingBottom: '16px' }}>
                    <button
                        onClick={() => setActiveTab('shop')}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '15px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: 'none',
                            background: activeTab === 'shop' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#f5f5f5',
                            color: activeTab === 'shop' ? '#fff' : '#737373',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <ShoppingBag size={18} />
                        Shop
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '15px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: 'none',
                            background: activeTab === 'inventory' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#f5f5f5',
                            color: activeTab === 'inventory' ? '#fff' : '#737373',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <User size={18} />
                        My Inventory
                    </button>
                </div>
            </div>

            {/* Category Filter */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        style={{
                            padding: '10px 18px',
                            borderRadius: '50px',
                            fontWeight: '500',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: category === cat.id ? 'none' : '1px solid #e5e5e5',
                            background: category === cat.id ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#fff',
                            color: category === cat.id ? '#fff' : '#525252',
                            transition: 'all 0.2s ease',
                            boxShadow: category === cat.id ? '0 4px 12px rgba(99,102,241,0.3)' : 'none'
                        }}
                    >
                        {cat.icon}
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Items Grid */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                    <div className="spinner"></div>
                </div>
            ) : displayItems.length > 0 ? (
                <div className="grid-3">
                    {displayItems.map((item, i) => {
                        const rarityConfig = getRarityConfig(item.rarity);
                        const owned = isOwned(item);
                        const equipped = isEquipped(item);
                        const canAfford = user?.xp >= item.price;
                        const isEquippable = ['avatar', 'frame'].includes(item.type);

                        return (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-card"
                                style={{
                                    textAlign: 'center',
                                    borderTop: `3px solid ${rarityConfig.color}`,
                                    position: 'relative'
                                }}
                            >
                                {/* Equipped Badge */}
                                {equipped && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        background: '#10b981',
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '8px',
                                        fontSize: '10px',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        boxShadow: '0 2px 4px rgba(16,185,129,0.3)'
                                    }}>
                                        <Check size={12} /> EQUIPPED
                                    </div>
                                )}

                                {/* Icon */}
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '16px',
                                    background: rarityConfig.bg,
                                    color: rarityConfig.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 16px',
                                    marginTop: equipped ? '24px' : '0'
                                }}>
                                    {getTypeIcon(item.type)}
                                </div>

                                {/* Rarity Badge */}
                                <span style={{
                                    display: 'inline-block',
                                    padding: '4px 12px',
                                    borderRadius: '50px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    background: rarityConfig.bg,
                                    color: rarityConfig.color,
                                    border: `1px solid ${rarityConfig.border}`,
                                    marginBottom: '12px'
                                }}>
                                    {rarityConfig.label}
                                </span>

                                {/* Name & Description */}
                                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#171717', marginBottom: '8px' }}>
                                    {item.name}
                                </h3>
                                <p style={{ fontSize: '13px', color: '#737373', marginBottom: '16px' }}>
                                    {item.description}
                                </p>

                                {/* Price & Actions */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingTop: '16px',
                                    borderTop: '1px solid #e5e5e5'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Zap size={18} style={{ color: '#f59e0b' }} />
                                        <span style={{ fontSize: '18px', fontWeight: '700', color: '#f59e0b' }}>
                                            {item.price}
                                        </span>
                                    </div>

                                    {/* Action Button */}
                                    {activeTab === 'shop' && owned ? (
                                        <button
                                            disabled
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '10px',
                                                fontWeight: '600',
                                                fontSize: '13px',
                                                background: '#f3f4f6',
                                                color: '#9ca3af',
                                                border: '1px solid #e5e7eb',
                                                cursor: 'not-allowed'
                                            }}
                                        >
                                            Owned
                                        </button>
                                    ) : activeTab === 'shop' ? (
                                        <motion.button
                                            onClick={() => handlePurchase(item)}
                                            disabled={!canAfford || purchasing === item._id}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '10px',
                                                fontWeight: '500',
                                                fontSize: '13px',
                                                cursor: canAfford ? 'pointer' : 'not-allowed',
                                                border: 'none',
                                                background: canAfford ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#e5e5e5',
                                                color: canAfford ? '#fff' : '#a3a3a3',
                                                transition: 'all 0.2s ease'
                                            }}
                                            whileHover={canAfford ? { scale: 1.05 } : {}}
                                            whileTap={canAfford ? { scale: 0.95 } : {}}
                                        >
                                            {purchasing === item._id ? (
                                                <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                                            ) : canAfford ? 'Buy' : 'Need XP'}
                                        </motion.button>
                                    ) : (
                                        /* Inventory Tab Actions */
                                        isEquippable && (
                                            <motion.button
                                                onClick={() => handleEquip(item)}
                                                disabled={equipped || equipping === item._id}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '10px',
                                                    fontWeight: '600',
                                                    fontSize: '13px',
                                                    cursor: equipped ? 'not-allowed' : 'pointer',
                                                    border: 'none',
                                                    background: equipped ? '#f3f4f6' : '#10b981',
                                                    color: equipped ? '#9ca3af' : '#fff',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                whileHover={!equipped ? { scale: 1.05 } : {}}
                                                whileTap={!equipped ? { scale: 0.95 } : {}}
                                            >
                                                {equipping === item._id ? (
                                                    <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                                                ) : equipped ? 'Equipped' : 'Equip'}
                                            </motion.button>
                                        )
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>{activeTab === 'shop' ? '🛒' : '🎒'}</div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#171717', marginBottom: '8px' }}>
                        {activeTab === 'shop' ? 'No Items Available' : 'Your Inventory is Empty'}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#737373' }}>
                        {activeTab === 'shop' ? 'Check back soon for new items!' : 'Go to the Shop to buy some items!'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Marketplace;

