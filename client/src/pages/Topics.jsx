import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { topicAPI } from '../services/api';
import { MessageSquare, Flame, Lightbulb, Search, ThumbsUp, Plus, Database, Cpu, Zap, Radar, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Topics = () => {
    const [topics, setTopics] = useState([]);
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Suggest Topic Modal State
    const [showModal, setShowModal] = useState(false);
    const [newTopic, setNewTopic] = useState({ title: '', description: '', category: 'General' });
    const [submitting, setSubmitting] = useState(false);

    const categories = ['All', 'Technology', 'Politics', 'Science', 'Philosophy', 'Entertainment', 'General'];
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        fetchTopics();
    }, [selectedCategory]);

    const fetchTopics = async () => {
        setLoading(true);
        try {
            const params = selectedCategory !== 'All' ? { category: selectedCategory } : {};
            const [allRes, trendingRes] = await Promise.all([
                topicAPI.getAll(params),
                topicAPI.getTrending()
            ]);
            setTopics(allRes.data?.topics || []);
            setTrending(trendingRes.data?.topics || []);
        } catch (err) {
            console.error('Failed to fetch topics', err);
        }
        setLoading(false);
    };

    const handleSuggestTopic = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await topicAPI.suggest(newTopic);
            setShowModal(false);
            setNewTopic({ title: '', description: '', category: 'General' });
            fetchTopics();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to suggest topic');
        }
        setSubmitting(false);
    };

    const handleLike = async (topicId) => {
        try {
            await topicAPI.like(topicId);
            fetchTopics(); // Refresh to show new like count
        } catch (err) {
            console.error('Failed to like topic', err);
        }
    };

    const displayTopics = activeTab === 'all' ? topics : trending;
    const filteredTopics = displayTopics.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getCategoryColor = (category) => {
        switch (category?.toLowerCase()) {
            case 'technology': return 'var(--accent-blue)';
            case 'politics': return 'var(--primary-500)';
            case 'science': return 'var(--accent-emerald)';
            case 'philosophy': return 'var(--accent-purple)';
            case 'entertainment': return 'var(--accent-amber)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Cinematic Header */}
            <div className="arena-card" style={{ padding: '60px 32px', position: 'relative', overflow: 'hidden', borderBottom: '4px solid var(--accent-blue)' }}>
                {/* Holographic Background */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '50%', left: '80%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,240,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
                
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
                    <div>
                        <div className="badge pulse-element" style={{ marginBottom: '16px', background: 'rgba(0, 240, 255, 0.1)', color: 'var(--accent-blue)', borderColor: 'var(--accent-blue)' }}>
                            <Database size={14} /> DATABANK ONLINE
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px', fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', letterSpacing: '2px', lineHeight: 1.1 }}>
                            <span style={{ color: 'var(--accent-blue)' }}>KNOWLEDGE</span> NETWORK
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            ACCESSING GLOBAL DEBATE ARCHIVES...
                        </p>
                    </div>
                    
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0,240,255,0.4)' }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary float-element"
                        onClick={() => setShowModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--accent-blue)', color: 'var(--accent-blue)', padding: '16px 24px', fontSize: '14px' }}
                    >
                        <Plus size={18} />
                        UPLOAD PROTOCOL
                    </motion.button>
                </div>

                {/* Holographic Search & Tabs */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '40px', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => setActiveTab('all')}
                            style={{
                                padding: '12px 24px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                background: activeTab === 'all' ? 'rgba(0,240,255,0.1)' : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${activeTab === 'all' ? 'var(--accent-blue)' : 'rgba(255,255,255,0.1)'}`,
                                color: activeTab === 'all' ? 'var(--accent-blue)' : 'var(--text-muted)',
                                transition: 'all 0.3s',
                                fontFamily: "'Oswald', sans-serif",
                                letterSpacing: '1px'
                            }}
                        >
                            <Lightbulb size={16} /> ALL PROTOCOLS
                        </button>
                        <button
                            onClick={() => setActiveTab('trending')}
                            style={{
                                padding: '12px 24px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                background: activeTab === 'trending' ? 'rgba(255,70,85,0.1)' : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${activeTab === 'trending' ? 'var(--primary-500)' : 'rgba(255,255,255,0.1)'}`,
                                color: activeTab === 'trending' ? 'var(--primary-500)' : 'var(--text-muted)',
                                transition: 'all 0.3s',
                                fontFamily: "'Oswald', sans-serif",
                                letterSpacing: '1px'
                            }}
                        >
                            <Flame size={16} /> TRENDING
                        </button>
                    </div>

                    <div style={{ position: 'relative', flex: 1, minWidth: '250px', maxWidth: '400px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-blue)' }} />
                        <input
                            type="text"
                            placeholder="SEARCH DATABANK..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '14px 16px 14px 48px', 
                                border: '1px solid var(--accent-blue)', 
                                background: 'var(--bg-tertiary)', 
                                fontSize: '14px', 
                                color: 'var(--accent-blue)', 
                                outline: 'none',
                                fontFamily: "'Oswald', sans-serif",
                                letterSpacing: '1px',
                                transition: 'all 0.3s',
                                boxShadow: 'inset 0 0 10px rgba(0,240,255,0.1)'
                            }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 20px rgba(0,240,255,0.2), inset 0 0 10px rgba(0,240,255,0.2)'}
                            onBlur={(e) => e.target.style.boxShadow = 'inset 0 0 10px rgba(0,240,255,0.1)'}
                        />
                    </div>
                </div>
                
                {/* Category Filters */}
                {activeTab === 'all' && (
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px', position: 'relative', zIndex: 1 }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '8px 16px', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                                    border: `1px solid ${selectedCategory === cat ? 'var(--text-primary)' : 'rgba(255,255,255,0.1)'}`,
                                    background: selectedCategory === cat ? 'var(--text-primary)' : 'rgba(255,255,255,0.03)',
                                    color: selectedCategory === cat ? 'var(--bg-primary)' : 'var(--text-muted)',
                                    transition: 'all 0.2s',
                                    fontFamily: "'Oswald', sans-serif",
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Topics Grid */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
                    <div style={{ color: 'var(--accent-blue)' }}><Radar size={48} style={{ animation: 'spin 2s linear infinite' }} /></div>
                </div>
            ) : filteredTopics.length > 0 ? (
                <div className="grid-2">
                    {filteredTopics.map((topic, i) => {
                        const catColor = getCategoryColor(topic.category);
                        // Calculate a fake "heat" percentage based on likes for visual effect
                        const heatPercent = Math.min(100, Math.max(10, (topic.likes || 0) * 5));
                        
                        return (
                            <motion.div
                                key={topic._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="arena-card"
                                style={{ padding: '32px', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}
                                whileHover={{ scale: 1.02, y: -4, borderColor: catColor, boxShadow: `0 10px 30px color-mix(in srgb, ${catColor} 20%, transparent)` }}
                            >
                                {/* Heat Bar Background */}
                                <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', background: catColor, width: `${heatPercent}%`, boxShadow: `0 0 10px ${catColor}` }} />
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <span style={{
                                        padding: '4px 12px', fontSize: '11px', fontWeight: '700', 
                                        background: `color-mix(in srgb, ${catColor} 15%, transparent)`, color: catColor, border: `1px solid color-mix(in srgb, ${catColor} 40%, transparent)`,
                                        textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px'
                                    }}>
                                        {topic.category}
                                    </span>
                                    {topic.difficulty && (
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px', textTransform: 'uppercase' }}>
                                            CLASS: {topic.difficulty}
                                        </span>
                                    )}
                                </div>
                                
                                <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px', lineHeight: 1.2 }}>{topic.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', flex: 1, marginBottom: '24px' }}>
                                    {topic.description}
                                </p>
                                
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <button
                                            onClick={() => handleLike(topic._id)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px', fontWeight: '700', fontFamily: "'Oswald', sans-serif" }}
                                            onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary-500)'}
                                            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                        >
                                            <Flame size={18} /> {topic.likes || 0} HEAT
                                        </button>
                                        <span style={{ color: catColor, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Activity size={14} /> ACTIVE</span>
                                    </div>
                                    
                                    <Link to={`/arena?topic=${topic._id}`}>
                                        <button className="btn-primary" style={{
                                            padding: '8px 20px', background: 'transparent', border: `1px solid ${catColor}`, color: catColor, fontSize: '13px'
                                        }}
                                        onMouseOver={(e) => { e.currentTarget.style.background = catColor; e.currentTarget.style.color = 'var(--bg-primary)'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = catColor; }}>
                                            ENGAGE
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="arena-card pulse-element" style={{ padding: '80px 24px', textAlign: 'center', border: '1px dashed var(--accent-blue)', background: 'rgba(0,240,255,0.02)' }}>
                    <Radar size={64} style={{ color: 'var(--accent-blue)', margin: '0 auto 24px', opacity: 0.5, animation: 'spin 4s linear infinite' }} />
                    <h3 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-blue)', marginBottom: '12px', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px' }}>NO NETWORK DATA FOUND</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        Adjust your search parameters or sector filters to locate valid protocols.
                    </p>
                </div>
            )}

            {/* Data Upload Terminal (Suggest Topic Modal) */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="arena-card"
                        style={{ width: '90%', maxWidth: '600px', padding: '0', border: '1px solid var(--accent-blue)', overflow: 'hidden' }}
                    >
                        <div style={{ background: 'var(--accent-blue)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Cpu size={20} style={{ color: 'var(--bg-primary)' }} />
                            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--bg-primary)', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px', margin: 0 }}>
                                DATA UPLOAD TERMINAL
                            </h2>
                        </div>

                        <form onSubmit={handleSuggestTopic} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--accent-blue)', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}>PROTOCOL TITLE</label>
                                <input
                                    type="text"
                                    required
                                    minLength={10}
                                    value={newTopic.title}
                                    onChange={e => setNewTopic({...newTopic, title: e.target.value})}
                                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-tertiary)', border: '1px solid rgba(0,240,255,0.2)', color: 'var(--text-primary)', outline: 'none', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}
                                    placeholder="E.G., ARTIFICIAL INTELLIGENCE WILL REPLACE DEVELOPERS"
                                    onFocus={(e) => e.target.style.border = '1px solid var(--accent-blue)'}
                                    onBlur={(e) => e.target.style.border = '1px solid rgba(0,240,255,0.2)'}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--accent-blue)', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}>CONTEXT DATA</label>
                                <textarea
                                    required
                                    value={newTopic.description}
                                    onChange={e => setNewTopic({...newTopic, description: e.target.value})}
                                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-tertiary)', border: '1px solid rgba(0,240,255,0.2)', color: 'var(--text-primary)', outline: 'none', minHeight: '120px', resize: 'vertical', fontFamily: "monospace" }}
                                    placeholder="Provide necessary background data for this protocol..."
                                    onFocus={(e) => e.target.style.border = '1px solid var(--accent-blue)'}
                                    onBlur={(e) => e.target.style.border = '1px solid rgba(0,240,255,0.2)'}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--accent-blue)', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}>CLASSIFICATION</label>
                                <select
                                    value={newTopic.category}
                                    onChange={e => setNewTopic({...newTopic, category: e.target.value})}
                                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-secondary)', border: '1px solid rgba(0,240,255,0.2)', color: 'var(--text-primary)', outline: 'none', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}
                                >
                                    {categories.filter(c => c !== 'All').map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: '700', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}>
                                    ABORT
                                </button>
                                <button type="submit" disabled={submitting} className="btn-primary" style={{ padding: '12px 32px', background: 'var(--accent-blue)', color: 'var(--bg-primary)' }}>
                                    {submitting ? 'TRANSMITTING...' : 'INITIATE UPLOAD'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Topics;
