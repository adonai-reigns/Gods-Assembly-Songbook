import { useNavigate } from 'react-router-dom';
import { Button as PrimereactButton } from 'primereact/button';
import { ButtonSeverity } from './Button';

export interface propsInterface {
    className?: string;
    title?: string;
    children: any;
    onClick?: CallableFunction;
    severity?: ButtonSeverity;
    url?: string;
    ask: string
}

export const propsDefaults = {
    className: '',
    title: undefined,
}

const ConfirmButton = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const navigate = useNavigate();

    const onClick = (e: any) => {
        e.preventDefault();
        if (confirm(props.ask)) {
            if (props.onClick) {
                props.onClick(e);
            } else {
                if (props.url) {
                    navigate(props.url);
                }
            }
        }
    }

    return <PrimereactButton severity={props.severity} className={props.className} onClick={onClick}>
        {props.url
            ? (
                <a href={props.url} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <span data-pc-section="label">
                        {props.children}
                    </span>
                </a>
            ) : (
                <>{props.children}</>
            )
        }
    </PrimereactButton>

}

export default ConfirmButton;
