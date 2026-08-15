import amitRathiImage from "@/assets/team/1630081769-amit_rathi.png";
import raviKantImage from "@/assets/team/1630082349-ravi_kant.png";
import neerajTripathiImage from "@/assets/team/1630092178-neeraj_tripathi.png";
import rajivPareenjaImage from "@/assets/team/rajiv-pareenja.png";
import kamleshSinghImage from "@/assets/team/kamlesh-singh.png";
import chandanaMImage from "@/assets/team/chandana-m.png";
import aparnaDasImage from "@/assets/team/aparna-das.png";

type TeamMember = {
  name: string;
  role: string;
  description: string;
  image: string;
  linkedin?: string;
};

const mainTeamMembers: TeamMember[] = [
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

const advisoryTeamMembers: TeamMember[] = [
  {
    name: "Dr. Rajiv Pareenja",
    role: "Global Practice Advisor",
    description:
      "20+ years, Sr. Consultant Psychiatrist, US Ex NHS, C level & Clinic",
    image: rajivPareenjaImage,
  },
  {
    name: "Dr. Kamlesh Singh",
    role: "Academic Advisor",
    description:
      "Ph.D. (Psychology), IIT Delhi | Secretary of National Positive Psychology Association (India)",
    image: kamleshSinghImage,
  },
  {
    name: "Chandana M.",
    role: "GTM & Marketing Leader",
    description:
      "Serial Entrepreneur | GTM & Marketing Leader | IMT Alumni | Ex-Airtel, ICICI, Tata Power",
    image: chandanaMImage,
  },
  {
    name: "Dr. Aparna Das",
    role: "Senior Psychologist",
    description:
      "Ph.D. (Psychology) | Winner Young Scientist Award",
    image: aparnaDasImage,
  },
];

const AboutTeamSection = () => {
  return (
    <section id="our-team" className="py-24 px-6 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            Our Team & Experts
          </h2>
          <span className="mt-4 block h-1 w-24 mx-auto rounded-full gradient-brand" />
        </div>

        {/* Subtitle: Founding Team */}
        <div className="text-center mb-10">
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
            Founding Team
          </h3>
          <span className="mt-3 block h-0.5 w-16 mx-auto rounded-full bg-primary/40" />
        </div>

        {/* First line: 3 Core Team Members */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto mb-20">
          {mainTeamMembers.map((member, index) => (
            <div key={index} className="text-center group">
              {/* Photo Container */}
              <div className="relative mb-4 mx-auto w-32 h-32 md:w-40 md:h-40">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/30 transition-all duration-300 shadow-sm">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
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

        {/* Subtitle: Advisory Team */}
        <div className="text-center mb-10">
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
            Advisory Team
          </h3>
          <span className="mt-3 block h-0.5 w-16 mx-auto rounded-full bg-primary/40" />
        </div>

        {/* 4 Advisory Team Members */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 max-w-5xl mx-auto">
          {advisoryTeamMembers.map((member, index) => (
            <div key={index} className="text-center group">
              {/* Photo Container */}
              <div className="relative mb-4 mx-auto w-28 h-28 md:w-36 md:h-36">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/30 transition-all duration-300 shadow-sm">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Info */}
              <h3 className="font-serif text-base md:text-lg font-semibold text-foreground mb-1">
                {member.name}
              </h3>
              <p className="text-primary text-xs md:text-sm font-medium mb-1.5">
                {member.role}
              </p>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
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
