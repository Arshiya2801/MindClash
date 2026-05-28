import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
    Swords, Users, Trophy, Sparkles, Eye, Brain,
    Zap, Shield, Crown, ArrowRight, Sun, Moon
} from 'lucide-react';
import ArenaBackground from '../components/3d/ArenaBackground';

const Landing = () => {
    const { theme, toggleTheme } = useTheme();
    const features = [
        {
            icon: <Swords className="w-6 h-6" />,
            title: 'Real-Time Battles',
            description: '1v1, 2v2, and Battle Royale modes with live AI scoring'
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: 'Anonymous Mode',
            description: 'Debate freely with AI-generated secret identities'
        },
        {
            icon: <Brain className="w-6 h-6" />,
            title: 'AI-Powered',
            description: 'OpenAI moderates, fact-checks, and scores every argument'
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: 'Spectate & Bet',
            description: 'Watch live debates and bet XP on your favorite debaters'
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: 'Communities',
            description: 'Join topic-based groups and compete in tournaments'
        },
        {
            icon: <Trophy className="w-6 h-6" />,
            title: 'Climb the Ranks',
            description: 'From Novice to Legend - prove your debate skills'
        },
    ];

    const stats = [
        { value: '10K+', label: 'Active Gladiators' },
        { value: '50K+', label: 'Clashes Fought' },
        { value: '1M+', label: 'Arguments Scored' },
        { value: '100%', label: 'Pure Logic' },
    ];

    const steps = [
        { step: 1, title: 'Join Arena', desc: 'Pick 1v1, 2v2, or Battle Royale' },
        { step: 2, title: 'Get Matched', desc: 'Find opponents at your skill level' },
        { step: 3, title: 'Debate!', desc: 'AI scores your arguments live' },
        { step: 4, title: 'Win XP', desc: 'Climb ranks and flex your skills' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Navbar */}
            <nav className="navbar" style={{ maxWidth: '1400px', margin: '0 auto', borderBottom: 'none' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--primary-500)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--gray-900)', fontFamily: "'Oswald', sans-serif" }}>MC</span>
                    </div>
                    <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--gray-50)', fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', letterSpacing: '2px' }}>MindClash</span>
                </Link>
                
                {/* Auth & Theme Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                        onMouseOver={(e) => { e.currentTarget.style.color = 'var(--primary-500)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = 'var(--gray-300)'; }}
                    >
                        {theme === 'dark' ? <Sun style={{ width: '20px', height: '20px' }} /> : <Moon style={{ width: '20px', height: '20px' }} />}
                    </button>

                    <Link to="/login" style={{ color: 'var(--gray-50)', fontWeight: '600', textDecoration: 'none', fontFamily: "'Oswald', sans-serif", fontSize: '15px', letterSpacing: '1px' }} className="hidden-mobile">
                        LOG IN
                    </Link>
                    <Link to="/register" className="btn-primary" style={{ fontSize: '14px', padding: '10px 20px' }}>
                        Play Free
                        <ArrowRight style={{ width: '16px', height: '16px' }} />
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{ padding: '120px 24px', background: 'transparent', borderBottom: '1px solid var(--gray-700)', position: 'relative', overflow: 'hidden' }}>
                <ArenaBackground />
                
                {/* Background Decor */}
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', fontSize: '40vw', fontWeight: '700', color: 'rgba(255,255,255,0.02)', fontFamily: "'Oswald', sans-serif", lineHeight: 0, zIndex: 0, pointerEvents: 'none' }}>
                    CLASH
                </div>
                
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Badge */}
                        <div className="badge" style={{ marginBottom: '24px' }}>
                            <Sparkles style={{ width: '14px', height: '14px' }} />
                            The Ultimate Debate Arena
                        </div>

                        {/* Main Heading */}
                        <h1 style={{
                            fontSize: 'clamp(4rem, 8vw, 6rem)',
                            fontWeight: '700',
                            fontFamily: "'Oswald', sans-serif",
                            color: 'var(--gray-50)',
                            marginBottom: '16px',
                            lineHeight: '1.1',
                            textTransform: 'uppercase'
                        }}>
                            Defy Limits. <br />
                            <span style={{ color: 'var(--primary-500)' }}>Prove Your Mind.</span>
                        </h1>

                        <p style={{
                            fontSize: '18px',
                            color: 'var(--gray-200)',
                            maxWidth: '600px',
                            margin: '0 auto 40px',
                            lineHeight: '1.7'
                        }}>
                            Challenge opponents anonymously. Let AI score your arguments in real-time. 
                            Bet XP, dominate the arena, and climb the global leaderboard.
                        </p>

                        {/* CTA Buttons */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginBottom: '80px' }}>
                            <Link to="/register">
                                <motion.button
                                    className="btn-primary"
                                    style={{ fontSize: '18px', padding: '16px 40px' }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Enter the Arena
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className="grid-4"
                        style={{ maxWidth: '900px', margin: '0 auto' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {stats.map((stat, i) => (
                            <div key={i} className="stat-card" style={{ background: 'var(--gray-900)' }}>
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '100px 24px', background: 'var(--gray-50)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <motion.div
                        style={{ textAlign: 'center', marginBottom: '60px' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '700', fontFamily: "'Oswald', sans-serif", color: 'var(--gray-900)', marginBottom: '12px', textTransform: 'uppercase' }}>
                            Why <span style={{ color: 'var(--primary-500)' }}>MindClash</span>?
                        </h2>
                        <p style={{ fontSize: '18px', color: 'var(--gray-500)', maxWidth: '500px', margin: '0 auto' }}>
                            The most advanced AI-powered debate platform on the internet.
                        </p>
                    </motion.div>

                    <div className="grid-3">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                style={{ background: '#fff', border: '1px solid var(--gray-200)', borderBottom: '4px solid var(--primary-500)', padding: '32px' }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div style={{ width: '48px', height: '48px', background: 'var(--primary-50)', color: 'var(--primary-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{ fontSize: '20px', fontWeight: '700', fontFamily: "'Oswald', sans-serif", color: 'var(--gray-900)', marginBottom: '12px', textTransform: 'uppercase' }}>
                                    {feature.title}
                                </h3>
                                <p style={{ fontSize: '15px', color: 'var(--gray-500)', lineHeight: '1.6' }}>
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section style={{ padding: '100px 24px', background: 'var(--bg-primary)' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '700', fontFamily: "'Oswald', sans-serif", color: 'var(--gray-50)', marginBottom: '60px', textTransform: 'uppercase' }}>
                        Rules of Engagement
                    </h2>

                    <div className="grid-4">
                        {steps.map((item, i) => (
                            <motion.div
                                key={i}
                                className="arena-card"
                                style={{ textAlign: 'center', background: 'var(--gray-800)' }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'var(--primary-500)',
                                    color: 'var(--gray-50)',
                                    fontWeight: '700',
                                    fontFamily: "'Oswald', sans-serif",
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px',
                                    fontSize: '20px'
                                }}>
                                    0{item.step}
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', fontFamily: "'Oswald', sans-serif", color: 'var(--gray-50)', marginBottom: '8px', textTransform: 'uppercase' }}>{item.title}</h3>
                                <p style={{ fontSize: '14px', color: 'var(--gray-200)' }}>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                padding: '32px 24px',
                textAlign: 'center',
                color: 'var(--gray-400)',
                background: 'var(--gray-900)',
                borderTop: '1px solid var(--gray-800)',
                fontSize: '14px',
                fontFamily: "'Oswald', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                <p>Made by MindClash Team • © 2024</p>
            </footer>
        </div>
    );
};

export default Landing;
