import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { communityAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, Plus, Search, Shield, Info, Network, Crosshair, Hexagon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Communities = () => {
    const { user } = useAuth();
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [newCommunity, setNewCommunity] = useState({ name: '', description: '', category: 'General', isPrivate: false });
    const [submitting, setSubmitting] = useState(false);

    const categories = ['All', 'Technology', 'Politics', 'Science', 'Philosophy', 'Entertainment', 'General'];
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        fetchCommunities();
    }, [selectedCategory, searchQuery]);

    const fetchCommunities = async () => {
        setLoading(true);
        try {
            const params = {};
            if (selectedCategory !== 'All') params.category = selectedCategory;
            if (searchQuery.length > 2) params.search = searchQuery;
            
            const res = await communityAPI.getAll(params);
            setCommunities(res.data?.communities || []);
        } catch (err) {
            console.error('Failed to fetch communities', err);
        }
        setLoading(false);
    };

    const handleCreateCommunity = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await communityAPI.create(newCommunity);
            setShowModal(false);
            setNewCommunity({ name: '', description: '', category: 'General', isPrivate: false });
            fetchCommunities();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create community');
        }
        setSubmitting(false);
    };

    const handleJoinCommunity = async (communityId) => {
        try {
            await communityAPI.join(communityId);
            fetchCommunities(); // refresh list
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to join');
        }
    };

    const getFactionColor = (category, index) => {
        const colors = [
            'var(--primary-500)', 
            'var(--accent-blue)', 
            'var(--accent-emerald)', 
            'var(--accent-purple)', 
            'var(--accent-amber)'
        ];
        switch (category?.toLowerCase()) {
            case 'technology': return 'var(--accent-blue)';
            case 'politics': return 'var(--primary-500)';
            case 'science': return 'var(--accent-emerald)';
            case 'philosophy': return 'var(--accent-purple)';
            case 'entertainment': return 'var(--accent-amber)';
            default: return colors[index % colors.length];
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Cinematic Faction Header */}
            <div className="arena-card" style={{ padding: '60px 32px', position: 'relative', overflow: 'hidden', borderBottom: '4px solid var(--accent-purple)' }}>
                {/* Holographic Network Background */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '50%', right: '-10%', transform: 'translateY(-50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
                
                {/* Decorative Network Nodes */}
                <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.1, pointerEvents: 'none' }}>
                    <line x1="10%" y1="20%" x2="40%" y2="80%" stroke="var(--accent-purple)" strokeWidth="1" />
                    <line x1="40%" y1="80%" x2="80%" y2="30%" stroke="var(--accent-purple)" strokeWidth="1" />
                    <line x1="80%" y1="30%" x2="90%" y2="70%" stroke="var(--accent-purple)" strokeWidth="1" />
                    <circle cx="10%" cy="20%" r="4" fill="var(--accent-purple)" className="pulse-element" />
                    <circle cx="40%" cy="80%" r="6" fill="var(--accent-purple)" className="pulse-element" style={{ animationDelay: '1s' }} />
                    <circle cx="80%" cy="30%" r="5" fill="var(--accent-purple)" className="pulse-element" style={{ animationDelay: '0.5s' }} />
                    <circle cx="90%" cy="70%" r="3" fill="var(--accent-purple)" className="pulse-element" style={{ animationDelay: '1.5s' }} />
                </svg>

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
                    <div>
                        <div className="badge pulse-element" style={{ marginBottom: '16px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)', borderColor: 'var(--accent-purple)' }}>
                            <Network size={14} /> GLOBAL SYNDICATE
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px', fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', letterSpacing: '2px', lineHeight: 1.1 }}>
                            <span style={{ color: 'var(--accent-purple)' }}>FACTION</span> NETWORK
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            ALIGN WITH DIGITAL GUILDS. DOMINATE THE DISCOURSE.
                        </p>
                    </div>
                    
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(139,92,246,0.5)' }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary float-element"
                        onClick={() => setShowModal(true)}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid var(--accent-purple)', color: 'var(--accent-purple)', 
                            padding: '20px 32px', fontSize: '16px', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px',
                            clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)'
                        }}
                    >
                        <Plus size={20} />
                        ESTABLISH FACTION
                    </motion.button>
                </div>

                {/* Cyber Search & Filters */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '40px', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '10px 20px', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                                    border: `1px solid ${selectedCategory === cat ? 'var(--accent-purple)' : 'rgba(255,255,255,0.1)'}`,
                                    background: selectedCategory === cat ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.03)',
                                    color: selectedCategory === cat ? 'var(--accent-purple)' : 'var(--text-muted)',
                                    transition: 'all 0.2s',
                                    fontFamily: "'Oswald', sans-serif",
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div style={{ position: 'relative', flex: 1, minWidth: '250px', maxWidth: '400px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-purple)' }} />
                        <input
                            type="text"
                            placeholder="LOCATE FACTION..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '14px 16px 14px 48px', 
                                border: '1px solid var(--accent-purple)', 
                                background: 'var(--bg-tertiary)', 
                                fontSize: '14px', 
                                color: 'var(--accent-purple)', 
                                outline: 'none',
                                fontFamily: "'Oswald', sans-serif",
                                letterSpacing: '1px',
                                transition: 'all 0.3s',
                                boxShadow: 'inset 0 0 10px rgba(139,92,246,0.1)'
                            }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 20px rgba(139,92,246,0.3), inset 0 0 10px rgba(139,92,246,0.2)'}
                            onBlur={(e) => e.target.style.boxShadow = 'inset 0 0 10px rgba(139,92,246,0.1)'}
                        />
                    </div>
                </div>
            </div>

            {/* Factions Grid */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
                    <div style={{ color: 'var(--accent-purple)' }}><Network size={48} style={{ animation: 'spin 2s linear infinite' }} /></div>
                </div>
            ) : communities.length > 0 ? (
                <div className="grid-3">
                    {communities.map((comm, i) => {
                        const factionColor = getFactionColor(comm.category, i);
                        
                        return (
                            <motion.div
                                key={comm._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="arena-card"
                                style={{ 
                                    padding: '32px', display: 'flex', flexDirection: 'column', height: '100%', 
                                    borderTop: `4px solid ${factionColor}`, position: 'relative', overflow: 'hidden'
                                }}
                                whileHover={{ scale: 1.03, y: -5, borderColor: factionColor, boxShadow: `0 15px 40px color-mix(in srgb, ${factionColor} 30%, transparent)` }}
                            >
                                {/* Faction Hologram Glow */}
                                <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: `radial-gradient(circle at top right, color-mix(in srgb, ${factionColor} 20%, transparent), transparent 70%)`, pointerEvents: 'none' }} />
                                
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' }}>
                                    <div style={{
                                        width: '64px', height: '64px', background: `color-mix(in srgb, ${factionColor} 15%, transparent)`, color: factionColor, 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold',
                                        border: `1px solid color-mix(in srgb, ${factionColor} 50%, transparent)`, clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                        fontFamily: "'Oswald', sans-serif"
                                    }}>
                                        {comm.avatar || comm.name.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px', lineHeight: 1.2 }}>{comm.name}</h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            <span style={{ fontSize: '11px', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}>
                                                <Users size={10} /> {comm.memberCount} PERSONNEL
                                            </span>
                                            {comm.isPrivate && (
                                                <span style={{ fontSize: '11px', color: 'var(--primary-500)', background: 'rgba(255,70,85,0.1)', border: '1px solid var(--primary-500)', padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}>
                                                    <Shield size={10} /> RESTRICTED
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', flex: 1, marginBottom: '24px' }}>
                                    {comm.description}
                                </p>
                                
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                                    <span style={{ 
                                        padding: '4px 12px', fontSize: '11px', fontWeight: '700', 
                                        background: `color-mix(in srgb, ${factionColor} 10%, transparent)`, color: factionColor,
                                        textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' 
                                    }}>
                                        {comm.category}
                                    </span>
                                    
                                    <button 
                                        onClick={() => handleJoinCommunity(comm._id)}
                                        style={{
                                            padding: '8px 20px', background: 'transparent', border: `1px solid ${factionColor}`, color: factionColor, fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px'
                                        }}
                                        onMouseOver={(e) => { e.currentTarget.style.background = factionColor; e.currentTarget.style.color = 'var(--bg-primary)'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = factionColor; }}
                                    >
                                        ALIGN WITH FACTION
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="arena-card pulse-element" style={{ padding: '80px 24px', textAlign: 'center', border: '1px dashed var(--accent-purple)', background: 'rgba(139,92,246,0.02)' }}>
                    <Crosshair size={64} style={{ color: 'var(--accent-purple)', margin: '0 auto 24px', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-purple)', marginBottom: '12px', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px' }}>FACTION NOT FOUND</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        No syndicates match your current sensor parameters. Establish a new one.
                    </p>
                </div>
            )}

            {/* Establish Faction Terminal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="arena-card"
                        style={{ width: '90%', maxWidth: '600px', padding: '0', border: '1px solid var(--accent-purple)', overflow: 'hidden' }}
                    >
                        <div style={{ background: 'var(--accent-purple)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Hexagon size={20} style={{ color: 'var(--bg-primary)' }} />
                            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--bg-primary)', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px', margin: 0 }}>
                                FACTION REGISTRATION TERMINAL
                            </h2>
                        </div>

                        <form onSubmit={handleCreateCommunity} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--accent-purple)', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}>FACTION DESIGNATION</label>
                                <input
                                    type="text"
                                    required
                                    minLength={3}
                                    value={newCommunity.name}
                                    onChange={e => setNewCommunity({...newCommunity, name: e.target.value})}
                                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-tertiary)', border: '1px solid rgba(139,92,246,0.2)', color: 'var(--text-primary)', outline: 'none', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}
                                    placeholder="E.G., CYBERNETICS SYNDICATE"
                                    onFocus={(e) => e.target.style.border = '1px solid var(--accent-purple)'}
                                    onBlur={(e) => e.target.style.border = '1px solid rgba(139,92,246,0.2)'}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--accent-purple)', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}>SYNDICATE CHARTER</label>
                                <textarea
                                    required
                                    value={newCommunity.description}
                                    onChange={e => setNewCommunity({...newCommunity, description: e.target.value})}
                                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-tertiary)', border: '1px solid rgba(139,92,246,0.2)', color: 'var(--text-primary)', outline: 'none', minHeight: '100px', resize: 'vertical', fontFamily: "monospace" }}
                                    placeholder="DEFINE YOUR FACTION'S PURPOSE..."
                                    onFocus={(e) => e.target.style.border = '1px solid var(--accent-purple)'}
                                    onBlur={(e) => e.target.style.border = '1px solid rgba(139,92,246,0.2)'}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--accent-purple)', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}>SECTOR CLASSIFICATION</label>
                                <select
                                    value={newCommunity.category}
                                    onChange={e => setNewCommunity({...newCommunity, category: e.target.value})}
                                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-secondary)', border: '1px solid rgba(139,92,246,0.2)', color: 'var(--text-primary)', outline: 'none', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}
                                >
                                    {categories.filter(c => c !== 'All').map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,70,85,0.05)', padding: '16px', border: '1px solid rgba(255,70,85,0.2)' }}>
                                <input 
                                    type="checkbox" 
                                    id="isPrivate" 
                                    checked={newCommunity.isPrivate}
                                    onChange={e => setNewCommunity({...newCommunity, isPrivate: e.target.checked})}
                                    style={{ transform: 'scale(1.2)', accentColor: 'var(--primary-500)' }}
                                />
                                <label htmlFor="isPrivate" style={{ fontSize: '12px', color: 'var(--primary-500)', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px', textTransform: 'uppercase' }}>
                                    RESTRICTED ACCESS (APPROVAL REQUIRED TO ALIGN)
                                </label>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '8px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: '700', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}>
                                    ABORT REGISTRATION
                                </button>
                                <button type="submit" disabled={submitting} className="btn-primary" style={{ padding: '12px 32px', background: 'var(--accent-purple)', color: 'var(--bg-primary)' }}>
                                    {submitting ? 'ESTABLISHING...' : 'CONFIRM FACTION'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Communities;
