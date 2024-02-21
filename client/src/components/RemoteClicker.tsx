import { useRef } from "react";
import "./Tile.scss";
import { useKeyPress } from "../hooks/keypress";

export enum ClickerButton {
    leftButton,
    rightButton,
    upButton,
    downButton,
    enterButton
};

export interface propsInterface {
    className?: string;
    title?: string;
    children?: any;
    noDragHandle?: boolean;
    longpressTimeout: number;
    ignoreTypingDelay: number;
    suppressKeyDefaults: string[];
    onClick: CallableFunction;
    onLongPress: CallableFunction;
    leftButtonKeyCode: string;
    rightButtonKeyCode: string;
    upButtonKeyCode: string;
    downButtonKeyCode: string;
}

export const propsDefaults = {
    className: '',
    title: undefined,
    noDragHandle: false,
    longpressTimeout: 1000,
    ignoreTypingDelay: 1000,
    suppressKeyDefaults: [''],
    leftButtonKeyCode: 'ArrowLeft',
    rightButtonKeyCode: 'ArrowRight',
    upButtonKeyCode: 'ArrowUp',
    downButtonKeyCode: 'ArrowDown',
}

const RemoteClicker = function (props: propsInterface) {
    props = { ...propsDefaults, ...props };

    const clickerLeftButtonRef = useRef<HTMLDivElement>(null);
    const clickerRightButtonRef = useRef<HTMLDivElement>(null);
    const clickerUpButtonRef = useRef<HTMLDivElement>(null);
    const clickerDownButtonRef = useRef<HTMLDivElement>(null);
    const clickerLeftHoldButtonRef = useRef<HTMLDivElement>(null);
    const clickerRightHoldButtonRef = useRef<HTMLDivElement>(null);
    const clickerUpHoldButtonRef = useRef<HTMLDivElement>(null);
    const clickerDownHoldButtonRef = useRef<HTMLDivElement>(null);

    // const handleUpButtonHold = () => {
    //     // not implemented
    // }

    // const handleDownButtonHold = () => {
    //     // not implemented
    // }

    const handleKeyDownEvent = () => {
        // not implemented
    };

    const handleKeyUpEvent = (e: any) => {

        let clickerCodes = [
            props.leftButtonKeyCode,
            props.rightButtonKeyCode,
            props.upButtonKeyCode,
            props.downButtonKeyCode,
        ];

        if (e.code && clickerCodes.indexOf(e.code) > -1) {
            e.stopPropagation();
            e.preventDefault();
            switch (clickerCodes.indexOf(e.code)) {
                case 0:
                    clickerLeftButtonRef.current?.click();
                    break;
                case 1:
                    clickerRightButtonRef.current?.click();
                    break;
                case 2:
                    clickerUpButtonRef.current?.click();
                    break;
                case 3:
                    clickerDownButtonRef.current?.click();
                    break;
            }
        }
    }

    const handleKeyHoldEvent = (e: any) => {

        let clickerCodes = [
            props.leftButtonKeyCode,
            props.rightButtonKeyCode,
            props.upButtonKeyCode,
            props.downButtonKeyCode,
        ];

        if (e.code && clickerCodes.indexOf(e.code) > -1) {
            e.stopPropagation();
            e.preventDefault();
            switch (clickerCodes.indexOf(e.code)) {
                case 0:
                    clickerLeftHoldButtonRef.current?.click();
                    break;
                case 1:
                    clickerRightHoldButtonRef.current?.click();
                    break;
                case 2:
                    clickerUpHoldButtonRef.current?.click();
                    break;
                case 3:
                    clickerDownHoldButtonRef.current?.click();
                    break;
            }
        }
    }

    useKeyPress(
        () => handleKeyDownEvent(),
        (e: KeyboardEvent) => handleKeyUpEvent(e),
        (e: KeyboardEvent) => handleKeyHoldEvent(e),
        {
            longpressDelay: props.longpressTimeout,
            ignoreTypingDelay: props.ignoreTypingDelay,
            suppressKeyDefaults: props.suppressKeyDefaults,
        }
    );

    return <div className="remote-clicker grid">
        <div className="col-6">
            <div className="clickerLeftButton" ref={clickerLeftButtonRef} onClick={() => props.onClick(ClickerButton.leftButton)}></div>
            <div className="clickerRightButton" ref={clickerRightButtonRef} onClick={() => props.onClick(ClickerButton.rightButton)}></div>
            <div className="clickerUpButton" ref={clickerUpButtonRef} onClick={() => props.onClick(ClickerButton.upButton)}></div>
            <div className="clickerDownButton" ref={clickerDownButtonRef} onClick={() => props.onClick(ClickerButton.downButton)}></div>
        </div>
        <div className="col-6">
            <div className="clickerLeftHoldButton" ref={clickerLeftHoldButtonRef} onClick={() => props.onLongPress(ClickerButton.leftButton)}></div>
            <div className="clickerRightHoldButton" ref={clickerRightHoldButtonRef} onClick={() => props.onLongPress(ClickerButton.rightButton)}></div>
            <div className="clickerUpHoldButton" ref={clickerUpHoldButtonRef} onClick={() => props.onLongPress(ClickerButton.upButton)}></div>
            <div className="clickerDownHoldButton" ref={clickerDownHoldButtonRef} onClick={() => props.onLongPress(ClickerButton.downButton)}></div>
        </div>
    </div>

}

export default RemoteClicker;
