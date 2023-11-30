import { Menubar } from "primereact/menubar";
import type { MenuItem } from "primereact/menuitem";

export interface propsInterface {
    end?: any;
}

export const defaultProps = {
    end: null
}

const Logo = function () {
    return <h1 className="m-3 text-lg"><a href="/" style={{ textDecoration: "none", color: "inherit" }}>God's Assembly Songbook!</a></h1>
}

const AdminHeader = function (props: propsInterface) {

    props = { ...defaultProps, ...props };

    const menuItems: MenuItem[] = [
        {
            label: 'Songs',
            icon: 'pi pi-fw pi-heart-fill',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-plus',
                    url: '/admin/song'
                },
                {
                    label: 'Manage',
                    icon: 'pi pi-fw pi-pencil',
                    url: '/admin/songs'
                },

            ]
        }
    ];

    return <div className="admin-header">
        <Menubar model={menuItems} end={props.end ?? <Logo />} />
    </div>

}

export default AdminHeader;
