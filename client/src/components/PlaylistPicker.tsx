import { useState, useEffect, ReactNode } from "react";
import { getApiUrl } from "../stores/server";
import axios from "axios";

import { FilterMatchMode } from "primereact/api";
import { ObjectUtils } from "primereact/utils";

import { DataTable } from "primereact/datatable";
import { Column, type ColumnSortEvent } from "primereact/column";
import { Checkbox } from "primereact/checkbox";

import { Button } from './Button';
import { DeleteButton } from "./DeleteButton";

import type { Playlist } from "../models/playlist";

interface propsInterface {
    className?: string;
    onEdit?: CallableFunction;
    onPlay?: CallableFunction;
    onAdd?: CallableFunction;
    selectedPlaylistIds?: number[];
    withSelected?: ReactNode;
    onSelectionChange?: CallableFunction;
}

const propsDefaults = {
    className: '',
}

export const PlaylistPicker = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const apiUrl = getApiUrl();

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<number[]>(props.selectedPlaylistIds ?? []);

    const [filters] = useState({
        name: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const reloadPlaylists = () => {
        (async () => {
            const response = await fetch(apiUrl + "/playlists");
            let _playlists = await response.json();
            setPlaylists(_playlists);
        })();
    }

    const onEdit = (playlist: Playlist, e: Event) => {
        if (props.onEdit) {
            e.preventDefault();
            props.onEdit(playlist);
        }
    }

    const onAdd = (e: Event) => {
        if (props.onAdd) {
            e.preventDefault();
            props.onAdd(e);
        }
    }

    const onPlay = (playlist: Playlist, e: Event) => {
        if (props.onPlay) {
            e.preventDefault();
            props.onPlay(playlist);
        }
    }

    const deletePlaylist = (playlist: Playlist) => {
        axios.delete(apiUrl + '/playlists/' + playlist.id).then(() => {
            reloadPlaylists();
        });
    }

    const datatableFooter = () => {
        return <div className="text-right">
            <Button onClick={onAdd}><i className="pi pi-plus mr-2"></i>New Playlist</Button>
        </div>
    }

    const actionsBodyTemplate = (playlist: Playlist) => {
        const [isPlaylistSelected, setIsPlaylistSelected] = useState<boolean>((selectedPlaylistIds && selectedPlaylistIds?.indexOf(parseInt(`${playlist.id}` ?? '0')) > -1) ?? false);
        useEffect(() => {
            if (isPlaylistSelected) {
                setSelectedPlaylistIds((_selectedPlaylistIds) => {
                    return (_selectedPlaylistIds && [..._selectedPlaylistIds.filter((playlistId: number) => playlistId !== playlist.id), parseInt(`${playlist.id}`)]) ?? undefined;
                });
            } else {
                setSelectedPlaylistIds((_selectedPlaylistIds) => {
                    return (_selectedPlaylistIds && [..._selectedPlaylistIds.filter((playlistId: number) => playlistId !== playlist.id)]) ?? undefined;
                });
            }
        }, [isPlaylistSelected]);
        return <div>
            <Checkbox onChange={(e) => setIsPlaylistSelected(e.checked ?? false)} checked={isPlaylistSelected} />
        </div>
    }

    const editBodyTemplate = (playlist: Playlist) => {
        return <>
            <Button url={`/songleader/plan/${playlist.id}`} onClick={(e: Event) => onEdit(playlist, e)} className="p-button">Edit</Button>
        </>
    }

    const playBodyTemplate = (playlist: Playlist) => {
        return <>
            <Button url={`/songleader/sing/${playlist.id}`} onClick={(e: Event) => onPlay(playlist, e)}>Play</Button>
        </>
    }

    const deleteBodyTemplate = (playlist: Playlist) => {
        return <DeleteButton title="Delete Playlist" ask="Delete this playlist?" onClick={() => deletePlaylist(playlist)}></DeleteButton>
    }

    const updatedAtBodyTemplate = (playlist: Playlist) => {
        return new Date(playlist.updatedAt ?? Date.now()).toLocaleDateString("en-NZ", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    const createdAtBodyTemplate = (playlist: Playlist) => {
        return new Date(playlist.createdAt ?? Date.now()).toLocaleDateString("en-NZ", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    const sortByDateFunction = (columnProps: ColumnSortEvent) => {
        let value = [...columnProps.data];
        return value.sort((a: Playlist, b: Playlist) => {
            switch (columnProps.order) {
                case 1:
                case -1:
                    return columnProps.order * ObjectUtils.resolveFieldData(a, columnProps.field).localeCompare(ObjectUtils.resolveFieldData(b, columnProps.field));
                default:
                    return 0;
            }
        });
    }

    useEffect(() => {
        props.onSelectionChange && props.onSelectionChange(selectedPlaylistIds);
    }, [selectedPlaylistIds]);

    useEffect(() => {
        reloadPlaylists();
    }, []);

    return <>
        <DataTable footer={datatableFooter} value={playlists} className="playlists"
            emptyMessage={<p>No playlists have been created yet.</p>}
            filters={filters} globalFilterFields={['name']}>
            {selectedPlaylistIds && <Column body={actionsBodyTemplate} header={props.withSelected ?? ''}></Column>}
            <Column field="name" header="Name" sortable filter filterPlaceholder="Search by Name" />
            <Column body={createdAtBodyTemplate} header="Created At" sortable sortField="createdAt" sortFunction={sortByDateFunction} />
            <Column body={updatedAtBodyTemplate} header="Updated At" sortable sortField="updatedAt" sortFunction={sortByDateFunction} />
            <Column body={editBodyTemplate} />
            <Column body={playBodyTemplate} />
            <Column body={deleteBodyTemplate} />
        </DataTable>
    </>

}

