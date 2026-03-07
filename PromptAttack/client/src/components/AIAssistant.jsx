import {useState} from "react"

export default function AIAssistant(){

const [output,setOutput] = useState("")

function runAI(){

const pageContent = document.body.innerText

const result = "Summary: This article explains how automation improves developer productivity."

setOutput(result)

}

return(

<div className="bg-gray-100 p-6 mt-6 rounded">

<h3 className="text-lg font-semibold mb-2">
AI Assistant
</h3>

<button
onClick={runAI}
className="bg-blue-500 text-white px-4 py-2 rounded"
>
Summarize Article
</button>

<div className="mt-4 p-4 bg-white rounded">
{output}
</div>

</div>

)

}
