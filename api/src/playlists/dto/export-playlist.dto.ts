import { get, isEmpty, set } from 'lodash';
import { dbDateStringToDate } from 'src/app.service';

import { Song } from 'src/songs/song.entity';
import { Playlist } from '../playlist.entity';

import { ExportSongDto } from 'src/songs/dto/export-song.dto';
import { SongDto } from 'src/songs/dto/song.dto';

export enum ExportApiVersion {
    v1 = 'v1.0'
}

export enum MetadataDescription {
    songs = "God's Assembly Songbook Song Export",
    playlists = "God's Assembly Songbook Playlist Export"
}

export class ExportMetadataDto {
    description: MetadataDescription = MetadataDescription.playlists;
    apiVersion: ExportApiVersion = ExportApiVersion.v1;
    format: "json" | "text" = "text";
    playlistFilenames: string[] = [];
    songFilenames: string[] = [];
    createdAt: Date = new Date();
}

export class ExportPlaylistDto {
    name: string = '';
    startSlide: string = '';
    endSlide: string = '';
    pauseSlide: string = '';
    songs: ExportSongDto[] = [];
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    constructor(playlist?: Playlist) {
        if (playlist) {
            this.name = playlist.name;
            this.startSlide = playlist.startSlide;
            this.pauseSlide = playlist.pauseSlide;
            this.endSlide = playlist.endSlide;
            this.songs = playlist.songs.map((song: Song) => new ExportSongDto(JSON.parse(JSON.stringify(song)) as SongDto));
            this.createdAt = new Date(playlist.createdAt);
            this.updatedAt = new Date(playlist.updatedAt);
        }
    }
    parsePlainText(text) {
        let lines = text.split("\n");
        let slideBuffer = [];
        let currentSlideType;
        for (let line of lines) {
            line = line.trim();
            let fields = {
                name: 'Name',
                createdAt: 'Created At',
                updatedAt: 'Updated At',
            }
            let slideTypes = {
                startSlide: 'Start Slide',
                pauseSlide: 'Pause Slide',
                endSlide: 'End Slide'
            }
            Object.keys(fields).map((fieldName: string) => {
                fieldName = fieldName.trim();
                let fieldValue = get(fields, fieldName);
                if (line.startsWith(fieldValue + ':')) {
                    if (['createdAt', 'updatedAt'].indexOf(fieldName) > -1) {
                        let at = dbDateStringToDate(line.substring((fieldValue + ':').length).trim());
                        set(this, fieldName, at);
                    } else {
                        set(this, fieldName, line.substring((fieldValue + ':').length).trim());
                    }
                }
            });
            if (line.endsWith(':') && Object.values(slideTypes).indexOf(line.substring(0, line.length - 1)) > -1) {
                // this line is the header of a playlist slide type
                let slideType = Object.keys(slideTypes)[Object.values(slideTypes).indexOf(line.substring(0, line.length - 1))];
                if (!isEmpty(slideBuffer)) {
                    // assign the previous slide contents
                    set(this, currentSlideType, '<p>' + slideBuffer.filter((slideLine: string) => !isEmpty(slideLine)).join('</p><p>') + '</p>');
                }
                // reset the slide buffer
                slideBuffer = [];
                currentSlideType = slideType;
            } else {
                if (currentSlideType) {
                    // reading multi-lines into the current slide buffer
                    slideBuffer.push(line.trim());
                }
            }
        }
        // after looping every line
        if (!isEmpty(slideBuffer) && currentSlideType) {
            // store the contents of the last slide buffer
            set(this, currentSlideType, '<p>' + slideBuffer.filter((slideLine: string) => !isEmpty(slideLine)).join('</p><p>') + '</p>');
            slideBuffer = [];
            currentSlideType = undefined;
        }
    }
}
