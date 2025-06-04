import { Content } from "./components/dashboard/Content";
import { VisitorPage } from "./pages/visitor/visitorPage";
import { AuthPage } from "./pages/auth/AuthPage";
import { VerifyEmail } from "./components/auth/VerifyEmail";
import { UsersPage } from "./components/users/UsersPage"
import { AccountsPage } from "./components/accounts/AccountsPage";
import { TransfersPage } from "./components/transfers/TransfersPage"

export const routes = [
    { path: "/bancavirtual/acceso", element: <AuthPage /> },
    { path: "/bancavirtual/acceso/verificación", element: <VerifyEmail /> },
    {
        path: "/bancavirtual",
        element: <Content />,
        children: [
        { path: "usuarios", element: <UsersPage /> },
        { path: "cuentas", element: <AccountsPage /> },
        { path: "transferencias", element: <TransfersPage /> }
        ],
    },
    { path: "/", element: <VisitorPage /> },
];