import { SimpleTemplate } from "../../components/templates/SimpleTemplate/SimpleTemplate";
import { Faculty } from "../../utils/types/Faculty";
import { useState, useEffect } from "react";
import "./Faculties.scss";

export function Faculties() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);

  useEffect(() => {
    // This is where you would fetch the data from your backend
    // For now, we'll use placeholder data
    const placeholderFaculties = [
      {
        id: 1,
        name: "Faculty of Science",
        description: "Explore the world of science",
      },
      {
        id: 2,
        name: "Faculty of Arts",
        description: "Discover the world of arts",
      },
      {
        id: 3,
        name: "Faculty of Engineering",
        description: "Innovate with engineering",
      },
    ];
    setFaculties(placeholderFaculties);
  }, []);

  return (
    <SimpleTemplate>
      <div className="faculties-page">
        <div className="faculties-container">
          {faculties.map((faculty) => (
            <div key={faculty.id} className="faculty-card">
              <h3>{faculty.name}</h3>
              <p>{faculty.description}</p>
              <div className="faculty-footer">
                <button className="faculty-button">Learn More</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SimpleTemplate>
  );
}
