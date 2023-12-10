import { useState, useEffect } from "react";
import axios from "axios";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";
import type Song from "../models/song";
import Button from "../components/Button";

export interface propsInterface {
    selectedSongIds: number[];
    className?: string;
    onSubmit?: CallableFunction;
    onSelectionChange: CallableFunction;
}

export const propsDefaults = {
    className: ''
}

const SongPicker = function (props: propsInterface) {

    const url = new URL(window.location.href);
    const apiUrl = url.protocol + '//' + url.hostname + ':3000/api';

    const [songs, setSongs] = useState<Song[]>([]);
    const [selectedSongIds, setSelectedSongIds] = useState<number[]>(props.selectedSongIds);

    useEffect(() => {
        axios.get(apiUrl + '/songs').then((response: any) => {
            setSongs(response.data);
        });
    }, []);

    useEffect(() => {
        props.onSelectionChange(selectedSongIds);
    }, [selectedSongIds]);

    const actionsBodyTemplate = (song: Song) => {

        const [isSongSelected, setIsSongSelected] = useState<boolean>((selectedSongIds.indexOf(parseInt(`${song.id}` ?? '0')) > -1));

        useEffect(() => {
            if (isSongSelected) {
                setSelectedSongIds((_selectedSongIds) => {
                    return [..._selectedSongIds.filter((songId: number) => songId !== song.id), parseInt(`${song.id}`)];
                });
            } else {
                setSelectedSongIds((_selectedSongIds) => {
                    return [..._selectedSongIds.filter((songId: number) => songId !== song.id)];
                });
            }
        }, [isSongSelected]);

        return <div>
            <Checkbox onChange={(e) => setIsSongSelected(e.checked ?? false)} checked={isSongSelected} />
        </div>

    }

    return <div>
        <DataTable value={songs}>
            <Column body={actionsBodyTemplate}></Column>
            <Column field="name" header="name"></Column>
        </DataTable>
        <p>Can't find the song you need?</p>
        <Button url="/admin/song">Create a new Song</Button>
    </div>

}

export default SongPicker;
