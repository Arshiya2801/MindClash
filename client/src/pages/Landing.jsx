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
            <nav className="navbar" style={{ padding: '16px 24px', background: 'transparent', borderBottom: 'none', position: 'relative', zIndex: 10 }}>
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
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }} className="float-element">
                            <div className="pulse-element" style={{
                                width: '40px',
                                height: '40px',
                                background: 'var(--primary-500)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 15px rgba(255, 70, 85, 0.4)'
                            }}>
                                <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--gray-900)', fontFamily: "'Oswald', sans-serif" }}>MC</span>
                            </div>
                            <span style={{ fontSize: '22px', fontWeight: '700', color: 'var(--gray-50)', fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', letterSpacing: '2px' }}>MindClash</span>
                        </Link>
                    </div>

                    {/* Center: Empty for Landing Page balancing */}
                    <div style={{ flex: '1' }}></div>
                    
                    {/* Right Side: Auth & Theme Toggle */}
                    <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px' }}>
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

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <Link to="/login" style={{ color: 'var(--gray-50)', fontWeight: '600', textDecoration: 'none', fontFamily: "'Oswald', sans-serif", fontSize: '15px', letterSpacing: '1px' }} className="hidden-mobile">
                                LOG IN
                            </Link>
                            <Link to="/register" className="btn-primary" style={{ fontSize: '14px', padding: '10px 24px' }}>
                                Play Free
                                <ArrowRight style={{ width: '16px', height: '16px' }} />
                            </Link>
                        </div>
                    </div>
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
            <section style={{ padding: '120px 24px', background: 'var(--bg-secondary)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--primary-500), transparent)', opacity: 0.3 }} />
                
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <motion.div
                        style={{ textAlign: 'center', marginBottom: '80px' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '700', fontFamily: "'Oswald', sans-serif", color: 'var(--gray-50)', marginBottom: '16px', textTransform: 'uppercase', lineHeight: 1.1 }}>
                            Why <span className="hero-gradient-text">MindClash</span>?
                        </h2>
                        <p style={{ fontSize: '18px', color: 'var(--gray-300)', maxWidth: '600px', margin: '0 auto' }}>
                            The most advanced AI-powered debate platform on the internet. Built for competitors.
                        </p>
                    </motion.div>

                    <div className="grid-3">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                className="premium-feature-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="glow-icon-container">
                                    {feature.icon}
                                </div>
                                <h3 style={{ fontSize: '22px', fontWeight: '700', fontFamily: "'Oswald', sans-serif", color: 'var(--text-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {feature.title}
                                </h3>
                                <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
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
            {/* The Future of Competitive Debate */}
            <section style={{ padding: '120px 24px', background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px' }}>
                    
                    {/* Left Typography */}
                    <motion.div 
                        style={{ flex: '1 1 500px' }}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="badge" style={{ marginBottom: '16px', background: 'rgba(0,240,255,0.1)', color: 'var(--accent-blue)', borderColor: 'var(--accent-blue)' }}>
                            <Brain style={{ width: '14px', height: '14px' }} />
                            Next-Gen Esports
                        </div>
                        <h2 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: '700', fontFamily: "'Oswald', sans-serif", color: 'var(--text-primary)', marginBottom: '24px', lineHeight: '1.1', textTransform: 'uppercase' }}>
                            The Future of <br/>
                            <span style={{ color: 'var(--accent-blue)' }}>Competitive Debate</span>
                        </h2>
                        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.8' }}>
                            We are transforming debate into a digital colosseum. Experience AI-powered moderation, live audience reactions, real-time analytics, and global matchmaking. Build your reputation and climb to the rank of Legend.
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {['Real-time AI Argument Scoring', 'Live Audience Betting & Voting', 'Global Matchmaking & Tournaments'].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '24px', height: '24px', background: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                                        <ArrowRight style={{ width: '14px', height: '14px', color: '#0f1923' }} />
                                    </div>
                                    <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Holographic HUD */}
                    <motion.div 
                        style={{ flex: '1 1 500px', position: 'relative' }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="holographic-panel">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(0,240,255,0.2)', paddingBottom: '16px' }}>
                                <div style={{ color: 'var(--accent-blue)', fontFamily: "'Oswald', sans-serif", fontSize: '20px', letterSpacing: '2px' }}>LIVE // BATTLE_ROYALE</div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', background: 'var(--primary-500)', borderRadius: '50%', boxShadow: '0 0 10px var(--primary-500)' }} />
                                    <span style={{ color: 'var(--primary-500)', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>REC</span>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                                <div style={{ flex: 1, background: 'rgba(255,70,85,0.1)', border: '1px solid rgba(255,70,85,0.3)', padding: '16px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--primary-500)', letterSpacing: '1px', marginBottom: '8px' }}>RED_TEAM</div>
                                    <div style={{ fontSize: '32px', fontFamily: "'Oswald', sans-serif", color: 'var(--gray-50)' }}>42.8%</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--gray-400)', fontSize: '24px', fontFamily: "'Oswald', sans-serif" }}>VS</div>
                                <div style={{ flex: 1, background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.3)', padding: '16px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--accent-blue)', letterSpacing: '1px', marginBottom: '8px' }}>BLUE_TEAM</div>
                                    <div style={{ fontSize: '32px', fontFamily: "'Oswald', sans-serif", color: 'var(--gray-50)' }}>57.2%</div>
                                </div>
                            </div>
                            
                            <div style={{ height: '4px', background: 'var(--gray-800)', width: '100%', display: 'flex' }}>
                                <div style={{ width: '42.8%', background: 'var(--primary-500)', boxShadow: '0 0 10px var(--primary-500)' }} />
                                <div style={{ width: '57.2%', background: 'var(--accent-blue)', boxShadow: '0 0 10px var(--accent-blue)' }} />
                            </div>
                        </div>
                        
                        {/* Decorative background glow */}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '300px', background: 'rgba(0,240,255,0.15)', filter: 'blur(80px)', zIndex: -1, pointerEvents: 'none' }} />
                    </motion.div>

                </div>
            </section>

            {/* Premium Footer */}
            <footer className="premium-footer">
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="grid-4" style={{ marginBottom: '60px', gap: '40px' }}>
                        {/* Brand Column */}
                        <div style={{ gridColumn: 'span 1' }}>
                            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '24px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'var(--primary-500)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 0 15px rgba(255, 70, 85, 0.4)'
                                }}>
                                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--gray-900)', fontFamily: "'Oswald', sans-serif" }}>MC</span>
                                </div>
                                <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--gray-50)', fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', letterSpacing: '2px' }}>MindClash</span>
                            </Link>
                            <p style={{ color: 'var(--gray-300)', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
                                The digital colosseum for intellectual battles. Powered by AI, driven by competition.
                            </p>
                        </div>
                        
                        {/* Links Column */}
                        <div>
                            <h4 style={{ color: 'var(--gray-50)', marginBottom: '24px', fontSize: '16px', letterSpacing: '1px' }}>PLATFORM</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <Link to="/arena" className="footer-link">Enter Arena</Link>
                                <Link to="/leaderboard" className="footer-link">Global Rankings</Link>
                                <Link to="/marketplace" className="footer-link">Marketplace</Link>
                            </div>
                        </div>

                        {/* Links Column */}
                        <div>
                            <h4 style={{ color: 'var(--gray-50)', marginBottom: '24px', fontSize: '16px', letterSpacing: '1px' }}>COMMUNITY</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <a href="#" className="footer-link">Discord Server</a>
                                <a href="#" className="footer-link">Tournaments</a>
                                <a href="#" className="footer-link">Clans & Teams</a>
                            </div>
                        </div>
                        
                        {/* Newsletter Column */}
                        <div>
                            <h4 style={{ color: 'var(--gray-50)', marginBottom: '24px', fontSize: '16px', letterSpacing: '1px' }}>STAY UPDATED</h4>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input 
                                    type="email" 
                                    placeholder="ENTER EMAIL" 
                                    style={{ background: 'var(--gray-800)', border: '1px solid var(--gray-600)', padding: '12px 16px', color: 'var(--gray-50)', flex: 1, fontFamily: "'Oswald', sans-serif", fontSize: '14px', letterSpacing: '1px', outline: 'none' }}
                                />
                                <button style={{ background: 'var(--primary-500)', border: 'none', width: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                                    <ArrowRight style={{ color: 'var(--gray-900)', width: '20px', height: '20px' }} />
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ borderTop: '1px solid var(--gray-700)', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ color: 'var(--gray-400)', fontSize: '14px' }}>
                            © 2026 MindClash. All rights reserved.
                        </div>
                        <div style={{ display: 'flex', gap: '24px' }}>
                            <a href="#" className="footer-link" style={{ fontSize: '13px' }}>PRIVACY POLICY</a>
                            <a href="#" className="footer-link" style={{ fontSize: '13px' }}>TERMS OF SERVICE</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
