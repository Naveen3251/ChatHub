"use client"
import axios from "axios";
//routers
import { useRouter } from "next/navigation";
//react hook
import { useState } from "react";

//form validation
import * as z from "zod";
import {useForm } from "react-hook-form";//hook
import {zodResolver} from "@hookform/resolvers/zod";
import { Form, 
    FormControl,
    FormDescription,
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";//form

//ui
import { Separator } from "@/components/ui/separator";

import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue  } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

//lucide
import { Wand2 } from "lucide-react";
import { ScriptDisplay } from "@/components/script-display";




const formSchema=z.object({
    topic:z.string().min(4,{
        message:"Topic is Required"
    }),
    instructions:z.string(),
    duration:z.number().max(120,{
        message:"Maximum 120s of video can generate"
    }),
    language:z.string(),
    images:z.number().max(12,{
        message:"Maximum upto 12 images"
    }),
    genre:z.string()
    

})

const generated_script={
    "video_title": "The Impact of IoT on the Environment",
    "video_description": "Discover how the Internet of Things (IoT) is revolutionizing the way we interact with our environment. From smart homes to sustainable cities, this video explores the positive impact of IoT on our planet.",
    "scripts": {
        "part1": {
            "text": "Welcome to our video on the Internet of Things and its impact on the environment. In today's interconnected world, IoT devices are transforming the way we live and interact with our surroundings.",
            "image": "An animated cityscape with smart devices and sensors integrated into buildings and infrastructure."
        },
        "part2": {
            "text": "One of the key areas where IoT is making a difference is in energy efficiency. Smart homes equipped with IoT devices can monitor and optimize energy consumption, reducing waste and lowering carbon footprints.",
            "image": "A futuristic house with IoT-enabled appliances, such as smart thermostats, energy-efficient lighting, and solar panels."
        },
        "part3": {
            "text": "IoT is also playing a crucial role in waste management. Smart bins equipped with sensors can monitor waste levels and optimize collection routes, reducing unnecessary trips and minimizing fuel consumption.",
            "image": "A smart waste bin with sensors and a waste collection truck optimized for efficient route planning."
        },
        "part4": {
            "text": "In agriculture, IoT is revolutionizing farming practices. Smart irrigation systems can monitor soil moisture levels and weather conditions, ensuring optimal water usage and preventing water wastage.",
            "image": "A farm with IoT-enabled irrigation systems, weather sensors, and automated crop monitoring."
        },
        "part5": {
            "text": "Lastly, IoT is contributing to the development of sustainable cities. Smart transportation systems, intelligent street lighting, and real-time air quality monitoring are just a few examples of how IoT is creating greener and more livable urban environments.",
            "image": "A cityscape with smart transportation systems, energy-efficient street lighting, and sensors measuring air quality."
        }
    }
}
const VideoForm =() => {
    //hooks for toasters
    const {toast}=useToast();

    //router
    const router=useRouter();

    const[script,setScript]=useState(false);

    //form controller
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            topic:"",
            instructions:"",
            duration:30,
            language:undefined, //bcz: it is select component
            images:5,
            genre:""
            
        }
    })

    //loading state of the from controller
    const isLoading=form.formState.isSubmitting;


    //languages
    const categories:Array<any>=["en","hi"]

    //action
    const onSubmit=async(values:z.infer<typeof formSchema>)=>{
        try{
            //creating new companion functionality
            /*const response=await axios.post("http://localhost:5000/script",values)
            const generated_script=response.data.generated_script
            console.log(generated_script)*/
            setScript(true)
            
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


    
    return ( 
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
            {!script && <Form {...form}>   
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">
                                Video Generation
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                General information about video to generate
                            </p>
                        </div>
                        <Separator className="bg-primary/10"/>
                    </div>
                    {/*fields*/}
                   
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/*1*/}
                        <FormField 
                            name="topic"
                            control={form.control}
                            render={({field})=>(
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Topic of video</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={isLoading}
                                            placeholder="eg: Facts about Human psychology"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is the topic of content to generate your video
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}      
                        />
                        {/*2*/}
                        <FormField 
                            name="instructions"
                            control={form.control}
                            render={({field})=>(
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Instructions</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={isLoading}
                                            placeholder="eg: Start with pleasant intro"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Instructions about create Video(Optional)
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}      
                        />
                        {/*3*/}
                        <FormField 
                            name="duration"
                            control={form.control}
                            render={({field})=>(
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Duration</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number"
                                            disabled={isLoading}
                                            placeholder="eg: 30"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Duration of Video(in seconds)
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}      
                        />
                        {/*4*/}
                        <FormField 
                            name="language"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Language</FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="bg-background">
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Select a language"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category)=>(
                                                <SelectItem
                                                    value={category}
                                                >
                                                    {category}

                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Select a Language for your video
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>

                            )}      
                        />
                        {/*5*/}
                        <FormField 
                            name="images"
                            control={form.control}
                            render={({field})=>(
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Images</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number" 
                                            disabled={isLoading}
                                            placeholder="eg: 5"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Number of images to render in your video
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}      
                        />
                        {/*6*/}
                        <FormField 
                            name="genre"
                            control={form.control}
                            render={({field})=>(
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Genre</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={isLoading}
                                            placeholder="eg: Scary | Casual etc.."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The genre for the script(Optional)
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}      
                        />
                    <Separator className="bg-primary/10"/>
                    </div>
                     {/*second section 1st field*/}
                     
                        <div className="w-full flex justify-center">
                            <Button size="lg" disabled={isLoading}>
                                    Create your Video
                                <Wand2 className="w-4 h-4 ml-2"/>
                            </Button>

                        </div>
                </form>
            </Form>
        }
        {script&&
            <ScriptDisplay {...generated_script}/>
        }
        </div>
     );
}
 
export default VideoForm;