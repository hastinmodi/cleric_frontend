import {
    Checkbox,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import React from "react";

const ClassifiedFacts = ({
    title,
    factsList,
    idLabel,
    date,
    approveAll,
    approved,
    setApproved,
}) => {
    // Handler for checkbox state change
    const handleChecked = (e, value, key) => {
        let temp = approved;
        if (e.target.checked) {
            // If item is checked, add it to the 'approved' state
            if (temp[date] && temp[date].length) {
                temp[date].push(value);
            } else {
                temp[date] = [value];
            }
            setApproved(temp);
        } else {
            // If item is unchecked, remove it from the 'approved' state
            if (approved[date] && approved[date].length) {
                temp[date] = approved[date].filter((val) => val !== value);
                setApproved(temp);
            }
        }
    };
    return (
        <>
            <h2>{title}</h2>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                {factsList.map((value, idx) => {
                    const labelId = `checkbox-list-label-${
                        date + idLabel + idx
                    }`;

                    return (
                        <ListItem
                            key={date + idLabel + idx}
                            secondaryAction={
                                <IconButton edge="end" aria-label="comments">
                                    {/* <CommentIcon /> */}
                                </IconButton>
                            }
                            disablePadding
                        >
                            <ListItemButton
                                role={undefined}
                                dense
                                disableRipple
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        tabIndex={-1}
                                        disableRipple
                                        disabled={approveAll}
                                        inputProps={{
                                            "aria-labelledby": labelId,
                                        }}
                                        onChange={(e) =>
                                            handleChecked(
                                                e,
                                                value
                                            )
                                        }
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    id={labelId}
                                    primary={`${value}`}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </>
    );
};

export default ClassifiedFacts;