import { useEffect, useState } from "react";
import { getCurrentUser } from "@/actions/user";

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          setUserError("User not authenticated");
          setLoadingUser(false);
          return;
        }

        const user = await getCurrentUser(token);
        if (!user) {
          setUserError("Failed to retrieve user information");
        } else {
          setCurrentUser(user);
        }
      } catch (err) {
        console.error("Error fetching current user:", err);
        setUserError(err.message || "Failed to fetch user");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  return { currentUser, loadingUser, userError };
}
