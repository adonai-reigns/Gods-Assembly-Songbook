import { useNavigate } from "react-router-dom";
import { getInnerLink, redirectOnClick } from "../App";

import GasLayout from "../layouts/GasLayout";

import "../styles/variables.scss";

const Index = () => {

    const navigate = useNavigate();

    return (<GasLayout>

        <p className="subtitle">What is your role in the assembly today?</p>
        <div className="screens grid justify-content-evenly">
            <div className="screen songleader col-12 md:col-3 my-3 lg:flex lg:flex-column-reverse"
                onClick={(e) => redirectOnClick(getInnerLink(e), navigate, {})}>
                <h2 className="m-0 md:mb-3 p-0 lg:mt-5 lg:mb-0">
                    <a href="/songleader">Leaders</a>
                </h2>
                <div className="text-center">
                    <img
                        className="w-10 ls:w-12"
                        src="images/vecteezy_woman-singing-on-white-background-illustration_420208/zkzo_vw7h_171123-cropped-scaled.jpg"
                        alt="Picture of a lady singing"
                    />
                </div>
            </div>
            <div className="screen projector col-12 md:col-3 my-3 lg:flex lg:flex-column-reverse text-center"
                onClick={(e) => redirectOnClick(getInnerLink(e), navigate, {})}>
                <h2 className="m-0 md:mb-3 p-0 lg:mt-5 lg:mb-0">
                    <a href="/audience">Audience</a>
                </h2>
                <div className="text-center">
                    <img
                        className="w-10 ls:w-12"
                        src="images/vecteezy_projector-vector-icon-sign-icon-vector-illustration-for-personal-and-commercial-use-clean-look-trendy-icon_349492/Electronic_Devices_(171)-scaled.jpg"
                        alt="Picture of an image projector"
                    />
                </div>
            </div>
            <div className="screen editor col-12 md:col-3 my-3 lg:flex lg:flex-column-reverse text-center"
                onClick={(e) => redirectOnClick(getInnerLink(e), navigate, {})}>
                <h2 className="m-0 md:mb-3 p-0 lg:mt-5 lg:mb-0">
                    <a href="/admin/songs">Administration</a>
                </h2>
                <div className="text-center">
                    <img
                        className="w-10 ls:w-12"
                        src="images/vecteezy_wireless-device-connetion-flat-style-illustration-vector-design_8608300_677/vecteezy_wireless-device-connetion-flat-style-illustration-vector-design_8608300-scaled.jpg"
                        alt="Picture of a person with electronic devices"
                    />
                </div>
            </div>
        </div>
    </GasLayout>)

}

export default Index;

