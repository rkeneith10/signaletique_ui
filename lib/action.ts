'use server';
import { signIn } from '@/auth';
import axios from 'axios';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  console.log("actions call")
  try {
    await signIn('credentials', formData);
    console.log(formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}



export const fetchDataApi = async (url: string) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${url}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,  // Utiliser le token d'accès
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des sites :", error);
    return [];
  }
};

export const deleteDataApi = async (checkedItem: string[] | number[]) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  try {
    if (checkedItem.length === 1) {

      const idToDelete = checkedItem[0];
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sites/${idToDelete}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } else {

      const site_ids = checkedItem;

      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sites/delete-multiple/`, {
        site_ids
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des sites :", error);
    return [];
  }
};

export const postDataApi = async (url: string, data: object) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${url}/`, data, {
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    });
    if (response.status === 201) {
      revalidatePath("/sites")

      return {
        success: true,
        data: response.data
      }

    }
  } catch (error) {

    console.error("Échec de l'ajout de la section communale", error);
    return {
      success: false,
      data: error
    }
  }
};

export const getinfo = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    return {
      success: false,
      data: error
    }
  }
};

export const updateUser = async (formData: FormData) => {

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/update/`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      }
    });
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    return {
      success: false,
      data: error
    }
  }

}