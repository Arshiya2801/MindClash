import { io } from 'socket.io-client';

// Production: socket connects to the same origin as API (Render URL)
// Dev: connects to localhost:5000 via Vite proxy
const SOCKET_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')  // strip "/api" suffix to get base URL
    : (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);

let socket = null;

export const connectSocket = (token) => {
    if (socket?.connected) return socket;

    socket = io(SOCKET_URL, {
        auth: { token },
        // polling first — required for Render.com which doesn't support raw WebSocket upgrades without sticky sessions
        transports: ['polling', 'websocket'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
    });

    socket.on('connect', () => {
        console.log('🔌 Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => socket;

// ─── Matchmaking ──────────────────────────────────────────────────────────────
export const joinQueue = (data) => socket?.emit('join_queue', data);
export const leaveQueue = (data) => socket?.emit('leave_queue', data);

// ─── Debate ───────────────────────────────────────────────────────────────────
export const joinDebate = (debateId) => socket?.emit('join_debate', { debateId });
export const leaveDebate = (debateId) => socket?.emit('leave_debate', { debateId });
export const submitArgument = (debateId, content) => socket?.emit('submit_argument', { debateId, content });
export const forfeit = (debateId) => socket?.emit('forfeit', { debateId });

// ─── Spectator ────────────────────────────────────────────────────────────────
export const sendSpectatorChat = (debateId, message, isAnonymous = false) =>
    socket?.emit('spectator_chat', { debateId, message, isAnonymous });

export const sendReaction = (debateId, emoji) =>
    socket?.emit('reaction', { debateId, emoji });

// ─── Betting ──────────────────────────────────────────────────────────────────
export const placeBet = (debateId, side, amount) =>
    socket?.emit('place_bet', { debateId, side, amount });

export default {
    connectSocket,
    disconnectSocket,
    getSocket,
    joinQueue,
    leaveQueue,
    joinDebate,
    leaveDebate,
    submitArgument,
    forfeit,
    sendSpectatorChat,
    sendReaction,
    placeBet,
};
