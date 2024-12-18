import axios from "axios";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetchEmploye = async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/employees");
    return response.data; // Retourne les données
  } catch (error) {
    console.error("Erreur lors de la récupération des employés :", error);
    throw error; // Lance l'erreur pour la gérer ailleurs
  }
};