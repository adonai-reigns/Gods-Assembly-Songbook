import { useEffect, useRef, useState } from "react";
import { format as dateFormat } from 'date-fns';
import axios from "axios";

import { getApiUrl } from "../stores/server";

import { TabPanel, TabView } from "primereact/tabview";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FileUpload } from "primereact/fileupload";

import { FormGroup } from "./FormGroup";
import { ConfirmButton } from "./ConfirmButton";

import { ImportFile } from "../models/file";

interface propsInterface {
    className?: string;
    children?: any;
}

const propsDefaults = {
    className: '',
    title: undefined
}

export const ImportForm = function (props: propsInterface) {
    props = { ...propsDefaults, ...props };

    const maxFileSize = 30 * 1024 * 1024;

    const apiUrl = getApiUrl();
    const fileUploadRef = useRef<FileUpload>(null);
    const [imports, setImports] = useState<ImportFile[]>([]);
    const [activeTabIndex, setActiveTabIndex] = useState<number>(2);

    const onFileUpload = (ajax: any) => {
        let result = JSON.parse(ajax.xhr.responseText);
        setImports(result.map((importFileData: any) => new ImportFile(importFileData)));
        fileUploadRef.current?.clear();
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
    }

    const songAccordionHeader = (importFile: ImportFile) => {
        return <span>
            {importFile.importMode === 'songs' && <>{`${importFile.songs.length ?? 0} songs in ${importFile.metadata.format} format, uploaded on ${dateFormat(new Date(importFile.stat?.ctime ?? Date.now()), 'yyyy-MM-dd HH:mm:ss')}`}</>}
            {importFile.importMode === 'playlists' && <>{`${importFile.playlists.length ?? 0} playlists in ${importFile.metadata.format} format, uploaded on ${dateFormat(new Date(importFile.stat?.ctime ?? Date.now()), 'yyyy-MM-dd HH:mm:ss')}`}</>}
        </span>
    }

    const importFileFooter = (importFile: ImportFile) => {
        return <FormGroup hideLabel={true} label={`Process Import`} className="flex-row justify-content-end">
            <ConfirmButton ask={`Are you sure you want to import this?`} onClick={() => doImportFile(importFile)}>Import</ConfirmButton>
        </FormGroup>
    }

    const doImportFile = (importFile: ImportFile) => {
        axios.post(apiUrl + '/playlists/import', { importFilenames: [importFile.filename] }).then((response: any) => {
            setImports(response.data.map((importData: any) => new ImportFile(importData)));
        });
    }

    useEffect(() => {
        axios.post(apiUrl + '/playlists/import', { files: [] }).then((response: any) => {
            setImports(response.data.map((importData: any) => new ImportFile(importData)));
        });
    }, []);

    return <div>
        <TabView activeIndex={activeTabIndex} onTabChange={e => setActiveTabIndex(e.index)}>
            <TabPanel header="Playlists">
                <Accordion>
                    {imports.filter((importFile: ImportFile) => importFile.importMode === 'playlists')
                        .map((importFile: ImportFile) => <AccordionTab key={importFile.filename}
                            header={() => songAccordionHeader(importFile)}>
                            <DataTable value={importFile.playlists} footer={() => importFileFooter(importFile)}>
                                <Column field={'name'} header="Name" />
                                <Column field={'songs.length'} header="Songs" />
                            </DataTable>
                        </AccordionTab>)}
                </Accordion>
            </TabPanel>
            <TabPanel header="Songs">
                <Accordion>
                    {imports.filter((importFile: ImportFile) => importFile.importMode === 'songs')
                        .map((importFile: ImportFile) => <AccordionTab key={importFile.filename}
                            header={() => songAccordionHeader(importFile)}>
                            <DataTable value={importFile.songs} footer={() => importFileFooter(importFile)}>
                                <Column field={'name'} header="Name" />
                                <Column field={'slides.length'} header="Slides" />
                                <Column field={'copyright.year'} header="Year" />
                                <Column field={'copyright.author'} header="Author" />
                            </DataTable>
                        </AccordionTab>)}
                </Accordion>
            </TabPanel>
            <TabPanel header="Upload">
                <FormGroup label="Description">
                    <FileUpload multiple auto ref={fileUploadRef}
                        name="files[]"
                        onUpload={function (e) { onFileUpload(e); }}
                        onError={onFileUploadError}
                        accept=".zip"
                        maxFileSize={maxFileSize}
                        url={apiUrl + '/playlists/uploadImport'}
                    />
                </FormGroup>
            </TabPanel>
        </TabView>
    </div >
}

