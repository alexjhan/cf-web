# Script de PowerShell para Windows Server
# Deployment de WhatsApp RAG Scraper

Write-Host "🚀 Iniciando deployment de WhatsApp RAG Scraper..." -ForegroundColor Green

# Crear directorio de logs
if (!(Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs"
    Write-Host "📁 Directorio logs creado" -ForegroundColor Yellow
}

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no encontrado. Instala Node.js primero." -ForegroundColor Red
    exit 1
}

# Instalar PM2 globalmente si no existe
try {
    pm2 --version | Out-Null
    Write-Host "✅ PM2 ya instalado" -ForegroundColor Green
} catch {
    Write-Host "📦 Instalando PM2..." -ForegroundColor Yellow
    npm install -g pm2
}

# Instalar dependencias del proyecto
Write-Host "📦 Instalando dependencias del proyecto..." -ForegroundColor Yellow
npm install

# Inicializar PM2
pm2 ping

# Parar procesos anteriores si existen
Write-Host "🛑 Parando procesos anteriores..." -ForegroundColor Yellow
pm2 stop whatsapp-scraper 2>$null
pm2 stop rag-api 2>$null
pm2 stop embedding-worker 2>$null

# Eliminar procesos anteriores
pm2 delete whatsapp-scraper 2>$null
pm2 delete rag-api 2>$null  
pm2 delete embedding-worker 2>$null

# Iniciar todos los servicios
Write-Host "🔥 Iniciando servicios..." -ForegroundColor Green
pm2 start ecosystem.config.js

# Guardar configuración PM2
pm2 save

Write-Host "✅ Deployment completado!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Comandos útiles:" -ForegroundColor Cyan
Write-Host "  pm2 status                 - Ver estado de procesos"
Write-Host "  pm2 logs whatsapp-scraper  - Ver logs del scraper" 
Write-Host "  pm2 logs rag-api          - Ver logs del RAG API"
Write-Host "  pm2 logs embedding-worker - Ver logs del worker"
Write-Host "  pm2 restart whatsapp-scraper - Reiniciar scraper"
Write-Host "  pm2 monit                 - Monitor en tiempo real"
Write-Host ""
Write-Host "🔍 Para configurar QR inicial:" -ForegroundColor Yellow
Write-Host "  1. pm2 logs whatsapp-scraper --lines 50"
Write-Host "  2. Buscar el código QR en los logs"
Write-Host "  3. Escanear con WhatsApp desde el móvil"
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Configura QR_WEBHOOK_URL en .env.production" -ForegroundColor Red
Write-Host "    para recibir códigos QR remotamente"
