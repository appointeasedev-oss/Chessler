
import aboutData from '@/data/about.json';
import { CheckCircle } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="pt-24 min-h-screen bg-background text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">{aboutData.title}</h1>
          <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">{aboutData.about_text}</p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 mb-12 items-start">
          <section>
            <div className="bg-secondary/20 p-8 rounded-lg shadow-lg h-full">
              <h2 className="text-3xl font-semibold mb-4 text-center">{aboutData.team.title}</h2>
              <p className="text-gray-300 leading-relaxed">{aboutData.team.text}</p>
            </div>
          </section>

          <section>
            <div className="bg-secondary/20 p-8 rounded-lg shadow-lg h-full">
              <h2 className="text-3xl font-semibold mb-4 text-center">{aboutData.whyChooseUs.title}</h2>
              <p className="text-gray-300 leading-relaxed">{aboutData.whyChooseUs.text}</p>
            </div>
          </section>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-center">{aboutData.courses.title}</h2>
          <p className="text-gray-400 text-center mb-8">{aboutData.courses.description}</p>
          <div className="grid md:grid-cols-3 gap-8">
            {aboutData.courses.levels.map((course) => (
              <div key={course.name} className="bg-secondary/20 p-6 rounded-lg shadow-lg flex flex-col">
                <h3 className="text-2xl font-bold mb-4">{course.name}</h3>
                <ul className="space-y-3 flex-grow">
                  {course.points.map((point) => (
                    <li key={point} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                      <span className="text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <footer className="text-center text-lg text-gray-400">
          <p>{aboutData.conclusion}</p>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;
