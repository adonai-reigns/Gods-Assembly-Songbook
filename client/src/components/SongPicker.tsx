import { useState, useEffect } from "react";
import { getApiUrl } from "../stores/server";
import axios from "axios";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";

import { DeleteButton } from "./DeleteButton";
import { Button } from "../components/Button";
import { FormSubmit } from "./FormSubmit";

import { FilterMatchMode } from "primereact/api";
import type { Song } from "../models/song";

interface propsInterface {
    selectedSongIds?: number[];
    className?: string;
    onSubmit?: CallableFunction;
    onSelectionChange?: CallableFunction;
    onSongClick?: CallableFunction;
    buttonLabelText?: string[];
    buttonUrl?: CallableFunction[];
    onButtonClick?: CallableFunction[];
    newSongUrl?: string;
    canDelete?: boolean;
}

const propsDefaults = {
    className: '',
    selectedSongIds: [],
    newSongUrl: '/songleader/song',
    canDelete: false,
}

export const SongPicker = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const apiUrl = getApiUrl();

    const [songs, setSongs] = useState<Song[]>([]);
    const [selectedSongIds, setSelectedSongIds] = useState<number[] | undefined>(props.selectedSongIds);

    const [songNameFilter] = useState({
        name: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const onSubmit = () => {
        if (props.onSubmit) {
            props.onSubmit(selectedSongIds);
        }
    }

    const deleteSong = (song: Song, callback: CallableFunction) => {
        axios.delete(apiUrl + '/songs/' + song.id).then(() => callback());
    }

    const actionsBodyTemplate = (song: Song) => {

        const [isSongSelected, setIsSongSelected] = useState<boolean>((selectedSongIds && selectedSongIds?.indexOf(parseInt(`${song.id}` ?? '0')) > -1) ?? false);

        useEffect(() => {
            if (isSongSelected) {
                setSelectedSongIds((_selectedSongIds) => {
                    return (_selectedSongIds && [..._selectedSongIds.filter((songId: number) => songId !== song.id), parseInt(`${song.id}`)]) ?? undefined;
                });
            } else {
                setSelectedSongIds((_selectedSongIds) => {
                    return (_selectedSongIds && [..._selectedSongIds.filter((songId: number) => songId !== song.id)]) ?? undefined;
                });
            }
        }, [isSongSelected]);

        return <div>
            <Checkbox onChange={(e) => setIsSongSelected(e.checked ?? false)} checked={isSongSelected} />
        </div>

    }

    const songNameBodyTemplate = (song: Song) => {

        const [isSongSelected] = useState<boolean>((selectedSongIds && selectedSongIds?.indexOf(parseInt(`${song.id}` ?? '0')) > -1) ?? false);

        useEffect(() => {
            if (isSongSelected) {
                setSelectedSongIds((_selectedSongIds) => {
                    return (_selectedSongIds && [..._selectedSongIds.filter((songId: number) => songId !== song.id), parseInt(`${song.id}`)]) ?? undefined;
                });
            } else {
                setSelectedSongIds((_selectedSongIds) => {
                    return (_selectedSongIds && [..._selectedSongIds.filter((songId: number) => songId !== song.id)]) ?? undefined;
                });
            }
        }, [isSongSelected]);

        return <div>
            {props.onSongClick
                ? <a onClick={(e) => props.onSongClick && (e.preventDefault(), props.onSongClick(song))} href={`/songleader/songs/${song.id}`}>{song.name}</a>
                : <>{song.name}</>
            }
        </div>

    }

    const buttonBodyTemplate = (song: Song) => {

        const [isSongSelected] = useState<boolean>((selectedSongIds && selectedSongIds?.indexOf(parseInt(`${song.id}` ?? '0')) > -1) ?? false);

        useEffect(() => {
            if (isSongSelected) {
                setSelectedSongIds((_selectedSongIds) => {
                    return (_selectedSongIds && [..._selectedSongIds.filter((songId: number) => songId !== song.id), parseInt(`${song.id}`)]) ?? undefined;
                });
            } else {
                setSelectedSongIds((_selectedSongIds) => {
                    return (_selectedSongIds && [..._selectedSongIds.filter((songId: number) => songId !== song.id)]) ?? undefined;
                });
            }
        }, [isSongSelected]);

        return <>
            {props.buttonLabelText && props.buttonLabelText?.map((buttonText: string, buttonIndex: number) => {
                if (props.buttonUrl !== undefined && props.buttonUrl.length > buttonIndex - 1) {
                    return <Button key={`btn_${buttonIndex}`} url={props.buttonUrl[buttonIndex](song)}>{buttonText}</Button>
                } else if (props.onButtonClick !== undefined && props.onButtonClick.length > buttonIndex - 1) {
                    return <Button key={`btn_${buttonIndex}`} onClick={() => props.onButtonClick && props.onButtonClick[buttonIndex](song)}>{buttonText}</Button>
                } else {
                    return <></>
                }
            })}
        </>

    }

    const footerBodyTemplate = () => {
        return <div className="flex justify-content-end">
            <p className="m-3">Can't find the song you need?</p>
            <Button url={props.newSongUrl}>Create a new Song</Button>
        </div>

    }

    const deleteButtonBodyTemplate = (song: Song) => {
        return <DeleteButton onClick={() => deleteSong(song, reloadSongs)} ask="Delete this song from the database?"></DeleteButton>
    }

    const reloadSongs = () => {
        axios.get(apiUrl + '/songs').then((response: any) => {
            setSongs(response.data);
        });
    }

    useEffect(() => {
        reloadSongs();
    }, []);

    useEffect(() => {
        props.onSelectionChange && props.onSelectionChange(selectedSongIds);
    }, [selectedSongIds]);

    return <div>
        <DataTable value={songs} className={props.className} filters={songNameFilter} globalFilterFields={['name']}
            footer={footerBodyTemplate}>
            {selectedSongIds && <Column body={actionsBodyTemplate}></Column>}
            <Column body={songNameBodyTemplate} field="name" sortable filter filterPlaceholder="Search by Name"></Column>
            {props.buttonLabelText && <Column body={buttonBodyTemplate} className="text-right"></Column>}
            {props.canDelete && <Column body={deleteButtonBodyTemplate} className="text-right"></Column>}
        </DataTable>
        {props.onSubmit && <FormSubmit icon="pi pi-check" onClick={onSubmit}>Add Selected Songs</FormSubmit>}
    </div>

}

