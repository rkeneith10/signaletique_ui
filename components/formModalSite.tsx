import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { Loader2 } from "lucide-react";
import { useEffect, useState } from 'react';
import { FaPlus, FaQuestionCircle } from 'react-icons/fa';
import { Button } from './ui/button';

interface TooltipAttributes {
  id_tooltip: number;
  nom_application: string;
  nom_champ: string;
  message_tooltip: string;
}

interface SiteModalProps {

  onSuccess: () => void;
  onFailed: () => void;

}

const FormModalSite: React.FC<SiteModalProps> = ({ onSuccess, onFailed }) => {
  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);
  const [tooltips, setTooltips] = useState<Record<string, string>>({});
  const [adding, setAdding] = useState(false);

  const handleTooltipToggle = (field: string) => {
    setVisibleTooltip(field);
  };

  const handleTooltipHide = () => {
    setVisibleTooltip(null);
  };

  const [site, setSite] = useState({
    site_name: "",
    adresse: ""

  });

  const [errors, setErrors] = useState({
    site_name: "",
  });

  const handleinputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSite({ ...site, [name]: value });
    setErrors({ ...errors, [name]: "" });

  };



  const validateForm = () => {
    let valid = true;
    const newErrors = { site_name: "" ,};
    if (!site.site_name) {
      newErrors.site_name = "Le nom du site est requis";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const addSite = async () => {
    if (!validateForm()) {
      return;
    }
    setAdding(true);

    try {
      const response = await axios.post("http://localhost:8000/api/sites/", site, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 201) {
        setSite({
          site_name: "",
          adresse: "",
        });

        onSuccess();
      }
    } catch (error) {
      onFailed();
      console.error("Échec de l'ajout de la section communale", error);
    } finally {
      setAdding(false);
    }

  }


  useEffect(() => {
    const fetchTooltips = async () => {
      try {

        const nom_application = "Signaletique";

        const response = await axios.get(`/api/tooltipCtrl?nom_application=${encodeURIComponent(nom_application)}`);

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
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-green-500 text-white px-4 py-2 hover:bg-green-400 font-semibold hover:text-white" variant="outline"> <FaPlus className='mr-2' />Ajouter</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>AJouter Nouveau Site</DialogTitle>
            {/* <DialogDescription>
                Make changes to your profile here. Click save when you are done.
              </DialogDescription> */}
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Champ Nom */}
            <div className="col-span-4">
              <Label htmlFor="site_name" className="block text-sm font-medium text-gray-700">
                Nom
                <div
                  className="ml-2 inline-block cursor-pointer relative"
                  onMouseEnter={() => handleTooltipToggle('site_name')}
                  onMouseLeave={handleTooltipHide}
                >
                  <FaQuestionCircle className="text-gray-500" size={15} />
                  {visibleTooltip === 'site_name' && (
                    <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                      {tooltips['site_name']}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                    </div>
                  )}
                </div>
              </Label>
              <Input
                id="site_name"
                name="site_name"
                value={site.site_name}
                onChange={handleinputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.site_name && (
                <span className="text-red-500 text-sm">{errors.site_name}</span>
              )}
            </div>

            {/* Champ Description */}
            <div className="col-span-4">
              <Label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                Adresse
                <div
                  className="ml-2 inline-block cursor-pointer relative"
                  onMouseEnter={() => handleTooltipToggle('adresse')}
                  onMouseLeave={handleTooltipHide}
                >
                  <FaQuestionCircle className="text-gray-500" size={15} />
                  {visibleTooltip === 'adresse' && (
                    <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                      {tooltips['adresse']}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                    </div>
                  )}
                </div>
              </Label>
              <Input
                id="adresse"
                name="adresse"
                value={site.adresse}
                onChange={handleinputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              
            </div>
          </div>

          <DialogFooter>
            <Button onClick={addSite} className='bg-blue-500 text-white hover:bg-blue-400'>
              {adding ? <Loader2 className="animate-spin" /> : ""}
              Enregistrer</Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FormModalSite
