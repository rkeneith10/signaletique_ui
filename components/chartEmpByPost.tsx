/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDataApi } from "@/lib/action";
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis } from 'recharts';

interface ChartData {
  post: string;
  count: number;
  fill: string;
}

interface Post {
  id: string;
  post_name: string;
}

const ChartEmpByPost = () => {
  const [employes, setEmployes] = useState([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);  // Utilisation cohérente de 'posts'

  // Fonction pour récupérer et transformer les données des employés
  function getEmployeeCountByPost(employes: any, posts: Post[]): ChartData[] {
    const colors = [
      "#FF5733", // Couleur 1
      "#334", // Couleur 2
      "#3357FF", // Couleur 3
      "#F3FF33", // Couleur 4
      "#FF33F6", // Couleur 5
      "#33FFF0", // Couleur 6
    ];

    const postCountMap: Record<string, number> = {};

    employes.forEach((employe: any) => {
      employe.posts.forEach((postId: any) => {
        postCountMap[postId] = (postCountMap[postId] || 0) + 1;
      });
    });

    return Object.entries(postCountMap).map(([postId, count], index) => {
      const post = posts.find((p) => p.id === postId);
      return {
        post: post ? post.post_name : `ID: ${postId}`,
        count,
        fill: colors[index % colors.length], // Cycle à travers les couleurs
      };
    });
  }


  // Effect pour récupérer les données des employés et des postes
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetchDataApi('posts') 
        setPosts(response);  // Supposons que chaque élément contient { id, post_name }
      } catch (error) {
        console.error('Erreur lors de la récupération des postes:', error);
      }
    };
    fetchPosts();

    const fetchEmployees = async () => {
      try {
        const response = await fetchDataApi('employees')
        setEmployes(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mettre à jour chartData lorsque employes et posts sont disponibles
  useEffect(() => {
    if (employes.length > 0 && posts.length > 0) {
      setChartData(getEmployeeCountByPost(employes, posts));
    }
  }, [employes, posts]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nombre d&#39;employés par poste
        </CardTitle>
        <CardDescription>Statistiques des employés répartis par poste</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart width={600} height={300} data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="post" tickLine={false} tickMargin={10} axisLine={false} />
          <Tooltip cursor={false} />
          <Bar dataKey="count" fill="#8884d8" radius={8} />
        </BarChart>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium leading-none">
          Nombre d&#39; employés par poste
        </div> */}
        {/* <div className="leading-none text-muted-foreground">
          Statistiques actuelles des employés dans l entreprise
        </div> */}
      </CardFooter>
    </Card>
  );
};

export default ChartEmpByPost;
