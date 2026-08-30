import { useEffect, useRef, useState } from "react";
import { ChevronDown, User } from "lucide-react";
import { fetchPsychologists } from "@/v2/lib/website-api";
import amitRathiImage from "@/assets/team/1630081769-amit_rathi.png";
import raviKantImage from "@/assets/team/1630082349-ravi_kant.png";
import neerajTripathiImage from "@/assets/team/1630092178-neeraj_tripathi.png";
import rajivPareenjaImage from "@/assets/team/rajiv-pareenja.png";
import kamleshSinghImage from "@/assets/team/kamlesh-singh.png";
import chandanaMImage from "@/assets/team/chandana-m.png";
import aparnaDasImage from "@/assets/team/aparna-das.png";
import amitRathiCoachImage from "@/assets/team/amit-rathi-coach.jpg";
import induAnanthImage from "@/assets/team/indu-ananth.jpg";
import maheshwariJaniImage from "@/assets/team/maheshwari-jani.jpg";
import nidhiSharmaImage from "@/assets/team/nidhi-sharma.jpg";
import sanjeevBhatiaImage from "@/assets/team/sanjeev-bhatia.jpg";
import anumehaSinhaImage from "@/assets/team/anumeha-sinha.jpg";
import jayaAzadImage from "@/assets/team/jaya-azad.png";
import sangeetaJanardhanImage from "@/assets/team/sangeeta-janardhan.png";
import vidyalakshmiImage from "@/assets/team/vidyalakshmi.jpg";
import payelChakrabortyImage from "@/assets/team/payel-chakraborty.png";
import mayuraParanjpeImage from "@/assets/team/mayura-paranjpe.jpg";
import geetikaAroraImage from "@/assets/team/geetika-arora.png";
import harmeenDhillonImage from "@/assets/team/harmeen-dhillon.png";
import juhiPandeyImage from "@/assets/team/juhi-pandey.jpeg";
import vSubhashiniImage from "@/assets/team/v-subhashini.png";
import tavishiChaudharyImage from "@/assets/team/tavishi-chaudhary.jpeg";
import priyanshiGargImage from "@/assets/team/priyanshi-garg.jpeg";
import shraddhaYadavImage from "@/assets/team/shraddha-yadav.png";

type TeamMember = {
  name: string;
  role: string;
  description: string;
  image: string;
  linkedin?: string;
};

// Growth Coaches don't have photos yet — `image` stays empty and the
// circular frame falls back to a placeholder icon until one is added.
type GrowthCoach = Omit<TeamMember, "image" | "linkedin"> & { image?: string };

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

const growthCoaches: GrowthCoach[] = [
  {
    name: "Amit Rathi",
    role: "Leadership & Executive Coach",
    description:
      "Executive & Leadership Coaching | Enterprise Thinking | Conscious Growth Development | Role Transition Expert | Corporate Training | Emotional Intelligence",
    image: amitRathiCoachImage,
  },
  {
    name: "Jaya Azad",
    role: "Strategic HR & Leadership Coach",
    description:
      "Strategic HR Leadership | HR Transformation | Organization Design | Talent & Culture Strategy",
    image: jayaAzadImage,
  },
  {
    name: "Nidhi Sharma",
    role: "Emotional Intelligence & Executive Coach",
    description:
      "Executive Coaching | Extensive Industry Exposure | Group Coaching | Behavioral Support Program | Holistic Fitness Counselling",
    image: nidhiSharmaImage,
  },
  {
    name: "Sangeeta Janardhan",
    role: "Executive & Leadership Coach",
    description:
      "Executive & Leadership Coach | Mentor Coach | Mindfulness Practitioner",
    image: sangeetaJanardhanImage,
  },
  {
    name: "Indu Ananth",
    role: "Career & Executive Coach",
    description:
      "Career Development Coaching | Executive Coaching | Life Coaching | Leadership Development",
    image: induAnanthImage,
  },
  {
    name: "Maheshwari Jani",
    role: "Leadership & Executive Coach",
    description:
      "Assessment & Development Center | Executive Coaching | Leadership Journey | Behavioral Interventions | Development Journeys | Organization Effectiveness | Business Storytelling | Emotional Intelligence",
    image: maheshwariJaniImage,
  },
  {
    name: "Sanjeev Bhatia",
    role: "Leadership & Executive Coach",
    description:
      "Executive Coaching | Career Development Coaching | Change Management | Corporate Training | Leadership Development",
    image: sanjeevBhatiaImage,
  },
  {
    name: "Anumeha Sinha",
    role: "Leadership Development Coach",
    description:
      "Professional Development | Performance Enhancement | Leadership Development | Change Management | Team Building | Conflict Resolution | Culture Building",
    image: anumehaSinhaImage,
  },
];

// Leading Psychologists share the Growth Coaches shape: no photo yet,
// same placeholder fallback in the circular frame.
const leadingPsychologists: GrowthCoach[] = [
  {
    name: "Dr. Harmeen Dhillon",
    role: "Counselling Psychologist",
    description: "Stress | OCD | Marriage Counselling",
    image: harmeenDhillonImage,
  },
  {
    name: "Dr. Aparna Das",
    role: "Counselling Psychologist",
    description: "Ph.D. (Psychology) | Winner Young Scientist Award",
    image: aparnaDasImage,
  },
  {
    name: "Juhi Pandey",
    role: "Counselling Psychologist",
    description: "Stress & Anxiety | Depression | Relationship Issues",
    image: juhiPandeyImage,
  },
  {
    name: "Tavishi Chaudhary",
    role: "Counselling Psychologist",
    description: "Stress | Anxiety | Emotional Wellbeing",
    image: tavishiChaudharyImage,
  },
  {
    name: "Geetika Arora",
    role: "Clinical Psychologist",
    description:
      "Child & Adolescent | Anxiety & Depression | Stress Management",
    image: geetikaAroraImage,
  },
  {
    name: "Payel Chakraborty",
    role: "Clinical Psychologist",
    description:
      "Depression & Anxiety | Relationships | Behavioural Therapy",
    image: payelChakrabortyImage,
  },
  {
    name: "Mayura Paranjpe",
    role: "Clinical Psychologist",
    description: "Adolescent Counselling | Relationships | Stress Management",
    image: mayuraParanjpeImage,
  },
  {
    name: "V. Subhashini",
    role: "Counselling Psychologist",
    description: "Anxiety & Stress | Relationships | Trauma & Grief",
    image: vSubhashiniImage,
  },
  {
    name: "Vidyalakshmi",
    role: "Counselling Psychologist",
    description:
      "Trauma & Anxiety | Relationships | Emotional & Behavioural Issues",
    image: vidyalakshmiImage,
  },
];

// Full expert roster (name + role). Experts already featured under
// Leading Psychologists are excluded automatically below, so this list
// can be extended freely without creating duplicates.
const expertRoster: { name: string; role: string; image?: string }[] = [
  { name: "Sanika Dharaskar", role: "Clinical Psychologist" },
  { name: "Kiran Makhijani", role: "Clinical Psychologist" },
  { name: "Vidyalakshmi", role: "Counselling Psychologist" },
  { name: "Geetika Arora", role: "Clinical Psychologist" },
  { name: "Payel Chakraborty", role: "Clinical Psychologist" },
  { name: "Khyati Malik", role: "Clinical Psychologist" },
  { name: "Ketaki Gokhale", role: "Clinical Psychologist" },
  { name: "Sakshi Jain", role: "Clinical Psychologist" },
  { name: "Sukanya Biswas", role: "Clinical Psychologist" },
  { name: "Pooja Deoke", role: "Clinical Psychologist" },
  { name: "Bivek Pradhan", role: "Counselling Psychologist" },
  { name: "Sarah Ralte", role: "Clinical Psychologist" },
  { name: "Bhavika Mulani", role: "Counselling Psychologist" },
  { name: "Shaily Bhushan", role: "Counselling Psychologist" },
  { name: "Kusuma Harish", role: "Counselling Psychologist" },
  { name: "Jeena Girilal", role: "Clinical Psychologist" },
  { name: "Dr. Satnam Singh Deol", role: "Clinical Psychologist" },
  { name: "Rida E Noor", role: "Clinical Psychologist" },
  { name: "Nidhi Singh", role: "Clinical Psychologist" },
  { name: "Dr. Harmeen Dhillon", role: "Counselling Psychologist" },
  { name: "Mayura Paranjpe", role: "Clinical Psychologist" },
  { name: "Abhilasha Agarwal", role: "Clinical Psychologist" },
  { name: "Sana Abdullah", role: "Counselling Psychologist" },
  { name: "Veena Mehta", role: "Clinical Psychologist" },
  { name: "Naina Seth", role: "Clinical Psychologist" },
  { name: "Khushboo Shah", role: "Counselling Psychologist" },
  { name: "Nitya Bajoriya", role: "Clinical Psychologist" },
  { name: "Manasi Kulkarni", role: "Clinical Psychologist" },
  { name: "Shriya Sachdeva", role: "Counselling Psychologist" },
  { name: "Dr. Tazveen Shaikh", role: "Clinical Psychologist" },
  { name: "Dr. Aparna Das", role: "Counselling Psychologist" },
  { name: "Dr. Pratibha Sharma", role: "Clinical Psychologist" },
  { name: "Nikhila Nikhil Kothari", role: "Counselling Psychologist" },
  { name: "Arpita Roy", role: "Clinical Psychologist" },
  { name: "Nagavelly Vinay Kumar", role: "Counselling Psychologist" },
  { name: "Vanshika Agarwal", role: "Counselling Psychologist" },
  { name: "Tavishi Chaudhary", role: "Counselling Psychologist" },
  { name: "Shraddha Yadav", role: "Counselling Psychologist", image: shraddhaYadavImage },
  { name: "Juhi Pandey", role: "Counselling Psychologist" },
  { name: "V. Subhashini", role: "Counselling Psychologist" },
  { name: "Priyanshi Garg", role: "Clinical Psychologist", image: priyanshiGargImage },
  { name: "Samanvithaa Adiseshan", role: "Clinical Psychologist" },
  { name: "Sukhmani Bhatia", role: "Counselling Psychologist" },
  { name: "Tamanna Borah", role: "Clinical Psychologist" },
  { name: "Shreeyam Pareek", role: "Counselling Psychologist" },
  { name: "Lavanya Anand", role: "Counselling Psychologist" },
  { name: "Anushka Chauhan", role: "Counselling Psychologist" },
  { name: "Sadhana Sharma", role: "Counselling Psychologist" },
  { name: "Kunjalika Tikku", role: "Counselling Psychologist" },
  { name: "Divya Mishra", role: "Counselling Psychologist" },
  { name: "Shreya Chaudhary", role: "Counselling Psychologist" },
  { name: "Gamini Arya", role: "Counselling Psychologist" },
  { name: "Tamheed Azeem", role: "Counselling Psychologist" },
  { name: "Simran Patel", role: "Clinical Psychologist" },
  { name: "Sonal Rajput", role: "Counselling Psychologist" },
  { name: "Manubha Sharma", role: "Counselling Psychologist" },
  { name: "Naman Ratra", role: "Counselling Psychologist" },
  { name: "Arpita Dethe", role: "Counselling Psychologist" },
  { name: "Smriti Bhardwaj", role: "Counselling Psychologist" },
  { name: "Joshitha Cheppalli", role: "Counselling Psychologist" },
  { name: "Dr. Medha Narayan Kulshreshtha", role: "Counselling Psychologist" },
  { name: "Astha Borbora", role: "Clinical Psychologist" },
  { name: "Ishika Aggarwal", role: "Counselling Psychologist" },
  { name: "Bhavana B", role: "Counselling Psychologist" },
];

// Loose match so punctuation/spacing differences (e.g. "Dr.Harmeen Dhillon"
// vs "Dr. Harmeen Dhillon") still count as the same person.
const normalizeName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim();

type Expert = {
  name: string;
  role: string;
  image?: string;
};

const buildExperts = (
  roster: { name: string; role: string; image?: string }[],
  exclude: { name: string }[]
): Expert[] => {
  const excludedNames = new Set(exclude.map((member) => normalizeName(member.name)));
  return roster.filter((member) => !excludedNames.has(normalizeName(member.name)));
};

// Experts = full roster minus anyone already featured under Leading
// Psychologists. Extend `expertRoster` above and this list stays in sync.
const experts: Expert[] = buildExperts(expertRoster, leadingPsychologists);

// Fuzzy match against the live psychologist directory (same source the
// "/experts" panel uses), tolerant of minor spelling/initial differences
// between this roster and the directory's records.
const nameWords = (name: string) =>
  name
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/^dr\s+/, "")
    .split(/\s+/)
    .filter((word) => word.length > 1);

const namesLooselyMatch = (a: string, b: string) => {
  const wordsA = nameWords(a);
  const wordsB = nameWords(b);
  if (wordsA.length === 0 || wordsB.length === 0) return false;
  if (wordsA.join(" ") === wordsB.join(" ")) return true;

  const lastA = wordsA[wordsA.length - 1];
  const lastB = wordsB[wordsB.length - 1];
  const lastMatches =
    lastA === lastB ||
    (Math.abs(lastA.length - lastB.length) <= 2 && lastA.slice(0, 4) === lastB.slice(0, 4));

  return wordsA[0] === wordsB[0] && lastMatches;
};

const AboutTeamSection = () => {
  const [showExperts, setShowExperts] = useState(false);
  const [expertPhotos, setExpertPhotos] = useState<{ name: string; url: string }[]>([]);
  const hasFetchedPhotos = useRef(false);

  useEffect(() => {
    if (!showExperts || hasFetchedPhotos.current) return;
    hasFetchedPhotos.current = true;

    fetchPsychologists({ limit: 100 })
      .then(({ psychologists }) => {
        setExpertPhotos(
          psychologists
            .filter((p) => p.full_name && p.profile_picture_url)
            .map((p) => ({ name: p.full_name, url: p.profile_picture_url as string }))
        );
      })
      .catch(() => {
        // Directory unreachable — cards keep their placeholder icon.
      });
  }, [showExperts]);

  const resolveExpertImage = (expert: Expert) =>
    expert.image ?? expertPhotos.find((p) => namesLooselyMatch(expert.name, p.name))?.url;

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

        {/* Subtitle: Growth Coaches */}
        <div className="text-center mb-10 mt-20">
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
            Growth Coaches
          </h3>
          <span className="mt-3 block h-0.5 w-16 mx-auto rounded-full bg-primary/40" />
        </div>

        {/* 8 Growth Coaches: 2 rows of 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 max-w-5xl mx-auto">
          {growthCoaches.map((coach, index) => (
            <div key={index} className="text-center group">
              {/* Photo Container */}
              <div className="relative mb-4 mx-auto w-28 h-28 md:w-36 md:h-36">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/30 transition-all duration-300 shadow-sm bg-primary/5 flex items-center justify-center">
                  {coach.image ? (
                    <img
                      src={coach.image}
                      alt={coach.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-1/2 h-1/2 text-primary/30" strokeWidth={1.5} />
                  )}
                </div>
              </div>

              {/* Info */}
              <h3 className="font-serif text-base md:text-lg font-semibold text-foreground mb-1">
                {coach.name}
              </h3>
              <p className="text-primary text-xs md:text-sm font-medium mb-1.5">
                {coach.role}
              </p>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                {coach.description}
              </p>
            </div>
          ))}
        </div>

        {/* Subtitle: Leading Psychologists */}
        <div className="text-center mb-10 mt-20">
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
            Leading Psychologists
          </h3>
          <span className="mt-3 block h-0.5 w-16 mx-auto rounded-full bg-primary/40" />
        </div>

        {/* 9 Leading Psychologists: 2 rows of 4, last one centered */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 max-w-5xl mx-auto">
          {leadingPsychologists.map((psychologist, index) => (
            <div
              key={index}
              className={`text-center group${
                index === leadingPsychologists.length - 1
                  ? " sm:col-span-2 md:col-span-4 mx-auto w-full max-w-[11rem]"
                  : ""
              }`}
            >
              {/* Photo Container */}
              <div className="relative mb-4 mx-auto w-28 h-28 md:w-36 md:h-36">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/30 transition-all duration-300 shadow-sm bg-primary/5 flex items-center justify-center">
                  {psychologist.image ? (
                    <img
                      src={psychologist.image}
                      alt={psychologist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-1/2 h-1/2 text-primary/30" strokeWidth={1.5} />
                  )}
                </div>
              </div>

              {/* Info */}
              <h3 className="font-serif text-base md:text-lg font-semibold text-foreground mb-1">
                {psychologist.name}
              </h3>
              <p className="text-primary text-xs md:text-sm font-medium mb-1.5">
                {psychologist.role}
              </p>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                {psychologist.description}
              </p>
            </div>
          ))}
        </div>

        {/* See More / See Less toggle */}
        <div className="text-center mt-16">
          <button
            type="button"
            onClick={() => setShowExperts((prev) => !prev)}
            aria-expanded={showExperts}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary/30 text-primary text-sm font-medium hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
          >
            {showExperts ? "See Less" : `See More Experts (${experts.length})`}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                showExperts ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Collapsed by default; "See More" reveals the Experts heading + grid */}
        <div
          className={`grid transition-all duration-500 ease-in-out ${
            showExperts ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            {/* Subtitle: Experts (continuation of Leading Psychologists) */}
            <div className="text-center mb-10 mt-16">
              <h4 className="font-serif text-xl md:text-2xl font-semibold text-foreground">
                Experts
              </h4>
              <span className="mt-3 block h-0.5 w-12 mx-auto rounded-full bg-primary/30" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8 max-w-6xl mx-auto pb-2">
              {experts.map((expert, index) => {
                const photo = resolveExpertImage(expert);
                return (
                <div
                  key={index}
                  className="text-center group transition-transform duration-300 hover:-translate-y-1"
                >
                  {/* Photo Container */}
                  <div className="relative mb-3 mx-auto w-20 h-20 md:w-24 md:h-24">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-all duration-300 shadow-sm group-hover:shadow-md bg-primary/5 flex items-center justify-center">
                      {photo ? (
                        <img
                          src={photo}
                          alt={expert.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-1/2 h-1/2 text-primary/30" strokeWidth={1.5} />
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <h5 className="font-serif text-sm md:text-base font-semibold text-foreground mb-0.5 leading-tight">
                    {expert.name}
                  </h5>
                  <p className="text-primary text-xs md:text-sm font-medium">
                    {expert.role}
                  </p>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeamSection;
