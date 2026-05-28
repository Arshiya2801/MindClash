import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../services/socket';
import {
    Send, Timer, MessageCircle, Users, TrendingUp,
    CheckCircle, AlertCircle, Zap, Flame, Star, Hand,
    ArrowLeft, Mic, MicOff, Volume2, VolumeX, Award,
    Eye, Clock, ThumbsUp, ThumbsDown, Flag, Trophy, X, Shield
} from 'lucide-react';

const Debate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Debate state
    const [debate, setDebate] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [currentSide, setCurrentSide] = useState('pro');
    const [timeLeft, setTimeLeft] = useState(120);

    // User state
    const [myRole, setMyRole] = useState(null);
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [input, setInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Message counts
    const [messageCount, setMessageCount] = useState({ pro: 0, con: 0 });

    // Spectator features
    const [spectatorChat, setSpectatorChat] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [reactions, setReactions] = useState({ '🔥': 0, '👏': 0, '💯': 0, '🤔': 0, '😱': 0, '💀': 0 });
    const [bettingPool, setBettingPool] = useState({ pro: 0, con: 0 });
    const [myBet, setMyBet] = useState(null);
    const [betAmount, setBetAmount] = useState(100);
    const [spectatorCount, setSpectatorCount] = useState(0);

    // UI state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Results state
    const [debateEnded, setDebateEnded] = useState(false);
    const [debateResult, setDebateResult] = useState(null);
    const [exitCountdown, setExitCountdown] = useState(60);

    const messagesEndRef = useRef(null);
    const chatEndRef = useRef(null);
    const timerRef = useRef(null);
    const myRoleRef = useRef(null);

    const reactionEmojis = ['🔥', '👏', '💯', '🤔', '😱', '💀'];
    const roundNames = ['Opening', 'Rebuttal', 'Counter', 'Closing'];

    useEffect(() => {
        const socket = getSocket();
        if (!socket) {
            setError('Socket not connected');
            setLoading(false);
            return;
        }

        console.log('🎮 Joining debate:', id);
        socket.emit('join_debate', { debateId: id });

        const onDebateJoined = (data) => {
            console.log('📢 Debate joined:', data);
            const { debate, role } = data;

            setDebate(debate);
            setMyRole(role);
            myRoleRef.current = role;
            setCurrentRound(debate.currentRound || 0);
            setCurrentSide(debate.currentSide || 'pro');
            setSpectatorCount(debate.spectatorCount || 0);
            setReactions(debate.reactions || { '🔥': 0, '👏': 0, '💯': 0, '🤔': 0, '😱': 0, '💀': 0 });
            setBettingPool(debate.bettingPool || { pro: 0, con: 0 });

            if (debate.status === 'finished') {
                setDebateEnded(true);
                setDebateResult({
                    winner: debate.winner?.side,
                    finalScores: {
                        pro: debate.scores?.pro?.total || 0,
                        con: debate.scores?.con?.total || 0,
                    },
                    reasoning: debate.aiSummary?.decisionReasoning || 'Debate concluded.',
                    feedback: debate.aiSummary?.strengthsWeaknesses || null,
                    factChecks: debate.aiSummary?.factChecks || [],
                    moderationFlags: debate.aiSummary?.moderationFlags || [],
                    highlights: debate.aiSummary?.keyPoints?.pro || [],
                });
            }

            if (debate.turnEndsAt) {
                const remaining = Math.max(0, Math.floor((new Date(debate.turnEndsAt) - Date.now()) / 1000));
                setTimeLeft(remaining);
            }

            let proCount = 0;
            let conCount = 0;
            const allMessages = debate.rounds?.flatMap(r =>
                r.messages.map(m => {
                    const side = debate.proTeam.some(p =>
                        (p.user._id || p.user).toString() === m.sender.toString()
                    ) ? 'pro' : 'con';
                    if (side === 'pro') proCount++;
                    else conCount++;
                    return { ...m, roundNumber: r.roundNumber, roundType: r.type, side };
                })
            ) || [];
            setMessages(allMessages);
            setMessageCount({ pro: proCount, con: conCount });

            if (role !== 'spectator') {
                if (debate.currentTurn) {
                    const currentTurnId = debate.currentTurn._id || debate.currentTurn;
                    setIsMyTurn(currentTurnId.toString() === user._id.toString());
                } else {
                    setIsMyTurn(debate.currentSide === role);
                }
            }

            setLoading(false);
        };

        const onArgumentSubmitted = (data) => {
            const { message, side, nextTurn, nextTurnUser, turnEndsAt, messageCount: count } = data;
            setMessages(prev => [...prev, { ...message, side }]);
            if (count) setMessageCount(count);
            setCurrentSide(nextTurn);
            if (turnEndsAt) {
                const remaining = Math.max(0, Math.floor((new Date(turnEndsAt) - Date.now()) / 1000));
                setTimeLeft(remaining);
            }
            if (myRoleRef.current && myRoleRef.current !== 'spectator') {
                if (nextTurnUser) {
                    const nextTurnUserId = nextTurnUser._id || nextTurnUser;
                    setIsMyTurn(nextTurnUserId.toString() === user._id.toString());
                } else {
                    setIsMyTurn(nextTurn === myRoleRef.current);
                }
            }
            setIsSubmitting(false);
        };

        const onTurnChanged = (data) => {
            setCurrentSide(data.side);
            setTimeLeft(data.duration || 120);
            if (myRoleRef.current && myRoleRef.current !== 'spectator') {
                if (data.nextTurnUser) {
                    const nextTurnUserId = data.nextTurnUser._id || data.nextTurnUser;
                    setIsMyTurn(nextTurnUserId.toString() === user._id.toString());
                } else {
                    setIsMyTurn(data.side === myRoleRef.current);
                }
            }
        };

        const onRoundChanged = (data) => {
            setCurrentRound(data.roundNumber - 1);
            setCurrentSide(data.side);
            setTimeLeft(data.duration || 120);
            if (myRoleRef.current && myRoleRef.current !== 'spectator') {
                if (data.nextTurnUser) {
                    const nextTurnUserId = data.nextTurnUser._id || data.nextTurnUser;
                    setIsMyTurn(nextTurnUserId.toString() === user._id.toString());
                } else {
                    setIsMyTurn(data.side === myRoleRef.current);
                }
            }
        };

        const onSpectatorMessage  = (data) => setSpectatorChat(prev => [...prev, data]);
        const onReaction          = (data) => setReactions(prev => ({ ...prev, [data.emoji]: (prev[data.emoji] || 0) + 1 }));
        const onBettingUpdate     = (data) => setBettingPool(data.pool);
        const onSpectatorJoined   = (data) => setSpectatorCount(data.spectatorCount);
        const onArgumentRejected  = (data) => {
            setError(`Rejected: ${data.reason}`);
            setIsSubmitting(false);
            setTimeout(() => setError(null), 5000);
        };
        const onDebateEnded = (data) => {
            console.log('🏁 Debate ended:', data);
            // Only process once — prevents flashing if event fires multiple times
            setDebateEnded(prev => {
                if (prev) return prev; // already ended, ignore
                setDebateResult(data);
                return true;
            });
        };
        const onError = (data) => {
            console.error('Socket error:', data);
            if (data.message && !data.message.includes('already ended')) {
                setError(data.message);
                setTimeout(() => setError(null), 5000);
            }
            setIsSubmitting(false);
        };

        socket.on('debate_joined',       onDebateJoined);
        socket.on('argument_submitted',  onArgumentSubmitted);
        socket.on('turn_changed',        onTurnChanged);
        socket.on('round_changed',       onRoundChanged);
        socket.on('spectator_message',   onSpectatorMessage);
        socket.on('reaction',            onReaction);
        socket.on('betting_update',      onBettingUpdate);
        socket.on('spectator_joined',    onSpectatorJoined);
        socket.on('argument_rejected',   onArgumentRejected);
        socket.on('debate_ended',        onDebateEnded);
        socket.on('error',               onError);

        return () => {
            socket.off('debate_joined',      onDebateJoined);
            socket.off('argument_submitted', onArgumentSubmitted);
            socket.off('turn_changed',       onTurnChanged);
            socket.off('round_changed',      onRoundChanged);
            socket.off('spectator_message',  onSpectatorMessage);
            socket.off('reaction',           onReaction);
            socket.off('betting_update',     onBettingUpdate);
            socket.off('spectator_joined',   onSpectatorJoined);
            socket.off('argument_rejected',  onArgumentRejected);
            socket.off('debate_ended',       onDebateEnded);
            socket.off('error',              onError);
        };
    }, [id]);

    // Only emit leave_debate when the WINDOW is truly closing (not SPA navigation)
    useEffect(() => {
        const handleBeforeUnload = () => {
            const socket = getSocket();
            if (socket) socket.emit('leave_debate', { debateId: id });
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [id]);

    useEffect(() => {
        if (timeLeft > 0 && !debateEnded) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(t => Math.max(0, t - 1));
            }, 1000);
        }
        return () => clearTimeout(timerRef.current);
    }, [timeLeft, debateEnded]);

    // Auto-exit: 60s countdown after debate ends, then navigate to /arena
    const hasAutoExited = useRef(false);
    useEffect(() => {
        if (!debateEnded || hasAutoExited.current) return;

        // Reset countdown when debate ends
        setExitCountdown(60);

        const exitTimer = setInterval(() => {
            setExitCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(exitTimer);
                    if (!hasAutoExited.current) {
                        hasAutoExited.current = true;
                        const socket = getSocket();
                        if (socket) socket.emit('leave_debate', { debateId: id });
                        navigate('/arena');
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(exitTimer);
    }, [debateEnded, id, navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [spectatorChat]);

    const handleLeaveDebate = (destination = '/arena') => {
        const socket = getSocket();
        if (socket) {
            socket.emit('leave_debate', { debateId: id });
        }
        navigate(destination);
    };

    const handleSubmitArgument = () => {
        if (!input.trim() || isSubmitting || !isMyTurn || debateEnded) return;

        setIsSubmitting(true);
        const socket = getSocket();
        socket.emit('submit_argument', {
            debateId: id,
            content: input.trim(),
        });
        setInput('');

        setTimeout(() => setIsSubmitting(false), 5000);
    };

    const handleSendChat = () => {
        if (!chatInput.trim()) return;
        const socket = getSocket();
        socket.emit('spectator_chat', {
            debateId: id,
            message: chatInput.trim(),
            username: user?.username
        });
        setChatInput('');
    };

    const handleReaction = (emoji) => {
        const socket = getSocket();
        socket.emit('reaction', { debateId: id, emoji });
    };

    const handlePlaceBet = (side) => {
        if (myBet || myRole !== 'spectator') return;
        const socket = getSocket();
        socket.emit('place_bet', { debateId: id, side, amount: betAmount });
        setMyBet({ side, amount: betAmount });
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Results Modal — NOT a component (avoids remount/flash on parent re-render)
    const renderResultsModal = () => {
        if (!debateResult) return null;

        const didWin = myRole === debateResult.winner;
        const isDraw = debateResult.winner === 'draw';
        const isSpectator = myRole === 'spectator';

        return (
            <motion.div
                key="results-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 50,
                    padding: '16px'
                }}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 20 }}
                    style={{
                        background: '#fff',
                        borderRadius: '24px',
                        padding: '32px',
                        maxWidth: '650px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        textAlign: 'center',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                    }}
                >
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: isDraw ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                            didWin ? 'linear-gradient(135deg, #10b981, #059669)' :
                                isSpectator ? 'linear-gradient(135deg, #6366f1, #4f46e5)' :
                                    'linear-gradient(135deg, #ef4444, #dc2626)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        fontSize: '40px'
                    }}>
                        {isDraw ? '🤝' : didWin ? '🏆' : isSpectator ? '👀' : '😢'}
                    </div>

                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#171717',
                        marginBottom: '8px'
                    }}>
                        {isDraw ? 'It\'s a Draw!' :
                            isSpectator ? 'Debate Ended!' :
                                didWin ? 'You Won!' : 'You Lost'}
                    </h2>

                    {!isDraw && (
                        <p style={{ color: '#525252', marginBottom: '20px' }}>
                            🎉 {debateResult.winner?.toUpperCase()} side wins!
                        </p>
                    )}

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '40px',
                        marginBottom: '24px',
                        padding: '20px',
                        background: '#f5f5f5',
                        borderRadius: '16px'
                    }}>
                        <div>
                            <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981' }}>
                                {debateResult.finalScores?.pro || 0}
                            </div>
                            <div style={{ fontSize: '14px', color: '#737373' }}>PRO Score</div>
                        </div>
                        <div style={{ width: '2px', background: '#e5e5e5' }} />
                        <div>
                            <div style={{ fontSize: '32px', fontWeight: '700', color: '#ef4444' }}>
                                {debateResult.finalScores?.con || 0}
                            </div>
                            <div style={{ fontSize: '14px', color: '#737373' }}>CON Score</div>
                        </div>
                    </div>

                    {!isSpectator && (
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            background: isDraw ? '#fef3c7' : didWin ? '#d1fae5' : '#fee2e2',
                            borderRadius: '50px',
                            marginBottom: '20px'
                        }}>
                            <Zap style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
                            <span style={{ fontWeight: '600', color: '#171717' }}>
                                +{isDraw ? debateResult.xpRewards?.draw || 50 :
                                    didWin ? debateResult.xpRewards?.winner || 100 :
                                        debateResult.xpRewards?.loser || 25} XP
                            </span>
                        </div>
                    )}

                    {debateResult.reasoning && (
                        <div style={{
                            textAlign: 'left',
                            padding: '16px',
                            background: '#fafafa',
                            borderRadius: '12px',
                            marginBottom: '24px'
                        }}>
                            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#171717', marginBottom: '8px' }}>
                                🤖 AI Judge's Verdict
                            </h4>
                            <p style={{ fontSize: '13px', color: '#525252', lineHeight: '1.6' }}>
                                {debateResult.reasoning}
                            </p>
                        </div>
                    )}

                    {debateResult.moderationFlags?.length > 0 && (
                        <div style={{ textAlign: 'left', padding: '16px', background: '#fee2e2', borderRadius: '12px', marginBottom: '24px', border: '1px solid #fca5a5' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#991b1b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Flag style={{ width: '16px', height: '16px' }} /> Moderation Flags
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {debateResult.moderationFlags.map((flag, idx) => (
                                    <div key={idx} style={{ fontSize: '13px', color: '#7f1d1d', background: '#fef2f2', padding: '8px', borderRadius: '8px' }}>
                                        <strong>{flag.side.toUpperCase()} Side (Arg {flag.argIndex}):</strong> {flag.issue} <span style={{ padding: '2px 6px', background: flag.severity === 'high' ? '#991b1b' : '#dc2626', color: '#fff', borderRadius: '4px', fontSize: '11px', marginLeft: '6px' }}>{flag.severity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {debateResult.factChecks?.length > 0 && (
                        <div style={{ textAlign: 'left', padding: '16px', background: '#f0fdf4', borderRadius: '12px', marginBottom: '24px', border: '1px solid #bbf7d0' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#166534', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Shield style={{ width: '16px', height: '16px' }} /> Fact Checks
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {debateResult.factChecks.map((check, idx) => (
                                    <div key={idx} style={{ fontSize: '13px', color: '#15803d', background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #dcfce3' }}>
                                        <div style={{ marginBottom: '4px' }}><strong>Claim:</strong> "{check.claim}"</div>
                                        <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <strong>Verdict:</strong> 
                                            <span style={{ 
                                                padding: '2px 8px', borderRadius: '50px', fontSize: '11px', fontWeight: '600',
                                                background: check.verdict.includes('true') ? '#d1fae5' : check.verdict.includes('false') ? '#fee2e2' : '#fef3c7',
                                                color: check.verdict.includes('true') ? '#059669' : check.verdict.includes('false') ? '#dc2626' : '#d97706'
                                            }}>
                                                {check.verdict.toUpperCase().replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div><strong>Note:</strong> {check.note}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {debateResult.feedback && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', textAlign: 'left' }}>
                            {['pro', 'con'].map(side => {
                                const fb = debateResult.feedback[side];
                                if (!fb) return null;
                                return (
                                    <div key={side} style={{ padding: '16px', background: side === 'pro' ? '#ecfdf5' : '#fef2f2', borderRadius: '12px', border: side === 'pro' ? '1px solid #a7f3d0' : '1px solid #fecaca' }}>
                                        <h4 style={{ fontSize: '14px', fontWeight: '700', color: side === 'pro' ? '#059669' : '#dc2626', marginBottom: '12px' }}>
                                            {side.toUpperCase()} Feedback
                                        </h4>
                                        <div style={{ marginBottom: '12px' }}>
                                            <strong style={{ fontSize: '12px', color: '#171717', display: 'flex', alignItems: 'center', gap: '4px' }}><ThumbsUp style={{ width:'14px', height:'14px', color:'#10b981' }}/> Strengths</strong>
                                            <ul style={{ fontSize: '12px', color: '#525252', paddingLeft: '20px', margin: '4px 0 0 0' }}>
                                                {fb.strengths?.map((s, i) => <li key={i} style={{ marginBottom: '4px' }}>{s}</li>)}
                                            </ul>
                                        </div>
                                        <div>
                                            <strong style={{ fontSize: '12px', color: '#171717', display: 'flex', alignItems: 'center', gap: '4px' }}><ThumbsDown style={{ width:'14px', height:'14px', color:'#ef4444' }}/> Weaknesses</strong>
                                            <ul style={{ fontSize: '12px', color: '#525252', paddingLeft: '20px', margin: '4px 0 0 0' }}>
                                                {fb.weaknesses?.map((w, i) => <li key={i} style={{ marginBottom: '4px' }}>{w}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {debateResult.highlights?.length > 0 && (
                        <div style={{ textAlign: 'left', padding: '16px', background: '#fffbeb', borderRadius: '12px', marginBottom: '24px', border: '1px solid #fde68a' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#b45309', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Star style={{ width: '16px', height: '16px' }} /> Debate Highlights
                            </h4>
                            <ul style={{ fontSize: '13px', color: '#92400e', paddingLeft: '20px', margin: 0 }}>
                                {debateResult.highlights.map((h, i) => <li key={i} style={{ marginBottom: '4px' }}>{h}</li>)}
                            </ul>
                        </div>
                    )}

                    {/* Auto-Exit Countdown */}
                    <div style={{
                        marginBottom: '16px',
                        padding: '12px',
                        background: '#f3f4f6',
                        borderRadius: '12px',
                        color: '#4b5563',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <Timer style={{ width: '16px', height: '16px' }} />
                        Returning to Arena in <span style={{ color: '#ef4444', minWidth: '20px' }}>{exitCountdown}</span>s...
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button
                            onClick={() => handleLeaveDebate('/arena')}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                color: '#fff',
                                fontWeight: '600',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <Trophy style={{ width: '18px', height: '18px' }} />
                            Back to Arena
                        </button>
                        <button
                            onClick={() => handleLeaveDebate('/dashboard')}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '12px',
                                background: '#f5f5f5',
                                color: '#171717',
                                fontWeight: '600',
                                border: '1px solid #e5e5e5',
                                cursor: 'pointer'
                            }}
                        >
                            Dashboard
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
                    <p style={{ color: '#737373' }}>Loading debate...</p>
                </div>
            </div>
        );
    }

    if (!debate) {
        return (
            <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Debate Not Found</h2>
                <p style={{ color: '#737373', marginBottom: '16px' }}>This debate may have ended or doesn't exist.</p>
                <button onClick={() => navigate('/arena')} className="btn-primary">
                    <ArrowLeft style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                    Back to Arena
                </button>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AnimatePresence>
                {debateEnded && renderResultsModal()}
            </AnimatePresence>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            position: 'fixed',
                            top: '16px',
                            right: '16px',
                            zIndex: 50,
                            background: '#ef4444',
                            color: '#fff',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <AlertCircle style={{ width: '20px', height: '20px' }} />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="glass-card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            onClick={() => handleLeaveDebate('/arena')}
                            style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '8px' }}
                        >
                            <ArrowLeft style={{ width: '20px', height: '20px' }} />
                        </button>
                        <span style={{
                            padding: '4px 12px',
                            background: debateEnded ? '#d1d5db' : '#fee2e2',
                            color: debateEnded ? '#374151' : '#dc2626',
                            borderRadius: '50px',
                            fontSize: '12px',
                            fontWeight: '600'
                        }}>
                            {debateEnded ? '✓ ENDED' : '🔴 LIVE'}
                        </span>
                        <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#171717' }}>
                            {debate?.topic?.title || 'Debate in Progress'}
                        </h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#737373' }}>
                            <Eye style={{ width: '16px', height: '16px' }} />
                            <span>{spectatorCount} watching</span>
                        </div>
                        <span style={{
                            padding: '6px 14px',
                            background: '#eef2ff',
                            color: '#4f46e5',
                            borderRadius: '50px',
                            fontSize: '13px',
                            fontWeight: '600'
                        }}>
                            Round {currentRound + 1}: {roundNames[currentRound] || 'Debate'}
                        </span>
                        <div style={{
                            padding: '8px 16px',
                            background: timeLeft <= 10 ? '#fee2e2' : timeLeft <= 30 ? '#fef3c7' : '#f5f5f5',
                            color: timeLeft <= 10 ? '#dc2626' : timeLeft <= 30 ? '#d97706' : '#171717',
                            borderRadius: '50px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            ⏱️ {formatTime(timeLeft)}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                    {myRole === 'spectator' ? (
                        <span style={{ padding: '6px 16px', background: '#f5f5f5', color: '#737373', borderRadius: '50px', fontSize: '14px' }}>
                            👀 Spectating
                        </span>
                    ) : myRole === 'pro' ? (
                        <span style={{ padding: '6px 16px', background: '#d1fae5', color: '#059669', borderRadius: '50px', fontSize: '14px', fontWeight: '700' }}>
                            ✅ You are PRO {isMyTurn && !debateEnded && '- YOUR TURN!'}
                        </span>
                    ) : (
                        <span style={{ padding: '6px 16px', background: '#fee2e2', color: '#dc2626', borderRadius: '50px', fontSize: '14px', fontWeight: '700' }}>
                            ❌ You are CON {isMyTurn && !debateEnded && '- YOUR TURN!'}
                        </span>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px' }} className="debate-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Message Progress - Shows how many messages each side has submitted */}
                    <div className="glass-card" style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontWeight: '700', color: '#10b981' }}>✅ PRO</span>
                                <span style={{ fontSize: '13px', color: '#737373' }}>
                                    {debate.proTeam?.map(p => p.user?.username || 'Anonymous').join(', ')}
                                </span>
                                <span style={{
                                    padding: '4px 12px',
                                    background: '#d1fae5',
                                    borderRadius: '50px',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    color: '#059669'
                                }}>
                                    {messageCount.pro}/5 arguments
                                </span>
                            </div>
                            <div style={{ fontSize: '24px' }}>⚔️</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{
                                    padding: '4px 12px',
                                    background: '#fee2e2',
                                    borderRadius: '50px',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    color: '#dc2626'
                                }}>
                                    {messageCount.con}/5 arguments
                                </span>
                                <span style={{ fontSize: '13px', color: '#737373' }}>
                                    {debate.conTeam?.map(p => p.user?.username || 'Anonymous').join(', ')}
                                </span>
                                <span style={{ fontWeight: '700', color: '#ef4444' }}>❌ CON</span>
                            </div>
                        </div>
                        <p style={{ textAlign: 'center', fontSize: '12px', color: '#737373', marginTop: '8px' }}>
                            Debate ends after both sides submit 5 arguments. AI will judge all arguments at the end.
                        </p>
                    </div>

                    {/* Turn Indicator */}
                    {myRole !== 'spectator' && !debateEnded && (
                        <motion.div
                            style={{
                                padding: '16px',
                                borderRadius: '12px',
                                textAlign: 'center',
                                fontWeight: '700',
                                background: isMyTurn ? 'linear-gradient(90deg, #fef3c7, #fde68a)' : '#f5f5f5',
                                border: isMyTurn ? '2px solid #f59e0b' : '1px solid #e5e5e5',
                                color: isMyTurn ? '#92400e' : '#737373'
                            }}
                            animate={isMyTurn ? { scale: [1, 1.01, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            {isMyTurn ? (
                                <span>🎤 Your Turn! Make your argument ({formatTime(timeLeft)} remaining)</span>
                            ) : (
                                <span>⏳ Waiting for {currentSide?.toUpperCase()} to respond...</span>
                            )}
                        </motion.div>
                    )}

                    {debateEnded && (
                        <div style={{
                            padding: '16px',
                            borderRadius: '12px',
                            textAlign: 'center',
                            fontWeight: '700',
                            background: '#d1fae5',
                            border: '2px solid #10b981',
                            color: '#059669'
                        }}>
                            🏁 Debate has ended! AI is judging...
                        </div>
                    )}

                    {/* Arguments Thread */}
                    <div className="glass-card" style={{ padding: '16px' }}>
                        <h3 style={{ fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            💬 Debate Thread
                            <span style={{
                                padding: '4px 12px',
                                background: '#eef2ff',
                                color: '#4f46e5',
                                borderRadius: '50px',
                                fontSize: '12px',
                                fontWeight: '600'
                            }}>
                                {currentSide?.toUpperCase()}'s Turn
                            </span>
                        </h3>

                        <div style={{ height: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                            {messages.length > 0 ? (
                                messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            padding: '16px',
                                            borderRadius: '12px',
                                            background: msg.side === 'pro' ? '#ecfdf5' : '#fef2f2',
                                            borderLeft: `4px solid ${msg.side === 'pro' ? '#10b981' : '#ef4444'}`
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontWeight: '700', color: msg.side === 'pro' ? '#10b981' : '#ef4444' }}>
                                                {msg.side === 'pro' ? '✅ PRO' : '❌ CON'}
                                            </span>
                                            <span style={{ fontSize: '12px', color: '#a3a3a3' }}>
                                                {msg.senderName || 'Debater'}
                                            </span>
                                        </div>
                                        <p style={{ color: '#374151', lineHeight: '1.6' }}>{msg.content}</p>
                                    </motion.div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '32px', color: '#737373' }}>
                                    <span style={{ fontSize: '40px', display: 'block', marginBottom: '8px' }}>⏳</span>
                                    Waiting for the first argument...
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {myRole !== 'spectator' && !debateEnded && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmitArgument())}
                                    placeholder={isMyTurn ? "Type your argument... (Press Enter to submit)" : "Wait for your turn..."}
                                    disabled={!isMyTurn || isSubmitting}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        border: '1px solid #e5e5e5',
                                        resize: 'none',
                                        fontSize: '14px',
                                        opacity: !isMyTurn ? 0.5 : 1,
                                        cursor: !isMyTurn ? 'not-allowed' : 'text'
                                    }}
                                    rows={3}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', color: '#737373' }}>
                                        {input.length}/2000 characters
                                    </span>
                                    <motion.button
                                        onClick={handleSubmitArgument}
                                        disabled={!isMyTurn || isSubmitting || !input.trim()}
                                        style={{
                                            padding: '10px 24px',
                                            borderRadius: '12px',
                                            background: (!isMyTurn || isSubmitting) ? '#e5e5e5' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            color: (!isMyTurn || isSubmitting) ? '#a3a3a3' : '#fff',
                                            fontWeight: '600',
                                            border: 'none',
                                            cursor: (!isMyTurn || isSubmitting) ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                        whileHover={isMyTurn && !isSubmitting ? { scale: 1.02 } : {}}
                                        whileTap={isMyTurn && !isSubmitting ? { scale: 0.98 } : {}}
                                    >
                                        <Send style={{ width: '18px', height: '18px' }} />
                                        Submit Argument
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* ── REACTIONS ── visible to ALL (players can react, spectators can react) */}
                    <div className="glass-card" style={{ padding: '16px' }}>
                        <h3 style={{ fontWeight: '700', marginBottom: '12px', fontSize: '14px', color: '#525252' }}>
                            ⚡ React!
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {reactionEmojis.map((emoji) => (
                                <motion.button
                                    key={emoji}
                                    onClick={() => handleReaction(emoji)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '8px 14px',
                                        background: '#f5f5f5',
                                        border: 'none',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontSize: '18px'
                                    }}
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.92 }}
                                >
                                    <span>{emoji}</span>
                                    <span style={{ fontWeight: '700', fontSize: '13px', color: '#374151' }}>{reactions[emoji] || 0}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* ── SPECTATOR EXCLUSIVE: Live Chat ── */}
                    {myRole === 'spectator' && (
                        <div className="glass-card" style={{ padding: '16px' }}>
                            <h3 style={{ fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                                👁️ Spectator Chat
                                <span style={{ fontSize: '12px', fontWeight: '400', color: '#737373' }}>({spectatorCount} watching)</span>
                            </h3>

                            <div style={{ height: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                                {spectatorChat.length > 0 ? (
                                    spectatorChat.map((msg, i) => (
                                        <div key={i} style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: '8px', fontSize: '13px' }}>
                                            <span style={{ fontWeight: '600', color: '#8b5cf6' }}>{msg.username}:</span> {msg.message}
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '16px', color: '#a3a3a3', fontSize: '13px' }}>No messages yet</div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                                    placeholder="Chat as spectator..."
                                    style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e5e5', fontSize: '13px' }}
                                />
                                <button onClick={handleSendChat} style={{ padding: '8px 12px', borderRadius: '8px', background: '#8b5cf6', color: '#fff', border: 'none', cursor: 'pointer' }}>
                                    <Send style={{ width: '16px', height: '16px' }} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── SPECTATOR EXCLUSIVE: Betting Pool ── */}
                    {myRole === 'spectator' && !debateEnded && (
                        <div className="glass-card" style={{ padding: '16px' }}>
                            <h3 style={{ fontWeight: '700', marginBottom: '12px', fontSize: '14px' }}>🎰 Betting Pool</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#ecfdf5', borderRadius: '10px' }}>
                                    <span style={{ fontWeight: '700', color: '#10b981' }}>✅ PRO</span>
                                    <span style={{ fontWeight: '700' }}>{bettingPool.pro || 0} XP</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#fef2f2', borderRadius: '10px' }}>
                                    <span style={{ fontWeight: '700', color: '#ef4444' }}>❌ CON</span>
                                    <span style={{ fontWeight: '700' }}>{bettingPool.con || 0} XP</span>
                                </div>
                            </div>

                            {!myBet ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Zap style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
                                        <input
                                            type="number"
                                            value={betAmount}
                                            onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 0))}
                                            style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e5e5', textAlign: 'center', fontSize: '14px' }}
                                            min="10"
                                        />
                                        <span style={{ fontSize: '12px', color: '#737373' }}>XP</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                        <button onClick={() => handlePlaceBet('pro')} style={{ padding: '10px', borderRadius: '10px', background: '#10b981', color: '#fff', fontWeight: '700', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                                            Bet PRO
                                        </button>
                                        <button onClick={() => handlePlaceBet('con')} style={{ padding: '10px', borderRadius: '10px', background: '#ef4444', color: '#fff', fontWeight: '700', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                                            Bet CON
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: '12px', background: 'linear-gradient(90deg, #fef3c7, #fde68a)', borderRadius: '12px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '12px', color: '#92400e', marginBottom: '4px' }}>Your Bet Placed</p>
                                    <p style={{ fontWeight: '700', color: '#78350f' }}>{myBet.amount} XP on {myBet.side.toUpperCase()}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── PLAYER EXCLUSIVE: Forfeit button ── */}
                    {myRole !== 'spectator' && !debateEnded && (
                        <div className="glass-card" style={{ padding: '16px' }}>
                            <h3 style={{ fontWeight: '700', marginBottom: '12px', fontSize: '14px', color: '#525252' }}>⚠️ Options</h3>
                            <button
                                onClick={() => {
                                    const socket = getSocket();
                                    if (socket) socket.emit('forfeit', { debateId: id });
                                }}
                                style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#fef2f2', color: '#dc2626', fontWeight: '600', border: '1px solid #fecaca', cursor: 'pointer', fontSize: '13px' }}
                            >
                                🏳️ Forfeit Match
                            </button>
                        </div>
                    )}

                    {/* ── Topic Info ── visible to ALL */}
                    <div className="glass-card" style={{ padding: '16px' }}>
                        <h3 style={{ fontWeight: '700', marginBottom: '12px', fontSize: '14px' }}>📋 Topic</h3>
                        <p style={{ fontSize: '13px', color: '#737373', marginBottom: '12px', lineHeight: '1.5' }}>{debate.topic?.description || 'No description'}</p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ padding: '4px 12px', background: '#eef2ff', color: '#4f46e5', borderRadius: '50px', fontSize: '12px', fontWeight: '600' }}>{debate.type}</span>
                            <span style={{ padding: '4px 12px', background: '#f5f5f5', color: '#525252', borderRadius: '50px', fontSize: '12px' }}>{debate.topic?.category || 'General'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 1024px) {
                    .debate-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default Debate;
