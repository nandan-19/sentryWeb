import {useEffect,useState} from "react"

export default function Article(){

const [article,setArticle] = useState(null)

useEffect(()=>{

fetch("http://localhost:5000/article")
.then(res=>res.json())
.then(data=>setArticle(data))

},[])

if(!article) return <p>Loading...</p>

return(

<div className="bg-white p-6 rounded shadow">

<h2 className="text-2xl font-bold mb-4">
{article.title}
</h2>

<p className="text-gray-700">
{article.content}
</p>

</div>

)

}
