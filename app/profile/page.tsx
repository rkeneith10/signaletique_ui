"use client";
import Layout from '@/components/rootLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { toast } from 'sonner';
interface User {
  username: string;
  email: string;
  role: string;
  phone_number: string;
  profile: string;
  first_name: string;
  last_name: string;
}

const Profile = () => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const [infoUser, setInfoUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [profile, setProfile] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (session && accessToken) {
      getinfo();
    }
  }, [session, accessToken]);

  useEffect(() => {
    if (infoUser) {
      setFirstName(infoUser.first_name);
      setLastName(infoUser.last_name);
      setProfile(infoUser.profile);
      setUsername(infoUser.username);
      setEmail(infoUser.email);
    }
  }, [infoUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      const file = e.target.files[0];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Veuillez sélectionner un fichier au format PNG, JPEG ou JPG.");
        return;
      }
      setSelectedFile(file);
      setProfile(URL.createObjectURL(file)); // Mise à jour de l'aperçu
    }
  };

  const getinfo = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setInfoUser(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les informations utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('username', username);
      formData.append('email', email);
      if (selectedFile) {
        formData.append('profile', selectedFile);
      }

      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/update/`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 200) {
        toast.success("Profil mis à jour avec succès.");
        setProfile(response.data.profile);
      }
    } catch (error) {
      console.error(error);
      toast.error("Échec de la mise à jour du profil.");
    }
  };

  return (
    <Layout isAuthenticated>
      <div className="mt-2 mr-4 ml-4">
        {loading ? (
          <div className="space-y-6">
            <div className="flex justify-center items-center bg-white">
              <Skeleton className="h-48 w-48 rounded-full" />
              <div className="space-y-2 ml-6">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <Card>
              <CardContent className="space-y-6">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
            <div className="pt-6">
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        ) : (
          <div>
            <div className="px-4 space-y-6 sm:px-6">
              <header className="flex justify-center items-center flex-row">
                <Avatar className="h-48 w-48 mt-2 ">
                  <AvatarImage src={profile || infoUser?.profile} alt="Photo de profil" />
                  <AvatarFallback>
                    <FaUserCircle size="96" className="text-gray-400" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 ml-4">
                  <h1 className="text-2xl font-bold">{`${firstName} ${lastName}`}</h1>
                  <Input type="file" accept=".jpg, .jpeg, .png" onChange={handleFileChange} />
                </div>
              </header>
              <div className="space-y-8">
                <Card>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">Prénom</Label>
                      <Input id="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Nom</Label>
                      <Input id="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Nom d&#39;utilisateur</Label>
                      <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="pt-6">
                <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-400">Modifier</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
