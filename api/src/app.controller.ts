import { Controller, Get } from '@nestjs/common';

var ip = require('ip');

import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor() { }

    @Get('/constants')
    getConstants(): any {
        return {
            ip: ip.address()
        }
    }
}
