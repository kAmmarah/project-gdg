import React, { useState } from 'react';
import { Play, Pause, Wind, Droplets, Sun, Activity } from 'lucide-react';

const Mindfulness = () => {
    const [activeSession, setActiveSession] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const sessions = [
        { id: 1, title: 'Deep Breathing', duration: '5 min', icon: <Wind size={32} />, color: '#72968a', desc: 'A quick 5-minute box breathing exercise.' },
        { id: 2, title: 'Morning Clarity', duration: '10 min', icon: <Sun size={32} />, color: '#eab308', desc: 'Start your day with intention and gratitude.' },
        { id: 3, title: 'Body Scan', duration: '15 min', icon: <Activity size={32} />, color: '#6366f1', desc: 'Scan through your body to release tension.' },
        { id: 4, title: 'Ocean Waves', duration: '20 min', icon: <Droplets size={32} />, color: '#0ea5e9', desc: 'Immersive ambient sounds for deep focus.' }
    ];

    const handlePlay = (id) => {
        if (activeSession === id) {
            setIsPlaying(!isPlaying);
        } else {
            setActiveSession(id);
            setIsPlaying(true);
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Mindfulness Center</h1>
            <p style={{ color: 'var(--primary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                Take a moment for yourself. Choose a session to begin.
            </p>

            {/* Featured/Active Player Area */}
            {activeSession && (
                <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem', backgroundColor: 'var(--surface-hover)', borderColor: 'var(--primary)' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        backgroundColor: sessions.find(s => s.id === activeSession)?.color + '20', // Add transparency
                        color: sessions.find(s => s.id === activeSession)?.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem',
                        animation: isPlaying ? 'pulse 4s infinite' : 'none',
                        boxShadow: `0 0 0 ${isPlaying ? '20px' : '0'} ${sessions.find(s => s.id === activeSession)?.color}10`
                    }}>
                        {sessions.find(s => s.id === activeSession)?.icon}
                    </div>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                        {sessions.find(s => s.id === activeSession)?.title}
                    </h2>
                    <p style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>
                        Relax, breathe, and follow the audio.
                    </p>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'var(--shadow-md)',
                            transition: 'transform 0.2s',
                            transform: isPlaying ? 'scale(0.95)' : 'scale(1)'
                        }}
                    >
                        {isPlaying ? <Pause size={32} /> : <Play size={32} style={{ marginLeft: '4px' }} />}
                    </button>
                </div>
            )}

            {/* Grid of Sessions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {sessions.map(session => (
                    <div
                        key={session.id}
                        className="glass-card"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            cursor: 'pointer',
                            border: activeSession === session.id ? `2px solid ${session.color}` : '1px solid var(--border-color)'
                        }}
                        onClick={() => handlePlay(session.id)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: `${session.color}15`,
                                color: session.color
                            }}>
                                {session.icon}
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--secondary)', padding: '0.2rem 0.6rem', backgroundColor: 'var(--bg-color)', borderRadius: '1rem' }}>
                                {session.duration}
                            </span>
                        </div>

                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{session.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--secondary)', flex: 1, marginBottom: '1.5rem' }}>
                            {session.desc}
                        </p>

                        <div style={{
                            marginTop: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: activeSession === session.id && isPlaying ? session.color : 'var(--primary)',
                            fontWeight: '500'
                        }}>
                            {activeSession === session.id && isPlaying ? (
                                <><Pause size={18} /> Playing</>
                            ) : (
                                <><Play size={18} /> Play Session</>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Mindfulness;
