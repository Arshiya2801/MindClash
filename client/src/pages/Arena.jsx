import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { joinQueue, leaveQueue, getSocket } from '../services/socket';
import { debateAPI } from '../services/api';
import {
    Swords, Users, Crown, Eye, Shield, Timer,
    Play, Square, Sparkles, Zap, Target, Flame, Radar
} from 'lucide-react';

const Arena = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [tab, setTab] = useState('play');
    const [matchType, setMatchType] = useState('1v1');
    const [anonymous, setAnonymous] = useState(false);
    const [inQueue, setInQueue] = useState(false);
    const [queueTime, setQueueTime] = useState(0);
    const [liveDebates, setLiveDebates] = useState([]);
    const [loading, setLoading] = useState(false);

    const matchTypes = [
        {
            type: '1v1',
            title: '1v1 DUEL',
            desc: 'CLASSIC HEAD-TO-HEAD',
            icon: <Swords size={32} />,
            color: 'var(--primary-500)',
            bgImage: 'radial-gradient(circle at top right, rgba(255,70,85,0.2), transparent 70%)'
        },
        {
            type: '2v2',
            title: '2v2 SQUAD',
            desc: 'TACTICAL TEAM BATTLE',
            icon: <Users size={32} />,
            color: 'var(--accent-blue)',
            bgImage: 'radial-gradient(circle at top right, rgba(0,240,255,0.2), transparent 70%)'
        },
        {
            type: 'battleRoyale',
            title: 'ROYALE',
            desc: 'LAST MIND STANDING',
            icon: <Crown size={32} />,
            color: 'var(--accent-amber)',
            bgImage: 'radial-gradient(circle at top right, rgba(255,184,0,0.2), transparent 70%)'
        },
    ];

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const onMatchFound = (data) => {
            console.log('🎯 match_found received:', data);
            setInQueue(false);
            navigate(`/debate/${data.debateId}`);
        };

        const onQueueUpdate = (data) => {
            console.log('Queue update:', data);
        };

        socket.on('match_found', onMatchFound);
        socket.on('queue_update', onQueueUpdate);

        return () => {
            socket.off('match_found', onMatchFound);
            socket.off('queue_update', onQueueUpdate);
        };
    }, [navigate]);

    useEffect(() => {
        let timer;
        if (inQueue) {
            timer = setInterval(() => setQueueTime(t => t + 1), 1000);
        }
        return () => clearInterval(timer);
    }, [inQueue]);

    const fetchLiveDebates = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        try {
            const res = await debateAPI.getLive();
            setLiveDebates(res.data?.debates || []);
        } catch (err) {
            console.error('Error fetching debates:', err);
        }
        if (!isBackground) setLoading(false);
    };

    useEffect(() => {
        let interval;
        if (tab === 'spectate') {
            fetchLiveDebates();
            interval = setInterval(() => fetchLiveDebates(true), 10000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [tab]);

    const handleFindMatch = () => {
        setInQueue(true);
        setQueueTime(0);
        console.log('🎮 Joining queue:', { type: matchType, isAnonymous: anonymous });
        joinQueue({
            type: matchType,
            isAnonymous: anonymous,
        });
    };

    const handleCancelQueue = () => {
        setInQueue(false);
        leaveQueue();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Cinematic Header */}
            <div className="arena-card" style={{ padding: '60px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden', borderBottom: '4px solid var(--primary-500)' }}>
                {/* Background Decor */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200vw', height: '100px', background: 'radial-gradient(ellipse at center, rgba(255,70,85,0.1) 0%, transparent 50%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
                
                {/* Rotating SVG Ring */}
                <svg width="200" height="200" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.05, pointerEvents: 'none' }}>
                    <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="1" strokeDasharray="10 15" className="spin-slow" style={{ transformOrigin: 'center', animation: 'spin 20s linear infinite' }} />
                    <circle cx="100" cy="100" r="70" fill="none" stroke="var(--primary-500)" strokeWidth="2" strokeDasharray="40 60" className="spin-slow-reverse" style={{ transformOrigin: 'center', animation: 'spin 15s linear infinite reverse' }} />
                </svg>

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="badge pulse-element" style={{ marginBottom: '16px', background: 'rgba(255, 70, 85, 0.1)', color: 'var(--primary-500)', borderColor: 'var(--primary-500)' }}>
                        <Zap size={14} /> SYSTEM ENGAGED
                    </div>
                    <h1 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: '700', fontFamily: "'Oswald', sans-serif", color: 'var(--text-primary)', margin: 0, lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '4px' }}>
                        THE <span className="hero-gradient-text">ARENA</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginTop: '16px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        SELECT PROTOCOL. ENGAGE MINDS. DESTROY LOGIC.
                    </p>
                </div>
            </div>

            {/* Tactical Tab Switcher */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button
                    onClick={() => setTab('play')}
                    style={{
                        padding: '16px 40px',
                        fontWeight: '700',
                        fontSize: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        border: tab === 'play' ? '1px solid var(--primary-500)' : '1px solid var(--gray-600)',
                        background: tab === 'play' ? 'rgba(255,70,85,0.1)' : 'var(--bg-secondary)',
                        color: tab === 'play' ? 'var(--primary-500)' : 'var(--text-muted)',
                        boxShadow: tab === 'play' ? '0 0 20px rgba(255,70,85,0.2)' : 'none',
                        transition: 'all 0.2s ease',
                        fontFamily: "'Oswald', sans-serif",
                        letterSpacing: '2px',
                        clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)'
                    }}
                >
                    <Swords size={20} />
                    PLAY
                </button>
                <button
                    onClick={() => setTab('spectate')}
                    style={{
                        padding: '16px 40px',
                        fontWeight: '700',
                        fontSize: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        border: tab === 'spectate' ? '1px solid var(--accent-blue)' : '1px solid var(--gray-600)',
                        background: tab === 'spectate' ? 'rgba(0,240,255,0.1)' : 'var(--bg-secondary)',
                        color: tab === 'spectate' ? 'var(--accent-blue)' : 'var(--text-muted)',
                        boxShadow: tab === 'spectate' ? '0 0 20px rgba(0,240,255,0.2)' : 'none',
                        transition: 'all 0.2s ease',
                        fontFamily: "'Oswald', sans-serif",
                        letterSpacing: '2px',
                        clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)'
                    }}
                >
                    <Eye size={20} />
                    SPECTATE
                </button>
            </div>

            {tab === 'play' ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
                >
                    {/* Cinematic Match Types */}
                    <div className="grid-3">
                        {matchTypes.map((match) => (
                            <motion.div
                                key={match.type}
                                onClick={() => !inQueue && setMatchType(match.type)}
                                className="arena-card"
                                style={{
                                    padding: '40px 24px',
                                    textAlign: 'center',
                                    cursor: inQueue ? 'not-allowed' : 'pointer',
                                    opacity: inQueue ? 0.5 : 1,
                                    border: matchType === match.type ? `2px solid ${match.color}` : '1px solid var(--gray-600)',
                                    background: matchType === match.type ? match.bgImage : 'var(--bg-secondary)',
                                    boxShadow: matchType === match.type ? `0 0 30px ${match.color}30` : 'none',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}
                                whileHover={!inQueue ? { scale: 1.02, y: -5 } : {}}
                                whileTap={!inQueue ? { scale: 0.98 } : {}}
                            >
                                {/* Selection Indicator */}
                                {matchType === match.type && (
                                    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '4px', background: match.color, boxShadow: `0 0 15px ${match.color}` }} />
                                )}
                                
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: matchType === match.type ? `${match.color}20` : 'var(--gray-800)',
                                    color: matchType === match.type ? match.color : 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 24px',
                                    border: `1px solid ${matchType === match.type ? match.color : 'var(--gray-600)'}`,
                                    transform: 'rotate(45deg)',
                                    transition: 'all 0.3s'
                                }}>
                                    <div style={{ transform: 'rotate(-45deg)' }}>
                                        {match.icon}
                                    </div>
                                </div>
                                <h3 style={{ fontSize: '24px', fontWeight: '700', color: matchType === match.type ? 'var(--text-primary)' : 'var(--text-secondary)', marginBottom: '8px', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px' }}>
                                    {match.title}
                                </h3>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '1px' }}>{match.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Tactical Options Module */}
                    <div className="arena-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '12px', height: '2px', background: 'var(--accent-amber)' }} />
                            IDENTITY PROTOCOLS
                        </h3>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '24px',
                            background: anonymous ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${anonymous ? 'var(--accent-purple)' : 'rgba(255,255,255,0.05)'}`,
                            transition: 'all 0.3s'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div className={anonymous ? 'pulse-element' : ''} style={{
                                    width: '50px',
                                    height: '50px',
                                    background: anonymous ? 'var(--accent-purple)' : 'var(--gray-800)',
                                    color: anonymous ? 'white' : 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                    transition: 'all 0.3s'
                                }}>
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <p style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '16px', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px', marginBottom: '4px' }}>
                                        {anonymous ? 'STEALTH MODE ENGAGED' : 'PUBLIC IDENTITY'}
                                    </p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                                        CALLSIGN: <span style={{ fontWeight: '700', color: anonymous ? 'var(--accent-purple)' : 'var(--accent-blue)' }}>
                                            {anonymous ? (user?.anonymousAlias || 'GHOST_' + Math.floor(Math.random() * 1000)) : user?.username}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => !inQueue && setAnonymous(!anonymous)}
                                disabled={inQueue}
                                className={`toggle ${anonymous ? 'active' : ''}`}
                                style={{ opacity: inQueue ? 0.5 : 1, transform: 'scale(1.2)' }}
                            />
                        </div>
                    </div>

                    {/* Massive Cinematic Matchmaking CTA */}
                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <AnimatePresence mode="wait">
                            {inQueue ? (
                                <motion.div
                                    key="queue"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    style={{ display: 'inline-block', width: '100%', maxWidth: '600px' }}
                                >
                                    <div className="arena-card pulse-element" style={{ padding: '40px', background: 'rgba(255,70,85,0.05)', border: '1px solid var(--primary-500)', position: 'relative', overflow: 'hidden' }}>
                                        {/* Scanner sweep line */}
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'var(--primary-500)', boxShadow: '0 0 20px var(--primary-500)', animation: 'scan 2s linear infinite' }} />
                                        
                                        <div style={{ color: 'var(--primary-500)', marginBottom: '16px', filter: 'drop-shadow(0 0 10px var(--primary-500))' }}>
                                            <Radar size={48} style={{ animation: 'spin 4s linear infinite' }} />
                                        </div>
                                        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--primary-500)', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px' }}>
                                            ESTABLISHING CONNECTION...
                                        </h3>
                                        <p style={{ fontSize: '48px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-primary)', fontFamily: "'Oswald', sans-serif", lineHeight: 1 }}>
                                            {formatTime(queueTime)}
                                        </p>
                                        <button onClick={handleCancelQueue} className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--gray-500)', color: 'var(--text-muted)' }}>
                                            <Square size={16} />
                                            ABORT SEARCH
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.button
                                    key="find"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    onClick={handleFindMatch}
                                    className="btn-primary float-element"
                                    style={{ 
                                        fontSize: '24px', 
                                        padding: '24px 64px', 
                                        clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                                        boxShadow: '0 0 40px rgba(255,70,85,0.4)',
                                        display: 'inline-flex',
                                        gap: '16px'
                                    }}
                                    whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(255,70,85,0.6)' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Target size={28} />
                                    INITIATE BATTLE
                                    <Target size={28} />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '8px', height: '8px', background: 'var(--primary-500)', borderRadius: '50%', animation: 'pulse-live 2s infinite' }} />
                            ACTIVE SESSIONS
                        </h2>
                        <button onClick={fetchLiveDebates} className="btn-primary" style={{ fontSize: '13px', padding: '8px 16px', background: 'transparent', border: '1px solid var(--gray-600)' }}>
                            SCAN NETWORK
                        </button>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
                            <div style={{ color: 'var(--primary-500)' }}><Radar size={48} style={{ animation: 'spin 2s linear infinite' }} /></div>
                        </div>
                    ) : liveDebates.length > 0 ? (
                        <div className="grid-2">
                            {liveDebates.map((debate, i) => (
                                <motion.div
                                    key={debate._id || i}
                                    className="arena-card"
                                    style={{ cursor: 'pointer', padding: '24px' }}
                                    whileHover={{ scale: 1.02, borderColor: 'var(--primary-500)' }}
                                    onClick={() => navigate(`/debate/${debate._id}`)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,70,85,0.1)', color: 'var(--primary-500)', padding: '4px 10px', fontSize: '12px', fontWeight: 'bold' }}>
                                            <Eye size={14} /> LIVE
                                        </div>
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                                            SPECTATORS: <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{debate.spectatorCount || 0}</span>
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', fontFamily: "'Oswald', sans-serif" }}>
                                        {debate.topic?.title || 'CLASSIFIED ARGUMENT'}
                                    </h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '12px', color: 'var(--accent-blue)', letterSpacing: '1px', border: '1px solid var(--accent-blue)', padding: '4px 12px' }}>{debate.type.toUpperCase()}</span>
                                        <button style={{ background: 'transparent', border: 'none', color: 'var(--primary-500)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                                            OBSERVE <Play size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="arena-card" style={{ padding: '64px', textAlign: 'center', border: '1px dashed var(--gray-600)' }}>
                            <div style={{ color: 'var(--gray-600)', marginBottom: '24px' }}><Square size={48} /></div>
                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}>
                                NETWORK SILENT
                            </h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px', letterSpacing: '1px' }}>
                                NO ACTIVE SESSIONS DETECTED IN THE SECTOR.
                            </p>
                            <button onClick={() => setTab('play')} className="btn-primary" style={{ padding: '12px 32px' }}>
                                BE THE FIRST
                            </button>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default Arena;
