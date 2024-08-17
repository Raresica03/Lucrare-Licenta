import { Navbar } from "../../molecules/Navbar/Navbar";
import { PropsWithChildren } from "react";
import "./SimpleTemplate.scss";

interface SimpleTemplateProps extends PropsWithChildren {
  hideNavbar?: boolean; // Optional prop to hide the navbar
}

export function SimpleTemplate({ hideNavbar, children }: SimpleTemplateProps) {
  return (
    <div className="simple-template">
      {!hideNavbar && <Navbar />}
      <div className="content">
        {children} {/* Content from pages */}
      </div>
      <div className="footer">© 2024 My Awesome Project</div>
    </div>
  );
}
