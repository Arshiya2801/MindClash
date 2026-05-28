import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const XPProgressBar = ({ xp = 0, level = 1, showDetails = true }) => {
    // Math formula: Level = Math.floor(Math.sqrt(XP / 100)) + 1
    // Therefore, XP = (Level - 1)^2 * 100
    const prevLevelXp = Math.pow(level - 1, 2) * 100;
    const nextLevelXp = Math.pow(level, 2) * 100;
    
    const xpInCurrentLevel = xp - prevLevelXp;
    const xpRequiredForNext = nextLevelXp - prevLevelXp;
    
    const progressPercentage = Math.min(Math.max((xpInCurrentLevel / xpRequiredForNext) * 100, 0), 100);

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {showDetails && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: '600' }}>
                    <span style={{ color: '#6366f1' }}>Level {level}</span>
                    <span style={{ color: '#737373' }}>
                        {xp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP
                    </span>
                    <span style={{ color: '#8b5cf6' }}>Level {level + 1}</span>
                </div>
            )}
            
            <div style={{
                height: '12px',
                background: '#e5e5e5',
                borderRadius: '50px',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #f59e0b)',
                        borderRadius: '50px',
                        boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)'
                    }}
                />
            </div>
            
            {showDetails && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#a3a3a3', marginTop: '2px' }}>
                    <Zap size={12} style={{ color: '#f59e0b' }} />
                    {(nextLevelXp - xp).toLocaleString()} XP to next level
                </div>
            )}
        </div>
    );
};

export default XPProgressBar;
