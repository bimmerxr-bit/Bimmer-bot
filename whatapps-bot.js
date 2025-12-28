<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BMW Bot Dashboard</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .dashboard-nav {
            background: #1a1a1a;
            padding: 1rem 0;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
        }
        
        .dashboard-nav .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .nav-brand {
            color: white;
            font-size: 1.5rem;
            text-decoration: none;
            font-family: 'Oswald', sans-serif;
        }
        
        .nav-brand i {
            color: #25D366;
            margin-right: 10px;
        }
        
        .back-btn {
            background: #25D366;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: 500;
        }
        
        .back-btn:hover {
            background: #1da851;
        }
        
        .real-time-update {
            background: #e8f4ff;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            border-left: 4px solid #25D366;
        }
        
        .message-item {
            background: white;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 8px;
            border-left: 4px solid #0066b3;
        }
        
        .message-item.bot {
            border-left-color: #25D366;
        }
        
        .message-item .meta {
            font-size: 0.8rem;
            color: #666;
            margin-bottom: 0.5rem;
        }
        
        .export-buttons {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .export-btn {
            background: #0066b3;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .export-btn:hover {
            background: #0056a3;
        }
        
        .export-btn.csv {
            background: #28a745;
        }
        
        .export-btn.csv:hover {
            background: #218838;
        }
        
        .export-btn.json {
            background: #6f42c1;
        }
        
        .export-btn.json:hover {
            background: #5a32a3;
        }
        
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: #25D366;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            display: none;
            z-index: 2000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .notification.show {
            display: block;
            animation: slideInRight 0.3s ease;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="dashboard-nav">
        <div class="container">
            <a href="#" class="nav-brand">
                <i class="fab fa-whatsapp"></i>
                BMW Bot Dashboard
            </a>
            <a href="index.html" class="back-btn">
                <i class="fas fa-arrow-left"></i> Back to Website
            </a>
        </div>
    </nav>

    <!-- Main Dashboard -->
    <main class="dashboard">
        <div class="container">
            <div class="dashboard-header">
                <h1>BMW WhatsApp Bot Dashboard</h1>
                <p class="section-subtitle">Monitor and manage your AI assistant</p>
            </div>

            <!-- Real-time Stats -->
            <div class="real-time-update">
                <h3><i class="fas fa-chart-line"></i> Real-time Statistics</h3>
                <div class="stats-grid" id="live-stats">
                    <!-- Updated by JavaScript -->
                </div>
            </div>

            <!-- Dashboard Grid -->
            <div class="dashboard-grid">
                <!-- Conversations -->
                <div class="dashboard-card">
                    <h3><i class="fas fa-comments"></i> Recent Conversations</h3>
                    <div class="conversation-list" id="conversation-list">
                        <!-- Loaded by JavaScript -->
                    </div>
                    <button class="btn-delete" onclick="clearConversations()">
                        <i class="fas fa-trash"></i> Clear All Conversations
                    </button>
                </div>

                <!-- Message Log -->
                <div class="dashboard-card">
                    <h3><i class="fas fa-history"></i> Message Log</h3>
                    <div class="message-log" id="message-log">
                        <!-- Loaded by JavaScript -->
                    </div>
                </div>

                <!-- Bot Configuration -->
                <div class="dashboard-card bot-config">
                    <h3><i class="fas fa-cogs"></i> Bot Configuration</h3>
                    <form id="bot-config-form">
                        <div>
                            <label>Bot Name:</label>
                            <input type="text" id="bot-name" value="BMW Assistant" required>
                        </div>
                        <div>
                            <label>Welcome Message:</label>
                            <textarea id="welcome-msg" rows="3">Hello! I'm your BMW Assistant. How can I help you today?</textarea>
                        </div>
                        <div>
                            <label>Response Speed:</label>
                            <select id="response-speed">
                                <option value="fast">Fast (1 second)</option>
                                <option value="normal" selected>Normal (2 seconds)</option>
                                <option value="slow">Slow (3 seconds)</option>
                            </select>
                        </div>
                        <div>
                            <label>Auto-reply to:</label>
                            <div>
                                <input type="checkbox" id="auto-greeting" checked> Greetings
                                <input type="checkbox" id="auto-models" checked> Model Inquiries
                                <input type="checkbox" id="auto-testdrive" checked> Test Drive Requests
                            </div>
                        </div>
                        <button type="submit" class="btn-save">
                            <i class="fas fa-save"></i> Save Configuration
                        </button>
                    </form>
                </div>

                <!-- Export Data -->
                <div class="dashboard-card">
                    <h3><i class="fas fa-download"></i> Export Data</h3>
                    <p>Export conversation data for analysis:</p>
                    <div class="export-buttons">
                        <button class="export-btn csv" onclick="exportData('csv')">
                            <i class="fas fa-file-csv"></i> CSV
                        </button>
                        <button class="export-btn json" onclick="exportData('json')">
                            <i class="fas fa-file-code"></i> JSON
                        </button>
                        <button class="export-btn" onclick="exportData('pdf')">
                            <i class="fas fa-file-pdf"></i> PDF
                        </button>
                    </div>
                    
                    <div style="margin-top: 2rem;">
                        <h4>Quick Replies Configuration</h4>
                        <div id="quick-replies-config">
                            <!-- Quick replies will be loaded here -->
                        </div>
                        <button class="btn-save" onclick="addQuickReply()" style="margin-top: 1rem;">
                            <i class="fas fa-plus"></i> Add Quick Reply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Notification -->
    <div class="notification" id="notification"></div>

    <script src="bot-dashboard.js"></script>
</body>
</html>
