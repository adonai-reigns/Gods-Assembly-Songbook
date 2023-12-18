import { ReactElement, MouseEventHandler } from "react";
import "./Tile.scss";

export interface propsInterface {
    className?: string;
    title?: string;
    index?: number;
    children: any;
    onClick: MouseEventHandler<HTMLDivElement>;
    noDragHandle?: boolean;
    headerIcon?: string | ReactElement;
}

export const propsDefaults = {
    className: '',
    title: undefined,
    noDragHandle: false
}

const HeaderIcon = function (props: any) {
    return <div className="z-2 tile-header-icon"><span>{props.children}</span></div>
}

const Tile = function (props: propsInterface) {
    props = { ...propsDefaults, ...props };

    return <div title={props.title} className={`tile ${props.className} ${!props.noDragHandle && 'draggable'}`} onClick={typeof props.onClick === 'function' ? (props.onClick as MouseEventHandler) : undefined}>
        {props.headerIcon && <HeaderIcon>{props.headerIcon}</HeaderIcon>}
        {!props.noDragHandle && <div className="z-1 drag-handle"></div>}
        {(typeof props.index === 'number') && <div className="index">{(props.index + 1)}</div>}
        {props.children}
    </div>

}

export default Tile;
