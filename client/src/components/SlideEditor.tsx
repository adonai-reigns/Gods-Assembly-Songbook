import { useState, useEffect, useRef } from "react";

import { Editor } from 'primereact/editor';
import { Button } from "primereact/button";

import type Slide from "../models/slide";

export interface propsInterface {
    className?: string;
    slide: Slide;
    onContentChange?: CallableFunction;
    onSubmit?: CallableFunction;
    onDelete?: CallableFunction;
    onCopy?: CallableFunction;
}

export const propsDefaults = {
    className: ''
}

export const quillHeader = () => {
    return (
        <span className="ql-formats">
            <button className="ql-bold" aria-label="Bold"></button>
            <button className="ql-italic" aria-label="Italic"></button>
            <button className="ql-underline" aria-label="Underline"></button>
            <button className="ql-align" aria-label="Align Left" value=""></button>
            <button className="ql-align" aria-label="Align Center" value="center" defaultChecked={true}></button>
            <button className="ql-align" aria-label="Align Right" value="right"></button>
            <select className="ql-size">
                <option value="">Default</option>
                <option value="small">Small</option>
                <option value="large">Large</option>
                <option value="huge">Huge</option>
            </select>
        </span>
    );
};


const SlideEditor = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const slide = props.slide;

    const [content, setContent] = useState<string>(slide.content);

    const quillRef = useRef<Editor | null>(null);

    const [quillInitted, setQuillInitted] = useState(false);

    const copySlide = () => {
        if (typeof props.onCopy === 'function') {
            props.onCopy();
        }
    }

    const deleteSlide = () => {
        if (typeof props.onDelete === 'function') {
            props.onDelete();
        }
    }

    const initQuill = () => {

        const quill = quillRef?.current?.getQuill() ?? null;

        if (quill) {
            if (content.length === 0) {
                // set default text-align center for new screens
                quill.format('align', 'center');
            }
        } else {
            // wait for the page to draw quill editor
            setTimeout(initQuill, 100);
        }
    }

    useEffect(() => {
        if (!quillInitted) {
            setQuillInitted(true);
            initQuill();
        }
    }, [quillInitted]);

    useEffect(() => {
        if (typeof props.onContentChange === 'function') {
            props.onContentChange(content);
        }
    }, [content]);

    return <div className="slide-editor">

        <Editor ref={quillRef} value={content} style={{ height: '320px' }}
            onTextChange={(e) => setContent(e.htmlValue ?? '')}
            headerTemplate={quillHeader()} />

        <div className="field m-3 p-inputgroup flex justify-content-center">

            <Button type="button" onClick={copySlide} severity="secondary">
                Copy <i className="pi pi-copy ml-3"></i>
            </Button>

            <Button type="button" title="Delete this Slide" onClick={(e) => {
                e.preventDefault();
                if (confirm('Are you sure you want to delete this slide? It cannot be undone...')) {
                    deleteSlide();
                }
            }
            } severity="danger">
                Delete <i className="pi pi-trash ml-3"></i>
            </Button>

        </div>

    </div>

}

export default SlideEditor;
