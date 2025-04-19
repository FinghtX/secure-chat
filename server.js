const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 8000;
const messages = []; // Historique en mémoire

app.use(express.static(__dirname));

// Route principale
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  console.log('👤 Un utilisateur connecté');

  // Envoie l’historique au nouvel utilisateur
  socket.emit('historique', messages);

  socket.on('message', (data) => {
    const { pseudo, content } = data;

    // Vérifie si le pseudo est autorisé
    if (pseudo !== 'Kramel' && pseudo !== 'Shokola') {
      socket.emit('erreur', '⛔️ Seuls Kramel et Shokola peuvent envoyer des messages.');
      return;
    }

    // Ajoute l’heure et la date
    const now = new Date();
    const timestamp = now.toLocaleDateString() + ' à ' + now.toLocaleTimeString();

    const messageObj = {
      pseudo,
      content,
      timestamp
    };

    messages.push(messageObj); // Stocke dans l'historique
    io.emit('message', messageObj); // Envoie à tout le monde
  });

  socket.on('disconnect', () => {
    console.log('❌ Utilisateur déconnecté');
  });
});

server.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});

