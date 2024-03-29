import React, { useEffect, useState } from "react";
import { Grid, Slider } from "@mui/material";
import NavBar from "../NavBar";
import { getQuestionAndFacts } from "../../apis";
import Facts from "./Facts";

const QuestionAnswer = () => {
    // State hooks for storing question, facts, and UI controls
    const [question, setQuestion] = useState(""); // Stores the main question
    const [facts, setFacts] = useState([]); // Stores all facts as an array
    const [structuredFacts, setStructuredFacts] = useState({}); // Structured facts for display
    const [marks, setMarks] = useState([]); // Slider marks for the timeline
    const [removedFacts, setRemovedFacts] = useState([]); // Stores facts that were removed at each point in the timeline

    // Fetch and set question and facts on component mount
    useEffect(() => {
        getQuestionAndFacts().then((data) => {
            setQuestion(data.question);
            setFacts(data.facts);
            setMarks(data.marks);
            setRemovedFacts(data.removedFacts);
            filterFacts(0, data.facts);
        });
        // eslint-disable-next-line
    }, []);

    // Handles changes to the slider, filtering facts based on the selected timeline point
    const handleSliderChange = (e) => {
        const idx = parseInt(e.target.value);
        filterFacts(idx, facts);
    };

    // Filters facts based on the current index and updates structuredFacts state
    const filterFacts = (idx, currFacts) => {
        if (idx > 0) {
            let a = currFacts[idx],
                b = currFacts[idx - 1];

            let newFacts = a.filter((i) => b.indexOf(i) === -1); // Facts that are new to the current period
            let existingFacts = a.filter((i) => b.indexOf(i) !== -1); // Facts that existed in both periods

            let temp = {};
            temp.oldFacts = removedFacts[idx];
            if (existingFacts && existingFacts.length) {
                temp.existingFacts = existingFacts;
            }
            if (newFacts && newFacts.length) {
                temp.newFacts = newFacts;
            }

            // Update the state with the structured facts
            setStructuredFacts(temp);
        } else {
            setStructuredFacts({ existingFacts: currFacts[idx] });
        }
    };

    return (
        <div style={{ height: "100vh" }}>
            <NavBar page="" />
            <Grid container spacing={2} style={{ margin: 0, width: "100%" }}>
                <Grid item xs></Grid>
                <Grid
                    xsOffset
                    xs={6}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        // alignItems: "center",
                    }}
                >
                    <h1>Question and Facts</h1>
                    {question ? (
                        <>
                            <h2>Question</h2>
                            <span>{question}</span>
                            <h2>Timeline</h2>
                            <div
                                style={{
                                    width: "100%",
                                    padding: "15px 20px 20px",
                                }}
                            >
                                <Slider
                                    marks={marks}
                                    aria-label="Dates"
                                    defaultValue={0}
                                    shiftStep={1}
                                    step={1}
                                    min={0}
                                    max={facts?.length ? facts.length - 1 : 0}
                                    onChange={handleSliderChange}
                                />
                            </div>
                            <div>
                                <h2>Facts</h2>
                                {facts?.length ? (
                                    <div>
                                        <Facts facts={structuredFacts} />
                                    </div>
                                ) : (
                                    <span>No facts extracted</span>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <span>No question and documents processed</span>
                        </>
                    )}
                </Grid>
                <Grid item xs></Grid>
            </Grid>
        </div>
    );
};

export default QuestionAnswer;