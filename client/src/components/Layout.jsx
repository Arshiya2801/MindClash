import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    Home, Swords, Trophy, ShoppingBag, User, Menu, X, LogOut,
    Zap, MessageSquare, Users
} from 'lucide-react';
import LevelUpModal from './LevelUpModal';

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Level Up Logic
    const prevLevelRef = useRef(user?.level);
    const [showLevelUpModal, setShowLevelUpModal] = useState(false);
    const [achievedLevel, setAchievedLevel] = useState(user?.level || 1);

    useEffect(() => {
        if (user?.level && prevLevelRef.current) {
            if (user.level > prevLevelRef.current) {
                setAchievedLevel(user.level);
                setShowLevelUpModal(true);
            }
        }
        if (user?.level) {
            prevLevelRef.current = user.level;
        }
    }, [user?.level]);

    const navItems = [
        { path: '/dashboard', label: 'Home', icon: Home },
        { path: '/arena', label: 'Arena', icon: Swords },
        { path: '/topics', label: 'Topics', icon: MessageSquare },
        { path: '/communities', label: 'Communities', icon: Users },
        { path: '/leaderboard', label: 'Rankings', icon: Trophy },
        { path: '/marketplace', label: 'Shop', icon: ShoppingBag },
    ];

    const isActive = (path) => location.pathname === path;

    const getTierColor = (tier) => {
        const colors = {
            'Novice': '#737373',
            'Debater': '#10b981',
            'Skilled': '#f59e0b',
            'Expert': '#f97316',
            'Master': '#ef4444',
            'Grandmaster': '#8b5cf6',
            'Legend': '#6366f1'
        };
        return colors[tier] || '#737373';
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Header */}
            <header className="navbar">
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                        {/* Logo */}
                        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                background: 'var(--primary-500)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--gray-900)', fontFamily: "'Oswald', sans-serif" }}>MC</span>
                            </div>
                            <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--gray-50)', fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', letterSpacing: '1px' }}>MindClash</span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden-mobile">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                                >
                                    <item.icon style={{ width: '16px', height: '16px' }} />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Right Side */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* XP Display */}
                        <div className="xp-display">
                            <Zap style={{ width: '16px', height: '16px' }} />
                            <span>{user?.xp?.toLocaleString() || 0}</span>
                        </div>

                        {/* User Menu */}
                        <Link
                            to={`/profile/${user?.username}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px 14px',
                                background: 'var(--gray-800)',
                                border: '1px solid var(--gray-600)',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div className="avatar">
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="hidden-mobile">
                                <span style={{ display: 'block', fontWeight: '700', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.5px', color: 'var(--gray-50)', fontSize: '14px', textTransform: 'uppercase' }}>
                                    {user?.username}
                                </span>
                                <span style={{ display: 'block', fontSize: '11px', color: getTierColor(user?.tier), fontWeight: '700', textTransform: 'uppercase' }}>
                                    {user?.tier || 'Novice'}
                                </span>
                            </div>
                        </Link>

                        {/* Logout */}
                        <button
                            onClick={logout}
                            style={{
                                padding: '8px',
                                background: 'var(--gray-800)',
                                border: '1px solid var(--gray-600)',
                                cursor: 'pointer',
                                color: 'var(--gray-300)',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            title="Logout"
                            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--primary-500)'; e.currentTarget.style.borderColor = 'var(--primary-500)' }}
                            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--gray-300)'; e.currentTarget.style.borderColor = 'var(--gray-600)' }}
                        >
                            <LogOut style={{ width: '18px', height: '18px' }} />
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="hidden-desktop"
                            style={{
                                padding: '8px',
                                borderRadius: '8px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            {mobileMenuOpen ?
                                <X style={{ width: '20px', height: '20px' }} /> :
                                <Menu style={{ width: '20px', height: '20px' }} />
                            }
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="hidden-desktop"
                        style={{
                            background: 'var(--gray-900)',
                            borderBottom: '1px solid var(--gray-700)',
                            padding: '16px 24px'
                        }}
                    >
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 16px',
                                        borderRadius: '10px',
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        textDecoration: 'none',
                                        background: isActive(item.path) ? '#f5f5f5' : 'transparent',
                                        color: isActive(item.path) ? '#171717' : '#737373'
                                    }}
                                >
                                    <item.icon style={{ width: '18px', height: '18px' }} />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content - CENTERED */}
            <main style={{
                width: '100%',
                maxWidth: '1200px',
                marginLeft: 'auto',
                marginRight: 'auto',
                padding: '24px'
            }}>
                <Outlet />
            </main>

            {/* Global Level Up Modal */}
            <LevelUpModal 
                isOpen={showLevelUpModal} 
                onClose={() => setShowLevelUpModal(false)} 
                level={achievedLevel} 
            />
        </div>
    );
};

export default Layout;
