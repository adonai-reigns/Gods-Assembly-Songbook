import { Route, NavigateFunction, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';

import './App.scss'

import NotFound from './pages/Page404';
import Index from './pages/Index';
import Attributions from './pages/Attributions';
import Songleader from './pages/songleader';
import AudienceScreenConfig from './pages/admin/audience-screen-config';
import SongleaderSong from './pages/songleader/song';
import SongleaderSongs from './pages/songleader/songs';
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
                <Route path="plan/:playlistId?" element={<Plan />} />
                <Route path="song/:id?" element={<SongleaderSong />} />
                <Route path="songs" element={<SongleaderSongs />} />
                <Route path="sing/:playlistId?" element={<Sing />} />
            </Route>
            <Route path="admin">
                <Route path="audience-screen-config" element={<AudienceScreenConfig />} />
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

