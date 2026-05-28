import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, X } from 'lucide-react';

const LevelUpModal = ({ isOpen, onClose, level }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(8px)',
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            padding: '40px',
                            borderRadius: '24px',
                            width: '90%',
                            maxWidth: '400px',
                            textAlign: 'center',
                            position: 'relative',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#a3a3a3'
                            }}
                        >
                            <X size={24} />
                        </button>

                        {/* Floating elements animation */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                color: '#fcd34d',
                                zIndex: -1
                            }}
                        >
                            <Sparkles size={80} />
                        </motion.div>

                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)'
                        }}>
                            <Trophy size={40} />
                        </div>

                        <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#171717', marginBottom: '8px' }}>
                            Level Up!
                        </h2>

                        <p style={{ fontSize: '16px', color: '#525252', marginBottom: '32px' }}>
                            Congratulations! You've reached <strong style={{ color: '#6366f1' }}>Level {level}</strong>. Keep dominating those debates!
                        </p>

                        <motion.button
                            onClick={onClose}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                            }}
                        >
                            Awesome!
                        </motion.button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LevelUpModal;
