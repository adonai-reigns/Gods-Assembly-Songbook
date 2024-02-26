

import GasLayout from "../layouts/GasLayout";

import { Card } from "primereact/card";

import "./Attributions.scss";
import React, { ReactElement } from "react";

interface AttributionInterface {
    name: string;
    role: string;
    previewUrl: string | ReactElement;
    previewAlt: string;
    downloadUrl: string;
    authorName: string;
    authorUrl: string;
    publisherName: string;
    publisherUrl: string;
    licenseName: string;
    licenseUrl: string;
}
/*
const attributionTemplate = {
    name: "",
    role: "",
    previewUrl: "",
    previewAlt: "",
    downloadUrl: "",
    authorName: "",
    authorUrl: "",
    publisherName: "",
    publisherUrl: "",
    licenseName: "",
    licenseUrl: "",
};
*/

const Attributions = () => {

    const attributions = [
        {
            name: "Emptyer projection screen isolated on white background",
            role: "Projector Screen",
            previewUrl:
                "/images/vecteezy_empty-projection-screen-vector-design-illustration-isolated-on-white-background_1214033/projection_screen.jpg",
            previewAlt: "Picture of a Projector Screen",
            downloadUrl:
                "https://www.vecteezy.com/vector-art/1214033-empty-projection-screen-isolated-on-white-background",
            authorName: "Timplaru Emil",
            authorUrl: "https://www.vecteezy.com/members/emiltimplaru",
            publisherName: "Vecteezy.com",
            publisherUrl: "https://www.vecteezy.com/free-vector/screen",
            licenseName: "License",
            licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
        },
        {
            name: "Music notes rainbow colourful on white background",
            role: "Song",
            previewUrl:
                "/images/vecteezy_music-notes-rainbow-colourful-on-white-background_7206554_442/vecteezy_music-notes-rainbow-colourful-on-white-background_7206554-transparent.svg",
            previewAlt: "Picture of Musical Notation",
            downloadUrl:
                "https://www.vecteezy.com/vector-art/7206554-music-notes-rainbow-colourful-on-white-background",
            authorName: "Matt Cole",
            authorUrl: "https://www.vecteezy.com/members/graphicsrf",
            publisherName: "Vecteezy.com",
            publisherUrl: "https://www.vecteezy.com/free-vector/music-notes",
            licenseName: "License",
            licenseUrl:
                "/images/vecteezy_music-notes-rainbow-colourful-on-white-background_7206554_442/Vecteezy-License-Information.pdf",
        },
        {
            name: "Round frame with children coloring the world",
            role: "Legacy Browser",
            previewUrl: "/images/vecteezy_round-frame-with-children-coloring-the-world_7159860_956/vecteezy_round-frame-with-children-coloring-the-world_7159860.jpg",
            previewAlt: "Picture of children painting a picture of the world",
            downloadUrl: "https://www.vecteezy.com/vector-art/7159860-round-frame-with-children-coloring-the-world",
            authorName: "Dualoro Rua",
            authorUrl: "https://www.vecteezy.com/members/dualororua-victory2022734341",
            publisherName: "Vecteezy.com",
            publisherUrl: "https://www.vecteezy.com/free-vector/earth-artist-painter",
            licenseName: "License",
            licenseUrl: "/images/vecteezy_round-frame-with-children-coloring-the-world_7159860_956/Vecteezy-License-Information.pdf",
        },
        {
            name: "Full screen Vector Icon Design",
            role: "Screen Mode",
            previewUrl:
                "/images/vecteezy_full-screen-vector-icon-design_25964485_482/vecteezy_full-screen-vector-icon-design_25964485.jpg",
            previewAlt: "Picture of a movie in full-view",
            downloadUrl:
                "https://www.vecteezy.com/vector-art/25964485-full-screen-vector-icon-design",
            authorName: "Muhammad Usman",
            authorUrl: "https://www.vecteezy.com/members/usmanabce",
            publisherName: "Vecteezy.com",
            publisherUrl:
                "https://www.vecteezy.com/free-vector/landscape-device-orientation",
            licenseName: "License",
            licenseUrl:
                "/images/vecteezy_full-screen-vector-icon-design_25964485_482/Vecteezy-License-Information.pdf",
        },
        {
            name: "Butterfly Animation",
            role: "Loading",
            previewUrl: <div style={{
                width: "100%",
                height: "100%"
            }}>
                <iframe style={{
                    width: "200%",
                    height: "150%",
                    transform: "scale(0.5)",
                    transformOrigin: "0 0"
                }} src="/images/CodePen-ButterflyAnimation/preview.html" width="100%" height="100%" scrolling="no" />
            </div>,
            previewAlt: "A butterfly flying",
            downloadUrl: "https://codepen.io/v42/pen/nKJWKo",
            authorName: "Vitor Carlos",
            authorUrl: "https://codepen.io/v42",
            publisherName: "CodePen",
            publisherUrl: "https://codepen.io/",
            licenseName: "MIT",
            licenseUrl: "/images/CodePen-ButterflyAnimation/license.html",
        },
        {
            name: "Clouds and Birds",
            role: "Background",
            previewUrl: "/images/FreeVector-Clouds-And-Birds/FreeVector-Clouds-And-Birds.jpg",
            previewAlt: "Website Background",
            downloadUrl: "https://www.freevector.com/clouds-and-birds/",
            authorName: "Akira",
            authorUrl: "https://www.freevector.com/",
            publisherName: "FreeVector.com",
            publisherUrl: "https://www.freevector.com/clouds-and-birds/",
            licenseName: "Creative Commons Attribution-NonCommercial 4.0",
            licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
        },
        {
            name: "Camera line icon. Studio camera for photographer outline symbol. Vector isolated on white.",
            role: "Photo Icon",
            previewUrl: "/public/images/vecteezy_camera-line-icon-studio-camera-for-photographer-outline_3567606_837/vecteezy_camera-line-icon-studio-camera-for-photographer-outline_3567606.jpg",
            previewAlt: "Photo Icon",
            downloadUrl: "https://www.vecteezy.com/vector-art/3567606-camera-line-icon-studio-camera-for-photographer-outline-symbol-vector-isolated-on-white",
            authorName: " sandi andriyanto",
            authorUrl: "https://www.vecteezy.com/members/sandzc",
            publisherName: "Vecteezy",
            publisherUrl: "https://www.vecteezy.com/free-vector/camera",
            licenseName: "License",
            licenseUrl: "/public/images/vecteezy_camera-line-icon-studio-camera-for-photographer-outline_3567606_837/Vecteezy-License-Information.pdf",
        },
        {
            name: "Vector Set Of Photo Negatives",
            role: "Film Slide",
            previewUrl: "/images/vecteezy_photo-negative-illustration-vector-elements_171597/vector-set-of-photo-negatives.jpg",
            previewAlt: "Film Slide",
            downloadUrl: "https://www.vecteezy.com/vector-art/171597-vector-set-of-photo-negatives",
            authorName: "happymeluv",
            authorUrl: "https://www.vecteezy.com/members/happymeluv",
            publisherName: "Vecteezy",
            publisherUrl: "https://www.vecteezy.com/free-vector/film-projector",
            licenseName: "License",
            licenseUrl: "/images/vecteezy_photo-negative-illustration-vector-elements_171597/Vecteezy-License-Information.pdf",
        },
        {
            name: "Set of butterflies of different shapes",
            role: "Butterfly Icon",
            previewUrl: "/images/vecteezy_set-of-butterflies-of-different-shapes_7783387_243/vecteezy_set-of-butterflies-of-different-shapes_7783387.jpg",
            previewAlt: "Butterfly Icon",
            downloadUrl: "https://www.vecteezy.com/vector-art/7783387-set-of-butterflies-of-different-shapes",
            authorName: "Svitlana Panteley",
            authorUrl: "https://www.vecteezy.com/members/plarisa110946753",
            publisherName: "Vecteezy",
            publisherUrl: "https://www.vecteezy.com/free-vector/butterfly",
            licenseName: "License",
            licenseUrl: "/images/vecteezy_set-of-butterflies-of-different-shapes_7783387_243/Vecteezy-License-Information.pdf",
        },
        {
            name: "A boy with three cute sheep on white background",
            role: "404 Page",
            previewUrl: "/images/vecteezy_a-boy-with-three-cute-sheep-on-white-background-illustration_1424929/1o34_b837_200914.jpg",
            previewAlt: "404 Page",
            downloadUrl: "https://www.vecteezy.com/vector-art/1424929-a-boy-with-three-cute-sheep-on-white-background",
            authorName: "Matt Cole",
            authorUrl: "https://www.vecteezy.com/members/graphicsrf",
            publisherName: "Vecteezy",
            publisherUrl: "https://www.vecteezy.com/free-vector/shepherd",
            licenseName: "License",
            licenseUrl: "/images/vecteezy_a-boy-with-three-cute-sheep-on-white-background-illustration_1424929/Vecteezy-License-Information.pdf",
        },
        {
            name: "Wireless device connetion flat style illustration",
            role: "Editor's Button",
            previewUrl: "/images/vecteezy_wireless-device-connetion-flat-style-illustration-vector-design_8608300_677/vecteezy_wireless-device-connetion-flat-style-illustration-vector-design_8608300.jpg",
            previewAlt: "Editor's Button",
            downloadUrl: "https://www.vecteezy.com/vector-art/8608300-wireless-device-connetion-flat-style-illustration-vector-design",
            authorName: "Taufiq Anwar",
            authorUrl: "https://www.vecteezy.com/members/taufiqanwar",
            publisherName: "Vecteezy",
            publisherUrl: "https://www.vecteezy.com/free-vector/editor",
            licenseName: "License",
            licenseUrl: "/images/vecteezy_wireless-device-connetion-flat-style-illustration-vector-design_8608300_677/Vecteezy-License-Information.pdf",
        },
        {
            name: "Projector Vector Icon",
            role: "Audience",
            previewUrl: "/images/vecteezy_projector-vector-icon-sign-icon-vector-illustration-for-personal-and-commercial-use-clean-look-trendy-icon_349492/Electronic_Devices_(171).jpg",
            previewAlt: "Audience's Button",
            downloadUrl: "https://www.vecteezy.com/vector-art/349492-projector-vector-icon",
            authorName: "Muhammad Khaleeq",
            authorUrl: "https://www.vecteezy.com/members/iyikon",
            publisherName: "Vecteezy",
            publisherUrl: "https://www.vecteezy.com/free-vector/projector",
            licenseName: "License",
            licenseUrl: "/images/vecteezy_projector-vector-icon-sign-icon-vector-illustration-for-personal-and-commercial-use-clean-look-trendy-icon_349492/Vecteezy-License-Information.pdf",
        },
        {
            name: "Woman singing on white background",
            role: "Songleader",
            previewUrl: "/images/vecteezy_woman-singing-on-white-background-illustration_420208/zkzo_vw7h_171123.jpg",
            previewAlt: "Songleader's Button",
            downloadUrl: "https://www.vecteezy.com/vector-art/420208-woman-singing-on-white-background",
            authorName: "Matt Cole",
            authorUrl: "https://www.vecteezy.com/members/graphicsrf",
            publisherName: "Vecteezy",
            publisherUrl: "https://www.vecteezy.com/free-vector/singer",
            licenseName: "License",
            licenseUrl: "/images/vecteezy_woman-singing-on-white-background-illustration_420208/Vecteezy-License-Information.pdf",
        },
        {
            name: "Hand holding pen and clipboard with plan checklist",
            role: "Plan Button",
            previewUrl: "/images/vecteezy_hand-holding-pen-and-clipboard-with-plan-checklist-flat-design-vector-with-space-for-use-as-poster-or-banner_464142/handillus_27.jpg",
            previewAlt: "Plan Button",
            downloadUrl: "https://www.vecteezy.com/vector-art/464142-hand-holding-pen-and-clipboard-with-plan-checklist",
            authorName: "Amonrat Rungreangfangsai",
            authorUrl: "https://www.vecteezy.com/members/amy1313",
            publisherName: "Vecteezy",
            publisherUrl: "https://www.vecteezy.com/free-vector/plan",
            licenseName: "License",
            licenseUrl: "/images/vecteezy_hand-holding-pen-and-clipboard-with-plan-checklist-flat-design-vector-with-space-for-use-as-poster-or-banner_464142/Vecteezy-License-Information.pdf",
        },
        {
            name: "Paper Business Contract Pen Signature vector icon",
            role: "Lyrics Button",
            previewUrl: "/images/vecteezy_paper-business-contract-pen-signature-vector-icon_546602/contracts_002.jpg",
            previewAlt: "Lyrics Button",
            downloadUrl: "https://www.vecteezy.com/vector-art/546602-paper-business-contract-pen-signature-vector-icon",
            authorName: "Brian Goff",
            authorUrl: "https://www.vecteezy.com/members/goff-brian",
            publisherName: "Vecteezy",
            publisherUrl: "https://www.vecteezy.com/free-vector/pen-and-paper",
            licenseName: "License",
            licenseUrl: "/images/vecteezy_paper-business-contract-pen-signature-vector-icon_546602/Vecteezy-License-Information.pdf",
        },
        {
            name: "Children playing various music instrument illustration",
            role: "Sing Button",
            previewUrl: "/images/vecteezy_children-playing-various-music-instrument-illustration_2268105/children_playing_music_and_instrument_generated.jpg",
            previewAlt: "Sing Button",
            downloadUrl: "https://www.vecteezy.com/vector-art/2268105-children-playing-various-music-instrument-illustration",
            authorName: "Irfan Muhammad Ghani",
            authorUrl: "https://www.vecteezy.com/members/imghani",
            publisherName: "Vecteezy",
            publisherUrl: "https://www.vecteezy.com/free-vector/conductor",
            licenseName: "License",
            licenseUrl: "/images/vecteezy_children-playing-various-music-instrument-illustration_2268105/Vecteezy-License-Information.pdf",
        },
        {
            name: "Painter with buckets of paint",
            role: "Design Button",
            previewUrl: "/images/vecteezy_painter-with-buckets-of-paint_7700604_871/vecteezy_painter-with-buckets-of-paint_7700604.jpg",
            previewAlt: "Design Button",
            downloadUrl: "https://www.vecteezy.com/vector-art/7700604-painter-with-buckets-of-paint",
            authorName: "Matt Cole",
            authorUrl: "https://www.vecteezy.com/members/graphicsrf",
            publisherName: "Vecteezy",
            publisherUrl: "https://www.vecteezy.com/free-vector/painter",
            licenseName: "License",
            licenseUrl: "/images/vecteezy_painter-with-buckets-of-paint_7700604_871/Vecteezy-License-Information.pdf",
        },
    ];

    return <GasLayout>
        <p className="xl:text-2xl">
            This project has been made possible by the generosity of artists giving
            away their work for free!
        </p>
        <p className="xl:text-2xl">
            The art is free for download at the following websites:
        </p>
        <div className="attributions grid">
            {
                attributions.map(
                    (attribution: AttributionInterface, attributionIndex: number) => (
                        <div key={attributionIndex} className="attribution col-12 md:col-6 lg:col-4 xl:col-3 my-3">
                            <Card
                                title={attribution.role}
                                className="h-full lg:flex lg:justify-content-between align-items-between"
                            >
                                <div className="attribution-image">
                                    {React.isValidElement(attribution.previewUrl)
                                        ? <>{attribution.previewUrl}</>
                                        : <>
                                            {`${attribution.previewUrl}`.match(/\.svg$/)
                                                ? <object className="img" data={`${attribution.previewUrl}`} type="image/svg+xml">
                                                    <img src="/favicon.ico" /></object>
                                                : <img
                                                    alt={attribution.previewAlt}
                                                    width="120"
                                                    height="120"
                                                    src={`${attribution.previewUrl}`} />
                                            }
                                        </>
                                    }
                                </div>

                                <div className="attribution-caption">
                                    <a href={attribution.downloadUrl}>
                                        {attribution.name}
                                    </a>
                                    by
                                    <a href={attribution.authorUrl}>
                                        {attribution.authorName}
                                    </a>
                                    at
                                    <a href={attribution.publisherUrl}>
                                        {attribution.publisherName}
                                    </a>
                                    . (<a href={attribution.licenseUrl}>License</a>)
                                </div>
                            </Card>
                        </div>
                    )
                )
            }
        </div>
    </GasLayout>
}

export default Attributions;
