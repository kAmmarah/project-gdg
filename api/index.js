const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define Tools / Functions
const foodpandaTool = {
    name: "orderFoodpanda",
    description: "Place an order for food delivery via Foodpanda. Call this whenever a user asks to order food or mentions Foodpanda.",
    parameters: {
        type: "object",
        properties: {
            food_items: {
                type: "string",
                description: "The food items the user wants to order, e.g. 'Pizza', 'Burger and fries'. If unspecified, ask them what they want."
            },
            restaurant: {
                type: "string",
                description: "The name of the restaurant, if specified. E.g. 'KFC', 'McDonalds'."
            }
        },
        required: ["food_items"]
    }
};

const indriveTool = {
    name: "bookInDrive",
    description: "Book a ride or taxi using the inDrive service. Call this when the user asks for a ride, cab, or mentions inDrive.",
    parameters: {
        type: "object",
        properties: {
            destination: {
                type: "string",
                description: "The destination address or location the user wants to go to."
            },
            pickup: {
                type: "string",
                description: "The pickup location. If not specified, default to 'Current Location'."
            }
        },
        required: ["destination"]
    }
};

const tools = [
    {
        functionDeclarations: [foodpandaTool, indriveTool]
    }
];

// Mock executions
const executeFoodpanda = (args) => {
    const { food_items, restaurant } = args;
    const restStr = restaurant ? ` from ${restaurant}` : '';
    return {
        status: "success",
        message: `Successfully placed an order for ${food_items}${restStr} via Foodpanda. It will arrive in 30 minutes.`,
        order_id: Math.floor(Math.random() * 100000)
    };
};

const executeInDrive = (args) => {
    const { destination, pickup } = args;
    const pickupLocation = pickup || 'Current Location';
    return {
        status: "success",
        message: `A driver has been booked via inDrive. They are picking you up at '${pickupLocation}' and heading to '${destination}'.`,
        driver_eta: "5 minutes",
        fare: "$12.50"
    };
};


// Root route - Premium Landing Page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Project GDG API | Status</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
            <style>
                :root {
                    --primary: #6366f1;
                    --secondary: #a855f7;
                    --bg: #0f172a;
                    --card: rgba(30, 41, 59, 0.7);
                    --text: #f8fafc;
                    --text-muted: #94a3b8;
                }
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Outfit', sans-serif;
                    background-color: var(--bg);
                    background-image: 
                        radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, rgba(168, 85, 247, 0.15) 0px, transparent 50%);
                    color: var(--text);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    overflow: hidden;
                }
                .container {
                    background: var(--card);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 3rem;
                    border-radius: 24px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    text-align: center;
                    max-width: 500px;
                    width: 90%;
                    animation: fadeIn 0.8s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                h1 {
                    font-size: 2.5rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                p { color: var(--text-muted); margin-bottom: 2rem; line-height: 1.6; }
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    background: rgba(34, 197, 94, 0.1);
                    color: #4ade80;
                    padding: 0.5rem 1rem;
                    border-radius: 99px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-bottom: 2rem;
                    border: 1px solid rgba(34, 197, 94, 0.2);
                }
                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #22c55e;
                    border-radius: 50%;
                    margin-right: 8px;
                    box-shadow: 0 0 12px #22c55e;
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { opacity: 0.5; }
                    50% { opacity: 1; }
                    100% { opacity: 0.5; }
                }
                .actions { display: grid; gap: 1rem; }
                .btn {
                    padding: 1rem;
                    border-radius: 12px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn-primary {
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    color: white;
                }
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);
                }
                .btn-secondary {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.2);
                }
                .footer {
                    margin-top: 2rem;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="status-badge">
                    <div class="status-dot"></div>
                    API Online
                </div>
                <h1>Project GDG</h1>
                <p>Welcome to the core intelligence engine. The backend is fully operational and ready to process requests.</p>
                
                <div class="actions">
                    <a href="http://localhost:5173" class="btn btn-primary">Go to Application</a>
                    <a href="/api/health" class="btn btn-secondary">Check Health Sync</a>
                </div>
                
                <div class="footer">
                    Running on port 3001 &bull; Development Mode
                </div>
            </div>
        </body>
        </html>
    `);
});

// Basic health check - Premium Status Dashboard
app.get('/api/health', (req, res) => {
    const healthData = {
        status: 'ok',
        message: 'API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 3001,
        model: 'gemini-2.5-flash'
    };

    // If request asks for HTML (browser), send UI. Otherwise send JSON.
    if (req.accepts('html')) {
        return res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>API System Status</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
                <style>
                    :root {
                        --primary: #6366f1;
                        --secondary: #a855f7;
                        --bg: #0f172a;
                        --card: rgba(30, 41, 59, 0.7);
                        --text: #f8fafc;
                        --text-muted: #94a3b8;
                    }
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Outfit', sans-serif;
                        background-color: var(--bg);
                        background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0);
                        background-size: 32px 32px;
                        color: var(--text);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                    }
                    .dashboard {
                        background: var(--card);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        padding: 2.5rem;
                        border-radius: 20px;
                        width: 90%;
                        max-width: 600px;
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
                        animation: slideIn 0.5s ease-out;
                    }
                    @keyframes slideIn {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 2rem;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                        padding-bottom: 1rem;
                    }
                    h1 { font-size: 1.5rem; font-weight: 600; }
                    .status-tag {
                        background: rgba(34, 197, 94, 0.1);
                        color: #4ade80;
                        padding: 0.25rem 0.75rem;
                        border-radius: 99px;
                        font-size: 0.75rem;
                        font-weight: 600;
                        border: 1px solid rgba(34, 197, 94, 0.2);
                        display: flex;
                        align-items: center;
                    }
                    .dot { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; margin-right: 6px; }
                    
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1.5rem;
                        margin-bottom: 2rem;
                    }
                    .stat-item {
                        padding: 1rem;
                        background: rgba(15, 23, 42, 0.5);
                        border-radius: 12px;
                        border: 1px solid rgba(255, 255, 255, 0.05);
                    }
                    .stat-label { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
                    .stat-value { font-size: 1rem; font-weight: 400; color: white; }

                    .actions { display: flex; gap: 1rem; }
                    .btn {
                        flex: 1;
                        padding: 0.75rem;
                        border-radius: 10px;
                        text-decoration: none;
                        font-weight: 600;
                        font-size: 0.875rem;
                        text-align: center;
                        transition: all 0.2s;
                    }
                    .btn-primary { background: var(--primary); color: white; }
                    .btn-primary:hover { background: #4f46e5; }
                    .btn-outline { border: 1px solid rgba(255, 255, 255, 0.1); color: var(--text-muted); }
                    .btn-outline:hover { background: rgba(255, 255, 255, 0.05); color: white; }
                </style>
            </head>
            <body>
                <div class="dashboard">
                    <div class="header">
                        <h1>System Health</h1>
                        <div class="status-tag"><span class="dot"></span> Operational</div>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-label">Message</div>
                            <div class="stat-value">${healthData.message}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Environment</div>
                            <div class="stat-value">${healthData.environment}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Port</div>
                            <div class="stat-value">${healthData.port}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">AI Model</div>
                            <div class="stat-value">${healthData.model}</div>
                        </div>
                    </div>

                    <div class="actions">
                        <a href="/" class="btn btn-outline">Back to Portal</a>
                        <a href="http://localhost:5173" class="btn btn-primary">Go to App</a>
                    </div>
                </div>
            </body>
            </html>
        `);
    }

    // Default to JSON for API calls
    res.json(healthData);
});

// Chatbot Functionality Route
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Messages array is required and must not be empty' });
        }

        const systemInstruction = 'You are a calming, helpful mindfulness and productivity assistant. You also have the ability to help the user with daily tasks like ordering food via Foodpanda or booking rides via inDrive. If they ask for food or a ride, use your tools! Always be empathetic and conversational. Format output cleanly without using markdown wrappers if possible.';

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: systemInstruction,
            tools: tools,
        });

        const latestMessage = messages[messages.length - 1];

        // Convert history format
        const historyFrames = messages.slice(0, -1).map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content || '' }]
        }));

        const chat = model.startChat({
            history: historyFrames
        });

        // 1. Send initial user message
        let result = await chat.sendMessage([{ text: latestMessage.content || '' }]);
        let response = result.response;

        // 2. Loop to handle multiple function calls if necessary
        // Gemini returns a functionCalls array on response
        while (response.functionCalls && response.functionCalls.length > 0) {
            const calls = response.functionCalls;
            const call = calls[0];
            let apiResponse = null;

            // 3. Execute the mock tool locally
            if (call.name === 'orderFoodpanda') {
                apiResponse = executeFoodpanda(call.args);
            } else if (call.name === 'bookInDrive') {
                apiResponse = executeInDrive(call.args);
            } else {
                apiResponse = { error: "Unknown function" };
            }

            // 4. Send the result back to the model
            result = await chat.sendMessage([{
                functionResponse: {
                    name: call.name,
                    response: apiResponse
                }
            }]);

            response = result.response;
        }

        // 5. Final text response
        const finalContent = response.text();

        res.json({
            role: 'assistant',
            content: finalContent
        });

    } catch (error) {
        console.error('Error with Gemini API:', error);
        res.status(500).json({ error: 'Internal server error processing the chat request.' });
    }
});

module.exports = app;

// Allow listening locally
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Development API server running on port ${PORT}`);
    });
}
