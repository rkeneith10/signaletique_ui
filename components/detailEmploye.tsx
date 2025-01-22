import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarImage } from "./ui/avatar";
interface Site {
  id: string,
  site_name: string
}

interface Post {
  id: string,
  post_name: string
}
interface Employe {
  id: string;
  id_adress: number;
  first_name: string,
  photo: string,
  last_name: string,
  marital_status: string,
  bank_account_number: string,
  bank_account_name: string,
  contact_name: string,
  contact_phone_number: string,
  date_of_birth: string,
  personal_phone_number: string,
  personal_email: string,
  nif: string,
  ninu: string,
  work_phone_number: string,
  work_email: string,
  start_up_date: string,
  category: string,
  salary_scale: string,
  badge_number: string,
  title_qualification: string,
  remarques: string,
  site: string,
  posts: []
}

interface DetailEmploye {
  isOpen: boolean;
  onClose: () => void;
  employe?: Employe;
}

interface AdresseEmp {
  id_adresses: number;
  numero_rue: string;
  libelle_adresse: string;
  statut: string;
  section_communale: string;
  villeRecord?: string;
  code_postal?: string;
  cle_unicite: string;
  from: string;
}

const DetailEmploye: React.FC<DetailEmploye> = ({ isOpen, onClose, employe }) => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const [siteinfo, setSiteInfo] = useState<Site[]>([]);
  const [postInfo, setPostInfo] = useState<Post[]>([]);
  const [adresseInfo, setAdresseInfo] = useState<AdresseEmp | null>(null);

  useEffect(() => {
    fetchPost();
    fetchSite();
    if (employe?.id_adress) {
      fetchAdresse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const fetchAdresse = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/adresseCtrl/${employe?.id_adress}`);
      console.log(response)
      setAdresseInfo(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'adresse :", error);
    }
  };


  const fetchSite = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sites/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setSiteInfo(response.data);
      console.log("Site")
      console.log(siteinfo)
    } catch (error) {
      console.error("Erreur lors de la récupération  :", error);
    }
  }

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setPostInfo(response.data);
      console.log("Poste")
      console.log(postInfo)
    } catch (error) {
      console.error("Erreur lors de la récupération  :", error);
    }
  }

  const getSiteNameById = (id: string | number) => {
    const sit = siteinfo.find((s) => s.id === String(id));
    return sit ? sit.site_name : "Inconnu";
  };


  const getPostByID = (id: string | number) => {
    const post = postInfo.find((p) => p.id === String(id));
    return post ? post.post_name : "Inconnu";
  };
  return (
    <div>
      <AlertDialog open={isOpen}>
        {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Information de {`${employe?.first_name} ${employe?.last_name}`}</AlertDialogTitle>
            <AlertDialogDescription>
              {employe ? (
                <>
                  <div className=" flex items-center justify-center mb-4" >
                    {employe.photo ? (
                      <Avatar className="h-24 w-24 mt-2">
                        <AvatarImage src={employe.photo} alt="Photo de profil" />
                      </Avatar>
                    ) : ""}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-gray-900">
                      <strong>Prénom:</strong> {employe.first_name || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>Nom:</strong> {employe.last_name || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>Statut matrimonial:</strong> {employe.marital_status || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>Adresse:</strong>  {adresseInfo ? `${adresseInfo.numero_rue} ${adresseInfo.libelle_adresse}, ${adresseInfo.villeRecord}, ${adresseInfo.section_communale}` : 'N/A'}

                    </div>

                    <div className="text-gray-900">
                      <strong>Numéro de compte bancaire:</strong> {employe.bank_account_number || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>Nom du compte bancaire:</strong> {employe.bank_account_name || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>Nom du contact:</strong> {employe.contact_name || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>Numéro du contact:</strong> {employe.contact_phone_number || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>Date de naissance:</strong> {employe.date_of_birth || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>Téléphone personnel:</strong> {employe.personal_phone_number || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>Email personnel:</strong> {employe.personal_email || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>NIF:</strong> {employe.nif || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>NINU:</strong> {employe.ninu || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>Téléphone professionnel:</strong> {employe.work_phone_number || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>Email professionnel:</strong> {employe.work_email || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>Date dembauche:</strong> {employe.start_up_date || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>Catégorie:</strong> {employe.category || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>Échelle salariale:</strong> {employe.salary_scale || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>Numéro de badge:</strong> {employe.badge_number || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>Qualification:</strong> {employe.title_qualification || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>Remarques:</strong> {employe.remarques || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>Site:</strong> {getSiteNameById(employe.site) || 'N/A'}
                    </div>
                    <div className="text-gray-900">
                      <strong>Posts:</strong> {employe.posts.map((id) => getPostByID(id)).join(", ") || 'N/A'}
                    </div>
                  </div></>
              ) : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>

            <AlertDialogAction onClick={onClose}>Fermer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DetailEmploye
