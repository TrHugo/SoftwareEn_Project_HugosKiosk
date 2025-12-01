export const articles = [
    {
        id: 1,
        publisher_id: 1,
        title: 'Introduction à Express', // Correction de 'titles' à 'title' pour uniformité
        content: 'Ceci est l\'article d\'introduction à Express et à sa structure modulaire.'
        // type =
    },
    {
        id: 102,
        publisher_id: 2,
        title: 'Gestion d\'erreurs Node.js',
        content: 'Exploration des middlewares de gestion d\'erreurs centralisés.'
        // type =
    }
];
export const clients = [
    {
        id: 1,
        name: 'Leo',
        email: "test@example.com",
        mdp: "test"
    }
]
export const publishers = [
    {
        id: 1,
        name: 'Hugo',
        email: "test@example.com",
        mdp: "test2"
    }
]



export const JETON_CODE = 'moHk9oFd-7ka4(lH_fK40';
export const publisher_profile_access= ['publisher']
export const user_profile_access= ['user']
export const JWT_EXPIRATION = '1h';