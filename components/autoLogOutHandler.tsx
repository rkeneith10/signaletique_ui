"use client";

import { useEffect } from "react";
import { getSession } from "next-auth/react";
import {useRouter} from "next/navigation";

const AutoLogoutHandler = () => {

  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (!session) {
        router.push('/');
      }
    };

    checkSession();
  }, [router]);
}
export default AutoLogoutHandler;
