import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, MessageCircle, X } from 'lucide-react';

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! How can I help you stay mindful and productive today?' }
    ]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            const utterance = new SpeechSynthesisUtterance(text);
            // Optional: Get a calming voice if available
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.lang.includes('en') && v.name.includes('Female')) || voices[0];
            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.rate = 0.9;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSend = async (textToSend = input) => {
        if (!textToSend.trim()) return;

        const newMessages = [...messages, { role: 'user', content: textToSend }];
        setMessages(newMessages);
        setInput('');

        try {
            // If running locally, this targets the Vercel backend /api/chat route
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: newMessages.slice(-5) }) // Send last 5 for context
            });

            if (response.ok) {
                const data = await response.json();
                setMessages([...newMessages, data]);

                // If voice was used recently or we want to read it aloud
                if (isListening || data.content) {
                    // Speak by default if it was a voice query, but here we can just optionally speak it
                    // Let's only speak if the user was using voice
                    // Actually, let's just speak if it's a short response or if voice mode active
                    speakResponse(data.content);
                }
            } else {
                setMessages([...newMessages, { role: 'assistant', content: 'Oops! I am having trouble connecting.' }]);
            }
        } catch (error) {
            console.error('Error fetching API', error);
            setMessages([...newMessages, { role: 'assistant', content: 'Sorry, my server might be down.' }]);
        }
    };

    return (
        <div className="chat-widget-container">
            {isOpen ? (
                <div className="chat-window">
                    <div className="chat-header">
                        <span>Mindful AI</span>
                        <button className="btn-icon" onClick={() => setIsOpen(false)}>
                            <X size={20} color="white" />
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                {msg.content}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-area">
                        <input
                            type="text"
                            className="chat-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                        />
                        {recognitionRef.current && (
                            <button
                                className={`chat-voice-btn ${isListening ? 'listening' : ''}`}
                                onClick={toggleListening}
                                title="Voice Input"
                            >
                                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                            </button>
                        )}
                        <button className="chat-send-btn" onClick={() => handleSend()}>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                <button className="chat-fab" onClick={() => setIsOpen(true)}>
                    <MessageCircle size={30} />
                </button>
            )}
        </div>
    );
};

export default AIChatWidget;
