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
            <p style={{ color: 'var(--primary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                Let's make today productive and mindful.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Progress Card */}
                <div className="glass-card">
                    <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Daily Progress</h2>
                    <div style={{ backgroundColor: 'var(--border-color)', height: '12px', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
                        <div
                            style={{
                                height: '100%',
                                backgroundColor: 'var(--primary)',
                                width: `${progress}%`,
                                transition: 'width 0.5s ease'
                            }}
                        />
                    </div>
                    <p>{progress}% Completed ({completedCount}/{routines.length} routines)</p>
                </div>

                {/* Routines Card */}
                <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Today's Plan</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {routines.map(routine => (
                            <div
                                key={routine.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    backgroundColor: routine.completed ? 'var(--surface-hover)' : 'var(--bg-color)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    opacity: routine.completed ? 0.7 : 1,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <button
                                    onClick={() => toggleRoutine(routine.id)}
                                    style={{ marginRight: '1rem', color: routine.completed ? 'var(--primary)' : 'var(--text-color)' }}
                                >
                                    {routine.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                                </button>

                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.1rem', textDecoration: routine.completed ? 'line-through' : 'none' }}>
                                        {routine.title}
                                    </h3>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>{routine.duration} mins</span>
                                </div>

                                {!routine.completed && (
                                    <button
                                        className="btn-primary"
                                        onClick={() => startTimer(routine)}
                                        style={{ backgroundColor: activeTimer === routine.id ? '#ef4444' : 'var(--primary)' }}
                                    >
                                        {activeTimer === routine.id ? (
                                            <><Square size={16} /> Stop {formatTime(timeLeft)}</>
                                        ) : (
                                            <><Play size={16} /> Start</>
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
