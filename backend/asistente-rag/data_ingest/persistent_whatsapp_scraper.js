// Scraper persistente de WhatsApp con reconexión automática
// Para servidor en la nube con acceso continuo a grupos
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuración para servidor en la nube
const CONFIG = {
    RAG_API_URL: process.env.RAG_API_URL || 'http://localhost:8000/ingest/messages',
    SESSION_PATH: './whatsapp_session',
    RECONNECT_INTERVAL: 30000, // 30 segundos
    MAX_RECONNECT_ATTEMPTS: 10,
    HEARTBEAT_INTERVAL: 60000, // 1 minuto
    QR_WEBHOOK_URL: process.env.QR_WEBHOOK_URL, // Para enviar QR por webhook
    TARGET_GROUPS: [
        'Metalurgia UNSAAC 2025',
        'CF Metalurgia - Académico', 
        'Dudas Metalurgia',
        'Laboratorio Metalurgia',
        'Proyectos de Grado'
    ]
};

class PersistentWhatsAppScraper {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.heartbeatInterval = null;
        this.monitoredGroups = new Map();
        
        this.initializeClient();
        this.setupGracefulShutdown();
    }

    initializeClient() {
        console.log('🔄 Inicializando cliente WhatsApp persistente...');
        
        this.client = new Client({
            authStrategy: new LocalAuth({
                clientId: "metalurgia-rag-persistent",
                dataPath: CONFIG.SESSION_PATH
            }),
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-renderer-backgrounding'
                ]
            }
        });

        this.setupEventHandlers();
    }

    setupEventHandlers() {
        // QR Code para autenticación inicial
        this.client.on('qr', async (qr) => {
            console.log('📱 Código QR generado:');
            qrcode.generate(qr, { small: true });
            
            // Enviar QR por webhook para configuración remota
            if (CONFIG.QR_WEBHOOK_URL) {
                try {
                    await axios.post(CONFIG.QR_WEBHOOK_URL, {
                        qr: qr,
                        timestamp: new Date().toISOString(),
                        message: 'Escanea este QR desde tu WhatsApp para mantener conexión continua'
                    });
                    console.log('✅ QR enviado por webhook');
                } catch (error) {
                    console.error('❌ Error enviando QR por webhook:', error.message);
                }
            }
        });

        // Cliente listo
        this.client.on('ready', async () => {
            console.log('✅ Cliente WhatsApp conectado y listo!');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            
            await this.findTargetGroups();
            this.startHeartbeat();
            
            console.log(`🎯 Monitoreando ${this.monitoredGroups.size} grupos activamente`);
        });

        // Autenticación exitosa
        this.client.on('authenticated', () => {
            console.log('🔐 Autenticación exitosa - sesión guardada');
        });

        // Error de autenticación
        this.client.on('auth_failure', (msg) => {
            console.error('❌ Fallo de autenticación:', msg);
            this.handleReconnect();
        });

        // Cliente desconectado
        this.client.on('disconnected', (reason) => {
            console.warn('⚠️ Cliente desconectado:', reason);
            this.isConnected = false;
            this.stopHeartbeat();
            this.handleReconnect();
        });

        // Mensajes entrantes
        this.client.on('message', async (message) => {
            try {
                if (message.from.includes('@g.us')) { // Es un grupo
                    const chat = await message.getChat();
                    
                    if (this.monitoredGroups.has(chat.id._serialized)) {
                        await this.processGroupMessage(message, chat);
                    }
                }
            } catch (error) {
                console.error('❌ Error procesando mensaje:', error);
            }
        });
    }

    async findTargetGroups() {
        console.log('🔍 Buscando grupos objetivo...');
        
        try {
            const chats = await this.client.getChats();
            
            for (const chat of chats) {
                if (chat.isGroup && CONFIG.TARGET_GROUPS.includes(chat.name)) {
                    this.monitoredGroups.set(chat.id._serialized, {
                        name: chat.name,
                        id: chat.id._serialized,
                        participants: chat.participants.length,
                        lastActivity: new Date()
                    });
                    
                    console.log(`📍 Grupo encontrado: ${chat.name} (${chat.participants.length} participantes)`);
                }
            }
            
            if (this.monitoredGroups.size === 0) {
                console.warn('⚠️ No se encontraron grupos objetivo. Verifica los nombres en CONFIG.TARGET_GROUPS');
            }
            
        } catch (error) {
            console.error('❌ Error buscando grupos:', error);
        }
    }

    async processGroupMessage(message, chat) {
        try {
            const contact = await message.getContact();
            const messageData = {
                platform: 'whatsapp',
                group_name: chat.name,
                group_id: chat.id._serialized,
                user_id: contact.id.user,
                user_name: contact.name || contact.pushname || 'Usuario',
                message: message.body,
                timestamp: new Date(message.timestamp * 1000).toISOString(),
                message_type: message.type,
                has_media: message.hasMedia,
                is_forwarded: message.isForwarded
            };

            // Filtrar mensajes académicamente relevantes
            if (this.isAcademicMessage(messageData)) {
                console.log(`📚 Mensaje académico de ${chat.name}: ${message.body.substring(0, 50)}...`);
                
                // Enviar al RAG API
                await this.sendToRAG(messageData);
                
                // Actualizar actividad del grupo
                const groupInfo = this.monitoredGroups.get(chat.id._serialized);
                if (groupInfo) {
                    groupInfo.lastActivity = new Date();
                }
            }
            
        } catch (error) {
            console.error('❌ Error procesando mensaje del grupo:', error);
        }
    }

    isAcademicMessage(messageData) {
        const message = messageData.message.toLowerCase();
        
        // Filtros básicos
        if (message.length < 10) return false;
        if (messageData.has_media && message.length < 5) return false;
        
        // Palabras clave académicas para metalurgia
        const academicKeywords = [
            'metalurgia', 'aleación', 'fundición', 'acero', 'hierro', 'cobre',
            'ensayo', 'laboratorio', 'práctica', 'examen', 'parcial', 'final',
            'profesor', 'docente', 'clase', 'curso', 'carrera', 'universidad',
            'proyecto', 'tesis', 'investigación', 'paper', 'artículo',
            'pregunta', 'duda', 'ayuda', 'explicación', 'concepto',
            'material', 'propiedades', 'resistencia', 'dureza', 'tenacidad',
            'soldadura', 'corrosión', 'tratamiento', 'térmico', 'temple',
            'cristalografía', 'diagrama', 'fase', 'microestructura'
        ];
        
        // Patrones de preguntas académicas
        const questionPatterns = [
            /¿.*\?/, /quien.*sabe/, /alguien.*puede/, /como.*se/,
            /que.*es/, /donde.*encuentro/, /cuando.*es/, /por.*que/
        ];
        
        // Scoring
        let score = 0;
        
        // Palabras clave (+2 por cada una)
        for (const keyword of academicKeywords) {
            if (message.includes(keyword)) score += 2;
        }
        
        // Patrones de pregunta (+3)
        for (const pattern of questionPatterns) {
            if (pattern.test(message)) score += 3;
        }
        
        // Longitud del mensaje (+1 si >50 caracteres)
        if (message.length > 50) score += 1;
        
        // Excluir spam común
        const spamPatterns = [
            /http/, /\.com/, /👏/, /💪/, /🔥/, /😂/, /jajaja/,
            /buenos días/, /buenas tardes/, /buenas noches/
        ];
        
        for (const pattern of spamPatterns) {
            if (pattern.test(message)) score -= 2;
        }
        
        return score >= 4; // Umbral para considerar académico
    }

    async sendToRAG(messageData) {
        try {
            const response = await axios.post(CONFIG.RAG_API_URL, messageData, {
                timeout: 5000,
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.status === 200) {
                console.log('✅ Mensaje enviado al RAG API');
            }
            
        } catch (error) {
            console.error('❌ Error enviando al RAG API:', error.message);
            // No fallar si el RAG API no está disponible
        }
    }

    startHeartbeat() {
        this.heartbeatInterval = setInterval(async () => {
            try {
                if (this.isConnected) {
                    // Ping básico para mantener conexión
                    await this.client.getState();
                    console.log('💓 Heartbeat OK');
                }
            } catch (error) {
                console.warn('⚠️ Heartbeat falló, reconectando...');
                this.handleReconnect();
            }
        }, CONFIG.HEARTBEAT_INTERVAL);
    }

    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    async handleReconnect() {
        if (this.reconnectAttempts >= CONFIG.MAX_RECONNECT_ATTEMPTS) {
            console.error('❌ Máximo de intentos de reconexión alcanzado');
            process.exit(1);
        }
        
        this.reconnectAttempts++;
        console.log(`🔄 Intento de reconexión ${this.reconnectAttempts}/${CONFIG.MAX_RECONNECT_ATTEMPTS}`);
        
        try {
            if (this.client) {
                await this.client.destroy();
            }
            
            setTimeout(() => {
                this.initializeClient();
                this.client.initialize();
            }, CONFIG.RECONNECT_INTERVAL);
            
        } catch (error) {
            console.error('❌ Error en reconexión:', error);
        }
    }

    setupGracefulShutdown() {
        const gracefulShutdown = async (signal) => {
            console.log(`\n🛑 Recibida señal ${signal}, cerrando gracefully...`);
            
            this.stopHeartbeat();
            
            try {
                if (this.client) {
                    await this.client.destroy();
                }
                console.log('✅ Cliente WhatsApp cerrado correctamente');
            } catch (error) {
                console.error('❌ Error cerrando cliente:', error);
            }
            
            process.exit(0);
        };

        process.on('SIGINT', gracefulShutdown);
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGUSR2', gracefulShutdown); // PM2 reload
    }

    async start() {
        console.log('🚀 Iniciando WhatsApp Scraper Persistente...');
        console.log(`📊 Configuración:
        - Grupos objetivo: ${CONFIG.TARGET_GROUPS.length}
        - Intervalo reconexión: ${CONFIG.RECONNECT_INTERVAL/1000}s
        - Heartbeat: ${CONFIG.HEARTBEAT_INTERVAL/1000}s
        - RAG API: ${CONFIG.RAG_API_URL}`);
        
        try {
            await this.client.initialize();
        } catch (error) {
            console.error('❌ Error inicializando cliente:', error);
            this.handleReconnect();
        }
    }
}

// Iniciar el scraper persistente
const scraper = new PersistentWhatsAppScraper();
scraper.start().catch(console.error);

module.exports = PersistentWhatsAppScraper;
