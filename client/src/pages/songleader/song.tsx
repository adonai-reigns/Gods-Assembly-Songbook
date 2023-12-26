import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ReactSortable } from 'react-sortablejs';

import axios from 'axios';

import Page404 from '../Page404';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import { Dropdown } from 'primereact/dropdown';
import type { SelectItem } from 'primereact/selectitem';

import Song from "../../models/song";
import Slide, {
    SlideType,
    SlideTypeLabels,
    SlideTypeShortNames,
    SlideTypeClassNames,
    defaultSlideType
} from '../../models/slide';

import SlideEditor from '../../components/SlideEditor';
import Tile from '../../components/Tile';

import GasLayout from '../../layouts/GasLayout';

import "./song.scss";

export interface propsInterface {
    className?: string,
    song?: Song,
    "client:only"?: boolean,
}

export const propsDefaults = {
    className: '',
}

const url = new URL(window.location.href);
const apiUrl = url.protocol + '//' + url.hostname + ':3000/api';

const SongContent = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const navigate = useNavigate();

    const params = useParams() ?? {};
    // const location = useLocation();
    // const searchParams = new URLSearchParams(location.search);

    const [is404, setIs404] = useState(false);

    // song id
    const [songId, setSongId] = useState<number>(parseInt(params.id ?? '0'));

    const [song, setSong] = useState<Song>(new Song());
    const [editingSongName, setEditingSongName] = useState('');

    const [slides, setSlides] = useState<Slide[]>([]);

    const [isEditingSlide, setIsEditingSlide] = useState<boolean>(false);
    const [editingSlideId, setEditingSlideId] = useState<number>(0);
    const [editingSlideName, setEditingSlideName] = useState<string>('');
    const [editingSlideType, setEditingSlideType] = useState<SlideType>(defaultSlideType);

    const [editingSlideContent, setEditingSlideContent] = useState<string>('');
    const [autogenerateSlideName, setAutogenerateSlideName] = useState<boolean>(true);

    const [slideTypesAsDropdownOptions, setSlideTypesAsDropdownOptions] = useState<SelectItem[]>([]);

    const resetComponentState = () => {
        setSong(new Song());
        setIsEditingSlide(false);
        setEditingSongName('');
        setEditingSlideId(0);
        setEditingSlideName('');
        setEditingSlideContent('');
        setAutogenerateSlideName(true);
        setEditingSlideType(defaultSlideType);
        setSongId(parseInt(params.id ?? '0'));

        setSlideTypesAsDropdownOptions((_slideTypesAsDropdownOptions: SelectItem[]): SelectItem[] => {
            _slideTypesAsDropdownOptions = [];
            Object.values(SlideType).map((slideType) => {
                _slideTypesAsDropdownOptions[_slideTypesAsDropdownOptions.length] = {
                    label: SlideTypeLabels[slideType],
                    value: slideType
                };
            })
            return _slideTypesAsDropdownOptions;
        });
    }

    useEffect(() => {
        resetComponentState();
    }, [params]);

    const reloadSongData = async (_songId: number) => {
        if (_songId !== songId) {
            setSongId(_songId);
        } else {
            axios.get(apiUrl + '/songs/' + songId).then((response: any) => {
                if (response.data) {
                    setSongCacheFromApiData(response.data);
                    if (response.data.slides.length < 1) {
                        addSlide();
                    }
                }
            }).catch((e) => {
                if (e.response.status) {
                    setIs404(true);
                };
            });
        }
    }

    const submitSong = () => {
        if (songId === 0) {
            // POST for creating a new song
            axios.post(apiUrl + '/songs', {
                name: editingSongName,
                sorting: 0
            }).then((response) => {
                if (response.data.id) {
                    navigate('/songleader/song/' + response.data.id);
                    reloadSongData(response.data.id);
                }
            })
        } else {
            // PATCH for updating an existing song
            axios.patch(apiUrl + '/songs/' + songId, {
                name: editingSongName
            }).then((response) => {
                if (response.data.id) {
                    reloadSongData(response.data.id);
                }
            })
        }
    }

    const deleteSong = () => {
        axios.delete(apiUrl + '/songs/' + songId).then(() => {
            navigate('/songleader/songs');
        });
    }

    const submitSlide = () => {
        // pluck the first line as the name of the slide
        let parser = new DOMParser();
        let firstLineText = parser.parseFromString(editingSlideContent, 'text/html')?.body?.getElementsByTagName('p')[0]?.innerText ?? '';
        if (firstLineText === '') {
            return;
        }
        axios.patch(apiUrl + '/slides/' + editingSlideId, {
            name: editingSlideName,
            type: editingSlideType,
            content: editingSlideContent
        }).then(() => {
            setEditingSlideId(0);
            setEditingSlideName('');
            setEditingSlideContent('');
            reloadSongData(songId);
        });
    }

    const deleteSlide = () => {
        if (editingSlideId) {
            axios.delete(apiUrl + '/slides/' + editingSlideId).then(() => {
                setEditingSlideId(0);
                setEditingSlideName('');
                setEditingSlideContent('');
                reloadSongData(songId);
            });
        }
    }

    const copySlide = () => {
        if (editingSlideId) {
            const editingSlide = getSlideById(editingSlideId);
            if (editingSlide) {
                const newSlide = new Slide();
                newSlide.songId = editingSlide.songId;
                newSlide.name = editingSlide.name;
                newSlide.type = editingSlide.type;
                newSlide.content = editingSlide.content;
                newSlide.sorting = slides.length;
                axios.post(apiUrl + '/slides', newSlide).then(async (response) => {
                    if (response.data) {
                        setEditingSlideId(0);
                        setEditingSlideName('');
                        setEditingSlideType(defaultSlideType)
                        setEditingSlideContent('');
                        await reloadSongData(songId);
                    }
                });
            }
        }
    }

    const setSongCacheFromApiData = (song: Song) => {
        setSong(song);
        setSongId(song.id ?? 0);
        setEditingSongName(song.name);
        setSlides(song.slides);
    }

    const addSlide = () => {
        let newSlide = new Slide();
        newSlide.songId = songId;
        newSlide.type = defaultSlideType;
        newSlide.sorting = slides.length;
        axios.post(apiUrl + '/slides', newSlide).then(async (response) => {
            if (response.data) {
                await reloadSongData(songId);
                const newSlideId = parseInt(response.data.id);
                const newSlide = getSlideById(newSlideId);
                if (newSlide) {
                    setEditingSlideId(newSlideId);
                    setEditingSlideName(newSlide.name);
                    setEditingSlideType(newSlide.type);
                    setEditingSlideContent(newSlide.content);
                    setAutogenerateSlideName(true);
                } else {
                    // error while creating new slide at api
                }
            }
        });
    }

    const getSlideById = (slideId: number): Slide => {
        return slides.filter((slide: Slide) => slide.id === slideId)[0] ?? new Slide();
    }

    useEffect(() => {
        if (songId < 1) {
            return;
        }
        if (editingSlideId > 0) {
            const editingSlide = getSlideById(editingSlideId);
            setEditingSlideName(editingSlide.name);
            setEditingSlideType(editingSlide.type);
            setEditingSlideContent(editingSlide.content);
            setAutogenerateSlideName(!(editingSlide.name.length > 0));
            setIsEditingSlide(true);
        } else {
            setIsEditingSlide(false);
        }
    }, [editingSlideId]);

    useEffect(() => {
        if (autogenerateSlideName) {
            doAutogenerateSlideName();
        }
    }, [editingSlideContent]);

    useEffect(() => {
        if (songId) {
            reloadSongData(songId);
        }
    }, [songId]);

    useEffect(() => {
        if (slides.length > 0) {
            // record the current sorted order of the slides
            let sortedIds = slides.map((slide: Slide) => slide.id).join(',');
            axios.post(apiUrl + '/slides/setSorting', { sortedIds }).then(async (response) => {
                if (response.data) {

                }
            });
        }
    }, [slides]);

    const doAutogenerateSlideName = () => {
        let parser = new DOMParser();
        let firstLineText = parser.parseFromString(editingSlideContent, 'text/html')?.body?.getElementsByTagName('p')[0]?.innerText ?? '';
        if (firstLineText) {
            setEditingSlideName(firstLineText);
        }
    }

    const dialogHeader = function () {

        const handleOnNameChange = (newSlideName: string) => {
            setEditingSlideName(newSlideName);
            if (autogenerateSlideName && newSlideName.length > 0) {
                // if they have typed into the name field, then we should not overwrite it
                setAutogenerateSlideName(false);
            } else if (newSlideName.length < 1 && !autogenerateSlideName) {
                // if they have cleared the name field, we should auto-generate the name
                setAutogenerateSlideName(true);
            }
        }

        const handleOnTypeChange = (newSlideType: SlideType) => {
            setEditingSlideType(newSlideType);
        }

        return <div className="field p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
                <label htmlFor="slide-name" className="font-normal">Slide Name</label>
            </span>
            <InputText id="slide-name" placeholder="Slide Name" value={editingSlideName}
                onChange={e => handleOnNameChange(e.target.value)} />

            <Dropdown options={slideTypesAsDropdownOptions} value={editingSlideType}
                optionValue='value'
                onChange={e => handleOnTypeChange(e.target.value)} />

            <Button type="button" onClick={submitSlide} className="p-inputgroup-addon font-bold">
                Done <i className="pi pi-check ml-3 font-bold"></i>
            </Button>
        </div>
    }

    const SlideTileHeaderIcon = function (props: any) {

        return <>
            <span title={SlideTypeLabels[props.slide.type]} className={`w-2rem flex flex-direction-column justify-content-around align-items-center text-center font-bold ml-1 p-1 border-round ${SlideTypeClassNames[props.slide.type]}`}>{SlideTypeShortNames[props.slide.type]}</span>
        </>
    }

    return <GasLayout>
        {(is404 ? <Page404 /> : <>

            {editingSlideId > 0 &&
                <Dialog draggable={false} closable={false} header={dialogHeader} visible={isEditingSlide}
                    style={{ width: '50em', height: '30em' }}
                    onHide={() => submitSlide()}>
                    <SlideEditor
                        slide={getSlideById(editingSlideId)}
                        onContentChange={(newContent: string) => setEditingSlideContent(newContent)}
                        onSubmit={submitSlide}
                        onCopy={copySlide}
                        onDelete={deleteSlide}
                    />
                </Dialog>
            }

            {songId
                ? <h2 className="text-center">Editing: "{song.name}"</h2>
                : <h2 className="text-center">Create a new Song</h2>
            }

            <form className="formgrid gridw-auto p-3" onSubmit={(e) => { e.preventDefault(); submitSong() }}>
                <div className="field m-3 p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-heart-fill"></i>
                    </span>
                    <span className="p-float-label">
                        <InputText id="song-name" placeholder="Song Name" value={editingSongName} onChange={e => setEditingSongName(e.target.value)} />
                        <label htmlFor="song-name" className="">Song Name</label>
                    </span>
                    <Button type="button" label={songId ? 'Update' : 'Create'}
                        disabled={song.name === editingSongName}
                        onClick={submitSong} />
                    {songId > 0 &&
                        <Button severity="danger" onClick={(e) => {
                            e.preventDefault();
                            if (confirm('Are you sure you want to delete this song? It cannot be undone...')) { deleteSong() }
                        }
                        }>Delete this Song</Button>
                    }
                </div>
            </form>
            {songId > 0 &&
                <ReactSortable handle=".drag-handle" swapClass="swapping" list={slides} setList={setSlides} className="tile-group grid">
                    {slides.map((slide: Slide, index: number) => <div className="col-6 md:col-4 lg:col-2" key={'tile-' + slide.id}>
                        <Tile headerIcon={SlideTileHeaderIcon({ slide })} onClick={() => setEditingSlideId(slide.id)} index={index}>{slide.name}</Tile>
                    </div>)}
                    <div key="add-btn" className="col-6 md:col-4 lg:col-2">
                        <Tile noDragHandle={true} title="Add new Slide" className="add-button" onClick={addSlide}>+</Tile>
                    </div>
                </ReactSortable>
            }
        </>
        )}
    </GasLayout>
}

export default SongContent;

