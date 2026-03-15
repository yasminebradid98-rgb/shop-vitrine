"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Order() {

const [form,setForm] = useState({})

const submit = async(e)=>{
e.preventDefault()

await supabase.from("orders").insert([form])

alert("Commande envoyée")
}

return(

<form onSubmit={submit} className="max-w-md mx-auto p-10 space-y-4">

<input placeholder="Nom"
onChange={e=>setForm({...form,nom:e.target.value})}
className="border p-2 w-full"/>

<input placeholder="Prénom"
onChange={e=>setForm({...form,prenom:e.target.value})}
className="border p-2 w-full"/>

<input placeholder="Téléphone"
onChange={e=>setForm({...form,telephone:e.target.value})}
className="border p-2 w-full"/>

<input placeholder="Wilaya"
onChange={e=>setForm({...form,wilaya:e.target.value})}
className="border p-2 w-full"/>

<input placeholder="Commune"
onChange={e=>setForm({...form,commune:e.target.value})}
className="border p-2 w-full"/>

<button className="bg-black text-white px-4 py-2 rounded">
Commander
</button>

</form>

)

}