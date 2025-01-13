/* eslint-disable @typescript-eslint/no-explicit-any */
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

const FinancialInfo = ({
  data,
  onChange,
}: {
  data: any;
  onChange: (data: any) => void;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ [e.target.id]: e.target.value });
  };

  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);
  const [tooltips, setTooltips] = useState<Record<string, string>>({});

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
      <h2 className="text-xl font-semibold mb-4">Informations Financières</h2>
      <div className="gap-4 grid grid-cols-2">
        <div>
          <Label htmlFor="bank_account_number">Numéro de compte bancaire
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('bank_account_number')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'bank_account_number' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['bank_account_number']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="bank_account_number"
            value={data.bank_account_number}
            onChange={handleChange}
            placeholder="Entrez votre numéro de compte bancaire"
          />
        </div>
        <div>
          <Label htmlFor="bank_account_name">Nom du titulaire du compte
            <div
              className="ml-2 inline-block cursor-pointer relative"
              onMouseEnter={() => handleTooltipToggle('bank_account_name')}
              onMouseLeave={handleTooltipHide}
            >
              <FaQuestionCircle className="text-gray-500" size={15} />
              {visibleTooltip === 'bank_account_name' && (
                <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                  {tooltips['bank_account_name']}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="bank_account_name"
            value={data.bank_account_name}
            onChange={handleChange}
            placeholder="Nom associé au compte"
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialInfo;
