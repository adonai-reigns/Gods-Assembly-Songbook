import { ReactElement } from "react";
import { isEmpty } from 'lodash';

import { parse as parseHtml, HTMLElement } from 'node-html-parser';

import { ExportSlidesDto, ExportSongDto } from "./dto/export-song.dto";

export const SlideTypeLabels: { [key: string]: string } = {
    Intro: 'Intro',
    Verse: 'Verse',
    PreChorus: 'Pre-Chorus',
    Chorus: 'Chorus',
    PostChorus: 'Post-Chorus',
    Bridge: 'Bridge',
    Outro: 'Outro',
    Hook: 'Hook'
}

export const ExportSongTemplate = (song: ExportSongDto): ReactElement => {
    return <>
        {!isEmpty(song.name) && <>Name: {song.name.trim()}<br /></>}
        {!isEmpty(song.copyright.year) && <>Year: {song.copyright.year.trim()}<br /></>}
        {!isEmpty(song.copyright.author) && <>Author: {song.copyright.author.trim()}<br /></>}
        {!isEmpty(song.copyright.publisher) && <>Publisher: {song.copyright.publisher.trim()}<br /></>}
        {!isEmpty(song.copyright.description) && <>Description: {song.copyright.description.trim()}<br /></>}
        {!isEmpty(song.copyright.url) && <>URL: {song.copyright.url.trim()}<br /></>}
        <br />
        {song.slides.map((slide: ExportSlidesDto, slideIndex: number) => <div key={slideIndex}>
            {SlideTypeLabels[slide.type]}<br />
            {parseHtml(slide.content).getElementsByTagName('p').map((p: HTMLElement) => p.textContent.trim() + "\n").join('')}
            <br />
        </div>)}
    </>
}
