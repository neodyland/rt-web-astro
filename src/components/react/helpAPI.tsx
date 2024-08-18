import React, { useState, useEffect } from 'react';

const APIResponseComponent = () => {
    const [APIResponse, setResponse] = useState("");

    useEffect(() => {
        const category = new URLSearchParams(window.location.search).get("category");
        const command_name = new URLSearchParams(window.location.search).get("command_name");

        if (!category && !command_name) {
            fetch("https://rt.neody.land/api/help/get")
                .then((response) => response.json())
                .then((data) => {
                    setResponse(data);
                });
        }
    }, []);

    return (
        <div className="relative">
            {APIResponse}
        </div>
    );
};

export default APIResponseComponent;