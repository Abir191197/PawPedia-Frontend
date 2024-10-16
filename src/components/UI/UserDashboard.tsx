"use client"; // Client-side rendering


import { Menu, Popover, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

import {  useLogout } from "@/hooks/useAuth";


const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20101%20101%22%3E%3Cpath%20d%3D%22M50.4%2054.5c10.1%200%2018.2-8.2%2018.2-18.2S60.5%2018%2050.4%2018s-18.2%208.2-18.2%2018.2%208.1%2018.3%2018.2%2018.3zm0-31.7c7.4%200%2013.4%206%2013.4%2013.4s-6%2013.4-13.4%2013.4S37%2043.7%2037%2036.3s6-13.5%2013.4-13.5zM18.8%2083h63.4c1.3%200%202.4-1.1%202.4-2.4%200-12.6-10.3-22.9-22.9-22.9H39.3c-12.6%200-22.9%2010.3-22.9%2022.9%200%201.3%201.1%202.4%202.4%202.4zm20.5-20.5h22.4c9.2%200%2016.7%206.8%2017.9%2015.7H21.4c1.2-8.9%208.7-15.7%2017.9-15.7z%22%2F%3E%3C%2Fsvg%3E",
};

const navigation = [
  { name: "Home", href: "/user", current: true },
  { name: "My Content", href: "/user/MyContent", current: false },
  { name: "Nutrition Calculate", href: "/user/Nutrition", current: false },
];


const userNavigation = [
 
  { name: "Sign out", href: "/logout" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function UserDashboard() {
  const router = useRouter();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout();

      // Redirect to the login page or home page
      router.push("/login"); // or wherever you want to redirect after logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle any errors here, maybe show a notification to the user
    }
  };

  return (
    <div className="min-h-full">
      <Popover as="header" className="bg-indigo-500 pb-24 scroll-smooth ">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 ">
              <div className="relative flex items-center justify-center py-5 lg:justify-between">
                {/* Logo */}
                <div className="absolute left-0 flex-shrink-0 lg:static">
                  <a href="#">
                    <span className="sr-only">Your Company</span>
                    <Image
                      className="h-8 w-auto"
                      src="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20256%20256%22%3E%3Crect%20width%3D%22256%22%20height%3D%22256%22%20fill%3D%22none%22%2F%3E%3Ccircle%20cx%3D%22212%22%20cy%3D%22108%22%20r%3D%2220%22%20opacity%3D%22.2%22%2F%3E%3Ccircle%20cx%3D%2244%22%20cy%3D%22108%22%20r%3D%2220%22%20opacity%3D%22.2%22%2F%3E%3Ccircle%20cx%3D%2292%22%20cy%3D%2260%22%20r%3D%2220%22%20opacity%3D%22.2%22%2F%3E%3Ccircle%20cx%3D%22164%22%20cy%3D%2260%22%20r%3D%2220%22%20opacity%3D%22.2%22%2F%3E%3Cpath%20d%3D%22M183.23572%2C155.85352a43.541%2C43.541%2C0%2C0%2C1-20.667-25.90381l-.00092.001a35.9985%2C35.9985%2C0%2C0%2C0-69.13562%2C0l-.00092-.001a43.541%2C43.541%2C0%2C0%2C1-20.667%2C25.90381%2C32.00736%2C32.00736%2C0%2C0%2C0%2C27.72266%2C57.61767%2C72.51938%2C72.51938%2C0%2C0%2C1%2C55.02612%2C0%2C32.00679%2C32.00679%2C0%2C0%2C0%2C27.72266-57.61767Z%22%20opacity%3D%22.2%22%2F%3E%3Ccircle%20cx%3D%22212%22%20cy%3D%22108%22%20r%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%2216%22%2F%3E%3Ccircle%20cx%3D%2244%22%20cy%3D%22108%22%20r%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%2216%22%2F%3E%3Ccircle%20cx%3D%2292%22%20cy%3D%2260%22%20r%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%2216%22%2F%3E%3Ccircle%20cx%3D%22164%22%20cy%3D%2260%22%20r%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%2216%22%2F%3E%3Cpath%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%2216%22%20d%3D%22M183.23572%2C155.85352a43.541%2C43.541%2C0%2C0%2C1-20.667-25.90381l-.00092.001a35.9985%2C35.9985%2C0%2C0%2C0-69.13562%2C0l-.00092-.001a43.541%2C43.541%2C0%2C0%2C1-20.667%2C25.90381%2C32.00736%2C32.00736%2C0%2C0%2C0%2C27.72266%2C57.61767%2C72.51938%2C72.51938%2C0%2C0%2C1%2C55.02612%2C0%2C32.00679%2C32.00679%2C0%2C0%2C0%2C27.72266-57.61767Z%22%2F%3E%3C%2Fsvg%3E"
                      alt="Your Company"
                      width={32}
                      height={32}
                    />
                  </a>
                </div>

                {/* Right section on desktop */}
                <div className="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5 ">
                  <button
                    type="button"
                    className="flex-shrink-0 rounded-full p-1 text-indigo-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-4 flex-shrink-0">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white text-sm ring-2 ring-white ring-opacity-20 focus:outline-none focus:ring-opacity-100">
                        <span className="sr-only">Open user menu</span>
                        <Image
                          className="h-8 w-8 rounded-full"
                          src={user.imageUrl}
                          alt=""
                          width={32}
                          height={32}
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95">
                      <Menu.Items className="absolute -right-2 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) =>
                              item.name === "Sign out" ? (
                                <a
                                  href="#"
                                  onClick={handleLogout}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}>
                                  {item.name}
                                </a>
                              ) : (
                                <Link
                                  href={item.href || "#"}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}>
                                  {item.name}
                                </Link>
                              )
                            }
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>

             

                {/* Menu button */}
                <div className="absolute right-0 flex-shrink-0 lg:hidden">
                  {/* Mobile menu button */}
                  <Popover.Button className="inline-flex items-center justify-center rounded-md bg-transparent p-2 text-indigo-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Popover.Button>
                </div>
              </div>
              <div className="   hidden border-t border-white border-opacity-20 py-5 lg:block  ">
                <div className=" grid grid-cols-3 items-center gap-8">
                  <div className="col-span-2">
                    <nav className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current ? "text-white" : "text-indigo-100",
                            "rounded-md bg-white bg-opacity-0 px-3 py-2 text-sm font-medium hover:bg-opacity-10"
                          )}
                          aria-current={item.current ? "page" : undefined}>
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                  </div>
                  <div>
                  
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Popover>
    </div>
  );
}
