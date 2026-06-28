import api from './api';

export const getAgoraConfig = () =>
    api.get('/agora/config');

export const getAgoraToken = (channelName, uid) =>
    api.get('/agora/token', {
        params: { channelName, uid }
    });
