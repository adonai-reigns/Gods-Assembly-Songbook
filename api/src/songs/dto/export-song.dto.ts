import { Stats } from 'fs';
import { isEmpty, set } from 'lodash';

import { SongDto } from './song.dto';
import { ExportMetadataDto, ExportPlaylistDto } from 'src/playlists/dto/export-playlist.dto';
import { SlideTypeLabels } from '../songs.export.template';

import { Slide, SlideType } from 'src/slides/slide.entity';
import { SongCopyright, SongCopyrightLabels } from '../songCopyright.entity';

export class ExportSlidesDto {
    type: SlideType;
    name: string;
    content: string;
    constructor(slide?: Slide) {
        if (slide) {
            this.type = slide.type as SlideType;
            this.name = slide.name;
            this.content = slide.content;
        }
    }
}

export class ExportSongCopyrightDto {
    description: string = '';
    author: string = '';
    publisher: string = '';
    year: string = '';
    url: string = '';
    constructor(songCopyright?: SongCopyright) {
        if (songCopyright) {
            this.description = songCopyright.description;
            this.author = songCopyright.author;
            this.publisher = songCopyright.publisher;
            this.year = songCopyright.year;
            this.url = songCopyright.url;
        }
    }
}

export class ExportSongDto {
    name: string = '';
    copyright: ExportSongCopyrightDto = new ExportSongCopyrightDto();
    slides: ExportSlidesDto[] = [];
    constructor(song?: SongDto) {
        if (song) {
            this.name = song.name;
            this.slides = song.slides.map((slide: Slide) => new ExportSlidesDto(slide));
            this.copyright = new ExportSongCopyrightDto(song.copyright as SongCopyright);
        }
    }
    parsePlainText(text) {
        let lines = text.split("\n");
        let currentSlideType: string = undefined;
        let slideBuffer = [];
        for (let line of lines) {
            line = line.trim();
            if (line.startsWith('Name:')) {
                set(this, 'name', line.substring('Name:'.length).trim());
                continue;
            }
            let copyrightContent: any = undefined;
            Object.values(SongCopyrightLabels).map((keyname: string) => {
                if (line.startsWith(keyname + ':')) {
                    copyrightContent = { keyname: Object.keys(SongCopyrightLabels)[Object.values(SongCopyrightLabels).indexOf(keyname)], value: line.substring(keyname.length + 1).trim() }
                }
            });
            if (copyrightContent) {
                set(this.copyright, copyrightContent.keyname, copyrightContent.value);
                continue;
            }
            if (line.endsWith(':') && Object.values(SlideTypeLabels).indexOf(line.substring(0, line.length - 1)) > -1) {
                // this line is the header of a song slide type
                if (!isEmpty(slideBuffer) && currentSlideType) {
                    // assign the previous slide contents
                    let slide = new ExportSlidesDto({
                        type: `${currentSlideType}`,
                        name: slideBuffer[0],
                        content: '<p>' + slideBuffer.filter((slideLine: string) => !isEmpty(slideLine)).join('</p><p>') + '</p>'
                    } as Slide);
                    this.slides.push(slide);
                }
                // reset the slide buffer
                slideBuffer = [];
                currentSlideType = Object.keys(SlideTypeLabels)[Object.values(SlideTypeLabels).indexOf(line.substring(0, line.length - 1))] as string;
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
            let slide = new ExportSlidesDto({
                type: `${currentSlideType}`,
                name: slideBuffer[0],
                content: '<p>' + slideBuffer.filter((slideLine: string) => !isEmpty(slideLine)).join('</p><p>') + '</p>'
            } as Slide);
            this.slides.push(slide);
            slideBuffer = [];
            currentSlideType = undefined;
        }
    }
}

export class ImportFile {
    importMode: 'songs' | 'playlists' = 'songs';
    format: "text" | "json" = "json";
    metadata: ExportMetadataDto = new ExportMetadataDto();
    filename: string = '';
    stat?: Stats = undefined;
    createdAt: Date = new Date();
    playlists: ExportPlaylistDto[] = [];
    songs: ExportSongDto[] = [];
}
