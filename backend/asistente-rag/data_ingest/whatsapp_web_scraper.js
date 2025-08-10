// Scraper de grupos de WhatsApp usando whatsapp-web.js
// Instalación: npm install whatsapp-web.js qrcode-terminal axios
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// Configuración
const RAG_API_URL = 'http://localhost:8000/ingest/messages';
const TARGET_GROUPS = [
    'Metalurgia UNSAAC 2025',
    'CF Metalurgia - Académico',
    'Dudas Metalurgia'
];

class WhatsAppGroupScraper {
    constructor() {
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.isReady = false;
        this.lastActivity = new Date();
        
        this.client = new Client({
            authStrategy: new LocalAuth({
                clientId: "metalurgia-rag-bot"
            }),
            puppeteer: {
                headless: process.env.NODE_ENV === 'production',
                args: [
                    '--no-sandbox', 
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ]
            }
        });
        
        this.setupEventHandlers();
        this.startHealthMonitor();
    }

    setupEventHandlers() {
        // Mostrar QR para autenticación
        this.client.on('qr', (qr) => {
            console.log('Escanea este QR con WhatsApp:');
            qrcode.generate(qr, { small: true });
        });

        // Cliente listo
        this.client.on('ready', async () => {
            console.log('✅ WhatsApp Web conectado');
            await this.identifyTargetGroups();
            this.startMonitoring();
        });

        // Nuevos mensajes
        this.client.on('message', async (message) => {
            await this.handleMessage(message);
        });

        // Desconexión
        this.client.on('disconnected', (reason) => {
            console.log('❌ Desconectado:', reason);
        });
    }

    async identifyTargetGroups() {
        const chats = await this.client.getChats();
        this.targetGroupIds = [];
        
        for (const chat of chats) {
            if (chat.isGroup && TARGET_GROUPS.some(name => 
                chat.name.toLowerCase().includes(name.toLowerCase())
            )) {
                this.targetGroupIds.push(chat.id._serialized);
                console.log(`📱 Monitoreando grupo: ${chat.name}`);
            }
        }
    }

    async handleMessage(message) {
        try {
            // Solo procesar mensajes de grupos objetivo
            if (!message.from.includes('@g.us') || 
                !this.targetGroupIds.includes(message.from)) {
                return;
            }

            // Filtrar mensajes relevantes (académicos)
            if (!this.isAcademicMessage(message.body)) {
                return;
            }

            const chat = await message.getChat();
            const contact = await message.getContact();
            
            const payload = {
                platform: 'whatsapp_group',
                text: message.body,
                author: contact.pushname || contact.number,
                ts: message.timestamp,
                meta: {
                    group_name: chat.name,
                    group_id: message.from,
                    message_id: message.id._serialized,
                    is_forwarded: message.isForwarded,
                    mentions: message.mentionedIds
                }
            };

            // Enviar al RAG API
            await this.sendToRAG(payload);
            console.log(`💾 Mensaje guardado de ${chat.name}: ${message.body.substring(0, 50)}...`);
            
        } catch (error) {
            console.error('Error procesando mensaje:', error);
        }
    }

    isAcademicMessage(text) {
        const academicKeywords = [
            // Cursos y materias
            'calculo', 'fisica', 'quimica', 'metalurgia', 'fundicion', 'tratamientos',
            'termicos', 'corrosion', 'materiales', 'cristalografia', 'aleaciones',
            
            // Académico general
            'examen', 'tarea', 'proyecto', 'laboratorio', 'practica', 'syllabus',
            'nota', 'calificacion', 'profesor', 'docente', 'clase', 'horario',
            
            // Trámites
            'matricula', 'certificado', 'constancia', 'tramite', 'secretaria',
            'decanato', 'rector', 'titulo', 'grado', 'tesis',
            
            // Dudas comunes
            'como', 'donde', 'cuando', 'que', 'quien', 'ayuda', 'duda',
            'pregunta', 'consulta', 'informacion'
        ];

        const lowerText = text.toLowerCase();
        return academicKeywords.some(keyword => lowerText.includes(keyword)) ||
               text.length > 20; // Mensajes con contenido sustancial
    }

    async sendToRAG(payload) {
        try {
            await axios.post(RAG_API_URL, payload, {
                timeout: 5000,
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.error('Error enviando al RAG:', error.message);
        }
    }

    startMonitoring() {
        console.log('🔍 Iniciando monitoreo de mensajes...');
        
        // Opcional: cargar historial reciente
        this.loadRecentHistory();
    }

    async loadRecentHistory() {
        console.log('📚 Cargando historial reciente...');
        
        for (const groupId of this.targetGroupIds) {
            try {
                const chat = await this.client.getChatById(groupId);
                const messages = await chat.fetchMessages({ limit: 50 });
                
                for (const message of messages.reverse()) {
                    // Solo últimos 7 días
                    const daysDiff = (Date.now() - message.timestamp * 1000) / (1000 * 60 * 60 * 24);
                    if (daysDiff <= 7) {
                        await this.handleMessage(message);
                        await new Promise(resolve => setTimeout(resolve, 100)); // Rate limit
                    }
                }
            } catch (error) {
                console.error(`Error cargando historial de grupo ${groupId}:`, error);
            }
        }
    }

    async start() {
        console.log('🚀 Iniciando WhatsApp Group Scraper...');
        await this.client.initialize();
    }

    async stop() {
        await this.client.destroy();
    }
}

// Ejecución
if (require.main === module) {
    const scraper = new WhatsAppGroupScraper();
    
    // Manejo de señales para cierre limpio
    process.on('SIGINT', async () => {
        console.log('\n🛑 Cerrando scraper...');
        await scraper.stop();
        process.exit(0);
    });
    
    scraper.start().catch(console.error);
}

module.exports = WhatsAppGroupScraper;
