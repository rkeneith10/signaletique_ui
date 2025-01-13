/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { Textarea } from "../ui/textarea";

interface TooltipAttributes {
  id_tooltip: number;
  nom_application: string;
  nom_champ: string;
  message_tooltip: string;
}


const AdditionalInfo = ({
  data,
  onChange,
}: {
  data: any;
  onChange: (data: any) => void;
}) => {
  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);
  const [tooltips, setTooltips] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      <h2 className="text-xl font-semibold mb-4">Informations Complémentaires</h2>
      <div className="gap-4 grid grid-cols-2">
        <div>
          <Label htmlFor="salary_scale">Grille salariale
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('salary_scale')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'salary_scale' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['salary_scale']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="salary_scale"
            value={data.salary_scale}
            onChange={handleChange}
            placeholder="Grille salariale"
          />
        </div>
        <div>
          <Label htmlFor="contact_name">Personne de Contact
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('contact_name')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'contact_name' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['contact_name']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="contact_name"
            value={data.contact_name}
            onChange={handleChange}
            placeholder="Nom de personne a contacter"
          />
        </div>
        <div>
          <Label htmlFor="contact_phone_number">Numero de contact
          <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('contact_phone_number')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'contact_phone_number' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['contact_phone_number']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="contact_phone_number"
            value={data.contact_phone_number}
            onChange={handleChange}
            placeholder="Numero de personne a contacter"
          />
        </div>
        <div>
          <Label htmlFor="remarques">Remarques
          <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('remarques')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'remarques' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['remarques']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Textarea
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
