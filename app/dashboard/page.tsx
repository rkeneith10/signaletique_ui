"use client";
import ChartEmpByPost from '@/components/chartEmpByPost';
import Layout from '@/components/rootLayout';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaClipboardList, FaUsers } from 'react-icons/fa';
import { MdHomeWork } from 'react-icons/md';


const Dashboard = () => {
  const {data:session}= useSession();
  const accessToken = session?.accessToken;
  const [sites, setSites] = useState([]);
  const [postes, setPostes] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = "Tableau de bord";
    console.log(accessToken)
    const fetchData = async () => {
      try {
        const responseSite = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sites/`,{
          headers:{
            Authorization:`Bearer ${accessToken}`
          }
        });
        const responsePost = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/`,{
          headers:{
            Authorization:`Bearer ${accessToken}`
          }
        });
        const responseEmployes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/employees/`,{
          headers:{
            Authorization:`Bearer ${accessToken}`
          }
        });

        setSites(responseSite.data);
        setPostes(responsePost.data)
        setEmployes(responseEmployes.data)
        setLoading(false)

      } catch (error) {
        console.error("Error fetching :", error);
      }
    }

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout isAuthenticated={true}>
      <div className=' ml-4 mr-4 mt-2'>
        {loading ? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className='animate-spin rounded-full border-t-4 border-blue-500 w-12 h-12'></div>
            <div className="loader">Chargement en cours...</div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center md:justify-between">
              <div className="w-full md:w-1/3 p-4 relative">
                <div className="bg-white shadow-md rounded-md p-6 text-center">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <h2 className="text-lg font-semibold text-blue-600">Sites</h2>
                      <span className="ml-2">
                        <MdHomeWork size={20} className="text-blue-500" />
                      </span>
                    </div>
                    <Link href="../sites">
                      <Button variant='outline' className="border-blue-500 text-blue-500 hover:bg-blue-100 bg-white ">
                        Voir tous
                      </Button>
                    </Link>
                  </div>
                  <p className="font-bold text-2xl text-blue-500">{sites.length}</p>
                </div>
              </div>

              <div className="w-full md:w-1/3 p-4 relative">
                <div className="bg-white shadow-md rounded-md p-6 text-center">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <h2 className="text-lg font-semibold text-blue-600">Employes</h2>
                      <span className="ml-2">
                        <FaUsers size={20} className="text-blue-500" />
                      </span>
                    </div>
                    <Link href="../employes">
                      <Button variant='outline' className="border-blue-500 text-blue-500 hover:bg-blue-100 bg-white">
                        Voir tous
                      </Button>
                    </Link>
                  </div>
                  <p className="font-bold text-2xl text-blue-500">{employes.length}</p>
                </div>
              </div>


              <div className="w-full md:w-1/3 p-4 relative">
                <div className="bg-white shadow-md rounded-md p-6 text-center">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <h2 className="text-lg font-semibold text-blue-600">Postes</h2>
                      <span className="ml-2">
                        <FaClipboardList size={20} className="text-blue-500" />
                      </span>
                    </div>
                    <Link href="../adresses">
                      <Button variant='outline' className="border-blue-500 text-blue-500 hover:bg-blue-100 bg-white">
                        Voir tous
                      </Button>
                    </Link>
                  </div>
                  <p className="font-bold text-2xl text-blue-500">{postes.length}</p>
                </div>
              </div>

            </div>

            <div className='grid grid-cols-2 gap-4'>
              <ChartEmpByPost />

            </div>

          </>
        )}
      </div>
    </Layout>
  )
}

export default Dashboard
