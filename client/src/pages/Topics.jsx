import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { topicAPI } from '../services/api';
import { MessageSquare, Flame, Lightbulb, Search, ThumbsUp, Plus } from 'lucide-react';
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
            alert('Topic suggested successfully!');
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <div className="glass-card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#171717', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MessageSquare size={28} style={{ color: '#6366f1' }} />
                            <span className="text-gradient">Debate Topics</span>
                        </h1>
                        <p style={{ color: '#737373', fontSize: '15px' }}>
                            Explore thought-provoking subjects or suggest your own!
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary"
                        onClick={() => setShowModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Plus size={18} />
                        Suggest Topic
                    </motion.button>
                </div>

                {/* Tabs & Search */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => setActiveTab('all')}
                            style={{
                                padding: '8px 20px', borderRadius: '12px', fontWeight: '600', fontSize: '14px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                background: activeTab === 'all' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#f5f5f5',
                                color: activeTab === 'all' ? '#fff' : '#737373',
                            }}
                        >
                            <Lightbulb size={16} /> All Topics
                        </button>
                        <button
                            onClick={() => setActiveTab('trending')}
                            style={{
                                padding: '8px 20px', borderRadius: '12px', fontWeight: '600', fontSize: '14px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                background: activeTab === 'trending' ? 'linear-gradient(135deg, #ef4444, #f97316)' : '#f5f5f5',
                                color: activeTab === 'trending' ? '#fff' : '#737373',
                            }}
                        >
                            <Flame size={16} /> Trending
                        </button>
                    </div>

                    <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3' }} />
                        <input
                            type="text"
                            placeholder="Search topics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '10px 12px 10px 38px', borderRadius: '12px', border: '1px solid #e5e5e5', background: '#fff', fontSize: '14px', color: '#171717', outline: 'none'
                            }}
                        />
                    </div>
                </div>
                
                {/* Category Filters */}
                {activeTab === 'all' && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '6px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                                    border: selectedCategory === cat ? 'none' : '1px solid #e5e5e5',
                                    background: selectedCategory === cat ? '#171717' : '#fff',
                                    color: selectedCategory === cat ? '#fff' : '#525252'
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
                <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                    <div className="spinner"></div>
                </div>
            ) : filteredTopics.length > 0 ? (
                <div className="grid-2">
                    {filteredTopics.map((topic, i) => (
                        <motion.div
                            key={topic._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card"
                            style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <span style={{
                                    padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', background: '#e0e7ff', color: '#4f46e5', textTransform: 'uppercase'
                                }}>
                                    {topic.category}
                                </span>
                                {topic.difficulty && (
                                    <span style={{ fontSize: '12px', color: '#737373', fontWeight: '500' }}>
                                        {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
                                    </span>
                                )}
                            </div>
                            
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#171717', marginBottom: '8px' }}>{topic.title}</h3>
                            <p style={{ color: '#525252', fontSize: '14px', lineHeight: '1.5', flex: 1, marginBottom: '20px' }}>
                                {topic.description}
                            </p>
                            
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e5e5e5', paddingTop: '16px' }}>
                                <button
                                    onClick={() => handleLike(topic._id)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: '#737373', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                                >
                                    <ThumbsUp size={16} /> {topic.likes || 0}
                                </button>
                                
                                <Link to={`/arena?topic=${topic._id}`}>
                                    <button style={{
                                        padding: '6px 14px', borderRadius: '8px', background: '#f5f5f5', border: '1px solid #e5e5e5', color: '#171717', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                                    }}>
                                        Debate This
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                    <MessageSquare size={48} style={{ color: '#d4d4d4', margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#171717', marginBottom: '8px' }}>No Topics Found</h3>
                    <p style={{ color: '#737373', fontSize: '14px' }}>Try adjusting your search or category filter.</p>
                </div>
            )}

            {/* Suggest Topic Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card"
                        style={{ width: '90%', maxWidth: '500px', padding: '32px' }}
                    >
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Suggest a Topic</h2>
                        <form onSubmit={handleSuggestTopic} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#171717' }}>Title</label>
                                <input
                                    type="text"
                                    required
                                    minLength={10}
                                    value={newTopic.title}
                                    onChange={e => setNewTopic({...newTopic, title: e.target.value})}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e5e5', outline: 'none' }}
                                    placeholder="E.g., Artificial Intelligence will replace developers"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#171717' }}>Description</label>
                                <textarea
                                    required
                                    value={newTopic.description}
                                    onChange={e => setNewTopic({...newTopic, description: e.target.value})}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e5e5', outline: 'none', minHeight: '100px', resize: 'vertical' }}
                                    placeholder="Provide context for this debate..."
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#171717' }}>Category</label>
                                <select
                                    value={newTopic.category}
                                    onChange={e => setNewTopic({...newTopic, category: e.target.value})}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e5e5', outline: 'none', background: '#fff' }}
                                >
                                    {categories.filter(c => c !== 'All').map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontWeight: '500' }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting} className="btn-primary" style={{ padding: '10px 20px' }}>
                                    {submitting ? 'Submitting...' : 'Submit Suggestion'}
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
