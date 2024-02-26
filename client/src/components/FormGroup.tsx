import { useState } from "react";
import { isFunction, uniqueId } from 'lodash';

import classNames from "classnames";

import { Checkbox } from "primereact/checkbox"
import { Tooltip } from "primereact/tooltip";

import "./FormGroup.scss";

interface PropsInterface {
    className?: string,
    label: string,
    hideLabel?: boolean,
    children: any,
    icon?: string,
    toggle?: TogglePropsInterface,
    action?: ActionPropsInterface,
    info?: InfoPropsInterface,
    infoContent?: string,
    nonWrapped?: boolean,
    hidden?: boolean,
}

interface ActionPropsInterface {
    className?: string,
    icon?: string,
    onClick?: CallableFunction,
    title?: string
}

interface InfoPropsInterface {
    className?: string,
    content: string
}

interface TogglePropsInterface {
    toggle?: boolean,
    className?: string,
    checked?: boolean,
    onChange?: CallableFunction
}

const propsDefaults = {
    className: '',
    nonWrapped: false,
    hidden: false
}

const Contents = function (props: PropsInterface) {
    props = { ...propsDefaults, ...props };
    return <>
        {props.label && !props.hideLabel && <label className={`p-label p-inputgroup-addon`}>{props.label}</label>}
        {props.icon && <span className={`p-inputgroup-addon`}>
            <i className={`pi ${props.icon}`} title={props.label}></i>
        </span>}
        {props.children}
        {props.info && <Info {...props.info} />}
        {props.action && <Action {...props.action} />}
        {props.toggle && <Toggle {...props.toggle} />}
    </>
}

const Wrap = function (props: PropsInterface) {
    props = { ...propsDefaults, ...props };
    return <div className={classNames(props.hidden ? 'hidden opacity-0 height-0 width-0' : classNames(`field p-inputgroup flex-1`, props.className))}>
        {props.children}
    </div>
}

const Toggle = function (props: TogglePropsInterface) {

    const [isChecked, setIsChecked] = useState((props.checked ? true : false));

    return <span className={`p-inputgroup-addon ${props.className}`}>
        <Checkbox checked={isChecked} onChange={e => {
            if (isFunction(props.onChange)) {
                props.onChange(e.checked);
            }
            setIsChecked(e.checked ?? false);
        }} />
    </span>
}

const Info = function (props: InfoPropsInterface) {
    const classNameHash = uniqueId('infoTooltip_');
    return <>
        <Tooltip target={`.${classNameHash}`} />
        <span className={`p-inputgroup-addon ${props.className}`}>
            <i className={`pi pi-info-circle field-info ${classNameHash}`}
                data-pr-tooltip={props.content}
                style={{ cursor: 'pointer' }}
            />
        </span>
    </>
}

const Action = function (props: ActionPropsInterface) {
    return <span className={`p-inputgroup-addon ${props.className}`}>
        <i className={`${props.icon} cursor-pointer`} title={props.title ?? ''} onClick={e => {
            if (isFunction(props.onClick)) {
                props.onClick(e);
            }
        }} />
    </span>
}

export const FormGroup = function (props: PropsInterface) {
    props = { ...propsDefaults, ...props };
    if (props.infoContent) {
        props.info = { ...props.info ?? {}, content: props.infoContent };
    }
    return <>
        {props.nonWrapped
            ? <Contents {...props} />
            : <Wrap {...props}><Contents {...props} /></Wrap>
        }
    </>
}
