import React from "react";

function VendangesPage() {
    return (
        <>
            <div>VendangesPage</div>
            {/*  get back */}
            <button
                onClick={() => {
                    window.history.back();
                }}
            >
                Get Back
            </button>
        </>
    );
}

export default VendangesPage;
