import React, { useState } from 'react';
import { Plus, Trash2, Clock, Calendar } from 'lucide-react';

const Routines = () => {
    const [routines, setRoutines] = useState([
        { id: 1, title: 'Morning Meditation', duration: '10', type: 'Mindfulness', time: '08:00' },
        { id: 2, title: 'Deep Work Session', duration: '60', type: 'Productivity', time: '09:00' },
        { id: 3, title: 'Mindful Walk', duration: '20', type: 'Health', time: '12:00' }
    ]);

    const [newRoutine, setNewRoutine] = useState({ title: '', duration: '', type: 'Productivity', time: '' });

    const addRoutine = (e) => {
        e.preventDefault();
        if (!newRoutine.title || !newRoutine.duration) return;

        setRoutines([
            ...routines,
            {
                id: Date.now(),
                ...newRoutine
            }
        ]);
        setNewRoutine({ title: '', duration: '', type: 'Productivity', time: '' });
    };

    const deleteRoutine = (id) => {
        setRoutines(routines.filter(r => r.id !== id));
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Routines & Schedule</h1>
            <p style={{ color: 'var(--primary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                Plan your day intentionally for maximum peace and productivity.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>

                {/* Add New Routine Form */}
                <div className="glass-card" style={{ height: 'fit-content' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={20} /> Add Routine
                    </h2>

                    <form onSubmit={addRoutine} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Task Name</label>
                            <input
                                type="text"
                                className="chat-input"
                                style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
                                placeholder="e.g. Read a book"
                                value={newRoutine.title}
                                onChange={e => setNewRoutine({ ...newRoutine, title: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Duration (min)</label>
                                <input
                                    type="number"
                                    className="chat-input"
                                    style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
                                    placeholder="30"
                                    value={newRoutine.duration}
                                    onChange={e => setNewRoutine({ ...newRoutine, duration: e.target.value })}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Time</label>
                                <input
                                    type="time"
                                    className="chat-input"
                                    style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
                                    value={newRoutine.time}
                                    onChange={e => setNewRoutine({ ...newRoutine, time: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Category</label>
                            <select
                                className="chat-input"
                                style={{ width: '100%', borderRadius: 'var(--radius-md)', appearance: 'none' }}
                                value={newRoutine.type}
                                onChange={e => setNewRoutine({ ...newRoutine, type: e.target.value })}
                            >
                                <option value="Productivity">Productivity</option>
                                <option value="Mindfulness">Mindfulness</option>
                                <option value="Health">Health</option>
                                <option value="Rest">Rest</option>
                            </select>
                        </div>

                        <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
                            Save Routine
                        </button>
                    </form>
                </div>

                {/* Routines List */}
                <div className="glass-card">
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={20} /> Your Schedule
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {routines.sort((a, b) => a.time.localeCompare(b.time)).map(routine => (
                            <div
                                key={routine.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    backgroundColor: 'var(--bg-color)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    transition: 'transform 0.2s ease',
                                    cursor: 'default'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    padding: '0.5rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: '600',
                                    marginRight: '1rem',
                                    minWidth: '80px',
                                    textAlign: 'center'
                                }}>
                                    {routine.time || '--:--'}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{routine.title}</h3>
                                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--secondary)', fontSize: '0.85rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                            <Clock size={14} /> {routine.duration} mins
                                        </span>
                                        <span style={{ padding: '0.1rem 0.5rem', backgroundColor: 'var(--surface-hover)', borderRadius: '1rem' }}>
                                            {routine.type}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => deleteRoutine(routine.id)}
                                    className="btn-icon"
                                    style={{ color: '#ef4444', padding: '0.5rem' }}
                                    title="Remove Routine"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}

                        {routines.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--secondary)' }}>
                                No routines scheduled. Add one to get started!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Routines;
