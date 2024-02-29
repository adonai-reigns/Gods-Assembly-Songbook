import { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../stores/server';

import { downloadBlob } from '../../utilities/downloadBlob';

import { SongPicker } from '../../components/SongPicker';
import { Button } from "../../components/Button";
import { Dropdown } from 'primereact/dropdown';

import { Song } from '../../models/song';

import GasLayout from '../../layouts/GasLayout';

interface propsInterface {
    className?: string;
    title?: string;
    onClick?: CallableFunction;
    "client:only"?: boolean
}

const propsDefaults = {
    className: '',
    title: undefined
}

const SongsContent = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const navigate = useNavigate();

    const apiUrl = getApiUrl();

    const [songs, setSongs] = useState<Song[]>([]);
    const [selectedSongIds, setSelectedSongIds] = useState<number[]>([]);

    useEffect(() => {
        (async () => {
            const response = await fetch(apiUrl + "/songs");
            setSongs((await response.json()));
        })();
    }, []);

    const exportSelectedSongIds = (format: 'text' | 'json' = 'json') => {
        let filename = 'downloadedFile';
        fetch(apiUrl + '/songs/export', {
            method: 'POST',
            body: JSON.stringify({ songIds: selectedSongIds, format }),
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
            {selectedSongIds.length > 0 && <>
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
                                exportSelectedSongIds('json');
                                e.target.value = undefined;
                                break;
                            case 'exportText':
                                exportSelectedSongIds('text');
                                e.target.value = undefined;
                                break;
                        }
                    }}
                />
            </>}
        </>
    }

    return <GasLayout>

        {songs.length > 0
            ? <SongPicker canDelete={true} onSongClick={(song: Song) => navigate('/songleader/song/' + song.id)}
                selectedSongIds={selectedSongIds} withSelected={withSelected()}
                onSelectionChange={(_selectedSongIds: number[]) => setSelectedSongIds(_selectedSongIds)}
                buttonLabelText={[`Edit`]}
                buttonUrl={[(song: Song) => '/songleader/song/' + song.id]}
                newSongUrl='/songleader/song' />
            : <p style={{ margin: '3em 0', fontSize: '2em', textAlign: 'center' }}>
                Welcome to God's Assembly Songbook!
                <br /><br />
                <Button onClick={() => navigate(`/songleader/song`)}>Create a song</Button>
            </p>

        }

    </GasLayout>

}

export default SongsContent;
