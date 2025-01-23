/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import confirmUpdate from '@/components/confirmUpdate';
import Layout from '@/components/rootLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter ,useParams} from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';



interface Post {
  id: number;
  post_name: string;
  post_description: string;
}
interface TooltipAttributes {
  id_tooltip: number;
  nom_application: string;
  nom_champ: string;
  message_tooltip: string;
}
const DetailPost = () => {
  const router=useRouter();
  const params = useParams();
  const id  = params.id;
  const { data: session } = useSession();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);
  const [tooltips, setTooltips] = useState<Record<string, string>>({});
  const [updating, setUpdating] = useState<boolean>(false);
  const [info, setInfo] = useState<Post>();



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTooltipToggle = (field: string) => {
    setVisibleTooltip(field);
  };

  const handleTooltipHide = () => {
    setVisibleTooltip(null);
  };



  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({
    post_name: "",
    post_description: "",

  });

  const redirect = () => {
    router.push('/postes')
  }


  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true);
      try {
        const accessToken = session?.accessToken;
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${id}`,{
          headers: {
            Authorization: `Bearer ${accessToken}`,  
          },
        });
        setInfo(response.data);
        setFormData({
          post_name: response.data.post_name,
          post_description: response.data.post_description
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


    fetchInfo();
    fetchTooltips();

  }, [id]);

  const handleUpdateInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const accessToken = session?.accessToken;
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${id}/`, {
        id: info?.id,
        post_name: formData.post_name,
        post_description: formData.post_description,
      },{
        headers: {
          Authorization: `Bearer ${accessToken}`,  // Utiliser le token d'accès
        },
      });

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Une erreur s\'est produite');
      }

      // Mise à jour des données avec la réponse de l'API
      setFormData(response.data);

      confirmUpdate()
      setTimeout(() => {
        redirect();
      }, 3000);

    } catch (error: unknown) {
      // Gérer l'erreur de mise à jour
      setUpdating(false);
      toast.error(`Erreur lors de la modification des informations`);


      console.error("Update error:", error);
    } finally {
      // Remet à jour l'état de `updating` une fois l'opération terminée
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
        ) : (
          info ? (
            <div className='h-auto bg-white rounded-md shadow-md p-10 justify-center items-center mt-10'>
              <form onSubmit={handleUpdateInfo}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <Label htmlFor="post_name" className="mb-2 font-medium">
                      Nom
                      <div
                        className="ml-2 inline-block cursor-pointer relative"
                        onMouseEnter={() => handleTooltipToggle('post_name')}
                        onMouseLeave={handleTooltipHide}
                      >
                        <FaQuestionCircle className="text-gray-500" size={15} />
                        {visibleTooltip === 'post_name' && (
                          <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                            {tooltips['post_name']}
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                          </div>
                        )}
                      </div>
                    </Label>
                    <Input
                      type="text"
                      id="post_name"
                      name="post_name"
                      value={formData.post_name}
                      className="mt-1 block w-full bg-white rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      onChange={handleInputChange}
                    />
                  </div>



                  <div className="flex flex-col">
                    <Label htmlFor="post_description" className="block text-sm font-medium text-gray-700">
                      Description
                      <div
                        className="ml-2 inline-block cursor-pointer relative"
                        onMouseEnter={() => handleTooltipToggle('post_description')}
                        onMouseLeave={handleTooltipHide}
                      >
                        <FaQuestionCircle className="text-gray-500" size={15} />
                        {visibleTooltip === 'post_description' && (
                          <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-1/2 transform -translate-x-1/2 w-72 text-center">
                            {tooltips['post_description']}
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
                          </div>
                        )}
                      </div>
                    </Label>
                    <Textarea
                      id="post_description"
                      name="post_description"
                      value={formData.post_description}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />

                  </div>
                </div>
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
          ) : (
            <div>Donnees introuvables</div>
          )
        )}


      </div>
    </Layout>
  )
}

export default DetailPost
