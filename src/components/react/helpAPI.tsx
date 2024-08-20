import React, { useState, useEffect } from "react";
import { Card, Heading, Flex, Center } from "@neodyland/ui";
import { Button } from "./shadcn/button";
import { CgSpinnerTwo } from "react-icons/cg";
import { IoMdArrowRoundBack } from "react-icons/io";
import Markdown from 'marked-react';

const APIResponseComponent = () => {
    const [APIResponse, setResponse] = useState<string>("");
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

        setCategory(category);
        setCommand(command_name);

        if (!category && !command_name) {
            fetch("/api/help/get")
                .then((response) => response.json())
                .then((data) => {
                    setResponse(data);
                });
        }

        if (category && !command_name) {
            fetch(
                `/api/help/get/${category}`,
            )
                .then((response) => response.json())
                .then((data) => {
                    setResponse(data);
                });
        }

        if (command_name) {
            fetch(
                `/api/help/get/${category}/${command_name}`,
            )
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
    }

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
                <Heading size="6xl" className="text-center mt-10">
                    RT Help
                </Heading>
                <Card className="mt-5">
                    <Flex direction="row" className="justify-center">
                        <CgSpinnerTwo size={100} className="animate-spin" />
                    </Flex>
                </Card>
            </div>
        );
    }
    if (!commandVar && !categoryVar) {
        return (
            <div className="relative">
                <Heading size="6xl" className="text-center mt-10">
                    RT Help
                </Heading>
                <Card className="mt-10">
                    <Flex direction="row" className="justify-center">
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
                    </Flex>
                </Card>
            </div>
        );
    }
    if (categoryVar && !commandVar) {
        return (
            <div className="relative">
                <Heading size="6xl" className="text-center mt-10">
                    RT Help
                </Heading>
                <Card className="mt-10">
                    <Center>
                        <Button
                            className="text-center bg-red-500 hover:bg-red-300 text-white mb-2"
                            onClick={() => returnToTop()}
                        >
                            <IoMdArrowRoundBack size={20} /> 戻る
                        </Button>
                    </Center>
                    <Flex direction="col" className="justify-center">
                        {APIResponse?.data &&
                            Object.keys(APIResponse.data).map((key) => (
                                <Card className="mt-2 mb-2" key={key}>
                                    <Flex
                                        direction="row"
                                        className="justify-left"
                                    >
                                        <Button
                                            onClick={() =>
                                                handleCommandClick(key)
                                            }
                                            className="bg-black text-white hover:bg-gray-700 font-bold"
                                        >
                                            /{key}
                                        </Button>
                                        <Heading size="xl" className="mt-1">
                                            {APIResponse.data[key].ja}
                                        </Heading>
                                    </Flex>
                                </Card>
                            ))}
                    </Flex>
                </Card>
            </div>
        );
    }
    if (!categoryVar && commandVar) {
        return (
            <div className="relative">
                <Heading size="6xl" className="text-center mt-10">
                    RT Help
                </Heading>
                <Card className="mt-10">
                    <Flex direction="row" className="justify-center">
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
                    </Flex>
                </Card>
            </div>
        );
    }
    if (commandVar && categoryVar) {
        return (
            <div className="relative">
                <Heading size="6xl" className="text-center mt-10">
                    RT Help
                </Heading>
                <Card className="mt-10">
                    <Center>
                        <Button
                            className="text-center bg-red-500 hover:bg-red-300 text-white mb-2"
                            onClick={() => returnToCategory()}
                        >
                            <IoMdArrowRoundBack size={20} /> 戻る
                        </Button>
                    </Center>
                    <Markdown className="mt-5">{APIResponse.data.ja}</Markdown>
                </Card>
            </div>
        );
    }
};

export default APIResponseComponent;
