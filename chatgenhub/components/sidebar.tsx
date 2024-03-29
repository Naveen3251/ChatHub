"use client"
import { cn } from "@/lib/utils";
import { Home, BrainCircuit,Video, ScanEye} from "lucide-react";
//for navigation 
import { usePathname,useRouter } from "next/navigation";

export const Sidebar=()=>{
     //it tracks the url path where we are in
     const pathname=usePathname();
     //routers
     const router=useRouter();
 
     //creating subroutes
     const routes=[
         {
             icon:Home,
             href:'/',
             label:"Home",
          
         },
         {
             icon:BrainCircuit,
             href:'/websitechat',
             label:"Chat",
          
         },
         {
            icon:Video,
            href:'/video-creation',
            label:"Video"
         },
         {
            icon:ScanEye,
            href:'/jd-validation',
            label:"JD"
         }
     ]
 
     //for navigation
     const onNavigate=(url:string)=>{
         return router.push(url);
     }
    return(
        <div className="space-y-4 bg-secondary text-primary h-full flex flex-col">
            <div className="p-3 flex-1 justify-center">
                <div className="space-y-2">
                {routes.map((route) => (
                        <div
                            onClick={()=>onNavigate(route.href)}
                            key={route.href}
                            className={cn(
                                "text-muted-foreground text-xs group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg",
                                pathname === route.href && "bg-primary/10 text-primary"
                            )}
                        >
                            <div className="flex flex-col gap-y-2 items-center flex-1">
                                <route.icon className="h-5 w-5" />
                                {route.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>  
        </div>
    )
}