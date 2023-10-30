import {Row, Col, Button} from 'react-bootstrap';
function DefaultLayout(){
    return (<>
        <Col>

        </Col>
        <Col>
            <Row> <Button variant="primary">Primary</Button>{' '}</Row>{/*ale's component on click?*/}
            <Row> <Button variant="primary">Primary</Button>{' '}</Row> {/*here I call ale's component here I call ale's component on click?*/}
            <Row> <Button variant="primary">Primary</Button>{' '}</Row> {/*here I call on click?*/}
        </Col>
        </>
    )
}
export default DefaultLayout;