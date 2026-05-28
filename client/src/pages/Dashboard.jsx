import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { debateAPI, topicAPI } from '../services/api';
import {
    Swords, Eye, Trophy, Flame,
    Zap, TrendingUp, Play
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [liveDebates, setLiveDebates] = useState([]);
    const [trendingTopics, setTrendingTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const topicsRes = await topicAPI.getTrending().catch(() => ({ data: { topics: [] } }));
                setTrendingTopics(topicsRes.data?.topics || []);
            } catch (err) {
                console.error('Error fetching topics:', err);
            }
        };

        const fetchDebates = async () => {
            try {
                const debatesRes = await debateAPI.getLive().catch(() => ({ data: { debates: [] } }));
                setLiveDebates(debatesRes.data?.debates || []);
            } catch (err) {
                console.error('Error fetching debates:', err);
            }
        };

        const init = async () => {
            await Promise.all([fetchTopics(), fetchDebates()]);
            setLoading(false);
        };

        init();

        const interval = setInterval(fetchDebates, 10000);
        return () => clearInterval(interval);
    }, []);

    const stats = [
        { label: 'TOTAL_BATTLES', value: user?.totalDebates || 0, icon: <Swords size={20} />, color: 'var(--primary-500)' },
        { label: 'VICTORIES', value: user?.wins || 0, icon: <Trophy size={20} />, color: 'var(--accent-emerald)' },
        { label: 'WIN_RATE', value: `${user?.totalDebates > 0 ? Math.round((user.wins / user.totalDebates) * 100) : 0}%`, icon: <TrendingUp size={20} />, color: 'var(--accent-blue)' },
        { label: 'EXP_POINTS', value: user?.xp || 0, icon: <Zap size={20} />, color: 'var(--accent-amber)' },
    ];

    const quickActions = [
        {
            title: 'QUICK MATCH',
            desc: 'ENTER 1V1 ARENA',
            icon: <Swords size={28} />,
            color: 'var(--primary-500)',
            link: '/arena'
        },
        {
            title: 'SPECTATE',
            desc: 'WATCH LIVE MATCHES',
            icon: <Eye size={28} />,
            color: 'var(--accent-blue)',
            link: '/arena?tab=spectate'
        },
        {
            title: 'RANKINGS',
            desc: 'GLOBAL LEADERBOARD',
            icon: <Trophy size={28} />,
            color: 'var(--accent-amber)',
            link: '/leaderboard'
        },
    ];

    const getTierConfig = (tier) => {
        const configs = {
            'Novice': { emoji: '🌱', color: 'var(--gray-300)' },
            'Debater': { emoji: '💚', color: 'var(--accent-emerald)' },
            'Skilled': { emoji: '⭐', color: 'var(--accent-amber)' },
            'Expert': { emoji: '🔥', color: '#f97316' },
            'Master': { emoji: '💎', color: 'var(--primary-500)' },
            'Grandmaster': { emoji: '👑', color: '#8b5cf6' },
            'Legend': { emoji: '🌟', color: 'var(--accent-blue)' },
        };
        return configs[tier] || configs['Novice'];
    };

    const tierConfig = getTierConfig(user?.tier);

    // Calc XP progress manually for the circular/HUD bar
    const xpNeededForNextLevel = (user?.level || 1) * 1000;
    const currentLevelXp = (user?.xp || 0) % 1000;
    const xpPercentage = Math.min(100, Math.max(0, (currentLevelXp / xpNeededForNextLevel) * 100));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Cinematic Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="arena-card"
                style={{
                    padding: '0',
                    background: 'var(--bg-secondary)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'stretch',
                    border: '1px solid var(--gray-600)',
                    borderBottom: '4px solid var(--primary-500)',
                    minHeight: '280px'
                }}
            >
                {/* Background Decor */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 80% 50%, rgba(255, 70, 85, 0.15), transparent 50%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none' }} />
                
                {/* Content */}
                <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, zIndex: 1 }}>
                    <div className="badge pulse-element" style={{ marginBottom: '16px', background: 'rgba(255, 70, 85, 0.1)', color: 'var(--primary-500)', borderColor: 'var(--primary-500)', width: 'fit-content' }}>
                        <span style={{ width: '8px', height: '8px', background: 'var(--primary-500)', borderRadius: '50%' }} />
                        ONLINE // ACTIVE
                    </div>
                    
                    <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', lineHeight: 1.1 }}>
                        AGENT // <span className="hero-gradient-text">{user?.username}</span>
                    </h1>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: tierConfig.color }}>
                            {tierConfig.emoji} <span style={{ fontWeight: '700', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}>{user?.tier || 'NOVICE'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)' }}>
                            <span style={{ fontWeight: '700', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}>LVL {user?.level || 1}</span>
                        </div>
                    </div>
                    
                    <Link to="/arena" style={{ textDecoration: 'none', width: 'fit-content' }}>
                        <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '16px' }}>
                            <Swords size={20} />
                            ENTER THE ARENA
                        </button>
                    </Link>
                </div>
                
                {/* Holographic XP Ring */}
                <div style={{ flex: '0 0 300px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderLeft: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)', zIndex: 1 }} className="hidden-mobile">
                    <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Outer Ring */}
                        <svg width="180" height="180" viewBox="0 0 180 180" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                            <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                            <circle cx="90" cy="90" r="80" fill="none" stroke="var(--primary-500)" strokeWidth="8" strokeDasharray="502" strokeDashoffset={502 - (502 * xpPercentage) / 100} style={{ transition: 'stroke-dashoffset 1s ease-out' }} strokeLinecap="round" />
                        </svg>
                        
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--primary-500)', fontSize: '12px', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px', marginBottom: '4px' }}>EXP</div>
                            <div style={{ color: 'var(--text-primary)', fontSize: '28px', fontWeight: '700', fontFamily: "'Oswald', sans-serif" }}>{Math.round(xpPercentage)}%</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '10px', letterSpacing: '1px' }}>TO NEXT LEVEL</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Tactical Stats HUD */}
            <div className="grid-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="arena-card"
                        style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}>{stat.label}</span>
                            <div style={{ color: stat.color, filter: `drop-shadow(0 0 5px ${stat.color})` }}>
                                {stat.icon}
                            </div>
                        </div>
                        <div style={{ fontSize: '36px', fontWeight: '700', fontFamily: "'Oswald', sans-serif", color: 'var(--text-primary)', lineHeight: 1 }}>
                            {stat.value}
                        </div>
                        
                        {/* Fake micro-chart for visuals */}
                        <div style={{ height: '24px', width: '100%', marginTop: '16px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                            {[...Array(8)].map((_, j) => (
                                <div key={j} style={{ flex: 1, background: stat.color, opacity: 0.2 + (Math.random() * 0.8), height: `${Math.max(20, Math.random() * 100)}%` }} />
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-secondary)', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '2px', background: 'var(--accent-amber)' }} />
                    COMMAND CENTER
                </h2>
                <div className="grid-3">
                    {quickActions.map((action, i) => (
                        <Link key={i} to={action.link} style={{ textDecoration: 'none' }}>
                            <motion.div
                                className="arena-card"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}
                            >
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    background: `linear-gradient(135deg, transparent, color-mix(in srgb, ${action.color} 20%, transparent))`,
                                    border: `1px solid color-mix(in srgb, ${action.color} 40%, transparent)`,
                                    color: action.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    clipPath: 'polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)'
                                }}>
                                    {action.icon}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}>{action.title}</h3>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '1px' }}>{action.desc}</p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Live & Trending */}
            <div className="grid-2">
                
                {/* Live Debates Broadcast Feed */}
                <div>
                    <h2 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-secondary)', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', background: 'var(--primary-500)', borderRadius: '50%', animation: 'pulse-live 2s infinite' }} />
                        LIVE BROADCASTS
                    </h2>
                    
                    <div className="arena-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Scanning frequencies...</div>
                        ) : liveDebates.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', border: '1px dashed var(--gray-600)' }}>
                                <Play style={{ margin: '0 auto 12px', opacity: 0.5 }} size={32} />
                                <p>No live battles detected. Enter the Arena to start one.</p>
                            </div>
                        ) : (
                            liveDebates.slice(0, 3).map((debate, i) => (
                                <Link key={debate._id || i} to={`/arena?tab=spectate`} style={{ textDecoration: 'none' }}>
                                    <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s', cursor: 'pointer' }}
                                         onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                         onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                                        <div>
                                            <div style={{ fontSize: '12px', color: 'var(--primary-500)', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Flame size={12} /> {debate.topic?.title || 'Live Debate'}
                                            </div>
                                            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                                {debate.participants?.[0]?.username || 'Player 1'} <span style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '0 8px' }}>VS</span> {debate.participants?.[1]?.username || 'Player 2'}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,70,85,0.1)', color: 'var(--primary-500)', padding: '4px 10px', fontSize: '12px', fontWeight: 'bold' }}>
                                            <Eye size={14} /> LIVE
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Trending Topics Network */}
                <div>
                    <h2 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-secondary)', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '12px', height: '2px', background: 'var(--accent-blue)' }} />
                        TRENDING MATRIX
                    </h2>
                    
                    <div className="arena-card" style={{ padding: '32px', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {loading ? (
                            <div style={{ color: 'var(--text-muted)' }}>Analyzing network...</div>
                        ) : trendingTopics.length === 0 ? (
                            <div style={{ color: 'var(--text-muted)' }}>No trending data detected.</div>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                                {trendingTopics.map((topic, i) => (
                                    <div key={i} className="float-element" style={{ 
                                        animationDelay: `${i * 0.2}s`,
                                        padding: '12px 20px', 
                                        background: 'rgba(0,240,255,0.05)', 
                                        border: '1px solid rgba(0,240,255,0.2)', 
                                        color: 'var(--accent-blue)', 
                                        fontSize: `${Math.max(14, 24 - (i * 2))}px`, 
                                        fontWeight: '700', 
                                        fontFamily: "'Oswald', sans-serif",
                                        letterSpacing: '1px',
                                        textTransform: 'uppercase',
                                        boxShadow: '0 0 15px rgba(0,240,255,0.1)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,240,255,0.15)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,240,255,0.05)'}>
                                        #{topic.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
            </div>
            
        </div>
    );
};

export default Dashboard;
