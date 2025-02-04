import { Navbar } from "../../molecules/Navbar/Navbar";
import { PropsWithChildren } from "react";
import "./SimpleTemplate.scss";

interface SimpleTemplateProps extends PropsWithChildren {
  hideNavbar?: boolean;
}

export function SimpleTemplate({ children }: SimpleTemplateProps) {
  return (
    <div className="simple-template">
      <Navbar />
      <div className="content">
        {children}
      </div>
      <div className="footer">© UniRum</div>
    </div>
  );
}
