import React, { useState, useEffect } from 'react';
import { Play, Square, CheckCircle, Circle } from 'lucide-react';

const Dashboard = () => {
    const [routines, setRoutines] = useState([
        { id: 1, title: 'Morning Meditation', duration: 10, completed: false },
        { id: 2, title: 'Deep Work Session', duration: 60, completed: false },
        { id: 3, title: 'Mindful Walk', duration: 20, completed: false }
    ]);

    const [activeTimer, setActiveTimer] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        let interval = null;
        if (activeTimer && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && activeTimer) {
            // Timer finished
            handleComplete(activeTimer);
            setActiveTimer(null);
            // Optional: Play a sound here
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(e => console.log('Audio tracking not permitted'));
        }
        return () => clearInterval(interval);
    }, [activeTimer, timeLeft]);

    const toggleRoutine = (id) => {
        setRoutines(routines.map(r =>
            r.id === id ? { ...r, completed: !r.completed } : r
        ));
    };

    const startTimer = (routine) => {
        if (activeTimer === routine.id) {
            setActiveTimer(null); // Pause/Stop
        } else {
            setActiveTimer(routine.id);
            setTimeLeft(routine.duration * 60); // minutes to seconds
        }
    };

    const handleComplete = (id) => {
        setRoutines(routines.map(r =>
            r.id === id ? { ...r, completed: true } : r
        ));
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const completedCount = routines.filter(r => r.completed).length;
    const progress = Math.round((completedCount / routines.length) * 100) || 0;

    return (
        <div className="page-container">
            <h1 className="page-title">Good Morning!</h1>
            <p className="text-gradient" style={{ marginBottom: '2.5rem', fontSize: '1.25rem', fontWeight: '500' }}>
                Let's make today productive and mindful.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>

                {/* Progress Card */}
                <div className="glass-card">
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem', fontWeight: '600' }}>Daily Progress</h2>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', height: '14px', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid var(--border-glass)' }}>
                        <div
                            style={{
                                height: '100%',
                                background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                                width: `${progress}%`,
                                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 0 15px var(--primary-glow)'
                            }}
                        />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
                        {progress}% Completed <span style={{ opacity: 0.6, margin: '0 0.5rem' }}>•</span> {completedCount}/{routines.length} routines
                    </p>
                </div>

                {/* Routines Card */}
                <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: '600' }}>Today's Plan</h2>
                        <span className="text-gradient" style={{ fontWeight: '600' }}>{routines.length} Tasks</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {routines.map(routine => (
                            <div
                                key={routine.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '1.25rem',
                                    backgroundColor: routine.completed ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid',
                                    borderColor: routine.completed ? 'transparent' : 'var(--border-glass)',
                                    opacity: routine.completed ? 0.6 : 1,
                                    transition: 'all 0.3s ease',
                                    transform: activeTimer === routine.id ? 'scale(1.02)' : 'scale(1)',
                                    boxShadow: activeTimer === routine.id ? '0 10px 30px rgba(0,0,0,0.2)' : 'none'
                                }}
                            >
                                <button
                                    onClick={() => toggleRoutine(routine.id)}
                                    style={{
                                        marginRight: '1.25rem',
                                        color: routine.completed ? 'var(--primary)' : 'var(--text-secondary)',
                                        transition: 'transform 0.2s ease'
                                    }}
                                    className="hover-scale"
                                >
                                    {routine.completed ? <CheckCircle size={28} /> : <Circle size={28} />}
                                </button>

                                <div style={{ flex: 1 }}>
                                    <h3 style={{
                                        fontSize: '1.15rem',
                                        fontWeight: '600',
                                        textDecoration: routine.completed ? 'line-through' : 'none',
                                        color: routine.completed ? 'var(--text-secondary)' : 'white'
                                    }}>
                                        {routine.title}
                                    </h3>
                                    <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }}></div>
                                        {routine.duration} mins
                                    </span>
                                </div>

                                {!routine.completed && (
                                    <button
                                        className="btn-primary"
                                        onClick={() => startTimer(routine)}
                                        style={{
                                            background: activeTimer === routine.id ? '#ef4444' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                            padding: '0.6rem 1.25rem',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        {activeTimer === routine.id ? (
                                            <><Square size={16} /> Stop {formatTime(timeLeft)}</>
                                        ) : (
                                            <><Play size={16} /> Start Session</>
                                        )}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
