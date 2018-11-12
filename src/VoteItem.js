import React from 'react';
import {withStyles} from "@material-ui/core/styles/index";

const styles = {
  dropped: {
      webkitFilter: "grayscale(100%)",
      filter: "grayscale(100%)",
      height:"350px",
      width:"350px",
      marginBottom: "10px"
  },
  image: {
      height:"350px",
      width:"350px",
      marginBottom: "10px"
  }
};

class VoteItem extends React.Component {
    constructor(){
        super();
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    handleItemClick() {
        this.props.onClick(this.props.item)
    }

    render() {
        return (
            <img onClick={this.props.canVote && !this.props.dropped? this.handleItemClick : undefined}  src={this.props.item.imgUrl} alt={this.props.item.name}
            className={this.props.dropped ? this.props.classes.dropped : this.props.classes.image}/>
        );
    }
}

export default withStyles(styles)(VoteItem)