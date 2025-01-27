"use client";

import Layout from '@/components/rootLayout';
import SearchInput from '@/components/searchInput';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import Cookie from 'js-cookie';
import FormModalSite from '@/components/formModalSite';
import SkeletonTable from '@/components/skeletonTable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface Site {
  id: number;
  site_name: string;
  adresse: string;
  employees: []
}

const Sites = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [siteData, setSiteData] = useState<Site[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkedItem, setCheckedItem] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(siteData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
 const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [modalMessage] = useState("")

  const filteredInfo = siteData.filter((st) =>
    st.site_name ? st.site_name.toLowerCase().includes(searchTerm.toLowerCase()) : false
  );



  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  const handleChangeCheck = (id: number) => {
    setCheckedItem((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const handleSuccess = () => {
    fetchPost();
    toast.success("Le site a été enregistré avec succès");

  };
  const handleFailed = () => {
    toast.error("Une erreur est survenue lors de l'ajout");
  
  };
  useEffect(() => {
    document.title = "Sites"
    const StoredAccessToken = Cookie.get('accessToken');
    if (accessToken) {
      setAccessToken(StoredAccessToken);
    }
    fetchPost();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const { data: session } = useSession();
   const fetchPost = async () => {
    
    setLoading(true);
    
    try {
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sites`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,  // Utiliser le token d'accès
        },
      });
      setSiteData(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des sites :", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleDelete = async () => {
    try {
   
      if (checkedItem.length === 1) {

        const idToDelete = checkedItem[0];
        await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sites/${idToDelete}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,  
        },
      });
        setSiteData(siteData.filter((item) => item.id !== idToDelete));
      } else {

        const site_ids = checkedItem;

        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sites/delete-multiple/`, {
          site_ids
        },{
          headers: {
            Authorization: `Bearer ${accessToken}`,  
          },
        }
      );
        setSiteData(siteData.filter((item) => !checkedItem.includes(item.id)));
      }
      setCheckedItem([]);
      setShowModalDelete(false);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };
  return (
    <Layout isAuthenticated>
      <div className='mt-2 mr-4 ml-4'>
        {loading ?
          (
            <SkeletonTable />
          ) : (
            <>
              <div className="flex flex-col mb-4 bg-white shadow-md rounded-md">
                <div className='p-5'>
                  <div className="mb-4 font-semibold text-xl">Sites</div>
                  <div className="flex md:flex-row flex-col justify-between">

                    <div className='flex flex-row items-center space-x-4 mb-4'>

                      <FormModalSite onSuccess={handleSuccess} onFailed={handleFailed} />
                      <Link href={`/sites/${checkedItem}`} className='flex items-center '>
                        <Button
                          disabled={checkedItem.length !== 1} // Actif uniquement si une seule ligne est sélectionnée
                          className='bg-blue-500 text-white px-4 py-2 hover:bg-blue-400 font-semibold'
                        >
                          <FaEdit className='mr-2' />
                          <span>Modifier</span>
                        </Button>
                      </Link>

                      <Button
                        disabled={checkedItem.length === 0} // Actif si au moins une ligne est sélectionnée
                        onClick={() => setShowModalDelete(true)}
                        className='bg-red-500 text-white px-4 py-2 hover:bg-red-400 flex items-center font-semibold'
                      >
                        <FaTrash className='mr-2' />
                        <span>Supprimer</span>
                      </Button>
                    </div>
                    <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />


                  </div>

                  <div className='mt-6'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead></TableHead>
                          <TableHead className='uppercase font-bold text-gray-900'>#</TableHead>
                          <TableHead className='uppercase font-bold text-gray-900'>Nom</TableHead>
                          <TableHead className='uppercase font-bold text-gray-900'>Qte Employes</TableHead>
                          <TableHead className='uppercase font-bold text-gray-900'>Adresse</TableHead>

                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInfo.slice(startIndex, startIndex + itemsPerPage).map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Checkbox
                                checked={checkedItem.includes(item.id)}
                                onCheckedChange={() => handleChangeCheck(item.id)}
                              />
                            </TableCell>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.site_name}</TableCell>
                            <TableCell>{item.employees.length}</TableCell>
                            <TableCell>{item.adresse}</TableCell>

                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                            className={`hover:bg-blue-400 hover:text-white font-semibold ${currentPage === 1 ? "pointer-events-none opacity-50" : ""
                              }`}
                          />
                        </PaginationItem>

                        {[...Array(totalPages)].map((_, index) => (
                          <PaginationItem key={index}>
                            <PaginationLink
                              href="#"
                              onClick={() => handlePageChange(index + 1)}
                              isActive={currentPage === index + 1}
                              className="hover:bg-blue-400 hover:text-white font-semibold"
                            >
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        {totalPages > 8 && <PaginationEllipsis />}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                            className={`hover:bg-blue-400 hover:text-white font-semibold ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                              }`}
                          />
                        </PaginationItem>

                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>



              </div>
            </>
          )}

        {showModal && (
          <AlertDialog open={showModal}>
            {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Comfirmation</AlertDialogTitle>
                <AlertDialogDescription>
                  {modalMessage}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>

                <AlertDialogAction onClick={() => setShowModal(false)}>Fermer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {showModalDelete && (
          <AlertDialog open={showModalDelete}>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmation</AlertDialogTitle>
                <AlertDialogDescription>
                  {checkedItem.length > 1
                    ? `Voulez-vous vraiment supprimer ces ${checkedItem.length} éléments?`
                    : "Voulez-vous vraiment supprimer cet élément ?"}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() =>  setShowModalDelete(false) }>Annuler</AlertDialogCancel>
        
              <AlertDialogAction
                onClick={handleDelete}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
          </AlertDialog>
        )}

    </div>
    </Layout >
  )
}

export default Sites
