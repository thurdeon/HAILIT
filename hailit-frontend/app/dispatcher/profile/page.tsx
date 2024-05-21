"use client";

//next, redux, react, and supabase
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { supabaseSignOut } from "@/lib/supabaseAuth";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { setAuthState } from "@/lib/store/authSlice";
import { logUserOut } from "@/lib/store/userSlice"
import { useRouter } from "next/navigation";

//ui + icons
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RiLockPasswordFill, RiLockPasswordLine } from "react-icons/ri";
import { FiChevronRight } from "react-icons/fi";
import { RiFileListFill, RiFileListLine } from "react-icons/ri";
import { MdFeedback, MdOutlineFeedback } from "react-icons/md";
import { IoIosHelpCircle, IoIosHelpCircleOutline } from "react-icons/io";
import {
  MdSportsMotorsports,
  MdOutlineSportsMotorsports,
} from "react-icons/md";
import {
  IoDocumentText,
  IoDocumentTextOutline,
  IoLogOut,
  IoLogOutOutline,
  IoShareSocialOutline,
  IoShareSocial,
} from "react-icons/io5";
import { PiUserCircle, PiUserCircleFill } from "react-icons/pi";
import { FaMotorcycle } from "react-icons/fa";
//main components
import TopSectionContainer from "@/components/Shared/TopSectionContainer";
import MiddleSectionContainer from "@/components/Shared/MiddleSectionContainer";
import { ThemeToggle } from "@/components/Theme/ThemeToggle";
import ChangePassword from "@/components/Profile/ChangePassword";
import Feedback from "@/components/Profile/Feedback";
import CustomerHelp from "@/components/Profile/CustomerHelp";
import ShareHailit from "@/components/Profile/ShareHailit";
import PrivacyPolicy from "@/components/Profile/PrivacyPolicy";



export type CurrentTheme = string | undefined;

export default function DispatcherProfile() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  //getting data from redux store
  const {authenticationState} = useAppSelector((state)=>state.auth);
  const {first_name, email, last_name, onboard} = useAppSelector((state)=>state.user);

  if(authenticationState && !onboard) {
    router.push('/onboarding')
  }

  //setting theme
  const { theme, setTheme, systemTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<CurrentTheme>("system"); // Default theme
  

  //signOut
  const handleSignOut = ()=> {
    dispatch(logUserOut())
    supabaseSignOut();
    dispatch(setAuthState(false));

  }  

  
  //setting current theme. Not using useEffect result in hydration errors
  useEffect(() => {
    const preferredTheme: CurrentTheme =
      localStorage.getItem("theme") || systemTheme || theme;
    setCurrentTheme(preferredTheme);
  }, [currentTheme]);

  const handleThemeChange = () => {
    setCurrentTheme(theme === "dark" ? "light" : "dark");
    setTheme(theme === "dark" ? "light" : "dark");
  };

  //repeated classes
  const iconsAndTextMainContainerClass = "flex flex-col gap-2 md:w-96 md:text-3xl";
  const iconsAndTextDivClass =
    "flex justify-between items-center p-2 font-bold group hover:bg-blue-500 hover:text-white rounded-md cursor-pointer";
  const iconsAndTextSpanClass =
    "flex items-center justify-center gap-2 relative";
  const iconOutlineClass = "text-2xl group-hover:opacity-0";
  const iconFillClass =
    "text-2xl opacity-0 absolute top-0 left-0  group-hover:opacity-100";
  const iconTextClass = "text-sm";
  const dialogContentClass = "max-w-[350px] sm:max-w-[425px]";

  return (
    <>
      <main className="flex min-h-screen flex-col items-center gap-10 mb-32">
        
        { (
          <>
          
        <TopSectionContainer className="justify-center items-center">
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="flex items-center justify-center">
              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 w-16 h-16 rounded-full"></span>
              <p className="absolute z-10 font-bold ">R</p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="flex flex-col items-center gap-1 text-white">
                <h2 className="text-2xl font-semibold">Rama Agyenim</h2>
                <p className={iconTextClass}>rama@agyenim.rider</p>
                <p className={`${iconTextClass} text-center mt-2 font-bold`}>Assigned Vehicle</p>
                <div className="flex items-center justify-center gap-2">
                <FaMotorcycle className="text-xl"/>
                <p className="text-sm">AS-M5-2024</p>
                </div>
              </div>
            </div>
          </div>
        </TopSectionContainer>

        <MiddleSectionContainer className="flex flex-col gap-3 bg-white w-full -mt-20 rounded-tr-[50px] p-5 md:items-center md:justify-center">
          {/* Account section */}
          <h2 className="font-bold text-md"> Account</h2>

          <div className={iconsAndTextMainContainerClass}>
            
            <Link href={"/profile/edit-profile"}>
              <div className={iconsAndTextDivClass}>
                <span className={iconsAndTextSpanClass}>
                  <PiUserCircle className={iconOutlineClass} />
                  <PiUserCircleFill className={iconFillClass} />
                  <p className={iconTextClass}>Edit profile</p>
                </span>
                <FiChevronRight className="md:hidden"/>
              </div>
            </Link>

            <Dialog>
              <DialogTrigger className={iconsAndTextDivClass}>
                <span className={iconsAndTextSpanClass}>
                  <RiLockPasswordLine className={iconOutlineClass} />
                  <RiLockPasswordFill className={iconFillClass} />
                  <p className={iconTextClass}> Change password </p>
                </span>
                <FiChevronRight className="md:hidden"/>
              </DialogTrigger>
              <DialogContent className={dialogContentClass}>
                <ChangePassword />
              </DialogContent>
            </Dialog>

            

            <div className={iconsAndTextDivClass}>
              <span className={iconsAndTextSpanClass}>
                <IoLogOutOutline className={iconOutlineClass} />
                <IoLogOut className={iconFillClass} />
                <p onClick={handleSignOut} className={iconTextClass}> Sign out </p>
              </span>
              <FiChevronRight className="md:hidden"/>
            </div>
          </div>
          
          {/* General Section */}
          <h2 className="font-bold text-md mt-2"> General</h2>
          <div className={`${iconsAndTextDivClass} md:hidden`} onClick={handleThemeChange}>
            <span className={iconsAndTextSpanClass}>
              <ThemeToggle />
              <p className={iconTextClass}>
                {currentTheme === "light" ? "Dark mode" : "Light mode"}
              </p>
            </span>
            <FiChevronRight className="md:hidden"/>
          </div>

          <div className={iconsAndTextMainContainerClass}>
            <Dialog>
              <DialogTrigger className={iconsAndTextDivClass}>
                <span className={iconsAndTextSpanClass}>
                  <IoDocumentTextOutline className={iconOutlineClass} />
                  <IoDocumentText className={iconFillClass} />
                  <p className={iconTextClass}> Privacy policy </p>
                </span>
                <FiChevronRight className="md:hidden"/>
              </DialogTrigger>
              <DialogContent className={dialogContentClass}>
                <ScrollArea className="max-h-[500px] max-w-[300px]  rounded-md">
                  <PrivacyPolicy />
                </ScrollArea>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger className={iconsAndTextDivClass}>
                <span className={iconsAndTextSpanClass}>
                  <MdOutlineFeedback className={iconOutlineClass} />
                  <MdFeedback className={iconFillClass} />
                  <p className={iconTextClass}> Send feedback </p>
                </span>
                <FiChevronRight className="md:hidden"/>
              </DialogTrigger>
              <DialogContent className={dialogContentClass}>
                <Feedback />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger className={iconsAndTextDivClass}>
                <span className={iconsAndTextSpanClass}>
                  <IoIosHelpCircleOutline className={iconOutlineClass} />
                  <IoIosHelpCircle className={iconFillClass} />
                  <p className={iconTextClass}> Help </p>
                </span>
                <FiChevronRight className="md:hidden"/>
              </DialogTrigger>
              <DialogContent className={dialogContentClass}>
                <CustomerHelp />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger className={iconsAndTextDivClass}>
                <span className={iconsAndTextSpanClass}>
                  <IoShareSocialOutline className={iconOutlineClass} />
                  <IoShareSocial className={iconFillClass} />
                  <p className={iconTextClass}> Share Hailit </p>
                </span>
                <FiChevronRight className="md:hidden"/>
              </DialogTrigger>
              <DialogContent className={dialogContentClass}>
                <ShareHailit />
              </DialogContent>
            </Dialog>

          </div>
        </MiddleSectionContainer>
        </>
)}      </main>
    </>
  );
}