// Configuración PM2 para WhatsApp Scraper en servidor
// PM2 mantiene el proceso corriendo 24/7 con auto-restart

module.exports = {
  apps: [
    {
      name: 'whatsapp-scraper',
      script: 'persistent_whatsapp_scraper.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        RAG_API_URL: 'http://localhost:8000/ingest/messages'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      
      // Reiniciar automáticamente si el proceso falla
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Configuración específica para WhatsApp Web
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Configuración para servidor en la nube
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'rag-api',
      script: '../rag_api/main.py',
      interpreter: 'python',
      args: '-m uvicorn main:app --host 0.0.0.0 --port 8000',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        PYTHONPATH: '../rag_api'
      },
      error_file: './logs/rag-err.log',
      out_file: './logs/rag-out.log',
      log_file: './logs/rag-combined.log',
      time: true
    },
    {
      name: 'embedding-worker',
      script: '../embeddings/message_embedding_worker.py',
      interpreter: 'python', 
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '3G',
      env: {
        PYTHONPATH: '../embeddings'
      },
      error_file: './logs/worker-err.log',
      out_file: './logs/worker-out.log', 
      log_file: './logs/worker-combined.log',
      time: true,
      
      // Worker específico: reiniciar si falla
      restart_delay: 10000,
      max_restarts: 5
    }
  ]
};
