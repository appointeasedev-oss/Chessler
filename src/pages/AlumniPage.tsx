
import { useEffect, useState } from "react";
import MemorialCard from "@/components/cards/MemorialCard";

interface Alumni {
  name: string;
  role: string;
  bio: string;
  photo: string;
  memoriam?: string;
}

const AlumniPage = () => {
  const [alumni, setAlumni] = useState<Alumni[]>([]);

  useEffect(() => {
    fetch("src/data/alumni.json")
      .then((response) => response.json())
      .then((data) => setAlumni(data));
  }, []);

  return (
    <div className="container mx-auto px-4 pt-32 pb-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Esteemed Alumni</h1>
      <div className="flex flex-wrap justify-center gap-8">
        {alumni.map((person) => (
          <MemorialCard key={person.name} {...person} />
        ))}
      </div>
    </div>
  );
};

export default AlumniPage;
