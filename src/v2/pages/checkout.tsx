import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

export default function CheckoutLayout() {
  const navigate = useNavigate();

  // If user opens root /checkout directly, redirect to subscriptions
  useEffect(() => {
    if (window.location.pathname === "/v2/checkout" || window.location.pathname === "/v2/checkout/") {
      navigate("/v2/subscription", { replace: true });
    }
  }, [navigate]);

  return <Outlet />;
}
