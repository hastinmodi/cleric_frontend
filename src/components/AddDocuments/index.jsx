import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    FormControlLabel,
    FormGroup,
    Grid,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import React, { useState } from "react";
import NavBar from "../NavBar";
import {
    classifyFacts,
    submitApprovals,
    submitQuestionAndDocuments,
} from "../../apis";
import ClassifiedFacts from "./ClassifiedFacts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddDocuments = () => {
    // State hooks to manage form inputs and various statuses
    const [documents, setDocuments] = useState(""); // Stores user-entered document URLs
    const [question, setQuestion] = useState(""); // Stores user-entered question
    const [autoApprove, setAutoApprove] = useState(false); // Toggles auto-approval of classified facts
    const [approveAll, setApproveAll] = useState(false); // Toggles approval of all classified facts
    const [isLoading, setIsLoading] = useState(false); // Indicates loading state for document submission
    const [isFetchingClassifiedFacts, setIsFetchingClassifiedFacts] =
        useState(false); // Indicates fetching state for classified facts
    const [classifiedFacts, setClassifiedFacts] = useState({}); // Stores fetched classified facts
    // States for storing user approvals
    const [approvedAdd, setApprovedAdd] = useState({});
    const [approvedRemove, setApprovedRemove] = useState({});
    const [approvedModify, setApprovedModify] = useState({});

    // Handler for changes in form inputs
    const handleChange = (event) => {
        if (event.target.id === "documents") {
            setDocuments(event.target.value);
        } else if (event.target.id === "questions") {
            setQuestion(event.target.value);
        }
    };

    // Handler for toggling 'Approve All' switch
    const hanldeApproveAll = (e) => {
        setApproveAll(e.target.checked);
        // If approving all, iterate over classified facts and mark them as approved
        if (e.target.checked) {
            let tempAdd = {};
            let tempModify = {};
            let tempRemove = {};
            // Classify each fact under add, modify, or remove based on user selection
            Object.keys(classifiedFacts).forEach((date) => {
                // Handling addition of facts
                for (let fact of classifiedFacts[date].classified_facts_add) {
                    if (tempAdd[date] && tempAdd[date].length) {
                        tempAdd[date].push(fact);
                    } else {
                        tempAdd[date] = [fact];
                    }
                }

                // Handling removal of facts
                for (let fact of classifiedFacts[date]
                    .classified_facts_remove) {
                    if (tempRemove[date] && tempRemove[date].length) {
                        tempRemove[date].push(fact);
                    } else {
                        tempRemove[date] = [fact];
                    }
                }

                // Handling modification of facts
                for (let fact of classifiedFacts[date]
                    .classified_facts_modify) {
                    if (tempModify[date] && tempModify[date].length) {
                        tempModify[date].push(fact);
                    } else {
                        tempModify[date] = [fact];
                    }
                }
            });
            // Update the approved facts states
            setApprovedAdd(tempAdd);
            setApprovedRemove(tempRemove);
            setApprovedModify(tempModify);
        } else {
            // Clear approvals if 'Approve All' is toggled off
            setApprovedAdd({});
            setApprovedRemove({});
            setApprovedModify({});
        }
    };

    // Handler for submitting approvals
    const handleSubmitApprovals = async () => {
        await submitApprovals({ approvedAdd, approvedRemove, approvedModify });
    };

    return (
        <div style={{ height: "100vh" }}>
            <ToastContainer />
            <NavBar page="add-documents" />
            <Grid
                container
                spacing={2}
                style={{
                    margin: 0,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Grid item xs></Grid>
                <Grid
                    xsOffset
                    xs={6}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "80vw",
                    }}
                >
                    <h1>Add New Document</h1>
                    <h2>Add Transcript URLs</h2>
                    <TextField
                        id="documents"
                        placeholder="Enter comma-separated urls"
                        multiline
                        rows={5}
                        style={{ width: "100%" }}
                        onChange={handleChange}
                    />
                    <h2>Question</h2>
                    <TextField
                        id="questions"
                        variant="outlined"
                        placeholder="Enter Question to extract information"
                        onChange={handleChange}
                    />
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <FormGroup>
                            <FormControlLabel
                                id="autoApprove"
                                control={
                                    <Switch
                                        id="autoApproveSwitch"
                                        onChange={(e) =>
                                            setAutoApprove(e.target.checked)
                                        }
                                        checked={autoApprove}
                                    />
                                }
                                label="Auto Approve"
                            />
                        </FormGroup>
                        <LoadingButton
                            variant="contained"
                            style={{
                                padding: 10,
                                margin: "20px 0px",
                                width: 100,
                            }}
                            onClick={() => {
                                setClassifiedFacts({});
                                submitQuestionAndDocuments(
                                    documents,
                                    question,
                                    autoApprove,
                                    setIsLoading
                                );
                            }}
                            loading={isLoading}
                            disabled={!documents || !question}
                        >
                            Upload
                        </LoadingButton>
                    </div>
                    {!autoApprove && (
                        <LoadingButton
                            variant="contained"
                            style={{ padding: 10, margin: "20px 0px" }}
                            onClick={async () => {
                                setIsFetchingClassifiedFacts(true);
                                classifyFacts(
                                    setClassifiedFacts,
                                    setIsFetchingClassifiedFacts
                                ).then((data) => {
                                    if (data.status === "done") {
                                        setClassifiedFacts(data);
                                        setIsFetchingClassifiedFacts(false);
                                    }
                                });
                            }}
                            loading={isFetchingClassifiedFacts}
                        >
                            Fetch Suggestions
                        </LoadingButton>
                    )}

                    {Object.keys(classifiedFacts).map((date) => {
                        return (
                            <Accordion key={date}>
                                <AccordionSummary
                                    expandIcon={<ArrowDropDownIcon />}
                                    aria-controls="panel2-content"
                                    id="panel2-header"
                                >
                                    <Typography>{date}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {classifiedFacts[date].classified_facts_add
                                        .length > 0 && (
                                        <ClassifiedFacts
                                            title="Facts Added"
                                            factsList={
                                                classifiedFacts[date]
                                                    .classified_facts_add
                                            }
                                            idLabel="__add__"
                                            date={date}
                                            approveAll={approveAll}
                                            approved={approvedAdd}
                                            setApproved={setApprovedAdd}
                                        />
                                    )}

                                    {classifiedFacts[date]
                                        .classified_facts_modify.length > 0 && (
                                        <ClassifiedFacts
                                            title="Facts Modified"
                                            factsList={
                                                classifiedFacts[date]
                                                    .classified_facts_modify
                                            }
                                            idLabel="__modify__"
                                            date={date}
                                            approveAll={approveAll}
                                            approved={approvedModify}
                                            setApproved={setApprovedModify}
                                        />
                                    )}

                                    {classifiedFacts[date]
                                        .classified_facts_remove.length > 0 && (
                                        <ClassifiedFacts
                                            title="Facts Removed"
                                            factsList={
                                                classifiedFacts[date]
                                                    .classified_facts_remove
                                            }
                                            idLabel="__remove__"
                                            date={date}
                                            approveAll={approveAll}
                                            approved={approvedRemove}
                                            setApproved={setApprovedRemove}
                                        />
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                    {Object.keys(classifiedFacts).length ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <FormGroup>
                                <FormControlLabel
                                    id="approveAll"
                                    control={
                                        <Switch
                                            id="approveAllSwitch"
                                            onChange={hanldeApproveAll}
                                            checked={approveAll}
                                        />
                                    }
                                    label="Approve All"
                                />
                            </FormGroup>
                            <LoadingButton
                                variant="contained"
                                style={{ padding: 10, margin: "20px 0px" }}
                                onClick={handleSubmitApprovals}
                                loading={isFetchingClassifiedFacts}
                            >
                                Submit Approvals
                            </LoadingButton>
                        </div>
                    ) : null}
                </Grid>
                <Grid item xs></Grid>
            </Grid>
        </div>
    );
};

export default AddDocuments;