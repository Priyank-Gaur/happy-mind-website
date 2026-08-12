import { Linkedin } from "lucide-react";
import amitRathiImage from "@/assets/team/1630081769-amit_rathi.png";
import raviKantImage from "@/assets/team/1630082349-ravi_kant.png";
import neerajTripathiImage from "@/assets/team/1630092178-neeraj_tripathi.png";

const teamMembers = [
  {
    name: "Amit Rathi",
    role: "Founder",
    description:
      "CXO Leader | 2.5 Decades Exp. | IIM Alumni | Conscious Leadership Coach",
    image: amitRathiImage,
    linkedin: "#",
  },
  {
    name: "Ravi Kant Suman",
    role: "Co-Founder",
    description: "2.5 Decades Exp. | L&D Professional",
    image: raviKantImage,
    linkedin: "#",
  },
  {
    name: "Dr. Neeraj Tripathi",
    role: "Co-Founder",
    description:
      "U.K. Based Senior Psychiatrist | 20 Yrs. Exp. | Global Research Expert",
    image: neerajTripathiImage,
    linkedin: "#",
  },
];

const AboutTeamSection = () => {
  return (
    <section id="our-team" className="py-24 px-6 lg:px-16 bg-card">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            Our Team
          </h2>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center group">
              {/* Photo Container */}
              <div className="relative mb-4 mx-auto w-32 h-32 md:w-40 md:h-40">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* LinkedIn Button
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
                >
                  <Linkedin className="w-5 h-5 text-primary-foreground" />
                </a>*/}
              </div>

              {/* Info */}
              <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                {member.name}
              </h3>
              <p className="text-primary text-sm font-medium mb-1">
                {member.role}
              </p>
              <p className="text-muted-foreground text-sm">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutTeamSection;
