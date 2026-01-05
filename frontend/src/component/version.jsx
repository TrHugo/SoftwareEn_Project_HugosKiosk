import React, { useState, useEffect } from 'react';

export default function Version() {
    const [VersionData, setVersionData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const response = await fetch('/api/version'); 
                
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const data = await response.json();
                
                setVersionData(data);
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
            <h2>Version</h2>
            {VersionData && (
                <ul>
                    <strong>Nom de l'App :</strong> {VersionData.version}
                </ul>
            )}
            {!VersionData && <p>Aucune donnée disponible.</p>}
        </div>
    );
}