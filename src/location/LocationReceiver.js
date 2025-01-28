const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  ws.on('message', (message) => {
    try {
      const locationData = JSON.parse(message);
      console.log('Ubicación recibida:', locationData);

     
      const { latitude, longitude } = locationData;

      ws.send(JSON.stringify({
        status: 'success',
        message: 'Ubicación recibida correctamente',
        coordinates: { latitude, longitude }
      }));

    } catch (error) {
      console.error('Error al procesar el mensaje:', error);
      ws.send(JSON.stringify({
        status: 'error',
        message: 'Error al procesar las coordenadas'
      }));
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });

  ws.on('error', (error) => {
    console.error('Error de WebSocket:', error);
  });
});

module.exports = wss;
