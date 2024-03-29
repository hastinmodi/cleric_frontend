import axios from "axios";
import { toast } from "react-toastify";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// Function to retrieve questions and their corresponding facts from the server
export const getQuestionAndFacts = async () => {
    return axios
        .get(`${SERVER_URL}/get_question_and_facts`)
        .then((res) => {
            let facts = [],
                marks = [],
                removedFacts = [];
            if (res.status === 200) {
                let i = 0;
                // Iterate through each day's facts, collecting them along with their dates and any removed facts
                for (let key of Object.keys(res.data.facts.facts_by_day)) {
                    facts.push(
                        res.data.facts.all_facts[key]
                            ? res.data.facts.all_facts[key]
                            : []
                    );
                    // For marking the timeline slider
                    marks.push({
                        value: i,
                        label: key,
                    });
                    removedFacts.push(
                        res.data.facts.remove_24[key]
                            ? res.data.facts.remove_24[key]
                            : []
                    );
                    i++;
                }
                // Return an object with the question, facts, their marks, and any removed facts
                return {
                    question: res.data.question,
                    facts,
                    status: "done",
                    marks,
                    removedFacts,
                };
            // If the request was not successful, return an empty/default state
            } else {
                return {
                    question: "",
                    facts,
                    status: "done",
                    marks,
                    removedFacts,
                };
            }
        })
        // Handle any errors that occur during the request
        .catch((err) => {
            console.log(err);
            return {
                question: "",
                facts: [],
                status: "done",
                marks: [],
                removed_facts: [],
            };
        });
};

// Function to submit a question and associated documents for processing
export const submitQuestionAndDocuments = async (
    documents,
    question,
    autoApprove,
    setIsLoading
) => {
    // Indicate that the process is loading
    setIsLoading(true);
    return axios
        .post(`${SERVER_URL}/submit_question_and_documents`, {
            documents,
            question,
            autoApprove,
        })
        // Handle successful request
        .then((res) => {
            setIsLoading(false);
            toast.success("Uploaded successfully!", {
                position: "top-right",
                autoClose: 2000,
            });
            return res.data;
        })
        // Handle any errors
        .catch((err) => {
            setIsLoading(false);
            toast.error("Some error occured", {
                position: "top-right",
                autoClose: 2000,
            });
            return {
                question: "",
                factsByDay: [],
                status: "done",
            };
        });
};

// Function to classify facts, used for processing and organizing the data received
export const classifyFacts = async (
    setClassifiedFacts,
    setIsFetchingClassifiedFacts
) => {
    // Perform a GET request to the server to fetch classified facts
    return axios
        .get(`${SERVER_URL}/get_classified_facts`)
        .then((res) => {
            // Check if the response status is 200, indicating success
            if (res.status === 200) {
                let classifiedFacts = {};
                let classifiedFactsRes = res.data.classified_facts;
                // Iterate over the keys (dates) in the added facts section
                Object.keys(classifiedFactsRes.classified_facts_add).forEach(
                    (date) => {
                        // Ensure each date key exists in the classifiedFacts object
                        if (!(date in classifiedFacts)) {
                            classifiedFacts[date] = {
                                classified_facts_add: [],
                                classified_facts_modify: [],
                                classified_facts_remove: [],
                            };
                        }
                        classifiedFacts[date].classified_facts_add =
                            classifiedFactsRes.classified_facts_add[date];
                    }
                );

                // Iterate over the keys (dates) in the modified facts section
                Object.keys(classifiedFactsRes.classified_facts_modify).forEach(
                    (date) => {
                        // Ensure each date key exists in the classifiedFacts object
                        if (!(date in classifiedFacts)) {
                            classifiedFacts[date] = {
                                classified_facts_add: [],
                                classified_facts_modify: [],
                                classified_facts_remove: [],
                            };
                        }
                        classifiedFacts[date].classified_facts_modify =
                            classifiedFactsRes.classified_facts_modify[date];
                    }
                );

                // Iterate over the keys (dates) in the removed facts section
                Object.keys(classifiedFactsRes.classified_facts_remove).forEach(
                    (date) => {
                        // Ensure each date key exists in the classifiedFacts object
                        if (!(date in classifiedFacts)) {
                            classifiedFacts[date] = {
                                classified_facts_add: [],
                                classified_facts_modify: [],
                                classified_facts_remove: [],
                            };
                        }
                        classifiedFacts[date].classified_facts_remove =
                            classifiedFactsRes.classified_facts_remove[date];
                    }
                );
                // Update the state with the newly classified facts
                setClassifiedFacts(classifiedFacts);
                // Indicate that fetching classified facts has completed
                setIsFetchingClassifiedFacts(false);
                return { status: "done", classifiedFacts };
            } else if (res.status === 202) {
                // Retry fetching the classified facts after a delay
                return setTimeout(
                    classifyFacts,
                    5000,
                    setClassifiedFacts,
                    setIsFetchingClassifiedFacts
                );
            }
        })
        // Handle any errors that occur during the request
        .catch((err) => {
            console.log(err);
            toast.error("Some error occured", {
                position: "top-right",
                autoClose: 2000,
            });
            return {
                classifiedFacts: [],
                status: "done",
            };
        });
};

// Function to submit approvals for added, modified, or removed facts
export const submitApprovals = async (data) => {
    return axios
        .post(`${SERVER_URL}/submit_approvals`, {
            add_facts_approved: data.approvedAdd,
            modify_facts_approved: data.approvedModify,
            remove_facts_approved: data.approvedRemove,
        })
        .then((res) => {
            toast.success("Submitted successfully!", {
                position: "top-right",
                autoClose: 2000,
            });
        })
        .catch((err) => {
            toast.error("Some error occured", {
                position: "top-right",
                autoClose: 2000,
            });
        });
};