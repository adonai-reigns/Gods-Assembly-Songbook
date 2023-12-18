import { Route, NavigateFunction, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';

import './App.scss'

import NotFound from './pages/Page404';
import Index from './pages/Index';
import Attributions from './pages/Attributions';
import Songleader from './pages/songleader';
import AudienceScreenConfig from './pages/admin/audience-screen-config';
import Song from './pages/admin/song';
import Songs from './pages/admin/songs';
import Plan from './pages/songleader/plan';
import Sing from './pages/songleader/sing';
import Audience from './pages/Audience';

export default function App() {

    const router = createBrowserRouter(
        createRoutesFromElements(<>

            <Route index element={<Index />} />
            <Route path="attributions" element={<Attributions />} />
            <Route path="songleader">
                <Route path="" element={<Songleader />} />
                <Route path="plan" element={<Plan />} />
                <Route path="sing" element={<Sing />} />
            </Route>
            <Route path="admin">
                <Route path="audience-screen-config" element={<AudienceScreenConfig />} />
                <Route path="song/:id?" element={<Song />} />
                <Route path="songs" element={<Songs />} />
            </Route>
            <Route path="audience" element={<Audience />} />
            <Route path="*" element={<NotFound />}></Route>

        </>
        )
    )

    return (
        <RouterProvider router={router} />
    )

}

export const getInnerLink = function (e: any): string {
    if (e && e.currentTarget) {
        const a = e.currentTarget.querySelector("a");
        if (a) {
            const url = a.getAttribute("href");
            if (url) {
                return url;
            }
        }
    }
    return '/';
}

export const redirectOnClick = function (url: string, navigate: NavigateFunction, options: any) {
    options = options || {};
    navigate(url, options);
}
