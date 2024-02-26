import { Button } from './Button';

interface PropsInterface {
    className?: string,
    children?: any,
    icon?: string,
    hidden?: boolean,
    onClick?: CallableFunction
}

const propsDefaults = {
    className: '',
    hidden: false
}

export const FormSubmit = function (props: PropsInterface) {
    props = { ...propsDefaults, ...props };
    return <div className="field m-3 p-inputgroup flex justify-content-center">
        <Button onClick={props.onClick}>
            {props.children ? props.children : 'Save Changes'}
            {props.icon && <i className={`${props.icon} ml-3`}></i>}
        </Button>
    </div>
}

