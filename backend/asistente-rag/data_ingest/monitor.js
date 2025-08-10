// Sistema de monitoreo y notificaciones para WhatsApp Scraper
// Envía alertas cuando el bot se desconecta o hay problemas

const axios = require('axios');
const fs = require('fs');

class WhatsAppMonitor {
    constructor() {
        this.config = {
            CHECK_INTERVAL: 60000, // 1 minuto
            WEBHOOK_URL: process.env.MONITOR_WEBHOOK_URL,
            TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
            TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
            EMAIL_WEBHOOK: process.env.EMAIL_WEBHOOK_URL
        };
        
        this.lastStatus = {
            whatsapp: false,
            rag_api: false,
            embedding_worker: false,
            lastCheck: new Date()
        };
        
        this.startMonitoring();
    }

    async checkWhatsAppStatus() {
        try {
            // Verificar si el archivo de sesión existe y es reciente
            const sessionPath = './whatsapp_session';
            if (fs.existsSync(sessionPath)) {
                const stats = fs.statSync(sessionPath);
                const timeDiff = Date.now() - stats.mtime.getTime();
                
                // Si la sesión se modificó en los últimos 5 minutos, está activa
                return timeDiff < 300000; // 5 minutos
            }
            return false;
        } catch (error) {
            console.error('Error verificando estado WhatsApp:', error);
            return false;
        }
    }

    async checkRAGAPI() {
        try {
            const response = await axios.get('http://localhost:8000/health', { 
                timeout: 5000 
            });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    async checkEmbeddingWorker() {
        try {
            // Verificar archivo de log del worker
            const logPath = '../embeddings/worker.log';
            if (fs.existsSync(logPath)) {
                const stats = fs.statSync(logPath);
                const timeDiff = Date.now() - stats.mtime.getTime();
                
                // Si el log se actualizó en los últimos 10 minutos, está activo
                return timeDiff < 600000; // 10 minutos
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    async sendAlert(service, status, previousStatus) {
        const message = status 
            ? `✅ ${service} se ha reconectado`
            : `🚨 ALERTA: ${service} está desconectado`;
        
        const fullMessage = `
🤖 **WhatsApp RAG Monitor**
📍 Servicio: ${service}
⏰ Timestamp: ${new Date().toISOString()}
📊 Estado: ${status ? 'CONECTADO' : 'DESCONECTADO'}
${status ? '🎉' : '⚠️'} ${message}

📋 Estado de todos los servicios:
- WhatsApp Scraper: ${this.lastStatus.whatsapp ? '✅' : '❌'}
- RAG API: ${this.lastStatus.rag_api ? '✅' : '❌'} 
- Embedding Worker: ${this.lastStatus.embedding_worker ? '✅' : '❌'}
        `;

        // Enviar por Telegram
        if (this.config.TELEGRAM_BOT_TOKEN && this.config.TELEGRAM_CHAT_ID) {
            try {
                await axios.post(
                    `https://api.telegram.org/bot${this.config.TELEGRAM_BOT_TOKEN}/sendMessage`,
                    {
                        chat_id: this.config.TELEGRAM_CHAT_ID,
                        text: fullMessage,
                        parse_mode: 'Markdown'
                    }
                );
                console.log('📱 Alerta enviada por Telegram');
            } catch (error) {
                console.error('Error enviando alerta Telegram:', error.message);
            }
        }

        // Enviar por webhook genérico
        if (this.config.WEBHOOK_URL) {
            try {
                await axios.post(this.config.WEBHOOK_URL, {
                    service,
                    status,
                    message: fullMessage,
                    timestamp: new Date().toISOString(),
                    all_services: this.lastStatus
                });
                console.log('🌐 Alerta enviada por webhook');
            } catch (error) {
                console.error('Error enviando webhook:', error.message);
            }
        }

        // Enviar por email webhook
        if (this.config.EMAIL_WEBHOOK) {
            try {
                await axios.post(this.config.EMAIL_WEBHOOK, {
                    subject: `🚨 WhatsApp RAG Alert: ${service}`,
                    body: fullMessage,
                    priority: status ? 'normal' : 'high'
                });
                console.log('📧 Alerta enviada por email');
            } catch (error) {
                console.error('Error enviando email:', error.message);
            }
        }
    }

    async checkAllServices() {
        try {
            const newStatus = {
                whatsapp: await this.checkWhatsAppStatus(),
                rag_api: await this.checkRAGAPI(),
                embedding_worker: await this.checkEmbeddingWorker(),
                lastCheck: new Date()
            };

            // Detectar cambios de estado y enviar alertas
            for (const [service, currentStatus] of Object.entries(newStatus)) {
                if (service === 'lastCheck') continue;
                
                const previousStatus = this.lastStatus[service];
                
                // Solo alertar en cambios de estado
                if (currentStatus !== previousStatus) {
                    await this.sendAlert(service, currentStatus, previousStatus);
                }
            }

            this.lastStatus = newStatus;
            
            // Log de estado cada 10 minutos
            if (Math.floor(Date.now() / 600000) % 1 === 0) {
                console.log(`📊 Estado servicios: WA:${newStatus.whatsapp ? '✅' : '❌'} | RAG:${newStatus.rag_api ? '✅' : '❌'} | Worker:${newStatus.embedding_worker ? '✅' : '❌'}`);
            }

        } catch (error) {
            console.error('Error en monitoreo:', error);
        }
    }

    startMonitoring() {
        console.log('🔍 Iniciando sistema de monitoreo...');
        console.log(`📡 Configuración de alertas:
        - Telegram: ${this.config.TELEGRAM_BOT_TOKEN ? '✅' : '❌'}
        - Webhook: ${this.config.WEBHOOK_URL ? '✅' : '❌'}
        - Email: ${this.config.EMAIL_WEBHOOK ? '✅' : '❌'}`);

        // Verificar estado inmediatamente
        this.checkAllServices();

        // Configurar verificación periódica
        setInterval(() => {
            this.checkAllServices();
        }, this.config.CHECK_INTERVAL);
    }
}

// Configuración de variables de entorno para alertas
require('dotenv').config();

// Iniciar monitor si se ejecuta directamente
if (require.main === module) {
    const monitor = new WhatsAppMonitor();
    
    // Manejar cierre graceful
    process.on('SIGINT', () => {
        console.log('\n🛑 Deteniendo monitor...');
        process.exit(0);
    });
}

module.exports = WhatsAppMonitor;
