import { Button as PrimereactButton } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

interface propsInterface {
    className?: string;
    title?: string;
    children: any;
    onClick?: CallableFunction;
    severity?: ButtonSeverity;
    url?: string;
}

export enum ButtonSeverity {
    secondary = 'secondary',
    success = 'success',
    info = 'info',
    warning = 'warning',
    danger = 'danger',
    help = 'help'
}

const propsDefaults = {
    className: '',
    title: undefined,
}

export const Button = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const navigate = useNavigate();

    const onClick = (e: any) => {
        if (props.onClick) {
            if (props.url) {
                e.preventDefault();
            }
            props.onClick(e);
        } else {
            if (props.url) {
                e.preventDefault();
                navigate(props.url);
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

