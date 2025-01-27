// import React, { useEffect, useState } from 'react';
// import { View, Text } from 'react-native';
// import socket from './socket';

// const LocationReceiver = () => {
//   const [locations, setLocations] = useState([]);

//   useEffect(() => {
//     // Escuchar ubicaciones del servidor
//     socket.on('locationUpdate', (data) => {
//       setLocations((prev) => [...prev, data]);
//       console.log('Ubicación recibida:', data);
//     });

//     // Limpieza al desmontar el componente
//     return () => {
//       socket.off('locationUpdate');
//     };
//   }, []);

//   return (
//     <View>
//       <Text>Ubicaciones Recibidas:</Text>
//       {locations.map((loc, index) => (
//         <Text key={index}>
//           Latitud: {loc.latitude}, Longitud: {loc.longitude}
//         </Text>
//       ))}
//     </View>
//   );
// };

// export default LocationReceiver;

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  ws.on('message', (message) => {
    try {
      const locationData = JSON.parse(message);
      console.log('Ubicación recibida:', locationData);

      // Aquí puedes procesar las coordenadas recibidas
      const { latitude, longitude } = locationData;

      // Enviar confirmación al cliente
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
