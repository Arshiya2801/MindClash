import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { leaderboardAPI } from '../services/api';
import { Trophy, Crown, Medal, TrendingUp, Users, Flame, Star, Zap, Crosshair } from 'lucide-react';

const Leaderboard = () => {
    const [tab, setTab] = useState('global');
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, [tab]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            let res;
            if (tab === 'global') {
                res = await leaderboardAPI.getGlobal();
            } else if (tab === 'weekly') {
                res = await leaderboardAPI.getWeekly();
            } else {
                res = await leaderboardAPI.getAnonymous();
            }
            setLeaderboard(res.data?.leaderboard || []);
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            setLeaderboard([]);
        }
        setLoading(false);
    };

    const tabs = [
        { id: 'global', label: 'ALL TIME', icon: <Trophy size={18} /> },
        { id: 'weekly', label: 'THIS WEEK', icon: <TrendingUp size={18} /> },
        { id: 'anonymous', label: 'COVERT OPS', icon: <Users size={18} /> },
    ];

    const getRankStyle = (rank) => {
        if (rank === 1) return { border: 'var(--accent-amber)', bg: 'rgba(255, 184, 0, 0.15)', shadow: '0 0 40px rgba(255, 184, 0, 0.4)' };
        if (rank === 2) return { border: 'var(--accent-blue)', bg: 'rgba(0, 240, 255, 0.1)', shadow: '0 0 30px rgba(0, 240, 255, 0.3)' };
        if (rank === 3) return { border: 'var(--primary-500)', bg: 'rgba(255, 70, 85, 0.1)', shadow: '0 0 20px rgba(255, 70, 85, 0.2)' };
        return { border: 'var(--gray-700)', bg: 'var(--bg-secondary)', shadow: 'none' };
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return <Crown size={32} style={{ color: 'var(--accent-amber)', filter: 'drop-shadow(0 0 10px var(--accent-amber))' }} />;
        if (rank === 2) return <Medal size={28} style={{ color: 'var(--accent-blue)', filter: 'drop-shadow(0 0 10px var(--accent-blue))' }} />;
        if (rank === 3) return <Medal size={28} style={{ color: 'var(--primary-500)', filter: 'drop-shadow(0 0 10px var(--primary-500))' }} />;
        return <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-muted)', fontFamily: "'Oswald', sans-serif" }}>#{rank}</span>;
    };

    const getTierConfig = (tier) => {
        const configs = {
            'Novice': { icon: <Star size={14}/>, color: 'var(--text-muted)' },
            'Debater': { icon: <Flame size={14}/>, color: 'var(--accent-emerald)' },
            'Skilled': { icon: <Zap size={14}/>, color: 'var(--accent-amber)' },
            'Expert': { icon: <Crosshair size={14}/>, color: 'var(--primary-500)' },
            'Master': { icon: <Crown size={14}/>, color: 'var(--accent-purple)' },
            'Grandmaster': { icon: <Trophy size={14}/>, color: 'var(--accent-blue)' },
            'Legend': { icon: <Star size={14}/>, color: '#fff' }
        };
        return configs[tier] || configs['Novice'];
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Cinematic Esports Header */}
            <div className="arena-card" style={{ padding: '60px 32px', position: 'relative', overflow: 'hidden', borderBottom: '4px solid var(--accent-amber)', textAlign: 'center' }}>
                {/* Holographic Arena Background */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(255, 184, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 184, 0, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(255,184,0,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
                
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="badge pulse-element" style={{ marginBottom: '16px', background: 'rgba(255, 184, 0, 0.1)', color: 'var(--accent-amber)', borderColor: 'var(--accent-amber)' }}>
                        <Trophy size={14} /> HALL OF FAME
                    </div>
                    <h1 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: '700', color: 'var(--text-primary)', margin: 0, fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', letterSpacing: '4px', lineHeight: 1.1 }}>
                        GLOBAL <span style={{ color: 'var(--accent-amber)', textShadow: '0 0 20px rgba(255,184,0,0.5)' }}>RANKINGS</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginTop: '16px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                        THE GREATEST MINDS IN THE ARENA. ONLY THE ELITE SURVIVE.
                    </p>
                </div>
            </div>

            {/* Tactical Tab Switcher */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        style={{
                            padding: '16px 32px',
                            fontWeight: '700',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            border: tab === t.id ? '1px solid var(--accent-amber)' : '1px solid var(--gray-600)',
                            background: tab === t.id ? 'rgba(255,184,0,0.1)' : 'var(--bg-secondary)',
                            color: tab === t.id ? 'var(--accent-amber)' : 'var(--text-muted)',
                            boxShadow: tab === t.id ? '0 0 20px rgba(255,184,0,0.2)' : 'none',
                            transition: 'all 0.2s ease',
                            fontFamily: "'Oswald', sans-serif",
                            letterSpacing: '2px',
                            clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)'
                        }}
                    >
                        {t.icon}
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Leaderboard Elite Cards */}
            <div className="arena-card" style={{ padding: '32px', background: 'rgba(0,0,0,0.2)' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
                        <div style={{ color: 'var(--accent-amber)' }}><Trophy size={48} className="pulse-element" style={{ opacity: 0.5 }} /></div>
                    </div>
                ) : leaderboard.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {leaderboard.map((user, i) => {
                            const rank = i + 1;
                            const isTop3 = rank <= 3;
                            const style = getRankStyle(rank);
                            const tierConfig = getTierConfig(user.tier);

                            return (
                                <motion.div
                                    key={user._id || i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={isTop3 ? "arena-card pulse-element" : "arena-card"}
                                    style={{
                                        background: style.bg,
                                        border: `1px solid ${style.border}`,
                                        boxShadow: style.shadow,
                                        padding: isTop3 ? '24px 32px' : '16px 24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '24px',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    whileHover={{ scale: 1.02, x: 10, borderColor: style.border === 'var(--gray-700)' ? 'var(--text-muted)' : style.border }}
                                >
                                    {/* Rank Icon */}
                                    <div style={{
                                        width: '64px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        zIndex: 2
                                    }}>
                                        {getRankIcon(rank)}
                                    </div>

                                    {/* User Details */}
                                    <div style={{ flex: 1, position: 'relative', zIndex: 2 }}>
                                        <Link
                                            to={`/profile/${user.username}`}
                                            style={{
                                                fontWeight: '700',
                                                fontSize: isTop3 ? '24px' : '18px',
                                                color: 'var(--text-primary)',
                                                textDecoration: 'none',
                                                fontFamily: "'Oswald', sans-serif",
                                                letterSpacing: '1px',
                                                display: 'block',
                                                marginBottom: '4px',
                                                textShadow: isTop3 ? `0 0 10px ${style.border}` : 'none'
                                            }}
                                        >
                                            {user.username || user.anonymousAlias}
                                        </Link>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '1px' }}>
                                            <span style={{ color: tierConfig.color, display: 'flex', alignItems: 'center', gap: '4px', border: `1px solid color-mix(in srgb, ${tierConfig.color} 40%, transparent)`, background: `color-mix(in srgb, ${tierConfig.color} 10%, transparent)`, padding: '2px 8px' }}>
                                                {tierConfig.icon} {user.tier?.toUpperCase()}
                                            </span>
                                            <span>//</span>
                                            <span style={{ color: 'var(--primary-500)' }}>{user.wins || 0}W</span>
                                            <span style={{ color: 'var(--text-secondary)' }}>{user.losses || 0}L</span>
                                        </div>
                                    </div>

                                    {/* XP Hologram */}
                                    <div style={{ textAlign: 'right', position: 'relative', zIndex: 2 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                                            <Zap size={20} style={{ color: isTop3 ? style.border : 'var(--accent-amber)' }} />
                                            <span style={{ 
                                                fontSize: isTop3 ? '32px' : '24px', 
                                                fontWeight: '700', 
                                                color: 'var(--text-primary)',
                                                fontFamily: "'Oswald', sans-serif",
                                                textShadow: isTop3 ? `0 0 15px ${style.border}` : 'none'
                                            }}>
                                                {(user.xp || user.reputation || 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '12px', color: style.border, fontWeight: '700', letterSpacing: '2px', fontFamily: "'Oswald', sans-serif" }}>
                                            {tab === 'anonymous' ? 'REP POINTS' : 'EXPERIENCE'}
                                        </div>
                                    </div>

                                    {/* Decorative Slash for Top 3 */}
                                    {isTop3 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 0, right: '20%', bottom: 0, width: '100px',
                                            background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${style.border} 10%, transparent), transparent)`,
                                            transform: 'skewX(-45deg)',
                                            pointerEvents: 'none',
                                            zIndex: 1
                                        }} />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="arena-card pulse-element" style={{ padding: '80px', textAlign: 'center', border: '1px dashed var(--accent-amber)', background: 'rgba(255,184,0,0.02)' }}>
                        <Trophy size={64} style={{ color: 'var(--accent-amber)', margin: '0 auto 24px', opacity: 0.5 }} />
                        <h3 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-amber)', marginBottom: '12px', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px' }}>
                            RANKINGS OFFLINE
                        </h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            Awaiting data from the Arena. Be the first to claim the throne.
                        </p>
                        <Link to="/arena" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 32px', fontSize: '16px', background: 'var(--accent-amber)', color: '#000', fontWeight: 'bold' }}>
                            <Flame size={20} />
                            ENTER THE ARENA
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
