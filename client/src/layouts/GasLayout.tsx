import { Helmet } from 'react-helmet-async';

import "../styles/gas.scss";
import "primeicons/primeicons.css";
import "/node_modules/primeflex/primeflex.css";
import "/node_modules/primeflex/themes/primeone-dark.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import './GasLayout.scss';
import { useNavigate } from 'react-router-dom';


const GasLayout = (props: any) => {

    const navigate = useNavigate();

    return (<>
        <Helmet>
            <meta charSet="utf-8" />
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <meta name="viewport" content="width=device-width" />
            <meta name="viewport" content="initial-scale=1" />
            <meta name="generator" content={`Typed by a Real Person!`} />
            <title>God's Assembly Songbook</title>
        </Helmet>
        <div className="m-3 text-left">
            <div className="promotional-header text-center" onClick={() => navigate("/")}>
                <h1>
                    <a href="/">God's Assembly <span className="breakpoint"></span>Songbook!</a>
                </h1>
            </div>
            {props.children}
            <div className="promotional-footer">
                <p>
                    &copy; God's Assembly Songbook - free software for church
                    worship - available at <a href="https://github.com/adonai-reigns/Gods-Assembly-Songbook/">www.github.com</a>
                </p>
            </div>
        </div>
    </>)

}

export default GasLayout;