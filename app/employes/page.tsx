"use client";
import DetailEmploye from '@/components/detailEmploye';
import Layout from '@/components/rootLayout';
import SearchInput from '@/components/searchInput';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from 'next-auth/react';
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

import confirmDelete from '@/components/confirmDelete';
import {
  Table,
  TableBody,

  TableCell,

  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { FaEdit, FaFileUpload, FaTrash } from 'react-icons/fa';
import FileEmploye from '@/components/fileEmploye';

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
  const {data:session}=useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [empData, setEmpData] = useState<Employe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkedItem, setCheckedItem] = useState<string | null>();
  const [selectedEmp, setSelectedEmp] = useState<Employe | undefined>()
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(empData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [siteinfo, setSiteInfo] = useState<Site[]>([]);
  const [postInfo, setPostInfo] = useState<Post[]>([])
  //const [modalMessage, setModalMessage] = useState("")
  const [showDetailEmp, setShowDetailEmp] = useState<boolean>(false);
  const [addFile,setAddFile] = useState<boolean>(false)

  const filteredInfo = empData.filter((emp) => {

    const firstNameMatch = emp.first_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const lastNameMatch = emp.last_name?.toLowerCase().includes(searchTerm.toLowerCase());

    return firstNameMatch || lastNameMatch; 
  });



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
      const accessToken = session?.accessToken;
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/employees`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,  
        },
      });
      setEmpData(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération  :", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async () => {
    try {
      const accessToken = session?.accessToken;
      if (checkedItem) {

        const idToDelete = checkedItem;
        await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/employees/${idToDelete}/`,{
          headers: {
            Authorization: `Bearer ${accessToken}`,  
          },
        });
        confirmDelete()
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
      const accessToken = session?.accessToken;
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sites/`,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      });
      setSiteInfo(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération  :", error);
    }
  }

  const fetchPost = async () => {
    try {
      const accessToken = session?.accessToken;
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/`,{
        headers:{
          Authorization: `Bearer ${accessToken}`
        }
      });
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
  const handleAfterSave = () => {
    fetchEmploye();
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

                      <FormModalEmploye onSave={handleAfterSave} />
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
                    <div className=" overflow-x-auto">
                      <Table className="min-w-[1200px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead></TableHead>
                            <TableHead className="uppercase font-bold text-gray-900">#</TableHead>
                            <TableHead className="uppercase font-bold text-gray-900">Nom complet</TableHead>
                            {/* <TableHead className="uppercase font-bold text-gray-900">Telephone personnel</TableHead>
                            <TableHead className="uppercase font-bold text-gray-900">Email Personnel</TableHead> */}
                            <TableHead className="uppercase font-bold text-gray-900">Telephone travail</TableHead>
                            <TableHead className="uppercase font-bold text-gray-900">Email travail</TableHead>
                            <TableHead className="uppercase font-bold text-gray-900">Numero Badge</TableHead>
                            <TableHead className="uppercase font-bold text-gray-900">Personne de contact</TableHead>
                            <TableHead className="uppercase font-bold text-gray-900">Numero de contact</TableHead>
                            <TableHead className="uppercase font-bold text-gray-900">Site</TableHead>
                            <TableHead className="uppercase font-bold text-gray-900">Postes</TableHead>
                            <TableHead className="font-bold text-gray-900"></TableHead>
                            <TableHead className="font-bold text-gray-900"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredInfo.slice(startIndex, startIndex + itemsPerPage).map((item, index) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <Checkbox
                                  className={`cursor-pointer ${checkedItem === item.id ? "bg-blue-100" : ""
                                    }`}
                                  checked={checkedItem === item.id}
                                  onCheckedChange={() => handleChangeCheck(item.id)}
                                />
                              </TableCell>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{`${item.first_name} ${item.last_name}`}</TableCell>
                              {/* <TableCell>{item.personal_phone_number}</TableCell>
                              <TableCell>{item.personal_email}</TableCell> */}
                              <TableCell>{item.work_phone_number}</TableCell>
                              <TableCell>{item.work_email}</TableCell>
                              <TableCell>{item.badge_number}</TableCell>
                              <TableCell>{item.contact_name}</TableCell>
                              <TableCell>{item.contact_phone_number}</TableCell>
                              <TableCell>{getSiteNameById(item.site)}</TableCell>
                              <TableCell>
                                {item.posts.map((id) => getPostByID(id)).join(", ")}
                              </TableCell>
                              <TableCell>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                     <Link href={`/addFileEmploye/${item.id}`}>
                                     <Button
                                        variant="outline"
                                        className="group hover:bg-blue-500"
                                        size="icon"
                                        // onClick={() => addFileEmp(item)}
                                      >
                                        <FaFileUpload className="group-hover:text-white transition-colors duration-200" />
                                      </Button>
                                     </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Ajouter les fichiers</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>


                              <TableCell>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleShowDetail(item)}
                                      >
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

        {addFile && (
          <FileEmploye
          isOpen={addFile}
            onClose={() => setAddFile(false)}
            employe={selectedEmp} 
          />
        )}

      </div>
    </Layout>
  )
}

export default Employes
