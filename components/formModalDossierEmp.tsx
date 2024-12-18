import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
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
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Button } from './ui/button';

interface FileModalProps {

  onSuccess: () => void;
  onFailed: () => void;
  onFailedType: () => void;

}


const FormModalDossierEmp: React.FC<FileModalProps> = ({ onSuccess, onFailed, onFailedType }) => {
  const [adding, setAdding] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  

  useEffect(() => {
    console.log(selectedEmployee)
    const fetchEmploye = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/employees")
        setEmployes(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchEmploye();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addFileEmp = async () => {
    if ( !file) {
      onFailed();
      return
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      onFailedType();
      return;
    }

    setAdding(true);

    const formData = new FormData();
    formData.append("employee", selectedEmployee);
    formData.append("file", file);

    try {

      const response = await axios.post("http://localhost:8000/api/files/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) { onSuccess(); }

    } catch (error) {
      console.error("Error adding file:", error);
      onFailed();
    } finally {
      setAdding(false);
    }
  }
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-green-500 text-white px-4 py-2 hover:bg-green-400 font-semibold hover:text-white" variant="outline"> <FaPlus className='mr-2' />Ajouter</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>AJouter Nouveau Poste</DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you are done.
            </DialogDescription> */}
          </DialogHeader>

          <form>
            <div className="grid gap-4 py-4">

              {/* Select Employee */}
              <div className="col-span-4">
                <Label htmlFor="employee" className="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionner le type de fichier
                </Label>
                <Select onValueChange={(value) => setSelectedEmployee(value)}>
                  <SelectTrigger id="employee" className="w-full">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Type de fichiers</SelectLabel>
                      <SelectItem value="Lettre">Lettre recommandation</SelectItem>
                      <SelectItem value="Attestation">Attestation</SelectItem>
                      <SelectItem value="Cv">CV</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>


                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* File Input */}
              <div className="col-span-4">
                <Label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  Fichier à uploader
                </Label>
                <Input
                  id="file"
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:border file:border-solid file:border-blue-700 file:rounded-md border-blue-600"

                />
              </div>

            </div>
          </form>

          <DialogFooter>
            <Button onClick={addFileEmp} className='bg-blue-500 text-white hover:bg-blue-400'>
              {adding ? <Loader2 className="animate-spin" /> : ""}
              Enregistrer</Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FormModalDossierEmp
