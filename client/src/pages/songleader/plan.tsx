import { useState, useEffect } from "react";
import axios from 'axios';

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import PlaylistPicker from "../../components/PlaylistPicker";
import PlaylistEditor from "../../components/PlaylistEditor";

import Button from '../../components/Button';

import type { Playlist } from "../../models/playlist";

import GasLayout from "../../layouts/GasLayout";
import "./sing.scss";

export interface propsInterface {
    className?: string;
    playlistId?: number;
}

export const propsDefaults = {
    className: ''
}

const Plan = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const url = new URL(window.location.href);
    const apiUrl = url.protocol + '//' + url.hostname + ':3000/api';

    const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
    const [editingPlaylistName, setEditingPlaylistName] = useState<string>('');
    const [editingPlaylistStartSlide, setEditingPlaylistStartSlide] = useState<string>('');
    const [editingPlaylistPauseSlide, setEditingPlaylistPauseSlide] = useState<string>('');
    const [editingPlaylistEndSlide, setEditingPlaylistEndSlide] = useState<string>('');

    const [showNewPlaylistForm, setShowNewPlaylistForm] = useState<boolean>(false);

    const [playlistsKey, setPlaylistsKey] = useState<number>(0);

    const reloadPlaylists = () => {
        setPlaylistsKey((_playlistsKey: number) => {
            return _playlistsKey + 1;
        });
    }

    const deletePlaylist = (playlist: Playlist) => {
        axios.delete(apiUrl + '/playlists/' + playlist.id).then(() => {
            setShowNewPlaylistForm(false);
            setEditingPlaylist(null);
            reloadPlaylists();
        });
    }

    const submitPlaylist = () => {
        if (editingPlaylistName.length < 1) {
            // don't save changes if the playlist name is empty
            setShowNewPlaylistForm(false);
            setEditingPlaylist(null);
            return;
        }
        if (editingPlaylist) {
            axios.patch(apiUrl + '/playlists/' + editingPlaylist.id, {
                name: editingPlaylistName,
                startSlide: editingPlaylistStartSlide,
                pauseSlide: editingPlaylistPauseSlide,
                endSlide: editingPlaylistEndSlide,
                songs: editingPlaylist.songs
            }).then(() => {
                setShowNewPlaylistForm(false);
                setEditingPlaylist(null);
                reloadPlaylists();
            });
        } else {
            axios.post(apiUrl + '/playlists', {
                name: editingPlaylistName
            }).then((response) => {
                setShowNewPlaylistForm(false);
                loadPlaylistById(response.data.id);
                reloadPlaylists();
            });
        }
    }

    const onPlaylistContentChange = (editedPlaylist: Playlist) => {
        if (editingPlaylist) {
            setEditingPlaylistName(editedPlaylist.name);
            setEditingPlaylistStartSlide(editedPlaylist.startSlide);
            setEditingPlaylistPauseSlide(editedPlaylist.pauseSlide);
            setEditingPlaylistEndSlide(editedPlaylist.endSlide);
            editingPlaylist.songs = [...editedPlaylist.songs];
        }
    }

    const loadPlaylistById = (playlistId: number): Playlist | null => {
        axios.get(apiUrl + '/playlists/' + playlistId).then((response) => {
            setEditingPlaylist(response.data as Playlist);
            setEditingPlaylistName(response.data.name);
        });
        return null;
    }

    useEffect(() => {
        if (showNewPlaylistForm) {
            setEditingPlaylist(null);
            setEditingPlaylistName('');
        }
    }, [showNewPlaylistForm]);

    useEffect(() => {
        const searchParams = new URLSearchParams(document.location.search)
        const searchParamsId = searchParams.get('playlistId');
        if (searchParamsId) {
            loadPlaylistById(parseInt(searchParamsId));
        }
    }, []);

    return <GasLayout>

        <Dialog draggable={false} closable={true} visible={showNewPlaylistForm}
            style={{ width: '50em', height: '30em' }}
            onHide={() => submitPlaylist()}>

            <div className="field p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <label htmlFor="slide-name" className="font-normal">Playlist Name</label>
                </span>
                <InputText id="slide-name" placeholder="Playlist Name" value={editingPlaylistName}
                    onChange={e => setEditingPlaylistName(e.target.value)} onKeyUp={(e) => { if (e.code === 'Enter') { submitPlaylist(); } }} />
            </div>

            <div className="m-3 flex justify-content-around">
                <Button onClick={(e: any) => {
                    e.preventDefault();
                    submitPlaylist();
                }}>Create Playlist</Button>
            </div>

        </Dialog>

        <Dialog draggable={false} visible={editingPlaylist !== null}
            style={{ width: '50em', height: '30em' }}
            onHide={() => submitPlaylist()}>
            {(editingPlaylist !== null) && <>
                <PlaylistEditor playlist={editingPlaylist}
                    onSubmit={() => submitPlaylist()}
                    onDelete={() => deletePlaylist(editingPlaylist)}
                    onContentChange={onPlaylistContentChange} />
            </>}
        </Dialog>

        <PlaylistPicker key={playlistsKey} onAdd={() => setShowNewPlaylistForm(true)} onEdit={(playlist: Playlist) => setEditingPlaylist(playlist)} />

    </GasLayout>

}

export default Plan;

