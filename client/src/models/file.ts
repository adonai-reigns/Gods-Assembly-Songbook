import { get, has, set } from "lodash";
import { Playlist } from "./playlist";
import { Song } from "./song";

export class File {
    id: number = 0;
    originalname: string = '';
    mimetype: string = '';
    filename: string = '';
    filepath: string = '';
    size: number = 0;
    createdAt: Date = new Date();
}

export class Stats {
    size: number = 0;
    mode: number = 0;
    atime: string = "";
    ctime: string = "";
    mtime: string = "";
    birthtime: string = "";
    atimeMs: number = 0;
    ctimeMs: number = 0;
    mtimeMs: number = 0;
    birthtimeMs: number = 0;
    blksize: number = 0;
    blocks: number = 0;
    dev: number = 0;
    gid: number = 0;
    ino: number = 0;
    nlink: number = 0;
    rdev: number = 0;
    uid: number = 0;
}

export enum ExportApiVersion {
    v1 = 'v1.0'
};

export class ExportMetadata {
    description: "God's Assembly Songbook Playlist Export" | "God's Assembly Songbook Song Export" = "God's Assembly Songbook Song Export";
    apiVersion: ExportApiVersion = ExportApiVersion.v1;
    format: "json" | "text" = "text";
    playlistFilenames: string[] = [];
    songFilenames: string[] = [];
    constructor(importData?: any) {
        if (importData) {
            Object.keys(importData).map((keyname: string) => {
                if (has(this, keyname)) {
                    set(this, keyname, get(importData, keyname));
                }
            });
        }
    }
}

export class ImportFile {
    importMode: 'songs' | 'playlists' = 'songs';
    format: "text" | "json" = "json";
    metadata: ExportMetadata = new ExportMetadata();
    filename: string = '';
    stat?: Stats = undefined;
    createdAt: Date = new Date();
    playlists: Playlist[] = [];
    songs: Song[] = [];
    constructor(importData?: any) {
        if (importData) {
            Object.keys(importData).map((keyname: string) => {
                if (has(this, keyname)) {
                    set(this, keyname, get(importData, keyname));
                }
            });
            this.metadata = new ExportMetadata(importData.metadata);
        }
    }
}
