import React from "react";

const styles = {
    footer : {
        display: "flex",
        justifyContent: "center",
        alignItems:"center",
        margin: "10px 0"
    }
};

export default class Footer extends React.Component {

    render() {
        return(
        <div className="footer" style={styles.footer}>
            <p>&copy; {new Date().getFullYear()} Piotr Zygmunt</p>
        </div>
    )
    }
}