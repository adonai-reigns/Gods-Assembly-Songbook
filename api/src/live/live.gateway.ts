import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({ namespace: 'live', cors: { origin: '*' } })
export class LiveGateway {
    @WebSocketServer() server;

    @SubscribeMessage('changeSlide')
    handleChangeSlide(client: any, payload: any) {
        this.server.emit('changeSlide', payload);
    }

    @SubscribeMessage('changeScreenStyle')
    handleChangeScreenStyle(client: any, payload: any) {
        this.server.emit('changeScreenStyle', { screen: payload.screen });
    }

    @SubscribeMessage('requestCurrentSlide')
    handleRequestCurrentSlide(client: any, payload: any) {
        this.server.emit('requestCurrentSlide', { requestor: payload.requestor });
    }

    @SubscribeMessage('exitPlaylist')
    handleExitPlaylist(client: any, payload: any) {
        this.server.emit('exitPlaylist', payload);
    }

}
