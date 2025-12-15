const article = "How name work"

let view = 0
let public = false

function greetArticle( name, number) {
    if (public) {
        return "Welcome to ${ name } article! We have ${ number } views. ";
    }
    else{
        return "${ name } is not open to the public!";
    }
}
console.log(greetArticle(article, view))

const articles=[
    "How name work","How hugo work","How leo work",
    "How pa work","How he work",
]

for (const article of articles){
    console.log(article)
}
articles.push("ME, I love you!")
findArticles = (name) => {
    for (const article of articles){
            if (article==name)
            {
                return "ARticle found"
            }
    }
    return "Article not found"
}


const user = {
name : " Alice Martin ",
age : 34 ,
email :  "hugo@gaimeCetteFylle.fr",
articles : [{ name : "Dr. Lee ", genre : " Medecine " },
            { name : "hugo really ", genre : " Medecine " }]
};

console.log(user.articles[0].name); 
console.log(user.articles.lenght)
console.log(user.name, " has written", user.articles[0].name)

const nouvelArticle = {
    name: "La s",
    genre: "Technologie"
};