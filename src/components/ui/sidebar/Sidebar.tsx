"use client";
import Link from "next/link";
import { useUIStore } from "@/src/store";
//
import {
  IoCloseCircleOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoTicketOutline,
  IoAccessibilitySharp,
} from "react-icons/io5";
import clsx from "clsx";
import { logout}  from "../../../actions/auth/logout";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";



export const Sidebar = () => {
  const router = useRouter();
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const isSideMenuClose = useUIStore((state) => state.closeSideMenu);

  const {data: session } = useSession(); // 👈 reactivo automáticamente
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user.role==="admin";
  // console.log(isAdmin);

  // console.log(isAuthenticated)
  // const isAuthenticated = status === 'authenticated';

  return (
    <div>
      {/* background black */}
      {isSideMenuOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"></div>
      )}

      {/*blur*/}
      {isSideMenuOpen && (
        <div className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"></div>
      )}
      {/*sidemenu*/}

      <nav
        //TODO:efecto de slide
        className={clsx(
          "fixed p-5 right-0 top-0 w-[500] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
          {
            "translate-x-full": !isSideMenuOpen,
          },
        )}
      >
        <IoCloseCircleOutline
          size={50}
          className="h-8 absolute top-5 right-5 cursor-pointer"
          onClick={() => isSideMenuClose()}
        />
        {/*input */}
        <div className="relative mt-14">
          <IoSearchOutline size={30} className="absolute top-2 left-2" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
          />
        </div>
        {/*menu */}

      {isAuthenticated && (
        <>
          <Link
            href="/profile"
            onClick={() => isSideMenuClose()}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoPersonOutline size={30} />
            <span className="ml-3 text-xl">Perfil</span>
          </Link>
          <Link
            href="/orders"
            onClick={() => isSideMenuClose()}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoTicketOutline size={30} />
            <span className="ml-3 text-xl">Ordenes</span>
          </Link>
        </>
      )}

        {
          isAuthenticated &&(
          <button
          onClick={
            async ()=>{
              await logout();
              router.refresh();
              isSideMenuClose();
            }
          }
          className="flex w-full items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
          >
          <IoLogOutOutline size={30} />
          <span className="ml-3 text-xl">Salir</span>
          </button>
        )
        }
        {
          !isAuthenticated &&
          <Link
            href="/auth/login"
            onClick={()=>{
              router.refresh();
              isSideMenuClose()}}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoLogInOutline size={30} />
            <span className="ml-3 text-xl">Ingresar</span>
          </Link>
        }
        <div className="w-full h-px bg-gray-200 my-10" />
        {
        isAdmin &&
          <>
            <Link
              href="/admin/products"
              onClick={()=>{isSideMenuClose()}}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoAccessibilitySharp size={30} />
              <span className="ml-3 text-xl">Productos</span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
              onClick={()=>{isSideMenuClose()}}
            >
              <IoTicketOutline size={30} />
              <span className="ml-3 text-xl">Ordenes</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
              onClick={()=>{isSideMenuClose()}}
            >
              <IoPeopleOutline size={30} />
              <span className="ml-3 text-xl">Usuarios</span>
            </Link>
          </>
        }


      </nav>
    </div>
  );
};
