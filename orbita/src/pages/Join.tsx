import { useEffect } from "react";
import { useFetchUserProfile } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";

export default function Join({ modal }: { modal: React.ReactNode }) {
  const navigate = useNavigate();

  const { data: authenticatedUser, isSuccess } = useFetchUserProfile();

  useEffect(() => {
    if (isSuccess && authenticatedUser !== null) {
      navigate(`/u/${authenticatedUser.username}`);
    }
  }, [authenticatedUser]);

  return <div className="contained pt-[120px]">{modal}</div>;
}
