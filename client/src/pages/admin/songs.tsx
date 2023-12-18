import { useState, useEffect } from 'react';

import Button from "../../components/Button";

import Song from '../../models/song';
import AdminLayout from '../../layouts/AdminLayout';
import { useNavigate } from 'react-router-dom';

export interface propsInterface {
    className?: string;
    title?: string;
    onClick?: CallableFunction;
    "client:only"?: boolean
}

export const propsDefaults = {
    className: '',
    title: undefined
}

const SongsContent = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const navigate = useNavigate();

    const url = new URL(window.location.href);
    const apiUrl = url.protocol + '//' + url.hostname + ':3000/api';

    const [songs, setSongs] = useState<Song[]>([]);

    useEffect(() => {
        (async () => {
            const response = await fetch(apiUrl + "/songs");
            setSongs((await response.json()));
        })();
    }, []);

    return <AdminLayout>

        {songs.length > 0
            ? (
                <ul className="p-0 flex list-none">
                    {songs.map((song: Song) => (
                        <li key={`song_${song.id}`} className="m-3">
                            <Button onClick={() => navigate(`/admin/song/${song.id}`)}>{song.name}</Button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={{ margin: '3em 0', fontSize: '2em', textAlign: 'center' }}>
                    Welcome to God's Assembly Songbook!
                    <br /><br />
                    <Button onClick={() => navigate(`/admin/song`)}>Create a song</Button>
                </p>
            )
        }

    </AdminLayout>

}

export default SongsContent;