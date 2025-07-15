import { Content } from "./components/dashboard/Content";
import { VisitorPage } from "./pages/visitor/visitorPage";
import { AuthPage } from "./pages/auth/AuthPage";
import { VerifyEmail } from "./components/auth/VerifyEmail";
import { UsersPage } from "./components/users/UsersPage"
import { AccountsPage } from "./components/accounts/AccountsPage";
import { MyAccountsPage } from "./components/accounts/MyAccountsPage";
import { DepositPage } from "./components/transfers/DepositPage";
import DeleteMyAccount from "./components/accounts/DeleteMyAccount";
import { TransfersPage } from "./components/transfers/TransfersPage"
import { HistorialPage } from "./components/transfers/HistorialPage";
import { MyFavoritePage } from "./components/accounts/MyFavoritePage";

export const routes = [
    { path: "/bancavirtual/acceso", element: <AuthPage /> },
    { path: "/bancavirtual/acceso/verificación", element: <VerifyEmail /> },
    {
        path: "/bancavirtual",
        element: <Content />,
        children: [
        { path: "usuarios", element: <UsersPage /> },
        { path: "cuentas", element: <AccountsPage /> },
        { path: "mis-cuentas", element: <MyAccountsPage /> },
        { path: "transferencias", element: <TransfersPage /> },
        { path: "cuentas/eliminar/:id", element: <DeleteMyAccount /> },
        { path: "depositos", element: <DepositPage /> },
        { path: "my-favorites", element: <MyFavoritePage /> },
        { path: "my-historial/:noAccount", element: <HistorialPage /> },
        ],
    },
    { path: "/", element: <VisitorPage /> },
];