const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

const emotionalWords=[
"Amazing","Ultimate","Powerful","Secret","Mind-Blowing","Shocking","Incredible"
]

const curiosity=[
"You Won't Believe","Nobody Talks About","The Hidden Truth","Before It's Too Late","What Happens Next"
]

const formats=[
(topic)=>`10 ${topic} Hacks That Actually Work`,
(topic)=>`The Ultimate Guide to ${topic}`,
(topic)=>`How to Master ${topic}`,
(topic)=>`Beginner's Guide to ${topic}`,
(topic)=>`Top ${topic} Mistakes You Must Avoid`,
(topic)=>`${topic} Secrets Experts Don't Tell`
]

function random(arr){
return arr[Math.floor(Math.random()*arr.length)]
}

function calculateSEOScore(title){

let score=50

if(title.length<70) score+=10
if(/[0-9]/.test(title)) score+=10
if(title.includes("Ultimate")) score+=10
if(title.includes("Guide")) score+=10
if(title.includes("Secret")) score+=10

return Math.min(score,100)
}

app.post("/generate",(req,res)=>{

const {topic,audience,keyword,count}=req.body

let titles=[]

for(let i=0;i<count;i++){

const emotion=random(emotionalWords)
const cur=random(curiosity)
const format=random(formats)

let title=`${emotion} ${format(topic)} Using ${keyword} – ${cur}! Perfect for ${audience}`

let seo=calculateSEOScore(title)

titles.push({
title:title,
seo:seo
})

}

res.json({titles})

})

app.post("/outline",(req,res)=>{

const {topic}=req.body

const outline=[

`Introduction to ${topic}`,
`Why ${topic} is important`,
`Key benefits of ${topic}`,
`Best tools related to ${topic}`,
`Common mistakes beginners make`,
`Future trends of ${topic}`,
`Conclusion`

]

res.json({outline})

})

app.listen(5000,()=>{
console.log("Server running at http://localhost:5000")
})
