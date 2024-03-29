import React from "react";

// Component declaration using destructuring to extract 'facts' prop
const Facts = ({ facts }) => {
    return Object.keys(facts).map((key) => {
        // Check if the current category of facts has any items
        return facts[key]?.length
            ? facts[key].map((fact) => {
                  return (
                    // Rendering each fact as a list item
                      <li
                          style={{
                              padding: 5,
                          }}
                      >
                          <span
                              style={{
                                  background:
                                      key === "oldFacts"
                                          ? "red"
                                          : key === "newFacts"
                                          ? "greenyellow"
                                          : "none",
                              }}
                          >
                              {key === "oldFacts" ? <s>{fact}</s> : fact}
                          </span>
                      </li>
                  );
              })
            // If there are no facts in the current category, render nothing
            : null;
    });
};

export default Facts;