import { CheckCircle2, XCircle, Shield, Lock, Eye } from "lucide-react";

const leadershipReceives = [
  "Aggregated, anonymised emotional trend data",
  "Early warning indicators for burnout and disengagement",
  "Clear insights to guide people decisions",
];

const leadershipDoesNot = [
  "Individual employee records",
  "Therapy notes or session details",
  "Personal disclosures",
];

const employeeExperience = [
  "Confidential emotional support",
  "Simple, daily tools",
  "Access to professional guidance",
  "Voluntary participation built on trust",
];

const OrgTrustConfidentiality = () => {
  return (
    <section className="py-20 px-6 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs sm:text-sm md:text-base font-bold text-primary uppercase tracking-wider mb-3">
            Privacy, Trust & Ethics
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
            Confidentiality Is Foundational To Adoption And Impact
          </h2>
          <p className="font-sans text-lg text-muted-foreground">
            Trust is not a feature. It is the system.
          </p>
        </div>

        {/* Three Column Trust Structure */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* What Leadership Receives */}
          <div className="bg-white rounded-2xl p-8 border border-border shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300">
            <h3 className="font-serif text-md font-semibold text-foreground mb-6">
              What Leadership Receives
            </h3>
            <div className="space-y-4">
              {leadershipReceives.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What Leadership Does NOT Receive */}
          <div className="bg-white rounded-2xl p-8 border border-border shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300">
            <h3 className="font-serif text-md font-semibold text-foreground mb-6">
              What Leadership Does NOT Receive
            </h3>
            <div className="space-y-4">
              {leadershipDoesNot.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive/70 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What Employees Experience */}
          <div className="bg-white rounded-2xl p-8 border border-border shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300">
            <h3 className="font-serif text-md font-semibold text-foreground mb-6">
              What Employees Experience
            </h3>
            <div className="space-y-4">
              {employeeExperience.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrgTrustConfidentiality;
