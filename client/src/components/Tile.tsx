import { ReactElement, MouseEventHandler } from "react";
import "./Tile.scss";

export interface propsInterface {
    className?: string;
    title?: string;
    index?: number;
    children: any;
    onClick: MouseEventHandler<HTMLDivElement>;
    noDragHandle?: boolean;
    header?: string | ReactElement;
    headerIconRight?: boolean;
}

export const propsDefaults = {
    className: '',
    title: undefined,
    noDragHandle: false
}

const Header = function (props: any) {
    return <div className={`z-2 tile-header ${(props.headerIconRight ? 'tile-header-icon-right' : 'tile-header-icon-left')}`}><span>{props.children}</span></div>
}

const Tile = function (props: propsInterface) {
    props = { ...propsDefaults, ...props };

    return <div title={props.title} className={`tile ${props.className} ${!props.noDragHandle && 'draggable'}`} onClick={typeof props.onClick === 'function' ? (props.onClick as MouseEventHandler) : undefined}>
        {props.header && <Header {...props}>{props.header}</Header>}
        {!props.noDragHandle && <div className="z-1 drag-handle"></div>}
        {(typeof props.index === 'number') && <div className="index">{(props.index + 1)}</div>}
        {props.children}
    </div>

}

export default Tile;
