import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    Home, Swords, Trophy, ShoppingBag, User, Menu, X, LogOut,
    Zap, MessageSquare, Users, Sun, Moon
} from 'lucide-react';
import LevelUpModal from './LevelUpModal';

const Layout = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
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
            <header className="navbar" style={{ padding: '16px 24px', background: 'var(--bg-nav)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-card)', boxShadow: 'var(--shadow-xs)', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    
                    {/* Left Side: Logo */}
                    <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-start' }}>
                        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }} className="float-element">
                            <div className="pulse-element" style={{
                                width: '40px',
                                height: '40px',
                                background: 'var(--primary-500)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 15px rgba(255, 70, 85, 0.4)'
                            }}>
                                <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--gray-900)', fontFamily: "'Oswald', sans-serif" }}>MC</span>
                            </div>
                            <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', letterSpacing: '1px' }}>MindClash</span>
                        </Link>
                    </div>

                    {/* Center: Desktop Nav */}
                    <nav style={{ flex: '2', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }} className="hidden-mobile">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                                style={{
                                    padding: '12px 20px',
                                    fontSize: '15px',
                                    position: 'relative'
                                }}
                            >
                                <item.icon style={{ width: '18px', height: '18px' }} />
                                {item.label}
                                {isActive(item.path) && (
                                    <motion.div
                                        layoutId="activeNavIndicator"
                                        style={{
                                            position: 'absolute',
                                            bottom: '-1px',
                                            left: '0',
                                            right: '0',
                                            height: '2px',
                                            background: 'var(--primary-500)',
                                            boxShadow: '0 0 10px var(--primary-500)'
                                        }}
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side: Tools & Profile */}
                    <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
                        


                        {/* User Menu */}
                        <Link
                            to={`/profile/${user?.username}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '6px 12px',
                                background: 'var(--bg-tertiary)',
                                border: '1px solid var(--border-card)',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease',
                                borderRadius: '50px'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary-500)'; e.currentTarget.style.background = 'color-mix(in srgb, var(--primary-500) 5%, transparent)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-card)'; e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                        >
                            <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="hidden-mobile">
                                <span style={{ display: 'block', fontWeight: '700', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.5px', color: 'var(--text-primary)', fontSize: '13px', textTransform: 'uppercase' }}>
                                    {user?.username}
                                </span>
                                <span style={{ display: 'block', fontSize: '10px', color: getTierColor(user?.tier), fontWeight: '700', textTransform: 'uppercase' }}>
                                    {user?.tier || 'Novice'}
                                </span>
                            </div>
                        </Link>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            style={{
                                padding: '8px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--gray-300)',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            title="Toggle Theme"
                            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--primary-500)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--gray-300)'; e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                            {theme === 'dark' ? <Sun style={{ width: '20px', height: '20px' }} /> : <Moon style={{ width: '20px', height: '20px' }} />}
                        </button>

                        {/* Logout */}
                        <button
                            onClick={logout}
                            style={{
                                padding: '8px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--gray-300)',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            title="Logout"
                            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--primary-500)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--gray-300)'; e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                            <LogOut style={{ width: '20px', height: '20px' }} />
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="hidden-desktop"
                            style={{
                                padding: '8px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text-primary)'
                            }}
                        >
                            {mobileMenuOpen ?
                                <X style={{ width: '24px', height: '24px' }} /> :
                                <Menu style={{ width: '24px', height: '24px' }} />
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
