/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useEffect, useState } from "react";
import { MultiSelect } from "../multiSelect";

interface Sites {
  id: string,
  site_name: string;
}

interface Postes {
  id: string,
  post_name: string;
}

const ProfessionalInfo = ({ data, onChange, }: { data: any; onChange: (data: any) => void; }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [dateValue, setDateValue] = useState<string>(data.start_up_date || "");

  const today = new Date();
  const maxDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateValue(value);

    // Convertissez la date en format MM/DD/YYYY avant de la transmettre au parent
    const [year, month, day] = value.split("-");
    const formattedDate = `${year}-${month}-${day}`;
    onChange({ start_up_date: formattedDate });
  };



  const handleSiteChange = (value: string) => {
    setSelectedSite(value);
    onChange({ site: value });  
  };


  const [site, setSite] = useState<Sites[]>([])
  const [poste, setPoste] = useState<Postes[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ [e.target.id]: e.target.value });
  };
  useEffect(() => {

    const fectchSite = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/sites/");
        setSite(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    const fectchPost = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/posts/");
        setPoste(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fectchSite();
    fectchPost();
  }, [])
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Informations Professionnelles</h2>
      <div className="space-y-4">

        <div>
          <Label htmlFor="badge_number">Numéro de badge</Label>
          <Input
            id="badge_number"
            value={data.badge_number}
            onChange={handleChange}
            placeholder="Entrez le numéro de badge"
          />
        </div>

        <div>
          <Label htmlFor="start_up_date">Date de début</Label>
          <Input
            id="start_up_date"
            type="date"
            onChange={handleDateChange}
            value={dateValue}
            max={maxDate}
          />
        </div>
        <div>
          <Label htmlFor="category">Catégorie</Label>
          <Input
            id="category"
            value={data.category}
            onChange={handleChange}
            placeholder="Catégorie professionnelle"
          />
        </div>
        <div>
          <Label htmlFor="title_qualification">Qualification</Label>
          <Input
            id="title_qualification"
            value={data.title_qualification}
            onChange={handleChange}
            placeholder="Titre ou qualification"
          />
        </div>
        <div>
          <Label htmlFor="work_phone_number">Téléphone professionnel</Label>
          <Input
            id="work_phone_number"
            value={data.work_phone_number}
            onChange={handleChange}
            placeholder="Téléphone au travail"
          />
        </div>
        <div>
          <Label htmlFor="work_email">Email professionnel</Label>
          <Input
            id="work_email"
            value={data.work_email}
            onChange={handleChange}
            type="email"
            placeholder="Email au travail"
          />
        </div>
        <div>
          <Label htmlFor="site">Site affecte</Label>

          <Select onValueChange={handleSiteChange}>
            <SelectTrigger className="">
              <SelectValue placeholder="Selectionnez un site" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Site</SelectLabel>
                {site.map((st, index) => (
                  <SelectItem key={index} value={st.id} id="site">
                    {st.site_name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="post">Poste</Label>
          <MultiSelect
            options={poste.map((post) => ({
              label: post.post_name,
              value: post.id,
            }))}
            onValueChange={(selected) => {
              // Mettez à jour le champ "post" dans les données
              onChange({ ...data, post: selected });
            }}
            defaultValue={data.post}
            placeholder="Sélectionnez des postes"
            variant="inverted"
            //animation={2}
            //maxCount={3}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfo;
