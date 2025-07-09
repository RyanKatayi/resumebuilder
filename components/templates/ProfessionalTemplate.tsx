import { Resume } from '@/types/resume'

interface ProfessionalTemplateProps {
  resume: Resume
}

export function ProfessionalTemplate({ resume }: ProfessionalTemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, awards } = resume

  return (
    <div className="bg-white text-black font-serif w-full h-full text-sm">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center mb-2 tracking-wider">
          {personalInfo.firstName?.toUpperCase()} {personalInfo.lastName?.toUpperCase()}
        </h1>
        <div className="text-xs text-center flex justify-between">
          <span>{personalInfo.address}</span>
          <span>{personalInfo.phone}</span>
          <a href={`mailto:${personalInfo.email}`} className="text-blue-600 underline">{personalInfo.email}</a>
        </div>
        <hr className="border-t-2 border-black my-4" />
      </header>
      
      {/* Objective/Summary */}
      {summary && (
        <section className="mb-4">
          <h2 className="text-md font-bold uppercase tracking-widest mb-2">Objective</h2>
          <hr className="border-t border-black mb-2" />
          <p className="text-justify">{summary}</p>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-md font-bold uppercase tracking-widest mb-2">Education</h2>
          <hr className="border-t border-black mb-2" />
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between">
                <p className="font-bold">{edu.degree}</p>
                <p className="font-bold">{edu.endDate}</p>
              </div>
              <p className="italic">{edu.institution}, {edu.location} {edu.gpa && `| Grade: ${edu.gpa}`}</p>
              {edu.honors && <p className="mt-1">{edu.honors}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-md font-bold uppercase tracking-widest mb-2">Experience</h2>
          <hr className="border-t border-black mb-2" />
          {experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between">
                <p className="font-bold">{exp.company}</p>
                <p className="font-bold">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
              </div>
              <ul className="list-disc list-inside mt-1">
                {exp.achievements?.map((ach, i) => (
                  <li key={i}>{ach}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-md font-bold uppercase tracking-widest mb-2">Skills Summary</h2>
           <hr className="border-t border-black mb-2" />
          <ul className="list-disc list-inside">
            {skills.map((skill) => (
              <li key={skill.id}>{skill.name}</li>
            ))}
          </ul>
        </section>
      )}
      
       {/* Certifications */}
      {projects && projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-md font-bold uppercase tracking-widest mb-2">Certifications</h2>
           <hr className="border-t border-black mb-2" />
           {projects.map((proj) => (
             <div key={proj.id} className="flex justify-between">
                <p className="font-bold">{proj.title}</p>
                <p>{proj.endDate}</p>
             </div>
           ))}
        </section>
      )}

      {/* Awards / Voluntary */}
      {awards && awards.length > 0 && (
        <section className="mb-4">
          <h2 className="text-md font-bold uppercase tracking-widest mb-2">Voluntary Work/Experience</h2>
           <hr className="border-t border-black mb-2" />
           {awards.map((award) => (
             <div key={award.id} className="mb-2">
                <div className="flex justify-between">
                  <p className="font-bold">{award.title}</p>
                  <p>{award.date}</p>
                </div>
                <ul className="list-disc list-inside">
                  <li>{award.description}</li>
                </ul>
             </div>
           ))}
        </section>
      )}

    </div>
  )
}