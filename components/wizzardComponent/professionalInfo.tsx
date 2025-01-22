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
import { FaQuestionCircle } from "react-icons/fa";
import { MultiSelect } from "../multiSelect";
import { useSession } from "next-auth/react";

interface TooltipAttributes {
  id_tooltip: number;
  nom_application: string;
  nom_champ: string;
  message_tooltip: string;
}

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
  const {data:session} = useSession();
  const accessToken = session?.accessToken

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
  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);
  const [tooltips, setTooltips] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ [e.target.id]: e.target.value });
  };
  useEffect(() => {

    const fectchSite = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sites/`,{
          headers:{
            Authorization: `Bearer ${accessToken}`
          }
        });
        setSite(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    const fectchPost = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/`,{
          headers:{
            Authorization: `Bearer ${accessToken}`
          }
        });
        setPoste(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fectchSite();
    fectchPost();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTooltipToggle = (field: string) => {
    setVisibleTooltip(field);
  };

  const handleTooltipHide = () => {
    setVisibleTooltip(null);
  };

  useEffect(() => {
    const fetchTooltips = async () => {
      try {

        const nom_application = "Signaletique";

        const response = await axios.get(`http://localhost:3001/api/tooltipCtrl?nom_application=${encodeURIComponent(nom_application)}`);

        const tooltipMap: Record<string, string> = {};
        const tooltips = response.data.tooltip;

        tooltips.forEach((tooltip: TooltipAttributes) => {
          tooltipMap[tooltip.nom_champ] = tooltip.message_tooltip;
        });

        setTooltips(tooltipMap);
      } catch (error) {
        console.error('Erreur lors de la récupération des tooltips:', error);
      }
    };

    fetchTooltips();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Informations Professionnelles</h2>
      <div className="gap-4 grid grid-cols-2">

        <div>
          <Label htmlFor="badge_number">Numéro de badge
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('badge_number')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'badge_number' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['badge_number']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="badge_number"
            value={data.badge_number}
            onChange={handleChange}
            placeholder="Entrez le numéro de badge"
          />
        </div>

        <div>
          <Label htmlFor="start_up_date">Date de début
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('start_up_date')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'start_up_date' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['start_up_date']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="start_up_date"
            type="date"
            onChange={handleDateChange}
            value={dateValue}
            max={maxDate}
          />
        </div>
        <div>
          <Label htmlFor="category">Catégorie
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('category')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'category' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['category']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="category"
            value={data.category}
            onChange={handleChange}
            placeholder="Catégorie professionnelle"
          />
        </div>
        <div>
          <Label htmlFor="title_qualification">Qualification
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('title_qualification')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'title_qualification' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['title_qualification']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="title_qualification"
            value={data.title_qualification}
            onChange={handleChange}
            placeholder="Titre ou qualification"
          />
        </div>
        <div>
          <Label htmlFor="work_phone_number">Téléphone professionnel
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('work_phone_number')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'work_phone_number' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['work_phone_number']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="work_phone_number"
            value={data.work_phone_number}
            onChange={handleChange}
            placeholder="Téléphone au travail"
          />
        </div>
        <div>
          <Label htmlFor="work_email">Email professionnel
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('work_email')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'work_email' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['work_email']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="work_email"
            value={data.work_email}
            onChange={handleChange}
            type="email"
            placeholder="Email au travail"
          />
        </div>
        <div>
          <Label htmlFor="site">Site affecte
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('site')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'site' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['site']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>

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
          <Label htmlFor="post">Poste
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('post')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'post' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['post']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
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
