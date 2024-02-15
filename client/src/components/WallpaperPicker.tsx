import { useState, useEffect, useRef } from "react";
import { getApiUrl } from "../stores/server";
import axios from 'axios';

import { ReactSortable } from "react-sortablejs";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { Card } from "primereact/card";

import Button from './Button';
import Tile from "./Tile";

import { File, MimeType, getMimeTypeFormat } from "../models/wallpaper";

import './WallpaperPicker.scss';

export interface propsInterface {
    className?: string;
    wallpaperId: number;
    multiple?: boolean;
    onPick?: CallableFunction;
    onAdd?: CallableFunction;
    onDelete?: CallableFunction;
    onSort?: CallableFunction;
}

export const propsDefaults = {
    className: '',
    multiple: true,
}

const WallpaperPicker = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const apiUrl = getApiUrl();

    const maxFileSizeMB = 80;

    const wallpaperId = props.wallpaperId;
    const multiple = props.multiple;
    const [files, setFiles] = useState<File[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const [showFilePicker, setShowFilePicker] = useState<boolean>(false);

    const fileUploadRef = useRef<FileUpload | null>(null);

    const reloadWallpapers = () => {
        (async () => {
            const response = await fetch(apiUrl + "/wallpapers/" + wallpaperId);
            let _wallpaper = await response.json();
            setFiles(_wallpaper.files ?? []);
        })();
    }

    const onAdd = () => {
        if (props.onAdd) {
            props.onAdd(files);
        }
    }

    const onPick = (e: Event, file: File) => {
        if (props.onPick) {
            e.preventDefault();
            if (multiple) {
                setSelectedFiles([file]);
                props.onPick(selectedFiles);
            } else {
                setSelectedFiles((_selectedFiles: File[]) => {
                    return [..._selectedFiles.filter((_file: File) => _file.id !== file.id), file];
                });
                props.onPick(selectedFiles[0] ?? undefined);
            }
        }
    }

    const dialogHeader = () => {
        return <>Dialog Header</>
    }

    const submitFilePicker = () => {
        setShowFilePicker(false);
    }

    const onFileUpload = (ajax: any) => {
        setFiles(JSON.parse(ajax.xhr.responseText).files);
        fileUploadRef.current?.clear();
    }

    const onFileUploadBeforeSend = (ajax: any) => {
        ajax.formData.append('wallpaperId', wallpaperId);
    }

    const onFileUploadError = (err: any) => {
        console.error('File upload failed: ', err);
        try {
            let error = JSON.parse(err.xhr.response);
            if (error.message) {
                alert('File upload failed: ' + error.message);
            }
        } catch (e) {
            alert('File upload failed: ' + err.xhr.response);
        }
        fileUploadRef.current?.clear();
        setShowFilePicker(false);
    }

    const deleteFile = (file: File) => {
        if (confirm('Are you sure you want to delete this background? ')) {
            setFiles((_files: File[]) => {
                return _files.filter((_file: File) => _file.filename !== file.filename);
            });
            axios.delete(apiUrl + '/wallpapers/deleteFile/' + wallpaperId + '/' + file.filename).then(() => {
                if (props.onDelete) {
                    props.onDelete(files);
                    reloadWallpapers();
                }
            });
        }
    }

    const cardFooter = () => {
        return <>{(multiple || files.length < 1) &&
            <div className="text-right">
                <Button onClick={() => setShowFilePicker(true)}><i className="pi pi-plus mr-2"></i>New File</Button>
            </div>}
        </>
    }

    useEffect(() => {
        axios.patch(apiUrl + '/wallpapers/setFilesSorting/' + wallpaperId, { files }).then(() => {
            if (props.onDelete) {
                props.onDelete(files);
            }
        });
        if (props.onSort) {
            props.onSort(files);
        }
    }, [files]);

    useEffect(() => {
        reloadWallpapers();
    }, []);

    return <>
        <Dialog draggable={false} closable={true} visible={showFilePicker}
            onHide={() => submitFilePicker()}
            header={dialogHeader}
            style={{ width: '50em', height: '30em' }}>
            <FileUpload multiple={!!props.multiple} auto ref={fileUploadRef}
                name="files[]"
                onUpload={e => { onFileUpload(e); fileUploadRef.current?.clear(); setShowFilePicker(false); onAdd(); }}
                onError={onFileUploadError}
                onBeforeSend={onFileUploadBeforeSend}
                accept={Object.values(MimeType).join('|')}
                maxFileSize={maxFileSizeMB * 1024 * 1024}
                url={apiUrl + '/wallpapers/uploadWallpaper'}
            />
        </Dialog>

        <Card header={<h3>Background Images</h3>} footer={cardFooter}>
            <div className={`${props.className} wallpaper-picker`}>
                <ReactSortable handle=".drag-handle" swapClass="swapping" list={files} setList={setFiles} className="w-full tile-group grid">
                    {files.map((file: File) => <div key={file.filename} className="col-12 sm:col-6 md:col-4 lg:col-3">
                        <Tile headerIconRight={true}
                            onClick={(e: any) => onPick(e, file)}
                            header={<i className="pi pi-trash text-align-right font-red" onClick={() => deleteFile(file)}></i>}>
                            {['jpg', 'png', 'gif', 'webp'].indexOf(getMimeTypeFormat(file.mimetype as MimeType) ?? '') > -1 && <img src={`${apiUrl}/wallpapers/file/${wallpaperId}/${file.filename}`} />}
                            {['mkv', 'mp4', 'webm', 'ogg', 'ogx'].indexOf(getMimeTypeFormat(file.mimetype as MimeType) ?? '') > -1 && <video width="320" height="240" autoPlay muted loop>
                                <source src={`${apiUrl}/wallpapers/file/${wallpaperId}/${file.filename}`} type="video/mp4"></source>
                                <source src={`${apiUrl}/wallpapers/file/${wallpaperId}/${file.filename}`} type="video/ogg"></source>
                                Your browser does not support the video tag.
                            </video>}
                        </Tile>
                    </div>)}
                </ReactSortable>
            </div>

        </Card>

    </>

}

export default WallpaperPicker;

