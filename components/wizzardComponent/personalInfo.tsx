"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PersonalInfo = ({ data, onChange }: { data: any; onChange: (data: any) => void }) => {
  const [dateValue, setDateValue] = useState<string>(data.date_of_birth || "");

  const today = new Date();
  const maxDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateValue(value);

    // Convertissez la date en format MM/DD/YYYY avant de la transmettre au parent
    const [year, month, day] = value.split("-");
    const formattedDate = `${year}-${month}-${day}`;
    onChange({ date_of_birth: formattedDate });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ [e.target.id]: e.target.value });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="first_name">Prénom</Label>
          <Input
            id="first_name"
            value={data.first_name}
            onChange={handleChange}
            placeholder="Entrez votre prénom"
          />
        </div>
        <div>
          <Label htmlFor="last_name">Nom</Label>
          <Input
            id="last_name"
            value={data.last_name}
            onChange={handleChange}
            placeholder="Entrez votre nom"
          />
        </div>
        <div>
          <Label htmlFor="date_of_birth">Date de naissance</Label>
          <Input
            id="date_of_birth"
            type="date"
            onChange={handleDateChange}
            value={dateValue}
            max={maxDate}
          />
        </div>
        <div>
          <Label htmlFor="marital_status">État civil</Label>
          <Input
            id="marital_status"
            value={data.marital_status}
            onChange={handleChange}
            placeholder="Marié, Célibataire, etc."
          />
        </div>
        <div>
          <Label htmlFor="personal_phone_number">Téléphone personnel</Label>
          <Input
            id="personal_phone_number"
            type="tel"
            value={data.personal_phone_number}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="personal_email">Email personnel</Label>
          <Input
            id="personal_email"
            type="email"
            value={data.personal_email}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="libelle_adresse">Nom de la rue</Label>
          <Input
            id="libelle_adresse"
            value={data.libelle_adresse}
            onChange={handleChange}
            placeholder="Nom rue"
          />
        </div>
        <div>
          <Label htmlFor="numero_rue">Numero de la rue</Label>
          <Input
            id="numero_rue"
            value={data.numero_rue}
            onChange={handleChange}
            placeholder="Numero"
          />
        </div>
        <div>
          <Label htmlFor="villeRecord">Ville </Label>
          <Input
            id="villeRecord"
            value={data.villeRecord}
            onChange={handleChange}
            placeholder="Entrez la ville"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
