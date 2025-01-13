/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlertDialog,

  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

//import { Loader2 } from "lucide-react";
import axios from "axios";
import { useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { toast } from "sonner";
import confirmAdd from "./confirmAdd";
import { Button } from './ui/button';
import AdditionalInfo from "./wizzardComponent/additionalInfo";
import FinancialInfo from "./wizzardComponent/financialInfo";
import PersonalInfo from "./wizzardComponent/personalInfo";
import ProfessionalInfo from "./wizzardComponent/professionalInfo";

// interface TooltipAttributes {
//   id_tooltip: number;
//   nom_application: string;
//   nom_champ: string;
//   message_tooltip: string;
// }

interface FormModalEmployeProps {
  onSave: () => void;
}

interface FormDataType {

  personalInfo: {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    marital_status: string;
    personal_phone_number: string;
    personal_email: string;
    numero_rue: string;
    libelle_adresse: string;
    villeRecord: string;
    section_communale: string;
    from: string;
  };
  professionalInfo: {

    badge_number: string;
    start_up_date: string;
    category: string;
    title_qualification: string;
    work_phone_number: string;
    work_email: string;
    site: string;
    post: [string]
  };
  financialInfo: {
    bank_account_number: string;
    bank_account_name: string;
  };
  additionalInfo: {
    contact_name: string,
    contact_phone_number: string,
    salary_scale: string,
    remarques: string;
  };
};

// interface EmpModalProps {

//   onSuccess: () => void;
//   onFailed: () => void;

// }
interface AdresseAttributes {
  id_adresses: number;
  numero_rue: string;
  libelle_adresse: string;
  statut: string;
  id_sectioncommunale?: number;
  villeRecord?: string;
  code_postal?: string;
  cle_unicite: string;
  from: string;

}

const FormModalEmploye: React.FC<FormModalEmployeProps> = ({ onSave }) => {
  // const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);
  // const [tooltips, setTooltips] = useState<Record<string, string>>({});
  //const [adding, setAdding] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [open, setOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [adresse, setAdresse] = useState<AdresseAttributes[]>([]);
  const [isAlertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const cancelRef = useRef(null);
  const [formData, setFormData] = useState<FormDataType>({
    personalInfo: {
      first_name: "",
      last_name: "",
      date_of_birth: "",
      marital_status: "",
      personal_phone_number: "",
      personal_email: "",
      numero_rue: "",
      libelle_adresse: "",
      villeRecord: "",
      section_communale: "",
      from: "Signaletique"
    },
    professionalInfo: {

      badge_number: "",
      start_up_date: "",
      category: "",
      title_qualification: "",
      work_phone_number: "",
      work_email: "",
      site: "",
      post: [""]
    },
    financialInfo: {
      bank_account_number: "",
      bank_account_name: "",
    },
    additionalInfo: {
      contact_name: "",
      contact_phone_number: "",
      salary_scale: "",
      remarques: "",
    },
  });

  // Fonction de validation pour chaque étape
  const validateStep = () => {
    const currentData =
      currentStep === 1 ? formData.personalInfo :
        currentStep === 2 ? formData.professionalInfo :
          currentStep === 3 ? formData.financialInfo :
            formData.additionalInfo;

    const errorMessages: string[] = [];

    // Validation for fields
    for (const [key, value] of Object.entries(currentData)) {
      if (typeof value === "string" && value.trim() === "") {
        errorMessages.push(`Champ vide : ${key}`);
      }

      // Validation for arrays
      if (Array.isArray(value) && value.length < 1) {
        errorMessages.push(`Tableau vide : ${key}`);
      }
    }

    if (errorMessages.length > 0) {
      // setAlertDialogOpen(true)
      // setAlertMessage(errorMessages.join("\n"));
      return false;
    }

    return true;
  };




  // Fonction de mise à jour des données
  const updateFormData = <T extends keyof FormDataType>(
    stepKey: T,
    data: Partial<FormDataType[T]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [stepKey]: { ...prev[stepKey], ...data },
    }));
  };

  const addInfoEmploye = async () => {

    const { numero_rue, libelle_adresse, villeRecord, section_communale, from } = formData.personalInfo;

    // Enregistrer l'adresse
    const adresseResponse = await axios.post(
      "http://localhost:3001/api/adresseCtrl",
      { numero_rue, libelle_adresse, statut: "En creation", villeRecord, section_communale, from },
      { headers: { "Content-Type": "application/json" } }
    );

    if (adresseResponse.status === 201) {
      const { adresse } = adresseResponse.data;

      if (adresse && adresse.id_adresses) {
        const id = adresse.id_adresses;

        // Préparer les données de l'employé
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { numero_rue, libelle_adresse, villeRecord, from, ...filteredPersonalInfo } = formData.personalInfo;
        const fullEmployeData = {
          ...filteredPersonalInfo,
          ...formData.professionalInfo,
          ...formData.financialInfo,
          ...formData.additionalInfo,
          posts: formData.professionalInfo.post || [],
          id_adress: id,
        };

        try {

          const employeeResponse = await axios.post(
            "http://localhost:8000/api/employees/",
            fullEmployeData,
            { headers: { "Content-Type": "application/json" } }
          );

          if (employeeResponse.status === 201) {
            confirmAdd()
            setOpen(false)
            onSave();
          } else {
            // Si le statut n'est pas 201, supprimer l'adresse
            throw new Error("Erreur lors de l'enregistrement de l'employé.");

          }
        } catch (employeeError) {

          console.error("Erreur lors de l'enregistrement de l'employé :", employeeError);
          await axios.delete(`http://localhost:3001/api/adresseCtrl/${id}`);

          setAlertMessage("Une erreur est survenue. L'adresse a été supprimée.");
          setAlertDialogOpen(true);
        }
      }
    }

  };



  // Étapes du formulaire
  const steps = [
    <PersonalInfo
      key="personal"
      data={formData.personalInfo}
      onChange={(data) => updateFormData("personalInfo", data)}
    />,
    <ProfessionalInfo
      key="professional"
      data={formData.professionalInfo}
      onChange={(data) => updateFormData("professionalInfo", data)}
    />,
    <FinancialInfo
      key="financial"
      data={formData.financialInfo}
      onChange={(data) => updateFormData("financialInfo", data)}
    />,
    <AdditionalInfo
      key="additional"
      data={formData.additionalInfo}
      onChange={(data) => updateFormData("additionalInfo", data)}
    />,
  ];

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.error("Veuillez remplir tous les champs obligatoires avant de continuer.");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const isLastStep = currentStep === steps.length;


  // const handleTooltipToggle = (field: string) => {
  //   setVisibleTooltip(field);
  // };

  // const handleTooltipHide = () => {
  //   setVisibleTooltip(null);
  // };

  // const [poste, setPoste] = useState({
  //   post_name: "",
  //   post_description: ""

  // });

  // const [errors, setErrors] = useState({
  //   post_name: "",
  //   post_description: ""
  // });

  // const handleinputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   setPoste({ ...poste, [name]: value });
  //   setErrors({ ...errors, [name]: "" });

  // };



  // const validateForm = () => {
  //   let valid = true;
  //   const newErrors = { post_name: "", post_description: "" };
  //   if (!poste.post_name) {
  //     newErrors.post_name = "Le nom du poste est requis";
  //     valid = false;
  //   }
  //   if (!poste.post_description) {
  //     newErrors.post_description = "La description est requise";
  //     valid = false;
  //   }
  //   setErrors(newErrors);
  //   return valid;
  // };

  // const addPost = async () => {
  //   if (!validateForm()) {
  //     return;
  //   }
  //   setAdding(true);

  //   try {
  //     const response = await axios.post("http://localhost:8000/api/posts/", poste, {
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     if (response.status === 201) {
  //       setPoste({
  //         post_name: "",
  //         post_description: "",
  //       });

  //       onSuccess();
  //     }
  //   } catch (error) {
  //     onFailed();
  //     console.error("Échec de l'ajout de la section communale", error);
  //   } finally {
  //     setAdding(false);
  //   }

  // }


  // useEffect(() => {
  //   const fetchTooltips = async () => {
  //     try {

  //       const nom_application = "Signaletique";

  //       const response = await axios.get(`/api/tooltipCtrl?nom_application=${encodeURIComponent(nom_application)}`);

  //       const tooltipMap: Record<string, string> = {};
  //       const tooltips = response.data.tooltip;

  //       tooltips.forEach((tooltip: TooltipAttributes) => {
  //         tooltipMap[tooltip.nom_champ] = tooltip.message_tooltip;
  //       });

  //       setTooltips(tooltipMap);
  //     } catch (error) {
  //       console.error('Erreur lors de la récupération des tooltips:', error);
  //     }
  //   };

  //   fetchTooltips();
  // }, []);
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-green-500 text-white px-4 py-2 hover:bg-green-400 font-semibold hover:text-white" variant="outline"> <FaPlus className='mr-2' />Ajouter</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>AJouter Nouveau Poste</DialogTitle>

          </DialogHeader>

          <div className="mb-6 flex items-center justify-between">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-full mx-1 rounded ${index + 1 <= currentStep ? "bg-blue-500" : "bg-gray-300"
                  }`}
              />
            ))}
          </div>
          <div className="mb-6">{steps[currentStep - 1]}</div>

          <div className="flex justify-between">
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                Précédent
              </Button>
            )}
            <Button className="bg-blue-500 text-white hover:bg-blue-400" onClick={isLastStep ? () => addInfoEmploye() : nextStep}>
              {isLastStep ? "Enregistrer" : "Suivant"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>


      <AlertDialog open={isAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nofication</AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel ref={cancelRef} onClick={() => setAlertDialogOpen(false)}>Cancel</AlertDialogCancel>
            {/* <AlertDialogAction>Continue</AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}





export default FormModalEmploye
