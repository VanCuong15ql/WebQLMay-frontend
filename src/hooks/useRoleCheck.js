import { useCallback } from 'react';

const useRoleCheck = () => {
  const role = localStorage.getItem("role");

  const checkRole = useCallback(() => {
    if (role !== "edit") {
      window.alert("Bạn chưa được cấp quyền");
      return false;
    }
    return true;
  }, [role]);

  return checkRole;
};

export default useRoleCheck;