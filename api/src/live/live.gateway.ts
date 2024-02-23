import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({ namespace: 'live', cors: { origin: '*' } })
export class LiveGateway {
    @WebSocketServer() server;

    @SubscribeMessage('setCurrentSlide')
    handleSetCurrentSlide(client: any, payload: any) {
        this.server.emit('setCurrentSlide', payload);
    }

    @SubscribeMessage('setIsStarting')
    handleSetIsStarting(client: any, payload: any) {
        this.server.emit('setIsStarting', payload);
    }

    @SubscribeMessage('setIsPaused')
    handleSetIsPaused(client: any, payload: any) {
        this.server.emit('setIsPaused', payload);
    }

    @SubscribeMessage('setIsUnpaused')
    handleSetIsUnpaused(client: any, payload: any) {
        this.server.emit('setIsUnpaused', payload);
    }

    @SubscribeMessage('setIsEnded')
    handleSetIsEnded(client: any, payload: any) {
        this.server.emit('setIsEnded', payload);
    }

    @SubscribeMessage('setScreenStyle')
    handleSetScreenStyle(client: any, payload: any) {
        this.server.emit('setScreenStyle', { screen: payload.screen });
    }

    @SubscribeMessage('requestCurrentState')
    handleRequestCurrentState(client: any, payload: any) {
        this.server.emit('requestCurrentState', { requestor: payload.requestor });
    }

    @SubscribeMessage('exitPlaylist')
    handleExitPlaylist(client: any, payload: any) {
        this.server.emit('exitPlaylist', payload);
    }

    @SubscribeMessage('setAssemblyWallpaper')
    handleSetAssemblyWallpaper(client: any, payload: any) {
        this.server.emit('setAssemblyWallpaper', payload);
    }

}
