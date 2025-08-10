#!/bin/bash
# Script de deployment para servidor en la nube
# Mantiene WhatsApp Scraper corriendo 24/7

echo "🚀 Iniciando deployment de WhatsApp RAG Scraper..."

# Crear directorio dscm-history-item:c%3A%5CUsers%5Calex2%5CDesktop%5Cmetalurgia-app?%7B%22repositoryId%22%3A%22scm0%22%2C%22historyItemId%22%3A%2209ba61d55014cc38a0ba74ad13f7f799205af5c7%22%2C%22historyItemParentId%22%3A%2292a0ee5fd535fecbf11cf196b31ff27257145f31%22%2C%22historyItemDisplayId%22%3A%2209ba61d%22%7De logs
mkdir -p logs

# Instalar PM2 globalmente si no existe
if ! command -v pm2 &> /dev/null; then
    echo "📦 Instalando PM2..."
    npm install -g pm2
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Inicializar PM2 si es primera vez
pm2 ping

# Parar procesos anteriores si existen
echo "🛑 Parando procesos anteriores..."
pm2 stop whatsapp-scraper 2>/dev/null || true
pm2 stop rag-api 2>/dev/null || true  
pm2 stop embedding-worker 2>/dev/null || true

# Eliminar procesos anteriores
pm2 delete whatsapp-scraper 2>/dev/null || true
pm2 delete rag-api 2>/dev/null || true
pm2 delete embedding-worker 2>/dev/null || true

# Iniciar todos los servicios
echo "🔥 Iniciando servicios..."
pm2 start ecosystem.config.js

# Configurar PM2 para reiniciar en boot del servidor
pm2 startup
pm2 save

echo "✅ Deployment completado!"
echo ""
echo "📊 Comandos útiles:"
echo "  pm2 status                 - Ver estado de procesos"
echo "  pm2 logs whatsapp-scraper  - Ver logs del scraper"
echo "  pm2 logs rag-api          - Ver logs del RAG API"
echo "  pm2 logs embedding-worker - Ver logs del worker"
echo "  pm2 restart whatsapp-scraper - Reiniciar scraper"
echo "  pm2 monit                 - Monitor en tiempo real"
echo ""
echo "🔍 Para configurar QR inicial:"
echo "  1. pm2 logs whatsapp-scraper --lines 50"
echo "  2. Buscar el código QR en los logs"
echo "  3. Escanear con WhatsApp desde el móvil"
echo ""
echo "⚠️  IMPORTANTE: Configura QR_WEBHOOK_URL en .env.production"
echo "    para recibir códigos QR remotamente"
