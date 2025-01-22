"use client";
import confirmUpdate from '@/components/confirmUpdate';
import MultipleSelector from '@/components/multiple-selector';
import Layout from '@/components/rootLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const InfoEmploye = () => {

  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [site, setSite] = useState([]);
  const [posts, setPosts] = useState([]);
  const [info, setInfo] = useState();
  const [ setSelectedSite] = useState("");
  //const [selectedPosts, setSelectedPosts] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    id_adress: "",
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
      from: "",
    },
    professionalInfo: {
      badge_number: "",
      start_up_date: "",
      category: "",
      title_qualification: "",
      work_phone_number: "",
      work_email: "",
      site: "",
      post: [""],
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

  const redirect = () => {
    router.push('/employes');
  }

  useEffect(() => {
    const fetchEmployeeInfo = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/employees/${id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setInfo(response.data);

        const response2 = await axios.get(`http://isteah-tech.ddns.net:9097/api/adresseCtrl/${response.data.id_adress}`);
        setFormData({
          id: response.data.id || "",
          id_adress: response.data.id_adress,
          personalInfo: {
            first_name: response.data.first_name || "",
            last_name: response.data.last_name || "",
            date_of_birth: response.data.date_of_birth || "",
            marital_status: response.data.marital_status || "",
            personal_phone_number: response.data.personal_phone_number || "",
            personal_email: response.data.personal_email || "",
            numero_rue: response2.data.numero_rue || "",
            libelle_adresse: response2.data.libelle_adresse || "",
            villeRecord: response2.data.villeRecord || "",
            section_communale: response2.data.section_communale || "",
            from: response.data.from || "",
          },
          professionalInfo: {
            badge_number: response.data.badge_number || "",
            start_up_date: response.data.start_up_date || "",
            category: response.data.category || "",
            title_qualification: response.data.title_qualification || "",
            work_phone_number: response.data.work_phone_number || "",
            work_email: response.data.work_email || "",
            site: response.data.site || "",
            post: response.data.post || [""],
          },
          financialInfo: {
            bank_account_number: response.data.bank_account_number || "",
            bank_account_name: response.data.bank_account_name || "",
          },
          additionalInfo: {
            contact_name: response.data.contact_name || "",
            contact_phone_number: response.data.contact_phone_number || "",
            salary_scale: response.data.salary_scale || "",
            remarques: response.data.remarques || "",
          },
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };

    const fetchSite = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sites/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setSite(response.data);
      } catch (error) {
        console.error("Error fetching sites:", error);
      }
    };

    const fetchPost = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const data = response.data;
        const options = data.map(post => ({
          label: post.post_name,
          value: String(post.id),
        }));
        setPosts(options);

        const responseEmp = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/employees/${id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        const selectPost = [];
        responseEmp.data?.posts?.forEach(p => {
          options.forEach(o => {
            if (o.value === p) {
              selectPost.push(o);
            }
          });
        });
        setSelectedOptions(selectPost);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchEmployeeInfo();
    fetchSite();
    fetchPost();
  }, [id]);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/employees/${id}/`, {
        id: info?.id,
        id_adress: info?.id_adress,
        first_name: formData.personalInfo.first_name,
        last_name: formData.personalInfo.last_name,
        date_of_birth: formData.personalInfo.date_of_birth,
        marital_status: formData.personalInfo.marital_status,
        personal_phone_number: formData.personalInfo.personal_phone_number,
        personal_email: formData.personalInfo.personal_email,
        badge_number: formData.professionalInfo.badge_number,
        start_up_date: formData.professionalInfo.start_up_date,
        category: formData.professionalInfo.category,
        title_qualification: formData.professionalInfo.title_qualification,
        work_phone_number: formData.professionalInfo.work_phone_number,
        work_email: formData.professionalInfo.work_email,
        site: formData.professionalInfo.site,
        posts: selectedOptions?.map(element => element.value),
        bank_account_number: formData.financialInfo.bank_account_number,
        bank_account_name: formData.financialInfo.bank_account_name,
        contact_name: formData.additionalInfo.contact_name,
        contact_phone_number: formData.additionalInfo.contact_phone_number,
        salary_scale: formData.additionalInfo.salary_scale,
        remarques: formData.additionalInfo.remarques,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const response2 = await axios.post(`http://isteah-tech.ddns.net:9097/api/adresseCtrl/updateadresse`, {
        id_adresses: info?.id_adress,
        libelle_adresse: formData.personalInfo.libelle_adresse,
        numero_rue: formData.personalInfo.numero_rue,
        villeRecord: formData.personalInfo.villeRecord,
        section_communale: formData.personalInfo.section_communale
      }, { headers: { "Content-Type": "application/json" } });

      if (response.status !== 200 || response2.status !== 200) {
        throw new Error(response.data.message || "Une erreur s'est produite");
      }
      confirmUpdate();
      setTimeout(() => {
        redirect();
      }, 3000);
      setFormData(prevState => ({
        ...prevState,
        personalInfo: {
          ...prevState.personalInfo,
          ...response2.data,
        },
        professionalInfo: {
          ...prevState.professionalInfo,
          ...response.data.professionalInfo,
        },
        financialInfo: {
          ...prevState.financialInfo,
          ...response.data.financialInfo,
        },
        additionalInfo: {
          ...prevState.additionalInfo,
          ...response.data.additionalInfo,
        },
      }));
    } catch (error) {
      setUpdating(false);
      toast.error("Erreur lors de la modification des informations");
      console.error("Update error:", error);
    } finally {
      setUpdating(false);
    }
  };


  return (
    <Layout isAuthenticated>
      <div className='mt-2 mr-4 ml-4'>
        {loading ? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className='animate-spin rounded-full border-t-4 border-blue-500 w-12 h-12'></div>
            <div className="loader">Chargement en cours...</div>
          </div>
        ) : (info ? (
          <div className="h-auto bg-white rounded-md shadow-md p-10 justify-center items-center mt-10">
            <form onSubmit={handleUpdateInfo}>
              <Tabs defaultValue="personalInfo" className="w-full relative rounded-sm overflow-x-scroll">
                <TabsList className='absolute flex flex-row justify-stretch '>
                  <TabsTrigger value="personalInfo">Information Personnel</TabsTrigger>
                  <TabsTrigger value="professionalInfo">Information Professionnel</TabsTrigger>
                  <TabsTrigger value="financialInfo">Information Financiere</TabsTrigger>
                  <TabsTrigger value="additionalInfo">Information Additionnel</TabsTrigger>
                </TabsList>

                {/* Section - Information Personnel */}
                <TabsContent value="personalInfo" className='mt-10 mb-10'>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="first_name">Prénom</Label>
                      <Input
                        id="first_name"
                        value={formData.personalInfo.first_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalInfo: { ...formData.personalInfo, first_name: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Nom</Label>
                      <Input
                        id="last_name"
                        value={formData.personalInfo.last_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalInfo: { ...formData.personalInfo, last_name: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="date_of_birth">Date de Naissance</Label>
                      <Input
                        type="date"
                        id="date_of_birth"
                        value={formData.personalInfo.date_of_birth}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalInfo: { ...formData.personalInfo, date_of_birth: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="marital_status">Statut Matrimonial</Label>
                      <Input
                        id="marital_status"
                        value={formData.personalInfo.marital_status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalInfo: { ...formData.personalInfo, marital_status: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="personal_phone_number">Téléphone Personnel</Label>
                      <Input
                        id="personal_phone_number"
                        value={formData.personalInfo.personal_phone_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalInfo: { ...formData.personalInfo, personal_phone_number: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="personal_email">Email Personnel</Label>
                      <Input
                        type="email"
                        id="personal_email"
                        value={formData.personalInfo.personal_email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalInfo: { ...formData.personalInfo, personal_email: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="numero_rue">Numero Rue</Label>
                      <Input
                        type="text"
                        id="numero_rue"
                        value={formData.personalInfo.numero_rue}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalInfo: { ...formData.personalInfo, numero_rue: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="libelle_adresse">Nom de la rue</Label>
                      <Input
                        type="text"
                        id="libelle_adresse"
                        value={formData.personalInfo.libelle_adresse}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalInfo: { ...formData.personalInfo, libelle_adresse: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="villeRecord">Ville</Label>
                      <Input
                        type="text"
                        id="villeRecord"
                        value={formData.personalInfo.villeRecord}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalInfo: { ...formData.personalInfo, villeRecord: e.target.value },
                          })
                        }
                      />
                    </div>


                  </div>
                </TabsContent>

                {/* Section - Information Professionnel */}
                <TabsContent value="professionalInfo" className='mt-10 mb-10' >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="badge_number">Numéro de Badge</Label>
                      <Input
                        id="badge_number"
                        value={formData.professionalInfo.badge_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            professionalInfo: { ...formData.professionalInfo, badge_number: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="start_up_date">Date de Début</Label>
                      <Input
                        type="date"
                        id="start_up_date"
                        value={formData.professionalInfo.start_up_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            professionalInfo: { ...formData.professionalInfo, start_up_date: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Catégorie</Label>
                      <Input
                        id="category"
                        value={formData.professionalInfo.category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            professionalInfo: { ...formData.professionalInfo, category: e.target.value },
                          })
                        }
                      />
                    </div>



                    <div>
                      <Label htmlFor="title_qualification">Titre Qualification</Label>
                      <Input
                        id="title_qualification"
                        value={formData.professionalInfo.title_qualification}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            professionalInfo: { ...formData.professionalInfo, title_qualification: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="work_phone_number">Téléphone professionnel</Label>
                      <Input
                        id="work_phone_number"
                        value={formData.professionalInfo.work_phone_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            professionalInfo: { ...formData.professionalInfo, work_phone_number: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="work_email">Email professionnel</Label>
                      <Input
                        id="work_email"
                        value={formData.professionalInfo.work_email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            professionalInfo: { ...formData.professionalInfo, work_email: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="site">Site</Label>
                      <Select
                        value={formData.professionalInfo.site}
                        onValueChange={(value) => {
                          setFormData({
                            ...formData,
                            professionalInfo: { ...formData.professionalInfo, site: value },
                          });
                          setSelectedSite(value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un site" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Sites disponibles</SelectLabel>
                            {site.map((siteItem) => (
                              <SelectItem key={siteItem.id} value={siteItem.id}>
                                {siteItem.site_name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="posts">Postes</Label>

                      <MultipleSelector
                        value={selectedOptions}
                        defaultOptions={posts}
                        onChange={setSelectedOptions}
                        hidePlaceholderWhenSelected
                        placeholder="Selection des postes"
                        emptyIndicator={
                          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400 z-index:100">
                            Plus de poste disponibles
                          </p>
                        }
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Section - Information Financière */}
                <TabsContent value="financialInfo" className='mt-10 mb-10'>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bank_account_number">Numéro de Compte Bancaire</Label>
                      <Input
                        id="bank_account_number"
                        value={formData.financialInfo.bank_account_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            financialInfo: { ...formData.financialInfo, bank_account_number: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="bank_account_name">Nom du Compte Bancaire</Label>
                      <Input
                        id="bank_account_name"
                        value={formData.financialInfo.bank_account_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            financialInfo: { ...formData.financialInfo, bank_account_name: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Section - Information Additionnelle */}
                <TabsContent value="additionalInfo" className='mt-10 mb-10'>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="contact_name">Nom du Contact</Label>
                      <Input
                        id="contact_name"
                        value={formData.additionalInfo.contact_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            additionalInfo: { ...formData.additionalInfo, contact_name: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_phone_number">Téléphone du Contact</Label>
                      <Input
                        id="contact_phone_number"
                        value={formData.additionalInfo.contact_phone_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            additionalInfo: { ...formData.additionalInfo, contact_phone_number: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="salary_scale">Échelle Salariale</Label>
                      <Input
                        id="salary_scale"
                        value={formData.additionalInfo.salary_scale}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            additionalInfo: { ...formData.additionalInfo, salary_scale: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="remarques">Remarques</Label>
                      <Textarea
                        id="remarques"
                        value={formData.additionalInfo.remarques}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            additionalInfo: { ...formData.additionalInfo, salary_scale: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <Button
                type="submit"
                className="bg-blue-500 text-white hover:bg-blue-400 mt-5"
                disabled={updating}
              >
                {updating ? (
                  <>
                    Modifier   <Loader2 className="animate-spin" />
                  </>
                ) : "Modifier"}
              </Button>
            </form>
          </div>

        ) : (<div>Donnees introuvables</div>))
        }

      </div>
    </Layout>
  )
}

export default InfoEmploye
