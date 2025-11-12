import { Sidebar } from "../components/Sidebar";

export default function Layout({ children }) {
    return (
        <>
            <Sidebar />
            <main className="flex-1 p-4 ml-64">{children}</main>
        </>
    );
}