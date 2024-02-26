
import { useNavigate } from "react-router-dom";
import { getInnerLink, redirectOnClick } from "../../App";

import GasLayout from "../../layouts/GasLayout";

const Songleader = () => {

    const navigate = useNavigate();

    return <GasLayout>

        <p className="subtitle">What is your service today?</p>
        <div className="screens grid justify-content-evenly">
            <div className="screen songleader col-12 md:col-3 my-3 lg:flex lg:flex-column-reverse"
                onClick={(e) => redirectOnClick(getInnerLink(e), navigate, {})}>
                <h2 className="m-0 md:mb-3 p-0 lg:mt-5 lg:mb-0">
                    <a href="/songleader/plan">Plan Playlists</a>
                </h2>
                <div className="text-center">
                    <img
                        className="w-10 ls:w-12"
                        src="/images/vecteezy_hand-holding-pen-and-clipboard-with-plan-checklist-flat-design-vector-with-space-for-use-as-poster-or-banner_464142/handillus_27-scaled.jpg"
                        alt="Picture of a Checklist"
                    />
                </div>
            </div>
            <div className="screen composer col-12 md:col-3 my-3 lg:flex lg:flex-column-reverse text-center"
                onClick={(e) => redirectOnClick(getInnerLink(e), navigate, {})}>
                <h2 className="m-0 md:mb-3 p-0 lg:mt-5 lg:mb-0">
                    <a href="/songleader/songs">Update Songs</a>
                </h2>
                <div className="text-center">
                    <img
                        className="w-10 ls:w-12"
                        src="/images/vecteezy_paper-business-contract-pen-signature-vector-icon_546602/contracts_002-scaled.jpg"
                        alt="Picture of a pen and a piece of paper"
                    />
                </div>
            </div>
            <div className="screen composer col-12 md:col-3 my-3 lg:flex lg:flex-column-reverse text-center"
                onClick={(e) => redirectOnClick(getInnerLink(e), navigate, {})}>
                <h2 className="m-0 md:mb-3 p-0 lg:mt-5 lg:mb-0">
                    <a href="/songleader/sing">Let's Sing!</a>
                </h2>
                <div className="text-center">
                    <img
                        className="w-10 ls:w-12"
                        src="/images/vecteezy_children-playing-various-music-instrument-illustration_2268105/children_playing_music_and_instrument_generated-scaled.jpg"
                        alt="Picture of three people singing with musical instruments"
                    />
                </div>
            </div>
        </div>

    </GasLayout>

}

export default Songleader;
