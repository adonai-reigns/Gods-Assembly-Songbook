import ConfirmButton from './ConfirmButton';
import { ButtonSeverity } from './Button';

export interface propsInterface {
    className?: string;
    title?: string;
    children?: any;
    onClick?: CallableFunction;
    severity?: ButtonSeverity;
    url?: string;
    ask: string
}

export const propsDefaults = {
    className: '',
    title: undefined,
    severity: ButtonSeverity.danger,
}

const DeleteButton = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    return <ConfirmButton {...props}>
        {(props.children
            ? <>{props.children} <i className="pi pi-trash ml-3"></i></>
            : <i className="pi pi-trash"></i>
        )}
    </ConfirmButton>
}

export default DeleteButton;
