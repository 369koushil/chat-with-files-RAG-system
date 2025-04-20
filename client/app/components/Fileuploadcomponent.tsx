"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

const Fileuploadcomponent: React.FC = () => {

    const handlefileuploadonclick = () => {
        const input = document.createElement("input")
        input.setAttribute("type","file")
        input.setAttribute("accept","application/pdf")
        input.addEventListener("change",async(e:Event)=>{
            const target = e.target as HTMLInputElement
            if(target.files&&target.files.length>0){
             
                const file=target.files.item(0)
                if(file){
                    const formData=new FormData()
                    formData.append("file",file)
                    await fetch("http://localhost:4000/uploadfile",
                        {
                            method:'POST',
                            body:formData
                        }
                    )
                    console.log("file uploaded")
                }
                
               
            }
        })
        input.click()
    }
    return (
        <>
            <div>
                <Button onClick={handlefileuploadonclick} className="destructive"><Upload />
                    Upload files
                </Button>
            </div>
        </>
    )
}

export default Fileuploadcomponent
