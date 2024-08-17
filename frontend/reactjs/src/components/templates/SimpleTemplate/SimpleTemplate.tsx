import { Navbar } from "../../molecules/Navbar/Navbar";
import { PropsWithChildren } from "react";

interface SimpleTemplateProps extends PropsWithChildren {}

export function SimpleTemplate(props: SimpleTemplateProps){
    return(
        <div>
            <Navbar />
        </div>
    )
}