"use client"
import { UserButton } from "@clerk/nextjs";

import { Menu } from "lucide-react"
import Link from "next/link";

//to work with 2 param of class param1:fixed class names and param2:dynamic class names
import {cn} from "@/lib/utils";
//font
import { Poppins } from "next/font/google";
import { ModeToggle } from "./mode-toggle";

//font
const font=Poppins({
    weight:"600",
    subsets:["latin"]
})

export const Navbar=()=>{
    return(
        <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 
        border-b border-primary/10 bg-secondary h-16">
            <div className="flex items-center">
                <Menu className="block md:hidden"/>
                <Link href='/'>
                    <h1 className={cn(
                        "hidden md:block text-xl md:text-3xl font-bold text-primary",
                        font.className
                        )}>
                        ChatHub
                    </h1>
                </Link>
            </div> 
             <div className="flex items-center gap-x-3">
                <ModeToggle/>
                <UserButton/>
                
             </div>
        </div>
    )
}