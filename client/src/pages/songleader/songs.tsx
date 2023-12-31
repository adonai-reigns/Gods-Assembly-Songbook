import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import SongPicker from '../../components/SongPicker';
import Button from "../../components/Button";

import Song from '../../models/song';

import GasLayout from '../../layouts/GasLayout';

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

    return <GasLayout>

        {songs.length > 0
            ? <SongPicker canDelete={true} onSongClick={(song: Song) => navigate('/songleader/song/' + song.id)} buttonLabelText={[`Edit`]} buttonUrl={[(song: Song) => '/songleader/song/' + song.id]} newSongUrl='/songleader/song' />
            : <p style={{ margin: '3em 0', fontSize: '2em', textAlign: 'center' }}>
                Welcome to God's Assembly Songbook!
                <br /><br />
                <Button onClick={() => navigate(`/songleader/song`)}>Create a song</Button>
            </p>

        }

    </GasLayout>

}

export default SongsContent;