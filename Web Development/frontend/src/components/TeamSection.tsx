import { Linkedin, Mail } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  college: string;
  branch: string;
  year?: string;
  position?: string;
  interest: string;
  linkedIn: string;
  email: string;
  image: string;
  isMentor?: boolean;
}

function TeamMember({ name, college, branch, year, position, interest, linkedIn, email, image, isMentor }: TeamMemberProps) {
  return (
    <div className={`group relative p-6 ${isMentor ? 'col-start-2 row-start-2' : ''}`}>
      <div className="relative flex flex-col items-center transform transition-transform duration-500 group-hover:scale-105">
        <div className={`absolute inset-0 rounded-2xl transition-all duration-500 
          ${isMentor ? 'bg-blue-300' :
            'bg-slate-200'} 
          opacity-50 group-hover:opacity-100 blur-xl group-hover:blur-2xl -z-10`} />

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 w-full transform transition-all duration-500
          shadow-xl group-hover:shadow-2xl border border-white/20">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full bg-blue-200 animate-spin-slow blur-md" />
              <img
                src={image}
                alt={name}
                className="relative rounded-full w-full h-full object-cover border-4 border-white"
              />
            </div>

            <div className="text-center">
              <h3 className={`text-xl font-bold ${isMentor ?
                'text-blue-900' :
                'text-slate-800'}`}>
                {name}
              </h3>
              {position && (
                <p className="font-semibold text-blue-600 mt-1">{position}</p>
              )}
              <p className="text-gray-600 mt-1">{college}</p>
              <p className="text-gray-600">{branch}</p>
              {year && <p className="text-gray-600">{year}</p>}
              <p className="text-gray-700 mt-2 font-medium">Interest:</p>
              <p className="text-gray-600 italic">{interest}</p>
            </div>

            <div className="flex space-x-3">
              <a
                href={linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeamSection() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-12 text-4xl font-bold text-center tracking-tight text-blue-900">Our Team</h1>

        <div className="grid grid-cols-2 gap-8">
          <TeamMember
            name="Ahmed CHELBI"
            college="Tunisia"
            branch="Software engineer fresh graduate"
            interest="Passionate about AI and deep learning and healthcare"
            linkedIn="https://www.linkedin.com/in/ahmed-chelbi/"
            email="chelbiahmed501@gmail.com"
            image="/team/ahmed.png"
          />

          <TeamMember
            name="Manal ZAMMAR"
            college="Faculté de Médecine et de Pharmacie de Casablanca"
            branch="Medical Student"
            interest="Passionate About Clinical and Scientific Research"
            linkedIn="https://www.linkedin.com/in/manal-zammar-521860388/"
            email="zammarmanal@gmail.com"
            image="/team/manal.png"
          />

        </div>
      </div>
    </div>
  );
}