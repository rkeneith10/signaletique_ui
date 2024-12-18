/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdditionalInfo = ({
  data,
  onChange,
}: {
  data: any;
  onChange: (data: any) => void;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ [e.target.id]: e.target.value });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Informations Complémentaires</h2>
      <div className="gap-4 grid grid-cols-2">
      <div>
          <Label htmlFor="salary_scale">Grille salariale</Label>
          <Input
            id="salary_scale"
            value={data.salary_scale}
            onChange={handleChange}
            placeholder="Grille salariale"
          />
        </div>
      <div>
          <Label htmlFor="contact_name">Personne de Contact</Label>
          <Input
            id="contact_name"
            value={data.contact_name}
            onChange={handleChange}
            placeholder="Nom de personne a contacter"
          />
        </div>
        <div>
          <Label htmlFor="contact_phone_number">Numero de contact</Label>
          <Input
            id="contact_phone_number"
            value={data.contact_phone_number}
            onChange={handleChange}
            placeholder="Numero de personne a contacter"
          />
        </div>
        <div>
          <Label htmlFor="remarques">Remarques</Label>
          <Input
            id="remarques"
            value={data.remarques}
            onChange={handleChange}
            placeholder="Ajouter des remarques"
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;
