import { Helmet } from 'react-helmet-async';

import AdminHeader from "../components/AdminHeader";

import "primeicons/primeicons.css";
import "/node_modules/primeflex/primeflex.css";
import "/node_modules/primeflex/themes/primeone-dark.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";

import "../styles/gas.scss";
import './AdminLayout.scss';

const AdminLayout = (props: any) => {

    return (<>

        <Helmet>
            <meta charSet="utf-8" />
            <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
            <meta name="viewport" content="width=device-width" />
            <meta name="viewport" content="initial-scale=1" />
            <meta name="generator" content={`Typed by a Real Person!`} />
            <title>God's Assembly Songbook</title>
        </Helmet>

        <div className="m-3 text-left">
            <AdminHeader />
            {props.children}
            <div className="promotional-footer">
                <p>
                    &copy; God's Assembly Songbook - free software for church worship
                    - available at <a href="https://github.com/adonai-reigns/Gods-Assembly-Songbook/">www.github.com</a>
                </p>
            </div>
        </div>

    </>)
}

export default AdminLayout;