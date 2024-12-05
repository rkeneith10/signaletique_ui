"use client";
import DetailEmploye from '@/components/detailEmploye';
import Layout from '@/components/rootLayout';
import SearchInput from '@/components/searchInput';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";

import FormModalEmploye from '@/components/formModalEmploye';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Employe {
  id: string;
  id_adress: number;
  first_name: string,
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

interface Site {
  id: string,
  site_name: string
}

interface Post {
  id: string,
  post_name: string
}

const Employes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [empData, setEmpData] = useState<Employe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkedItem, setCheckedItem] = useState<string | null>();
  const [selectedEmp, setSelectedEmp] = useState<Employe | undefined>()
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(empData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const [showModalMessage, setShowModalMessage] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [siteinfo, setSiteInfo] = useState<Site[]>([]);
  const [postInfo, setPostInfo] = useState<Post[]>([])
  //const [modalMessage, setModalMessage] = useState("")
  const [showDetailEmp, setShowDetailEmp] = useState<boolean>(false);

  const filteredInfo = empData.filter((emp) =>
    emp.first_name ? emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) : false
  );


  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleShowDetail = (employe: Employe) => {
    setSelectedEmp(employe)
    setShowDetailEmp(true);


  }
  const handleChangeCheck = (id: string) => {
    setCheckedItem((prev) => (prev === id ? null : id));
  };
  // const handleSuccess = () => {
  //   fetchEmploye();
  //   setShowModal(true)
  //   setModalMessage("Le poste a été enregistré avec succès");

  // };
  // const handleFailed = () => {
  //   setModalMessage("Une erreur est survenue lors de l'ajout");
  //   setShowModal(true)
  // };
  useEffect(() => {
    document.title = "Employes"
    fetchEmploye();
    fetchPost();
    fetchSite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchEmploye = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/employees");
      setEmpData(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des postes :", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async () => {
    try {
      if (checkedItem) {

        const idToDelete = checkedItem;
        await axios.delete(`http://localhost:8000/api/employees/${idToDelete}/`);
        setShowModalMessage(true);
        setEmpData(empData.filter((item) => item.id !== idToDelete));
      }
      setCheckedItem(null);
      setShowModalDelete(false);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const fetchSite = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/sites/");
      setSiteInfo(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération  :", error);
    }
  }

  const fetchPost = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/posts/");
      setPostInfo(response.data);
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
    <Layout isAuthenticated>
      <div className='mt-2 mr-4 ml-4'>
        {loading ?
          (
            <SkeletonTable />
          ) : (
            <>
              <div className="flex flex-col mb-4 bg-white shadow-md rounded-md">
                <div className='p-5'>
                  <div className="mb-4 font-semibold text-xl">Employes</div>
                  <div className="flex md:flex-row flex-col justify-between">

                    <div className='flex flex-row items-center space-x-4 mb-4'>

                      <FormModalEmploye />
                      <Link href={`/employes/${checkedItem}`} className='flex items-center '>
                        <Button
                          disabled={!checkedItem}
                          className='bg-blue-500 text-white px-4 py-2 hover:bg-blue-400 font-semibold'
                        >
                          <FaEdit className='mr-2' />
                          <span>Modifier</span>
                        </Button>
                      </Link>

                      <Button
                        disabled={!checkedItem}
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
                    <div className='overflow-x-auto'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead></TableHead>
                            <TableHead className='uppercase font-bold text-gray-900'>#</TableHead>
                            <TableHead className='uppercase font-bold text-gray-900'>Prenom</TableHead>
                            <TableHead className='uppercase font-bold text-gray-900'>Nom</TableHead>
                            {/* <TableHead className='uppercase font-bold text-gray-900'>Statut matrimoniale</TableHead> */}
                            {/* <TableHead className='uppercase font-bold text-gray-900'>Numero bancaire</TableHead>
                            <TableHead className='uppercase font-bold text-gray-900'>Nom banque</TableHead> */}


                            {/* <TableHead className='uppercase font-bold text-gray-900'>Date de naissance</TableHead> */}
                            <TableHead className='uppercase font-bold text-gray-900'>Telephone personnel</TableHead>
                            <TableHead className='uppercase font-bold text-gray-900'>Email Personnel</TableHead>
                            {/* <TableHead className='uppercase font-bold text-gray-900'>NIF</TableHead>
                            <TableHead className='uppercase font-bold text-gray-900'>NINU</TableHead> */}
                            <TableHead className='uppercase font-bold text-gray-900'>Telephone travail</TableHead>
                            <TableHead className='uppercase font-bold text-gray-900'>email travail</TableHead>
                            {/* <TableHead className='uppercase font-bold text-gray-900'>Date commencement</TableHead>
                            <TableHead className='uppercase font-bold text-gray-900'>Grille salariale</TableHead> */}
                            <TableHead className='uppercase font-bold text-gray-900'>NUmero Badge</TableHead>
                            <TableHead className='uppercase font-bold text-gray-900'>Personne de contact</TableHead>
                            <TableHead className='uppercase font-bold text-gray-900'>Numero de contact</TableHead>
                            <TableHead className='uppercase font-bold text-gray-900'>Site</TableHead>
                            <TableHead className='uppercase font-bold text-gray-900'>Postes</TableHead>
                            <TableHead className='font-bold text-gray-900'>

                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredInfo.slice(startIndex, startIndex + itemsPerPage).map((item, index) => (
                            <TableRow key={item.id}

                            >
                              <TableCell>
                                <Checkbox
                                  className={`cursor-pointer ${checkedItem === item.id ? "bg-blue-100" : ""
                                    }`}
                                  checked={checkedItem === item.id}
                                  onCheckedChange={() => handleChangeCheck(item.id)}
                                />
                              </TableCell>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{item.first_name}</TableCell>
                              <TableCell>{item.last_name}</TableCell>
                              {/* <TableCell>{item.marital_status}</TableCell> */}
                              {/* <TableCell>{item.bank_account_number}</TableCell>
                              <TableCell>{item.bank_account_name}</TableCell> */}

                              {/* <TableCell>{item.date_of_birth}</TableCell> */}
                              <TableCell>{item.personal_phone_number}</TableCell>
                              <TableCell>{item.personal_email}</TableCell>
                              {/* <TableCell>{item.nif}</TableCell>
                              <TableCell>{item.ninu}</TableCell> */}
                              <TableCell>{item.work_phone_number}</TableCell>
                              <TableCell>{item.work_email}</TableCell>
                              {/* <TableCell>{item.start_up_date}</TableCell>
                              <TableCell>{item.salary_scale}</TableCell> */}
                              <TableCell>{item.badge_number}</TableCell>
                              <TableCell>{item.contact_name}</TableCell>
                              <TableCell>{item.contact_phone_number}</TableCell>
                              <TableCell>{getSiteNameById(item.site)}</TableCell>
                              <TableCell> {item.posts.map((id) => getPostByID(id)).join(", ")}</TableCell>


                              <TableCell>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="outline" size="icon" onClick={() => handleShowDetail(item)}>
                                        <ChevronRight />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Afficher les details</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>


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



              </div>
            </>
          )}


        <AlertDialog open={showModalMessage}>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Comfirmation</AlertDialogTitle>
              <AlertDialogDescription>
                Suppression reussie
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>

              <AlertDialogAction onClick={() => setShowModalMessage(false)}>Fermer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>


        {showModalDelete && (
          <AlertDialog open={showModalDelete}>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmation</AlertDialogTitle>
                <AlertDialogDescription>
                  Voulez-vous vraiment supprimer cet élément?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowModalDelete(false)}>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {showDetailEmp && (
          <DetailEmploye
            isOpen={showDetailEmp}
            onClose={() => setShowDetailEmp(false)}
            employe={selectedEmp}

          />
        )}

      </div>
    </Layout>
  )
}

export default Employes
