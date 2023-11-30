import "./Tile.scss";

export interface propsInterface {
    className?: string;
    title?: string;
    index?: number;
    children: any;
    onClick: CallableFunction;
    noDragHandle?: boolean;
}

export const propsDefaults = {
    className: '',
    title: undefined,
    noDragHandle: false
}

const Tile = function (props: propsInterface) {
    props = { ...propsDefaults, ...props };

    return <div title={props.title} className={`tile ${props.className}`} onClick={props.onClick ?? null}>
        {!props.noDragHandle && <div className="drag-handle"></div>}
        {(typeof props.index === 'number') && <div className="index">{(props.index + 1)}</div>}
        {props.children}
    </div>

}

export default Tile;