import { Button as PrimereactButton } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

export interface propsInterface {
    className?: string;
    title?: string;
    children: any;
    onClick?: CallableFunction;
    severity?: "secondary" | "success" | "info" | "warning" | "danger" | "help" | undefined;
    url?: string;
}

export const propsDefaults = {
    className: '',
    title: undefined,
}

const Button = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const navigate = useNavigate();

    const onClick = (e: any) => {
        if(props.onClick){
            if(props.url){
                e.preventDefault();
            }
            props.onClick(e);
        }else{
            if(props.url){
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

export default Button;
