import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface MemorialCardProps {
  name: string;
  role: string;
  bio: string;
  photo: string;
  memoriam?: string;
}

const MemorialCard = ({ name, role, bio, photo, memoriam }: MemorialCardProps) => {
  return (
    <Card className="max-w-sm text-center">
      <CardHeader>
        <div className="mx-auto">
          <img
            src={photo}
            alt={name}
            className="w-32 h-32 rounded-full object-cover object-top"
          />
        </div>
        <CardTitle className="mt-4">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{role}</p>
        <p className="mt-4">{bio}</p>
      </CardContent>
      {memoriam && (
        <CardFooter>
          <p className="text-sm text-muted-foreground italic">{memoriam}</p>
        </CardFooter>
      )}
    </Card>
  );
};

export default MemorialCard;
