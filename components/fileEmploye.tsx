import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Employe {
  id: string;
  first_name: string,
  last_name: string,

}

interface FilesEmploye {
  isOpen: boolean;
  onClose: () => void;
  employe?: Employe;
}
const FileEmploye: React.FC<FilesEmploye> = ({ isOpen, onClose, employe }) => {
  return (
    <div>
       <AlertDialog open={isOpen}>
        {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{`${employe?.first_name} ${employe?.last_name}`}</AlertDialogTitle>
            <AlertDialogDescription>
              {employe ? (
                <div className="grid grid-cols-2 gap-4">
                 
                </div>
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

export default FileEmploye
