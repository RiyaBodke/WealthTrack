import { LuDot } from "react-icons/lu"
import { RiCopyrightLine } from "react-icons/ri";

function Footer(){
    return(
        <div className=" bg-[#e0e4e9] p-3 rounded-lg flex items-center justify-between font-medium text-sm px-4">
            <div className="flex items-center">
                <RiCopyrightLine className="mr-2"/>
                <h6>2026</h6>
                <LuDot className="text-4xl"/>
                <h6>WealthTrack</h6>
                <LuDot className="text-4xl"/>
                <h6>Privacy</h6>
                <LuDot className="text-4xl"/>
                <h6>Terms</h6>
            </div>

            <div className="flex items-center justify-center">
                <h6>Showing 4 holdings</h6>
                <LuDot className="text-4xl"/>
                <h6>Last Updated : </h6>
                <h6> 2h ago</h6>
            </div>
        </div>
    )
}

export default Footer