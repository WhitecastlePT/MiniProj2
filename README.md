# MiniProj2
Projeto Animalec

# Back-end
Adicionados modelos, rotas, mensagens e controladores de Sponsors e Experts

config.js está definido para usar a BD de test Local: uri: 'mongodb://localhost:27017/test'
app.js inicia no porto 8080: const port = process.env.PORT || 8080;

Usar npm install e depois npm start

# Front-end
Adicionados services, rotas (index.js), na store ( experts e sponsors) e as views para listar, editar e adicioanr sponsors e experts

config.js está definido para usar o Backend no porto 8080: const API_URL = "http://localhost:8080";