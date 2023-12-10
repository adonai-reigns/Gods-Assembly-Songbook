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
        },
        {
            label: 'About',
            icon: 'pi pi-info-circle',
            items: [
                {
                    label: 'Attributions',
                    icon: 'pi pi-link',
                    url: '/attributions'
                }
            ]
        },
        {
            label: 'Config',
            icon: 'pi pi-cog',
            items: [
                {
                    label: 'Audience Screen',
                    icon: 'pi pi-link',
                    url: '/admin/audience-screen-config'
                }
            ]
        }
    ];

    return <div className="admin-header">
        <Menubar model={menuItems} end={props.end ?? <Logo />} />
    </div>

}

export default AdminHeader;
