import { Button as PrimereactButton } from 'primereact/button';

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

    const onClick = (e) => {
        if(props.onClick){
            props.onClick(e);
        }else{
            if(props.url){
                e.preventDefault();
                window.location.href = props.url;
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
