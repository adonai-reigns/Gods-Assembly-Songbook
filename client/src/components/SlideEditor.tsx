import { useState, useEffect, useRef } from "react";

import { Editor } from 'primereact/editor';
import { FormSubmit } from "./FormSubmit";

import type { Slide } from "../models/slide";

interface propsInterface {
    className?: string;
    slide: Slide;
    onContentChange?: CallableFunction;
    onSubmit: CallableFunction;
    onDelete?: CallableFunction;
    onCopy?: CallableFunction;
}

const propsDefaults = {
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

export const SlideEditor = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const slide = props.slide;

    const [content, setContent] = useState<string>(slide.content);

    const quillRef = useRef<Editor | null>(null);

    const [quillInitted, setQuillInitted] = useState(false);

    const doSubmit = () => {
        props.onSubmit();
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

        <FormSubmit onClick={doSubmit} />

    </div>

}

