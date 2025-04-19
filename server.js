const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
// const CryptoJS = require('crypto-js'); // Décommente si tu veux du chiffrement AES

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// const SECRET_KEY = "cle-secrete-ultra-securisee"; // Utilisée si CryptoJS est actif

// Sert les fichiers statiques du dossier (index.html, style.css, etc.)
app.use(express.static(__dirname));

// Accueil → sert le fichier index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  console.log('🔌 Un utilisateur connecté');

  // Réception d’un message
  socket.on('message', (data) => {
    console.log(`📩 ${data.pseudo} a envoyé : ${data.content}`);

    // 💬 Exemple si tu veux chiffrer avec AES :
    // const encrypted = CryptoJS.AES.encrypt(data.content, SECRET_KEY).toString();
    // io.emit('message', { pseudo: data.pseudo, content: encrypted });

    // Sinon, on diffuse directement le message codé César :
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Utilisateur déconnecté');
  });
});

// Lancement du serveur
server.listen(8000, () => {
  console.log('✅ Serveur lancé sur http://localhost:8000');
});

