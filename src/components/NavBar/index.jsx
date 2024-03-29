import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from "react";

// NavBar component definition with destructured 'page' prop
const NavBar = ({ page }) => {
    const navigate = useNavigate();

    // Function to handle click events on the navigation button, toggling between the main page and the add-document page
    const handleClick = () =>
        navigate(page === "add-documents" ? "/" : "add-documents");

    // Component render method
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Call Logs Analyzer
                </Typography>
                <Button
                    disableRipple
                    color="inherit"
                    variant="text"
                    style={{ background: "none" }}
                    onClick={handleClick}
                >
                    {page === "add-documents"
                        ? "Questions and Facts"
                        : "Add Document"}
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;