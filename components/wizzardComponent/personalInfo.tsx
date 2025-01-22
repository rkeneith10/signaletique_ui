"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";

interface TooltipAttributes {
  id_tooltip: number;
  nom_application: string;
  nom_champ: string;
  message_tooltip: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PersonalInfo = ({ data, onChange }: { data: any; onChange: (data: any) => void }) => {
  const [dateValue, setDateValue] = useState<string>(data.date_of_birth || "");
  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);
  const [tooltips, setTooltips] = useState<Record<string, string>>({});

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

        const response = await axios.get(`http://isteah-tech.ddns.net:9097/api/tooltipCtrl?nom_application=${encodeURIComponent(nom_application)}`);

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
      <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
      <div className="gap-4 grid grid-cols-2">
        <div>
          <Label htmlFor="first_name">Prénom
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('first_name')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'first_name' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['first_name']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="first_name"
            value={data.first_name}
            onChange={handleChange}
            placeholder="Entrez votre prénom"
          />
        </div>
        <div>
          <Label htmlFor="last_name">Nom
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('last_name')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'last_name' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['last_name']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="last_name"
            value={data.last_name}
            onChange={handleChange}
            placeholder="Entrez votre nom"
          />
        </div>
        <div>
          <Label htmlFor="date_of_birth">Date de naissance
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('date_of_birth')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'date_of_birth' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['date_of_birth']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="date_of_birth"
            type="date"
            onChange={handleDateChange}
            value={dateValue}
            max={maxDate}
          />
        </div>
        <div>
          <Label htmlFor="marital_status">État civil
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('marital_status')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'marital_status' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['marital_status']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="marital_status"
            value={data.marital_status}
            onChange={handleChange}
            placeholder="Marié, Célibataire, etc."
          />
        </div>
        <div>
          <Label htmlFor="personal_phone_number">Téléphone personnel
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('personal_phone_number')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'personal_phone_number' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['personal_phone_number']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="personal_phone_number"
            type="tel"
            placeholder="Telephone personnel"
            value={data.personal_phone_number}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="personal_email">Email personnel
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('personal_email')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'personal_email' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['personal_email']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="personal_email"
            type="email"
            placeholder="Email personnel"
            value={data.personal_email}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="libelle_adresse">Nom de la rue
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('libelle_adresse')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'libelle_adresse' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['libelle_adresse']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="libelle_adresse"
            value={data.libelle_adresse}
            onChange={handleChange}
            placeholder="Nom rue"
          />
        </div>
        <div>
          <Label htmlFor="numero_rue">Numero de la rue
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('numero_rue')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'numero_rue' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['numero_rue']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="numero_rue"
            value={data.numero_rue}
            onChange={handleChange}
            placeholder="Numero"
          />
        </div>
        <div>
          <Label htmlFor="villeRecord">Ville
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('villeRecord')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'villeRecord' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['villeRecord']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="villeRecord"
            value={data.villeRecord}
            onChange={handleChange}
            placeholder="Entrez la ville"
          />
        </div>

        <div>
          <Label htmlFor="section_communale">Section Communale
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('section_communale')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'section_communale' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['section_communale']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="section_communale"
            value={data.section_communale}
            onChange={handleChange}
            placeholder="Entrez la section communale ou quartier"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
