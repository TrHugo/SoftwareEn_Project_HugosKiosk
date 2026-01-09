import React, { useState, useEffect } from 'react';

export default function Info() {
    const [infoData, setInfoData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const response = await fetch('/api/info'); 
                
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const data = await response.json();
                
                setInfoData(data);
            } catch (err) {
                console.error("Error:", err);
                setError(err.message);
            } 
        };

        fetchInfo();
        
    }, []); 

    if (error) {
        return <h1>Erreur : Impossible de charger les données ({error})</h1>;
    }

    return (
        <div>
            <h2>Informations du Backend</h2>
            {infoData && (
                <ul>
                    <li><strong>Nom de l'App :</strong> {infoData.name}</li>
                    <li><strong>Version :</strong> {infoData.version}</li>
                    <li><strong>Node.js Version :</strong> {infoData.node}</li>
                    <li><strong>Uptime (Temps d'activité) :</strong> {infoData.uptime}</li>
                </ul>
            )}
            {!infoData && <p>Aucune donnée disponible.</p>}
        </div>
    );
}