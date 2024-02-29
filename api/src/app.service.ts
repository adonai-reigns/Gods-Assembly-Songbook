import { Injectable } from '@nestjs/common';
import { join, resolve } from 'path';
import * as config from 'config';

@Injectable()
export class AppService {
    getHello(): any {
        return { Response: 'Hello World!' };
    }
}

export const getAbsoluteUploadPath = function (pathPrefix: string | string[]): string {
    if (Array.isArray(pathPrefix)) {
        pathPrefix = join(...pathPrefix);
    }
    return resolve(join(config.get('fileUploads.directory'), pathPrefix + ''));
}

export const stripTags = (text: string): string => {
    return text.replace(/<[^>]*>?/gm, '');
}

export const toFilename = (text: string) => {
    return text.replace(/\s/gi, '_').replace(/[^a-zA-Z0-9,_()\.\-]/gi, '-');
}
