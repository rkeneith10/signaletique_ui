"use client";
import confirmAdd from "@/components/confirmAdd";
import FormModalDossierEmp from "@/components/formModalDossierEmp";
import Layout from "@/components/rootLayout";
import SkeletonTable from "@/components/skeletonTable";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
//import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
//import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {  FaFilePdf, FaImage, FaUserCircle } from "react-icons/fa";
import { pdfjs } from 'react-pdf';
import { toast } from "sonner";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();




const AddFileEmploye = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileData, setFileData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [infoEmp, setInfoEmp] = useState<any | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Aperçu image
  const fileInputRef = useRef<HTMLInputElement>(null); // Référence pour input file
  const [checkedItem,setCheckedItem] = useState<string | null>(null);

  useEffect(() => {
    document.title = infoEmp
      ? `${infoEmp.first_name} ${infoEmp.last_name}`
      : "Détails de l'employé";
  }, [infoEmp]);


  const handleChangeCheck = (id: string) => {
    setCheckedItem((prev) => (prev === id ? null : id));
  };

  const fetchFile = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/files/by-employee/${id}`);
      setFileData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmploye = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/employees/${id}`);
      setInfoEmp(response.data);
      if (response.data.photo) {
        setSelectedImage(response.data.photo); // Mettre à jour l'image
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchFile();
    fetchEmploye();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Déclencher input file quand on clique sur l'avatar
  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Gérer la sélection de l'image et uploader
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

      // Vérification du type de fichier
      if (!allowedTypes.includes(file.type)) {
        toast.error("Veuillez sélectionner un fichier au format PNG, JPEG ou JPG.");
        return;
      }
      const formData = new FormData();
      formData.append("photo", file);

      try {
        const response = await axios.post(
          `http://localhost:8000/api/employees/${id}/upload-photo/`,
          formData
        );
        toast.success("Photo de profil mise à jour");
        const uploadedImageUrl = response.data.photo_url; 
        setSelectedImage(uploadedImageUrl); 
        fetchEmploye(); 
      } catch (error) {
        toast.error("Erreur lors du téléchargement de la photo");
        console.error("Erreur lors du téléchargement :", error);
      }
    }
  };

  const handleSuccess = () => {
    fetchFile();
    confirmAdd()

  };
  const handleFailed = () => {
    toast.error("Une erreur est survenue lors de l'ajout");

  };
  const handleFailedType = () => {
    toast.error("Le fichier doit être l'un des types suivants : png, jpeg, pdf, jpg.");

  };

  return (
    <Layout isAuthenticated>
      <div className="mt-2 mr-4 ml-4">
        <div className="bg-white shadow-md rounded-md">
          {!infoEmp ? (
            <div className="bg-white">
              <div className="flex flex-col justify-center items-center">
                <Skeleton className="h-48 w-48 rounded-full mb-4 mt-4" />
                <Skeleton className="h-4 w-[250px]" />
              </div>
              <SkeletonTable />
            </div>
          ) : (
            <>
              <div className="flex flex-col justify-center items-center">
                <div className="relative cursor-pointer" onClick={handleAvatarClick}>
                  <Avatar className="h-48 w-48 mt-2">
                    {selectedImage || infoEmp?.photo_url ? (
                      <AvatarImage src={selectedImage || infoEmp.photo} alt="Photo de profil" />
                    ) : (
                      <AvatarFallback>
                        <FaUserCircle size="96" className="text-gray-400" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="flex justify-center items-center text-xl font-semibold text-center mt-2">
                  {infoEmp.first_name} {infoEmp.last_name}
                </div>
              </div>
              <div className="">
                <div className='flex flex-row items-center space-x-4 mb-4 p-4'>

                  <FormModalDossierEmp employeeId={id} onSuccess={handleSuccess} onFailed={handleFailed} onFailedType={handleFailedType} />
                  {/* <Link href="/" className='flex items-center '>
                    <Button
                      disabled={!checkedItem} // Actif uniquement si une seule ligne est sélectionnée
                      className='bg-blue-500 text-white px-4 py-2 hover:bg-blue-400 font-semibold'
                    >
                      <FaEdit className='mr-2' />
                      <span>Modifier</span>
                    </Button>
                  </Link>

                  <Button
                    disabled={!checkedItem} 
                    //onClick={() => setShowModalDelete(true)}
                    className='bg-red-500 text-white px-4 py-2 hover:bg-red-400 flex items-center font-semibold'
                  >
                    <FaTrash className='mr-2' />
                    <span>Supprimer</span>
                  </Button> */}
                </div>
                <div className='mt-6'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead></TableHead>
                        <TableHead className='uppercase font-bold text-gray-900'>#</TableHead>
                        <TableHead className='uppercase font-bold text-gray-900'>Type de Fichier</TableHead>
                        <TableHead className='uppercase font-bold text-gray-900'>Fichier</TableHead>

                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fileData.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox
                            checked={checkedItem===item.id}
                            onCheckedChange={() => handleChangeCheck(item.id)}
                            />
                          </TableCell>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.file_type}</TableCell>
                          <TableCell>
                            <div>
                              {item.file.endsWith('.pdf') ? (
                                <button>

                                  <a href={item.file} target="_blank" rel="noopener noreferrer"> <FaFilePdf size={24} className="text-red-600" /></a>
                                </button>
                              ) : item.file.endsWith('.png') || item.file.endsWith('.jpeg') || item.file.endsWith('.jpg') ? (
                                <FaImage size={24} />
                              ) : (
                                <FaFilePdf size={24} />
                              )}
                            </div>
                          </TableCell>

                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {/* <Pagination>
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
</Pagination> */}
                </div>
              </div>
            </>



          )}
        </div>

      </div>
    </Layout>
  );
};

export default AddFileEmploye;
