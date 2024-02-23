import { useState, useEffect, useRef } from "react";
import { isNumber, set } from "lodash";
import axios from 'axios';

import { getApiUrl } from "../stores/server";

import { ColorPicker } from "primereact/colorpicker";
import { ReactSortable } from "react-sortablejs";
import { Dialog } from "primereact/dialog";
import { Slider } from "primereact/slider";
import { FileUpload } from "primereact/fileupload";
import { Card } from "primereact/card";

import Button from './Button';
import Tile from "./Tile";

import { LineMarginUnits, LinePaddingUnits, ScreenStyle } from "../models/screen";
import { WallpaperFile, MimeType, getMimeTypeFormat } from "../models/wallpaper";

import './WallpaperPicker.scss';

export interface propsInterface {
    className?: string;
    wallpaperId: number;
    screenId: number;
    multiple?: boolean;
    onPick?: CallableFunction;
    onAdd?: CallableFunction;
    onDelete?: CallableFunction;
    onChange?: CallableFunction;
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
    const screenId = props.screenId;
    const multiple = props.multiple;
    const [files, setFiles] = useState<WallpaperFile[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<WallpaperFile[]>([]);
    const [screenStyle, setScreenStyle] = useState<ScreenStyle>(new ScreenStyle({}));

    const [showFilePicker, setShowFilePicker] = useState<boolean>(false);
    const [showPreview, setShowPreview] = useState<boolean>(false);

    const fileUploadRef = useRef<FileUpload | null>(null);

    const reloadWallpapers = () => {
        (async () => {
            const response = await fetch(apiUrl + "/wallpapers/" + wallpaperId);
            let _wallpaper = await response.json();
            setFiles(_wallpaper.files ?? []);
            setScreenStyle(new ScreenStyle(_wallpaper.style));
        })();
        (async () => {
            const response = await fetch(apiUrl + "/screens/" + screenId);
            let _screen = await response.json();
            setScreenStyle(new ScreenStyle(_screen.style));
        })();
    }

    const onAdd = () => {
        if (props.onAdd) {
            props.onAdd(files);
        }
    }

    const onPick = (e: Event, file: WallpaperFile) => {
        if (props.onPick) {
            e.preventDefault();
            if (multiple) {
                setSelectedFiles([file]);
                props.onPick(selectedFiles);
            } else {
                setSelectedFiles((_selectedFiles: WallpaperFile[]) => {
                    return [..._selectedFiles.filter((_file: WallpaperFile) => _file.id !== file.id), file];
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

    const deleteFile = (file: WallpaperFile) => {
        if (confirm('Are you sure you want to delete this background? ')) {
            setFiles((_files: WallpaperFile[]) => {
                return _files.filter((_file: WallpaperFile) => _file.filename !== file.filename);
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

    const hexColorToGrayscalePercent = (hexColor: string): number => {
        if (hexColor.length < 6) {
            return 50;
        }
        let r = parseInt(hexColor.substring(0, 2), 16);
        let g = parseInt(hexColor.substring(2, 4), 16);
        let b = parseInt(hexColor.substring(4, 6), 16);
        return Math.round((100 / 255) * ((r + g + b) / 3));
    }

    useEffect(() => {
        axios.patch(apiUrl + '/wallpapers/setFiles/' + wallpaperId, { files }).then(() => {
            if (props.onDelete) {
                props.onDelete(files);
            }
        });
        if (props.onChange) {
            props.onChange(files);
        }
    }, [files]);

    useEffect(() => {
        reloadWallpapers();
    }, []);

    const setSlideLineStyle = (file: WallpaperFile, path: string, value: string) => {
        setFiles((_files) => {
            return [
                ..._files.map((_file: WallpaperFile) => {
                    if (_file.filename === file.filename) {
                        set(_file.slideLineStyle, path, value);
                    }
                    return _file;
                })
            ];
        });
    }

    const getSlideLineStyleCss = (file: WallpaperFile) => {
        return {
            backgroundColor: '#' + file.slideLineStyle.backgroundColor,
            color: '#' + file.slideLineStyle.color,
            padding: LinePaddingUnits[screenStyle.linePadding],
            margin: LineMarginUnits[screenStyle.lineMargin]
        }
    }

    const TileHeader = (props: any) => {
        return <i className="pi pi-trash text-align-right font-red" title="Delete this Background" onClick={() => deleteFile(props.file)}></i>
    }

    const TileFooter = (props: any) => {

        const [textColor, setTextColor] = useState<string>(props.file.slideLineStyle.color);
        const [backgroundColor, setBackgroundColor] = useState<string>(props.file.slideLineStyle.backgroundColor);
        const [backgroundColorOpacity, setBackgroundColorOpacity] = useState<number>(props.file.slideLineStyle.backgroundColor.length > 6
            ? parseInt(props.file.slideLineStyle.backgroundColor.substring(6, 8), 16) * (100 / 255)
            : 100);

        const [showBackgroundColorOpacitySlider, setShowBackgroundColorOpacitySlider] = useState<boolean>(false);

        const convertOpacityPercentToHex = (opacityPercent: number) => {
            opacityPercent = opacityPercent > 100 ? 100 : opacityPercent < 0 ? 0 : opacityPercent;
            return Math.round(255 / 100 * opacityPercent).toString(16);
        };

        useEffect(() => {
            if (backgroundColor.length < 6) {
                setBackgroundColor('000000');
            }
            let backgroundColorHex = backgroundColor.substring(0, 6);
            setBackgroundColor(backgroundColorHex + convertOpacityPercentToHex(backgroundColorOpacity));

        }, [backgroundColorOpacity]);

        const textColorPickerRef = useRef<ColorPicker>(null);
        const backgroundColorPickerRef = useRef<ColorPicker>(null);

        return <>

            {!showPreview && <i title="Show Preview" className={`pi pi-eye`} onClick={() => setShowPreview(true)}></i>}
            {showPreview && <i title="Hide Preview" className={`pi pi-eye-slash`} onClick={() => setShowPreview(false)}></i>}

            <i title="Text Color" style={{ color: '#' + textColor, backgroundColor: '#' + (hexColorToGrayscalePercent(textColor) < 50 ? 'FFFFFF' : '000000') }} className="pi color-picker-button" onClick={() => (textColorPickerRef.current?.show())} aria-controls="textColor" aria-haspopup>T</i>
            <i title="Text Background Color" style={{ backgroundColor: '#' + backgroundColor }} className="color-picker-button" onClick={() => (backgroundColorPickerRef.current?.show())} aria-controls="backgroundColor" aria-haspopup></i >
            <i title="Text Background Transparency" className="pi pi-sun" onClick={() => (!showBackgroundColorOpacitySlider && setShowBackgroundColorOpacitySlider(true))} aria-controls="backgroundColorOpacity" aria-haspopup></i>

            {
                showBackgroundColorOpacitySlider && <div className={`background-opacity-slider`}>
                    <h3>Text Background Transparency</h3>
                    <Slider style={{ marginRight: '1em' }} min={0} max={100} step={1} value={backgroundColorOpacity} onChange={(e) => setBackgroundColorOpacity(isNumber(e.value) ? e.value : e.value[0])} onSlideEnd={() => (setShowBackgroundColorOpacitySlider(false), setSlideLineStyle(props.file, 'backgroundColor', backgroundColor))} />
                </div>
            }

            <ColorPicker style={{ position: 'absolute' }} hidden ref={backgroundColorPickerRef} value={backgroundColor.substring(0, 6)}
                onChange={(e: any) => (setBackgroundColor(e.value + convertOpacityPercentToHex(backgroundColorOpacity)))}
                onHide={() => setSlideLineStyle(props.file, 'backgroundColor', backgroundColor)}
            />

            <ColorPicker style={{ position: 'absolute' }} hidden format="hex" ref={textColorPickerRef} value={textColor}
                onChange={(e: any) => setTextColor(e.value)}
                onHide={() => setSlideLineStyle(props.file, 'color', textColor)} />

        </>
    }

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
                    {files.map((file: WallpaperFile) => <div key={file.filename} className="col-12 sm:col-6 md:col-4 lg:col-3">
                        <Tile headerIconRight={true}
                            onClick={(e: any) => onPick(e, file)}
                            header={<TileHeader file={file} />}
                            footer={<TileFooter file={file} />}>
                            {['jpg', 'png', 'gif', 'webp'].indexOf(getMimeTypeFormat(file.mimetype as MimeType) ?? '') > -1 && <img src={`${apiUrl}/wallpapers/file/${wallpaperId}/${file.filename}`} />}
                            {['mkv', 'mp4', 'webm', 'ogg', 'ogx'].indexOf(getMimeTypeFormat(file.mimetype as MimeType) ?? '') > -1 && <video width="320" height="240" autoPlay muted loop>
                                <source src={`${apiUrl}/wallpapers/file/${wallpaperId}/${file.filename}`} type="video/mp4"></source>
                                <source src={`${apiUrl}/wallpapers/file/${wallpaperId}/${file.filename}`} type="video/ogg"></source>
                                Your browser does not support the video tag.
                            </video>}
                            {showPreview && <div className={`preview-slide-content`}>
                                <p style={getSlideLineStyleCss(file)}>O, Lord my God</p>
                                <p style={getSlideLineStyleCss(file)}>When I in awesome wonder</p>
                                <p style={getSlideLineStyleCss(file)}>Consider all the worlds</p>
                                <p style={getSlideLineStyleCss(file)}>Thy hands hath made</p>
                            </div>}
                        </Tile>
                    </div>)}
                </ReactSortable>
            </div>
        </Card>
    </>
}

export default WallpaperPicker;

