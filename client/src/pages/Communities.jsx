import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { communityAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, Plus, Search, Shield, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const Communities = () => {
    const { user } = useAuth();
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [newCommunity, setNewCommunity] = useState({ name: '', description: '', category: 'General', isPrivate: false });
    const [submitting, setSubmitting] = useState(false);

    const categories = ['All', 'Technology', 'Politics', 'Science', 'Philosophy', 'Entertainment', 'General'];
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        fetchCommunities();
    }, [selectedCategory, searchQuery]);

    // Simple debounce effect for search
    const fetchCommunities = async () => {
        setLoading(true);
        try {
            const params = {};
            if (selectedCategory !== 'All') params.category = selectedCategory;
            if (searchQuery.length > 2) params.search = searchQuery;
            
            const res = await communityAPI.getAll(params);
            setCommunities(res.data?.communities || []);
        } catch (err) {
            console.error('Failed to fetch communities', err);
        }
        setLoading(false);
    };

    const handleCreateCommunity = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await communityAPI.create(newCommunity);
            alert('Community created successfully!');
            setShowModal(false);
            setNewCommunity({ name: '', description: '', category: 'General', isPrivate: false });
            fetchCommunities();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create community');
        }
        setSubmitting(false);
    };

    const handleJoinCommunity = async (communityId) => {
        try {
            await communityAPI.join(communityId);
            alert('Joined community!');
            fetchCommunities(); // refresh list
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to join');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <div className="glass-card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#171717', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Users size={28} style={{ color: '#6366f1' }} />
                            <span className="text-gradient">Debate Communities</span>
                        </h1>
                        <p style={{ color: '#737373', fontSize: '15px' }}>
                            Join like-minded individuals and discuss specialized topics.
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
                        Create Community
                    </motion.button>
                </div>

                {/* Filters & Search */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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

                    <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3' }} />
                        <input
                            type="text"
                            placeholder="Search communities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '10px 12px 10px 38px', borderRadius: '12px', border: '1px solid #e5e5e5', background: '#fff', fontSize: '14px', color: '#171717', outline: 'none'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Communities Grid */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                    <div className="spinner"></div>
                </div>
            ) : communities.length > 0 ? (
                <div className="grid-3">
                    {communities.map((comm, i) => (
                        <motion.div
                            key={comm._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card"
                            style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', borderTop: `4px solid ${comm.color || '#6366f1'}` }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px', background: comm.color ? `${comm.color}20` : '#e0e7ff', color: comm.color || '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold'
                                }}>
                                    {comm.avatar || comm.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#171717' }}>{comm.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                        <span style={{ fontSize: '12px', color: '#737373', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Users size={12} /> {comm.memberCount} members
                                        </span>
                                        {comm.isPrivate && (
                                            <span style={{ fontSize: '12px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                <Shield size={12} /> Private
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <p style={{ color: '#525252', fontSize: '14px', lineHeight: '1.5', flex: 1, marginBottom: '20px' }}>
                                {comm.description}
                            </p>
                            
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e5e5e5', paddingTop: '16px' }}>
                                <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', background: '#f5f5f5', color: '#737373' }}>
                                    {comm.category}
                                </span>
                                
                                <button 
                                    onClick={() => handleJoinCommunity(comm._id)}
                                    style={{
                                        padding: '6px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid #6366f1', color: '#6366f1', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                                    }}
                                >
                                    Join
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                    <Users size={48} style={{ color: '#d4d4d4', margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#171717', marginBottom: '8px' }}>No Communities Found</h3>
                    <p style={{ color: '#737373', fontSize: '14px' }}>Try adjusting your search or create a new one!</p>
                </div>
            )}

            {/* Create Community Modal */}
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
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Create Community</h2>
                        <form onSubmit={handleCreateCommunity} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#171717' }}>Community Name</label>
                                <input
                                    type="text"
                                    required
                                    minLength={3}
                                    value={newCommunity.name}
                                    onChange={e => setNewCommunity({...newCommunity, name: e.target.value})}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e5e5', outline: 'none' }}
                                    placeholder="E.g., AI Enthusiasts"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#171717' }}>Description</label>
                                <textarea
                                    required
                                    value={newCommunity.description}
                                    onChange={e => setNewCommunity({...newCommunity, description: e.target.value})}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e5e5', outline: 'none', minHeight: '100px', resize: 'vertical' }}
                                    placeholder="What is this community about?"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#171717' }}>Category</label>
                                <select
                                    value={newCommunity.category}
                                    onChange={e => setNewCommunity({...newCommunity, category: e.target.value})}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e5e5', outline: 'none', background: '#fff' }}
                                >
                                    {categories.filter(c => c !== 'All').map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input 
                                    type="checkbox" 
                                    id="isPrivate" 
                                    checked={newCommunity.isPrivate}
                                    onChange={e => setNewCommunity({...newCommunity, isPrivate: e.target.checked})}
                                />
                                <label htmlFor="isPrivate" style={{ fontSize: '14px', color: '#171717' }}>Make this community private (requires approval to join)</label>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontWeight: '500' }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting} className="btn-primary" style={{ padding: '10px 20px' }}>
                                    {submitting ? 'Creating...' : 'Create Community'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Communities;
