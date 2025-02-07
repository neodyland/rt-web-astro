import React, { useState, useEffect } from "react";
import { Button } from "./shadcn/button";
import { CgSpinnerTwo } from "react-icons/cg";
import { IoMdArrowRoundBack } from "react-icons/io";
import Markdown from "marked-react";

const APIResponseComponent = () => {
    const [APIResponse, setResponse] = useState<any>("");
    const [commandVar, setCommand] = useState<string>("");
    const [categoryVar, setCategory] = useState<string>("");

    const fetchData = () => {
        setResponse("");
        const category = new URLSearchParams(window.location.search).get(
            "category",
        );
        const command_name = new URLSearchParams(window.location.search).get(
            "command_name",
        );

        setCategory(category || "");
        setCommand(command_name || "");

        if (!category && !command_name) {
            fetch("/api/help/get")
                .then((response) => response.json())
                .then((data) => {
                    setResponse(data);
                });
        }

        if (category && !command_name) {
            fetch(`/api/help/get/${category}`)
                .then((response) => response.json())
                .then((data) => {
                    setResponse(data);
                });
        }

        if (command_name) {
            fetch(`/api/help/get/${category}/${command_name}`)
                .then((response) => response.json())
                .then((data) => {
                    setResponse(data);
                });
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        fetchData();

        const handlePopState = () => {
            fetchData();
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    const handleButtonClick = (category: string) => {
        setResponse("");
        const url = new URL(window.location.href);
        url.searchParams.set("category", category);
        window.history.pushState({}, "", url);
        fetchData();
    };

    const handleCommandClick = (command: string) => {
        setResponse("");
        const url = new URL(window.location.href);
        url.searchParams.set("command_name", command);
        window.history.pushState({}, "", url);
        fetchData();
    };

    const returnToTop = () => {
        setResponse("");
        const url = new URL(window.location.href);
        url.search = "";
        window.history.pushState({}, "", url);
        fetchData();
    };

    const returnToCategory = () => {
        setResponse("");
        const url = new URL(window.location.href);
        url.searchParams.delete("command_name");
        window.history.pushState({}, "", url);
        fetchData();
    };

    if (!APIResponse) {
        return (
            <div className="relative">
                <h1 className="text-6xl font-bold text-center mt-10">
                    RT Help
                </h1>
                <div className="mt-5 bg-white rounded-lg shadow p-4">
                    <div className="flex flex-row justify-center">
                        <CgSpinnerTwo size={100} className="animate-spin" />
                    </div>
                </div>
            </div>
        );
    }
    if (!commandVar && !categoryVar) {
        return (
            <div className="relative">
                <h1 className="text-6xl font-bold text-center mt-10">
                    RT Help
                </h1>
                <div className="mt-10 bg-white rounded-lg shadow p-4">
                    <div className="flex flex-row justify-center">
                        {APIResponse?.data &&
                            Object.keys(APIResponse.data).map((key) => (
                                <Button
                                    key={key}
                                    onClick={() => handleButtonClick(key)}
                                    className="bg-black text-white hover:bg-gray-700 font-bold"
                                >
                                    {APIResponse.data[key].ja}
                                </Button>
                            ))}
                    </div>
                </div>
            </div>
        );
    }
    if (categoryVar && !commandVar) {
        return (
            <div className="relative">
                <h1 className="text-6xl font-bold text-center mt-10">
                    RT Help
                </h1>
                <div className="mt-10 bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-center">
                        <Button
                            className="text-center bg-red-500 hover:bg-red-300 text-white mb-2"
                            onClick={() => returnToTop()}
                        >
                            <IoMdArrowRoundBack size={20} /> 戻る
                        </Button>
                    </div>
                    <div className="flex flex-col justify-center">
                        {APIResponse?.data &&
                            Object.keys(APIResponse.data).map((key) => (
                                <div
                                    className="mt-2 mb-2 bg-white rounded-lg shadow p-4"
                                    key={key}
                                >
                                    <div className="flex flex-row justify-left">
                                        <Button
                                            onClick={() =>
                                                handleCommandClick(key)
                                            }
                                            className="bg-black text-white hover:bg-gray-700 font-bold"
                                        >
                                            /{key}
                                        </Button>
                                        <h2 className="text-xl font-bold mt-1">
                                            {APIResponse.data[key].ja}
                                        </h2>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        );
    }
    if (!categoryVar && commandVar) {
        return (
            <div className="relative">
                <h1 className="text-6xl font-bold text-center mt-10">
                    RT Help
                </h1>
                <div className="mt-10 bg-white rounded-lg shadow p-4">
                    <div className="flex flex-row justify-center">
                        {APIResponse?.data &&
                            Object.keys(APIResponse.data).map((key) => (
                                <Button
                                    key={key}
                                    onClick={() => handleButtonClick(key)}
                                    className="bg-black text-white hover:bg-gray-700 font-bold"
                                >
                                    {APIResponse.data[key].ja}
                                </Button>
                            ))}
                    </div>
                </div>
            </div>
        );
    }
    if (commandVar && categoryVar) {
        return (
            <div className="relative">
                <h1 className="text-6xl font-bold text-center mt-10">
                    RT Help
                </h1>
                <div className="mt-10 bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-center">
                        <Button
                            className="text-center bg-red-500 hover:bg-red-300 text-white mb-2"
                            onClick={() => returnToCategory()}
                        >
                            <IoMdArrowRoundBack size={20} /> 戻る
                        </Button>
                    </div>
                    <div className={"mt-5"}>
                        <Markdown>{APIResponse.data.ja}</Markdown>
                    </div>
                </div>
            </div>
        );
    }
};

export default APIResponseComponent;
