"use client"
import axios from "axios";
import { Form, 
    FormControl,
    FormDescription,
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";//form
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm } from "react-hook-form";

import { useToast } from "@/components/ui/use-toast";

const formSchema=z.object({
    jd:z.string().min(20,{
        message:"JD is Required atleast 20 characters"
    }),
    file:z.instanceof(FileList).optional(),
    
})

const JdValidation=()=>{
    //hooks for toasters
    const {toast}=useToast();
     //form controller
     const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            jd:""
        }
        
    })
    const fileRef = form.register("file");
    //loading state of the from controller
    const isLoading=form.formState.isSubmitting;
     //action
     const onSubmit=async(values:z.infer<typeof formSchema>)=>{
        try{
           
            const response=await axios.post("/api/jd-match/",values)
            const generated_script=response.data.generated_script
            console.log(generated_script)
            //setScript(true)
            
           /* toast({
                description:"Success"
            });*/

            
            //router.refresh(); //its gng to refresh all server components
            //all server components refect the data from db ensuring that we loaded created/edited companion
            //router.push("/") //push to home
        }catch(error){
            toast({
                variant:"destructive",
                description:"Something went wrong"
            })
        }
    }
    return(
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {/*1*/}
                <FormField 
                    name="jd"
                    control={form.control}
                    render={({field})=>(
                    <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Paste the JD</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Type your message here."
                                {...field}/>
                        </FormControl>
                    </FormItem>
                )}
                />
                {/*2*/}
                <FormField
                name="file"
                control={form.control} 
                render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Upload your Resume</FormLabel>
                            <FormControl>
                                <Input type="file" accept=".pdf" {...fileRef}/>
                        </FormControl>
                </FormItem>
                )}
                />
                
                </div>

                <div className="w-full flex justify-center">
                            <Button size="lg" disabled={isLoading}>
                                    Profile matching with JD          
                            </Button>

                </div>
                </form>
            </Form>
        </div>
    )
}
export default JdValidation;