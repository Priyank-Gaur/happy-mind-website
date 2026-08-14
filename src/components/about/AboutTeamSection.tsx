import { useState } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import amitRathiImage from "@/assets/team/1630081769-amit_rathi.png";
import raviKantImage from "@/assets/team/1630082349-ravi_kant.png";
import neerajTripathiImage from "@/assets/team/1630092178-neeraj_tripathi.png";

type TeamMember = {
  name: string;
  role: string;
  description: string;
  image: string;
  linkedin: string;
};

const teamMembers: TeamMember[] = [
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

/* Empty frames held for the rest of the team - swap a null for a TeamMember
   above as each person's photo and details come in. */
const PLACEHOLDER_COUNT = 12;
const INITIALLY_VISIBLE = 8;

const roster: (TeamMember | null)[] = [
  ...teamMembers,
  ...Array.from({ length: PLACEHOLDER_COUNT }, () => null),
];

const AboutTeamSection = () => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? roster : roster.slice(0, INITIALLY_VISIBLE);

  return (
    <section id="our-team" className="py-24 px-6 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            Our Team and Experts
          </h2>
          <span className="mt-4 block h-1 w-24 mx-auto rounded-full gradient-brand" />
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {visible.map((member, index) => (
            <div key={index} className="text-center group">
              {/* Photo Container */}
              <div className="relative mb-4 mx-auto w-32 h-32 md:w-40 md:h-40">
                {member ? (
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/30 transition-all duration-300">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-muted border-4 border-border flex items-center justify-center">
                    <User
                      className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground/40"
                      strokeWidth={1.5}
                    />
                  </div>
                )}
              </div>

              {/* Info */}
              {member && (
                <>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary text-sm font-medium mb-1">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {member.description}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* See more / less */}
        {roster.length > INITIALLY_VISIBLE && (
          <div className="mt-14 text-center">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "See Less" : "See More"}
            </Button>
          </div>
        )}

      </div>
    </section>
  );
};

export default AboutTeamSection;
