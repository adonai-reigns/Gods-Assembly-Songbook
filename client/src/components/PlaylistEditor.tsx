import { useState, useEffect } from "react";
import axios from "axios";

import { Dialog } from "primereact/dialog";
import { Editor } from "primereact/editor";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

import { quillHeader } from "./SlideEditor";
import SongPicker from './SongPicker';
import Tile from "./Tile";

import type { Playlist } from "../models/playlist";
import type Song from "../models/song";

export interface propsInterface {
    className?: string;
    playlist: Playlist;
    onContentChange: CallableFunction;
    onSubmit?: CallableFunction;
    onDelete?: CallableFunction;
    onCopy?: CallableFunction;
}

export const propsDefaults = {
    className: ''
}

const PlaylistEditor = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const url = new URL(window.location.href);
    const apiUrl = url.protocol + '//' + url.hostname + ':3000/api';

    const playlist = props.playlist;

    const [playlistSongs, setPlaylistSongs] = useState<Song[]>(props.playlist.songs);

    const [songs, setSongs] = useState<Song[]>([]);

    const [editingPlaylistName, setEditingPlaylistName] = useState<string>(playlist.name);
    const [startSlide, setStartSlide] = useState<string>(playlist.startSlide);
    const [endSlide, setEndSlide] = useState<string>(playlist.endSlide);
    const [pauseSlide, setPauseSlide] = useState<string>(playlist.pauseSlide);
    const [slideEditor, setSlideEditor] = useState<null | "start" | "end" | "pause">(null);


    const [showSongPicker, setShowSongPicker] = useState<boolean>(false);

    const onContentChange = () => {
        props.onContentChange({
            ...playlist, ...{
                name: editingPlaylistName,
                startSlide,
                endSlide,
                pauseSlide
            }, ...{
                songs: playlistSongs
            }
        });
    }

    const deletePlaylist = () => {
        if (typeof props.onDelete === 'function') {
            props.onDelete();
        }
    }

    const addSong = () => {
        setShowSongPicker(true);
    }

    const removeSong = (song: Song) => {
        setPlaylistSongs(playlistSongs.filter((_song: Song) => _song.id !== song.id));
    }

    const setPlaylistSongsSorting = (e: any) => {
        setPlaylistSongs((_playlistSongs) => {
            let sortedPlaylistSongs: Song[] = [];
            e.value.forEach((song: Song) => {
                sortedPlaylistSongs.push(song);
            });
            return sortedPlaylistSongs;
        });
    }

    const dialogHeader = function () {
        return <div>Song Picker</div>
    }

    const submitSongPicker = () => {
        setShowSongPicker(false);
        onContentChange();
    }

    const setSelectedSongIds = (selectedSongIds: number[]) => {
        setPlaylistSongs((_playlistSongs) => {
            return songs.filter((song: Song) => (selectedSongIds.indexOf(parseInt(`${song.id}` ?? '0')) > -1));
        });
    }

    const songListHeaderTemplate = function () {
        return <div className="text-right">
            <Button className="add-button small" onClick={addSong}>Add Songs <i className="pi pi-plus ml-2"></i></Button>
        </div>
    }

    const actionsBodyTemplate = (song: Song) => {
        return <div>
            <Button severity="danger" title="Remove Song"
                onClick={() => {
                    if (confirm('Are you sure you want to remove this song from the playlist?')) {
                        removeSong(song)
                    }
                }}>Delete <i className="pi pi-trash ml-2"></i></Button>
        </div>
    }

    const rowReorderIconTemplate = () => {
        return <i className="pi pi-arrows-v hidden sm:inline"></i>
    }

    useEffect(() => {
        axios.get(apiUrl + '/songs').then((response: any) => {
            setSongs(response.data);
        });
    }, []);

    useEffect(() => {
        onContentChange();
    }, [playlistSongs, editingPlaylistName, startSlide, pauseSlide, endSlide]);

    return <div className="playlist-editor">

        <Dialog draggable={false} closable={true} visible={showSongPicker}
            onHide={() => submitSongPicker()}
            header={dialogHeader}
            style={{ width: '50em', height: '30em' }}>
            <SongPicker onSelectionChange={setSelectedSongIds} selectedSongIds={playlist.songs.map((song: Song) => parseInt(`${song.id}`))} />
        </Dialog>

        <div>
            <div className="field p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <label htmlFor="slide-name" className="font-normal">Playlist Name</label>
                </span>
                <InputText id="slide-name" placeholder="Playlist Name" value={editingPlaylistName}
                    onChange={e => setEditingPlaylistName(e.target.value)} />
            </div>
            {(slideEditor === 'start') && <div className="field p-inputgroup w-full flex">
                <span className="p-inputgroup-addon flex-0">
                    <label htmlFor="slide-name" className="font-normal">Start Slide</label>
                </span>
                <Editor id="start-slide-content" placeholder="Start Slide"
                    value={startSlide}
                    onTextChange={e => setStartSlide(e.htmlValue ?? '')}
                    headerTemplate={quillHeader()}
                    style={{ height: '180px' }}
                    className="flex-1"
                />
                <span className="p-inputgroup-addon flex-0">
                    <Button onClick={() => setSlideEditor(null)} severity="success"><i className="pi pi-check" title="OK"></i></Button>
                </span>
            </div>}
            {(slideEditor === 'end') && <div className="field p-inputgroup w-full flex">
                <span className="p-inputgroup-addon flex-0">
                    <label htmlFor="slide-name" className="font-normal">End Slide</label>
                </span>
                <Editor id="end-slide-content" placeholder="End Slide"
                    value={endSlide}
                    onTextChange={e => setEndSlide(e.htmlValue ?? '')}
                    headerTemplate={quillHeader()}
                    style={{ height: '180px' }}
                    className="flex-1"
                />
                <span className="p-inputgroup-addon flex-0">
                    <Button onClick={() => setSlideEditor(null)} severity="success"><i className="pi pi-check" title="OK"></i></Button>
                </span>
            </div>}
            {(slideEditor === 'pause') && <div className="field p-inputgroup w-full flex">
                <span className="p-inputgroup-addon flex-0">
                    <label htmlFor="slide-name" className="font-normal">Pause Slide</label>
                </span>
                <Editor id="pause-slide-content" placeholder="Pause Slide"
                    value={pauseSlide}
                    onTextChange={e => setPauseSlide(e.htmlValue ?? '')}
                    headerTemplate={quillHeader()}
                    style={{ height: '180px' }}
                    className="flex-1"
                />
                <span className="p-inputgroup-addon flex-0">
                    <Button onClick={() => setSlideEditor(null)} severity="success"><i className="pi pi-check" title="OK"></i></Button>
                </span>
            </div>}
            {(slideEditor === null) && <div className="slide-preview-container grid">
                <Tile headerIcon="Start Slide" className="col-12 md:col-4 start-slide-preview" onClick={() => setSlideEditor('start')}>
                    <div className="text-base" dangerouslySetInnerHTML={{ __html: startSlide }} />
                </Tile>
                <Tile headerIcon="Pause Slide" className="col-12 md:col-4 pause-slide-preview" onClick={() => setSlideEditor('pause')}>
                    <div className="text-base" dangerouslySetInnerHTML={{ __html: pauseSlide }} />
                </Tile>
                <Tile headerIcon="End Slide" className="col-12 md:col-4 end-slide-preview" onClick={() => setSlideEditor('end')}>
                    <div className="text-sm" dangerouslySetInnerHTML={{ __html: endSlide }} />
                </Tile>
            </div>}


            <DataTable reorderableRows={true} value={playlistSongs} className="w-full"
                header={songListHeaderTemplate}
                emptyMessage="This playlist is empty"
                onRowReorder={setPlaylistSongsSorting}>
                <Column rowReorder style={{ width: '2em' }} rowReorderIcon={rowReorderIconTemplate} />
                <Column columnKey="name" field="name" header="Name" />
                <Column columnKey="actions" body={actionsBodyTemplate} className="text-right" />
            </DataTable>

            <div className="m-3 flex justify-content-around">
                <Button type="button" title="Delete this Playlist" onClick={(e) => {
                    e.preventDefault();
                    if (confirm('Are you sure you want to delete this playlist? It cannot be undone...')) {
                        deletePlaylist();
                    }
                }} severity="danger">Delete Playlist <i className="pi pi-trash ml-3"></i></Button>
            </div>
        </div>
    </div>

}

export default PlaylistEditor;
