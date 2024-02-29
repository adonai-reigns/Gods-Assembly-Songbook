import { useState, useEffect, ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApiUrl } from "../../stores/server";
import axios from 'axios';

import { downloadBlob } from "../../utilities/downloadBlob";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import { PlaylistPicker } from "../../components/PlaylistPicker";
import { PlaylistEditor } from "../../components/PlaylistEditor";

import { FormGroup } from "../../components/FormGroup";
import { Button } from '../../components/Button';
import { Dropdown } from "primereact/dropdown";

import { Playlist } from "../../models/playlist";
import { Song } from "../../models/song";

import GasLayout from "../../layouts/GasLayout";
import "./sing.scss";

interface propsInterface {
    className?: string;
    playlistId?: number;
}

const propsDefaults = {
    className: ''
}

const Plan = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const params = useParams();
    const navigate = useNavigate();

    const apiUrl = getApiUrl();

    const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
    const [editingPlaylistName, setEditingPlaylistName] = useState<string>('');
    const [editingPlaylistStartSlide, setEditingPlaylistStartSlide] = useState<string>('');
    const [editingPlaylistPauseSlide, setEditingPlaylistPauseSlide] = useState<string>('');
    const [editingPlaylistEndSlide, setEditingPlaylistEndSlide] = useState<string>('');

    const [showNewPlaylistForm, setShowNewPlaylistForm] = useState<boolean>(false);

    const [playlistsKey, setPlaylistsKey] = useState<number>(0);
    const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<number[]>([]);

    const reloadPlaylists = () => {
        setPlaylistsKey((_playlistsKey: number) => {
            return _playlistsKey + 1;
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

    const onAddSongs = (addedSongs: Song[]) => {
        if (editingPlaylist) {
            axios.post(apiUrl + '/playlists/' + editingPlaylist.id + '/addSongs', {
                songs: addedSongs.map((song: Song) => { return { ...song } })
            }).then((response) => {
                setEditingPlaylist(new Playlist(response.data));
            }).catch(e => console.error(e));
        }
    }

    const onDeleteSongs = (deletedSongs: Song[]) => {
        if (editingPlaylist) {
            deletedSongs.map((song: Song) => {
                axios.delete(apiUrl + '/playlists/' + editingPlaylist.id + '/deleteSong/' + song.id).then((response) => {
                    setEditingPlaylist(new Playlist(response.data));
                }).catch(e => console.error(e));
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

    const exportSelectedPlaylistIds = (format: 'text' | 'json' = 'json') => {
        let filename = 'downloadedFile';
        fetch(apiUrl + '/playlists/export', {
            method: 'POST',
            body: JSON.stringify({ playlistIds: selectedPlaylistIds, format }),
            headers: {
                'Content-Type': 'application/json',
                responseType: 'blob',
                withCredentials: 'true'
            },
        }).then(function (resp) {
            let contentDisposition = resp.headers.get('content-disposition') ?? undefined;
            filename = (contentDisposition?.match(/filename="(.+)"/) ?? [])[1] ?? filename;
            return resp.blob();
        }).then(function (blob) {
            return downloadBlob(blob, filename);
        });
    }

    const withSelected = (): ReactNode => {
        return <>
            {selectedPlaylistIds.length > 0 && <>
                <Dropdown options={[
                    {
                        "value": 'exportJson',
                        "label": 'Export JSON'
                    },
                    {
                        "value": 'exportText',
                        "label": 'Export Plain Text'
                    }
                ]}
                    optionLabel="label"
                    optionValue="value"
                    onChange={(e: any) => {
                        switch (e.value) {
                            case 'exportJson':
                                exportSelectedPlaylistIds('json');
                                e.target.value = undefined;
                                break;
                            case 'exportText':
                                exportSelectedPlaylistIds('text');
                                e.target.value = undefined;
                                break;
                        }
                    }}
                />
            </>}
        </>
    }

    useEffect(() => {
        if (showNewPlaylistForm) {
            setEditingPlaylist(null);
            setEditingPlaylistName('');
        }
    }, [showNewPlaylistForm]);

    useEffect(() => {
        const searchParamsId = params.playlistId ?? null;
        if (searchParamsId) {
            loadPlaylistById(parseInt(searchParamsId));
        }
    }, []);

    return <GasLayout>

        <Dialog draggable={false} closable={true} visible={showNewPlaylistForm}
            style={{ width: '50em', height: '30em' }}
            onHide={() => submitPlaylist()}>

            <FormGroup label="Playlist Name">
                <InputText id="slide-name" placeholder="Playlist Name" value={editingPlaylistName}
                    onChange={e => setEditingPlaylistName(e.target.value)} onKeyUp={(e) => { if (e.code === 'Enter') { submitPlaylist(); } }} />
            </FormGroup>

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
                    onAddSongs={onAddSongs}
                    onDeleteSongs={onDeleteSongs}
                    onContentChange={onPlaylistContentChange} />
            </>}
        </Dialog>

        <PlaylistPicker key={playlistsKey}
            selectedPlaylistIds={selectedPlaylistIds} withSelected={withSelected()}
            onSelectionChange={(_selectedPlaylistIds: number[]) => setSelectedPlaylistIds(_selectedPlaylistIds)}
            onAdd={() => setShowNewPlaylistForm(true)}
            onEdit={(playlist: Playlist) => setEditingPlaylist(playlist)}
            onPlay={(playlist: Playlist) => navigate('/songleader/sing/' + playlist.id)}
        />

    </GasLayout>

}

export default Plan;

