import { ReactElement } from "react";
import { format as dateFormat } from 'date-fns';

import { parse as parseHtml, HTMLElement } from 'node-html-parser';

import { ExportPlaylistDto } from "./dto/export-playlist.dto";

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

export const ExportPlaylistTemplate = (playlist: ExportPlaylistDto): ReactElement => {
    return <>
        Name: {playlist.name.trim()}<br />
        Created At: {dateFormat(new Date(playlist.createdAt), 'yyyyMMdd HH:mm:ss')}<br />
        Updated At: {dateFormat(new Date(playlist.updatedAt), 'yyyyMMdd HH:mm:ss')}<br />
        <br />
        Start Slide:<br />
        {parseHtml(playlist.startSlide).getElementsByTagName('p').map((p: HTMLElement) => p.textContent.trim() + "\n").join('')}
        <br />
        Pause Slide:<br />
        {parseHtml(playlist.pauseSlide).getElementsByTagName('p').map((p: HTMLElement) => p.textContent.trim() + "\n").join('')}
        <br />
        End Slide:<br />
        {parseHtml(playlist.endSlide).getElementsByTagName('p').map((p: HTMLElement) => p.textContent.trim() + "\n").join('')}
    </>
}
