import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Image from 'react-bootstrap/lib/Image'
import notFoundImage from './BP_Mar_404_Main.jpg'

const style = {
    marginTop: "20px"
}

export default class NotFound extends React.Component {

    render() {
        return (
        <Row style={style}>
            <Col sm={6} smOffset={3}>
                <Image responsive src={notFoundImage} alt={"404. Not Found."}/>
            </Col>
        </Row>
            )
    }
}