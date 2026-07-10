import { skills } from "@/data/skills";
import SkillCard from "@/components/SkillCard";
import SectionHeader from "@/components/SectionHeader";

export default function LearningHub({ t }) {
  return (
    <section id="learning" className="bg-slate-900 px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          kicker={t.learning.kicker}
          title={t.learning.title}
          text={t.learning.text}
        />

        <div className="grid gap-8 md:grid-cols-2">
          {skills.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
}