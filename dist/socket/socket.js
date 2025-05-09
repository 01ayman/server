"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSockets = setupSockets;
const waitingPlayers = [];
function setupSockets(io) {
    io.on("connection", (socket) => {
        console.log("🔌 Cliente conectado:", socket.id);
        socket.on("buscar_partida", (userData) => {
            console.log("🔌 Cliente buscando partida:", socket.id);
            if (waitingPlayers.length > 0) {
                const rival = waitingPlayers.pop();
                const partidaId = `partida-${socket.id}-${rival.id}`;
                socket.join(partidaId);
                rival.join(partidaId);
                io.to(partidaId).emit("partida_encontrada", {
                    partidaId,
                    jugadores: [userData, rival.data],
                });
            }
            else {
                socket.data = userData;
                waitingPlayers.push(socket);
            }
        });
        socket.on("desconectar", () => {
            console.log("🔌 Cliente desconectado:", socket.id);
            const index = waitingPlayers.findIndex((s) => s.id === socket.id);
            if (index !== -1) {
                waitingPlayers.splice(index, 1);
            }
        });
        socket.on("mover_pieza", ({ partidaId, movimiento }) => {
            console.log("🔌 Cliente movio pieza :", socket.id);
            socket.to(partidaId).emit("pieza_movida", movimiento);
        });
    });
}
