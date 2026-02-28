import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, MessageCircle, X, Sparkles } from 'lucide-react';

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your Mindful AI. How can I help you stay grounded and productive today?' }
    ]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const usedVoice = useRef(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Setup Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                usedVoice.current = true;
                handleSend(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const speakResponse = (text) => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();
            // Try to find a nice premium-sounding voice
            const premiumVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Samantha'));
            if (premiumVoice) utterance.voice = premiumVoice;

            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSend = async (textToSend = input) => {
        if (!textToSend.trim()) return;

        const currentInput = textToSend;
        const newMessages = [...messages, { role: 'user', content: currentInput }];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: newMessages.slice(-10) }) // Send more context
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, data]);
                setIsTyping(false);

                // Auto-speak if the user used voice OR if it's a short proactive response
                if (usedVoice.current) {
                    speakResponse(data.content);
                    usedVoice.current = false; // Reset
                }
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'I am sorry, I am having trouble connecting to my core right now.' }]);
                setIsTyping(false);
            }
        } catch (error) {
            console.error('Error fetching API', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'My apologies, the connection seems to be interrupted.' }]);
            setIsTyping(false);
        }
    };

    return (
        <div className="chat-widget-container">
            {isOpen ? (
                <div className="chat-window">
                    <div className="chat-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ background: 'var(--primary)', padding: '0.4rem', borderRadius: '8px' }}>
                                <Sparkles size={18} color="white" />
                            </div>
                            <span>Mindful AI</span>
                        </div>
                        <button className="btn-icon" onClick={() => setIsOpen(false)} style={{ color: 'white', opacity: 0.7 }}>
                            <X size={24} />
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                {msg.content}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message assistant" style={{ display: 'flex', gap: '4px', padding: '0.75rem 1rem' }}>
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-area">
                        <input
                            type="text"
                            className="chat-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="How can I assist you..."
                        />
                        {recognitionRef.current && (
                            <button
                                className={`chat-voice-btn ${isListening ? 'listening' : ''}`}
                                onClick={toggleListening}
                                title="Voice Input"
                            >
                                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>
                        )}
                        <button className="chat-send-btn" onClick={() => handleSend()}>
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            ) : (
                <button className="chat-fab" onClick={() => setIsOpen(true)}>
                    <MessageCircle size={32} />
                </button>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .typing-dot {
                    width: 6px;
                    height: 6px;
                    background: var(--text-secondary);
                    border-radius: 50%;
                    animation: typingPulse 1.4s infinite ease-in-out;
                }
                .typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .typing-dot:nth-child(3) { animation-delay: 0.4s; }
                @keyframes typingPulse {
                    0%, 100% { transform: translateY(0); opacity: 0.4; }
                    50% { transform: translateY(-4px); opacity: 1; }
                }
            `}} />
        </div>
    );
};

export default AIChatWidget;
