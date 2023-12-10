import { useState, useEffect } from "react";

import { FilterMatchMode } from "primereact/api";
import { ObjectUtils } from "primereact/utils";

import { DataTable } from "primereact/datatable";
import { Column, type ColumnSortEvent } from "primereact/column";

import Button from './Button';

import type { Playlist } from "../models/playlist";

export interface propsInterface {
    className?: string;
    onEdit?: CallableFunction;
    onPlay?: CallableFunction;
    onAdd?: CallableFunction;
}

export const propsDefaults = {
    className: '',
}

const PlaylistPicker = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const url = new URL(window.location.href);
    const apiUrl = url.protocol + '//' + url.hostname + ':3000/api';

    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    const [filters, setFilters] = useState({
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

    useEffect(() => {
        reloadPlaylists();
    }, []);

    const datatableHeader = () => {
        return <div className="text-right">
            <Button onClick={onAdd}><i className="pi pi-plus mr-2"></i>New Playlist</Button>
        </div>
    }

    const editBodyTemplate = (playlist: Playlist) => {
        return <>
            <Button url={`/songleader/plan?playlistId=${playlist.id}`} onClick={(e: Event) => onEdit(playlist, e)} className="p-button">Edit</Button>
        </>
    }

    const playBodyTemplate = (playlist: Playlist) => {
        return <>
            <Button url={`/songleader/sing?playlistId=${playlist.id}`} onClick={(e: Event) => onPlay(playlist, e)}>Play</Button>
        </>
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

    return <DataTable header={datatableHeader} value={playlists} className="playlists"
        emptyMessage={<p>No playlists have been created yet. <Button url="/songleader/plan" onClick={onAdd}>Add a playlist &raquo;</Button></p>}
        filters={filters} globalFilterFields={['name']}>
        <Column field="name" header="Name" sortable filter filterPlaceholder="Search by Name" />
        <Column body={createdAtBodyTemplate} header="Created At" sortable sortField="createdAt" sortFunction={sortByDateFunction} />
        <Column body={updatedAtBodyTemplate} header="Updated At" sortable sortField="updatedAt" sortFunction={sortByDateFunction} />
        <Column body={editBodyTemplate} />
        <Column body={playBodyTemplate} />
    </DataTable>

}

export default PlaylistPicker;

