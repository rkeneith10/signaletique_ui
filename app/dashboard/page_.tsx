"use client";
import ChartEmpByPost from '@/components/chartEmpByPost';
import Layout from '@/components/rootLayout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FaClipboardList, FaUsers } from 'react-icons/fa';
import { MdHomeWork } from 'react-icons/md';

interface Site{
  site_name:string;
  
}
interface Poste{
  post_name:string;
}

interface Employes{
  first_name:string;
}

type Props = {
  sites: Site[],
  postes: Poste[],
  employes: Employes[]
}

const Dashboard: React.FC<Props> = ({ sites, postes, employes }) => {

  return (
    <Layout isAuthenticated={true}>
      <div className=' ml-4 mr-4 mt-2'>

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
                  <Link href="../postes">
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

      </div>
    </Layout>
  )
}

export default Dashboard
